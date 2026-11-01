export function parseHex(value) {
    if (typeof value !== 'string' || !/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
        throw new Error('Enter #RGB, #RGBA, #RRGGBB, or #RRGGBBAA.');
    }
    let digits = value.slice(1).toLowerCase();
    if (digits.length <= 4) digits = [...digits].map((digit) => digit + digit).join('');
    if (digits.length === 6) digits += 'ff';
    const bytes = digits.match(/../g).map((part) => parseInt(part, 16));
    return { r: bytes[0], g: bytes[1], b: bytes[2], a: bytes[3] };
}

const rounded = (value, places) => Number(value.toFixed(places));

export function formatColor(value) {
    const { r, g, b, a } = parseHex(value);
    const hex = '#' + [r, g, b, a].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    const alpha = rounded(a / 255, 6);
    const [red, green, blue] = [r, g, b].map((byte) => byte / 255);
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    let hue = 0;
    if (delta !== 0) {
        if (max === red) hue = ((green - blue) / delta) % 6;
        else if (max === green) hue = (blue - red) / delta + 2;
        else hue = (red - green) / delta + 4;
        hue = (hue * 60 + 360) % 360;
    }
    const degrees = rounded(hue, 2) % 360;
    return {
        hex,
        rgb: `rgb(${r} ${g} ${b} / ${alpha})`,
        hsl: `hsl(${degrees} ${rounded(saturation * 100, 2)}% ${rounded(lightness * 100, 2)}% / ${alpha})`,
        picker: hex.slice(0, 7),
        alphaByte: a,
    };
}
