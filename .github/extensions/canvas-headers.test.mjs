import test from "node:test";
import assert from "node:assert/strict";
import { createServer, request } from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer as startScene, stopServer as stopScene } from "./godot-scene-canvas/server.mjs";
import { startPaletteServer } from "./palette-canvas/server.mjs";
import { startServer as startProcess } from "./process-sequence/server.mjs";
import { startServer as startLayout } from "./ui-layout-canvas/server.mjs";

async function servers(t) {
    const scene = await startScene({ getState: () => ({}) });
    t.after(() => stopScene(scene));
    const palette = await startPaletteServer({ path: "test", palette: {} });
    t.after(() => palette.close());
    const process = await startProcess({}, "test.json", "workspace");
    t.after(() => new Promise(resolve => { process.server.closeAllConnections(); process.server.close(resolve); }));
    const layout = await startLayout(fileURLToPath(new URL("../../data/ui-layouts/blank.json", import.meta.url)));
    t.after(() => new Promise(resolve => { layout.server.closeAllConnections(); layout.server.close(resolve); }));
    return [
        { name: "scene", url: scene.url, asset: "/ui.js", api: "/state", method: "GET" },
        { name: "palette", url: palette.result.url, asset: "/client.mjs", api: "/api/current", method: "GET" },
        { name: "process", url: process.url, asset: "/ui.mjs", api: "/api/config", method: "GET" },
        { name: "layout", url: layout.url, asset: "/ui.js", api: "/api/get_state", method: "POST" },
    ];
}

function send(url, path, options = {}) {
    return new Promise((resolve, reject) => {
        const req = request(new URL(path, url), options, res => {
            res.resume();
            res.on("end", () => resolve({ status: res.statusCode, headers: res.headers }));
        });
        req.on("error", reject);
        req.end(options.body);
    });
}

function assertDenyFraming(headers) {
    const csp = headers["content-security-policy"];
    assert.equal(typeof csp, "string");
    const directives = csp.split(";").map(value => value.trim().split(/\s+/));
    const framing = directives.filter(([name]) => name.toLowerCase() === "frame-ancestors");
    assert.deepEqual(framing, [["frame-ancestors", "'none'"]]);
}

test("all canvas servers deny framing on documents, assets, APIs, and errors", async t => {
    for (const canvas of await servers(t)) {
        await t.test(canvas.name, async () => {
            const html = await (await fetch(canvas.url)).text();
            const token = canvas.name === "palette" ? /name="palette-token" content="([^"]+)"/.exec(html)?.[1]
                : canvas.name === "process" ? /name="canvas-token" content="([^"]+)"/.exec(html)?.[1] : undefined;
            if (canvas.name === "palette" || canvas.name === "process") assert.ok(token);
            const auth = token ? { [canvas.name === "palette" ? "x-palette-token" : "x-canvas-token"]: token } : {};
            const requests = [
                ["/", {}, 200],
                ["/", { headers: { "sec-fetch-mode": "navigate", "sec-fetch-dest": "iframe", "sec-fetch-site": "same-site" } }, 200],
                [canvas.asset, {}, 200],
                [canvas.api, { method: canvas.method, headers: { "content-type": "application/json" }, body: canvas.method === "POST" ? "{}" : undefined }, canvas.name === "palette" || canvas.name === "process" ? 403 : 200],
                [canvas.api, { method: canvas.method, headers: { ...auth, "content-type": "application/json" }, body: canvas.method === "POST" ? "{}" : undefined }, 200],
                ["/", { headers: { host: "attacker.example" } }, 403],
                ["/missing", {}, canvas.name === "palette" || canvas.name === "process" ? 403 : 404],
                ["/missing", { headers: auth }, 404],
                [canvas.name === "scene" ? "/action" : canvas.name === "layout" ? "/api/get_state" : "/api/save",
                    { method: "POST", headers: { ...auth, origin: new URL(canvas.url).origin, "content-type": "application/json" }, body: "{" }, 400],
            ];
            for (const [path, options, status] of requests) {
                const response = await send(canvas.url, path, options);
                assert.equal(response.status, status, `${path} status`);
                assertDenyFraming(response.headers);
            }
        });
    }
});

test("Chromium blocks same-site iframes but loads each canvas top-level", {
    skip: !process.env.CANVAS_BROWSER && "Set CANVAS_BROWSER to a Chromium executable",
    timeout: 60000,
}, async t => {
    const canvases = await servers(t);
    const attacker = createServer((req, res) => {
        const target = new URL(req.url, "http://localhost").searchParams.get("target");
        res.writeHead(200, { "content-type": "text/html" });
        res.end(`<iframe src="${target}"></iframe>`);
    });
    await new Promise(resolve => attacker.listen(0, "127.0.0.1", resolve));
    t.after(() => new Promise(resolve => attacker.close(resolve)));

    const profile = await mkdtemp(path.join(tmpdir(), "canvas-browser-"));
    const browser = spawn(process.env.CANVAS_BROWSER, [
        "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
        "--no-first-run", "--no-default-browser-check", "about:blank",
    ], { stdio: ["ignore", "ignore", "pipe"] });
    t.after(async () => {
        if (browser.pid && browser.exitCode === null && browser.signalCode === null) {
            const exited = new Promise(resolve => browser.once("exit", resolve));
            if (browser.kill()) await exited;
        }
        await rm(profile, { recursive: true, force: true });
    });
    const endpoint = await new Promise((resolve, reject) => {
        let output = "";
        browser.stderr.on("data", chunk => {
            output += chunk;
            const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
            if (match) resolve(match[1]);
        });
        browser.once("error", reject);
        browser.once("exit", code => reject(new Error(`Chromium exited (${code}): ${output}`)));
    });
    const socket = new WebSocket(endpoint);
    await new Promise((resolve, reject) => {
        socket.addEventListener("open", resolve, { once: true });
        socket.addEventListener("error", reject, { once: true });
    });
    t.after(() => socket.close());
    let nextId = 0;
    const pending = new Map(), events = [];
    socket.addEventListener("message", event => {
        const message = JSON.parse(event.data);
        if (message.id) {
            const { resolve, reject } = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) reject(new Error(message.error.message));
            else resolve(message.result);
        } else events.push(message);
    });
    const command = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
    const { targetId } = await command("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await command("Target.attachToTarget", { targetId, flatten: true });
    for (const domain of ["Page", "Runtime", "Log", "Network"]) await command(`${domain}.enable`, {}, sessionId);
    const navigate = async url => {
        const start = events.length;
        const result = await command("Page.navigate", { url }, sessionId);
        assert.equal(result.errorText, undefined);
        for (let i = 0; i < 200; i++) {
            if (events.slice(start).some(event => event.method === "Page.loadEventFired")) return;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        assert.fail(`Timed out loading ${url}`);
    };

    for (const canvas of canvases) {
        await t.test(canvas.name, async () => {
            const start = events.length;
            const attackerUrl = `http://127.0.0.1:${attacker.address().port}/?target=${encodeURIComponent(canvas.url)}`;
            await navigate(attackerUrl);
            const recorded = events.slice(start);
            const iframeRequest = recorded.find(event => event.method === "Network.requestWillBeSent" &&
                event.params.request.url === canvas.url && event.params.type === "Document");
            assert.ok(iframeRequest, "iframe requested the canvas");
            const extra = recorded.find(event => event.method === "Network.requestWillBeSentExtraInfo" &&
                event.params.requestId === iframeRequest.params.requestId);
            assert.equal(extra?.params.headers["Sec-Fetch-Site"], "same-site");
            assert.ok(recorded.some(event => event.method === "Network.responseReceivedExtraInfo" &&
                event.params.requestId === iframeRequest.params.requestId && event.params.statusCode === 200), "server served the iframe request");
            assert.ok(recorded.some(event => event.method === "Log.entryAdded" &&
                /frame-ancestors/i.test(event.params.entry.text)), "browser reported CSP frame blocking");
            const tree = await command("Page.getFrameTree", {}, sessionId);
            assert.equal(tree.frameTree.childFrames?.length, 1);
            assert.notEqual(tree.frameTree.childFrames[0].frame.url, canvas.url, "iframe must not load the canvas document");

            const topStart = events.length;
            await navigate(canvas.url);
            assert.ok(events.slice(topStart).some(event => event.method === "Network.responseReceived" &&
                event.params.response.url === new URL(canvas.asset, canvas.url).href &&
                event.params.response.status === 200), "top-level canvas loaded its script");
            const value = await command("Runtime.evaluate", {
                expression: "({ url: location.href, ready: document.readyState, script: !!document.querySelector('script[src]') })",
                returnByValue: true,
            }, sessionId);
            assert.deepEqual(value.result.value, { url: canvas.url, ready: "complete", script: true });

            const sameOriginStart = events.length;
            await command("Runtime.evaluate", {
                expression: `new Promise(resolve => { const frame = document.createElement('iframe'); frame.onload = resolve; frame.src = ${JSON.stringify(canvas.url)}; document.body.append(frame); })`,
                awaitPromise: true,
            }, sessionId);
            assert.ok(events.slice(sameOriginStart).some(event => event.method === "Log.entryAdded" &&
                /frame-ancestors|frame-src|default-src/i.test(event.params.entry.text)), "browser also blocked same-origin framing");
            const sameOriginTree = await command("Page.getFrameTree", {}, sessionId);
            assert.notEqual(sameOriginTree.frameTree.childFrames?.[0]?.frame.url, canvas.url);
        });
    }
});
