import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { findSelection, matchesBlock, summarize } from "./view.mjs";

const example = JSON.parse(await readFile(new URL("../../../data/process-diagrams/tea-example.json", import.meta.url), "utf8"));

test("overview summarizes evidence without altering the generic document", () => {
    const section = structuredClone(example.sections[0]);
    section.blocks.push({ ...section.blocks[0], id: "unknown", status: "unknown" });
    const original = structuredClone(section);
    assert.deepEqual(summarize(section), { current: 0, proposed: 2, unknown: 1 });
    assert.deepEqual(section, original);
    assert.deepEqual(summarize({ blocks: [] }), { current: 0, proposed: 0, unknown: 0 });
});

test("search covers descriptions, questions, sources and evidence status", () => {
    const block = { title: "Check", description: "Inspect inventory", notes: "Is stock fresh?", status: "unknown",
        sources: [{ path: "lib/stock.cs", symbol: "VerifyFreshness", line: 3 }] };
    for (const query of [" check ", "INVENTORY", "stock fresh", "lib/stock", "verifyfreshness", "unknown", " "])
        assert.equal(matchesBlock(block, query), true, query);
    assert.equal(matchesBlock(block, "absent"), false);
});

test("drill-down resolves sections and blocks by identity after reordering", () => {
    const doc = structuredClone(example);
    const section = doc.sections[0];
    const selection = { kind: "block", sectionId: section.id, blockId: "steep" };
    assert.equal(findSelection(doc, { kind: "diagram" }).item, doc);
    assert.equal(findSelection(doc, { kind: "section", sectionId: section.id }).item, section);
    const block = findSelection(doc, selection).item;
    section.blocks.reverse();
    assert.equal(findSelection(doc, selection).item, block);
    section.blocks = [];
    assert.equal(findSelection(doc, selection).kind, "section");
    doc.sections = [];
    assert.equal(findSelection(doc, selection).kind, "diagram");
});
