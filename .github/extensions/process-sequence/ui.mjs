import { findSelection, matchesBlock, summarize } from "./view.mjs";

const $ = id => document.getElementById(id);
const token = document.querySelector('meta[name="canvas-token"]').content;
let diagram, revision = null, loadedName = "", workspaceRoot = "", dirty = false;
let sectionId = null, selection = { kind: "diagram" }, editing = false, inspectorOpen = false;
let operation = false, editGeneration = 0;

async function coordinate(action) {
    if (operation) return;
    operation = true;
    for (const id of ["open", "new", "save"]) $(id).disabled = true;
    try { await action(); }
    finally {
        operation = false;
        for (const id of ["open", "new", "save"]) $(id).disabled = false;
        $("save").disabled = !diagram;
    }
}

async function request(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { "x-canvas-token": token, ...options.headers } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
    return result;
}
function announce(message) { $("status").textContent = message; }
function updateHeader() {
    $("document-title").textContent = diagram.title;
    $("save-state").textContent = dirty ? "Unsaved changes" : "Saved";
    $("save-state").className = `save-state${dirty ? " dirty" : ""}`;
}
function changed() {
    editGeneration++;
    dirty = true;
    updateHeader();
    announce("Unsaved diagram changes. Save to share with the agent.");
}
function validFields() {
    const invalid = document.querySelector("input:invalid, textarea:invalid, select:invalid");
    if (!invalid) return true;
    invalid.reportValidity();
    return false;
}
function confirmDiscard() { return !dirty || window.confirm("Discard unsaved diagram changes?"); }
function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
}
function button(text, fn, className) {
    const node = element("button", text, className);
    node.type = "button";
    node.addEventListener("click", () => { if (validFields()) fn(); });
    return node;
}
function badge(status) {
    return element("span", status[0].toUpperCase() + status.slice(1), `badge ${status}`);
}
function focusInspector() {
    const heading = $("inspector").querySelector("h2");
    heading?.focus({ preventScroll: true });
    if (matchMedia("(max-width: 1000px)").matches) $("inspector").scrollIntoView({ block: "start" });
}
function choose(next, nextSectionId = sectionId, showDetails = false) {
    selection = next;
    sectionId = nextSectionId;
    editing = false;
    inspectorOpen = showDetails;
    if (!nextSectionId) $("search").value = "";
    render();
    if (showDetails) focusInspector();
    else $("view-title").focus();
}
function renderOutline() {
    const outline = $("outline");
    outline.replaceChildren(element("span", "Explore", "eyebrow"));
    const overview = button("Overview", () => choose({ kind: "diagram" }, null));
    if (!sectionId) overview.setAttribute("aria-current", "page");
    outline.append(overview);
    diagram.sections.forEach((section, index) => {
        const link = button("", () => choose({ kind: "section", sectionId: section.id }, section.id));
        link.append(element("span", String(index + 1).padStart(2, "0"), "card-number"),
            element("span", section.title), element("span", String(section.blocks.length), "nav-count"));
        if (section.id === sectionId) link.setAttribute("aria-current", "page");
        outline.append(link);
    });
}
function renderBreadcrumbs(section) {
    const breadcrumbs = $("breadcrumbs");
    breadcrumbs.replaceChildren(button("Overview", () => choose({ kind: "diagram" }, null)));
    if (section) {
        breadcrumbs.append(element("span", "/"), button(section.title, () => choose({ kind: "section", sectionId: section.id }, section.id)));
        const selected = findSelection(diagram, selection);
        if (selected.kind === "block") breadcrumbs.append(element("span", "/"), element("span", selected.item.title));
    }
}
function renderMap() {
    const section = diagram.sections.find(item => item.id === sectionId);
    const query = $("search").value;
    renderBreadcrumbs(section);
    $("view-label").textContent = section ? `Section ${diagram.sections.indexOf(section) + 1} / ${diagram.sections.length}` : "The big picture";
    $("view-title").textContent = section ? section.title : "Process overview";
    $("view-title").tabIndex = -1;
    $("view-description").textContent = section ? "Select a node to see its complete description, ordering notes, and source evidence." :
        "Start with a section, then drill into its process nodes. Sections are groups, not an unconditional execution chain.";
    const actions = $("view-actions");
    actions.replaceChildren(section ? button("Section details", () => choose({ kind: "section", sectionId: section.id }, section.id, true)) :
        button("Diagram details", () => choose({ kind: "diagram" }, null, true)));
    if (!section) actions.append(button("+ Section", addSection));
    const map = $("map");
    map.replaceChildren();
    if (!section) {
        if (diagram.sectionsOrderProposed) map.append(element("p", "Section order has proposed changes.", "order-note"));
        const grid = element("div", undefined, "overview-grid");
        for (const item of diagram.sections) {
            const matching = item.blocks.filter(block => matchesBlock(block, query));
            if (query.trim() && !matching.length) continue;
            const counts = summarize(item);
            const card = button("", () => choose({ kind: "section", sectionId: item.id }, item.id), "section-card");
            card.dataset.sectionId = item.id;
            const top = element("span", undefined, "card-top");
            top.append(element("span", String(diagram.sections.indexOf(item) + 1).padStart(2, "0"), "card-number"), badge(item.status));
            const footer = element("span", undefined, "card-footer");
            footer.append(element("span", query.trim() ? `${matching.length} matching nodes` : `${item.blocks.length} nodes`),
                element("span", "Explore section >"));
            card.append(top, element("span", item.title, "card-title"),
                element("span", item.notes || "Select to explore this section.", "card-preview"),
                element("span", `${counts.proposed} proposed / ${counts.unknown} unknown${item.orderProposed ? " / order proposed" : ""}`, "muted"), footer);
            grid.append(card);
        }
        map.append(grid);
        if (!grid.childElementCount) map.append(element("p", query.trim() ? "No blocks match this search." : "No sections yet. Use Diagram details to add one.", "empty"));
    } else {
        if (section.orderProposed) map.append(element("p", "Block order is proposed, not observed behavior.", "order-note"));
        if (query.trim()) map.append(element("p", "Filtered view: hidden nodes still exist in the sequence. Original positions are shown.", "muted"));
        const timeline = element("ol", undefined, "timeline");
        section.blocks.forEach((block, index) => {
            if (!matchesBlock(block, query)) return;
            const entry = element("li");
            entry.value = index + 1;
            const card = button("", () => {
                selection = { kind: "block", sectionId: section.id, blockId: block.id };
                editing = false;
                inspectorOpen = true;
                renderMap();
                renderInspector();
                focusInspector();
            }, "block-card");
            card.dataset.blockId = block.id;
            card.setAttribute("aria-pressed", String(selection.kind === "block" && selection.blockId === block.id));
            const top = element("span", undefined, "card-top");
            top.append(element("span", `NODE ${String(index + 1).padStart(2, "0")}`, "card-number"), badge(block.status));
            const footer = element("span", undefined, "card-footer");
            footer.append(element("span", `${block.sources.length} source references`), element("span", "Inspect >"));
            card.append(top, element("span", block.title, "card-title"),
                element("span", block.description || "No description yet.", "card-preview"), footer);
            entry.append(card);
            timeline.append(entry);
        });
        map.append(timeline);
        if (!timeline.childElementCount) map.append(element("p", query.trim() ? "No blocks match this search." : "No nodes yet. Use Section details to add one.", "empty"));
    }
}
function detailPart(title, text) {
    const part = element("div", undefined, "detail-part");
    part.append(element("h3", title), element("p", text || "No notes recorded.", "detail-text"));
    return part;
}
function renderSources(sources) {
    const part = element("div", undefined, "detail-part");
    part.append(element("h3", `Source evidence (${sources.length})`));
    const list = element("ul", undefined, "source-list");
    for (const source of sources) {
        const item = element("li");
        const link = element("a", `${source.path}:${source.line}`);
        link.href = encodeURI(`vscode://file/${workspaceRoot.replaceAll("\\", "/").replace(/\/$/, "")}/${source.path}:${source.line}`);
        item.append(element("span", source.symbol || "Source location", "source-symbol"), link);
        list.append(item);
    }
    part.append(sources.length ? list : element("p", "No source evidence recorded.", "muted"));
    return part;
}
function field(label, value, onChange, multiline = false, required = false) {
    const wrapper = element("label", label);
    const input = element(multiline ? "textarea" : "input");
    input.value = value;
    input.maxLength = 20000;
    input.required = required;
    if (multiline) input.rows = 4;
    input.addEventListener("input", () => {
        onChange(input.value);
        changed();
        renderOutline();
        renderMap();
    });
    wrapper.append(input);
    return wrapper;
}
function statusField(item) {
    const wrapper = element("label", "Evidence status");
    const select = element("select");
    for (const status of ["current", "proposed", "unknown"]) {
        const option = element("option", status);
        option.value = status;
        select.append(option);
    }
    select.value = item.status;
    select.addEventListener("change", () => {
        item.status = select.value;
        changed(); renderMap(); updateInspectorTitle(item);
    });
    wrapper.append(select);
    return wrapper;
}
function updateInspectorTitle(item) {
    $("inspector").querySelector("h2").textContent = item.title;
    const status = $("inspector").querySelector("[data-evidence-status]");
    if (status) status.replaceChildren(badge(item.status));
    const select = $("inspector").querySelector("select[data-status]");
    if (select) select.value = item.status;
}
function markProposed(item) {
    item.status = "proposed";
    updateInspectorTitle(item);
}
function sourceEditor(block) {
    const wrapper = element("label", "Sources: relative/path:line | symbol (one per line)");
    const input = element("textarea");
    input.rows = 4;
    input.value = block.sources.map(source => `${source.path}:${source.line} | ${source.symbol}`).join("\n");
    input.addEventListener("input", () => {
        try {
            const sources = input.value.split("\n").filter(line => line.trim()).map(line => {
                const match = /^([^:|]+):([1-9]\d*)\s*\|\s*(.*)$/.exec(line.trim());
                if (!match) throw new Error("Use relative/path.cs:123 | Symbol");
                const sourcePath = match[1].trim();
                const lineNumber = Number(match[2]);
                if (/[\\:?#]/.test(sourcePath) || sourcePath.split("/").some(part => !part || part === "." || part === "..") || !Number.isSafeInteger(lineNumber))
                    throw new Error("Use a workspace-relative path and positive safe line number");
                return { path: sourcePath, line: lineNumber, symbol: match[3].trim() };
            });
            if (sources.length > 100) throw new Error("At most 100 sources per block");
            block.sources = sources;
            input.setCustomValidity("");
        } catch (error) { input.setCustomValidity(error.message); announce(error.message); }
        markProposed(block);
        changed(); renderMap();
    });
    wrapper.append(input);
    return wrapper;
}
function move(items, item, offset, markOrder) {
    const index = items.indexOf(item), destination = index + offset;
    if (destination < 0 || destination >= items.length) return;
    [items[index], items[destination]] = [items[destination], items[index]];
    markOrder(); changed(); render();
    const direction = destination === 0 ? "down" : destination === items.length - 1 ? "up" : offset < 0 ? "up" : "down";
    $("inspector").querySelector(`[data-move="${direction}"]`)?.focus();
}
function orderControls(items, item, markOrder) {
    const controls = element("div", undefined, "button-row");
    for (const [label, offset] of [["up", -1], ["down", 1]]) {
        const moveButton = button(`Move ${label}`, () => move(items, item, offset, markOrder));
        moveButton.dataset.move = label;
        moveButton.disabled = items.indexOf(item) + offset < 0 || items.indexOf(item) + offset >= items.length;
        controls.append(moveButton);
    }
    return controls;
}
function addSection() {
    if (diagram.sections.length >= 100) { announce("At most 100 sections per diagram."); return; }
    const section = { id: crypto.randomUUID(), title: "New section", status: "proposed", notes: "", orderProposed: false, blocks: [] };
    diagram.sections.push(section);
    diagram.sectionsOrderProposed = true;
    sectionId = section.id; selection = { kind: "section", sectionId }; editing = true; inspectorOpen = true;
    $("search").value = "";
    changed(); render(); focusInspector();
}
function addBlock(section) {
    if (section.blocks.length >= 500) { announce("At most 500 blocks per section."); return; }
    const block = { id: crypto.randomUUID(), title: "New block", status: "proposed", description: "", notes: "", sources: [] };
    section.blocks.push(block);
    section.orderProposed = true;
    selection = { kind: "block", sectionId: section.id, blockId: block.id }; editing = true; inspectorOpen = true;
    $("search").value = "";
    changed(); render(); focusInspector();
}
function renderEditor(selected, container) {
    const { kind, item, section } = selected;
    container.append(field(kind === "diagram" ? "Diagram title" : `${kind === "block" ? "Block" : "Section"} title`, item.title, value => {
        item.title = value;
        if (kind !== "diagram") markProposed(item);
        else updateInspectorTitle(item);
    }, false, true));
    if (kind !== "diagram") {
        const status = statusField(item);
        status.querySelector("select").dataset.status = "";
        container.append(status);
    }
    if (kind === "block") container.append(field("Description", item.description, value => { item.description = value; markProposed(item); }, true));
    container.append(field(kind === "diagram" ? "Diagram notes and questions" : "Ordering, dependencies, and questions", item.notes, value => { item.notes = value; }, true));
    if (kind === "block") {
        container.append(sourceEditor(item), orderControls(section.blocks, item, () => { section.orderProposed = true; }));
        if (diagram.sections.length > 1) {
            const label = element("label", "Move to section");
            const select = element("select");
            for (const candidate of diagram.sections) {
                const option = element("option", candidate.title);
                option.value = candidate.id;
                select.append(option);
            }
            select.value = section.id;
            select.addEventListener("change", () => {
                if (!validFields()) { select.value = section.id; return; }
                const target = diagram.sections.find(candidate => candidate.id === select.value);
                if (target.blocks.length >= 500) { announce("Destination already has 500 blocks."); select.value = section.id; return; }
                section.blocks.splice(section.blocks.indexOf(item), 1);
                target.blocks.push(item);
                section.orderProposed = target.orderProposed = true;
                sectionId = target.id; selection.sectionId = target.id;
                changed(); render(); focusInspector();
            });
            label.append(select);
            container.append(label);
        }
        container.append(button("Remove block", () => {
            if (!window.confirm("Remove this block from the diagram?")) return;
            section.blocks.splice(section.blocks.indexOf(item), 1);
            section.orderProposed = true; selection = { kind: "section", sectionId }; editing = false;
            changed(); render(); focusInspector();
        }, "danger"));
    } else if (kind === "section") {
        container.append(orderControls(diagram.sections, item, () => { diagram.sectionsOrderProposed = true; }),
            button("Add proposed block", () => addBlock(item)),
            button("Remove section", () => {
                if (!window.confirm("Remove this section and its blocks from the diagram?")) return;
                diagram.sections.splice(diagram.sections.indexOf(item), 1);
                diagram.sectionsOrderProposed = true; sectionId = null; selection = { kind: "diagram" }; editing = false;
                changed(); render(); focusInspector();
            }, "danger"));
    } else container.append(button("Add section", addSection));
}
function renderInspector() {
    const selected = findSelection(diagram, selection);
    const { kind, item, section } = selected;
    const inspector = $("inspector");
    inspector.hidden = !inspectorOpen;
    document.querySelector(".workspace").classList.toggle("has-inspector", inspectorOpen);
    inspector.replaceChildren();
    if (!inspectorOpen) return;
    const controls = element("div", undefined, "inspector-controls");
    controls.append(element("span", editing ? "Proposal editor" : `${kind} details`, "eyebrow"),
        button(editing ? "Done editing" : "Edit proposal", () => {
            editing = !editing; renderInspector();
            if (editing) $("inspector").querySelector("input")?.focus();
            else focusInspector();
        }),
        button("Close", () => {
            inspectorOpen = false; editing = false;
            renderInspector();
            const card = [...document.querySelectorAll("[data-block-id]")].find(node => node.dataset.blockId === selection.blockId);
            (card || $("view-title")).focus();
        }));
    const heading = element("h2", item.title);
    heading.tabIndex = -1;
    inspector.append(controls, heading);
    if (kind !== "diagram") {
        const evidence = element("div");
        evidence.dataset.evidenceStatus = "";
        evidence.append(badge(item.status));
        inspector.append(evidence);
    }
    if (editing) {
        inspector.append(element("p", "Diagram only. Save to share proposed changes.", "muted"));
        renderEditor(selected, inspector);
    } else {
        if (kind === "block") {
            inspector.append(detailPart("What happens", item.description), detailPart("Ordering and open questions", item.notes), renderSources(item.sources));
            if (section.orderProposed) inspector.append(element("p", "This section's block order is proposed.", "order-note"));
        } else {
            inspector.append(detailPart(kind === "section" ? "Context and ordering" : "About this diagram", item.notes));
            if (kind === "section") {
                const counts = summarize(item);
                inspector.append(detailPart("Evidence coverage", `${item.blocks.length} nodes: ${counts.current} current, ${counts.proposed} proposed, ${counts.unknown} unknown.`));
                if (item.orderProposed) inspector.append(element("p", "Block order is proposed.", "order-note"));
                inspector.append(button("Add proposed block", () => addBlock(item)));
            } else inspector.append(button("Add section", addSection));
        }
        inspector.append(element("p", "Manually maintained evidence. Not synchronized with source.", "muted"));
    }
}
function render() { updateHeader(); renderOutline(); renderMap(); renderInspector(); }
async function openFile(name) {
    const original = diagram, snapshot = JSON.stringify(diagram), generation = editGeneration;
    const result = await request(`/api/document?name=${encodeURIComponent(name)}`);
    if (diagram !== original || editGeneration !== generation || JSON.stringify(diagram) !== snapshot) throw new Error("Diagram changed while opening; current edits were kept.");
    diagram = result.document; revision = result.revision; loadedName = name;
    $("filename").value = name;
    dirty = false; sectionId = null; selection = { kind: "diagram" }; editing = false; inspectorOpen = false;
    $("search").value = ""; $("search").disabled = false; $("save").disabled = false;
    $("document-title").textContent = diagram.title;
    document.title = `${diagram.title} - Process Sequence`;
    $("outline").hidden = false; $("explorer").hidden = false; $("inspector").hidden = false;
    render();
    $("filename").closest("details").open = false;
    announce(`Opened ${name}. Select a section to drill into its nodes.`);
    try {
        await request(`/api/active?name=${encodeURIComponent(name)}`, { method: "POST" });
    } catch (error) {
        announce(`Opened ${name}, but it could not be remembered for reopening: ${error.message}`);
    }
}
$("search").addEventListener("input", () => { if (diagram) renderMap(); });
$("open").addEventListener("click", async () => {
    if (operation) return;
    if (!confirmDiscard()) return;
    await coordinate(async () => {
        try { await openFile($("filename").value.trim()); } catch (error) { announce(error.message); }
    });
});
$("new").addEventListener("click", async () => {
    if (operation) return;
    if (!confirmDiscard()) return;
    await coordinate(async () => { try {
        const original = diagram, snapshot = JSON.stringify(diagram), generation = editGeneration;
        const blank = await request("/api/blank");
        if (diagram !== original || editGeneration !== generation || JSON.stringify(diagram) !== snapshot) throw new Error("Diagram changed while creating a new one; current edits were kept.");
        diagram = blank;
        loadedName = ""; revision = null; $("filename").value = "";
        sectionId = null; selection = { kind: "diagram" }; editing = true; inspectorOpen = true;
        $("search").value = ""; $("search").disabled = false; $("save").disabled = false;
        $("filename").closest("details").open = true;
        changed(); render(); announce("New diagram: choose a filename, then save.");
    } catch (error) { announce(error.message); } });
});
$("save").addEventListener("click", async () => {
    if (operation) return;
    if (!validFields()) return;
    await coordinate(async () => { try {
        const name = $("filename").value.trim();
        const submitted = diagram, snapshot = JSON.stringify(diagram), generation = editGeneration;
        const result = await request("/api/save", { method: "POST", headers: { "content-type": "application/json" },
            body: JSON.stringify({ name, document: JSON.parse(snapshot), revision: name === loadedName ? revision : null }) });
        if (diagram !== submitted) return;
        revision = result.revision; loadedName = name; dirty = editGeneration !== generation || JSON.stringify(diagram) !== snapshot;
        updateHeader();
        if (!dirty) $("filename").closest("details").open = false;
        announce(dirty ? `Saved ${name}; newer changes are unsaved.` : `Saved ${name}. No code or runtime was changed.`);
    } catch (error) { announce(error.message); } });
});
window.addEventListener("beforeunload", event => { if (dirty || operation) event.preventDefault(); });
await coordinate(async () => { try {
    const config = await request("/api/config");
    workspaceRoot = config.workspaceRoot;
    await openFile(config.initialFile);
} catch (error) {
    $("document-title").textContent = "Unable to open diagram";
    announce(error.message);
} });
