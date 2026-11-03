import { formatColor } from './color.mjs';

const $ = (selector) => document.querySelector(selector);
const token = $('meta[name=palette-token]').content;
const status = $('#status');
let palette;
let savedPath;
let savedRevision;
let dirty = false;
let busy = false;
const invalidOpacity = new WeakMap();

async function persist(action) {
    if (busy) return;
    busy = true;
    $('#editor').disabled = true;
    try { await action(); }
    finally { busy = false; $('#editor').disabled = false; }
}

function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('error', error);
}

async function request(url, data) {
    const response = await fetch(url, {
        method: data === undefined ? 'GET' : 'POST',
        headers: { 'X-Palette-Token': token, ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) },
        body: data === undefined ? undefined : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
}

function accept(result) {
    palette = result.palette;
    savedPath = result.path;
    savedRevision = result.revision;
    $('#name').value = palette.name;
    $('#path').value = result.path;
    dirty = false;
    render();
}

function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function button(text, handler) {
    const node = element('button', text);
    node.type = 'button';
    node.addEventListener('click', handler);
    return node;
}

function field(title, tag, value, handler) {
    const label = element('label', title);
    const input = element(tag);
    input.value = value;
    input.addEventListener('input', () => { handler(input.value); dirty = true; });
    label.append(input);
    return { label, input };
}

function render() {
    const colors = $('#colors');
    const overview = $('#overview');
    colors.replaceChildren();
    overview.replaceChildren();
    palette.colors.forEach((color, index) => {
        const card = element('section', undefined, 'card');
        const title = element('h3', `Color ${index + 1}`);
        const preview = element('div', undefined, 'checker overview-item');
        const swatch = element('div', undefined, 'swatch');
        const swatchLabel = element('div');
        preview.append(swatch, swatchLabel);
        overview.append(preview);

        const controls = element('div', undefined, 'row');
        const name = field('Name', 'input', color.name, (value) => { color.name = value; update(); });
        const role = field('Role', 'input', color.role, (value) => { color.role = value; });
        const hex = field('Hex input', 'input', color.hex, (value) => { color.hex = value; update(); });
        const picker = field('Color picker', 'input', '#000000', (value) => {
            try {
                const formatted = formatColor(color.hex);
                color.hex = value + formatted.hex.slice(7);
                hex.input.value = color.hex;
                update();
            } catch { message('Fix the hex value before using the color picker.', true); }
        });
        picker.input.type = 'color';
        const alpha = field('Opacity byte (0–255)', 'input', invalidOpacity.get(color) ?? '255', (value) => {
            if (!/^(?:0|[1-9]\d*)$/.test(value) || Number(value) > 255) {
                invalidOpacity.set(color, value);
                alpha.input.setCustomValidity('Enter an integer from 0 to 255.');
                error.textContent = 'Opacity must be an integer from 0 to 255.';
                return;
            }
            invalidOpacity.delete(color);
            alpha.input.setCustomValidity('');
            try {
                color.hex = formatColor(color.hex).hex.slice(0, 7) + Number(value).toString(16).padStart(2, '0');
                hex.input.value = color.hex;
                update();
            } catch { error.textContent = 'Fix the hex value first.'; }
        });
        alpha.input.inputMode = 'numeric';
        controls.append(name.label, role.label, hex.label, picker.label, alpha.label);
        const notes = field('Notes', 'textarea', color.notes, (value) => { color.notes = value; });
        const error = element('p', '', 'error');
        error.setAttribute('role', 'status');
        const values = element('div', undefined, 'values');
        const outputs = {};
        for (const key of ['hex', 'rgb', 'hsl']) {
            const label = element('label', key.toUpperCase());
            const row = element('div', undefined, 'value-row');
            const output = element('input');
            output.readOnly = true;
            output.setAttribute('aria-label', `${key.toUpperCase()} value for color ${index + 1}`);
            const copy = button(`Copy ${key.toUpperCase()}`, async () => {
                try {
                    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
                    await navigator.clipboard.writeText(output.value);
                    message(`${key.toUpperCase()} copied.`);
                } catch {
                    output.focus();
                    output.select();
                    message('Clipboard access unavailable. The value is selected; copy it with your keyboard.', true);
                }
            });
            row.append(output, copy);
            label.append(row);
            values.append(label);
            outputs[key] = output;
        }
        const actions = element('div', undefined, 'toolbar');
        const up = button('Move up', () => {
            [palette.colors[index - 1], palette.colors[index]] = [palette.colors[index], palette.colors[index - 1]];
            dirty = true;
            render();
            const actions = $('#colors').children[index - 1].lastElementChild.children;
            (actions[0].disabled ? actions[1] : actions[0]).focus();
        });
        const down = button('Move down', () => {
            [palette.colors[index + 1], palette.colors[index]] = [palette.colors[index], palette.colors[index + 1]];
            dirty = true;
            render();
            const actions = $('#colors').children[index + 1].lastElementChild.children;
            (actions[1].disabled ? actions[0] : actions[1]).focus();
        });
        up.disabled = index === 0;
        down.disabled = index === palette.colors.length - 1;
        actions.append(up, down, button('Remove color', () => {
            palette.colors.splice(index, 1);
            dirty = true;
            render();
            $('#add').focus();
        }));
        card.append(title, controls, error, notes.label, values, actions);
        colors.append(card);

        function update() {
            swatchLabel.textContent = color.name || `Color ${index + 1}`;
            try {
                const formatted = formatColor(color.hex);
                hex.input.setCustomValidity('');
                error.textContent = '';
                swatch.style.backgroundColor = formatted.hex;
                picker.input.value = formatted.picker;
                if (!invalidOpacity.has(color)) alpha.input.value = formatted.alphaByte;
                for (const key of Object.keys(outputs)) outputs[key].value = formatted[key];
            } catch (problem) {
                hex.input.setCustomValidity(problem.message);
                error.textContent = problem.message;
                swatch.style.backgroundColor = 'transparent';
                for (const output of Object.values(outputs)) output.value = '';
            }
            if (invalidOpacity.has(color)) {
                alpha.input.setCustomValidity('Enter an integer from 0 to 255.');
                error.textContent = 'Opacity must be an integer from 0 to 255.';
            } else alpha.input.setCustomValidity('');
        }
        update();
    });
}

function mayDiscard() {
    return !dirty || confirm('Discard unsaved palette changes?');
}

$('#name').addEventListener('input', (event) => { palette.name = event.target.value; dirty = true; });
$('#add').addEventListener('click', () => {
    palette.colors.push({ name: '', role: '', notes: '', hex: '#000000ff' });
    dirty = true;
    render();
    $('#colors').lastElementChild.querySelector('input').focus();
});
$('#new').addEventListener('click', () => {
    if (!mayDiscard()) return;
    palette = { format: 'copilot-color-palette', version: 1, name: '', colors: [] };
    savedPath = null;
    savedRevision = null;
    $('#name').value = '';
    $('#path').value = '';
    dirty = true;
    render();
    message('New palette. Enter a name and a new file path, then choose Save as new file.');
});
$('#open').addEventListener('click', async () => {
    if (busy) return;
    if (!mayDiscard()) return;
    await persist(async () => {
        try { accept(await request('/api/open', { path: $('#path').value })); message('Palette opened.'); }
        catch (error) { message(error.message, true); }
    });
});
async function save(create) {
    if (busy) return;
    try {
        if (!create && !savedPath) throw new Error('Choose Save as new file for a new palette.');
        if (!$('#name').value.trim()) throw new Error('Enter a palette name.');
        if ([...document.querySelectorAll('#colors input')].some((input) => !input.checkValidity())) {
            throw new Error('Fix the invalid color or opacity values before saving.');
        }
        await persist(async () => {
            accept(await request('/api/save', { path: $('#path').value, palette, create, revision: savedRevision }));
            message('Palette saved. The agent can inspect the saved file.');
        });
    } catch (error) { message(error.message, true); }
}
$('#save').addEventListener('click', () => save(false));
$('#save-as').addEventListener('click', () => save(true));
window.addEventListener('beforeunload', (event) => { if (dirty || busy) event.preventDefault(); });

await persist(async () => {
    try { accept(await request('/api/current')); }
    catch (error) { message(`Cannot load palette: ${error.message}`, true); }
});
