import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, CanvasError, joinSession } from "@github/copilot-sdk/extension";
import { createStore } from "./document.mjs";
import { startServer } from "./server.mjs";
import { createInstances } from "./instances.mjs";

const workspace = fileURLToPath(new URL("../../../", import.meta.url));
const store = createStore(path.join(workspace, "data", "process-diagrams"));
const instances = createInstances(store, startServer, workspace);
const fileSchema = { type: "string", description: "Simple .json filename in data/process-diagrams." };

function failure(error) {
    return new CanvasError("PROCESS_DIAGRAM_ERROR", error.message);
}

const session = await joinSession({
    canvases: [createCanvas({
        id: "rx0-process-sequence",
        displayName: "Process Sequence",
        description: "Explore and draft manually maintained process diagrams.",
        inputSchema: { type: "object", properties: { file: fileSchema }, required: ["file"] },
        actions: [
            {
                name: "inspect",
                description: "Read a saved diagram and its revision from the workspace; unsaved UI edits are not included.",
                inputSchema: { type: "object", properties: { file: fileSchema }, required: ["file"] },
                handler: async ctx => {
                    try { return await store.read(ctx.input.file); } catch (error) { throw failure(error); }
                }
            }
        ],
        open: async ctx => {
            try {
                const entry = await instances.open(ctx.instanceId, ctx.input?.file);
                return { title: "Process Sequence", url: entry.url };
            } catch (error) {
                session.log(`Process Sequence open failed: ${error.message}`, { level: "error" });
                throw failure(error);
            }
        },
        onClose: async ctx => {
            await instances.close(ctx.instanceId);
        }
    })]
});
