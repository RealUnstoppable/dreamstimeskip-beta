// js/apple-wheel-picker.js
// Apple-Style Smooth Inertial Wheel Picker Component
// Features: CSS Scroll-Snap Physics, 3D Cylindrical Drum Perspective,
// Drag Momentum, Tactile Audio Tick, and High-Contrast Dark-Mode Aesthetics.

export const MIN_PRICE = 0.99;
export const MAX_PRICE = 99.99;
export const PRICE_STEP = 1.00;
export const DEFAULT_PRICE = 12.99;

/**
 * Generate pricing options in $1 increments ($X.99).
 * Absolute minimum value at the bottom of the picker is $0.99.
 * Going upwards, values increment by $1.00 ($0.99, $1.99, $2.99, ..., $12.99, ..., $99.99).
 * 
 * Order in visual list / DOM (top to bottom):
 * Top (index 0): $99.99 (max)
 * ...
 * Index: $12.99 (default)
 * ...
 * Index: $1.99
 * Bottom (index N): $0.99 (min)
 * 
 * @param {number} [min=0.99]
 * @param {number} [max=99.99]
 * @param {number} [step=1.00]
 * @returns {Array<{ value: number, label: string, stepIndex: number }>}
 */
export function generatePriceOptions(min = MIN_PRICE, max = MAX_PRICE, step = PRICE_STEP) {
    const options = [];
    const totalSteps = Math.round((max - min) / step);

    // Populate from max down to min so $0.99 is at the very bottom,
    // and going upwards in the wheel the values increment by $1.00.
    for (let i = totalSteps; i >= 0; i--) {
        const val = Math.round((min + i * step) * 100) / 100;
        options.push({
            value: val,
            label: `$${val.toFixed(2)}`,
            stepIndex: i
        });
    }
    return options;
}

export class AppleWheelPicker {
    /**
     * @param {Object} config
     * @param {HTMLElement|string} config.container Mount target
     * @param {Array<{value: number, label: string}>} [config.options] Options list
     * @param {number} [config.defaultValue=12.99] Initial selected value
     * @param {number} [config.itemHeight=44] Row height in px
     * @param {number} [config.visibleRows=5] Number of visible rows (odd number)
     * @param {boolean} [config.soundEnabled=true] Synthesize subtle tick sound on snap
     * @param {Function} [config.onChange] Selection change callback
     */
    constructor(config = {}) {
        this.container = typeof config.container === 'string'
            ? document.querySelector(config.container)
            : config.container;

        this.options = config.options || generatePriceOptions();
        this.itemHeight = config.itemHeight || 44;
        this.visibleRows = config.visibleRows || 5;
        this.soundEnabled = config.soundEnabled !== false;
        this.onChange = typeof config.onChange === 'function' ? config.onChange : () => {};

        // Calculate initial selected index
        this.defaultValue = config.defaultValue ?? DEFAULT_PRICE;
        let initialIdx = this.options.findIndex(opt => Math.abs(opt.value - this.defaultValue) < 0.001);
        if (initialIdx === -1) {
            initialIdx = Math.max(0, Math.floor(this.options.length / 2));
        }

        this.selectedIndex = initialIdx;
        this.selectedValue = this.options[initialIdx]?.value ?? DEFAULT_PRICE;

        // DOM elements
        this.rootEl = null;
        this.scrollEl = null;
        this.itemsTrackEl = null;
        this.lensEl = null;
        this.itemEls = [];

        // Drag & scroll state
        this.isPointerDown = false;
        this.pointerStartY = 0;
        this.pointerStartScrollTop = 0;
        this.lastPointerY = 0;
        this.lastPointerTime = 0;
        this.velocity = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.rafId = null;

        // Audio tick context (lazy)
        this.audioCtx = null;

        // Bound event listeners for cleanup
        this._boundOnScroll = this._onScroll.bind(this);
        this._boundOnPointerDown = this._onPointerDown.bind(this);
        this._boundOnPointerMove = this._onPointerMove.bind(this);
        this._boundOnPointerUp = this._onPointerUp.bind(this);
        this._boundOnKeyDown = this._onKeyDown.bind(this);
        this._boundOnWheel = this._onWheel.bind(this);

        if (this.container) {
            this.mount(this.container);
        }
    }

    /**
     * Mount the picker DOM into container
     * @param {HTMLElement} container
     */
    mount(container) {
        if (!container) return;
        this.container = container;
        this.container.innerHTML = '';

        // Spacer height so top and bottom items center perfectly in lens
        const spacerHeight = ((this.visibleRows - 1) / 2) * this.itemHeight;
        const totalHeight = this.visibleRows * this.itemHeight;

        // Root container
        this.rootEl = document.createElement('div');
        this.rootEl.className = 'apple-wheel-picker';
        this.rootEl.style.height = `${totalHeight}px`;
        this.rootEl.setAttribute('tabindex', '0');
        this.rootEl.setAttribute('role', 'slider');
        this.rootEl.setAttribute('aria-label', 'Ad Editor Price Picker');
        this.rootEl.setAttribute('aria-valuemin', String(MIN_PRICE));
        this.rootEl.setAttribute('aria-valuemax', String(MAX_PRICE));
        this.rootEl.setAttribute('aria-valuenow', String(this.selectedValue));
        this.rootEl.setAttribute('aria-valuetext', `$${this.selectedValue.toFixed(2)}`);

        // Fade overlays (cylindrical shading)
        const topFade = document.createElement('div');
        topFade.className = 'picker-fade-overlay picker-fade-top';
        topFade.style.height = `${spacerHeight + 10}px`;
        topFade.setAttribute('aria-hidden', 'true');

        const bottomFade = document.createElement('div');
        bottomFade.className = 'picker-fade-overlay picker-fade-bottom';
        bottomFade.style.height = `${spacerHeight + 10}px`;
        bottomFade.setAttribute('aria-hidden', 'true');

        // Selection lens (center highlight window)
        this.lensEl = document.createElement('div');
        this.lensEl.className = 'picker-selection-lens';
        this.lensEl.style.height = `${this.itemHeight}px`;
        this.lensEl.style.top = `${spacerHeight}px`;
        this.lensEl.setAttribute('aria-hidden', 'true');
        this.lensEl.innerHTML = `
            <span class="picker-lens-glow"></span>
            <span class="picker-lens-border-top"></span>
            <span class="picker-lens-border-bottom"></span>
            <span class="picker-lens-tag">ACTIVE PASS</span>
        `;

        // Scrollable viewport
        this.scrollEl = document.createElement('div');
        this.scrollEl.className = 'picker-scroll-container';
        this.scrollEl.style.height = `${totalHeight}px`;

        // Top spacer
        const topSpacer = document.createElement('div');
        topSpacer.className = 'picker-spacer';
        topSpacer.style.height = `${spacerHeight}px`;

        // Items track
        this.itemsTrackEl = document.createElement('div');
        this.itemsTrackEl.className = 'picker-items-track';

        this.itemEls = [];
        this.options.forEach((opt, idx) => {
            const item = document.createElement('div');
            item.className = 'picker-item';
            item.style.height = `${this.itemHeight}px`;
            item.dataset.index = String(idx);
            item.dataset.value = String(opt.value);
            item.innerHTML = `<span class="picker-item-label">${opt.label}</span>`;

            // Click on item smoothly centers it
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.scrollToIndex(idx, true);
            });

            this.itemsTrackEl.appendChild(item);
            this.itemEls.push(item);
        });

        // Bottom spacer
        const bottomSpacer = document.createElement('div');
        bottomSpacer.className = 'picker-spacer';
        bottomSpacer.style.height = `${spacerHeight}px`;

        // Assemble scroll container
        this.scrollEl.appendChild(topSpacer);
        this.scrollEl.appendChild(this.itemsTrackEl);
        this.scrollEl.appendChild(bottomSpacer);

        // Assemble root
        this.rootEl.appendChild(this.scrollEl);
        this.rootEl.appendChild(this.lensEl);
        this.rootEl.appendChild(topFade);
        this.rootEl.appendChild(bottomFade);

        this.container.appendChild(this.rootEl);

        // Bind events
        this._bindEvents();

        // Position at starting index
        this.scrollToIndex(this.selectedIndex, false);
        this._update3DEffect(this.selectedIndex * this.itemHeight);
        this._updateSelectedClass(this.selectedIndex);
    }

    _bindEvents() {
        if (!this.scrollEl || !this.rootEl) return;

        this.scrollEl.addEventListener('scroll', this._boundOnScroll, { passive: true });
        this.scrollEl.addEventListener('wheel', this._boundOnWheel, { passive: false });

        this.rootEl.addEventListener('pointerdown', this._boundOnPointerDown);
        window.addEventListener('pointermove', this._boundOnPointerMove);
        window.addEventListener('pointerup', this._boundOnPointerUp);
        window.addEventListener('pointercancel', this._boundOnPointerUp);

        this.rootEl.addEventListener('keydown', this._boundOnKeyDown);
    }

    /**
     * Scroll event handler with rAF 3D curvature and snap detection
     */
    _onScroll() {
        const scrollTop = this.scrollEl.scrollTop;

        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => {
                this._update3DEffect(this.scrollEl.scrollTop);
                this.rafId = null;
            });
        }

        const rawIndex = Math.round(scrollTop / this.itemHeight);
        const clampedIndex = Math.max(0, Math.min(this.options.length - 1, rawIndex));

        if (clampedIndex !== this.selectedIndex) {
            this.selectedIndex = clampedIndex;
            this.selectedValue = this.options[clampedIndex].value;
            this._updateSelectedClass(clampedIndex);
            this._playTickSound();

            // Update ARIA
            if (this.rootEl) {
                this.rootEl.setAttribute('aria-valuenow', String(this.selectedValue));
                this.rootEl.setAttribute('aria-valuetext', `$${this.selectedValue.toFixed(2)}`);
            }

            this.onChange(this.selectedValue, this.options[clampedIndex].label, this.options[clampedIndex]);
        }

        // Detect scroll stop to snap perfectly
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.snapToNearest();
        }, 120);
    }

    /**
     * Compute 3D cylindrical drum perspective for visible items
     * Gives authentic iOS UIPickerView curved tumbler appearance
     * @param {number} scrollTop
     */
    _update3DEffect(scrollTop) {
        if (!this.itemEls || this.itemEls.length === 0) return;

        const currentExactIdx = scrollTop / this.itemHeight;
        const centerIdx = Math.round(currentExactIdx);

        // Only compute for visible window (+/- 3 items) for 60fps performance
        const start = Math.max(0, centerIdx - 4);
        const end = Math.min(this.itemEls.length - 1, centerIdx + 4);

        for (let i = start; i <= end; i++) {
            const el = this.itemEls[i];
            if (!el) continue;

            const offset = i - currentExactIdx; // fractional distance from center
            const absOffset = Math.abs(offset);

            // Angle rotates item backward as it moves up or down (Apple barrel effect)
            const angle = -offset * 24; // degrees
            const scale = Math.max(0.78, 1 - absOffset * 0.08);
            const opacity = Math.max(0.12, 1 - absOffset * 0.36);

            el.style.transform = `perspective(360px) rotateX(${angle}deg) scale(${scale})`;
            el.style.opacity = String(opacity);
        }
    }

    _updateSelectedClass(activeIdx) {
        this.itemEls.forEach((el, idx) => {
            const isSelected = idx === activeIdx;
            el.classList.toggle('picker-item-selected', isSelected);
        });
    }

    /**
     * Snap scroll position to the nearest exact item center
     */
    snapToNearest() {
        if (!this.scrollEl) return;
        const targetScrollTop = this.selectedIndex * this.itemHeight;
        if (Math.abs(this.scrollEl.scrollTop - targetScrollTop) > 1) {
            this.scrollEl.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Wheel event listener for frictionless desktop trackpad/mousewheel control
     */
    _onWheel(e) {
        if (!this.scrollEl) return;
        // Allow natural smooth scrolling
    }

    /**
     * Pointer down for touch/mouse drag momentum
     */
    _onPointerDown(e) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        this.isPointerDown = true;
        this.pointerStartY = e.clientY;
        this.pointerStartScrollTop = this.scrollEl ? this.scrollEl.scrollTop : 0;
        this.lastPointerY = e.clientY;
        this.lastPointerTime = performance.now();
        this.velocity = 0;

        if (this.rootEl) {
            this.rootEl.classList.add('is-dragging');
        }
    }

    _onPointerMove(e) {
        if (!this.isPointerDown || !this.scrollEl) return;

        const deltaY = e.clientY - this.pointerStartY;
        this.scrollEl.scrollTop = this.pointerStartScrollTop - deltaY;

        const now = performance.now();
        const dt = now - this.lastPointerTime;
        if (dt > 10) {
            this.velocity = (this.lastPointerY - e.clientY) / dt;
            this.lastPointerY = e.clientY;
            this.lastPointerTime = now;
        }
    }

    _onPointerUp() {
        if (!this.isPointerDown) return;
        this.isPointerDown = false;

        if (this.rootEl) {
            this.rootEl.classList.remove('is-dragging');
        }

        // Apply inertial fling if velocity is notable
        if (Math.abs(this.velocity) > 0.3 && this.scrollEl) {
            const flingDistance = this.velocity * 240;
            const targetScroll = this.scrollEl.scrollTop + flingDistance;
            const targetIdx = Math.max(0, Math.min(this.options.length - 1, Math.round(targetScroll / this.itemHeight)));
            this.scrollToIndex(targetIdx, true);
        } else {
            this.snapToNearest();
        }
    }

    /**
     * Keyboard navigation: ArrowUp (increase price), ArrowDown (decrease price)
     */
    _onKeyDown(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.increment();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.decrement();
        } else if (e.key === 'PageUp') {
            e.preventDefault();
            this.increment(5);
        } else if (e.key === 'PageDown') {
            e.preventDefault();
            this.decrement(5);
        } else if (e.key === 'Home') {
            e.preventDefault();
            this.scrollToIndex(0, true);
        } else if (e.key === 'End') {
            e.preventDefault();
            this.scrollToIndex(this.options.length - 1, true);
        }
    }

    /**
     * Synthesize subtle tactile iOS click pop
     */
    _playTickSound() {
        if (!this.soundEnabled) return;
        try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtxClass) return;
            if (!this.audioCtx) {
                this.audioCtx = new AudioCtxClass();
            }
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(350, this.audioCtx.currentTime + 0.015);

            gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.015);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.016);
        } catch (_) {}
    }

    /**
     * Scroll to an index smoothly or immediately
     * @param {number} index
     * @param {boolean} [smooth=true]
     */
    scrollToIndex(index, smooth = true) {
        const targetIdx = Math.max(0, Math.min(this.options.length - 1, index));
        const targetScrollTop = targetIdx * this.itemHeight;

        if (this.scrollEl) {
            this.scrollEl.scrollTo({
                top: targetScrollTop,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }

        this.selectedIndex = targetIdx;
        this.selectedValue = this.options[targetIdx].value;
        this._updateSelectedClass(targetIdx);
        this._update3DEffect(targetScrollTop);

        if (this.rootEl) {
            this.rootEl.setAttribute('aria-valuenow', String(this.selectedValue));
            this.rootEl.setAttribute('aria-valuetext', `$${this.selectedValue.toFixed(2)}`);
        }

        this.onChange(this.selectedValue, this.options[targetIdx].label, this.options[targetIdx]);
    }

    /**
     * Select a specific price value (e.g. 12.99 or 0.99)
     * @param {number} value
     * @param {boolean} [smooth=true]
     */
    setValue(value, smooth = true) {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) return;

        let closestIdx = 0;
        let minDiff = Infinity;

        this.options.forEach((opt, idx) => {
            const diff = Math.abs(opt.value - numVal);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });

        this.scrollToIndex(closestIdx, smooth);
    }

    /**
     * Increment price upwards by $1 (or multiple steps)
     * Since higher numbers are positioned upwards (lower index), decrement index
     * @param {number} [steps=1]
     */
    increment(steps = 1) {
        this.scrollToIndex(this.selectedIndex - steps, true);
    }

    /**
     * Decrement price downwards by $1 (or multiple steps) towards $0.99 minimum
     * Since lower numbers are positioned downwards (higher index), increment index
     * @param {number} [steps=1]
     */
    decrement(steps = 1) {
        this.scrollToIndex(this.selectedIndex + steps, true);
    }

    /**
     * Get current price number
     * @returns {number}
     */
    getValue() {
        return this.selectedValue;
    }

    /**
     * Get formatted string price e.g. "$12.99"
     * @returns {string}
     */
    getFormattedValue() {
        return `$${this.selectedValue.toFixed(2)}`;
    }

    /**
     * Teardown event listeners
     */
    destroy() {
        clearTimeout(this.scrollTimeout);
        if (this.rafId) cancelAnimationFrame(this.rafId);

        if (this.scrollEl) {
            this.scrollEl.removeEventListener('scroll', this._boundOnScroll);
            this.scrollEl.removeEventListener('wheel', this._boundOnWheel);
        }

        if (this.rootEl) {
            this.rootEl.removeEventListener('pointerdown', this._boundOnPointerDown);
            this.rootEl.removeEventListener('keydown', this._boundOnKeyDown);
        }

        window.removeEventListener('pointermove', this._boundOnPointerMove);
        window.removeEventListener('pointerup', this._boundOnPointerUp);
        window.removeEventListener('pointercancel', this._boundOnPointerUp);

        if (this.audioCtx && this.audioCtx.state !== 'closed') {
            try { this.audioCtx.close(); } catch (_) {}
        }
    }
}
