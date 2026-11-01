import { blankLayout, validateLayout, warnings } from "./model.mjs";
import { alternativePath, exportSvg, load, save, saveAs } from "./storage.mjs";

export async function createController(file) {
    let record = await load(file);
    let revision = 0;
    let dirty = false;
    let needsSaveAs = false;
    let queue = Promise.resolve();

    function state() {
        return { path: record.path, layout: structuredClone(record.layout), revision, dirty, needsSaveAs, warnings: warnings(record.layout) };
    }

    async function perform(action, input = {}) {
        switch (action) {
        case "get_state":
            return state();
        case "replace_layout":
            if (input.revision !== revision) throw new Error("The canvas changed since it was read. Refresh and retry.");
            validateLayout(input.layout);
            record.layout = structuredClone(input.layout);
            revision++;
            dirty = true;
            return state();
        case "save":
            if (needsSaveAs) throw new Error("A new draft must be saved as a new alternative first.");
            record.hash = await save(record.path, record.layout, record.hash);
            dirty = false;
            return state();
        case "save_as": {
            const result = await saveAs(record.path, input.name, record.layout);
            record.path = result.path;
            record.hash = result.hash;
            dirty = false;
            needsSaveAs = false;
            revision++;
            return state();
        }
        case "open_layout":
            if (dirty && input.discard !== true) throw new Error("Save changes first, or explicitly discard them.");
            record = await load(alternativePath(record.path, input.name));
            dirty = false;
            needsSaveAs = false;
            revision++;
            return state();
        case "new_layout":
            if (dirty && input.discard !== true) throw new Error("Save changes first, or explicitly discard them.");
            record.layout = blankLayout();
            dirty = true;
            needsSaveAs = true;
            revision++;
            return state();
        case "export_svg":
            if (needsSaveAs) throw new Error("Save the new draft as an alternative before exporting it.");
            return { path: await exportSvg(record.path, record.layout), dirty };
        default:
            throw new Error(`Unknown action: ${action}`);
        }
    }

    return {
        dispatch(action, input) {
            const result = queue.then(() => perform(action, input));
            queue = result.then(() => undefined, () => undefined);
            return result;
        },
    };
}
