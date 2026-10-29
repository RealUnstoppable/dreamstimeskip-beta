// tests/apple-wheel-picker.test.js
// Comprehensive test suite for Apple-Style Wheel Picker and Ad Editor Pricing Logic

import test from 'node:test';
import assert from 'node:assert/strict';
import {
    generatePriceOptions,
    AppleWheelPicker,
    MIN_PRICE,
    MAX_PRICE,
    PRICE_STEP,
    DEFAULT_PRICE
} from '../js/apple-wheel-picker.js';
import { CompositionStudio } from '../js/ad-composition-studio.js';

test('Phase 2: Pricing Logic & Data Structure Verification', async (t) => {
    await t.test('default starting price is exactly $12.99', () => {
        assert.equal(DEFAULT_PRICE, 12.99);
        assert.equal(MIN_PRICE, 0.99);
        assert.equal(MAX_PRICE, 99.99);
        assert.equal(PRICE_STEP, 1.00);
    });

    await t.test('generates price options in $1.00 increments ending in .99', () => {
        const options = generatePriceOptions(0.99, 99.99, 1.00);
        assert.equal(options.length, 100);

        // Verify all options match $X.99 formulation
        options.forEach((opt, idx) => {
            assert.equal(typeof opt.value, 'number');
            assert.equal(typeof opt.label, 'string');
            assert.match(opt.label, /^\$\d+\.99$/);
            // Verify cents are always .99
            const cents = Math.round((opt.value % 1) * 100);
            assert.equal(cents, 99);
        });
    });

    await t.test('the absolute minimum value at the bottom of the picker is $0.99', () => {
        const options = generatePriceOptions(0.99, 99.99, 1.00);
        const bottomItem = options[options.length - 1]; // bottom-most item in DOM/scroll
        assert.equal(bottomItem.value, 0.99);
        assert.equal(bottomItem.label, '$0.99');
    });

    await t.test('values increment by a dollar going upwards from bottom', () => {
        const options = generatePriceOptions(0.99, 99.99, 1.00);
        const bottomIdx = options.length - 1;

        assert.equal(options[bottomIdx].value, 0.99);
        assert.equal(options[bottomIdx - 1].value, 1.99);
        assert.equal(options[bottomIdx - 2].value, 2.99);
        assert.equal(options[bottomIdx - 3].value, 3.99);
        assert.equal(options[bottomIdx - 12].value, 12.99); // default position
        assert.equal(options[0].value, 99.99); // top-most item
    });

    await t.test('resolves starting index for default price $12.99 correctly', () => {
        const options = generatePriceOptions();
        const defaultIndex = options.findIndex(o => Math.abs(o.value - DEFAULT_PRICE) < 0.001);
        assert.ok(defaultIndex >= 0);
        assert.equal(options[defaultIndex].value, 12.99);
        assert.equal(options[defaultIndex].label, '$12.99');
    });
});

test('Phase 1: AppleWheelPicker Component Core Mechanics', async (t) => {
    // Mock minimal DOM container for Node testing
    function createMockContainer() {
        const children = [];
        return {
            innerHTML: '',
            children,
            appendChild(child) { children.push(child); return child; },
            querySelector() { return null; },
            querySelectorAll() { return []; }
        };
    }

    // Mock global document & window for component instantiation in Node
    const originalDoc = globalThis.document;
    const originalWin = globalThis.window;

    globalThis.document = {
        createElement(tag) {
            const el = {
                tagName: tag.toUpperCase(),
                className: '',
                style: {},
                dataset: {},
                innerHTML: '',
                children: [],
                listeners: {},
                setAttribute(k, v) { this[k] = v; },
                getAttribute(k) { return this[k]; },
                appendChild(child) { this.children.push(child); return child; },
                addEventListener(evt, fn) {
                    if (!this.listeners[evt]) this.listeners[evt] = [];
                    this.listeners[evt].push(fn);
                },
                removeEventListener(evt, fn) {
                    if (!this.listeners[evt]) return;
                    this.listeners[evt] = this.listeners[evt].filter(f => f !== fn);
                },
                dispatchEvent(evt) {
                    const fns = this.listeners[evt.type] || [];
                    fns.forEach(fn => fn(evt));
                },
                classList: {
                    _classes: new Set(),
                    add(c) { this._classes.add(c); },
                    remove(c) { this._classes.delete(c); },
                    toggle(c, state) {
                        if (state === undefined) state = !this._classes.has(c);
                        if (state) this._classes.add(c); else this._classes.delete(c);
                    },
                    contains(c) { return this._classes.has(c); }
                },
                scrollTo({ top }) { this.scrollTop = top; },
                scrollTop: 0
            };
            return el;
        },
        querySelector() { return null; }
    };

    globalThis.window = {
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {}
    };

    globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
    globalThis.performance = { now: () => Date.now() };

    await t.test('initializes with default value 12.99 and calculates correct index', () => {
        const mockEl = createMockContainer();
        const picker = new AppleWheelPicker({
            container: mockEl,
            defaultValue: 12.99
        });

        assert.equal(picker.getValue(), 12.99);
        assert.equal(picker.getFormattedValue(), '$12.99');
        picker.destroy();
    });

    await t.test('setValue correctly selects $0.99 and $1.99', () => {
        const mockEl = createMockContainer();
        let reportedPrice = null;
        let reportedLabel = null;

        const picker = new AppleWheelPicker({
            container: mockEl,
            defaultValue: 12.99,
            onChange: (p, l) => {
                reportedPrice = p;
                reportedLabel = l;
            }
        });

        // Set to minimum $0.99
        picker.setValue(0.99, false);
        assert.equal(picker.getValue(), 0.99);
        assert.equal(picker.getFormattedValue(), '$0.99');
        assert.equal(reportedPrice, 0.99);
        assert.equal(reportedLabel, '$0.99');

        // Set to $1.99
        picker.setValue(1.99, false);
        assert.equal(picker.getValue(), 1.99);
        assert.equal(picker.getFormattedValue(), '$1.99');
        assert.equal(reportedPrice, 1.99);

        // Set back to $12.99
        picker.setValue(12.99, false);
        assert.equal(picker.getValue(), 12.99);
        assert.equal(picker.getFormattedValue(), '$12.99');

        picker.destroy();
    });

    await t.test('increment and decrement step by $1 in right direction', () => {
        const mockEl = createMockContainer();
        const picker = new AppleWheelPicker({
            container: mockEl,
            defaultValue: 12.99
        });

        // Increment increases price upwards: 12.99 -> 13.99
        picker.increment(1);
        assert.equal(picker.getValue(), 13.99);
        assert.equal(picker.getFormattedValue(), '$13.99');

        // Decrement decreases price downwards: 13.99 -> 12.99 -> 11.99
        picker.decrement(1);
        assert.equal(picker.getValue(), 12.99);
        picker.decrement(1);
        assert.equal(picker.getValue(), 11.99);

        picker.destroy();
    });

    // Cleanup globals
    globalThis.document = originalDoc;
    globalThis.window = originalWin;
});

test('Phase 3: Integration into Medixly Ad Editor & Composition Studio', async (t) => {
    // Mock controller
    const mockController = {
        elements: {
            topDock: {
                firstChild: null,
                insertBefore(newEl) { this.firstChild = newEl; }
            },
            viewport: {
                setAttribute() {},
                appendChild() {}
            },
            arena: { classList: { add() {}, remove() {} } },
            userTag: null,
            captionCard: null
        },
        selectedPrice: null,
        adPrice: null,
        setAdPrice(price) {
            this.selectedPrice = price;
            this.adPrice = price;
        }
    };

    // Mock localStorage
    const storage = new Map();
    globalThis.localStorage = {
        getItem: (k) => storage.get(k) ?? null,
        setItem: (k, v) => storage.set(k, String(v)),
        removeItem: (k) => storage.delete(k),
        clear: () => storage.clear()
    };

    const originalDoc = globalThis.document;
    const originalWin = globalThis.window;

    globalThis.document = {
        createElement(tag) {
            return {
                tagName: tag.toUpperCase(),
                className: '',
                style: {},
                dataset: {},
                innerHTML: '',
                children: [],
                listeners: {},
                setAttribute(k, v) { this[k] = v; },
                getAttribute(k) { return this[k]; },
                appendChild(c) { this.children.push(c); return c; },
                addEventListener(evt, fn) {
                    if (!this.listeners[evt]) this.listeners[evt] = [];
                    this.listeners[evt].push(fn);
                },
                removeEventListener(evt, fn) {
                    if (!this.listeners[evt]) return;
                    this.listeners[evt] = this.listeners[evt].filter(f => f !== fn);
                },
                querySelector() { return null; },
                querySelectorAll() { return []; },
                classList: {
                    add() {}, remove() {}, toggle() {}, contains() { return false; }
                }
            };
        },
        querySelector() { return null; },
        addEventListener() {},
        removeEventListener() {}
    };

    globalThis.window = {
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {}
    };

    const studio = new CompositionStudio(mockController);

    await t.test('defaults to $12.99 on initial creation', () => {
        assert.equal(studio.selectedPrice, 12.99);
        assert.equal(studio.getPrice(), 12.99);
    });

    await t.test('setPrice correctly updates studio and controller state', () => {
        studio.setPrice(1.99);
        assert.equal(studio.selectedPrice, 1.99);
        assert.equal(studio.getPrice(), 1.99);
        assert.equal(mockController.selectedPrice, 1.99);
        assert.equal(mockController.adPrice, 1.99);
        assert.equal(globalThis.localStorage.getItem('medixly_ad_editor_price'), '1.99');

        // Snap to minimum
        studio.setPrice(0.99);
        assert.equal(studio.selectedPrice, 0.99);
        assert.equal(mockController.selectedPrice, 0.99);
        assert.equal(globalThis.localStorage.getItem('medixly_ad_editor_price'), '0.99');

        // Back to default 12.99
        studio.setPrice(12.99);
        assert.equal(studio.selectedPrice, 12.99);
        assert.equal(mockController.selectedPrice, 12.99);
    });

    await t.test('getFormData captures ad editor pricing and state cleanly', () => {
        const formData = studio.getFormData();
        assert.equal(formData.price, 12.99);
        assert.equal(formData.formattedPrice, '$12.99');
        assert.equal(formData.background, 'waves');
        assert.equal(formData.blobFilter, 'both');
        assert.equal(formData.showCaptionBox, true);
    });

    studio.destroy();

    // Restore globals
    globalThis.document = originalDoc;
    globalThis.window = originalWin;
});
