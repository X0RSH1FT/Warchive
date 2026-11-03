import test from "node:test";
import assert from "node:assert/strict";
import { blankDocument } from "./document.mjs";
import { startServer } from "./server.mjs";
import { browser, deferred, loadClient, response } from "../test-browser.mjs";

test("save keeps edits made in flight dirty and serializes document operations", async t => {
    const saving = deferred(), requests = [];
    const ui = browser(t, async (url, options = {}) => {
        requests.push({ url, options });
        if (url === "/api/config") return response({ workspaceRoot: "workspace", initialFile: "one.json" });
        if (url.startsWith("/api/document")) return response({ document: blankDocument("Original"), revision: "a" });
        if (url.startsWith("/api/active")) return response({});
        if (url === "/api/save") return requests.filter(item => item.url === "/api/save").length === 1 ? saving.promise : response({ revision: "c" });
        throw new Error(`unexpected ${url}`);
    });
    await loadClient(new URL("./ui.mjs", import.meta.url));
    const add = ui.get("view-actions").walk().find(node => node.textContent === "+ Section");
    await add.fire("click");
    const pending = ui.get("save").fire("click");
    assert.equal(ui.get("save").disabled, true);
    await ui.get("new").fire("click");
    await ui.get("save").fire("click");
    assert.equal(requests.filter(item => item.url === "/api/blank").length, 0);
    assert.equal(requests.filter(item => item.url === "/api/save").length, 1);
    const input = ui.get("inspector").querySelector("input");
    input.value = "Edited while saving";
    await input.fire("input");
    saving.resolve(response({ revision: "b" }));
    await pending;
    assert.equal(ui.get("save-state").textContent, "Unsaved changes");
    assert.match(ui.get("status").textContent, /newer changes are unsaved/);
    assert.equal(ui.get("save").disabled, false);
    const submitted = JSON.parse(requests.find(item => item.url === "/api/save").options.body);
    assert.equal(submitted.document.sections[0].title, "New section");
    await ui.get("save").fire("click");
    const next = JSON.parse(requests.filter(item => item.url === "/api/save")[1].options.body);
    assert.equal(next.revision, "b");
    assert.equal(next.document.sections[0].title, "Edited while saving");
    assert.equal(ui.get("save-state").textContent, "Saved");
});

test("editing while a document is opening does not discard the edit", async t => {
    const opening = deferred();
    let reads = 0;
    const ui = browser(t, async url => {
        if (url === "/api/config") return response({ workspaceRoot: "workspace", initialFile: "one.json" });
        if (url.startsWith("/api/active")) return response({});
        if (url.startsWith("/api/document")) {
            if (++reads === 1) return response({ document: blankDocument("Original"), revision: "a" });
            return opening.promise;
        }
        throw new Error(`unexpected ${url}`);
    });
    await loadClient(new URL("./ui.mjs", import.meta.url));
    ui.get("filename").value = "two.json";
    const pending = ui.get("open").fire("click");
    const add = ui.get("view-actions").walk().find(node => node.textContent === "+ Section");
    await add.fire("click");
    opening.resolve(response({ document: blankDocument("Other"), revision: "b" }));
    await pending;
    assert.equal(ui.get("document-title").textContent, "Original");
    assert.equal(ui.get("save-state").textContent, "Unsaved changes");
    assert.match(ui.get("status").textContent, /current edits were kept/);
});

for (const operation of ["open", "new", "save"]) {
    test(`invalid source draft entered during ${operation} remains unsaved`, async t => {
        const pendingResponse = deferred();
        const document = blankDocument("Original");
        document.sections.push({
            id: "section", title: "Section", status: "proposed", notes: "", orderProposed: false,
            blocks: [{ id: "block", title: "Block", status: "proposed", description: "", notes: "", sources: [] }]
        });
        let reads = 0;
        const ui = browser(t, async url => {
            if (url === "/api/config") return response({ workspaceRoot: "workspace", initialFile: "one.json" });
            if (url.startsWith("/api/active")) return response({});
            if (url.startsWith("/api/document")) return ++reads === 1 ? response({ document, revision: "a" }) : pendingResponse.promise;
            if (url === "/api/blank" || url === "/api/save") return pendingResponse.promise;
            throw new Error(`unexpected ${url}`);
        });
        await loadClient(new URL("./ui.mjs", import.meta.url));
        await ui.get("map").walk().find(node => node.dataset.sectionId === "section").fire("click");
        await ui.get("map").walk().find(node => node.dataset.blockId === "block").fire("click");
        await ui.get("inspector").walk().find(node => node.textContent === "Edit proposal").fire("click");
        const source = ui.get("inspector").walk().filter(node => node.tagName === "TEXTAREA").at(-1);
        const pending = ui.get(operation).fire("click");
        source.value = "unfinished source";
        await source.fire("input");
        assert.ok(source.validationMessage);
        pendingResponse.resolve(response(operation === "save" ? { revision: "b" } :
            operation === "new" ? blankDocument("Other") : { document: blankDocument("Other"), revision: "b" }));
        await pending;
        assert.equal(ui.get("document-title").textContent, "Original");
        assert.equal(ui.get("inspector").walk().includes(source), true);
        assert.equal(source.value, "unfinished source");
        assert.equal(ui.get("save-state").textContent, "Unsaved changes");
        assert.match(ui.get("status").textContent, operation === "save" ? /newer changes are unsaved/ : /current edits were kept/);
    });
}

test("a rejected open leaves the server's active file unchanged", async t => {
    const files = {
        "one.json": { document: blankDocument("Original"), revision: "a" },
        "two.json": { document: blankDocument("Other"), revision: "b" }
    };
    const entry = await startServer({ read: async name => {
        if (!files[name]) throw new Error("Unknown file");
        return files[name];
    } }, "one.json", "workspace");
    const nativeFetch = globalThis.fetch;
    t.after(async () => {
        entry.server.closeAllConnections();
        await new Promise(resolve => entry.server.close(resolve));
    });
    const page = await (await nativeFetch(entry.url)).text();
    const token = /name="canvas-token" content="([^"]+)"/.exec(page)[1];
    const headers = { "x-canvas-token": token };
    const readFinished = deferred(), release = deferred();
    let delayOpen = true;
    const ui = browser(t, async (url, options = {}) => {
        const result = await nativeFetch(new URL(url, entry.url), {
            ...options, headers: { ...options.headers, ...headers }
        });
        if (delayOpen && url === "/api/document?name=two.json") {
            readFinished.resolve();
            await release.promise;
        }
        return result;
    });
    await loadClient(new URL("./ui.mjs", import.meta.url));
    ui.get("filename").value = "two.json";
    const pending = ui.get("open").fire("click");
    await readFinished.promise;
    const add = ui.get("view-actions").walk().find(node => node.textContent === "+ Section");
    await add.fire("click");
    release.resolve();
    await pending;
    assert.equal(ui.get("document-title").textContent, "Original");
    assert.equal(ui.get("save-state").textContent, "Unsaved changes");
    assert.match(ui.get("status").textContent, /current edits were kept/);
    const config = async () => (await (await nativeFetch(new URL("/api/config", entry.url), { headers })).json()).initialFile;
    assert.equal(await config(), "one.json");

    delayOpen = false;
    await ui.get("open").fire("click");
    assert.equal(ui.get("document-title").textContent, "Other");
    assert.equal(await config(), "two.json");
});

test("an accepted open reports when its active file cannot be remembered", async t => {
    const ui = browser(t, async url => {
        if (url === "/api/config") return response({ workspaceRoot: "workspace", initialFile: "one.json" });
        if (url.startsWith("/api/document")) return response({ document: blankDocument("Original"), revision: "a" });
        if (url.startsWith("/api/active")) return { ok: false, status: 400, json: async () => ({ error: "Unavailable" }) };
        throw new Error(`unexpected ${url}`);
    });
    await loadClient(new URL("./ui.mjs", import.meta.url));
    assert.equal(ui.get("document-title").textContent, "Original");
    assert.equal(ui.get("save-state").textContent, "Saved");
    assert.match(ui.get("status").textContent, /could not be remembered for reopening: Unavailable/);
});
