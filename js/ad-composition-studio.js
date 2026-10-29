// js/ad-composition-studio.js
// Composition Studio — Background + Blob + Track Mapping Engine
// Adds granular control over background themes, blob visibility, audio-pulse binding, and ad pricing

import {
    AppleWheelPicker,
    generatePriceOptions,
    DEFAULT_PRICE,
    MIN_PRICE,
    MAX_PRICE,
    PRICE_STEP
} from './apple-wheel-picker.js';

/**
 * Available animated background themes
 */
export const BACKGROUND_THEMES = [
    { id: 'waves',            label: 'Medixly Waves',            icon: '🌊', description: 'Smooth multi-layered SVG ribbon waves' },
    { id: 'dts-purple-grid',   label: 'DTS Purple Grid',          icon: '🟣', description: 'Dreams TimeSkip glowing grid' },
    { id: 'dts-waves-hybrid',  label: 'Grid + Waves Hybrid',      icon: '⚡', description: 'Purple grid + flowing waves' },
    { id: 'pink',             label: 'Pink Creator Aura',        icon: '💖', description: 'Fluid pink-magenta motion' },
    { id: 'lexi-blue',        label: 'Lexi Blue',                icon: '💎', description: 'Signature intelligent blue glow' },
    { id: 'dark-pink-waves',  label: 'Dark + Pink Waves',        icon: '✨', description: 'Minimalist dark with pink waves' },
    { id: 'dark',             label: 'Dark Minimalist',          icon: '🖤', description: 'Sleek ambient dark canvas' }
];

/**
 * Blob filter modes
 */
export const BLOB_FILTERS = [
    { id: 'both',      label: 'Both Blobs',     icon: '👥' },
    { id: 'user-only', label: 'User Blob Only',  icon: '🩷' },
    { id: 'lexi-only', label: 'Lexi Blob Only',  icon: '💙' }
];

/**
 * CompositionStudio manages the settings gear panel with:
 * - Background selection
 * - Blob filtering (which blobs appear)
 * - Auto background cycling toggle
 * - Feature badges toggle
 * - Outer circle toggle
 * - Name tag toggle
 * - Track & pulse binding
 */
export class CompositionStudio {
    constructor(controller) {
        /** @type {import('./ad-preview-controller.js').AdPreviewController} */
        this.controller = controller;

        // State
        this.activeBackground = 'waves';
        this.blobFilter = 'both';         // 'both' | 'user-only' | 'lexi-only'
        this.autoCycleBackground = true;
        this.showFeatureBadges = true;
        this.showOuterCircles = true;
        this.showNameTags = true;
        this.showCaptionBox = true;
        this.showDialogBox = true;
        this.userName = 'User';
        this.selectedPrice = DEFAULT_PRICE; // exactly 12.99
        this.pricePicker = null;
        this.isOpen = false;

        // Load persisted settings
        try {
            const savedUserName = localStorage.getItem('medixly_comp_user_name');
            if (savedUserName) this.userName = savedUserName;
            const savedCaption = localStorage.getItem('medixly_comp_caption_box') ?? localStorage.getItem('medixly_comp_dialog_box');
            if (savedCaption !== null) {
                this.showCaptionBox = savedCaption === 'true';
                this.showDialogBox = this.showCaptionBox;
            }
            const savedAutoBg = localStorage.getItem('medixly_comp_auto_bg');
            if (savedAutoBg !== null) this.autoCycleBackground = savedAutoBg === 'true';
            const savedBadges = localStorage.getItem('medixly_comp_feature_badges');
            if (savedBadges !== null) this.showFeatureBadges = savedBadges === 'true';
            const savedPrice = localStorage.getItem('medixly_ad_editor_price') ?? localStorage.getItem('medixly_comp_price');
            if (savedPrice !== null) {
                const parsed = parseFloat(savedPrice);
                if (!isNaN(parsed) && parsed >= MIN_PRICE && parsed <= MAX_PRICE) {
                    this.selectedPrice = parsed;
                }
            }
        } catch (_) {}

        // DOM references (set during mount)
        this.panelEl = null;
        this.gearBtn = null;
    }

    /**
     * Mount the Composition Studio UI into the page
     */
    mount() {
        this._createGearButton();
        this._createPanel();
        this._initPricePicker();
        this._bindEvents();
        this._applyState();
    }

    /**
     * Create the floating gear button in the top dock
     */
    _createGearButton() {
        const topDock = this.controller.elements.topDock;
        if (!topDock) return;

        this.gearBtn = document.createElement('button');
        this.gearBtn.id = 'btn-composition-gear';
        this.gearBtn.className = 'dock-btn btn-settings-gear';
        this.gearBtn.title = 'Settings & Composition Studio';
        this.gearBtn.setAttribute('aria-label', 'Settings');
        this.gearBtn.innerHTML = '<span>⚙️ Settings</span>';
        topDock.insertBefore(this.gearBtn, topDock.firstChild);
    }

    /**
     * Create the full Composition Studio settings panel
     */
    _createPanel() {
        this.panelEl = document.createElement('div');
        this.panelEl.id = 'composition-studio-panel';
        this.panelEl.className = 'comp-studio-panel';
        this.panelEl.innerHTML = this._buildPanelHTML();

        const viewport = this.controller.elements.viewport || document.body;
        viewport.appendChild(this.panelEl);
    }

    /**
     * Build the inner HTML for the studio panel
     */
    _buildPanelHTML() {
        const bgOptions = BACKGROUND_THEMES.map(bg => `
            <button class="comp-option-btn${bg.id === this.activeBackground ? ' active' : ''}"
                    data-action="bg" data-value="${bg.id}" title="${bg.description}">
                <span class="comp-option-icon">${bg.icon}</span>
                <span class="comp-option-label">${bg.label}</span>
            </button>
        `).join('');

        const blobOptions = BLOB_FILTERS.map(bf => `
            <button class="comp-option-btn${bf.id === this.blobFilter ? ' active' : ''}"
                    data-action="blob" data-value="${bf.id}">
                <span class="comp-option-icon">${bf.icon}</span>
                <span class="comp-option-label">${bf.label}</span>
            </button>
        `).join('');

        const tracks = this.controller.tracks || [];
        const trackOptions = tracks.map(t => `
            <button class="comp-option-btn comp-track-btn${t.id === this.controller.currentTrack?.id ? ' active' : ''}"
                    data-action="track" data-value="${t.trackNumber}">
                <span class="comp-option-label">${t.title}</span>
                <span class="comp-track-duration">${t.duration.toFixed(1)}s</span>
            </button>
        `).join('');

        return `
            <div class="comp-studio-header">
                <span class="comp-studio-title">⚙️ Settings & Studio</span>
                <button class="comp-studio-close" data-action="close" title="Close">&times;</button>
            </div>

            <div class="comp-studio-body">
                <!-- Step 1: Background Selection -->
                <section class="comp-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">1</span>
                        <span class="comp-section-title">Background</span>
                    </div>
                    <div class="comp-options-grid">
                        ${bgOptions}
                    </div>
                </section>

                <!-- Step 2: Blob Filtering -->
                <section class="comp-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">2</span>
                        <span class="comp-section-title">Blob Display</span>
                    </div>
                    <div class="comp-options-grid">
                        ${blobOptions}
                    </div>
                </section>

                <!-- Editable User Name -->
                <section class="comp-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">👤</span>
                        <span class="comp-section-title">User Display Name</span>
                    </div>
                    <div class="comp-input-group">
                        <input type="text" id="comp-input-user-name" class="comp-text-input" 
                               placeholder="User" maxlength="24" value="${this.userName}"
                               data-action="input-user-name">
                        <button type="button" class="comp-reset-btn" data-action="reset-user-name" title="Reset to default">Reset</button>
                    </div>
                </section>

                <!-- Visual Toggles -->
                <section class="comp-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">⟡</span>
                        <span class="comp-section-title">Visual Toggles</span>
                    </div>
                    <div class="comp-toggles">
                        <label class="comp-toggle-row" title="Cycle backgrounds automatically per choreography">
                            <div class="comp-toggle-info">
                                <span class="comp-toggle-label">Auto Backgrounds</span>
                                <span class="comp-toggle-subtext">Dynamic scene cycling</span>
                            </div>
                            <div class="comp-toggle-ctrl">
                                <span class="comp-toggle-state${this.autoCycleBackground ? '' : ' state-off'}">${this.autoCycleBackground ? 'ON' : 'OFF'}</span>
                                <input type="checkbox" class="comp-toggle-input" data-action="toggle-auto-bg"
                                       ${this.autoCycleBackground ? 'checked' : ''}>
                                <span class="comp-toggle-slider"></span>
                            </div>
                        </label>
                        <label class="comp-toggle-row" title="Show feature badges and status labels">
                            <div class="comp-toggle-info">
                                <span class="comp-toggle-label">Feature Badges</span>
                                <span class="comp-toggle-subtext">Floating showcase pills</span>
                            </div>
                            <div class="comp-toggle-ctrl">
                                <span class="comp-toggle-state${this.showFeatureBadges ? '' : ' state-off'}">${this.showFeatureBadges ? 'ON' : 'OFF'}</span>
                                <input type="checkbox" class="comp-toggle-input" data-action="toggle-feature-badges"
                                       ${this.showFeatureBadges ? 'checked' : ''}>
                                <span class="comp-toggle-slider"></span>
                            </div>
                        </label>
                        <label class="comp-toggle-row" id="comp-toggle-caption-box-row" title="Toggle caption box under blobs">
                            <div class="comp-toggle-info">
                                <span class="comp-toggle-label">Caption Box</span>
                                <span class="comp-toggle-subtext">Box under blobs</span>
                            </div>
                            <div class="comp-toggle-ctrl">
                                <span class="comp-toggle-state${this.showCaptionBox ? '' : ' state-off'}">${this.showCaptionBox ? 'ON' : 'OFF'}</span>
                                <input type="checkbox" class="comp-toggle-input" id="comp-toggle-caption-box" data-action="toggle-caption-box"
                                       ${this.showCaptionBox ? 'checked' : ''}>
                                <span class="comp-toggle-slider"></span>
                            </div>
                        </label>
                        <label class="comp-toggle-row" title="Toggle outer resonance rings">
                            <div class="comp-toggle-info">
                                <span class="comp-toggle-label">Outer Circles</span>
                                <span class="comp-toggle-subtext">Resonance rings</span>
                            </div>
                            <div class="comp-toggle-ctrl">
                                <span class="comp-toggle-state${this.showOuterCircles ? '' : ' state-off'}">${this.showOuterCircles ? 'ON' : 'OFF'}</span>
                                <input type="checkbox" class="comp-toggle-input" data-action="toggle-circles"
                                       ${this.showOuterCircles ? 'checked' : ''}>
                                <span class="comp-toggle-slider"></span>
                            </div>
                        </label>
                        <label class="comp-toggle-row" title="Toggle speaker name tags">
                            <div class="comp-toggle-info">
                                <span class="comp-toggle-label">Name Tags</span>
                                <span class="comp-toggle-subtext">User & Lexi AI tags</span>
                            </div>
                            <div class="comp-toggle-ctrl">
                                <span class="comp-toggle-state${this.showNameTags ? '' : ' state-off'}">${this.showNameTags ? 'ON' : 'OFF'}</span>
                                <input type="checkbox" class="comp-toggle-input" data-action="toggle-tags"
                                       ${this.showNameTags ? 'checked' : ''}>
                                <span class="comp-toggle-slider"></span>
                            </div>
                        </label>
                    </div>
                </section>

                <!-- Step 3: Ad Pricing & Pass Rate (Apple-Style Wheel Picker) -->
                <section class="comp-section comp-section-pricing" id="comp-pricing-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">3</span>
                        <span class="comp-section-title">Pricing & Pass Rate</span>
                        <span class="comp-pricing-badge" id="comp-pricing-badge">$${this.selectedPrice.toFixed(2)}</span>
                    </div>
                    <div class="comp-pricing-card">
                        <div class="comp-pricing-display-row">
                            <div class="comp-pricing-display-col">
                                <span class="comp-pricing-sublabel">Locked Editor Rate</span>
                                <div class="comp-pricing-value-group">
                                    <span class="comp-pricing-hero" id="comp-pricing-hero">$${this.selectedPrice.toFixed(2)}</span>
                                    <span class="comp-pricing-interval">/mo</span>
                                </div>
                            </div>
                            <div class="comp-pricing-steppers">
                                <button type="button" class="comp-step-btn" id="btn-price-decrement" data-action="decrement-price" title="Decrease by $1.00" aria-label="Decrease price by $1">−</button>
                                <button type="button" class="comp-step-btn" id="btn-price-increment" data-action="increment-price" title="Increase by $1.00" aria-label="Increase price by $1">+</button>
                            </div>
                        </div>

                        <!-- Apple-Style Smooth Wheel Picker Mount -->
                        <div id="comp-apple-price-picker" class="apple-price-picker-mount"></div>

                        <!-- Quick Preset Pills -->
                        <div class="comp-pricing-presets">
                            <button type="button" class="comp-preset-pill${Math.abs(this.selectedPrice - 0.99) < 0.01 ? ' active' : ''}" data-action="preset-price" data-value="0.99">$0.99 Min</button>
                            <button type="button" class="comp-preset-pill${Math.abs(this.selectedPrice - 1.99) < 0.01 ? ' active' : ''}" data-action="preset-price" data-value="1.99">$1.99</button>
                            <button type="button" class="comp-preset-pill${Math.abs(this.selectedPrice - 6.99) < 0.01 ? ' active' : ''}" data-action="preset-price" data-value="6.99">$6.99 Cap</button>
                            <button type="button" class="comp-preset-pill${Math.abs(this.selectedPrice - 12.99) < 0.01 ? ' active' : ''}" data-action="preset-price" data-value="12.99">$12.99 Default</button>
                            <button type="button" class="comp-preset-pill${Math.abs(this.selectedPrice - 19.99) < 0.01 ? ' active' : ''}" data-action="preset-price" data-value="19.99">$19.99</button>
                        </div>

                        <div class="comp-pricing-footer">
                            <span class="comp-pricing-status" id="comp-pricing-status">✓ Price Synced & Saved to Ad State</span>
                            <button type="button" class="comp-pricing-save-btn" data-action="save-price" id="btn-save-ad-price" title="Save ad price">Save Price</button>
                        </div>
                    </div>
                </section>

                <!-- Step 4: Track & Pulse Binding -->
                <section class="comp-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">4</span>
                        <span class="comp-section-title">Track & Pulse Binding</span>
                    </div>
                    <div class="comp-tracks-list">
                        <!-- Master Showcase Preset Button -->
                        <button class="comp-option-btn comp-track-btn${this.controller.currentTrack?.isMasterShowcase ? ' active' : ''}"
                                data-action="track" data-value="showcase"
                                style="border: 1px solid #ec4899; background: rgba(236, 72, 153, 0.12); margin-bottom: 8px;">
                            <span class="comp-option-label" style="color: #f43f5e; font-weight: 800;">✨ Full Feature Showcase</span>
                            <span class="comp-track-duration" style="color: #38bdf8; font-weight: 800;">57.0s</span>
                        </button>
                        ${trackOptions}
                    </div>
                </section>
            </div>
        `;
    }

    /**
     * Wire up all event handlers
     */
    _bindEvents() {
        // Gear button opens/closes panel
        if (this.gearBtn) {
            this.gearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        // Delegate clicks inside the panel
        if (this.panelEl) {
            this.panelEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const btn = e.target.closest('[data-action]');
                if (!btn) return;

                const action = btn.dataset.action;
                const value = btn.dataset.value;

                switch (action) {
                    case 'close':
                        this.close();
                        break;
                    case 'bg':
                        this.setBackground(value);
                        break;
                    case 'blob':
                        this.setBlobFilter(value);
                        break;
                    case 'track':
                        this.bindTrack(value === 'showcase' ? 'showcase' : parseInt(value, 10));
                        break;
                    case 'reset-user-name':
                        this.setUserName('User');
                        const inputEl = this.panelEl.querySelector('#comp-input-user-name');
                        if (inputEl) inputEl.value = 'User';
                        break;
                    case 'decrement-price':
                        this.decrementPrice();
                        break;
                    case 'increment-price':
                        this.incrementPrice();
                        break;
                    case 'preset-price':
                        this.setPrice(parseFloat(value), true);
                        break;
                    case 'save-price':
                        this.savePrice();
                        break;
                }
            });

            // Input listener for dynamic user name typing
            this.panelEl.addEventListener('input', (e) => {
                const target = e.target;
                if (target && target.dataset.action === 'input-user-name') {
                    this.setUserName(target.value);
                }
            });

            // Toggle checkboxes
            this.panelEl.addEventListener('change', (e) => {
                const input = e.target;
                if (!input.dataset.action) return;

                switch (input.dataset.action) {
                    case 'toggle-auto-bg':
                        this.setAutoCycleBackground(input.checked);
                        this._updateToggleStateLabel(input, input.checked);
                        break;
                    case 'toggle-feature-badges':
                        this.setFeatureBadges(input.checked);
                        this._updateToggleStateLabel(input, input.checked);
                        break;
                    case 'toggle-caption-box':
                    case 'toggle-dialog':
                        this.setCaptionBox(input.checked);
                        this._updateToggleStateLabel(input, input.checked);
                        break;
                    case 'toggle-circles':
                        this.setOuterCircles(input.checked);
                        this._updateToggleStateLabel(input, input.checked);
                        break;
                    case 'toggle-tags':
                        this.setNameTags(input.checked);
                        this._updateToggleStateLabel(input, input.checked);
                        break;
                }
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.panelEl && !this.panelEl.contains(e.target) && e.target !== this.gearBtn) {
                this.close();
            }
        });

        // Keyboard shortcut: 'G' to toggle
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'g' || e.key === 'G') {
                if (!e.ctrlKey && !e.metaKey) {
                    this.toggle();
                }
            }
        });
    }

    /**
     * Open / Close / Toggle the panel
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        if (this.panelEl) this.panelEl.classList.add('panel-open');
        if (this.gearBtn) this.gearBtn.classList.add('active');
        // Close the tracks dropdown if open
        if (this.controller.elements.tracksMenu) {
            this.controller.elements.tracksMenu.classList.remove('menu-open');
        }
    }

    close() {
        this.isOpen = false;
        if (this.panelEl) this.panelEl.classList.remove('panel-open');
        if (this.gearBtn) this.gearBtn.classList.remove('active');
    }

    /**
     * Step 1: Set background theme
     */
    setBackground(themeId, isManual = true) {
        if (!BACKGROUND_THEMES.find(t => t.id === themeId)) return;
        this.activeBackground = themeId;

        if (isManual) {
            this.setAutoCycleBackground(false);
            if (this.panelEl) {
                const autoBgInput = this.panelEl.querySelector('[data-action="toggle-auto-bg"]');
                if (autoBgInput) {
                    autoBgInput.checked = false;
                    this._updateToggleStateLabel(autoBgInput, false);
                }
            }
        }

        const viewport = this.controller.elements.viewport;
        if (viewport) {
            viewport.setAttribute('data-bg-theme', themeId);
        }

        this._updateActiveButtons('bg', themeId);
    }

    /**
     * Toggle: Auto background cycling based on choreography
     */
    setAutoCycleBackground(enabled) {
        this.autoCycleBackground = Boolean(enabled);
        try { localStorage.setItem('medixly_comp_auto_bg', String(this.autoCycleBackground)); } catch (_) {}
    }

    /**
     * Toggle: Floating feature showcase badges
     */
    setFeatureBadges(visible) {
        this.showFeatureBadges = Boolean(visible);
        const featurePill = document.getElementById('ad-feature-pill');
        if (featurePill) {
            featurePill.style.display = this.showFeatureBadges ? '' : 'none';
            if (!this.showFeatureBadges) featurePill.classList.remove('visible');
        }
        const orbPill = document.getElementById('ad-orb-status-pill');
        if (orbPill) {
            orbPill.style.display = this.showFeatureBadges ? '' : 'none';
            if (!this.showFeatureBadges) orbPill.classList.remove('visible');
        }
        try { localStorage.setItem('medixly_comp_feature_badges', String(this.showFeatureBadges)); } catch (_) {}
    }

    /**
     * Step 2: Set blob filter
     */
    setBlobFilter(filterId) {
        this.blobFilter = filterId;

        const userSlot = document.getElementById('blob-slot-user');
        const lexiSlot = document.getElementById('blob-slot-lexi');

        if (userSlot) {
            userSlot.style.display = (filterId === 'lexi-only') ? 'none' : '';
        }
        if (lexiSlot) {
            lexiSlot.style.display = (filterId === 'user-only') ? 'none' : '';
        }

        // When only one blob, center it
        const arena = this.controller.elements.arena;
        if (arena) {
            arena.classList.remove('blob-filter-user-only', 'blob-filter-lexi-only', 'blob-filter-both');
            arena.classList.add(`blob-filter-${filterId}`);
        }

        this._updateActiveButtons('blob', filterId);
    }

    /**
     * Toggle: Outer resonance circles
     */
    setOuterCircles(visible) {
        this.showOuterCircles = visible;
        const rings = document.querySelectorAll('.blob-resonance-ring');
        rings.forEach(ring => {
            ring.style.display = visible ? '' : 'none';
        });
    }

    /**
     * Toggle: Speaker name tags
     */
    setNameTags(visible) {
        this.showNameTags = visible;
        const tags = document.querySelectorAll('.speaker-tag');
        tags.forEach(tag => {
            tag.style.display = visible ? '' : 'none';
        });
    }

    /**
     * Update state label (ON / OFF) beside toggle slider
     */
    _updateToggleStateLabel(input, isChecked) {
        const row = input.closest('.comp-toggle-row');
        if (!row) return;
        const stateEl = row.querySelector('.comp-toggle-state');
        if (stateEl) {
            stateEl.textContent = isChecked ? 'ON' : 'OFF';
            stateEl.classList.toggle('state-off', !isChecked);
        }
    }

    /**
     * Toggle: Caption box (box under blobs) visibility (on / off)
     * Removes or shows the captions stage and card beneath the dual blobs
     */
    setCaptionBox(visible) {
        this.showCaptionBox = Boolean(visible);
        this.showDialogBox = this.showCaptionBox;
        const captionsStage = this.controller.elements.captionCard?.closest('.ad-captions-stage') || 
                              document.querySelector('.ad-captions-stage');
        if (captionsStage) {
            captionsStage.classList.toggle('captions-hidden', !this.showCaptionBox);
            captionsStage.style.display = this.showCaptionBox ? '' : 'none';
        }
        const captionCard = this.controller.elements.captionCard || document.getElementById('caption-card');
        if (captionCard) {
            captionCard.classList.toggle('caption-box-hidden', !this.showCaptionBox);
            captionCard.style.display = this.showCaptionBox ? '' : 'none';
        }

        // Sync toggle checkbox state if rendered in panel
        if (this.panelEl) {
            const toggleInput = this.panelEl.querySelector('[data-action="toggle-caption-box"]') ||
                                this.panelEl.querySelector('[data-action="toggle-dialog"]');
            if (toggleInput && toggleInput.checked !== this.showCaptionBox) {
                toggleInput.checked = this.showCaptionBox;
            }
            if (toggleInput) {
                this._updateToggleStateLabel(toggleInput, this.showCaptionBox);
            }
        }

        try {
            localStorage.setItem('medixly_comp_caption_box', String(this.showCaptionBox));
            localStorage.setItem('medixly_comp_dialog_box', String(this.showCaptionBox));
        } catch (_) {}
    }

    /**
     * Alias for setCaptionBox for backwards compatibility
     */
    setDialogBox(visible) {
        this.setCaptionBox(visible);
    }

    /**
     * Dynamically edit displayed user name
     */
    setUserName(name) {
        this.userName = (name && name.trim()) ? name.trim() : 'User';
        const userTag = this.controller.elements.userTag || document.getElementById('speaker-tag-user');
        if (userTag) {
            const labelSpan = userTag.querySelector('span:last-child');
            if (labelSpan) {
                labelSpan.textContent = this.userName;
            }
        }
        try { localStorage.setItem('medixly_comp_user_name', this.userName); } catch (_) {}
    }

    /**
     * Step 3: Bind a track and start pulse
     */
    bindTrack(trackNumber) {
        this.controller.initTrack(trackNumber);
        this._updateActiveButtons('track', String(trackNumber));
    }

    /**
     * Apply current state to DOM (for initialization)
     */
    _applyState() {
        this.setBackground(this.activeBackground, false);
        this.setBlobFilter(this.blobFilter);
        this.setAutoCycleBackground(this.autoCycleBackground);
        this.setFeatureBadges(this.showFeatureBadges);
        this.setOuterCircles(this.showOuterCircles);
        this.setNameTags(this.showNameTags);
        this.setCaptionBox(this.showCaptionBox);
        this.setUserName(this.userName);
        this.setPrice(this.selectedPrice, true);
    }

    /**
     * Mount and initialize the Apple Wheel Picker for pricing
     */
    _initPricePicker() {
        if (!this.panelEl) return;
        const mountEl = this.panelEl.querySelector('#comp-apple-price-picker');
        if (!mountEl) return;

        this.pricePicker = new AppleWheelPicker({
            container: mountEl,
            defaultValue: this.selectedPrice,
            visibleRows: 5,
            itemHeight: 44,
            onChange: (price) => {
                this.setPrice(price, false);
            }
        });
    }

    /**
     * Set selected price, updates wheel picker, UI labels, and controller state
     * @param {number|string} price
     * @param {boolean} [updatePicker=true]
     */
    setPrice(price, updatePicker = true) {
        const num = parseFloat(price);
        if (isNaN(num)) return;
        const clamped = Math.max(MIN_PRICE, Math.min(MAX_PRICE, num));
        this.selectedPrice = clamped;

        if (updatePicker && this.pricePicker) {
            this.pricePicker.setValue(clamped, true);
        }

        if (this.panelEl) {
            const heroEl = this.panelEl.querySelector('#comp-pricing-hero');
            if (heroEl) heroEl.textContent = `$${clamped.toFixed(2)}`;
            const badgeEl = this.panelEl.querySelector('#comp-pricing-badge');
            if (badgeEl) badgeEl.textContent = `$${clamped.toFixed(2)}`;

            // Update preset pill active states
            const pills = this.panelEl.querySelectorAll('.comp-preset-pill');
            pills.forEach(pill => {
                const pillVal = parseFloat(pill.dataset.value);
                pill.classList.toggle('active', Math.abs(pillVal - clamped) < 0.01);
            });

            const statusEl = this.panelEl.querySelector('#comp-pricing-status');
            if (statusEl) {
                statusEl.textContent = `✓ Price Synced ($${clamped.toFixed(2)})`;
            }
        }

        // Persist to localStorage
        try {
            localStorage.setItem('medixly_ad_editor_price', clamped.toFixed(2));
            localStorage.setItem('medixly_comp_price', clamped.toFixed(2));
        } catch (_) {}

        // Bind to controller state
        if (this.controller) {
            if (typeof this.controller.setAdPrice === 'function') {
                this.controller.setAdPrice(clamped);
            } else {
                this.controller.selectedPrice = clamped;
                this.controller.adPrice = clamped;
            }
        }
    }

    /**
     * Get current price number
     * @returns {number}
     */
    getPrice() {
        return this.selectedPrice;
    }

    /**
     * Increment price upwards by $1.00
     */
    incrementPrice() {
        if (this.pricePicker) {
            this.pricePicker.increment();
        } else {
            this.setPrice(Math.min(MAX_PRICE, this.selectedPrice + PRICE_STEP), true);
        }
    }

    /**
     * Decrement price downwards by $1.00 towards $0.99 minimum
     */
    decrementPrice() {
        if (this.pricePicker) {
            this.pricePicker.decrement();
        } else {
            this.setPrice(Math.max(MIN_PRICE, this.selectedPrice - PRICE_STEP), true);
        }
    }

    /**
     * Save price button action with confirmation feedback
     */
    savePrice() {
        this.setPrice(this.selectedPrice, true);
        if (this.panelEl) {
            const saveBtn = this.panelEl.querySelector('#btn-save-ad-price');
            if (saveBtn) {
                const orig = saveBtn.textContent;
                saveBtn.textContent = '✓ Saved!';
                saveBtn.style.background = '#10b981';
                setTimeout(() => {
                    saveBtn.textContent = orig;
                    saveBtn.style.background = '';
                }, 1400);
            }
        }
        return this.getFormData();
    }

    /**
     * Retrieve complete state and form data from the editor
     * @returns {Object}
     */
    getFormData() {
        return {
            price: this.selectedPrice,
            formattedPrice: `$${this.selectedPrice.toFixed(2)}`,
            background: this.activeBackground,
            blobFilter: this.blobFilter,
            userName: this.userName,
            autoCycleBackground: this.autoCycleBackground,
            showFeatureBadges: this.showFeatureBadges,
            showCaptionBox: this.showCaptionBox,
            showDialogBox: this.showDialogBox,
            showOuterCircles: this.showOuterCircles,
            showNameTags: this.showNameTags
        };
    }

    /**
     * Update active class on option buttons for a given action group
     */
    _updateActiveButtons(action, activeValue) {
        if (!this.panelEl) return;
        const buttons = this.panelEl.querySelectorAll(`[data-action="${action}"]`);
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === activeValue);
        });
    }

    /**
     * Clean up
     */
    destroy() {
        if (this.pricePicker) {
            this.pricePicker.destroy();
            this.pricePicker = null;
        }
        if (this.panelEl && this.panelEl.parentNode) {
            this.panelEl.parentNode.removeChild(this.panelEl);
        }
        if (this.gearBtn && this.gearBtn.parentNode) {
            this.gearBtn.parentNode.removeChild(this.gearBtn);
        }
    }
}
