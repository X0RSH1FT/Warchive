import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStore } from "./document.mjs";

test("extension uses the workspace data directory for saved diagrams", async t => {
    class CanvasError extends Error { constructor(code, message) { super(message); this.code = code; } }
    const harness = {
        path, fileURLToPath, createStore, CanvasError,
        createCanvas: canvas => canvas,
        createInstances: () => ({}),
        startServer() {},
        joinSession: async ({ canvases }) => { harness.canvas = canvases[0]; },
    };
    globalThis.__processExtensionTest = harness;
    t.after(() => { delete globalThis.__processExtensionTest; });
    const file = new URL("./extension.mjs", import.meta.url);
    const source = (await readFile(file, "utf8"))
        .replace(/^import .*;\r?\n/gm, "")
        .replace("import.meta.url", JSON.stringify(file.href));
    const prelude = "const { path, fileURLToPath, createStore, CanvasError, createCanvas, createInstances, startServer, joinSession } = globalThis.__processExtensionTest;\n";
    await import(`data:text/javascript;base64,${Buffer.from(prelude + source).toString("base64")}`);

    const canvas = harness.canvas;
    assert.match(canvas.inputSchema.properties.file.description, /data\/process-diagrams/);
    assert.match(canvas.actions[0].inputSchema.properties.file.description, /data\/process-diagrams/);
    const result = await canvas.actions[0].handler({ input: { file: "tea-example.json" } });
    assert.equal(result.document.format, "copilot-process-sequence");
});
