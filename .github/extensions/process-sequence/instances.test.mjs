import test from "node:test";
import assert from "node:assert/strict";
import { createInstances } from "./instances.mjs";

test("reopening an instance ignores the supplied filename, including during creation", async () => {
    let finish;
    const reads = [];
    const store = { read: file => { reads.push(file); return new Promise(resolve => { finish = resolve; }); } };
    let starts = 0, closed = 0;
    const entry = { url: "http://localhost/", server: { closeAllConnections() {}, close(done) { closed++; done(); } } };
    const instances = createInstances(store, async () => { starts++; return entry; }, "workspace");
    const first = instances.open("one", "first.json");
    const reopening = instances.open("one", "../invalid");
    finish();
    assert.equal(await first, entry);
    assert.equal(await reopening, entry);
    assert.equal(await instances.open("one", undefined), entry);
    assert.deepEqual(reads, ["first.json"]);
    assert.equal(starts, 1);
    assert.equal(closed, 0);
    await instances.close("one");
    assert.equal(closed, 1);
});

test("failed creation can be retried", async () => {
    const instances = createInstances({ read: async file => { if (!file) throw new Error("filename"); } },
        async () => ({ url: "ok" }), "workspace");
    await assert.rejects(instances.open("one"), /filename/);
    assert.equal((await instances.open("one", "valid.json")).url, "ok");
});
