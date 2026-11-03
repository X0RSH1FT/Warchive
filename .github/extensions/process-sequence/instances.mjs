export function createInstances(store, startServer, workspace) {
    const entries = new Map();
    return {
        async open(id, file) {
            let entry = entries.get(id);
            if (!entry) {
                entry = (async () => {
                    await store.read(file);
                    return startServer(store, file, workspace);
                })();
                entries.set(id, entry);
                entry.catch(() => { if (entries.get(id) === entry) entries.delete(id); });
            }
            return entry;
        },
        async close(id) {
            const pending = entries.get(id);
            if (!pending) return;
            entries.delete(id);
            const entry = await pending;
            entry.server.closeAllConnections();
            await new Promise(resolve => entry.server.close(resolve));
        },
    };
}
