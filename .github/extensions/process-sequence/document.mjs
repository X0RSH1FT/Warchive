import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import path from "node:path";

export const FORMAT = "copilot-process-sequence";
export const VERSION = 1;
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
export const MAX_REQUEST_BYTES = MAX_DOCUMENT_BYTES + 256 * 1024;

function text(value, label, required = false) {
    if (typeof value !== "string" || value.length > 20000 || (required && !value.trim()))
        throw new Error(`${label} must be ${required ? "nonempty " : ""}text of at most 20000 characters`);
}

export function validateDocument(doc) {
    if (!doc || typeof doc !== "object" || Array.isArray(doc) || doc.format !== FORMAT || doc.version !== VERSION)
        throw new Error("Unrecognized process diagram format or version");
    text(doc.title, "Title", true);
    text(doc.notes, "Notes");
    if (typeof doc.sectionsOrderProposed !== "boolean" || !Array.isArray(doc.sections) || doc.sections.length > 100) throw new Error("Invalid sections");
    const ids = new Set();
    const checkId = id => {
        text(id, "ID", true);
        if (ids.has(id)) throw new Error("Duplicate ID");
        ids.add(id);
    };
    for (const section of doc.sections) {
        if (!section || typeof section !== "object") throw new Error("Invalid section");
        checkId(section.id);
        text(section.title, "Section title", true);
        text(section.notes, "Section notes");
        if (!["current", "proposed", "unknown"].includes(section.status)) throw new Error("Invalid section status");
        if (typeof section.orderProposed !== "boolean" || !Array.isArray(section.blocks) || section.blocks.length > 500)
            throw new Error("Invalid section order or blocks");
        for (const block of section.blocks) {
            if (!block || typeof block !== "object") throw new Error("Invalid block");
            checkId(block.id);
            text(block.title, "Block title", true);
            text(block.description, "Block description");
            text(block.notes, "Block notes");
            if (!["current", "proposed", "unknown"].includes(block.status)) throw new Error("Invalid block status");
            if (!Array.isArray(block.sources) || block.sources.length > 100) throw new Error("Invalid sources");
            for (const source of block.sources) {
                if (!source || typeof source !== "object") throw new Error("Invalid source");
                text(source.path, "Source path", true);
                text(source.symbol, "Source symbol");
                if (path.isAbsolute(source.path) || /[\\:?#]/.test(source.path) ||
                    source.path.split("/").some(part => !part || part === "." || part === "..") ||
                    !Number.isSafeInteger(source.line) || source.line < 1)
                    throw new Error("Sources must use a workspace-relative path and positive line");
            }
        }
    }
    if (Buffer.byteLength(JSON.stringify(doc)) > MAX_DOCUMENT_BYTES)
        throw new Error("Document exceeds the 4 MiB serialized document limit");
    return doc;
}

export function blankDocument(title = "Untitled process") {
    return { format: FORMAT, version: VERSION, title, notes: "", sectionsOrderProposed: false, sections: [] };
}

function filename(name) {
    if (typeof name !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}\.json$/.test(name))
        throw new Error("Filename must be a simple .json filename");
    return name;
}

const digest = value => createHash("sha256").update(value).digest("hex");

export function createStore(directory) {
    const target = name => path.join(directory, filename(name));
    async function read(name) {
        const raw = await readFile(target(name), "utf8");
        const document = validateDocument(JSON.parse(raw));
        return { document, revision: digest(raw) };
    }
    async function save(name, document, revision) {
        validateDocument(document);
        if (revision !== null && (typeof revision !== "string" || !/^[a-f0-9]{64}$/.test(revision)))
            throw new Error("Invalid revision");
        await mkdir(directory, { recursive: true });
        const file = target(name);
        const lock = `${file}.lock`;
        const temporary = `${file}.${randomUUID()}.tmp`;
        let handle;
        try {
            handle = await open(lock, "wx");
            let existing;
            try { existing = await read(name); }
            catch (error) { if (error.code !== "ENOENT") throw error; }
            if ((existing?.revision ?? null) !== revision)
                throw new Error("Document changed or already exists; reload it or choose another filename");
            const raw = JSON.stringify(document, null, 2) + "\n";
            await open(temporary, "wx").then(async fileHandle => {
                try { await fileHandle.writeFile(raw, "utf8"); } finally { await fileHandle.close(); }
            });
            await rename(temporary, file);
            return { document, revision: digest(raw) };
        } finally {
            if (handle) {
                await handle.close();
                await unlink(temporary).catch(error => { if (error.code !== "ENOENT") throw error; });
                await unlink(lock);
            }
        }
    }
    return { read, save };
}
