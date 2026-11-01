import { createHash, randomUUID } from "node:crypto";
import { readFile, writeFile, rename, unlink, link } from "node:fs/promises";
import path from "node:path";
import { validateLayout, toSvg } from "./model.mjs";

export function layoutPath(file) {
    if (typeof file !== "string" || !path.isAbsolute(file) || path.extname(file).toLowerCase() !== ".json") throw new Error("Layout path must be an absolute .json path.");
    return path.resolve(file);
}

export function alternativePath(current, name) {
    if (typeof name !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(name)) throw new Error("Use a file name containing only letters, numbers, hyphens, and underscores.");
    return path.join(path.dirname(current), `${name}.json`);
}

function hash(data) {
    return createHash("sha256").update(data).digest("hex");
}

export async function load(file) {
    const target = layoutPath(file);
    const data = await readFile(target, "utf8");
    let parsed;
    try { parsed = JSON.parse(data); } catch (error) { throw new Error(`Invalid JSON in ${target}: ${error.message}`); }
    validateLayout(parsed);
    return { path: target, layout: parsed, hash: hash(data) };
}

async function atomicReplace(target, content) {
    const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${randomUUID()}.tmp`);
    await writeFile(temporary, content, { encoding: "utf8", flag: "wx" });
    try { await rename(temporary, target); } catch (error) {
        await unlink(temporary).catch(() => {});
        throw error;
    }
}

export async function save(file, layout, expectedHash) {
    const target = layoutPath(file);
    validateLayout(layout);
    const current = await readFile(target, "utf8");
    if (hash(current) !== expectedHash) throw new Error("The layout file changed on disk. Reopen it before saving to avoid overwriting changes.");
    const data = `${JSON.stringify(layout, null, 2)}\n`;
    await atomicReplace(target, data);
    return hash(data);
}

export async function saveAs(current, name, layout) {
    validateLayout(layout);
    const target = alternativePath(current, name);
    const data = `${JSON.stringify(layout, null, 2)}\n`;
    const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${randomUUID()}.tmp`);
    await writeFile(temporary, data, { encoding: "utf8", flag: "wx" });
    try { await link(temporary, target); } finally { await unlink(temporary); }
    return { path: target, hash: hash(data) };
}

export async function exportSvg(file, layout) {
    const target = layoutPath(file).slice(0, -5) + ".svg";
    await atomicReplace(target, toSvg(layout));
    return target;
}
