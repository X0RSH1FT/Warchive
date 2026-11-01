import { createCanvas, CanvasError, joinSession } from '@github/copilot-sdk/extension';
import { startPaletteServer } from './server.mjs';
import { loadPalette } from './storage.mjs';

const instances = new Map();
const canvas = createCanvas({
    id: 'copilot-palette-studio',
    displayName: 'Palette Studio',
    description: 'Create and discuss palettes stored in portable workspace files.',
    inputSchema: {
        type: 'object',
        properties: { path: { type: 'string', description: 'Absolute path to an existing .palette.json file.' } },
        required: ['path'],
        additionalProperties: false,
    },
    actions: [{
        name: 'inspect',
        description: 'Read the currently saved palette and its file path; unsaved edits are not included.',
        handler: async ({ instanceId }) => {
            const pending = instances.get(instanceId);
            if (!pending) throw new CanvasError('not_open', 'The palette canvas is not open.');
            try {
                const instance = await pending;
                return await loadPalette(instance.getPath());
            }
            catch (error) { throw new CanvasError('palette_read_failed', error.message); }
        },
    }],
    open: async ({ instanceId, input }) => {
        let pending = instances.get(instanceId);
        if (!pending) {
            pending = (async () => startPaletteServer(await loadPalette(input?.path)))();
            instances.set(instanceId, pending);
        }
        try {
            return (await pending).result;
        } catch (error) {
            if (instances.get(instanceId) === pending) instances.delete(instanceId);
            throw new CanvasError('palette_open_failed', error.message);
        }
    },
    onClose: async ({ instanceId }) => {
        const pending = instances.get(instanceId);
        if (pending) {
            instances.delete(instanceId);
            const instance = await pending;
            await instance.close();
        }
    },
});

await joinSession({ canvases: [canvas] });
