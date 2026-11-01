import { createHash, randomUUID } from 'node:crypto';
import { open, readFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { formatColor } from './color.mjs';

export const MARKER = 'copilot-color-palette';
export const VERSION = 1;
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
export const MAX_REQUEST_BYTES = MAX_DOCUMENT_BYTES + 256 * 1024;

export function validatePalette(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
        value.format !== MARKER || value.version !== VERSION ||
        typeof value.name !== 'string' || !value.name.trim() ||
        !Array.isArray(value.colors)) {
        throw new Error('Invalid or unsupported palette: expected format, version 1, name, and colors.');
    }
    for (const [index, color] of value.colors.entries()) {
        if (!color || typeof color !== 'object' || Array.isArray(color) ||
            typeof color.name !== 'string' || typeof color.role !== 'string' ||
            typeof color.notes !== 'string' || typeof color.hex !== 'string') {
            throw new Error(`Invalid color at position ${index + 1}: name, role, notes, and hex must be strings.`);
        }
        try { formatColor(color.hex); }
        catch (error) { throw new Error(`Invalid color at position ${index + 1}: ${error.message}`); }
    }
    if (Buffer.byteLength(JSON.stringify(value)) > MAX_DOCUMENT_BYTES) {
        throw new Error('Palette exceeds the 4 MiB serialized document limit.');
    }
    return value;
}

export function validatePath(file) {
    if (typeof file !== 'string' || file.length > 32768 || !path.isAbsolute(file) || !file.toLowerCase().endsWith('.palette.json')) {
        throw new Error('Use an absolute file path ending in .palette.json.');
    }
    return path.resolve(file);
}

function revision(content) {
    return createHash('sha256').update(content).digest('hex');
}

export async function loadPalette(file) {
    const resolved = validatePath(file);
    const content = await readFile(resolved, 'utf8');
    let parsed;
    try { parsed = JSON.parse(content); }
    catch (error) { throw new Error(`Cannot parse palette JSON: ${error.message}`); }
    return { path: resolved, palette: validatePalette(parsed), revision: revision(content) };
}

export async function savePalette(file, palette, expectedRevision = null) {
    const resolved = validatePath(file);
    validatePalette(palette);
    const lockPath = `${resolved}.lock`;
    const lock = await open(lockPath, 'wx');
    let temp;
    try {
        let current;
        try { current = await loadPalette(resolved); }
        catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        if (expectedRevision === null && current) throw new Error('The destination already exists. Choose a new file.');
        if (expectedRevision !== null && (!current || current.revision !== expectedRevision)) {
            throw new Error('The file changed or was removed since it was opened. Reload it before saving.');
        }
        const content = JSON.stringify(palette, null, 2) + '\n';
        temp = `${resolved}.${randomUUID()}.tmp`;
        const handle = await open(temp, 'wx');
        try { await handle.writeFile(content, 'utf8'); }
        finally { await handle.close(); }
        await rename(temp, resolved);
        temp = undefined;
        return { path: resolved, palette, revision: revision(content) };
    } finally {
        try {
            if (temp) await unlink(temp).catch((error) => { if (error.code !== 'ENOENT') throw error; });
        } finally {
            try { await lock.close(); }
            finally { await unlink(lockPath); }
        }
    }
}
