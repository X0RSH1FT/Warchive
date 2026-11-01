export const FORMAT = "copilot-ui-layout";
export const VERSION = 1;
export const MAX_DOCUMENT_BYTES = 24 * 1024 * 1024;
export const MAX_REQUEST_BYTES = MAX_DOCUMENT_BYTES + 256 * 1024;
const MAX_DIMENSION = 10000;
const MAX_REGIONS = 200;
const TEXT_LIMIT = 4000;

function object(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${name} must be an object.`);
    return value;
}

function text(value, name, limit = TEXT_LIMIT) {
    if (typeof value !== "string" || value.length > limit) throw new Error(`${name} must be text of at most ${limit} characters.`);
    return value;
}

function number(value, name, min, max) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
        throw new Error(`${name} must be a number between ${min} and ${max}.`);
    }
    return value;
}

export function validateLayout(value) {
    const layout = object(value, "Layout");
    if (layout.format !== FORMAT || layout.version !== VERSION) throw new Error("Unrecognized layout format or version.");
    text(layout.name, "Layout name", 200);
    text(layout.provenance, "Provenance");
    const viewport = object(layout.viewport, "Viewport");
    number(viewport.width, "Viewport width", 1, MAX_DIMENSION);
    number(viewport.height, "Viewport height", 1, MAX_DIMENSION);
    if (!Array.isArray(layout.regions) || layout.regions.length > MAX_REGIONS) throw new Error(`Regions must be an array of at most ${MAX_REGIONS} items.`);
    const ids = new Set();
    for (const region of layout.regions) {
        object(region, "Region");
        text(region.id, "Region ID", 100);
        if (!region.id || ids.has(region.id)) throw new Error("Region IDs must be nonempty and unique.");
        ids.add(region.id);
        for (const key of ["label", "kind", "purpose", "information", "interactions", "questions"]) text(region[key], `Region ${key}`, key === "label" || key === "kind" ? 200 : TEXT_LIMIT);
        if (![0, 0.5, 1].includes(region.anchorX) || ![0, 0.5, 1].includes(region.anchorY)) throw new Error("Region anchors must be 0, 0.5, or 1.");
        for (const key of ["x", "y"]) number(region[key], `Region ${key}`, -MAX_DIMENSION * 2, MAX_DIMENSION * 2);
        for (const key of ["width", "height"]) number(region[key], `Region ${key}`, 1, MAX_DIMENSION);
        if (typeof region.stretchY !== "boolean") throw new Error("Region stretchY must be a boolean.");
        if (region.stretchY && region.anchorY !== 0) throw new Error("A vertically stretched region must use the top anchor.");
        number(region.bottom, "Region bottom inset", -MAX_DIMENSION, MAX_DIMENSION);
    }
    if (new TextEncoder().encode(JSON.stringify(layout)).byteLength > MAX_DOCUMENT_BYTES) {
        throw new Error("Layout exceeds the 24 MiB serialized document limit.");
    }
    return layout;
}

export function rect(region, viewport) {
    const x = region.anchorX * viewport.width + region.x;
    const y = region.anchorY * viewport.height + region.y;
    return { x, y, width: region.width, height: region.stretchY ? viewport.height - y - region.bottom : region.height };
}

export function warnings(layout) {
    const result = [];
    const boxes = layout.regions.map(region => ({ region, box: rect(region, layout.viewport) }));
    for (const { region, box } of boxes) {
        if (box.x < 0 || box.y < 0 || box.width <= 0 || box.height <= 0 || box.x + box.width > layout.viewport.width || box.y + box.height > layout.viewport.height) {
            result.push(`${region.label || region.id} is outside the viewport or has no visible height.`);
        }
    }
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i].box, b = boxes[j].box;
            if (a.width > 0 && a.height > 0 && b.width > 0 && b.height > 0 && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height) {
                result.push(`${boxes[i].region.label || boxes[i].region.id} overlaps ${boxes[j].region.label || boxes[j].region.id}.`);
            }
        }
    }
    return result;
}

function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
}

export function toSvg(layout) {
    validateLayout(layout);
    const { width, height } = layout.viewport;
    const shapes = layout.regions.map(region => {
        const box = rect(region, layout.viewport);
        const title = escapeXml(`${region.label} (${region.kind})`);
        return `<g><title>${title}</title><rect x="${box.x}" y="${box.y}" width="${Math.max(0, box.width)}" height="${Math.max(0, box.height)}" fill="#26394c" stroke="#8bd3ff" stroke-width="2"/><text x="${box.x + 8}" y="${box.y + 22}" fill="#ffffff" font-family="sans-serif" font-size="16">${escapeXml(region.label)}</text></g>`;
    }).join("\n");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${escapeXml(layout.name)}</title><desc>${escapeXml(layout.provenance)}</desc><rect width="100%" height="100%" fill="#111b27"/>${shapes}</svg>\n`;
}

export function blankLayout() {
    return { format: FORMAT, version: VERSION, name: "Untitled layout", provenance: "Manual draft; not imported or verified against a runtime UI.", viewport: { width: 1280, height: 720 }, regions: [] };
}
