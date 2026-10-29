// js/ad-composition-studio.js
// Composition Studio — Background + Blob + Track Mapping Engine
// Adds granular control over background themes, blob visibility, and audio-pulse binding

/**
 * Available animated background themes
 */
export const BACKGROUND_THEMES = [
    { id: 'waves',          label: 'Waves',                    icon: '🌊', description: 'Smooth SVG wave animation' },
    { id: 'dts-purple-grid', label: 'DTS Purple Grid',         icon: '🟣', description: 'Dreams TimeSkip glowing grid' },
    { id: 'pink',           label: 'Pink Vibrant',             icon: '💖', description: 'Fluid pink-magenta motion' },
    { id: 'dark',           label: 'Dark Minimalist',          icon: '🖤', description: 'Sleek ambient dark canvas' },
    { id: 'lexi-blue',      label: 'Lexi Blue',               icon: '💎', description: 'Signature intelligent blue glow' }
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
        this.showOuterCircles = true;
        this.showNameTags = true;
        this.showDialogBox = true;
        this.userName = 'User';
        this.isOpen = false;

        // Load persisted settings
        try {
            const savedUserName = localStorage.getItem('medixly_comp_user_name');
            if (savedUserName) this.userName = savedUserName;
            const savedDialog = localStorage.getItem('medixly_comp_dialog_box');
            if (savedDialog !== null) this.showDialogBox = savedDialog === 'true';
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
        this.gearBtn.className = 'dock-btn';
        this.gearBtn.title = 'Composition Studio';
        this.gearBtn.innerHTML = '<span>⚙️ Studio</span>';
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
                <span class="comp-studio-title">⚙️ Composition Studio</span>
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
                        <label class="comp-toggle-row">
                            <span class="comp-toggle-label">Dialog Box / Captions</span>
                            <input type="checkbox" class="comp-toggle-input" data-action="toggle-dialog"
                                   ${this.showDialogBox ? 'checked' : ''}>
                            <span class="comp-toggle-slider"></span>
                        </label>
                        <label class="comp-toggle-row">
                            <span class="comp-toggle-label">Outer Circles</span>
                            <input type="checkbox" class="comp-toggle-input" data-action="toggle-circles"
                                   ${this.showOuterCircles ? 'checked' : ''}>
                            <span class="comp-toggle-slider"></span>
                        </label>
                        <label class="comp-toggle-row">
                            <span class="comp-toggle-label">Name Tags</span>
                            <input type="checkbox" class="comp-toggle-input" data-action="toggle-tags"
                                   ${this.showNameTags ? 'checked' : ''}>
                            <span class="comp-toggle-slider"></span>
                        </label>
                    </div>
                </section>

                <!-- Step 3: Track & Pulse Binding -->
                <section class="comp-section">
                    <div class="comp-section-header">
                        <span class="comp-section-step">3</span>
                        <span class="comp-section-title">Track & Pulse Binding</span>
                    </div>
                    <div class="comp-tracks-list">
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
                        this.bindTrack(parseInt(value, 10));
                        break;
                    case 'reset-user-name':
                        this.setUserName('User');
                        const inputEl = this.panelEl.querySelector('#comp-input-user-name');
                        if (inputEl) inputEl.value = 'User';
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
                    case 'toggle-dialog':
                        this.setDialogBox(input.checked);
                        break;
                    case 'toggle-circles':
                        this.setOuterCircles(input.checked);
                        break;
                    case 'toggle-tags':
                        this.setNameTags(input.checked);
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
    setBackground(themeId) {
        if (!BACKGROUND_THEMES.find(t => t.id === themeId)) return;
        this.activeBackground = themeId;

        const viewport = this.controller.elements.viewport;
        if (viewport) {
            viewport.setAttribute('data-bg-theme', themeId);
        }

        this._updateActiveButtons('bg', themeId);
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
     * Toggle: Speaker text / dialog box visibility
     */
    setDialogBox(visible) {
        this.showDialogBox = visible;
        const captionsStage = this.controller.elements.captionCard?.closest('.ad-captions-stage') || 
                              document.querySelector('.ad-captions-stage');
        if (captionsStage) {
            captionsStage.classList.toggle('captions-hidden', !visible);
        }
        try { localStorage.setItem('medixly_comp_dialog_box', String(visible)); } catch (_) {}
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
        this.setBackground(this.activeBackground);
        this.setBlobFilter(this.blobFilter);
        this.setOuterCircles(this.showOuterCircles);
        this.setNameTags(this.showNameTags);
        this.setDialogBox(this.showDialogBox);
        this.setUserName(this.userName);
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
        if (this.panelEl && this.panelEl.parentNode) {
            this.panelEl.parentNode.removeChild(this.panelEl);
        }
        if (this.gearBtn && this.gearBtn.parentNode) {
            this.gearBtn.parentNode.removeChild(this.gearBtn);
        }
    }
}
