/**
 * js/medixly-editors.js
 * Master controller for Medixly "For Editors" Workspace.
 * Integrates Web Audio DSP, interactive timeline canvas, beat-by-beat lyric engine, and pro NLE export pipeline.
 */

import { detectTransients, estimateBPM, generateBeatGrid, snapToNearest } from './editor-audio-analyzer.js';
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
    downloadFile
} from './editor-export-pipeline.js';
import { WaveformTimelineRenderer } from './editor-waveform-renderer.js';
import { librarySongs } from './song-data.js';
import { lyricsData } from './lyrics-data.js';

export class MedixlyEditorWorkspace {
    constructor() {
        // Audio Context & Graph
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

        // Timeline Settings
        this.fps = 30;
        this.snapToTransients = true;
        this.snapToBeats = true;
        this.snapToleranceMs = 50;

        // Active track data
        this.currentSong = null;

        // UI Components
        this.renderer = null;
        this.canvas = null;

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
        this._initCanvas();
        this._initTrackSelector();
        this._attachEventListeners();
        this._attachKeyboardShortcuts();
        this._startPlaybackLoop();

        // Load initial track (either URL param song or first in library)
        const params = new URLSearchParams(window.location.search);
        const songId = params.get('song') || 'dead-fresh';
        const targetSong = librarySongs.find(s => s.id === songId) || librarySongs[0];

        if (targetSong) {
            await this.loadTrack(targetSong);
        }
    }

    _cacheDom() {
        this.dom = {
            canvas: document.getElementById('timeline-canvas'),
            canvasContainer: document.getElementById('canvas-container'),
            timecodeDisplay: document.getElementById('timecode-display'),
            frameDisplay: document.getElementById('frame-display'),
            trackSelect: document.getElementById('track-select'),
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
            markersTableBody: document.getElementById('markers-table-body'),
            exportBtn: document.getElementById('btn-export'),
            exportModal: document.getElementById('export-modal'),
            closeExportBtn: document.getElementById('btn-close-export'),
            exportPreview: document.getElementById('export-preview'),
            downloadExportBtn: document.getElementById('btn-download-export'),
            copyExportBtn: document.getElementById('btn-copy-export'),
            exportTabs: document.querySelectorAll('.export-tab-btn'),
            exportFormatBadge: document.getElementById('export-format-badge')
        };
    }

    _initCanvas() {
        if (!this.dom.canvas) return;
        this.renderer = new WaveformTimelineRenderer(this.dom.canvas);
        this.canvas = this.dom.canvas;

        // Timeline Scrubbing & Marker Dragging Events
        let isMouseDown = false;
        let dragTargetMarker = null;

        const onPointerDown = (e) => {
            if (e.button !== 0) return; // Only left click
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
        };

        const onPointerMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (dragTargetMarker) {
                // Dragging marker to reposition startMs
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
                this._renderMarkersTable();
            } else if (isMouseDown) {
                this._seekToCanvasX(x);
            } else {
                // Update hover state
                const hoverMarker = this.renderer.getMarkerAtCoordinates(x, y);
                this.renderer.hoveredMarkerId = hoverMarker ? hoverMarker.id : null;
                this.renderer.render();
            }
        };

        const onPointerUp = () => {
            isMouseDown = false;
            dragTargetMarker = null;
        };

        this.canvas.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        // Smooth Wheel Zoom centered on cursor
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY < 0 ? 1.15 : 0.85;
            this.renderer.setZoom(this.renderer.zoom * zoomDelta, e.clientX);
            if (this.dom.zoomSlider) {
                this.dom.zoomSlider.value = this.renderer.zoom;
            }
        }, { passive: false });
    }

    _seekToCanvasX(x) {
        const timeSec = this.renderer.xToTime(x);
        this.seek(timeSec);
    }

    _initTrackSelector() {
        if (!this.dom.trackSelect) return;
        this.dom.trackSelect.innerHTML = librarySongs.map(s => `
            <option value="${s.id}">${s.title} — ${s.artist} (${s.duration || 'Track'})</option>
        `).join('');

        this.dom.trackSelect.addEventListener('change', async (e) => {
            const selected = librarySongs.find(s => s.id === e.target.value);
            if (selected) {
                await this.loadTrack(selected);
            }
        });
    }

    /**
     * Loads a track by audio URL or metadata, decodes its PCM waveform, and detects transients/BPM.
     * @param {object} song - Song metadata object
     * @param {File} [customFile] - Optional local file
     */
    async loadTrack(song, customFile = null) {
        this.pause();
        this.currentSong = song;

        // Update UI status
        if (this.dom.bpmDisplay) this.dom.bpmDisplay.textContent = 'Analyzing...';
        if (this.dom.transientCountDisplay) this.dom.transientCountDisplay.textContent = 'Analyzing audio waveform...';

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

            // Decode Audio Data for DSP Analysis
            this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

            // 1. Pass PCM to Waveform Renderer
            this.renderer.setAudioData(this.audioBuffer);

            // 2. Run DSP Transient Analysis
            this._runTransientAnalysis();

            // 3. Load associated lyrics if available
            this._autoLoadSongLyrics(song.id);

            // 4. Update Timecode
            this.seek(0);
        } catch (err) {
            console.error('Error loading audio track:', err);
            if (this.dom.transientCountDisplay) {
                this.dom.transientCountDisplay.textContent = `Note: Previewing via audio stream (${err.message})`;
            }
        }
    }

    _runTransientAnalysis() {
        if (!this.audioBuffer) return;
        const sensitivity = this.dom.sensitivitySlider ? parseFloat(this.dom.sensitivitySlider.value) : 0.6;

        // Detect Transients
        this.transients = detectTransients(this.audioBuffer, {
            sensitivity,
            minSpacingMs: 50
        });
        this.renderer.setTransients(this.transients);

        // Estimate BPM & Beat Grid
        this.bpmData = estimateBPM(this.transients);
        this.beatGrid = generateBeatGrid(this.audioBuffer.duration, this.bpmData.bpm, this.bpmData.downbeatOffset);
        this.renderer.setBeats(this.beatGrid);

        // Update UI Badges
        if (this.dom.bpmDisplay) {
            this.dom.bpmDisplay.textContent = `${this.bpmData.bpm.toFixed(1)} BPM`;
        }
        if (this.dom.bpmConfidence) {
            this.dom.bpmConfidence.textContent = `${Math.round(this.bpmData.confidence * 100)}% confidence`;
        }
        if (this.dom.transientCountDisplay) {
            this.dom.transientCountDisplay.textContent = `${this.transients.length} transients detected (${this.beatGrid.length} beats)`;
        }
    }

    _autoLoadSongLyrics(songId) {
        if (lyricsData && lyricsData[songId]) {
            const raw = lyricsData[songId];
            this.syncManager.loadFromMedixlyLyrics(raw);

            // Also populate the textarea with the extracted text
            const fullText = raw.map(line => line.words.map(w => w.text).join(' ')).join('\n');
            if (this.dom.lyricsInput) {
                this.dom.lyricsInput.value = fullText;
            }

            this.renderer.setMarkers(this.syncManager.markers);
            this._updatePrompter();
            this._renderMarkersTable();
        } else {
            // Default sample lyrics if none exist
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
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext({ latencyHint: 'interactive' });
        }
        if (this.audioCtx.state === 'suspended') {
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
        const clamped = Math.max(0, Math.min(this.renderer.duration || this.audioEl.duration || 0, timeSec));
        this.audioEl.currentTime = clamped;
        this.renderer.setTime(clamped);
        this._updateTimecodeReadout(clamped);
    }

    stepFrames(frameCount) {
        const frameDuration = 1 / (Number(this.fps) || 30);
        this.seek(this.audioEl.currentTime + (frameCount * frameDuration));
    }

    /**
     * Drops a sync marker at the current playhead position down to the millisecond.
     * Snaps to nearest beat or transient if enabled.
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
        void this.dom.prompterCurrent.offsetWidth; // trigger reflow
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
                    <td colspan="5" class="empty-table-msg">No markers dropped yet. Hit Play &amp; press <strong>'M'</strong> to sync lyrics!</td>
                </tr>`;
            return;
        }

        this.dom.markersTableBody.innerHTML = markers.map((m, idx) => {
            const timecode = msToSmpteTimecode(m.startMs, this.fps);
            const durationMs = m.endMs - m.startMs;
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

        // Attach table row actions
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
                this.renderer.setTime(t);
                this._updateTimecodeReadout(t);
                this._checkMetronomeClick(t);
            }
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    _updateTimecodeReadout(timeSec) {
        const ms = timeSec * 1000;
        if (this.dom.timecodeDisplay) {
            this.dom.timecodeDisplay.textContent = msToSmpteTimecode(ms, this.fps);
        }
        if (this.dom.frameDisplay) {
            this.dom.frameDisplay.textContent = `Frame ${msToFrames(ms, this.fps)}`;
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
        this.dom.rewindBtn?.addEventListener('click', () => this.seek(0));
        this.dom.stepBackBtn?.addEventListener('click', () => this.stepFrames(-1));
        this.dom.stepForwardBtn?.addEventListener('click', () => this.stepFrames(1));

        // Metronome
        this.dom.metronomeBtn?.addEventListener('click', () => {
            this.metronomeEnabled = !this.metronomeEnabled;
            this.dom.metronomeBtn.classList.toggle('active', this.metronomeEnabled);
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
                    artist: 'Custom Audio',
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
        this.dom.sensitivitySlider?.addEventListener('change', () => {
            this._runTransientAnalysis();
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
            }
        });

        // Export Modal & Tabs
        this.dom.exportBtn?.addEventListener('click', () => this.openExportModal());
        this.dom.closeExportBtn?.addEventListener('click', () => this.closeExportModal());
        this.dom.exportModal?.addEventListener('click', (e) => {
            if (e.target === this.dom.exportModal) this.closeExportModal();
        });

        this.dom.exportTabs?.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.dom.exportTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const format = tab.getAttribute('data-format');
                this._renderExportContent(format);
            });
        });
    }

    _attachKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Ignore keystrokes when focused in text inputs (except Escape)
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
                case 'KeyJ':
                    // Reverse / Slow shuttle
                    e.preventDefault();
                    this.playbackRate = Math.max(0.5, this.playbackRate - 0.25);
                    this.audioEl.playbackRate = this.playbackRate;
                    break;
                case 'KeyK':
                    // Pause shuttle
                    e.preventDefault();
                    this.pause();
                    this.playbackRate = 1.0;
                    this.audioEl.playbackRate = 1.0;
                    break;
                case 'KeyL':
                    // Forward shuttle
                    e.preventDefault();
                    if (!this.isPlaying) this.play();
                    this.playbackRate = Math.min(2.0, this.playbackRate + 0.25);
                    this.audioEl.playbackRate = this.playbackRate;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.seek(this.audioEl.currentTime - 1.0); // 1 sec
                    } else if (e.altKey) {
                        this.seek(this.audioEl.currentTime - 0.01); // 10ms
                    } else {
                        this.stepFrames(-1); // 1 frame
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
                    // Zoom Out
                    e.preventDefault();
                    this.renderer.setZoom(this.renderer.zoom / 1.3);
                    if (this.dom.zoomSlider) this.dom.zoomSlider.value = this.renderer.zoom;
                    break;
                case 'BracketRight':
                    // Zoom In
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
        // Render first active tab format
        const activeTab = document.querySelector('.export-tab-btn.active');
        const format = activeTab ? activeTab.getAttribute('data-format') : 'srt';
        this._renderExportContent(format);
    }

    closeExportModal() {
        if (!this.dom.exportModal) return;
        this.dom.exportModal.classList.add('hidden');
    }

    _renderExportContent(format) {
        const markers = this.syncManager.markers;
        let content = '';
        let filename = `${this.currentSong?.title || 'medixly'}-markers`;
        let mime = 'text/plain';

        switch (format) {
            case 'srt':
                content = exportToSRT(markers, { mode: 'line' });
                filename += '.srt';
                mime = 'application/x-subrip';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = 'SubRip Subtitles (.srt)';
                break;
            case 'srt-words':
                content = exportToSRT(markers, { mode: 'word' });
                filename += '-karaoke.srt';
                mime = 'application/x-subrip';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = 'Word-by-Word Subtitles (.srt)';
                break;
            case 'premiere-csv':
                content = exportToPremiereCSV(markers, { fps: this.fps });
                filename += '-premiere.csv';
                mime = 'text/csv';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `Premiere Pro Marker CSV (@ ${this.fps} fps)`;
                break;
            case 'premiere-xml':
                content = exportToPremiereXML(markers, { fps: this.fps, sequenceName: this.currentSong?.title || 'Lyrics' });
                filename += '-fcp-premiere.xml';
                mime = 'application/xml';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `Final Cut Pro / Premiere XML (@ ${this.fps} fps)`;
                break;
            case 'resolve-csv':
                content = exportToDaVinciResolveCSV(markers, { fps: this.fps });
                filename += '-resolve.csv';
                mime = 'text/csv';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `DaVinci Resolve Marker CSV (@ ${this.fps} fps)`;
                break;
            case 'resolve-edl':
                content = exportToDaVinciResolveEDL(markers, { fps: this.fps });
                filename += '-resolve.edl';
                mime = 'text/plain';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `DaVinci Resolve / CMX 3600 EDL (@ ${this.fps} fps)`;
                break;
            case 'after-effects':
                const ae = exportToAfterEffects(markers, { fps: this.fps });
                content = ae.script;
                filename += '-ae-importer.jsx';
                mime = 'application/javascript';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = `After Effects ExtendScript / JSON (@ ${this.fps} fps)`;
                break;
            case 'medixly-json':
                const nativeJson = exportToMedixlyJSON(markers);
                content = JSON.stringify(nativeJson, null, 2);
                filename += '-medixly.json';
                mime = 'application/json';
                if (this.dom.exportFormatBadge) this.dom.exportFormatBadge.textContent = 'Medixly Native Lyrics JSON';
                break;
        }

        if (this.dom.exportPreview) {
            this.dom.exportPreview.value = content;
        }

        // Configure Download button
        if (this.dom.downloadExportBtn) {
            this.dom.downloadExportBtn.onclick = () => {
                downloadFile(content, filename, mime);
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
                    alert('Clipboard access denied, please select and copy from the box.');
                }
            };
        }
    }
}
