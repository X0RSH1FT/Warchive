import { rect } from "./model.mjs";

const $ = id => document.getElementById(id);
let state;
let selected = null;
let scale = 1;
let busy = false;
let pending = 0;
let queue = Promise.resolve();
let interactionGeneration = 0;
let refreshGeneration = 0;
let dragging = false;
let transitioning = false;
let lastError = "";
const form = $("region-form");
const drafts = new Map();
const fieldRegions = new WeakMap();

function isEditing() { return document.activeElement?.matches("input, textarea, select"); }
function markDraft(field) {
    if (transitioning) return;
    if (field.name && document.activeElement === field && !fieldRegions.has(field)) fieldRegions.set(field, selected);
    const region = field.name ? (fieldRegions.get(field) ?? selected) : null;
    if (!drafts.has(field)) drafts.set(field, new Map());
    drafts.get(field).set(region, { value: field.type === "checkbox" ? field.checked : field.value });
    interactionGeneration++;
}
function setField(field, value, region = null) {
    if (document.activeElement === field) return;
    const draft = drafts.get(field)?.get(region);
    if (draft) value = draft.value;
    if (field.type === "checkbox") field.checked = value;
    else if (field.value !== String(value)) field.value = value;
}
function clearDraft(field, region, draft) {
    const entries = drafts.get(field);
    if (draft && entries?.get(region) === draft) {
        entries.delete(region);
        if (!entries.size) drafts.delete(field);
    }
}
async function commitField(field, mutator, region = field.name ? (fieldRegions.get(field) ?? selected) : null) {
    if (transitioning) return;
    const draft = drafts.get(field)?.get(region);
    try {
        await edit(mutator, () => clearDraft(field, region, draft));
    } catch { await refresh(); }
}

async function request(action, input = {}) {
    const response = await fetch(`/api/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
}

function status(message) { $("status").textContent = message; }
function report(error) { lastError = error.message; status(lastError); }

function perform(action, input = {}, onSuccess = () => {}) {
    interactionGeneration++;
    if (!pending) lastError = "";
    pending++;
    busy = true;
    const operation = queue.then(async () => {
        try {
            if (["save", "save_as", "export_svg"].includes(action) && drafts.size) {
                throw new Error("Finish or correct the edited fields before saving or exporting.");
            }
            const payload = typeof input === "function" ? input() : input;
            if (payload === null) return;
            const result = await request(action, payload);
            if (result.layout) state = result;
            onSuccess();
            if (!lastError) status(action === "export_svg" ? `Exported ${result.path}${result.dirty ? " (includes unsaved changes)" : ""}` : "Ready.");
            return result;
        } catch (error) {
            report(error);
            throw error;
        } finally {
            if (--pending === 0) {
                busy = false;
                if (state && !dragging) render();
            }
        }
    });
    queue = operation.catch(() => {});
    return operation;
}

async function edit(mutator, onSuccess) {
    await perform("replace_layout", () => {
        const layout = structuredClone(state.layout);
        if (mutator(layout) === false) return null;
        return { revision: state.revision, layout };
    }, onSuccess);
}

function render() {
    const layout = state.layout;
    $("file").textContent = `${state.path}${state.needsSaveAs ? " - new draft; save as an alternative" : state.dirty ? " - unsaved changes" : " - saved"}`;
    setField($("layout-name"), layout.name);
    setField($("provenance"), layout.provenance);
    setField($("viewport-width"), layout.viewport.width);
    setField($("viewport-height"), layout.viewport.height);
    renderSelection(layout);
    $("warnings").replaceChildren();
    for (const warning of state.warnings) {
        const item = document.createElement("li");
        item.textContent = warning;
        $("warnings").append(item);
    }
    if (!state.warnings.length) {
        const item = document.createElement("li");
        item.textContent = "No overlaps or out-of-bounds regions detected.";
        $("warnings").append(item);
    }
    renderPreview();
}

function renderSelection(layout) {
    if (!layout.regions.some(region => region.id === selected)) selected = layout.regions[0]?.id ?? null;
    if (document.activeElement !== $("selection")) {
        $("selection").replaceChildren();
        for (const region of layout.regions) {
            const option = document.createElement("option");
            option.value = region.id;
            option.textContent = region.label || region.id;
            $("selection").append(option);
        }
        $("selection").value = selected ?? "";
    }
    const region = layout.regions.find(item => item.id === selected);
    for (const field of form.elements) {
        if (!field.name) continue;
        field.disabled = !region;
        setField(field, region?.[field.name] ?? (field.type === "checkbox" ? false : ""), selected);
    }
    $("remove").disabled = !region;
}

function renderPreview() {
    const viewport = state.layout.viewport;
    const preview = $("preview");
    const available = Math.max(200, preview.parentElement.parentElement.clientWidth - 18);
    scale = Math.min(1, available / viewport.width, 700 / viewport.height);
    preview.style.width = `${viewport.width}px`;
    preview.style.height = `${viewport.height}px`;
    preview.style.transform = `scale(${scale})`;
    $("preview-space").style.width = `${viewport.width * scale}px`;
    $("preview-space").style.height = `${viewport.height * scale}px`;
    preview.replaceChildren();
    for (const region of state.layout.regions) {
        const box = rect(region, viewport);
        const element = document.createElement("div");
        element.className = `region${region.id === selected ? " selected" : ""}`;
        element.style.left = `${box.x}px`;
        element.style.top = `${box.y}px`;
        element.style.width = `${box.width}px`;
        element.style.height = `${Math.max(0, box.height)}px`;
        element.textContent = region.label;
        element.title = `${region.label} (${region.kind})`;
        const handle = document.createElement("span");
        handle.className = "handle";
        element.append(handle);
        element.addEventListener("pointerdown", event => beginDrag(event, region, element, event.target === handle));
        preview.append(element);
    }
}

function beginDrag(event, region, element, resizing) {
    if (event.button !== 0 || busy || transitioning) return;
    event.preventDefault();
    const focused = document.activeElement;
    dragging = true;
    interactionGeneration++;
    if (region.id !== selected && focused?.name && Array.from(form.elements).includes(focused)) {
        if (!fieldRegions.has(focused)) fieldRegions.set(focused, selected);
        focused.blur();
    }
    selected = region.id;
    if (focused === $("selection")) {
        if (!Array.from(focused.children).some(option => option.value === selected)) {
            const option = document.createElement("option");
            option.value = selected;
            option.textContent = region.label || selected;
            focused.append(option);
        }
        focused.value = selected;
    }
    renderSelection(state.layout);
    for (const [index, item] of state.layout.regions.entries()) {
        $("preview").children[index].className = `region${item.id === selected ? " selected" : ""}`;
    }
    const startX = event.clientX, startY = event.clientY;
    const initial = rect(region, state.layout.viewport);
    element.setPointerCapture(event.pointerId);
    const move = e => {
        const dx = Math.round((e.clientX - startX) / scale), dy = Math.round((e.clientY - startY) / scale);
        if (resizing) {
            element.style.width = `${Math.max(1, initial.width + dx)}px`;
            element.style.height = `${Math.max(1, initial.height + dy)}px`;
        } else {
            element.style.left = `${initial.x + dx}px`;
            element.style.top = `${initial.y + dy}px`;
        }
    };
    const finish = async e => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerup", finish);
        element.removeEventListener("pointercancel", cancel);
        dragging = false;
        const dx = Math.round((e.clientX - startX) / scale), dy = Math.round((e.clientY - startY) / scale);
        try {
            await edit(layout => {
                const item = layout.regions.find(r => r.id === region.id);
                const before = [item.x, item.y, item.width, item.height, item.bottom];
                if (resizing) {
                    item.width = Math.max(1, Math.min(10000, item.width + dx));
                    if (item.stretchY) item.bottom = Math.max(-10000, Math.min(10000, item.bottom - dy));
                    else item.height = Math.max(1, Math.min(10000, item.height + dy));
                } else { item.x += dx; item.y += dy; }
                const after = [item.x, item.y, item.width, item.height, item.bottom];
                return before.some((value, index) => value !== after[index]);
            });
        } catch { await refresh(); }
    };
    const cancel = () => { dragging = false; render(); };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", finish);
    element.addEventListener("pointercancel", cancel, { once: true });
}

async function refresh() {
    const generation = interactionGeneration;
    const refreshId = ++refreshGeneration;
    try {
        const next = await request("get_state");
        if (busy || dragging || isEditing() || generation !== interactionGeneration || refreshId !== refreshGeneration) return;
        if (!state || next.revision !== state.revision || next.dirty !== state.dirty || next.path !== state.path) {
            state = next;
            render();
        }
    } catch (error) { report(error); }
}

function connect(id, action, input = () => ({})) {
    $(id).addEventListener("click", async () => {
        if (transitioning) return;
        try { await perform(action, input()); } catch { /* Error is displayed by perform. */ }
    });
}
connect("save", "save");
connect("save-as", "save_as", () => ({ name: $("filename").value }));
connect("export", "export_svg");
async function transition(operation) {
    if (transitioning) return;
    if (dragging) {
        status("Finish the current drag first.");
        return;
    }
    transitioning = true;
    document.querySelector("main").inert = true;
    document.querySelector("header .toolbar").inert = true;
    try { await operation(); }
    finally {
        transitioning = false;
        document.querySelector("main").inert = false;
        document.querySelector("header .toolbar").inert = false;
    }
}
$("new").addEventListener("click", async () => {
    await switchLayout("new_layout", { discard: true });
});
$("open").addEventListener("click", async () => {
    await switchLayout("open_layout", { name: $("filename").value, discard: true });
});
async function switchLayout(action, input) {
    if (transitioning) return;
    if ((state.dirty || busy || drafts.size) && !confirm("Discard unsaved changes?")) return;
    await transition(async () => {
        const captured = new Map([...drafts].map(([field, entries]) => [field, new Map(entries)]));
        try {
            await perform(action, input, () => {
                document.activeElement?.blur();
                for (const [field, entries] of captured) {
                    for (const [region, draft] of entries) clearDraft(field, region, draft);
                }
            });
        } catch {}
    });
}
$("add").addEventListener("click", async () => {
    if (transitioning) return;
    const id = crypto.randomUUID();
    selected = id;
    try {
        await edit(layout => layout.regions.push({ id, label: "New region", kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 0, anchorY: 0, x: 40, y: 40, width: 240, height: 160, stretchY: false, bottom: 0 }));
    } catch { await refresh(); }
});
$("remove").addEventListener("click", async () => {
    await transition(async () => {
        const id = selected;
        const captured = [...drafts].map(([field, entries]) => [field, entries.get(id)]);
        try {
            await edit(layout => { layout.regions = layout.regions.filter(region => region.id !== id); }, () => {
                document.activeElement?.blur();
                for (const [field, draft] of captured) clearDraft(field, id, draft);
            });
        } catch { await refresh(); }
    });
});
$("selection").addEventListener("change", event => { if (!transitioning) { selected = event.target.value; render(); } });
$("selection").addEventListener("blur", () => { if (state && !busy) render(); });
for (const [id, key] of [["layout-name", "name"], ["provenance", "provenance"]]) {
    $(id).addEventListener("input", event => markDraft(event.target));
    $(id).addEventListener("change", async event => {
        const value = event.target.value;
        await commitField(event.target, layout => { layout[key] = value; });
    });
}
for (const [id, key] of [["viewport-width", "width"], ["viewport-height", "height"]]) {
    $(id).addEventListener("input", event => markDraft(event.target));
    $(id).addEventListener("change", async event => {
        const value = Number(event.target.value);
        await commitField(event.target, layout => { layout.viewport[key] = value; });
    });
}
form.addEventListener("input", event => { if (event.target.name) markDraft(event.target); });
form.addEventListener("focusout", event => {
    fieldRegions.delete(event.target);
    if (state && !busy && !dragging) render();
});
form.addEventListener("change", async event => {
    const field = event.target;
    if (!field.name) return;
    const value = field.type === "checkbox" ? field.checked : field.type === "number" || field.tagName === "SELECT" ? Number(field.value) : field.value;
    const id = fieldRegions.get(field) ?? selected, name = field.name;
    await commitField(field, layout => { layout.regions.find(region => region.id === id)[name] = value; }, id);
});
window.addEventListener("resize", () => { if (state && !dragging) renderPreview(); });
window.addEventListener("beforeunload", event => { if (busy || state?.dirty || drafts.size) event.preventDefault(); });
document.querySelector("main").inert = true;
document.querySelector("header .toolbar").inert = true;
await refresh();
document.querySelector("main").inert = false;
document.querySelector("header .toolbar").inert = false;
setInterval(() => {
    if (!busy && !dragging && !isEditing()) refresh();
}, 1000);
