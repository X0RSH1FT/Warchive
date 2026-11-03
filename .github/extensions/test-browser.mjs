import { readFile } from "node:fs/promises";

class Element {
    constructor(tag = "div") {
        this.tagName = tag.toUpperCase();
        this.children = [];
        this.listeners = {};
        this.dataset = {};
        this.style = {};
        this.classList = { toggle() {} };
        this._value = "";
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.selectionDirection = "none";
        this.textContent = "";
        this.parentElement = { parentElement: { clientWidth: 1000 } };
        this.elements = [];
    }
    get value() { return this._value; }
    set value(value) {
        this._value = String(value);
        this.selectionStart = this.selectionEnd = this._value.length;
    }
    addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); }
    removeEventListener(type, fn) { this.listeners[type] = (this.listeners[type] || []).filter(listener => listener !== fn); }
    fire(type, event = {}) { return Promise.all((this.listeners[type] || []).map(fn => fn({ target: this, ...event }))); }
    append(...nodes) { this.children.push(...nodes); }
    replaceChildren(...nodes) {
        if (this.walk().includes(globalThis.document.activeElement)) globalThis.document.activeElement = null;
        this.children = nodes;
    }
    get childElementCount() { return this.children.length; }
    get lastElementChild() { return this.children.at(-1); }
    setAttribute() {}
    setCustomValidity(message) { this.validationMessage = message; }
    checkValidity() { return !this.validationMessage; }
    setPointerCapture() {}
    focus() { globalThis.document.activeElement = this; }
    blur() { if (globalThis.document.activeElement === this) globalThis.document.activeElement = null; }
    setSelectionRange(start, end, direction = "none") {
        this.selectionStart = start;
        this.selectionEnd = end;
        this.selectionDirection = direction;
    }
    matches(selector) {
        return selector === "input, textarea, select" && ["INPUT", "TEXTAREA", "SELECT"].includes(this.tagName);
    }
    closest() { return this.details ??= {}; }
    querySelector(selector) {
        const tag = selector.toUpperCase();
        return this.walk().find(node => node.tagName === tag) ?? null;
    }
    querySelectorAll(selector) {
        if (selector === "button.node") return this.walk().filter(node => node.tagName === "BUTTON" && node.className === "node");
        return [];
    }
    walk() { return this.children.flatMap(child => [child, ...child.walk()]); }
}

export function browser(t, fetch) {
    const previous = {};
    for (const key of ["document", "window", "fetch", "confirm", "matchMedia", "setInterval"]) previous[key] = globalThis[key];
    t.after(() => { for (const [key, value] of Object.entries(previous)) globalThis[key] = value; });
    const ids = new Map();
    const get = id => {
        if (!ids.has(id)) ids.set(id, new Element());
        return ids.get(id);
    };
    const main = new Element("main"), toolbar = new Element(), workspace = new Element();
    const document = {
        getElementById: get,
        createElement: tag => new Element(tag),
        createTextNode: text => { const node = new Element(); node.textContent = text; return node; },
        querySelector(selector) {
            if (selector.startsWith("meta[")) return { content: "token" };
            if (selector.startsWith("#")) return get(selector.slice(1));
            if (selector === "main") return main;
            if (selector === "header .toolbar") return toolbar;
            if (selector === ".workspace") return workspace;
            return null;
        },
        querySelectorAll(selector) { return selector === "#colors input" ? get("colors").walk().filter(node => node.tagName === "INPUT") : []; },
        activeElement: null,
    };
    globalThis.document = document;
    globalThis.window = { confirm: () => true, addEventListener() {} };
    globalThis.confirm = () => true;
    globalThis.matchMedia = () => ({ matches: false });
    let interval;
    globalThis.setInterval = callback => { interval = callback; return 0; };
    globalThis.fetch = fetch;
    return { get, main, toolbar, tick: () => interval() };
}

let moduleId = 0;
export async function loadClient(file) {
    let source = await readFile(file, "utf8");
    source = source.replace(/from (["'])(\.\/[^"']+)\1/g, (_, quote, relative) => `from ${quote}${new URL(relative, file)}${quote}`);
    return import(`data:text/javascript;base64,${Buffer.from(`${source}\n// test ${++moduleId}`).toString("base64")}`);
}

export const response = value => ({ ok: true, json: async () => structuredClone(value) });
export function deferred() {
    let resolve;
    const promise = new Promise(done => { resolve = done; });
    return { promise, resolve };
}
