/**
 * js/medixly-editors.js
 * Master controller for Medixly "For Editors" Pro DAW Workspace.
 * Integrates Web Audio DSP, hardware-accelerated timeline canvas,
 * background Web Worker analysis, beat-by-beat lyric engine,
 * purple viral hook highlighting, and pro NLE export pipeline.
 */

import { detectTransients, estimateBPM, generateBeatGrid, snapToNearest } from './editor-audio-analyzer.js';
import {
    computePeaksMipmap,
    computeTransients,
    computeBPM,
    computeBeatGrid,
    computeViralHookSection
} from './editor-dsp-worker.js';
import { SyllableSyncManager, splitWordIntoSyllables, tokenizeLyrics } from './editor-syllable-engine.js';
import {
    msToSrtTimecode,
    msToSmpteTimecode,
    msToFrames,
    framesToMs,
    exportToSRT,
    exportToPremiereCSV,
    exportToPremiereXML,
    exportToDaVinciResolveCSV,
    exportToDaVinciResolveEDL,
    exportToAfterEffects,
    exportToMedixlyJSON,
    downloadFile,
    offsetMarkers,
    audioBufferToWavBlob
} from './editor-export-pipeline.js';
import { WaveformTimelineRenderer } from './editor-waveform-renderer.js';
import { librarySongs } from './song-data.js';
import { lyricsData } from './lyrics-data.js';

/**
 * Global AudioContext Singleton (Strict Single-Instance Enforcement)
 */
export function getGlobalAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!window.__medixlyGlobalAudioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            window.__medixlyGlobalAudioCtx = new AudioContextClass({ latencyHint: 'interactive' });
        }
    }
    return window.__medixlyGlobalAudioCtx;
}

/**
 * Instant Virtualized Autocomplete Search Bar Component
 * Replaces laggy <select> dropdown with 150ms debounced search across massive catalogs.
 */
export class EditorSearchBar {
    constructor(domElements, songs = [], onSelectSong = () => {}) {
        this.container = domElements.container;
        this.input = domElements.input;
        this.clearBtn = domElements.clearBtn;
        this.dropdown = domElements.dropdown;
        this.list = domElements.list;
        this.songs = songs || [];
        this.onSelectSong = onSelectSong;

        this.filteredSongs = [...this.songs];
        this.activeIndex = -1;
        this.debounceTimer = null;
        this.maxRenderedItems = 25; // Virtualized DOM capping to prevent bloat

        this._initListeners();
    }

    _initListeners() {
        if (!this.input) return;

        // Debounced 150ms search input
        this.input.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            const query = e.target.value.trim();
            if (this.clearBtn) {
                this.clearBtn.style.display = query ? 'flex' : 'none';
            }
            this.debounceTimer = setTimeout(() => {
                this.search(query);
            }, 150);
        });

        // Focus & Click opens dropdown
        this.input.addEventListener('focus', () => {
            this.search(this.input.value.trim());
        });

        // Clear button
        this.clearBtn?.addEventListener('click', () => {
            this.input.value = '';
            this.clearBtn.style.display = 'none';
            this.search('');
            this.input.focus();
        });

        // Keyboard navigation
        this.input.addEventListener('keydown', (e) => {
            if (this.dropdown.style.display === 'none') {
                if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    this.showDropdown();
                }
                return;
            }

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveHighlight(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveHighlight(-1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.activeIndex >= 0 && this.activeIndex < this.filteredSongs.length) {
                        this.selectSong(this.filteredSongs[this.activeIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.hideDropdown();
                    break;
            }
        });

        // Click outside closes dropdown
        document.addEventListener('click', (e) => {
            if (!this.container?.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    search(query = '') {
        const q = query.toLowerCase();
        if (!q) {
            this.filteredSongs = [...this.songs];
        } else {
            this.filteredSongs = this.songs.filter(song => {
                const title = (song.title || '').toLowerCase();
                const artist = (song.artist || '').toLowerCase();
                const bpm = song.bpm ? String(song.bpm) : '';
                const key = (song.key || '').toLowerCase();
                const tags = Array.isArray(song.tags) ? song.tags.join(' ').toLowerCase() : '';

                return title.includes(q) ||
                    artist.includes(q) ||
                    bpm.includes(q) ||
                    key.includes(q) ||
                    tags.includes(q);
            });
        }

        this.activeIndex = this.filteredSongs.length > 0 ? 0 : -1;
        this.renderDropdown();
        this.showDropdown();
    }

    renderDropdown() {
        if (!this.list) return;

        if (this.filteredSongs.length === 0) {
            this.list.innerHTML = `
                <div style="padding: 12px; font-size: 0.8rem; color: var(--editor-text-muted); text-align: center;">
                    No tracks found matching query
                </div>`;
            return;
        }

        // Render virtualized subset
        const visibleSlice = this.filteredSongs.slice(0, this.maxRenderedItems);
        this.list.innerHTML = visibleSlice.map((song, idx) => {
            const hasViral = (song.tags && song.tags.includes('viral')) || song.viralStart !== undefined || (lyricsData && lyricsData[song.id]?.some(l => l.trending));
            const isActive = (idx === this.activeIndex);

            return `
                <div class="search-item ${isActive ? 'active' : ''}" data-index="${idx}" role="option" aria-selected="${isActive}">
                    <img class="search-item-art" src="${song.art || '/images/medixly-logo.png'}" alt="" loading="lazy">
                    <div class="search-item-meta">
                        <span class="search-item-title">${song.title}</span>
                        <span class="search-item-sub">${song.artist}</span>
                    </div>
                    <div class="search-item-badges">
                        ${hasViral ? '<span class="badge-viral-hook">🔥 Viral</span>' : ''}
                        ${song.bpm ? `<span class="badge-bpm">${song.bpm} BPM</span>` : ''}
                        <span class="badge-dur">${song.duration || 'Track'}</span>
                    </div>
                </div>`;
        }).join('');

        // Attach click listeners to rendered items
        this.list.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-index'), 10);
                if (this.filteredSongs[idx]) {
                    this.selectSong(this.filteredSongs[idx]);
                }
            });
        });
    }

    moveHighlight(delta) {
        if (this.filteredSongs.length === 0) return;
        const total = Math.min(this.filteredSongs.length, this.maxRenderedItems);
        this.activeIndex = (this.activeIndex + delta + total) % total;

        const items = this.list.querySelectorAll('.search-item');
        items.forEach((item, idx) => {
            if (idx === this.activeIndex) {
                item.classList.add('active');
                if (typeof item.scrollIntoView === 'function') {
                    item.scrollIntoView({ block: 'nearest' });
                }
            } else {
                item.classList.remove('active');
            }
        });
    }

    selectSong(song) {
        if (!song) return;
        if (this.input) {
            this.input.value = `${song.title} — ${song.artist}`;
        }
        if (this.clearBtn) {
            this.clearBtn.style.display = 'flex';
        }
        this.hideDropdown();
        this.onSelectSong(song);
    }

    showDropdown() {
        if (this.dropdown) {
            this.dropdown.style.display = 'block';
        }
    }

    hideDropdown() {
        if (this.dropdown) {
            this.dropdown.style.display = 'none';
        }
    }
}

/**
 * Master Medixly Workspace Controller
 */
export class MedixlyEditorWorkspace {
    constructor() {
        // Audio Context & Graph (Strict Single Global Context)
        this.audioCtx = null;
        this.audioEl = new Audio();
        this.audioEl.crossOrigin = 'anonymous';
        this.audioEl.preload = 'auto';
        this.audioBuffer = null;
        this.isPlaying = false;
        this.playbackRate = 1.0;

        // Metronome Click generator
        this.metronomeEnabled = false;
        this.lastMetronomeBeat = -1;

        // DSP & Sync Engines
        this.transients = [];
        this.bpmData = { bpm: 120, confidence: 0, downbeatOffset: 0, beatIntervalMs: 500 };
        this.beatGrid = [];
        this.syncManager = new SyllableSyncManager({ mode: 'word' });

        // Auto-Beat Engine & Sensitivity
        this.autoBeatEnabled = false;
        this.transientSensitivity = 0.6;

        // Pro In/Out Point Handles
        this.inPoint = null;
        this.outPoint = null;

        // Timeline Settings
        this.fps = 30;
        this.snapToTransients = true;
        this.snapToBeats = true;
        this.snapToleranceMs = 50;

        // Active track & Purple Viral Hook metadata
        this.currentSong = null;
        this.viralSection = null; // { start: number, end: number, label: string }
        this.exportScope = 'full'; // 'full' | 'viral'

        // Background Web Worker
        this.dspWorker = null;
        this.isAnalyzing = false;

        // UI Components
        this.renderer = null;
        this.canvas = null;
        this.searchBar = null;

        // Animation frame loop
        this.animFrameId = null;

        // Elements cache
        this.dom = {};
    }

    /**
     * Initializes workspace DOM listeners, canvas renderer, keyboard shortcuts, and track catalog.
     */
    async init() {
        this._cacheDom();
        this._initWorker();
        this._initCanvas();
        this._initSearchBar();
        this._attachEventListeners();
        this._attachKeyboardShortcuts();
        this._startPlaybackLoop();

        // Load initial track (either URL param song or first in library)
        const params = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : null;
        const songId = params?.get('song') || 'dead-fresh';
        const targetSong = librarySongs.find(s => s.id === songId) || librarySongs[0];

        if (targetSong) {
            await this.loadTrack(targetSong);
        }
    }

    _cacheDom() {
        if (typeof document === 'undefined') return;
        this.dom = {
            canvas: document.getElementById('timeline-canvas'),
            canvasContainer: document.getElementById('canvas-container'),
            timecodeDisplay: document.getElementById('timecode-display'),
            frameDisplay: document.getElementById('frame-display'),
            searchContainer: document.getElementById('editor-search-container'),
            searchInput: document.getElementById('editor-song-search'),
            searchClearBtn: document.getElementById('search-clear-btn'),
            searchDropdown: document.getElementById('search-results-dropdown'),
            searchResultsList: document.getElementById('search-results-list'),
            fileInput: document.getElementById('audio-file-input'),
            uploadBtn: document.getElementById('upload-audio-btn'),
            playPauseBtn: document.getElementById('btn-play-pause'),
            playIcon: document.getElementById('icon-play'),
            pauseIcon: document.getElementById('icon-pause'),
            rewindBtn: document.getElementById('btn-rewind'),
            stepBackBtn: document.getElementById('btn-step-back'),
            stepForwardBtn: document.getElementById('btn-step-forward'),
            metronomeBtn: document.getElementById('btn-metronome'),
            zoomSlider: document.getElementById('zoom-slider'),
            zoomInBtn: document.getElementById('btn-zoom-in'),
            zoomOutBtn: document.getElementById('btn-zoom-out'),
            zoomFitBtn: document.getElementById('btn-zoom-fit'),
            fpsSelect: document.getElementById('fps-select'),
            snapToggle: document.getElementById('toggle-snap'),
            autobeatToggle: document.getElementById('toggle-autobeat'),
            markInBtn: document.getElementById('btn-mark-in'),
            markOutBtn: document.getElementById('btn-mark-out'),
            clearInOutBtn: document.getElementById('btn-clear-in-out'),
            syncModeSelect: document.getElementById('sync-mode-select'),
            lyricsInput: document.getElementById('lyrics-input'),
            loadLyricsBtn: document.getElementById('btn-load-lyrics'),
            parseLyricsBtn: document.getElementById('btn-parse-lyrics'),
            dropMarkerBtn: document.getElementById('btn-drop-marker'),
            undoMarkerBtn: document.getElementById('btn-undo-marker'),
            resetSyncBtn: document.getElementById('btn-reset-sync'),
            quantizeBtn: document.getElementById('btn-quantize'),
            prompterPrev: document.getElementById('prompter-prev'),
            prompterCurrent: document.getElementById('prompter-current'),
            prompterNext: document.getElementById('prompter-next'),
            prompterProgress: document.getElementById('prompter-progress'),
            prompterProgressBar: document.getElementById('prompter-progress-bar'),
            bpmDisplay: document.getElementById('bpm-display'),
            bpmConfidence: document.getElementById('bpm-confidence'),
            tapTempoBtn: document.getElementById('btn-tap-tempo'),
            transientCountDisplay: document.getElementById('transient-count-display'),
            sensitivitySlider: document.getElementById('transient-sensitivity'),
            sensitivityValue: document.getElementById('sensitivity-value'),
            markersTableBody: document.getElementById('markers-table-body'),
            exportBtn: document.getElementById('btn-export'),
            exportModal: document.getElementById('export-modal'),
            closeExportBtn: document.getElementById('btn-close-export'),
            exportPreview: document.getElementById('export-preview'),
            downloadExportBtn: document.getElementById('btn-download-export'),
            downloadAudioBtn: document.getElementById('btn-download-audio'),
            copyExportBtn: document.getElementById('btn-copy-export'),
            exportTabs: document.querySelectorAll('.export-tab-btn'),
            exportFormatBadge: document.getElementById('export-format-badge'),
            scopeFullSongBtn: document.getElementById('scope-full-song'),
            scopeViralBtn: document.getElementById('scope-viral-section'),
            viralScopeCallout: document.getElementById('viral-scope-callout'),
            viralStartBadge: document.getElementById('viral-start-badge')
        };
    }

    _initWorker() {
        if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
            try {
                this.dspWorker = new Worker('/js/editor-dsp-worker.js', { type: 'module' });
                this.dspWorker.onerror = (err) => {
                    console.warn('DSP Web Worker encountered an error, using high-speed main-thread fallback:', err);
                    this.dspWorker = null;
                };
            } catch (err) {
                this.dspWorker = null;
            }
        }
    }

    _initCanvas() {
        if (!this.dom.canvas) return;
        this.renderer = new WaveformTimelineRenderer(this.dom.canvas);
        this.canvas = this.dom.canvas;

        // Interactive timeline scrubbing & marker dragging state
        let isMouseDown = false;
        let dragTargetMarker = null;
        let renderScheduled = false;

        const scheduleRender = () => {
            if (!renderScheduled) {
                renderScheduled = true;
                requestAnimationFrame(() => {
                    this.renderer.render();
                    renderScheduled = false;
                });
            }
        };

        const onPointerDown = (e) => {
            if (e.button !== 0) return; // Primary left button only
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if clicking a marker chip
            const marker = this.renderer.getMarkerAtCoordinates(x, y);
            if (marker) {
                dragTargetMarker = marker;
                this.renderer.selectedMarkerId = marker.id;
                this._highlightTableRow(marker.id);
            } else {
                // Scrubbing playhead
                isMouseDown = true;
                this._seekToCanvasX(x);
            }
            this.renderer.render();
            window.addEventListener('mousemove', onWindowPointerMove);
            window.addEventListener('mouseup', onWindowPointerUp);
        };

        const onWindowPointerMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;

            if (dragTargetMarker) {
                let targetSec = this.renderer.xToTime(x);
                let targetMs = Math.round(targetSec * 1000);

                if (this.snapToTransients || this.snapToBeats) {
                    const snapCandidates = [...this.beatGrid, ...this.transients];
                    const snap = snapToNearest(targetMs, snapCandidates, this.snapToleranceMs);
                    if (snap.didSnap) targetMs = snap.snappedMs;
                }

                const duration = dragTargetMarker.endMs - dragTargetMarker.startMs;
                dragTargetMarker.startMs = targetMs;
                dragTargetMarker.endMs = targetMs + duration;
                this.syncManager.markers.sort((a, b) => a.startMs - b.startMs);
                this.renderer.setMarkers(this.syncManager.markers);

                // Update row timecode directly without rebuilding DOM table
                const activeRow = this.dom.markersTableBody?.querySelector(`[data-marker-id="${dragTargetMarker.id}"]`);
                if (activeRow) {
                    const tcCell = activeRow.querySelector('.col-tc');
                    if (tcCell) tcCell.textContent = msToSmpteTimecode(targetMs, this.fps);
                }
                scheduleRender();
            } else if (isMouseDown) {
                this._seekToCanvasX(x);
                scheduleRender();
            }
        };

        const onWindowPointerUp = () => {
            if (dragTargetMarker) {
                this._renderMarkersTable();
            }
            isMouseDown = false;
            dragTargetMarker = null;
            window.removeEventListener('mousemove', onWindowPointerMove);
            window.removeEventListener('mouseup', onWindowPointerUp);
            this.renderer.render();
        };

        this.canvas.addEventListener('mousedown', onPointerDown);

        // Hover detection on canvas only
        this.canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown || dragTargetMarker) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const hoverMarker = this.renderer.getMarkerAtCoordinates(x, y);
            const newHoverId = hoverMarker ? hoverMarker.id : null;
            if (this.renderer.hoveredMarkerId !== newHoverId) {
                this.renderer.hoveredMarkerId = newHoverId;
                scheduleRender();
            }
        });

        // Wheel listener: Cmd/Ctrl + Scroll zooms; normal scroll pans horizontally
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.metaKey || e.ctrlKey) {
                const zoomDelta = e.deltaY < 0 ? 1.15 : 0.85;
                this.renderer.setZoom(this.renderer.zoom * zoomDelta, e.clientX);
                if (this.dom.zoomSlider) {
                    this.dom.zoomSlider.value = this.renderer.zoom;
                }
            } else {
                const panDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                this.renderer.pan(panDelta);
            }
        }, { passive: false });
    }

    _seekToCanvasX(x) {
        const timeSec = this.renderer.xToTime(x);
        this.seek(timeSec);
    }

    _initSearchBar() {
        if (!this.dom.searchInput) return;
        this.searchBar = new EditorSearchBar({
            container: this.dom.searchContainer,
            input: this.dom.searchInput,
            clearBtn: this.dom.searchClearBtn,
            dropdown: this.dom.searchDropdown,
            list: this.dom.searchResultsList
        }, librarySongs, async (selectedSong) => {
            await this.loadTrack(selectedSong);
        });
    }

    /**
     * Loads a track, decodes PCM audio buffer, and triggers worker/DSP analysis.
     * @param {object} song - Song metadata
     * @param {File} [customFile] - Optional imported file
     */
    async loadTrack(song, customFile = null) {
        this.pause();
        this.currentSong = song;

        // Reset playhead & In/Out points
        this.inPoint = null;
        this.outPoint = null;
        this.renderer.setInOutPoints(null, null);

        // Update search input text
        if (this.dom.searchInput && !customFile) {
            this.dom.searchInput.value = `${song.title} — ${song.artist}`;
            if (this.dom.searchClearBtn) this.dom.searchClearBtn.style.display = 'flex';
        }

        // Update UI status
        if (this.dom.bpmDisplay) this.dom.bpmDisplay.textContent = 'Analyzing...';
        if (this.dom.transientCountDisplay) this.dom.transientCountDisplay.textContent = 'Analyzing audio waveform & beats...';

        try {
            this._ensureAudioContext();

            let arrayBuffer;
            if (customFile) {
                arrayBuffer = await customFile.arrayBuffer();
                this.audioEl.src = URL.createObjectURL(customFile);
            } else {
                const audioUrl = song.src || song.streamUrl;
                this.audioEl.src = audioUrl;
                const response = await fetch(audioUrl);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                arrayBuffer = await response.arrayBuffer();
            }

            // Decode Audio Data via Single Global AudioContext
            this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

            // Determine viral hook metadata if present in song data or lyricsData
            const viralMeta = this._extractViralMetadata(song);

            // Run DSP analysis (Worker or Synchronous Fallback)
            await this._analyzeAudioBuffer(this.audioBuffer, viralMeta);

            // Auto-load lyrics
            this._autoLoadSongLyrics(song.id);

            // Reset timecode to 0
            this.seek(0);
        } catch (err) {
            console.error('Error loading audio track:', err);
            if (this.dom.transientCountDisplay) {
                this.dom.transientCountDisplay.textContent = `Preview active (${err.message})`;
            }
        }
    }

    _extractViralMetadata(song) {
        if (!song) return {};
        let viralStart = song.viralStart;
        let viralEnd = song.viralEnd;

        // If not explicit on song object, check lyricsData trending lines
        if (viralStart === undefined && lyricsData && lyricsData[song.id]) {
            const data = lyricsData[song.id];
            const trendingLines = data.filter(l => l.trending);
            if (trendingLines.length > 0) {
                const first = trendingLines[0];
                const last = trendingLines[trendingLines.length - 1];
                viralStart = first.start;
                viralEnd = (last.end || first.start + 15) + 1.2;
            }
        }

        return { viralStart, viralEnd };
    }

    async _analyzeAudioBuffer(audioBuffer, viralMeta = {}) {
        const sampleRate = audioBuffer.sampleRate;
        const pcm = this._getMonoPcm(audioBuffer);
        const sensitivity = this.transientSensitivity;

        if (this.dspWorker) {
            // Background Web Worker Execution
            try {
                const result = await new Promise((resolve, reject) => {
                    const messageId = `dsp-${Date.now()}`;
                    const handler = (e) => {
                        if (e.data.id === messageId) {
                            this.dspWorker.removeEventListener('message', handler);
                            if (e.data.success) {
                                resolve(e.data);
                            } else {
                                reject(new Error(e.data.error || 'Worker DSP error'));
                            }
                        }
                    };
                    this.dspWorker.addEventListener('message', handler);

                    // Transfer copy of PCM buffer to worker
                    const pcmCopy = new Float32Array(pcm);
                    this.dspWorker.postMessage({
                        id: messageId,
                        type: 'ANALYZE_AUDIO',
                        pcm: pcmCopy,
                        sampleRate,
                        sensitivity,
                        metadata: viralMeta
                    }, [pcmCopy.buffer]);
                });

                this._applyDspResults(result);
                return;
            } catch (workerErr) {
                console.warn('Worker analysis failed, using local pure functions:', workerErr);
            }
        }

        // Main-thread pure-function fallback
        const peaksMipmap = computePeaksMipmap(pcm, sampleRate);
        const transients = computeTransients(pcm, sampleRate, { sensitivity });
        const bpmData = computeBPM(transients);
        const duration = pcm.length / sampleRate;
        const beatGrid = computeBeatGrid(duration, bpmData.bpm, bpmData.downbeatOffset);
        const viralSection = computeViralHookSection(pcm, sampleRate, 20, viralMeta);

        this._applyDspResults({
            peaksMipmap,
            transients,
            bpmData,
            beatGrid,
            viralSection,
            duration
        });
    }

    _getMonoPcm(audioBuffer) {
        const ch0 = audioBuffer.getChannelData(0);
        if (audioBuffer.numberOfChannels === 1) {
            return ch0;
        }
        const ch1 = audioBuffer.getChannelData(1);
        const mono = new Float32Array(ch0.length);
        for (let i = 0; i < ch0.length; i++) {
            mono[i] = (ch0[i] + ch1[i]) * 0.5;
        }
        return mono;
    }

    _applyDspResults(results) {
        this.transients = results.transients || [];
        this.bpmData = results.bpmData || { bpm: 120, confidence: 0, downbeatOffset: 0, beatIntervalMs: 500 };
        this.beatGrid = results.beatGrid || [];
        this.viralSection = results.viralSection || null;

        // Pass to Waveform Timeline Renderer
        this.renderer.setAudioData(this.audioBuffer, results.peaksMipmap);
        this.renderer.setTransients(this.transients);
        this.renderer.setBeats(this.beatGrid);
        this.renderer.setViralSection(this.viralSection);

        // Update DSP Badges
        if (this.dom.bpmDisplay) {
            this.dom.bpmDisplay.textContent = `${this.bpmData.bpm.toFixed(1)} BPM`;
        }
        if (this.dom.bpmConfidence) {
            this.dom.bpmConfidence.textContent = `${Math.round(this.bpmData.confidence * 100)}% confidence`;
        }
        if (this.dom.transientCountDisplay) {
            this.dom.transientCountDisplay.textContent = `${this.transients.length} transients • ${this.beatGrid.length} beats`;
        }

        // If Auto-Beat is enabled, populate markers from grid
        if (this.autoBeatEnabled) {
            this._populateAutoBeatMarkers();
        }
    }

    _populateAutoBeatMarkers() {
        if (!this.beatGrid || this.beatGrid.length === 0) return;
        const beatMarkers = this.beatGrid.map((b, idx) => {
            const startMs = Math.round(b.time * 1000);
            const nextBeatTime = this.beatGrid[idx + 1]?.time || (b.time + (60 / this.bpmData.bpm));
            const endMs = Math.round(nextBeatTime * 1000);
            return {
                id: `beat-${idx}`,
                text: b.isDownbeat ? `BEAT ${Math.floor(idx / 4) + 1}.1` : `beat ${(idx % 4) + 1}`,
                startMs,
                endMs,
                type: b.isDownbeat ? 'hook' : 'beat'
            };
        });

        this.syncManager.markers = beatMarkers;
        this.renderer.setMarkers(beatMarkers);
        this._renderMarkersTable();
        this._updatePrompter();
    }

    _autoLoadSongLyrics(songId) {
        if (lyricsData && lyricsData[songId]) {
            const raw = lyricsData[songId];
            this.syncManager.loadFromMedixlyLyrics(raw);

            const fullText = raw.map(line => line.words.map(w => w.text).join(' ')).join('\n');
            if (this.dom.lyricsInput) {
                this.dom.lyricsInput.value = fullText;
            }

            this.renderer.setMarkers(this.syncManager.markers);
            this._updatePrompter();
            this._renderMarkersTable();
        } else {
            const sampleText = `I found a girl real superstar\nShe's got it all the face card\nAnd I know she's worth any amount\nBaby take my hand`;
            if (this.dom.lyricsInput && !this.dom.lyricsInput.value) {
                this.dom.lyricsInput.value = sampleText;
            }
            this.syncManager.loadText(this.dom.lyricsInput ? this.dom.lyricsInput.value : sampleText, this.syncManager.mode);
            this.renderer.setMarkers([]);
            this._updatePrompter();
            this._renderMarkersTable();
        }
    }

    _ensureAudioContext() {
        this.audioCtx = getGlobalAudioContext();
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    /**
     * Transport Controls
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    async play() {
        this._ensureAudioContext();
        try {
            await this.audioEl.play();
            this.isPlaying = true;
            if (this.dom.playIcon) this.dom.playIcon.style.display = 'none';
            if (this.dom.pauseIcon) this.dom.pauseIcon.style.display = 'inline-block';
            if (this.dom.playPauseBtn) this.dom.playPauseBtn.setAttribute('title', 'Pause (Space)');
        } catch (err) {
            console.warn('Playback error:', err);
        }
    }

    pause() {
        this.audioEl.pause();
        this.isPlaying = false;
        if (this.dom.playIcon) this.dom.playIcon.style.display = 'inline-block';
        if (this.dom.pauseIcon) this.dom.pauseIcon.style.display = 'none';
        if (this.dom.playPauseBtn) this.dom.playPauseBtn.setAttribute('title', 'Play (Space)');
    }

    seek(timeSec) {
        const duration = this.renderer?.duration || this.audioEl.duration || 0;
        const clamped = Math.max(0, Math.min(duration, timeSec));
        this.audioEl.currentTime = clamped;
        this.renderer.setTime(clamped);
        this._updateTimecodeReadout(clamped);
    }

    stepFrames(frameCount) {
        const frameDuration = 1 / (Number(this.fps) || 30);
        this.seek(this.audioEl.currentTime + (frameCount * frameDuration));
    }

    /**
     * Manual marker nudge & toggle (Press 'M')
     * If a marker exists within 80ms of playhead, removes it. Otherwise, drops a new marker.
     */
    dropMarker() {
        const currentMs = Math.round(this.audioEl.currentTime * 1000);
        let stampMs = currentMs;

        if (this.snapToTransients || this.snapToBeats) {
            const candidates = [...this.beatGrid, ...this.transients];
            const snap = snapToNearest(currentMs, candidates, this.snapToleranceMs);
            if (snap.didSnap) {
                stampMs = snap.snappedMs;
            }
        }

        // Check if there is an existing marker near this playhead position (within 80ms)
        const existingIndex = this.syncManager.markers.findIndex(m => Math.abs(m.startMs - stampMs) <= 80);
        if (existingIndex !== -1) {
            // Remove existing marker at playhead
            const removed = this.syncManager.markers[existingIndex];
            this.syncManager.deleteMarker(removed.id);
            this.renderer.selectedMarkerId = null;
            this.renderer.setMarkers(this.syncManager.markers);
            this._renderMarkersTable();
            this._updatePrompter();
            return;
        }

        // Add new marker
        const marker = this.syncManager.dropMarker(stampMs);
        this.renderer.setMarkers(this.syncManager.markers);
        this.renderer.selectedMarkerId = marker.id;

        this._updatePrompter();
        this._renderMarkersTable();
        this._highlightTableRow(marker.id);
        this._triggerMarkerVisualFeedback();
    }

    _triggerMarkerVisualFeedback() {
        if (!this.dom.prompterCurrent) return;
        this.dom.prompterCurrent.classList.remove('pulse-stamp');
        void this.dom.prompterCurrent.offsetWidth;
        this.dom.prompterCurrent.classList.add('pulse-stamp');
    }

    undoMarker() {
        if (this.syncManager.undo()) {
            this.renderer.setMarkers(this.syncManager.markers);
            this._updatePrompter();
            this._renderMarkersTable();
        }
    }

    resetSync() {
        if (confirm('Are you sure you want to reset all synchronized markers?')) {
            this.syncManager.resetSync();
            this.renderer.setMarkers([]);
            this._updatePrompter();
            this._renderMarkersTable();
        }
    }

    quantizeMarkers() {
        if (this.beatGrid.length === 0) {
            alert('Please detect or generate beats first.');
            return;
        }
        const count = this.syncManager.quantizeToBeatGrid(this.beatGrid, 120);
        this.renderer.setMarkers(this.syncManager.markers);
        this._renderMarkersTable();
        alert(`Successfully quantized ${count} markers to the nearest beat grid!`);
    }

    _updatePrompter() {
        const ctx = this.syncManager.getPrompterContext();

        if (this.dom.prompterPrev) {
            this.dom.prompterPrev.textContent = ctx.previous ? ctx.previous.text : '—';
        }
        if (this.dom.prompterCurrent) {
            this.dom.prompterCurrent.textContent = ctx.current ? ctx.current.text : '✓ All Done!';
        }
        if (this.dom.prompterNext) {
            this.dom.prompterNext.textContent = ctx.next ? ctx.next.text : '—';
        }
        if (this.dom.prompterProgress) {
            this.dom.prompterProgress.textContent = `${ctx.progress.synced} / ${ctx.progress.total} (${ctx.progress.percent}%)`;
        }
        if (this.dom.prompterProgressBar) {
            this.dom.prompterProgressBar.style.width = `${ctx.progress.percent}%`;
        }
    }

    _renderMarkersTable() {
        if (!this.dom.markersTableBody) return;
        const markers = this.syncManager.markers;

        if (markers.length === 0) {
            this.dom.markersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-table-msg">No markers placed yet. Hit Play &amp; press <strong>'M'</strong> to sync, or toggle <strong>Auto-Beat</strong>!</td>
                </tr>`;
            return;
        }

        this.dom.markersTableBody.innerHTML = markers.map((m) => {
            const timecode = msToSmpteTimecode(m.startMs, this.fps);
            const durationMs = Math.max(0, m.endMs - m.startMs);
            const isSelected = (m.id === this.renderer.selectedMarkerId);

            return `
                <tr class="marker-row ${isSelected ? 'selected' : ''}" data-marker-id="${m.id}">
                    <td class="col-tc font-mono" title="Click to seek">${timecode}</td>
                    <td class="col-text font-bold">
                        <input type="text" class="inline-text-edit" value="${m.text}" data-id="${m.id}" />
                    </td>
                    <td class="col-dur font-mono">${durationMs}ms</td>
                    <td class="col-type"><span class="badge-${m.type}">${m.type}</span></td>
                    <td class="col-actions">
                        <button class="btn-icon-subtle btn-seek-marker" data-time="${m.startMs / 1000}" title="Seek">▶</button>
                        <button class="btn-icon-subtle btn-delete-marker" data-id="${m.id}" title="Delete">✕</button>
                    </td>
                </tr>`;
        }).join('');

        // Row interaction listeners
        this.dom.markersTableBody.querySelectorAll('.btn-seek-marker').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const t = parseFloat(btn.getAttribute('data-time'));
                this.seek(t);
            });
        });

        this.dom.markersTableBody.querySelectorAll('.btn-delete-marker').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.syncManager.deleteMarker(id);
                this.renderer.setMarkers(this.syncManager.markers);
                this._renderMarkersTable();
            });
        });

        this.dom.markersTableBody.querySelectorAll('.inline-text-edit').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = input.getAttribute('data-id');
                this.syncManager.updateMarker(id, { text: e.target.value });
                this.renderer.setMarkers(this.syncManager.markers);
            });
        });

        this.dom.markersTableBody.querySelectorAll('.marker-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                const id = row.getAttribute('data-marker-id');
                const m = markers.find(item => item.id === id);
                if (m) {
                    this.seek(m.startMs / 1000);
                    this.renderer.selectedMarkerId = m.id;
                    this._highlightTableRow(m.id);
                    this.renderer.render();
                }
            });
        });
    }

    _highlightTableRow(markerId) {
        if (!this.dom.markersTableBody) return;
        this.dom.markersTableBody.querySelectorAll('.marker-row').forEach(r => {
            if (r.getAttribute('data-marker-id') === markerId) {
                r.classList.add('selected');
                r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                r.classList.remove('selected');
            }
        });
    }

    _startPlaybackLoop() {
        const loop = () => {
            if (this.isPlaying && this.audioEl) {
                const t = this.audioEl.currentTime;

                // Enforce Out-point looping if set
                if (this.outPoint !== null && t >= this.outPoint) {
                    const restartTime = (this.inPoint !== null) ? this.inPoint : 0;
                    this.seek(restartTime);
                } else {
                    this.renderer.setTime(t);
                    this._updateTimecodeReadout(t);
                    this._checkMetronomeClick(t);
                }
            }
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    _updateTimecodeReadout(timeSec) {
        const ms = timeSec * 1000;
        const totalMs = Math.max(0, Math.round(ms));
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const remMs = totalMs % 1000;
        const msStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(remMs).padStart(3, '0')}`;
        const smpteStr = msToSmpteTimecode(ms, this.fps);

        if (this.dom.timecodeDisplay) {
            this.dom.timecodeDisplay.textContent = `${msStr} (${smpteStr})`;
        }
        if (this.dom.frameDisplay) {
            this.dom.frameDisplay.textContent = `Frame ${msToFrames(ms, this.fps)} @ ${this.fps}fps`;
        }
    }

    _checkMetronomeClick(timeSec) {
        if (!this.metronomeEnabled || this.beatGrid.length === 0) return;
        const currentBeatIndex = this.beatGrid.findIndex(b => Math.abs(b.time - timeSec) < 0.03);
        if (currentBeatIndex !== -1 && currentBeatIndex !== this.lastMetronomeBeat) {
            this.lastMetronomeBeat = currentBeatIndex;
            const isDownbeat = this.beatGrid[currentBeatIndex].isDownbeat;
            this._playClick(isDownbeat ? 1200 : 800);
        }
    }

    _playClick(freq = 1000) {
        try {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.045);
        } catch (_) {}
    }

    _attachEventListeners() {
        // Transport buttons
        this.dom.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        this.dom.rewindBtn?.addEventListener('click', () => {
            const start = this.inPoint !== null ? this.inPoint : 0;
            this.seek(start);
        });
        this.dom.stepBackBtn?.addEventListener('click', () => this.stepFrames(-1));
        this.dom.stepForwardBtn?.addEventListener('click', () => this.stepFrames(1));

        // Metronome
        this.dom.metronomeBtn?.addEventListener('click', () => {
            this.metronomeEnabled = !this.metronomeEnabled;
            this.dom.metronomeBtn.classList.toggle('active', this.metronomeEnabled);
        });

        // Auto-Beat toggle
        this.dom.autobeatToggle?.addEventListener('change', (e) => {
            this.autoBeatEnabled = e.target.checked;
            if (this.autoBeatEnabled) {
                this._populateAutoBeatMarkers();
            } else if (this.currentSong) {
                this._autoLoadSongLyrics(this.currentSong.id);
            }
        });

        // In / Out point buttons
        this.dom.markInBtn?.addEventListener('click', () => {
            this.inPoint = this.audioEl.currentTime;
            this.renderer.setInOutPoints(this.inPoint, this.outPoint);
        });

        this.dom.markOutBtn?.addEventListener('click', () => {
            this.outPoint = this.audioEl.currentTime;
            this.renderer.setInOutPoints(this.inPoint, this.outPoint);
        });

        this.dom.clearInOutBtn?.addEventListener('click', () => {
            this.inPoint = null;
            this.outPoint = null;
            this.renderer.setInOutPoints(null, null);
        });

        // Zoom Controls
        this.dom.zoomSlider?.addEventListener('input', (e) => {
            this.renderer.setZoom(parseFloat(e.target.value));
        });
        this.dom.zoomInBtn?.addEventListener('click', () => {
            this.renderer.setZoom(this.renderer.zoom * 1.3);
            if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
        });
        this.dom.zoomOutBtn?.addEventListener('click', () => {
            this.renderer.setZoom(this.renderer.zoom / 1.3);
            if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
        });
        this.dom.zoomFitBtn?.addEventListener('click', () => {
            this.renderer.fitToScreen();
            if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
        });

        // FPS Select
        this.dom.fpsSelect?.addEventListener('change', (e) => {
            this.fps = parseFloat(e.target.value) || 30;
            this._updateTimecodeReadout(this.audioEl.currentTime);
            this._renderMarkersTable();
        });

        // Snap toggle
        this.dom.snapToggle?.addEventListener('change', (e) => {
            this.snapToTransients = e.target.checked;
            this.snapToBeats = e.target.checked;
        });

        // Custom File Upload
        this.dom.uploadBtn?.addEventListener('click', () => this.dom.fileInput?.click());
        this.dom.fileInput?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const customSong = {
                    id: `custom-${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: 'Imported Master',
                    duration: 'Custom'
                };
                await this.loadTrack(customSong, file);
            }
        });

        // Lyrics Management
        this.dom.syncModeSelect?.addEventListener('change', (e) => {
            const mode = e.target.value;
            this.syncManager.mode = mode;
            if (this.dom.lyricsInput?.value) {
                this.syncManager.loadText(this.dom.lyricsInput.value, mode);
                this._updatePrompter();
            }
        });

        this.dom.parseLyricsBtn?.addEventListener('click', () => {
            const text = this.dom.lyricsInput?.value || '';
            this.syncManager.loadText(text, this.syncManager.mode);
            this.renderer.setMarkers([]);
            this._updatePrompter();
            this._renderMarkersTable();
        });

        this.dom.loadLyricsBtn?.addEventListener('click', () => {
            if (this.currentSong) {
                this._autoLoadSongLyrics(this.currentSong.id);
            }
        });

        // Marker Sync Actions
        this.dom.dropMarkerBtn?.addEventListener('click', () => this.dropMarker());
        this.dom.undoMarkerBtn?.addEventListener('click', () => this.undoMarker());
        this.dom.resetSyncBtn?.addEventListener('click', () => this.resetSync());
        this.dom.quantizeBtn?.addEventListener('click', () => this.quantizeMarkers());

        // Sensitivity Slider
        this.dom.sensitivitySlider?.addEventListener('input', (e) => {
            this.transientSensitivity = parseFloat(e.target.value);
            if (this.dom.sensitivityValue) {
                this.dom.sensitivityValue.textContent = `${Math.round(this.transientSensitivity * 100)}%`;
            }
        });

        this.dom.sensitivitySlider?.addEventListener('change', async () => {
            if (this.audioBuffer) {
                const viralMeta = this._extractViralMetadata(this.currentSong);
                await this._analyzeAudioBuffer(this.audioBuffer, viralMeta);
            }
        });

        // Tap Tempo
        let tapTimes = [];
        this.dom.tapTempoBtn?.addEventListener('click', () => {
            const now = performance.now();
            tapTimes.push(now);
            if (tapTimes.length > 5) tapTimes.shift();

            if (tapTimes.length >= 2) {
                const diffs = [];
                for (let i = 1; i < tapTimes.length; i++) {
                    diffs.push(tapTimes[i] - tapTimes[i - 1]);
                }
                const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
                const bpm = Math.round(60000 / avgDiff);
                this.bpmData.bpm = bpm;
                this.beatGrid = generateBeatGrid(this.renderer.duration, bpm, this.audioEl.currentTime % (60 / bpm));
                this.renderer.setBeats(this.beatGrid);
                if (this.dom.bpmDisplay) this.dom.bpmDisplay.textContent = `${bpm} BPM (Tapped)`;
                if (this.autoBeatEnabled) this._populateAutoBeatMarkers();
            }
        });

        // Export Modal & Tabs
        this.dom.exportBtn?.addEventListener('click', () => this.openExportModal());
        this.dom.closeExportBtn?.addEventListener('click', () => this.closeExportModal());
        this.dom.exportModal?.addEventListener('click', (e) => {
            if (e.target === this.dom.exportModal) this.closeExportModal();
        });

        this.dom.exportTabs?.forEach(tab => {
            tab.addEventListener('click', () => {
                this.dom.exportTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const format = tab.getAttribute('data-format');
                this._renderExportContent(format);
            });
        });

        // Dual Export Scope Switcher
        this.dom.scopeFullSongBtn?.addEventListener('click', () => {
            this.exportScope = 'full';
            this.dom.scopeFullSongBtn?.classList.add('active');
            this.dom.scopeViralBtn?.classList.remove('active');
            if (this.dom.viralScopeCallout) this.dom.viralScopeCallout.style.display = 'none';
            const activeTab = document.querySelector('.export-tab-btn.active');
            this._renderExportContent(activeTab ? activeTab.getAttribute('data-format') : 'srt');
        });

        this.dom.scopeViralBtn?.addEventListener('click', () => {
            this.exportScope = 'viral';
            this.dom.scopeViralBtn?.classList.add('active');
            this.dom.scopeFullSongBtn?.classList.remove('active');
            if (this.dom.viralScopeCallout) this.dom.viralScopeCallout.style.display = 'flex';
            const activeTab = document.querySelector('.export-tab-btn.active');
            this._renderExportContent(activeTab ? activeTab.getAttribute('data-format') : 'srt');
        });
    }

    _attachKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Ignore keystrokes when focused in text inputs
            const activeTag = document.activeElement?.tagName;
            if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
                if (e.key === 'Escape') {
                    document.activeElement.blur();
                }
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    this.dropMarker();
                    break;
                case 'KeyI':
                    e.preventDefault();
                    this.inPoint = this.audioEl.currentTime;
                    this.renderer.setInOutPoints(this.inPoint, this.outPoint);
                    break;
                case 'KeyO':
                    e.preventDefault();
                    this.outPoint = this.audioEl.currentTime;
                    this.renderer.setInOutPoints(this.inPoint, this.outPoint);
                    break;
                case 'KeyJ':
                    e.preventDefault();
                    this.playbackRate = Math.max(0.5, this.playbackRate - 0.25);
                    this.audioEl.playbackRate = this.playbackRate;
                    break;
                case 'KeyK':
                    e.preventDefault();
                    this.pause();
                    this.playbackRate = 1.0;
                    this.audioEl.playbackRate = 1.0;
                    break;
                case 'KeyL':
                    e.preventDefault();
                    if (!this.isPlaying) this.play();
                    this.playbackRate = Math.min(2.0, this.playbackRate + 0.25);
                    this.audioEl.playbackRate = this.playbackRate;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.seek(this.audioEl.currentTime - 1.0);
                    } else if (e.altKey) {
                        this.seek(this.audioEl.currentTime - 0.01);
                    } else {
                        this.stepFrames(-1);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.seek(this.audioEl.currentTime + 1.0);
                    } else if (e.altKey) {
                        this.seek(this.audioEl.currentTime + 0.01);
                    } else {
                        this.stepFrames(1);
                    }
                    break;
                case 'BracketLeft':
                    e.preventDefault();
                    this.renderer.setZoom(this.renderer.zoom / 1.3);
                    if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
                    break;
                case 'BracketRight':
                    e.preventDefault();
                    this.renderer.setZoom(this.renderer.zoom * 1.3);
                    if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
                    break;
                case 'KeyZ':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        this.undoMarker();
                    } else if (e.shiftKey) {
                        e.preventDefault();
                        this.renderer.fitToScreen();
                        if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
                    }
                    break;
                case 'KeyS':
                    e.preventDefault();
                    this.snapToTransients = !this.snapToTransients;
                    this.snapToBeats = this.snapToTransients;
                    if (this.dom.snapToggle) this.dom.snapToggle.checked = this.snapToTransients;
                    break;
                case 'KeyX':
                    if (e.altKey) {
                        e.preventDefault();
                        this.inPoint = null;
                        this.outPoint = null;
                        this.renderer.setInOutPoints(null, null);
                    }
                    break;
                case 'Delete':
                case 'Backspace':
                    if (this.renderer.selectedMarkerId) {
                        e.preventDefault();
                        this.syncManager.deleteMarker(this.renderer.selectedMarkerId);
                        this.renderer.selectedMarkerId = null;
                        this.renderer.setMarkers(this.syncManager.markers);
                        this._renderMarkersTable();
                    }
                    break;
            }
        });
    }

    /**
     * Export Pipeline UI Handlers
     */
    openExportModal() {
        if (!this.dom.exportModal) return;
        this.dom.exportModal.classList.remove('hidden');

        // Configure active scope
        if (this.dom.viralStartBadge && this.viralSection) {
            this.dom.viralStartBadge.textContent = msToSrtTimecode(this.viralSection.start * 1000);
        }

        const activeTab = document.querySelector('.export-tab-btn.active');
        const format = activeTab ? activeTab.getAttribute('data-format') : 'srt';
        this._renderExportContent(format);
    }

    closeExportModal() {
        if (!this.dom.exportModal) return;
        this.dom.exportModal.classList.add('hidden');
    }

    _renderExportContent(format) {
        let markersToExport = this.syncManager.markers;
        const isViralScope = (this.exportScope === 'viral');

        if (isViralScope && this.viralSection) {
            const startMs = Math.round(this.viralSection.start * 1000);
            const endMs = Math.round(this.viralSection.end * 1000);
            markersToExport = offsetMarkers(markersToExport, startMs, endMs);
        }

        let content = '';
        let filename = `${this.currentSong?.title || 'medixly'}`;
        if (isViralScope) filename += '-ViralHook';
        let mime = 'text/plain';

        switch (format) {
            case 'srt':
                content = exportToSRT(markersToExport, { mode: 'line' });
                filename += '-markers.srt';
                mime = 'application/x-subrip';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `SubRip Subtitles (.srt)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'srt-words':
                content = exportToSRT(markersToExport, { mode: 'word' });
                filename += '-karaoke.srt';
                mime = 'application/x-subrip';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `Word-by-Word Subtitles (.srt)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'premiere-csv':
                content = exportToPremiereCSV(markersToExport, { fps: this.fps });
                filename += '-premiere.csv';
                mime = 'text/csv';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `Premiere Pro Marker CSV (@ ${this.fps} fps)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'premiere-xml':
                content = exportToPremiereXML(markersToExport, { fps: this.fps, sequenceName: `${this.currentSong?.title || 'Lyrics'}${isViralScope ? ' (Viral)' : ''}` });
                filename += '-fcp-premiere.xml';
                mime = 'application/xml';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `Final Cut Pro / Premiere XML (@ ${this.fps} fps)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'resolve-csv':
                content = exportToDaVinciResolveCSV(markersToExport, { fps: this.fps });
                filename += '-resolve.csv';
                mime = 'text/csv';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `DaVinci Resolve Marker CSV (@ ${this.fps} fps)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'resolve-edl':
                content = exportToDaVinciResolveEDL(markersToExport, { fps: this.fps });
                filename += '-resolve.edl';
                mime = 'text/plain';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `DaVinci Resolve / CMX 3600 EDL (@ ${this.fps} fps)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'after-effects':
                const ae = exportToAfterEffects(markersToExport, { fps: this.fps });
                content = ae.script;
                filename += '-ae-importer.jsx';
                mime = 'application/javascript';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `After Effects ExtendScript / JSON (@ ${this.fps} fps)${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
            case 'medixly-json':
                const nativeJson = exportToMedixlyJSON(markersToExport);
                content = JSON.stringify(nativeJson, null, 2);
                filename += '-medixly.json';
                mime = 'application/json';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `Medixly Native Lyrics JSON${isViralScope ? ' [Viral Section Only]' : ''}`;
                break;
        }

        if (this.dom.exportPreview) {
            this.dom.exportPreview.value = content;
        }

        // Configure Download Markers button
        if (this.dom.downloadExportBtn) {
            this.dom.downloadExportBtn.onclick = () => {
                downloadFile(content, filename, mime);
            };
        }

        // Configure Download Audio button
        if (this.dom.downloadAudioBtn) {
            const audioLabel = isViralScope ? '🎧 Download Sliced Audio (.wav)' : '🎧 Download Full Audio (.wav)';
            this.dom.downloadAudioBtn.innerHTML = `<span>${audioLabel}</span>`;
            this.dom.downloadAudioBtn.onclick = () => {
                if (!this.audioBuffer) {
                    alert('Audio buffer is still loading or unavailable.');
                    return;
                }
                const startSec = (isViralScope && this.viralSection) ? this.viralSection.start : 0;
                const endSec = (isViralScope && this.viralSection) ? this.viralSection.end : this.audioBuffer.duration;
                const wavBlob = audioBufferToWavBlob(this.audioBuffer, startSec, endSec);
                const audioFilename = `${this.currentSong?.title || 'track'}${isViralScope ? '-ViralHook' : '-Full'}.wav`;
                downloadFile(wavBlob, audioFilename, 'audio/wav');
            };
        }

        // Configure Copy button
        if (this.dom.copyExportBtn) {
            this.dom.copyExportBtn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(content);
                    const originalText = this.dom.copyExportBtn.textContent;
                    this.dom.copyExportBtn.textContent = '✓ Copied!';
                    setTimeout(() => {
                        this.dom.copyExportBtn.textContent = originalText;
                    }, 1500);
                } catch (err) {
                    alert('Clipboard access denied, please copy directly from the preview text.');
                }
            };
        }
    }
}
