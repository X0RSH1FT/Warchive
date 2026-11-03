export function summarize(section) {
    const counts = { current: 0, proposed: 0, unknown: 0 };
    for (const block of section.blocks) counts[block.status]++;
    return counts;
}

export function matchesBlock(block, query) {
    const search = query.trim().toLocaleLowerCase();
    return !search || [block.title, block.description, block.notes, block.status,
        ...block.sources.flatMap(source => [source.path, source.symbol])]
        .some(value => value.toLocaleLowerCase().includes(search));
}

export function findSelection(diagram, selection) {
    if (!selection || selection.kind === "diagram") return { kind: "diagram", item: diagram };
    const section = diagram.sections.find(item => item.id === selection.sectionId);
    if (!section) return { kind: "diagram", item: diagram };
    if (selection.kind === "section") return { kind: "section", item: section, section };
    const block = section.blocks.find(item => item.id === selection.blockId);
    return block ? { kind: "block", item: block, section } : { kind: "section", item: section, section };
}
