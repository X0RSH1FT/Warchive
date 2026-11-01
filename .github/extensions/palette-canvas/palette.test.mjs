import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatColor, parseHex } from './color.mjs';
import { loadPalette, savePalette, validatePalette, MAX_DOCUMENT_BYTES, MAX_REQUEST_BYTES } from './storage.mjs';
import { startPaletteServer } from './server.mjs';
import { splitJson } from '../test-http.mjs';

const palette = (name = 'Test') => ({
    format: 'copilot-color-palette', version: 1, name,
    colors: [{ name: 'Red', role: 'Accent', notes: 'Example', hex: '#ff000080' }],
});

test('parses short and long hex with alpha bytes', () => {
    assert.deepEqual(parseHex('#AbC'), { r: 170, g: 187, b: 204, a: 255 });
    assert.deepEqual(parseHex('#abcd'), { r: 170, g: 187, b: 204, a: 221 });
    assert.deepEqual(parseHex('#12345600'), { r: 18, g: 52, b: 86, a: 0 });
    assert.equal(formatColor('#ff000080').hex, '#ff000080');
    assert.equal(formatColor('#ff000080').rgb, 'rgb(255 0 0 / 0.501961)');
    assert.equal(formatColor('#ff000080').hsl, 'hsl(0 100% 50% / 0.501961)');
});

test('formats HSL correctly for primary colors, gray and transparent', () => {
    assert.equal(formatColor('#00ff00').hsl, 'hsl(120 100% 50% / 1)');
    assert.equal(formatColor('#0000ff').hsl, 'hsl(240 100% 50% / 1)');
    assert.equal(formatColor('#80808000').hsl, 'hsl(0 0% 50.2% / 0)');
    assert.equal(formatColor('#123456').hsl, 'hsl(210 65.38% 20.39% / 1)');
});

test('rejects invalid colors and unsupported palette shapes', () => {
    for (const invalid of ['', 'red', '#12', '#12345', '#1234567', '#123456789', '#xyz', ' #fff', null]) {
        assert.throws(() => parseHex(invalid), /Enter/);
    }
    assert.throws(() => validatePalette({ ...palette(), version: 2 }), /unsupported/);
    assert.throws(() => validatePalette({ ...palette(), name: ' ' }), /unsupported/);
    assert.throws(() => validatePalette({ ...palette(), colors: [{ name: '', role: '', notes: '', hex: 'bad' }] }), /Invalid color/);
    assert.throws(() => validatePalette({ ...palette(), colors: [{ hex: '#fff' }] }), /Invalid color/);
});

test('creates independent palettes, reopens, checks conflicts and protects invalid files', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'palette-test-'));
    try {
        const one = path.join(dir, 'one.palette.json');
        const two = path.join(dir, 'two.palette.json');
        const first = await savePalette(one, palette('One'));
        const second = await savePalette(two, palette('Two'));
        assert.equal((await loadPalette(one)).palette.name, 'One');
        assert.equal((await loadPalette(two)).palette.name, 'Two');
        assert.notEqual(first.revision, second.revision);
        await assert.rejects(savePalette(one, palette('Overwrite')), /already exists/);
        const updated = await savePalette(one, palette('Updated'), first.revision);
        await assert.rejects(savePalette(one, palette('Stale'), first.revision), /changed/);
        assert.equal((await loadPalette(one)).revision, updated.revision);
        assert.equal((await loadPalette(two)).palette.name, 'Two');
        await writeFile(one, '{"format":"wrong"}');
        await assert.rejects(savePalette(one, palette(), updated.revision), /unsupported/);
        assert.equal(await readFile(one, 'utf8'), '{"format":"wrong"}');
        await writeFile(one, '{bad');
        await assert.rejects(loadPalette(one), /parse/);
        await assert.rejects(savePalette(one, palette()), /parse/);
        await assert.rejects(savePalette(path.join(dir, 'wrong.json'), palette()), /absolute file path/);
    } finally { await rm(dir, { recursive: true, force: true }); }
});

test('example is valid and contains the documented color roles', async () => {
    const example = await loadPalette(fileURLToPath(new URL('../../../data/palettes/cyberpunk.palette.json', import.meta.url)));
    assert.equal(example.palette.colors.length, 18);
    assert.equal(example.palette.colors.find((color) => color.name === 'Corporation accent').hex, '#ff3bd4');
});

test('HTTP server requires its token, serves assets and saves independently', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'palette-http-'));
    let server;
    try {
        const one = path.join(dir, 'one.palette.json');
        const two = path.join(dir, 'two.palette.json');
        const first = await savePalette(one, palette('One'));
        server = await startPaletteServer(first);
        const base = server.result.url;
        const html = await (await fetch(base)).text();
        const token = html.match(/name="palette-token" content="([^"]+)"/)[1];
        assert.equal((await fetch(new URL('/client.mjs', base))).status, 200);
        assert.equal((await fetch(new URL('/api/current', base))).status, 403);
        const headers = { 'X-Palette-Token': token, 'Content-Type': 'application/json' };
        const split = await splitJson(new URL('/api/save', base), headers, { path: two, create: true, palette: palette('Café') });
        assert.equal(split.status, 200);
        assert.equal((await loadPalette(two)).palette.name, 'Café');
        const oversized = await fetch(new URL('/api/open', base), { method: 'POST', headers, body: JSON.stringify({ path: 'é'.repeat(530000) }) });
        assert.equal(oversized.status, 400);
        const post = (body) => fetch(new URL('/api/save', base), { method: 'POST', headers, body: JSON.stringify(body) });
        const current = await loadPalette(two);
        const result = await post({ path: two, create: false, revision: current.revision, palette: palette('Two') });
        assert.equal(result.status, 200);
        assert.equal(server.getPath(), two);
        assert.equal((await loadPalette(one)).palette.name, 'One');
        assert.equal((await loadPalette(two)).palette.name, 'Two');
        assert.equal((await post({ path: two, create: false, revision: first.revision, palette: palette('Stale') })).status, 400);
        assert.equal((await loadPalette(two)).palette.name, 'Two');
    } finally {
        if (server) await server.close();
        await rm(dir, { recursive: true, force: true });
    }
});

test('serialized palette budget permits maximum UTF-8 save and reopen, rejecting larger inputs', async t => {
    const dir = await mkdtemp(path.join(tmpdir(), 'palette-budget-'));
    const file = path.join(dir, 'budget.palette.json');
    const initial = await savePalette(file, palette());
    const server = await startPaletteServer(initial);
    t.after(async () => { await server.close(); await rm(dir, { recursive: true, force: true }); });
    const token = (await (await fetch(server.result.url)).text()).match(/name="palette-token" content="([^"]+)"/)[1];
    const headers = { 'X-Palette-Token': token, 'Content-Type': 'application/json' };
    const value = palette('界\0');
    value.colors[0].notes = 'é"';
    value.extra = '';
    value.extra = 'x'.repeat(MAX_DOCUMENT_BYTES - Buffer.byteLength(JSON.stringify(value)));
    assert.equal(Buffer.byteLength(JSON.stringify(value)), MAX_DOCUMENT_BYTES);
    validatePalette(value);
    value.extra += 'x';
    assert.throws(() => validatePalette(value), /serialized document limit/);
    value.extra = value.extra.slice(0, -1);
    const post = (route, body) => fetch(new URL(`/api/${route}`, server.result.url), { method: 'POST', headers, body: JSON.stringify(body) });
    const saved = await post('save', { path: file, create: false, revision: initial.revision, palette: value });
    assert.equal(saved.status, 200);
    const revision = (await saved.json()).revision;
    const reopened = await post('open', { path: file });
    const loaded = await reopened.json();
    assert.equal(reopened.status, 200);
    assert.equal(loaded.palette.name, value.name);
    assert.equal(Buffer.byteLength(JSON.stringify(loaded.palette)), MAX_DOCUMENT_BYTES);
    value.extra += 'x';
    const rejected = await post('save', { path: file, create: false, revision, palette: value });
    assert.equal(rejected.status, 400);
    assert.match((await rejected.json()).error, /serialized document limit/);
    assert.equal((await loadPalette(file)).revision, revision);
    const oversized = await post('open', { path: 'é'.repeat(MAX_REQUEST_BYTES / 2) });
    assert.equal(oversized.status, 400);
    assert.match((await oversized.json()).error, /Request is too large/);
    await assert.rejects(loadPalette(path.join(dir, 'x'.repeat(32769) + '.palette.json')), /absolute file path/);
});
