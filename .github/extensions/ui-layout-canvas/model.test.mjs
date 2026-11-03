import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { request } from "node:http";
import os from "node:os";
import path from "node:path";
import { blankLayout, rect, toSvg, validateLayout, warnings, MAX_DOCUMENT_BYTES, MAX_REQUEST_BYTES } from "./model.mjs";
import { createController } from "./controller.mjs";
import { startServer } from "./server.mjs";
import { splitJson } from "../test-http.mjs";

function region(overrides = {}) {
    return { id: "one", label: "One", kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 1, anchorY: 1, x: -110, y: -60, width: 100, height: 50, stretchY: false, bottom: 0, ...overrides };
}

test("anchors and stretch respond to viewport changes", () => {
    assert.deepEqual(rect(region(), { width: 400, height: 300 }), { x: 290, y: 240, width: 100, height: 50 });
    assert.deepEqual(rect(region({ anchorX: 0, anchorY: 0, x: 24, y: 24, stretchY: true, bottom: 24 }), { width: 400, height: 300 }), { x: 24, y: 24, width: 100, height: 252 });
});

test("warnings distinguish touching, overlap, and out-of-bounds", () => {
    const layout = blankLayout();
    layout.viewport = { width: 200, height: 100 };
    layout.regions = [region({ anchorX: 0, anchorY: 0, x: 0, y: 0 }), region({ id: "two", anchorX: 0, anchorY: 0, x: 100, y: 0 })];
    assert.deepEqual(warnings(layout), []);
    layout.regions[1].x = 99;
    assert.match(warnings(layout).join(" "), /overlaps/);
    layout.regions[1].x = 101;
    assert.match(warnings(layout).join(" "), /outside/);
});

test("validation rejects corrupt formats, duplicate ids and invalid anchors", () => {
    const layout = blankLayout();
    assert.throws(() => validateLayout({ ...layout, version: 2 }), /format or version/);
    layout.regions = [region(), region()];
    assert.throws(() => validateLayout(layout), /unique/);
    layout.regions = [region({ anchorY: 1, stretchY: true })];
    assert.throws(() => validateLayout(layout), /top anchor/);
});

test("SVG escapes text and uses resolved geometry", () => {
    const layout = blankLayout();
    layout.regions.push(region({ label: '<script>&"' }));
    const svg = toSvg(layout);
    assert.match(svg, /&lt;script&gt;&amp;&quot;/);
    assert.doesNotMatch(svg, /<script>/);
    assert.match(svg, /x="1170" y="660"/);
});

test("controller saves alternatives, rejects conflicts, reopens and exports", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ui-layout-test-"));
    try {
        const file = path.join(dir, "original.json");
        const original = blankLayout();
        await writeFile(file, JSON.stringify(original));
        const controller = await createController(file);
        const first = await controller.dispatch("get_state");
        const edited = structuredClone(first.layout);
        edited.name = "Alternative";
        const changed = await controller.dispatch("replace_layout", { revision: first.revision, layout: edited });
        await assert.rejects(controller.dispatch("replace_layout", { revision: first.revision, layout: edited }), /changed since/);
        await assert.rejects(controller.dispatch("open_layout", { name: "original" }), /Save changes/);
        const saved = await controller.dispatch("save_as", { name: "alternative" });
        assert.equal(saved.dirty, false);
        assert.equal(JSON.parse(await readFile(file, "utf8")).name, original.name);
        await assert.rejects(controller.dispatch("save_as", { name: "original" }), /exist/i);
        const svg = await controller.dispatch("export_svg");
        assert.match(await readFile(svg.path, "utf8"), /Alternative/);
        const reopened = await controller.dispatch("open_layout", { name: "original" });
        assert.equal(reopened.layout.name, original.name);
        const revised = structuredClone(reopened.layout);
        revised.name = "Saved original";
        await controller.dispatch("replace_layout", { revision: reopened.revision, layout: revised });
        await controller.dispatch("save");
        assert.equal(JSON.parse(await readFile(file, "utf8")).name, "Saved original");
        await controller.dispatch("new_layout");
        await assert.rejects(controller.dispatch("save"), /save.*alternative/i);
        await assert.rejects(controller.dispatch("export_svg"), /save.*alternative/i);
        await controller.dispatch("open_layout", { name: "alternative", discard: true });
        await writeFile(saved.path, "external change");
        await assert.rejects(controller.dispatch("save"), /changed on disk/);
        assert.equal(changed.dirty, true);
    } finally { await rm(dir, { recursive: true, force: true }); }
});

test("loopback server serves canvas and rejects foreign origins", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ui-layout-http-"));
    let entry;
    try {
        const file = path.join(dir, "layout.json");
        await writeFile(file, JSON.stringify(blankLayout()));
        entry = await startServer(file);
        assert.equal((await fetch(entry.url)).status, 200);
        const state = await fetch(new URL("api/get_state", entry.url), { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
        assert.equal((await state.json()).layout.name, "Untitled layout");
        const layout = blankLayout();
        layout.name = "Café";
        const split = await splitJson(new URL("api/replace_layout", entry.url), { "content-type": "application/json" }, { revision: 0, layout });
        assert.equal(split.status, 200);
        assert.equal(JSON.parse(split.body).layout.name, "Café");
        const oversized = await fetch(new URL("api/get_state", entry.url), {
            method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: "é".repeat(MAX_REQUEST_BYTES / 2) })
        });
        assert.equal(oversized.status, 400);
        assert.match((await oversized.json()).error, /too large/);
        const forbidden = await fetch(new URL("api/get_state", entry.url), { method: "POST", headers: { "content-type": "application/json", origin: "https://example.com" }, body: "{}" });
        assert.equal(forbidden.status, 403);
    } finally {
        if (entry) { entry.server.closeAllConnections(); await new Promise(resolve => entry.server.close(resolve)); }
        await rm(dir, { recursive: true, force: true });
    }
});

test("maximum serialized layout survives HTTP edit, save and reopen", async t => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ui-layout-budget-"));
    const file = path.join(dir, "layout.json");
    const layout = blankLayout();
    layout.regions = Array.from({ length: 200 }, (_, i) => region({
        id: String(i), purpose: "\0".repeat(4000), information: "界".repeat(4000),
        interactions: "é".repeat(4000), questions: "\"".repeat(4000),
        anchorX: 0, anchorY: 0, x: i * 2, y: 0, width: 1, height: 1,
    }));
    layout.extra = "";
    layout.extra = "x".repeat(MAX_DOCUMENT_BYTES - Buffer.byteLength(JSON.stringify(layout)));
    assert.equal(Buffer.byteLength(JSON.stringify(layout)), MAX_DOCUMENT_BYTES);
    validateLayout(layout);
    layout.extra += "x";
    assert.throws(() => validateLayout(layout), /serialized document limit/);
    layout.extra = layout.extra.slice(0, -1);
    await writeFile(file, JSON.stringify(blankLayout()));
    const entry = await startServer(file);
    t.after(async () => {
        entry.server.closeAllConnections();
        await new Promise(resolve => entry.server.close(resolve));
        await rm(dir, { recursive: true, force: true });
    });
    const post = (action, body) => fetch(new URL(`api/${action}`, entry.url), {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
    });
    const replacement = await post("replace_layout", { revision: 0, layout });
    assert.equal(replacement.status, 200);
    await replacement.arrayBuffer();
    layout.extra += "x";
    const rejected = await post("replace_layout", { revision: 1, layout });
    assert.equal(rejected.status, 400);
    assert.match((await rejected.json()).error, /serialized document limit/);
    const saved = await post("save", {});
    assert.equal(saved.status, 200);
    await saved.arrayBuffer();
    const reopened = await createController(file);
    const result = await reopened.dispatch("get_state");
    assert.equal(result.layout.regions[0].purpose, "\0".repeat(4000));
    assert.equal(Buffer.byteLength(JSON.stringify(result.layout)), MAX_DOCUMENT_BYTES);
});

test("server handles simulated navigation and API request headers", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "ui-layout-boundary-"));
    let entry;
    try {
        const file = path.join(dir, "layout.json");
        await writeFile(file, JSON.stringify(blankLayout()));
        entry = await startServer(file);
        const origin = new URL(entry.url).origin;
        const send = (pathname, { method = "GET", headers = {}, body } = {}) => new Promise((resolve, reject) => {
            const req = request(new URL(pathname, entry.url), { method, headers }, res => {
                res.resume();
                res.on("end", () => resolve({ status: res.statusCode, headers: res.headers }));
            });
            req.on("error", reject);
            req.end(body);
        });
        const navigation = { "sec-fetch-mode": "navigate", "sec-fetch-dest": "iframe" };
        assert.equal((await send("/", { headers: { ...navigation, "sec-fetch-site": "cross-site" } })).status, 403);
        assert.equal((await send("/", { headers: { ...navigation, origin: "https://foreign.example" } })).status, 403);
        assert.equal((await send("/", { headers: { ...navigation, "sec-fetch-site": "none" } })).status, 200);
        // A loopback page on another port can navigate an iframe without Origin.
        const sameSite = await send("/", { headers: { ...navigation, "sec-fetch-site": "same-site" } });
        assert.equal(sameSite.status, 200);
        assert.match(sameSite.headers["content-security-policy"], /frame-ancestors 'none'/);
        assert.equal(sameSite.headers["x-frame-options"], undefined);
        assert.equal((await send("/", { headers: { ...navigation, "sec-fetch-site": "same-site", origin: "http://127.0.0.1:1" } })).status, 403);
        const noMetadata = await send("/");
        assert.equal(noMetadata.status, 200);
        assert.match(noMetadata.headers["content-security-policy"], /frame-ancestors 'none'/);
        assert.equal((await send("/", { headers: { "sec-fetch-mode": "navigate", "sec-fetch-dest": "document", "sec-fetch-site": "cross-site" } })).status, 403);
        assert.equal((await send("/ui.js", { headers: { "sec-fetch-site": "same-origin", "sec-fetch-dest": "script" } })).status, 200);
        assert.equal((await send("/ui.js", { headers: { "sec-fetch-site": "cross-site", "sec-fetch-dest": "script" } })).status, 403);
        assert.equal((await send("/", { headers: { host: `attacker.example:${new URL(entry.url).port}` } })).status, 403);

        const api = { method: "POST", headers: { "content-type": "application/json", origin, "sec-fetch-site": "same-origin" }, body: "{}" };
        const ok = await send("/api/get_state", api);
        assert.equal(ok.status, 200);
        assert.equal(ok.headers["access-control-allow-origin"], undefined);
        assert.equal((await send("/api/get_state", { ...api, headers: { ...api.headers, origin: "https://foreign.example" } })).status, 403);
        assert.equal((await send("/api/get_state", { ...api, headers: { ...api.headers, origin: "http://127.0.0.1:1", "sec-fetch-site": "same-site" } })).status, 403);
        assert.equal((await send("/api/get_state", { ...api, headers: { ...api.headers, "sec-fetch-site": "cross-site" } })).status, 403);
        assert.equal((await send("/api/get_state", { ...api, headers: { ...api.headers, host: `attacker.example:${new URL(entry.url).port}` } })).status, 403);
        assert.equal((await send("/api/get_state", { ...api, headers: { ...api.headers, "content-type": "text/plain" } })).status, 404);
        assert.equal((await send("/api/get_state", { method: "GET" })).status, 404);
        assert.equal((await send("/api/replace_layout", { method: "OPTIONS", headers: { origin: "https://foreign.example", "access-control-request-method": "POST", "access-control-request-headers": "content-type" } })).status, 403);
        const changed = blankLayout();
        changed.name = "Foreign change";
        const write = { ...api, body: JSON.stringify({ revision: 0, layout: changed }) };
        assert.equal((await send("/api/replace_layout", { ...write, headers: { ...write.headers, origin: "https://foreign.example" } })).status, 403);
        assert.equal((await send("/api/replace_layout", { ...write, headers: { ...write.headers, "sec-fetch-site": "cross-site" } })).status, 403);
        assert.equal((await entry.controller.dispatch("get_state")).layout.name, "Untitled layout");
    } finally {
        if (entry) { entry.server.closeAllConnections(); await new Promise(resolve => entry.server.close(resolve)); }
        await rm(dir, { recursive: true, force: true });
    }
});
