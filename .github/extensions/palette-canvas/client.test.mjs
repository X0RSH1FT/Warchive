import test from "node:test";
import assert from "node:assert/strict";
import { browser, deferred, loadClient, response } from "../test-browser.mjs";

test("reordering retains the move control and switches direction at each boundary", async t => {
    const colors = ["A", "B", "C", "D"].map(name => ({ name, role: "", notes: "", hex: "#123456" }));
    const ui = browser(t, async () => response({ palette: { name: "Test", colors }, path: "one", revision: "a" }));
    await loadClient(new URL("./client.mjs", import.meta.url));
    const move = (index, direction) => ui.get("colors").children[index].lastElementChild.children[direction];
    await move(1, 1).fire("click");
    assert.equal(document.activeElement, move(2, 1));
    await document.activeElement.fire("click");
    assert.equal(document.activeElement, move(3, 0));
    await document.activeElement.fire("click");
    assert.equal(document.activeElement, move(2, 0));
    await document.activeElement.fire("click");
    await document.activeElement.fire("click");
    assert.equal(document.activeElement, move(0, 1));
    assert.equal(move(0, 0).disabled, true);
});

test("persistence disables palette edits and document switches until the response", async t => {
    const palette = { name: "Original", colors: [] };
    const save = deferred();
    let requests = 0;
    const ui = browser(t, async (url) => {
        requests++;
        if (url === "/api/current") return response({ palette, path: "one", revision: "a" });
        if (url === "/api/save") return save.promise;
        throw new Error(`unexpected ${url}`);
    });

    await loadClient(new URL("./client.mjs", import.meta.url));
    const pending = ui.get("save").fire("click");
    assert.equal(ui.get("editor").disabled, true);
    await ui.get("open").fire("click");
    assert.equal(requests, 2);
    save.resolve(response({ palette, path: "one", revision: "b" }));
    await pending;
    assert.equal(ui.get("editor").disabled, false);
    assert.match(ui.get("status").textContent, /saved/i);
});

test("invalid color controls are checked before disabling the editor", async t => {
    let requests = 0;
    const ui = browser(t, async () => {
        requests++;
        return response({ palette: { name: "Original", colors: [] }, path: "one", revision: "a" });
    });
    await loadClient(new URL("./client.mjs", import.meta.url));
    document.querySelectorAll = () => [{ checkValidity: () => false }];
    await ui.get("save").fire("click");
    assert.equal(requests, 1);
    assert.match(ui.get("status").textContent, /invalid color or opacity/);
    assert.equal(ui.get("editor").disabled, false);
});

test("invalid opacity survives name changes, adding and reordering until corrected", async t => {
    let saves = 0;
    const palette = { name: "Original", colors: [
        { name: "First", role: "", notes: "", hex: "#123456ff" },
        { name: "Second", role: "", notes: "", hex: "#abcdef80" },
    ] };
    const ui = browser(t, async url => {
        if (url === "/api/save") saves++;
        return response({ palette, path: "one", revision: "a" });
    });
    await loadClient(new URL("./client.mjs", import.meta.url));
    const card = index => ui.get("colors").children[index];
    const inputs = index => card(index).walk().filter(node => node.tagName === "INPUT");
    inputs(0)[4].value = "300";
    await inputs(0)[4].fire("input");
    inputs(0)[0].value = "Renamed";
    await inputs(0)[0].fire("input");
    assert.equal(inputs(0)[4].value, "300");
    assert.equal(inputs(0)[4].checkValidity(), false);
    await ui.get("add").fire("click");
    assert.equal(inputs(0)[4].value, "300");
    await card(0).walk().find(node => node.textContent === "Move down").fire("click");
    assert.equal(inputs(1)[4].value, "300");
    assert.equal(inputs(1)[4].checkValidity(), false);
    inputs(1)[4].value = "1e";
    await inputs(1)[4].fire("input");
    await ui.get("add").fire("click");
    assert.equal(inputs(1)[4].value, "1e");
    assert.equal(inputs(1)[4].checkValidity(), false);
    await ui.get("save").fire("click");
    assert.equal(saves, 0);
    inputs(1)[4].value = "128";
    await inputs(1)[4].fire("input");
    assert.equal(inputs(1)[4].checkValidity(), true);
    assert.equal(inputs(1)[2].value, "#12345680");
    await ui.get("save").fire("click");
    assert.equal(saves, 1);
});
