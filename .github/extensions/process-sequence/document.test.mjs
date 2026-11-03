import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blankDocument, createStore, validateDocument, MAX_DOCUMENT_BYTES, MAX_REQUEST_BYTES } from "./document.mjs";
import { startServer } from "./server.mjs";
import { splitJson } from "../test-http.mjs";

const examples = fileURLToPath(new URL("../../../data/process-diagrams/", import.meta.url));

test("both the Rx0 and generic examples validate", async () => {
    for (const name of ["rx0-lifecycle.json", "tea-example.json"]) {
        const doc = JSON.parse(await readFile(path.join(examples, name), "utf8"));
        assert.equal(validateDocument(doc), doc);
        assert.ok(doc.sections.length);
    }
});

test("Rx0 example source references resolve to existing lines", async () => {
    const workspace = fileURLToPath(new URL("../../../", import.meta.url));
    const doc = JSON.parse(await readFile(path.join(examples, "rx0-lifecycle.json"), "utf8"));
    for (const section of doc.sections) for (const block of section.blocks) for (const source of block.sources) {
        const contents = await readFile(path.join(workspace, source.path), "utf8");
        assert.ok(source.line <= contents.split("\n").length, `${source.path}:${source.line}`);
    }
});

test("save, reopen, conflict, invalid data and filename handling", async t => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "process-sequence-test-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const store = createStore(directory);
    const doc = blankDocument("Coffee process");
    doc.sections.push({ id: "prepare", title: "Prepare", status: "proposed", notes: "Question", orderProposed: false,
        blocks: [{ id: "grind", title: "Grind", status: "proposed", description: "Grind beans", notes: "", sources: [] }] });
    const saved = await store.save("coffee.json", doc, null);
    assert.deepEqual(await store.read("coffee.json"), saved);
    doc.sections[0].blocks.push({ id: "brew", title: "Brew", status: "proposed", description: "", notes: "", sources: [] });
    const updated = await store.save("coffee.json", doc, saved.revision);
    assert.notEqual(updated.revision, saved.revision);
    await assert.rejects(store.save("coffee.json", doc, saved.revision), /changed or already exists/);
    await assert.rejects(store.save("coffee.json", doc, null), /changed or already exists/);
    await assert.rejects(store.read("../coffee.json"), /filename/);
    const invalid = structuredClone(doc);
    invalid.sections[0].blocks[0].sources.push({ path: "../outside", line: 1, symbol: "" });
    assert.throws(() => validateDocument(invalid), /workspace-relative/);
    invalid.sections[0].blocks[0].sources = [];
    invalid.sections[0].blocks[1].id = "grind";
    assert.throws(() => validateDocument(invalid), /Duplicate/);
    await writeFile(path.join(directory, "bad.json"), '{"format":"other","version":1}');
    await assert.rejects(store.save("bad.json", doc, null), /Unrecognized/);
    assert.equal(await readFile(path.join(directory, "bad.json"), "utf8"), '{"format":"other","version":1}');
});

test("HTTP canvas supports saved state and rejects unauthorized requests", async t => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "process-sequence-http-"));
    const store = createStore(directory);
    await store.save("first.json", blankDocument("First"), null);
    const entry = await startServer(store, "first.json", directory);
    t.after(async () => {
        entry.server.closeAllConnections();
        await new Promise(resolve => entry.server.close(resolve));
        await rm(directory, { recursive: true, force: true });
    });

    const page = await (await fetch(entry.url)).text();
    const token = /name="canvas-token" content="([^"]+)"/.exec(page)[1];
    assert.equal((await fetch(new URL("api/config", entry.url))).status, 403);
    const headers = { "x-canvas-token": token };
    const split = await splitJson(new URL("api/save", entry.url), { ...headers, "content-type": "application/json" },
        { name: "unicode.json", document: blankDocument("Café"), revision: null });
    assert.equal(split.status, 200);
    assert.equal((await store.read("unicode.json")).document.title, "Café");
    const oversized = await fetch(new URL("api/save", entry.url), {
        method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ name: "é".repeat(1_000_001) })
    });
    assert.equal(oversized.status, 400);
    assert.match(page, /aria-label="Diagram sections"/);
    assert.match(page, /aria-label="Selected item details"/);
    assert.match(await (await fetch(new URL("view.mjs", entry.url))).text(), /export function findSelection/);
    assert.match(await (await fetch(new URL("ui.mjs", entry.url))).text(), /from "\.\/view.mjs"/);
    const config = await (await fetch(new URL("api/config", entry.url), { headers })).json();
    assert.equal(config.initialFile, "unicode.json");
    const response = await fetch(new URL("api/save", entry.url), {
        method: "POST",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ name: "second.json", document: blankDocument("Second"), revision: null })
    });
    assert.equal(response.status, 200);
    assert.equal((await (await fetch(new URL("api/config", entry.url), { headers })).json()).initialFile, "second.json");
    assert.equal((await (await fetch(new URL("api/document?name=second.json", entry.url), { headers })).json()).document.title, "Second");
    assert.equal((await fetch(new URL("api/active?name=first.json", entry.url), { method: "POST" })).status, 403);
    assert.equal((await fetch(new URL("api/active?name=missing.json", entry.url), { method: "POST", headers })).status, 400);
    assert.equal((await (await fetch(new URL("api/config", entry.url), { headers })).json()).initialFile, "second.json");
    assert.equal((await fetch(new URL("api/active?name=first.json", entry.url), { method: "POST", headers })).status, 200);
    assert.equal((await (await fetch(new URL("api/config", entry.url), { headers })).json()).initialFile, "first.json");
    assert.equal((await fetch(new URL("api/document?name=second.json", entry.url), { headers: { ...headers, origin: "https://evil.example" } })).status, 403);
});

test("serialized document budget includes multibyte data and permits HTTP save and reopen", async t => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "process-budget-"));
    const store = createStore(directory);
    const entry = await startServer(store, "budget.json", directory);
    t.after(async () => {
        entry.server.closeAllConnections();
        await new Promise(resolve => entry.server.close(resolve));
        await rm(directory, { recursive: true, force: true });
    });
    const token = /name="canvas-token" content="([^"]+)"/.exec(await (await fetch(entry.url)).text())[1];
    const headers = { "x-canvas-token": token, "content-type": "application/json" };
    const doc = blankDocument("界\0");
    doc.notes = "é".repeat(20000);
    doc.extra = "";
    doc.extra = "x".repeat(MAX_DOCUMENT_BYTES - Buffer.byteLength(JSON.stringify(doc)));
    assert.equal(Buffer.byteLength(JSON.stringify(doc)), MAX_DOCUMENT_BYTES);
    validateDocument(doc);
    doc.extra += "x";
    assert.throws(() => validateDocument(doc), /serialized document limit/);
    doc.extra = doc.extra.slice(0, -1);
    const send = body => fetch(new URL("api/save", entry.url), { method: "POST", headers, body: JSON.stringify(body) });
    assert.equal((await send({ name: "budget.json", document: doc, revision: null })).status, 200);
    const loaded = await (await fetch(new URL("api/document?name=budget.json", entry.url), { headers })).json();
    assert.equal(loaded.document.title, doc.title);
    assert.equal(Buffer.byteLength(JSON.stringify(loaded.document)), MAX_DOCUMENT_BYTES);
    doc.extra += "x";
    const rejected = await send({ name: "budget.json", document: doc, revision: loaded.revision });
    assert.equal(rejected.status, 400);
    assert.match((await rejected.json()).error, /serialized document limit/);
    assert.equal((await store.read("budget.json")).revision, loaded.revision);
    const oversized = await send({ junk: "é".repeat(MAX_REQUEST_BYTES / 2) });
    assert.equal(oversized.status, 400);
    assert.match((await oversized.json()).error, /Request too large/);
});
