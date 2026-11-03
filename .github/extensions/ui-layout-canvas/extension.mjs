import { CanvasError, createCanvas, joinSession } from "@github/copilot-sdk/extension";
import { startServer } from "./server.mjs";

const instances = new Map();
const empty = { type: "object", properties: {}, additionalProperties: false };
const named = { type: "object", properties: { name: { type: "string", description: "File name without .json in the current layout directory." } }, required: ["name"], additionalProperties: false };

function action(name, description, inputSchema = empty) {
    return {
        name, description, inputSchema,
        handler: async ctx => {
            const instance = instances.get(ctx.instanceId);
            if (!instance) throw new CanvasError("not_open", "Open the canvas before using its actions.");
            try { return await (await instance).controller.dispatch(name, ctx.input); }
            catch (error) { throw new CanvasError("layout_error", error.message); }
        },
    };
}

await joinSession({
    canvases: [createCanvas({
        id: "ui-layout-drafting",
        displayName: "UI Layout Drafting",
        description: "Draft and discuss viewport-based UI layouts with editable regions.",
        inputSchema: {
            type: "object",
            properties: { layoutPath: { type: "string", description: "Absolute path to an existing layout JSON file." } },
            required: ["layoutPath"],
            additionalProperties: false,
        },
        actions: [
            action("get_state", "Get the current layout, revision, warnings, and save status."),
            action("replace_layout", "Replace the layout with a validated draft; use the current revision to avoid overwriting newer edits.", {
                type: "object", properties: { revision: { type: "integer" }, layout: { type: "object" } }, required: ["revision", "layout"], additionalProperties: false,
            }),
            action("save", "Save the current layout to its existing file."),
            action("save_as", "Save a separate alternative in the layout directory without overwriting an existing file.", named),
            action("open_layout", "Open another layout in the same directory; set discard only to discard unsaved changes.", {
                type: "object", properties: { name: { type: "string" }, discard: { type: "boolean" } }, required: ["name"], additionalProperties: false,
            }),
            action("new_layout", "Create a blank draft; use save_as to preserve the original file.", {
                type: "object", properties: { discard: { type: "boolean" } }, additionalProperties: false,
            }),
            action("export_svg", "Write an SVG snapshot next to the current layout file."),
        ],
        open: async ctx => {
            try {
                let entry = instances.get(ctx.instanceId);
                if (!entry) {
                    entry = startServer(ctx.input.layoutPath);
                    instances.set(ctx.instanceId, entry);
                    entry.catch(() => { if (instances.get(ctx.instanceId) === entry) instances.delete(ctx.instanceId); });
                }
                return { title: "UI Layout Drafting", url: (await entry).url };
            } catch (error) {
                throw new CanvasError("open_failed", error.message);
            }
        },
        onClose: async ctx => {
            const entry = instances.get(ctx.instanceId);
            if (entry) {
                instances.delete(ctx.instanceId);
                const { server } = await entry;
                server.closeAllConnections();
                await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
            }
        },
    })],
});
