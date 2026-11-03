import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { loadPalette, savePalette, MAX_REQUEST_BYTES } from './storage.mjs';

const assets = new Map([
    ['/', ['index.html', 'text/html; charset=utf-8']],
    ['/client.mjs', ['client.mjs', 'text/javascript; charset=utf-8']],
    ['/color.mjs', ['color.mjs', 'text/javascript; charset=utf-8']],
    ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);
async function bodyJson(request) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        size += chunk.length;
        if (size > MAX_REQUEST_BYTES) throw new Error('Request is too large.');
        chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function startPaletteServer(initial) {
    let current = initial;
    const token = randomBytes(32).toString('hex');
    const server = createServer(async (request, response) => {
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'");
        try {
            if (request.headers.host !== `127.0.0.1:${server.address().port}`) {
                response.writeHead(403);
                response.end('Invalid host');
                return;
            }
            const url = new URL(request.url, 'http://localhost');
            if (request.method === 'GET' && assets.has(url.pathname)) {
                const [file, type] = assets.get(url.pathname);
                let content = await readFile(new URL(file, import.meta.url), 'utf8');
                if (url.pathname === '/') content = content.replace('__CSRF_TOKEN__', token);
                response.writeHead(200, { 'Content-Type': type });
                response.end(content);
                return;
            }
            const supplied = request.headers['x-palette-token'];
            if (typeof supplied !== 'string' || supplied.length !== token.length ||
                !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))) {
                response.writeHead(403);
                response.end('Forbidden');
                return;
            }
            if (request.method === 'GET' && url.pathname === '/api/current') {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(current));
                return;
            }
            if (request.method === 'POST' && url.pathname === '/api/save') {
                if (!request.headers['content-type']?.startsWith('application/json')) throw new Error('Expected JSON.');
                const data = await bodyJson(request);
                if (!data || typeof data !== 'object' || Array.isArray(data) ||
                    typeof data.path !== 'string' || typeof data.create !== 'boolean') throw new Error('Invalid save request.');
                if (!data.create && data.path !== current.path) throw new Error('Save path differs from the open palette.');
                if (!data.create && data.revision !== current.revision) throw new Error('The open palette changed. Reopen it before saving.');
                current = await savePalette(data.path, data.palette, data.create ? null : data.revision);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(current));
                return;
            }
            if (request.method === 'POST' && url.pathname === '/api/open') {
                const data = await bodyJson(request);
                current = await loadPalette(data.path);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(current));
                return;
            }
            response.writeHead(404);
            response.end('Not found');
        } catch (error) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });
    return {
        result: { url: `http://127.0.0.1:${server.address().port}/`, title: 'Palette Studio' },
        getPath: () => current.path,
        close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
    };
}
