import test from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import { startServer } from "./server.mjs";

function deferred() {
    let resolve, reject;
    const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
    return { promise, resolve, reject };
}

async function setup(t, store) {
    const entry = await startServer(store, "initial.json", "workspace");
    t.after(async () => {
        entry.server.closeAllConnections();
        await new Promise(resolve => entry.server.close(resolve));
    });
    const page = await (await fetch(entry.url)).text();
    const headers = { "x-canvas-token": /name="canvas-token" content="([^"]+)"/.exec(page)[1] };
    const config = async () => (await (await fetch(new URL("api/config", entry.url), { headers })).json()).initialFile;
    const select = (kind, name) => kind === "active"
        ? fetch(new URL(`api/active?name=${name}`, entry.url), { method: "POST", headers })
        : fetch(new URL("api/save", entry.url), {
            method: "POST", headers: { ...headers, "content-type": "application/json" },
            body: JSON.stringify({ name, document: {}, revision: null })
        });
    return { ...entry, headers, config, select };
}

for (const older of ["active", "save"]) for (const newer of ["active", "save"]) {
    test(`later ${newer} selection survives earlier ${older} completion`, async t => {
        const calls = new Map(["older.json", "newer.json"].map(name => [name, { started: deferred(), result: deferred() }]));
        const run = name => {
            const call = calls.get(name);
            call.started.resolve();
            return call.result.promise;
        };
        const { select, config } = await setup(t, { read: run, save: run });
        const first = select(older, "older.json");
        await calls.get("older.json").started.promise;
        const second = select(newer, "newer.json");
        await calls.get("newer.json").started.promise;
        calls.get("newer.json").result.resolve({ revision: "new" });
        assert.equal((await second).status, 200);
        calls.get("older.json").result.resolve({ revision: "old" });
        const response = await first;
        assert.equal(response.status, 200);
        if (older === "active") assert.equal((await response.json()).initialFile, "newer.json");
        assert.equal(await config(), "newer.json");
    });
}

test("failed newer selection does not prevent an older successful save", async t => {
    const saving = deferred(), started = deferred();
    const store = {
        read: async () => { throw new Error("Cannot read"); },
        save: () => { started.resolve(); return saving.promise; }
    };
    const { select, config } = await setup(t, store);
    const first = select("save", "older.json");
    await started.promise;
    const response = await select("active", "missing.json");
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /Cannot read/);
    saving.resolve({ revision: "saved" });
    assert.equal((await first).status, 200);
    assert.equal(await config(), "older.json");
});

test("failed newer save does not prevent an older successful selection", async t => {
    const reading = deferred(), started = deferred();
    const store = {
        read: () => { started.resolve(); return reading.promise; },
        save: async () => { throw new Error("Save conflict"); }
    };
    const { select, config } = await setup(t, store);
    const first = select("active", "older.json");
    await started.promise;
    const response = await select("save", "newer.json");
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /Save conflict/);
    reading.resolve({});
    assert.equal((await first).status, 200);
    assert.equal(await config(), "older.json");
});

test("failed older save reports its error without changing a newer selection", async t => {
    const saving = deferred(), started = deferred();
    const store = {
        read: async () => ({}),
        save: () => { started.resolve(); return saving.promise; }
    };
    const { select, config } = await setup(t, store);
    const first = select("save", "older.json");
    await started.promise;
    assert.equal((await select("active", "newer.json")).status, 200);
    saving.reject(new Error("Save conflict"));
    const response = await first;
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /Save conflict/);
    assert.equal(await config(), "newer.json");
});

test("save ordering starts before its request body is fully received", async t => {
    const { server, url, headers, select, config } = await setup(t, {
        read: async () => ({}),
        save: async () => ({ revision: "saved" })
    });
    const arrived = new Promise(resolve => server.once("request", resolve));
    const body = JSON.stringify({ name: "older.json", document: {}, revision: null });
    const response = deferred();
    const req = request(new URL("api/save", url), {
        method: "POST", headers: { ...headers, "content-type": "application/json" }
    }, res => { res.resume(); res.on("end", () => response.resolve(res.statusCode)); });
    req.on("error", response.reject);
    req.write(body.slice(0, 1));
    await arrived;
    assert.equal((await select("active", "newer.json")).status, 200);
    req.end(body.slice(1));
    assert.equal(await response.promise, 200);
    assert.equal(await config(), "newer.json");
});

test("loading a document does not select it", async t => {
    const { url, headers, config } = await setup(t, { read: async name => ({ name }) });
    const response = await fetch(new URL("api/document?name=other.json", url), { headers });
    assert.deepEqual(await response.json(), { name: "other.json" });
    assert.equal(await config(), "initial.json");
});
