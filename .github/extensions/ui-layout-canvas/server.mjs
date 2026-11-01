import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createController } from "./controller.mjs";
import { MAX_REQUEST_BYTES } from "./model.mjs";

const assets = new Map([
    ["/", ["ui.html", "text/html; charset=utf-8"]],
    ["/ui.js", ["ui.js", "text/javascript; charset=utf-8"]],
    ["/model.mjs", ["model.mjs", "text/javascript; charset=utf-8"]],
    ["/style.css", ["style.css", "text/css; charset=utf-8"]],
]);
const actions = new Set(["get_state", "replace_layout", "save", "save_as", "open_layout", "new_layout", "export_svg"]);
const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
};

async function body(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_REQUEST_BYTES) throw new Error("Request is too large.");
        chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

export async function startServer(file) {
    const controller = await createController(file);
    let host;
    const server = createServer(async (req, res) => {
        try {
            if (req.headers.host !== host || (req.headers.origin && req.headers.origin !== `http://${host}`) || req.headers["sec-fetch-site"] === "cross-site") {
                res.writeHead(403, headers).end("Forbidden");
                return;
            }
            const url = new URL(req.url, `http://${host}`);
            if (req.method === "GET" && assets.has(url.pathname)) {
                const [fileName, type] = assets.get(url.pathname);
                const data = await readFile(new URL(fileName, import.meta.url));
                res.writeHead(200, { ...headers, "Content-Type": type }).end(data);
                return;
            }
            if (req.method === "POST" && url.pathname.startsWith("/api/") && req.headers["content-type"] === "application/json") {
                const action = url.pathname.slice(5);
                if (!actions.has(action)) throw new Error("Unknown action.");
                const result = await controller.dispatch(action, await body(req));
                res.writeHead(200, { ...headers, "Content-Type": "application/json" }).end(JSON.stringify(result));
                return;
            }
            res.writeHead(404, headers).end("Not found");
        } catch (error) {
            res.writeHead(400, { ...headers, "Content-Type": "application/json" }).end(JSON.stringify({ error: error.message }));
        }
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
    });
    host = `127.0.0.1:${server.address().port}`;
    return { server, controller, url: `http://${host}/` };
}
