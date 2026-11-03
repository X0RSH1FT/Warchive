import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { blankDocument, MAX_REQUEST_BYTES } from "./document.mjs";

const html = await readFile(new URL("./ui.html", import.meta.url), "utf8");
const client = await readFile(new URL("./ui.mjs", import.meta.url), "utf8");
const css = await readFile(new URL("./ui.css", import.meta.url), "utf8");
const view = await readFile(new URL("./view.mjs", import.meta.url), "utf8");

export async function startServer(store, initialFile, workspaceRoot) {
    const token = randomBytes(32).toString("hex");
    let currentFile = initialFile;
    let nextSelection = 0, acceptedSelection = 0;
    // Order successful selections by request arrival, not completion.
    const acceptSelection = (sequence, name) => {
        if (sequence > acceptedSelection) {
            acceptedSelection = sequence;
            currentFile = name;
        }
    };
    let host;
    const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };
    const server = createServer(async (req, res) => {
        const send = (status, type, body) => { res.writeHead(status, { ...headers, "Content-Type": type, "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" }); res.end(body); };
        try {
            if (req.headers.host !== host || (req.headers.origin && req.headers.origin !== `http://${host}`))
                return send(403, "text/plain", "Forbidden");
            const url = new URL(req.url, `http://${host}`);
            if (req.method === "GET" && url.pathname === "/") {
                return send(200, "text/html; charset=utf-8", html.replace("<!--CONFIG-->", `<meta name="canvas-token" content="${token}">`));
            }
            if (req.method === "GET" && url.pathname === "/ui.mjs") return send(200, "text/javascript; charset=utf-8", client);
            if (req.method === "GET" && url.pathname === "/view.mjs") return send(200, "text/javascript; charset=utf-8", view);
            if (req.method === "GET" && url.pathname === "/ui.css") return send(200, "text/css; charset=utf-8", css);
            const supplied = Buffer.from(req.headers["x-canvas-token"] || "");
            const expected = Buffer.from(token);
            if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected))
                return send(403, "text/plain", "Forbidden");
            if (req.method === "GET" && url.pathname === "/api/config")
                return send(200, "application/json", JSON.stringify({ initialFile: currentFile, workspaceRoot }));
            if (req.method === "GET" && url.pathname === "/api/document") {
                const result = await store.read(url.searchParams.get("name"));
                return send(200, "application/json", JSON.stringify(result));
            }
            if (req.method === "POST" && url.pathname === "/api/active") {
                const sequence = ++nextSelection;
                const name = url.searchParams.get("name");
                await store.read(name);
                acceptSelection(sequence, name);
                return send(200, "application/json", JSON.stringify({ initialFile: currentFile }));
            }
            if (req.method === "POST" && url.pathname === "/api/save") {
                if (req.headers["content-type"] !== "application/json") return send(415, "text/plain", "Expected JSON");
                const sequence = ++nextSelection;
                const chunks = [];
                let size = 0;
                for await (const chunk of req) {
                    size += chunk.length;
                    if (size > MAX_REQUEST_BYTES) throw new Error("Request too large");
                    chunks.push(chunk);
                }
                const { name, document, revision } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
                const result = await store.save(name, document, revision);
                acceptSelection(sequence, name);
                return send(200, "application/json", JSON.stringify(result));
            }
            if (req.method === "GET" && url.pathname === "/api/blank")
                return send(200, "application/json", JSON.stringify(blankDocument()));
            return send(404, "text/plain", "Not found");
        } catch (error) {
            return send(400, "application/json", JSON.stringify({ error: error.message }));
        }
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
    });
    host = `127.0.0.1:${server.address().port}`;
    return { server, url: `http://${host}/` };
}
