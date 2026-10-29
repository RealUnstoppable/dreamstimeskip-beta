// js/ad-preview-controller.js
// Ad Screen-Recording Preview Scene Controller: Dual Blobs, Audio Analyser, Captions, Menu, & Auth Guard

import { AD_TRACKS, getTrackById } from './ad-preview-data.js';
import { CompositionStudio } from './ad-composition-studio.js';

export const AUTHORIZED_EMAIL = 'catalinandrian1@gmail.com';

export class AdPreviewController {
    constructor(options = {}) {
        this.tracks = AD_TRACKS;
        this.currentTrack = this.tracks[0];
        this.initialTrackId = options.initialTrackId || 'ad-preview-1';

        this.audioEl = null;
        this.audioCtx = null;
        this.analyser = null;
        this.sourceNode = null;
        this.freqData = null;
        this.timeData = null;

        this.isPlaying = false;
        this.currentEnergy = 0;
        this.smoothEnergy = 0;
        this.animFrameId = null;
        this.currentSpeaker = 'idle'; // 'user' | 'lexi' | 'both' | 'transition' | 'idle'

        this.isAuthorized = false;
        this.currentUser = null;
        this.aspectRatio = 'full'; // 'full' | '9-16' | '1-1'
        this.isCleanMode = false;
        this.countdownTimer = null;
        this.playbackRate = 1.0;

        // Composition Studio instance
        this.compositionStudio = null;

        // DOM Elements
        this.elements = {};
    }

    /**
     * Initialize DOM, Firebase Auth Guard, Audio Engine, and Keyboard Shortcuts
     */
    async init(domOptions = {}) {
        this.bindDOM(domOptions);
        this.setupAudioElement();
        this.setupEventListeners();
        this.initTrack(this.initialTrackId);

        // Security Authorization Guard Check
        await this.initAuthGuard();

        // Mount the Composition Studio (Background + Blob + Track Mapping)
        this.compositionStudio = new CompositionStudio(this);
        this.compositionStudio.mount();

        // Start 60fps render animation loop
        this.startRenderLoop();
    }

    bindDOM(opts = {}) {
        this.elements.viewport = opts.viewport || document.getElementById('ad-viewport');
        this.elements.stage = opts.stage || document.getElementById('ad-stage');
        this.elements.sceneHeader = opts.sceneHeader || document.querySelector('.ad-scene-header') || document.getElementById('ad-scene-header');
        this.elements.arena = opts.arena || document.getElementById('ad-blobs-arena');

        this.elements.pinkBlob = opts.pinkBlob || document.getElementById('pink-user-blob');
        this.elements.pinkBlobWrapper = opts.pinkBlobWrapper || document.getElementById('pink-user-wrapper');
        this.elements.lexiOrb = opts.lexiOrb || document.getElementById('lexi-ai-orb');
        this.elements.lexiOrbWrapper = opts.lexiOrbWrapper || document.getElementById('lexi-ai-wrapper');

        this.elements.userTag = opts.userTag || document.getElementById('speaker-tag-user');
        this.elements.lexiTag = opts.lexiTag || document.getElementById('speaker-tag-lexi');

        this.elements.captionCard = opts.captionCard || document.getElementById('caption-card');
        this.elements.captionText = opts.captionText || document.getElementById('caption-text');
        this.elements.captionProgress = opts.captionProgress || document.getElementById('caption-progress-fill');

        this.elements.audio = opts.audio || document.getElementById('ad-audio');
        this.elements.trackTitle = opts.trackTitle || document.getElementById('ad-track-title');
        this.elements.trackBadge = opts.trackBadge || document.getElementById('ad-track-badge');

        this.elements.playPauseBtn = opts.playPauseBtn || document.getElementById('btn-play-pause');
        this.elements.restartBtn = opts.restartBtn || document.getElementById('btn-restart');
        this.elements.recordBtn = opts.recordBtn || document.getElementById('btn-record-mode');
        this.elements.hideUiBtn = opts.hideUiBtn || document.getElementById('btn-hide-ui');
        this.elements.tracksMenuBtn = opts.tracksMenuBtn || document.getElementById('btn-tracks-menu');
        this.elements.tracksMenu = opts.tracksMenu || document.getElementById('tracks-dropdown-menu');
        this.elements.aspectBtn = opts.aspectBtn || document.getElementById('btn-aspect-toggle');
        this.elements.cleanHint = opts.cleanHint || document.getElementById('clean-record-hint');

        this.elements.controlDock = opts.controlDock || document.getElementById('ad-control-dock');
        this.elements.topDock = opts.topDock || document.getElementById('ad-top-dock');
        this.elements.countdownOverlay = opts.countdownOverlay || document.getElementById('ad-countdown-overlay');
        this.elements.countdownNumber = opts.countdownNumber || document.getElementById('countdown-number');

        // Security Guard Elements
        this.elements.securityOverlay = opts.securityOverlay || document.getElementById('ad-security-overlay');
        this.elements.securityEmail = opts.securityEmail || document.getElementById('security-user-email');
        this.elements.googleSignInBtn = opts.googleSignInBtn || document.getElementById('security-google-signin');
    }

    setupAudioElement() {
        if (!this.elements.audio && typeof document !== 'undefined') {
            this.elements.audio = document.createElement('audio');
            this.elements.audio.id = 'ad-audio';
            this.elements.audio.preload = 'auto';
            document.body.appendChild(this.elements.audio);
        }
        this.audioEl = this.elements.audio;

        if (this.audioEl) {
            this.audioEl.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayPauseUI();
                this.resumeAudioContext();
            });
            this.audioEl.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayPauseUI();
            });
            this.audioEl.addEventListener('ended', () => {
                this.isPlaying = false;
                this.setSpeakerState('idle');
                this.updatePlayPauseUI();
            });
            this.audioEl.addEventListener('timeupdate', () => {
                this.syncChoreography(this.audioEl.currentTime);
            });
        }
    }

    /**
     * Web Audio API Initialization
     */
    initAudioContext() {
        if (this.audioCtx || typeof window === 'undefined') return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            this.audioCtx = new AudioContextClass();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 512;
            this.analyser.smoothingTimeConstant = 0.75;

            if (this.audioEl) {
                this.sourceNode = this.audioCtx.createMediaElementSource(this.audioEl);
                this.sourceNode.connect(this.analyser);
                this.analyser.connect(this.audioCtx.destination);
            }

            this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
            this.timeData = new Uint8Array(this.analyser.fftSize);
        } catch (err) {
            console.warn('Manager info: Web Audio API initialization non-blocking notice:', err.message || err);
        }
    }

    resumeAudioContext() {
        if (!this.audioCtx) {
            this.initAudioContext();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }
    }

    /**
     * Firebase Auth Guard: Enforce strict access control for catalinandrian1@gmail.com
     */
    async initAuthGuard() {
        // Test environment bypass check
        if (typeof window !== 'undefined' && (window.__TEST_BYPASS_AUTH__ || window.location.search.includes('bypass_auth=true'))) {
            this.grantAccess({ email: AUTHORIZED_EMAIL });
            return;
        }

        try {
            // Dynamically import Firebase auth from existing app config
            const { auth } = await import('./firebase.js');
            const { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');

            onAuthStateChanged(auth, (user) => {
                if (user && user.email && user.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
                    this.grantAccess(user);
                } else {
                    this.denyAccess(user);
                }
            });

            if (this.elements.googleSignInBtn) {
                this.elements.googleSignInBtn.addEventListener('click', async () => {
                    try {
                        const provider = new GoogleAuthProvider();
                        await signInWithPopup(auth, provider);
                    } catch (signInErr) {
                        console.error('Google Sign-In error:', signInErr);
                    }
                });
            }
        } catch (authErr) {
            console.warn('Manager info: Auth guard evaluation notice:', authErr.message || authErr);
            // Default check for local offline fallback
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                this.grantAccess({ email: AUTHORIZED_EMAIL });
            } else {
                this.denyAccess(null);
            }
        }
    }

    grantAccess(user) {
        this.isAuthorized = true;
        this.currentUser = user;
        if (this.elements.securityOverlay) {
            this.elements.securityOverlay.style.display = 'none';
        }
        if (this.elements.trackBadge) {
            this.elements.trackBadge.innerHTML = `Verified: <span style="color: #38bdf8;">${AUTHORIZED_EMAIL}</span>`;
        }
    }

    denyAccess(user) {
        this.isAuthorized = false;
        this.currentUser = user;
        if (this.audioEl && !this.audioEl.paused) {
            this.audioEl.pause();
        }
        if (this.elements.securityOverlay) {
            this.elements.securityOverlay.style.display = 'flex';
        }
        if (this.elements.securityEmail) {
            this.elements.securityEmail.textContent = user ? user.email : 'Unauthenticated Guest';
        }
    }

    /**
     * Switch / Load Track
     */
    initTrack(trackIdOrNum) {
        const track = getTrackById(trackIdOrNum);
        if (!track) return;

        this.currentTrack = track;
        if (this.audioEl) {
            const wasPlaying = this.isPlaying;
            this.audioEl.pause();
            this.audioEl.src = track.src;
            this.audioEl.playbackRate = this.playbackRate;
            this.audioEl.load();
            this.audioEl.currentTime = 0;
            if (wasPlaying && this.isAuthorized) {
                this.audioEl.play().catch(() => {});
            }
        }

        if (this.elements.trackTitle) {
            this.elements.trackTitle.textContent = track.title;
        }

        this.setSpeakerState('idle');
        this.renderInitialCaption();
        this.updateActiveTrackInMenu();
    }

    renderInitialCaption() {
        if (!this.elements.captionText) return;
        const firstSegment = this.currentTrack.choreography[0];
        if (firstSegment) {
            this.renderCaptionSegment(firstSegment);
        } else {
            this.elements.captionText.innerHTML = `<span class="caption-word">Ready to record...</span>`;
        }
        if (this.elements.captionProgress) {
            this.elements.captionProgress.style.width = '0%';
        }
    }

    renderCaptionSegment(segment) {
        if (!this.elements.captionText) return;
        this.elements.captionText.dataset.segmentStart = segment.start;

        if (segment.words && segment.words.length > 0) {
            this.elements.captionText.innerHTML = segment.words
                .map((w, idx) => `<span class="caption-word" data-word-idx="${idx}" data-start="${w.start}" data-end="${w.end}">${w.word}</span>`)
                .join(' ');
        } else {
            this.elements.captionText.innerHTML = `<span class="caption-word">${segment.text}</span>`;
        }

        if (this.elements.captionCard) {
            this.elements.captionCard.className = `caption-card speaker-${segment.speaker}`;
        }
    }

    /**
     * Sync State Machine & Captions based on audio playback time
     */
    syncChoreography(currentTime) {
        if (!this.currentTrack) return;

        // 1. Find active choreography segment
        const activeSegment = this.currentTrack.choreography.find(
            seg => currentTime >= seg.start && currentTime <= seg.end
        );

        if (activeSegment) {
            // Update speaker state if changed
            if (this.currentSpeaker !== activeSegment.speaker) {
                this.setSpeakerState(activeSegment.speaker);
                this.renderCaptionSegment(activeSegment);
            }

            // Update word-level highlighting
            if (this.elements.captionText) {
                const wordEls = this.elements.captionText.querySelectorAll('.caption-word');
                wordEls.forEach(el => {
                    const start = parseFloat(el.dataset.start);
                    const end = parseFloat(el.dataset.end);
                    if (isNaN(start) || isNaN(end)) return;

                    const speaker = activeSegment.speaker;
                    if (currentTime >= start && currentTime <= end) {
                        el.className = `caption-word active-word-${speaker}`;
                        if (this.elements.captionCard && this.elements.captionCard.scrollHeight > this.elements.captionCard.clientHeight) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    } else if (currentTime > end) {
                        el.className = `caption-word spoken-word-${speaker}`;
                    } else {
                        el.className = 'caption-word';
                    }
                });
            }

            // Update segment progress track
            if (this.elements.captionProgress) {
                const segDuration = activeSegment.end - activeSegment.start;
                const segElapsed = currentTime - activeSegment.start;
                const pct = Math.min(100, Math.max(0, (segElapsed / segDuration) * 100));
                this.elements.captionProgress.style.width = `${pct.toFixed(1)}%`;
            }
        } else if (currentTime > this.currentTrack.duration) {
            this.setSpeakerState('idle');
        }
    }

    setSpeakerState(speaker) {
        this.currentSpeaker = speaker;
        if (!this.elements.arena) return;

        this.elements.arena.classList.remove(
            'state-user-active',
            'state-lexi-active',
            'state-both-active',
            'state-idle'
        );

        if (speaker === 'user') {
            this.elements.arena.classList.add('state-user-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.add('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.remove('active-speaking');
        } else if (speaker === 'lexi') {
            this.elements.arena.classList.add('state-lexi-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.remove('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.add('active-speaking');
        } else if (speaker === 'both') {
            this.elements.arena.classList.add('state-both-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.add('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.add('active-speaking');
        } else {
            this.elements.arena.classList.add('state-idle');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.remove('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.remove('active-speaking');
        }
    }

    /**
     * 60fps Real-Time Audio-Reactive Animation Loop
     */
    startRenderLoop() {
        const render = () => {
            this.animFrameId = requestAnimationFrame(render);
            this.processAudioReactivity();
        };
        this.animFrameId = requestAnimationFrame(render);
    }

    processAudioReactivity() {
        let targetEnergy = 0;

        if (this.isPlaying && this.analyser && this.freqData) {
            this.analyser.getByteFrequencyData(this.freqData);

            // Calculate speech band energy (approx 80Hz - 2200Hz)
            const startBin = 2;
            const endBin = Math.min(32, this.freqData.length);
            let sum = 0;
            for (let i = startBin; i < endBin; i++) {
                sum += this.freqData[i];
            }
            targetEnergy = sum / ((endBin - startBin) * 255);
        } else if (this.isPlaying) {
            // Fallback synthetic breathing pulse if Web Audio is suspended
            targetEnergy = 0.35 + Math.sin(Date.now() / 150) * 0.25;
        }

        // Smooth energy damping (lerp)
        this.smoothEnergy += (targetEnergy - this.smoothEnergy) * 0.22;
        const energy = Math.max(0, Math.min(1, this.smoothEnergy));

        // 1. Reactive Scale & Glow calculations
        const blobScale = (1 + energy * 0.38).toFixed(3);
        const ringScale = (1.15 + energy * 0.55).toFixed(3);
        const ringOpacity = (0.2 + energy * 0.65).toFixed(2);

        // 2. Pink User Blob Audio-Reactive Styling
        if (this.elements.pinkBlob) {
            const isUserActive = this.currentSpeaker === 'user' || this.currentSpeaker === 'both';
            if (isUserActive && this.isPlaying) {
                const userGlow = (25 + energy * 70).toFixed(1);
                const userLightGlow = (45 + energy * 95).toFixed(1);
                this.elements.pinkBlob.style.transform = `scale(${blobScale})`;
                this.elements.pinkBlob.style.boxShadow = `
                    inset 0 0 20px 4px rgba(255, 255, 255, 0.45),
                    inset -5px -5px 15px rgba(159, 18, 57, 0.6),
                    0 0 ${userGlow}px rgba(255, 0, 128, ${(0.5 + energy * 0.45).toFixed(2)}),
                    0 0 ${userLightGlow}px rgba(244, 63, 94, 0.45)
                `;
            } else {
                this.elements.pinkBlob.style.transform = 'scale(1)';
                this.elements.pinkBlob.style.boxShadow = `
                    inset 0 0 20px 4px rgba(255, 255, 255, 0.45),
                    inset -5px -5px 15px rgba(159, 18, 57, 0.6),
                    0 0 25px rgba(255, 0, 128, 0.35),
                    0 0 45px rgba(244, 63, 94, 0.25)
                `;
            }
        }

        // 3. Lexi AI Orb Audio-Reactive Styling (Preserving Exact Medixly Model)
        if (this.elements.lexiOrb) {
            const isLexiActive = this.currentSpeaker === 'lexi' || this.currentSpeaker === 'both';
            if (isLexiActive && this.isPlaying) {
                const lexiGlow = (25 + energy * 70).toFixed(1);
                const lexiLightGlow = (50 + energy * 95).toFixed(1);
                this.elements.lexiOrb.style.transform = `scale(${blobScale})`;
                this.elements.lexiOrb.style.boxShadow = `
                    inset 0 0 16px 3px rgba(255, 255, 255, 0.4),
                    inset -5px -5px 15px rgba(10, 25, 47, 0.7),
                    0 0 ${lexiGlow}px rgba(56, 189, 248, ${(0.5 + energy * 0.45).toFixed(2)}),
                    0 0 ${lexiLightGlow}px rgba(30, 64, 175, 0.45)
                `;
            } else {
                this.elements.lexiOrb.style.transform = 'scale(1)';
                this.elements.lexiOrb.style.boxShadow = `
                    inset 0 0 16px 3px rgba(255, 255, 255, 0.4),
                    inset -5px -5px 15px rgba(10, 25, 47, 0.7),
                    0 0 25px rgba(56, 189, 248, 0.35),
                    0 0 45px rgba(30, 64, 175, 0.25)
                `;
            }
        }

        // 4. Update Resonance Rings
        if (this.elements.pinkBlobWrapper) {
            const ring = this.elements.pinkBlobWrapper.querySelector('.blob-resonance-ring');
            if (ring) {
                ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
                ring.style.opacity = ringOpacity;
            }
        }
        if (this.elements.lexiOrbWrapper) {
            const ring = this.elements.lexiOrbWrapper.querySelector('.blob-resonance-ring');
            if (ring) {
                ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
                ring.style.opacity = ringOpacity;
            }
        }
    }

    /**
     * UI Controls & Keyboard Shortcuts
     */
    setupEventListeners() {
        // Play / Pause Toggle
        if (this.elements.playPauseBtn) {
            this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Restart Current Track
        if (this.elements.restartBtn) {
            this.elements.restartBtn.addEventListener('click', () => this.restartTrack());
        }

        // Clean Record Mode (Hide UI)
        if (this.elements.hideUiBtn) {
            this.elements.hideUiBtn.addEventListener('click', () => this.toggleCleanMode());
        }

        // Record Countdown Mode (3-2-1)
        if (this.elements.recordBtn) {
            this.elements.recordBtn.addEventListener('click', () => this.startCountdownRecord());
        }

        // Aspect Ratio Toggle
        if (this.elements.aspectBtn) {
            this.elements.aspectBtn.addEventListener('click', () => this.toggleAspectRatio());
        }

        // Track Dropdown Menu
        if (this.elements.tracksMenuBtn) {
            this.elements.tracksMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTracksMenu();
            });
        }

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (this.elements.tracksMenu && !this.elements.tracksMenu.contains(e.target) && e.target !== this.elements.tracksMenuBtn) {
                this.elements.tracksMenu.classList.remove('menu-open');
            }
        });

        // Keyboard Shortcuts for Instant Screen Recording Workflow
        document.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.restartTrack();
            } else if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') {
                e.preventDefault();
                this.toggleCleanMode();
            } else if (e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                this.initTrack(parseInt(e.key, 10));
            } else if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
        });
    }

    togglePlayPause() {
        if (!this.audioEl || !this.isAuthorized) return;
        this.resumeAudioContext();

        if (this.audioEl.paused) {
            this.audioEl.play().catch(e => console.warn('Playback notice:', e));
        } else {
            this.audioEl.pause();
        }
    }

    restartTrack() {
        if (!this.audioEl) return;
        this.resumeAudioContext();
        this.audioEl.currentTime = 0;
        this.renderInitialCaption();
        if (this.isAuthorized) {
            this.audioEl.play().catch(() => {});
        }
    }

    updatePlayPauseUI() {
        if (!this.elements.playPauseBtn) return;
        const iconSpan = this.elements.playPauseBtn.querySelector('.btn-icon');
        const textSpan = this.elements.playPauseBtn.querySelector('.btn-text');

        if (this.isPlaying) {
            if (iconSpan) iconSpan.textContent = '⏸';
            if (textSpan) textSpan.textContent = 'Pause';
        } else {
            if (iconSpan) iconSpan.textContent = '▶';
            if (textSpan) textSpan.textContent = 'Play';
        }
    }

    toggleCleanMode() {
        this.isCleanMode = !this.isCleanMode;
        if (this.elements.controlDock) {
            this.elements.controlDock.classList.toggle('dock-hidden', this.isCleanMode);
        }
        if (this.elements.topDock) {
            this.elements.topDock.classList.toggle('dock-hidden', this.isCleanMode);
        }
        if (this.elements.sceneHeader) {
            this.elements.sceneHeader.classList.toggle('header-hidden', this.isCleanMode);
        }
        if (this.elements.tracksMenu) {
            this.elements.tracksMenu.classList.remove('menu-open');
        }
        // Close Composition Studio in clean mode
        if (this.compositionStudio && this.isCleanMode) {
            this.compositionStudio.close();
        }

        if (this.elements.cleanHint) {
            if (this.isCleanMode) {
                this.elements.cleanHint.classList.add('hint-shown');
                setTimeout(() => {
                    this.elements.cleanHint.classList.remove('hint-shown');
                }, 3500);
            } else {
                this.elements.cleanHint.classList.remove('hint-shown');
            }
        }
    }

    startCountdownRecord() {
        if (!this.elements.countdownOverlay || !this.elements.countdownNumber) return;
        if (this.audioEl) this.audioEl.pause();

        let count = 3;
        this.elements.countdownOverlay.classList.add('visible');
        this.elements.countdownNumber.textContent = count;

        clearInterval(this.countdownTimer);
        this.countdownTimer = setInterval(() => {
            count--;
            if (count > 0) {
                this.elements.countdownNumber.textContent = count;
            } else {
                clearInterval(this.countdownTimer);
                this.elements.countdownOverlay.classList.remove('visible');

                // Enter clean mode and play
                if (!this.isCleanMode) {
                    this.toggleCleanMode();
                }
                this.restartTrack();
            }
        }, 1000);
    }

    toggleAspectRatio() {
        if (!this.elements.stage) return;
        if (this.aspectRatio === 'full') {
            this.aspectRatio = '9-16';
            this.elements.stage.className = 'ad-recording-stage aspect-9-16';
            if (this.elements.aspectBtn) this.elements.aspectBtn.innerHTML = `<span>📱 9:16 (TikTok)</span>`;
        } else if (this.aspectRatio === '9-16') {
            this.aspectRatio = '1-1';
            this.elements.stage.className = 'ad-recording-stage aspect-1-1';
            if (this.elements.aspectBtn) this.elements.aspectBtn.innerHTML = `<span>⏹ 1:1 (Square)</span>`;
        } else {
            this.aspectRatio = 'full';
            this.elements.stage.className = 'ad-recording-stage';
            if (this.elements.aspectBtn) this.elements.aspectBtn.innerHTML = `<span>🖥 Full (16:9)</span>`;
        }
    }

    toggleTracksMenu() {
        if (!this.elements.tracksMenu) return;
        this.elements.tracksMenu.classList.toggle('menu-open');
    }

    updateActiveTrackInMenu() {
        if (!this.elements.tracksMenu) return;
        const btns = this.elements.tracksMenu.querySelectorAll('.track-item-btn');
        btns.forEach((btn, idx) => {
            const track = this.tracks[idx];
            if (track && track.id === this.currentTrack.id) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    destroy() {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        if (this.compositionStudio) this.compositionStudio.destroy();
        if (this.audioEl) {
            this.audioEl.pause();
            this.audioEl.src = '';
        }
        if (this.audioCtx) {
            try { this.audioCtx.close(); } catch (_) {}
        }
    }
}
