import test from "node:test";
import assert from "node:assert/strict";
import { blankLayout } from "./model.mjs";
import { browser, deferred, loadClient, response } from "../test-browser.mjs";

test("field edits queue against the latest revision and preserve captured values", async t => {
    let state = { layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] };
    const first = deferred(), requests = [];
    const ui = browser(t, async (url, options) => {
        const input = JSON.parse(options.body);
        if (url.endsWith("get_state")) return response(state);
        requests.push(input);
        if (requests.length === 1) return first.promise;
        assert.equal(input.revision, 1);
        state = { ...state, layout: input.layout, revision: 2, dirty: true };
        return response(state);
    });

    await loadClient(new URL("./ui.js", import.meta.url));
    ui.get("layout-name").value = "New name";
    const one = ui.get("layout-name").fire("change");
    ui.get("provenance").value = "New provenance";
    const two = ui.get("provenance").fire("change");
    assert.equal(ui.main.inert, false);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(requests.length, 1);
    state = { ...state, layout: requests[0].layout, revision: 1, dirty: true };
    first.resolve(response(state));
    await Promise.all([one, two]);
    assert.equal(state.layout.name, "New name");
    assert.equal(state.layout.provenance, "New provenance");
    assert.equal(ui.main.inert, false);
});

test("queued edits retain focus, selection and newer uncommitted text", async t => {
    let state = { layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] };
    const first = deferred();
    let writes = 0;
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        if (++writes === 1) return first.promise;
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    const name = ui.get("layout-name"), provenance = ui.get("provenance");
    name.tagName = "INPUT";
    provenance.tagName = "TEXTAREA";
    name.focus();
    name.value = "First";
    await name.fire("input");
    const one = name.fire("change");
    provenance.focus();
    provenance.value = "Queued";
    await provenance.fire("input");
    const two = provenance.fire("change");
    provenance.value = "Queued plus more";
    provenance.setSelectionRange(2, 6, "backward");
    await provenance.fire("input");
    await new Promise(resolve => setImmediate(resolve));
    state = { ...state, layout: { ...state.layout, name: "First" }, revision: 1, dirty: true };
    first.resolve(response(state));
    await Promise.all([one, two]);
    assert.equal(document.activeElement, provenance);
    assert.deepEqual([provenance.value, provenance.selectionStart, provenance.selectionEnd, provenance.selectionDirection], ["Queued plus more", 2, 6, "backward"]);
    assert.equal(state.layout.provenance, "Queued");
    await provenance.fire("change");
    assert.equal(state.layout.provenance, "Queued plus more");
    assert.equal(document.activeElement, provenance);
});

test("a poll resolving after a field gains focus waits until editing ends", async t => {
    const initial = { layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] };
    const external = { ...initial, layout: { ...initial.layout, name: "External" }, revision: 1, path: "external" };
    const poll = deferred();
    let reads = 0;
    const ui = browser(t, async () => ++reads === 1 ? response(initial) : reads === 2 ? poll.promise : response(external));
    await loadClient(new URL("./ui.js", import.meta.url));
    const polling = ui.tick();
    const name = ui.get("layout-name");
    name.tagName = "INPUT";
    name.focus();
    name.value = "Typing";
    name.setSelectionRange(1, 3);
    poll.resolve(response(external));
    await polling;
    assert.equal(name.value, "Typing");
    assert.deepEqual([name.selectionStart, name.selectionEnd], [1, 3]);
    assert.equal(ui.get("file").textContent, "one - saved");
    await name.fire("input");
    name.blur();
    await ui.tick();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(name.value, "Typing");
    assert.equal(ui.get("file").textContent, "external - saved");
});

test("region keyboard selection survives a queued edit and updates on blur", async t => {
    const layout = blankLayout();
    layout.regions.push({ id: "one", label: "One", kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 0, anchorY: 0, x: 10, y: 10, width: 100, height: 100, stretchY: false, bottom: 0 });
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred();
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        await pending.promise;
        state = { ...state, layout: input.layout, revision: 1, dirty: true };
        return response(state);
    });
    const field = document.createElement("input");
    field.name = "label";
    ui.get("region-form").elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));
    field.value = "Renamed";
    await ui.get("region-form").fire("input", { target: field });
    const editing = ui.get("region-form").fire("change", { target: field });
    const selection = ui.get("selection");
    selection.tagName = "SELECT";
    selection.focus();
    const option = selection.children[0];
    pending.resolve();
    await editing;
    assert.equal(document.activeElement, selection);
    assert.equal(selection.children[0], option);
    selection.blur();
    await selection.fire("blur");
    assert.equal(selection.children[0].textContent, "Renamed");
    assert.equal(state.layout.regions[0].label, "Renamed");
});

test("simulated change before blur queues a region draft for its original region", async t => {
    const layout = blankLayout();
    const region = id => ({ id, label: id, kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 0, anchorY: 0, x: 0, y: 0, width: 10, height: 10, stretchY: false, bottom: 0 });
    layout.regions.push(region("one"), region("two"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred(), requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        requests.push(input);
        if (requests.length === 1) await pending.promise;
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const form = ui.get("region-form");
    const field = document.createElement("input");
    field.name = "label";
    form.elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));

    ui.get("layout-name").value = "Pending";
    const first = ui.get("layout-name").fire("change");
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(requests.length, 1);
    field.focus();
    field.value = "Edited one";
    field.setSelectionRange(2, 6, "backward");
    await form.fire("input", { target: field });
    assert.deepEqual([document.activeElement, field.value, field.selectionStart, field.selectionEnd, field.selectionDirection], [field, "Edited one", 2, 6, "backward"]);

    // Explicitly simulate change before blur; the mock does not produce native events.
    const commit = form.fire("change", { target: field });
    field.blur();
    const selection = ui.get("selection");
    selection.tagName = "SELECT";
    selection.focus();
    selection.value = "two";
    await selection.fire("change");
    assert.equal(field.value, "two");
    assert.equal(requests.length, 1);

    pending.resolve();
    await Promise.all([first, commit]);
    assert.deepEqual(state.layout.regions.map(item => item.label), ["Edited one", "two"]);
    assert.deepEqual(requests.map(input => input.revision), [0, 1]);
    assert.equal(field.value, "two");
    selection.value = "one";
    await selection.fire("change");
    assert.equal(field.value, "Edited one");
});

test("failed field edits prevent saving an unseen older value", async t => {
    const state = { layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] };
    const requests = [];
    const ui = browser(t, async url => {
        if (url.endsWith("get_state")) return response(state);
        requests.push(url);
        return { ok: false, status: 400, json: async () => ({ error: "Invalid field" }) };
    });

    await loadClient(new URL("./ui.js", import.meta.url));
    const name = ui.get("layout-name");
    name.value = "invalid";
    await name.fire("input");
    await name.fire("change");
    await ui.get("save").fire("click");
    assert.equal(requests.length, 1);
    assert.match(ui.get("status").textContent, /Finish or correct/);
    assert.equal(name.value, "invalid");
});

test("a failed region edit remains recoverable after selecting another region", async t => {
    const layout = blankLayout();
    const region = id => ({ id, label: id, kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 0, anchorY: 0, x: 0, y: 0, width: 10, height: 10, stretchY: false, bottom: 0 });
    layout.regions.push(region("one"), region("two"));
    const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const ui = browser(t, async url => url.endsWith("get_state") ? response(state) : { ok: false, status: 400, json: async () => ({ error: "Invalid label" }) });
    const field = document.createElement("input");
    field.name = "label";
    ui.get("region-form").elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));
    field.value = "unsaved";
    await ui.get("region-form").fire("input", { target: field });
    await ui.get("region-form").fire("change", { target: field });
    const selection = ui.get("selection");
    selection.value = "two";
    await selection.fire("change");
    assert.equal(field.value, "two");
    selection.value = "one";
    await selection.fire("change");
    assert.equal(field.value, "unsaved");
    assert.match(ui.get("status").textContent, /Invalid label/);
});

test("queued failures remain visible when a later queued edit succeeds", async t => {
    let state = { layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] };
    const first = deferred();
    let writes = 0;
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        if (++writes === 1) return first.promise;
        const input = JSON.parse(options.body);
        state = { ...state, layout: input.layout, revision: 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    ui.get("layout-name").value = "bad";
    const one = ui.get("layout-name").fire("change");
    ui.get("provenance").value = "good";
    const two = ui.get("provenance").fire("change");
    first.resolve({ ok: false, status: 400, json: async () => ({ error: "Invalid name" }) });
    await Promise.all([one, two]);
    assert.match(ui.get("status").textContent, /Invalid name/);
    assert.equal(state.layout.provenance, "good");
});

test("a delayed polling response cannot revert a completed edit", async t => {
    let state = { layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] };
    const polling = deferred();
    let reads = 0;
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return ++reads === 1 ? response(state) : polling.promise;
        const input = JSON.parse(options.body);
        state = { ...state, layout: input.layout, revision: 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    ui.tick();
    ui.get("layout-name").value = "Changed";
    await ui.get("layout-name").fire("change");
    polling.resolve(response({ layout: blankLayout(), revision: 0, dirty: false, path: "one", warnings: [] }));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(ui.get("layout-name").value, "Changed");
    assert.match(ui.get("file").textContent, /unsaved/);
});

test("a poll started before a drag cannot replace the captured preview", async t => {
    const layout = blankLayout();
    layout.regions.push({ id: "one", label: "One", kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 0, anchorY: 0, x: 10, y: 10, width: 100, height: 100, stretchY: false, bottom: 0 });
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const polling = deferred();
    let reads = 0, replacement;
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return ++reads === 1 ? response(state) : polling.promise;
        replacement = JSON.parse(options.body);
        state = { ...state, layout: replacement.layout, revision: 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    ui.tick();
    const region = ui.get("preview").children[0];
    await region.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    polling.resolve(response({ ...state, revision: 1, path: "changed" }));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(ui.get("preview").children[0], region);
    await region.fire("pointerup", { clientX: 10, clientY: 0 });
    assert.equal(replacement.revision, 0);
    assert.ok(replacement.layout.regions[0].x > 10);
    assert.match(ui.get("file").textContent, /unsaved/);
});

const region = id => ({ id, label: id, kind: "Panel", purpose: "", information: "", interactions: "", questions: "", anchorX: 0, anchorY: 0, x: 10, y: 10, width: 100, height: 100, stretchY: false, bottom: 0 });

test("a preview click selects without writing and restores rounded-away movement", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] }, requests = [];
    const ui = browser(t, async (url, options) => {
        if (!url.endsWith("get_state")) requests.push(JSON.parse(options.body));
        return response(state);
    });
    const field = document.createElement("input");
    field.name = "label";
    ui.get("region-form").elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));
    const selection = ui.get("selection"), options = [...selection.children];
    selection.tagName = "SELECT";
    selection.focus();
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    await box.fire("pointermove", { clientX: 10, clientY: 0 });
    assert.notEqual(box.style.left, "10px");
    await box.fire("pointerup", { clientX: 0.1, clientY: 0 });
    assert.deepEqual(requests, []);
    assert.equal(state.revision, 0);
    assert.equal(state.dirty, false);
    assert.equal(ui.get("file").textContent, "one - saved");
    assert.equal(document.activeElement, selection);
    assert.deepEqual(selection.children, options);
    assert.equal(selection.value, "two");
    assert.equal(field.value, "two");
    assert.equal(ui.get("preview").children[1].style.left, "10px");
    assert.match(ui.get("preview").children[1].className, /selected/);
});

for (const [name, geometry, dx, dy] of [
    ["minimum size", { width: 1, height: 1 }, -10, -10],
    ["maximum size", { width: 10000, height: 10000 }, 10, 10],
    ["maximum stretched bottom", { width: 1, stretchY: true, bottom: 10000 }, -10, -10],
    ["minimum stretched bottom", { width: 10000, stretchY: true, bottom: -10000 }, 10, 10],
]) {
    test(`a resize clamped at ${name} restores the preview without writing`, async t => {
        const layout = blankLayout();
        layout.regions.push({ ...region("one"), ...geometry });
        const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] }, requests = [];
        const ui = browser(t, async (url, options) => {
            if (!url.endsWith("get_state")) requests.push(JSON.parse(options.body));
            return response(state);
        });
        await loadClient(new URL("./ui.js", import.meta.url));
        const box = ui.get("preview").children[0], handle = box.children[0];
        const original = [box.style.width, box.style.height];
        await box.fire("pointerdown", { target: handle, button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
        await box.fire("pointermove", { clientX: dx, clientY: dy });
        await box.fire("pointerup", { clientX: dx, clientY: dy });
        assert.deepEqual(requests, []);
        assert.equal(state.revision, 0);
        assert.equal(state.dirty, false);
        assert.deepEqual([ui.get("preview").children[0].style.width, ui.get("preview").children[0].style.height], original);
    });
}

test("a real preview drag writes geometry once", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        requests.push(input);
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    const box = ui.get("preview").children[0];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    await box.fire("pointerup", { clientX: 10, clientY: 0 });
    assert.equal(requests.length, 1);
    assert.equal(requests[0].revision, 0);
    assert.ok(state.layout.regions[0].x > 10);
    assert.equal(state.revision, 1);
    assert.equal(state.dirty, true);
    assert.match(ui.get("file").textContent, /unsaved/);
});

test("preview drag updates a focused region selector without replacing its options", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const field = document.createElement("input");
    field.name = "label";
    ui.get("region-form").elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));

    const selection = ui.get("selection"), options = [...selection.children];
    selection.tagName = "SELECT";
    selection.focus();
    assert.equal(selection.value, "one");
    const box = ui.get("preview").children[1];
    let prevented = false;
    await box.fire("pointerdown", { button: 2, clientX: 0, clientY: 0, pointerId: 1, preventDefault() { prevented = true; } });
    assert.equal(prevented, false);
    assert.equal(selection.value, "one");
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(document.activeElement, selection);
    assert.equal(selection.value, "two");
    await box.fire("pointermove", { clientX: 10, clientY: 0 });
    await box.fire("pointerup", { clientX: 10, clientY: 0 });
    assert.equal(document.activeElement, selection);
    assert.deepEqual(selection.children, options);
    assert.equal(selection.value, "two");
    assert.equal(field.value, "two");
    assert.ok(state.layout.regions[1].x > 10);
    assert.match(ui.get("preview").children[1].className, /selected/);

    selection.value = "one";
    await selection.fire("change");
    assert.equal(document.activeElement, selection);
    assert.deepEqual(selection.children, options);
    assert.equal(selection.value, "one");
    assert.equal(field.value, "one");
    assert.match(ui.get("preview").children[0].className, /selected/);
});

test("preview selection adds a missing option when an add completes while the selector is focused", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred();
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        await pending.promise;
        state = { ...state, layout: input.layout, revision: 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    const selection = ui.get("selection"), originalOption = selection.children[0];
    selection.tagName = "SELECT";
    const adding = ui.get("add").fire("click");
    selection.focus();
    pending.resolve();
    await adding;
    assert.equal(selection.children.length, 1);

    const added = state.layout.regions[1], box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    assert.equal(document.activeElement, selection);
    assert.equal(selection.children[0], originalOption);
    assert.equal(selection.children[1].value, added.id);
    assert.equal(selection.children[1].textContent, added.label);
    assert.equal(selection.value, added.id);
    await box.fire("pointercancel");
    assert.equal(document.activeElement, selection);
    assert.equal(selection.value, added.id);
});

// Simulate the browser's synchronous change-before-focusout sequence for a text input.
function nativeTextField(form) {
    const field = document.createElement("input"), events = [], commits = [];
    field.name = "label";
    form.elements = [field];
    let baseline;
    field.focus = () => { document.activeElement = field; baseline = field.value; };
    const change = () => {
        baseline = field.value;
        events.push("change");
        commits.push(form.fire("change", { target: field }));
    };
    field.blur = () => {
        if (document.activeElement !== field) return;
        if (field.value !== baseline) change();
        document.activeElement = null;
        events.push("focusout");
        form.fire("focusout", { target: field });
    };
    return { field, events, commits, change };
}

for (const commitBeforePointerup of [true, false]) {
    test(`a preview click retains a blurred draft when its write completes ${commitBeforePointerup ? "before" : "after"} release`, async t => {
        const layout = blankLayout();
        layout.regions.push(region("one"), region("two"));
        let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
        const pending = deferred(), requests = [];
        const ui = browser(t, async (url, options) => {
            if (url.endsWith("get_state")) return response(state);
            const input = JSON.parse(options.body);
            requests.push(input);
            await pending.promise;
            state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
            return response(state);
        });
        const form = ui.get("region-form"), { field, commits } = nativeTextField(form);
        await loadClient(new URL("./ui.js", import.meta.url));
        field.focus();
        field.value = "Edited one";
        await form.fire("input", { target: field });
        const box = ui.get("preview").children[1];
        await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(requests.length, 1);
        let click;
        if (commitBeforePointerup) {
            pending.resolve();
            await commits[0];
            assert.equal(ui.get("preview").children[1], box);
            click = box.fire("pointerup", { clientX: 0, clientY: 0 });
        } else {
            click = box.fire("pointerup", { clientX: 0, clientY: 0 });
            field.focus();
            field.value = "Draft two";
            await form.fire("input", { target: field });
            pending.resolve();
        }
        await Promise.all([commits[0], click]);
        assert.equal(requests.length, 1);
        assert.equal(state.revision, 1);
        assert.deepEqual(state.layout.regions.map(item => item.label), ["Edited one", "two"]);
        assert.equal(ui.get("selection").value, "two");
        assert.equal(field.value, commitBeforePointerup ? "two" : "Draft two");
        assert.equal(ui.get("preview").children[0].textContent, "Edited one");
        assert.match(ui.get("preview").children[1].className, /selected/);
    });
}

test("a no-op click preserves a failed queued draft and its error", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred(), requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        requests.push(JSON.parse(options.body));
        return pending.promise;
    });
    const form = ui.get("region-form"), { field, commits } = nativeTextField(form);
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    field.value = "Draft one";
    await form.fire("input", { target: field });
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    const click = box.fire("pointerup", { clientX: 0, clientY: 0 });
    pending.resolve({ ok: false, status: 400, json: async () => ({ error: "Invalid label" }) });
    await Promise.all([commits[0], click]);
    assert.equal(requests.length, 1);
    assert.match(ui.get("status").textContent, /Invalid label/);
    assert.equal(state.revision, 0);
    const selection = ui.get("selection");
    selection.value = "one";
    await selection.fire("change");
    assert.equal(field.value, "Draft one");
});

for (const commitBeforePointerup of [true, false]) {
    test(`preview blur commits once ${commitBeforePointerup ? "before" : "after"} drag release and targets subsequent input`, async t => {
        const layout = blankLayout();
        layout.regions.push(region("one"), region("two"));
        let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
        const pending = deferred(), requests = [];
        const ui = browser(t, async (url, options) => {
            if (url.endsWith("get_state")) return response(state);
            const input = JSON.parse(options.body);
            requests.push(input);
            if (requests.length === 1) await pending.promise;
            assert.equal(input.revision, state.revision);
            state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
            return response(state);
        });
        const form = ui.get("region-form"), { field, events, commits } = nativeTextField(form);
        await loadClient(new URL("./ui.js", import.meta.url));
        field.focus();
        field.value = "Edited one";
        await form.fire("input", { target: field });
        const box = ui.get("preview").children[1];
        let prevented = false;
        await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() { prevented = true; } });
        assert.equal(prevented, true);
        assert.equal(document.activeElement, null);
        assert.deepEqual(events, ["change", "focusout"]);
        assert.equal(field.value, "two");
        assert.equal(ui.get("selection").value, "two");
        assert.match(box.className, /selected/);
        assert.equal(ui.get("preview").children[1], box);
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(requests.length, 1);
        assert.equal(requests[0].layout.regions[0].label, "Edited one");

        let drag;
        if (commitBeforePointerup) {
            pending.resolve();
            await commits[0];
            assert.equal(ui.get("preview").children[1], box);
            drag = box.fire("pointerup", { clientX: 10, clientY: 0 });
        } else {
            drag = box.fire("pointerup", { clientX: 10, clientY: 0 });
            field.focus();
            field.value = "Edited two";
            await form.fire("input", { target: field });
            pending.resolve();
        }
        await Promise.all([commits[0], drag]);
        assert.deepEqual(requests.map(input => input.revision), [0, 1]);
        assert.deepEqual(state.layout.regions.map(item => item.label), ["Edited one", "two"]);
        assert.ok(state.layout.regions[1].x > 10);
        assert.equal(ui.get("selection").value, "two");
        if (commitBeforePointerup) {
            assert.equal(field.value, "two");
            field.focus();
        } else {
            assert.equal(field.value, "Edited two");
        }
        field.value = "Edited two";
        await form.fire("input", { target: field });
        field.blur();
        await commits[1];
        assert.deepEqual(events, ["change", "focusout", "change", "focusout"]);
        assert.deepEqual(requests.map(input => input.revision), [0, 1, 2]);
        assert.deepEqual(state.layout.regions.map(item => item.label), ["Edited one", "Edited two"]);
    });
}

test("preview blur without a change updates selection; selecting the same region retains focus", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const ui = browser(t, async () => response(state));
    const { field, events, commits } = nativeTextField(ui.get("region-form"));
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    let box = ui.get("preview").children[0];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    assert.equal(document.activeElement, field);
    await box.fire("pointercancel");
    box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    assert.deepEqual(events, ["focusout"]);
    assert.equal(commits.length, 0);
    assert.equal(field.value, "two");
    await box.fire("pointercancel");
    assert.equal(field.value, "two");
});

test("preview blur does not repeat an already delivered native change", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        requests.push(input);
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const form = ui.get("region-form"), { field, events, commits, change } = nativeTextField(form);
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    field.value = "Edited one";
    await form.fire("input", { target: field });
    change();
    await commits[0];
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    assert.deepEqual(events, ["change", "focusout"]);
    assert.equal(field.value, "two");
    await box.fire("pointercancel");
    assert.equal(requests.length, 1);
    assert.equal(state.layout.regions[0].label, "Edited one");
});

test("edits made during a drag queue between the blurred draft and drag using current revisions", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred(), requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        requests.push(input);
        if (requests.length === 1) await pending.promise;
        assert.equal(input.revision, state.revision);
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const form = ui.get("region-form"), { field, commits } = nativeTextField(form);
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    field.value = "Edited one";
    await form.fire("input", { target: field });
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    field.focus();
    field.value = "Edited two";
    await form.fire("input", { target: field });
    field.blur();
    const drag = box.fire("pointerup", { clientX: 10, clientY: 0 });
    pending.resolve();
    await Promise.all([...commits, drag]);
    assert.deepEqual(requests.map(input => input.revision), [0, 1, 2]);
    assert.deepEqual(state.layout.regions.map(item => item.label), ["Edited one", "Edited two"]);
    assert.ok(state.layout.regions[1].x > 10);
    assert.equal(field.value, "Edited two");
});

for (const failing of ["field", "drag"]) {
    test(`preview selection preserves drafts and targeting when the ${failing} write fails`, async t => {
        const layout = blankLayout();
        layout.regions.push(region("one"), region("two"));
        let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
        const pending = deferred(), requests = [];
        const ui = browser(t, async (url, options) => {
            if (url.endsWith("get_state")) return response(state);
            if (!url.endsWith("replace_layout")) throw new Error("Unexpected save");
            const input = JSON.parse(options.body);
            requests.push(input);
            if (requests.length === 1) await pending.promise;
            if (requests.length === (failing === "field" ? 1 : 2)) {
                return { ok: false, status: 400, json: async () => ({ error: `Invalid ${failing}` }) };
            }
            assert.equal(input.revision, state.revision);
            state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
            return response(state);
        });
        const form = ui.get("region-form"), { field, events, commits } = nativeTextField(form);
        await loadClient(new URL("./ui.js", import.meta.url));
        field.focus();
        field.value = "Edited one";
        await form.fire("input", { target: field });
        const box = ui.get("preview").children[1];
        await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
        const drag = box.fire("pointerup", { clientX: 10, clientY: 0 });
        pending.resolve();
        await Promise.all([commits[0], drag]);
        assert.deepEqual(events, ["change", "focusout"]);
        assert.match(ui.get("status").textContent, new RegExp(`Invalid ${failing}`));
        assert.equal(field.value, "two");
        assert.deepEqual(requests.map(input => input.revision), failing === "field" ? [0, 0] : [0, 1]);
        if (failing === "field") {
            await ui.get("save").fire("click");
            assert.match(ui.get("status").textContent, /Finish or correct/);
        }
        field.focus();
        field.value = "Edited two";
        await form.fire("input", { target: field });
        field.blur();
        await commits[1];
        assert.equal(state.layout.regions[1].label, "Edited two");
        const selection = ui.get("selection");
        selection.value = "one";
        await selection.fire("change");
        assert.equal(field.value, "Edited one");
        if (failing === "field") {
            field.focus();
            field.value = "Corrected one";
            await form.fire("input", { target: field });
            field.blur();
            await commits[2];
            assert.deepEqual(state.layout.regions.map(item => item.label), ["Corrected one", "Edited two"]);
        }
    });
}

test("a failed blur commit during a drag keeps the captured preview and recoverable draft", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred();
    const ui = browser(t, async url => {
        if (url.endsWith("get_state")) return response(state);
        return pending.promise;
    });
    const form = ui.get("region-form"), { field, commits } = nativeTextField(form);
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    field.value = "Draft one";
    await form.fire("input", { target: field });
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    pending.resolve({ ok: false, status: 400, json: async () => ({ error: "Invalid label" }) });
    await commits[0];
    assert.equal(ui.get("preview").children[1], box);
    assert.equal(field.value, "two");
    assert.match(ui.get("status").textContent, /Invalid label/);
    await box.fire("pointercancel");
    const selection = ui.get("selection");
    selection.value = "one";
    await selection.fire("change");
    assert.equal(field.value, "Draft one");
    await ui.get("save").fire("click");
    assert.match(ui.get("status").textContent, /Finish or correct/);
});

test("a poll started before a canceled preview drag cannot replace the selection", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    const state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const poll = deferred();
    let reads = 0;
    const ui = browser(t, async () => ++reads === 1 ? response(state) : poll.promise);
    await loadClient(new URL("./ui.js", import.meta.url));
    const polling = ui.tick();
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    await box.fire("pointercancel");
    poll.resolve(response({ ...state, revision: 1, path: "stale" }));
    await polling;
    assert.equal(ui.get("selection").value, "two");
    assert.equal(ui.get("file").textContent, "one - saved");
});

for (const succeeds of [true, false]) {
test(`switching back preserves newer input when the earlier edit ${succeeds ? "succeeds" : "fails"}`, async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred();
    let writes = 0;
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        if (++writes === 1) {
            await pending.promise;
            if (!succeeds) return { ok: false, status: 400, json: async () => ({ error: "Invalid label" }) };
        }
        assert.equal(input.revision, state.revision);
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const form = ui.get("region-form"), field = document.createElement("input");
    field.name = "label";
    form.elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    field.value = "First draft";
    await form.fire("input", { target: field });
    const box = ui.get("preview").children[1];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    await box.fire("pointercancel");
    const commit = form.fire("change", { target: field });
    const selection = ui.get("selection");
    selection.value = "one";
    await selection.fire("change");
    field.value = "Newer draft";
    await form.fire("input", { target: field });
    pending.resolve();
    await commit;
    if (!succeeds) assert.match(ui.get("status").textContent, /Invalid label/);
    field.blur();
    await form.fire("focusout", { target: field });
    selection.value = "two";
    await selection.fire("change");
    assert.equal(field.value, "two");
    selection.value = "one";
    await selection.fire("change");
    assert.equal(field.value, "Newer draft");
    await ui.get("save").fire("click");
    assert.match(ui.get("status").textContent, /Finish or correct/);
    await form.fire("change", { target: field });
    assert.deepEqual(state.layout.regions.map(item => item.label), ["Newer draft", "two"]);
});
}

test("a resize queued behind a field change uses the latest region dimensions", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const pending = deferred(), requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        requests.push(input);
        if (requests.length === 1) await pending.promise;
        assert.equal(input.revision, state.revision);
        state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const form = ui.get("region-form"), field = document.createElement("input");
    field.name = "width";
    field.type = "number";
    form.elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));
    field.focus();
    field.value = "200";
    await form.fire("input", { target: field });
    const box = ui.get("preview").children[0], handle = box.children[0];
    await box.fire("pointerdown", { target: handle, button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    const commit = form.fire("change", { target: field });
    const drag = box.fire("pointerup", { clientX: 10, clientY: 0 });
    pending.resolve();
    await Promise.all([commit, drag]);
    assert.deepEqual(requests.map(input => input.revision), [0, 1]);
    assert.ok(state.layout.regions[0].width > 200);
});

for (const [initialWidth, editedWidth, writes] of [[10000, 9990, 2], [9990, 10000, 1]]) {
    test(`a queued resize checks the clamp against the latest width ${editedWidth}`, async t => {
        const layout = blankLayout();
        layout.regions.push({ ...region("one"), width: initialWidth });
        let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
        const pending = deferred(), requests = [];
        const ui = browser(t, async (url, options) => {
            if (url.endsWith("get_state")) return response(state);
            const input = JSON.parse(options.body);
            requests.push(input);
            if (requests.length === 1) await pending.promise;
            assert.equal(input.revision, state.revision);
            state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
            return response(state);
        });
        const form = ui.get("region-form"), field = document.createElement("input");
        field.name = "width";
        field.type = "number";
        form.elements = [field];
        await loadClient(new URL("./ui.js", import.meta.url));
        const box = ui.get("preview").children[0];
        await box.fire("pointerdown", { target: box.children[0], button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
        field.value = String(editedWidth);
        await form.fire("input", { target: field });
        const commit = form.fire("change", { target: field });
        const resize = box.fire("pointerup", { clientX: 10, clientY: 0 });
        pending.resolve();
        await Promise.all([commit, resize]);
        assert.equal(requests.length, writes);
        assert.equal(state.revision, writes);
        assert.equal(state.layout.regions[0].width, 10000);
        assert.equal(ui.get("preview").children[0].style.width, "10000px");
    });
}

for (const action of ["new", "open"]) {
    for (const succeeds of [true, false]) {
        test(`${action} locks queued transitions and ${succeeds ? "discards" : "retains"} old drafts`, async t => {
            const layout = blankLayout();
            layout.regions.push(region("old"));
            let state = { layout, revision: 0, dirty: false, path: "old", warnings: [] };
            const prior = deferred(), switching = deferred(), requests = [];
            const ui = browser(t, async (url, options) => {
                if (url.endsWith("get_state")) return response(state);
                const name = url.split("/").at(-1), input = JSON.parse(options.body);
                requests.push({ name, input });
                if (name === "replace_layout" && requests.length === 1) {
                    await prior.promise;
                    state = { ...state, layout: input.layout, revision: 1, dirty: true };
                } else if (name === "new_layout" || name === "open_layout") {
                    await switching.promise;
                    if (!succeeds) return { ok: false, status: 400, json: async () => ({ error: "Switch failed" }) };
                    state = { ...state, layout: blankLayout(), revision: 2, path: "new", dirty: false };
                } else if (name === "replace_layout") {
                    state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
                }
                return response(state);
            });
            const field = document.createElement("input");
            field.name = "label";
            ui.get("region-form").elements = [field];
            await loadClient(new URL("./ui.js", import.meta.url));
            ui.get("layout-name").value = "Queued";
            const writing = ui.get("layout-name").fire("change");
            field.focus();
            field.value = "Old draft";
            await ui.get("region-form").fire("input", { target: field });
            const changing = ui.get(action).fire("click");
            assert.equal(ui.main.inert, true);
            assert.equal(ui.toolbar.inert, true);
            await ui.get("region-form").fire("change", { target: field });
            await ui.get("new").fire("click");
            prior.resolve();
            await writing;
            await new Promise(resolve => setImmediate(resolve));
            assert.deepEqual(requests.map(request => request.name), ["replace_layout", action === "new" ? "new_layout" : "open_layout"]);
            assert.equal(ui.main.inert, true);
            switching.resolve();
            await changing;
            assert.equal(ui.main.inert, false);
            assert.equal(ui.toolbar.inert, false);
            if (succeeds) {
                assert.equal(field.value, "");
                await ui.get("save").fire("click");
                assert.equal(requests.at(-1).name, "save");
            } else {
                assert.equal(field.value, "Old draft");
                assert.match(ui.get("status").textContent, /Switch failed/);
                await ui.get("save").fire("click");
                assert.match(ui.get("status").textContent, /Finish or correct/);
                await ui.get("region-form").fire("change", { target: field });
                assert.equal(state.layout.regions[0].label, "Old draft");
                await ui.get("save").fire("click");
                assert.equal(requests.at(-1).name, "save");
            }
        });
    }
}

test("removing one region preserves drafts belonging to another region", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"), region("two"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        const input = JSON.parse(options.body);
        if (url.endsWith("replace_layout")) state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
        return response(state);
    });
    const field = document.createElement("input");
    field.name = "label";
    ui.get("region-form").elements = [field];
    await loadClient(new URL("./ui.js", import.meta.url));
    field.value = "One draft";
    await ui.get("region-form").fire("input", { target: field });
    ui.get("selection").value = "two";
    await ui.get("selection").fire("change");
    field.value = "Two draft";
    await ui.get("region-form").fire("input", { target: field });
    await ui.get("remove").fire("click");
    assert.equal(field.value, "One draft");
    await ui.get("save").fire("click");
    assert.match(ui.get("status").textContent, /Finish or correct/);
    await ui.get("region-form").fire("change", { target: field });
    assert.equal(state.layout.regions[0].label, "One draft");
});

test("document switches and removal wait for a drag to finish", async t => {
    const layout = blankLayout();
    layout.regions.push(region("one"));
    let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
    const requests = [];
    const ui = browser(t, async (url, options) => {
        if (url.endsWith("get_state")) return response(state);
        requests.push(url);
        const input = JSON.parse(options.body);
        state = { ...state, layout: input.layout, revision: 1, dirty: true };
        return response(state);
    });
    await loadClient(new URL("./ui.js", import.meta.url));
    const box = ui.get("preview").children[0];
    await box.fire("pointerdown", { button: 0, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} });
    await ui.get("new").fire("click");
    await ui.get("remove").fire("click");
    assert.match(ui.get("status").textContent, /Finish the current drag/);
    assert.equal(requests.length, 0);
    assert.equal(ui.main.inert, false);
    await box.fire("pointerup", { clientX: 10, clientY: 0 });
    assert.equal(requests.length, 1);
    assert.ok(state.layout.regions[0].x > 10);
});

for (const succeeds of [true, false]) {
    test(`remove locks editing and ${succeeds ? "clears removed" : "retains failed"} region drafts`, async t => {
        const layout = blankLayout();
        layout.regions.push(region("one"), region("two"));
        let state = { layout, revision: 0, dirty: false, path: "one", warnings: [] };
        const removal = deferred(), requests = [];
        const ui = browser(t, async (url, options) => {
            if (url.endsWith("get_state")) return response(state);
            const name = url.split("/").at(-1), input = JSON.parse(options.body);
            requests.push({ name, input });
            if (name === "replace_layout") {
                if (requests.length === 1) {
                    await removal.promise;
                    if (!succeeds) return { ok: false, status: 400, json: async () => ({ error: "Remove failed" }) };
                }
                state = { ...state, layout: input.layout, revision: state.revision + 1, dirty: true };
            }
            return response(state);
        });
        const field = document.createElement("input");
        field.name = "label";
        ui.get("region-form").elements = [field];
        await loadClient(new URL("./ui.js", import.meta.url));
        field.focus();
        field.value = "Draft";
        await ui.get("region-form").fire("input", { target: field });
        const removing = ui.get("remove").fire("click");
        assert.equal(ui.main.inert, true);
        assert.equal(ui.toolbar.inert, true);
        await ui.get("region-form").fire("input", { target: field });
        await ui.get("region-form").fire("change", { target: field });
        ui.get("selection").value = "two";
        await ui.get("selection").fire("change");
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(requests.length, 1);
        removal.resolve();
        await removing;
        assert.equal(ui.main.inert, false);
        assert.equal(ui.toolbar.inert, false);
        if (succeeds) {
            assert.deepEqual(state.layout.regions.map(item => item.id), ["two"]);
            assert.equal(field.value, "two");
            await ui.get("save").fire("click");
            assert.equal(requests.at(-1).name, "save");
        } else {
            assert.equal(field.value, "Draft");
            assert.match(ui.get("status").textContent, /Remove failed/);
            await ui.get("save").fire("click");
            assert.match(ui.get("status").textContent, /Finish or correct/);
            await ui.get("region-form").fire("change", { target: field });
            assert.equal(state.layout.regions[0].label, "Draft");
            await ui.get("save").fire("click");
            assert.equal(requests.at(-1).name, "save");
        }
    });
}
