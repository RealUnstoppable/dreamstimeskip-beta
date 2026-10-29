// js/ad-preview-controller.js
// Ad Screen-Recording Preview Scene Controller: Solo-Speaker Stage, Audio Analyser, Dynamic Backgrounds, Captions, Menu, & Auth Guard

import { AD_TRACKS, MASTER_SHOWCASE_TRACK, getTrackById } from './ad-preview-data.js';
import { CompositionStudio } from './ad-composition-studio.js';

export const AUTHORIZED_EMAIL = 'catalinandrian1@gmail.com';

export class AdPreviewController {
    constructor(options = {}) {
        this.tracks = [MASTER_SHOWCASE_TRACK, ...AD_TRACKS];
        this.currentTrack = MASTER_SHOWCASE_TRACK;
        this.initialTrackId = options.initialTrackId || 'showcase';

        this.audioEl = null;
        this.audioCtx = null;
        this.analyser = null;
        this.sourceNode = null;
        this.freqData = null;
        this.timeData = null;

        this.isPlaying = false;
        this.currentEnergy = 0;
        this.smoothEnergy = 0;
        this.smoothBassEnergy = 0;
        this.animFrameId = null;
        this.currentSpeaker = 'idle'; // 'user' | 'lexi' | 'visualizer' | 'both' | 'transition' | 'idle'
        this.currentBlobStyle = 'neon-purple';

        this.isAuthorized = false;
        this.currentUser = null;
        this.aspectRatio = 'full'; // 'full' | '9-16' | '1-1'
        this.isCleanMode = false;
        this.countdownTimer = null;
        this.playbackRate = 1.0;

        // Ad Editor Pricing state ($X.99 formulated)
        this.selectedPrice = 12.99;
        this.adPrice = 12.99;

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
        this.elements.visualizerBlob = opts.visualizerBlob || document.getElementById('visualizer-blob');
        this.elements.visualizerBlobWrapper = opts.visualizerBlobWrapper || document.getElementById('visualizer-blob-wrapper');
        this.elements.visualizerSlot = opts.visualizerSlot || document.getElementById('blob-slot-visualizer');
        this.elements.userSlot = opts.userSlot || document.getElementById('blob-slot-user');
        this.elements.lexiSlot = opts.lexiSlot || document.getElementById('blob-slot-lexi');

        this.elements.featurePill = opts.featurePill || document.getElementById('ad-feature-pill');
        this.elements.featurePillText = opts.featurePillText || document.getElementById('feature-pill-text');
        this.elements.featurePillIcon = opts.featurePillIcon || document.getElementById('feature-pill-icon');
        this.elements.orbStatusPill = opts.orbStatusPill || document.getElementById('ad-orb-status-pill');
        this.elements.miniWaveform = opts.miniWaveform || document.getElementById('ad-mini-waveform');

        this.elements.userTag = opts.userTag || document.getElementById('speaker-tag-user');
        this.elements.lexiTag = opts.lexiTag || document.getElementById('speaker-tag-lexi');
        this.elements.visualizerTag = opts.visualizerTag || document.getElementById('speaker-tag-visualizer');

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

    /**
     * Set the ad pricing state and broadcast update
     * @param {number|string} price
     */
    setAdPrice(price) {
        const num = parseFloat(price);
        if (isNaN(num)) return;
        this.selectedPrice = num;
        this.adPrice = num;

        try {
            localStorage.setItem('medixly_ad_editor_price', num.toFixed(2));
        } catch (_) {}

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('medixly:ad-price-updated', {
                detail: {
                    price: num,
                    formatted: `$${num.toFixed(2)}`
                }
            }));
        }
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
            const isBoxHidden = this.compositionStudio ? !this.compositionStudio.showCaptionBox : false;
            this.elements.captionCard.className = `caption-card speaker-${segment.speaker}${isBoxHidden ? ' caption-box-hidden' : ''}`;
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
            if (this.currentSpeaker !== activeSegment.speaker || this.currentBlobStyle !== activeSegment.blobStyle) {
                this.currentBlobStyle = activeSegment.blobStyle;
                this.setSpeakerState(activeSegment.speaker, activeSegment.blobStyle);
                this.renderCaptionSegment(activeSegment);
            }

            // Auto-Cycle background per segment if auto-cycle is enabled
            if (activeSegment.background) {
                this.currentBackground = activeSegment.background;
                if (this.compositionStudio && this.compositionStudio.autoCycleBackground !== false) {
                    if (this.compositionStudio.activeBackground !== activeSegment.background) {
                        this.compositionStudio.setBackground(activeSegment.background, false);
                    }
                }
            }

            // Update Feature Showcase Overlays & Badges
            this.updateFeatureOverlays(activeSegment);

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
            this.updateFeatureOverlays({});
        }
    }

    /**
     * Update feature showcase pill badge and Lexi status label
     */
    updateFeatureOverlays(segment) {
        const isBadgesEnabled = this.compositionStudio ? this.compositionStudio.showFeatureBadges : true;

        // Floating feature pill (bottom of stage)
        if (this.elements.featurePill) {
            if (segment.featureBadge && isBadgesEnabled) {
                if (this.elements.featurePillText) {
                    this.elements.featurePillText.textContent = segment.featureBadge;
                }
                if (this.elements.miniWaveform) {
                    const hasWaveform = segment.speaker === 'visualizer' || segment.featureBadge.includes('Waveform') || segment.featureBadge.includes('Lyrics');
                    this.elements.miniWaveform.style.display = hasWaveform ? 'inline-flex' : 'none';
                }
                this.elements.featurePill.classList.add('visible');
            } else {
                this.elements.featurePill.classList.remove('visible');
            }
        }

        // Orb status label (Above Lexi Orb)
        if (this.elements.orbStatusPill) {
            if (segment.statusLabel && isBadgesEnabled && segment.speaker === 'lexi') {
                const textEl = this.elements.orbStatusPill.querySelector('.status-text') || this.elements.orbStatusPill;
                textEl.textContent = segment.statusLabel;
                this.elements.orbStatusPill.classList.add('visible');
            } else {
                this.elements.orbStatusPill.classList.remove('visible');
            }
        }
    }

    setSpeakerState(speaker, blobStyle) {
        this.currentSpeaker = speaker;
        if (!this.elements.arena) return;

        this.elements.arena.classList.remove(
            'state-user-active',
            'state-lexi-active',
            'state-visualizer-active',
            'state-both-active',
            'state-idle'
        );

        if (speaker === 'user') {
            this.elements.arena.classList.add('state-user-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.add('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.remove('active-speaking');
            if (this.elements.visualizerBlobWrapper) this.elements.visualizerBlobWrapper.classList.remove('active-speaking');
        } else if (speaker === 'lexi') {
            this.elements.arena.classList.add('state-lexi-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.remove('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.add('active-speaking');
            if (this.elements.visualizerBlobWrapper) this.elements.visualizerBlobWrapper.classList.remove('active-speaking');
        } else if (speaker === 'visualizer') {
            this.elements.arena.classList.add('state-visualizer-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.remove('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.remove('active-speaking');
            if (this.elements.visualizerBlobWrapper) this.elements.visualizerBlobWrapper.classList.add('active-speaking');
            if (this.elements.visualizerBlob && blobStyle) {
                this.elements.visualizerBlob.className = `visualizer-blob style-${blobStyle}`;
            }
        } else if (speaker === 'both') {
            this.elements.arena.classList.add('state-both-active');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.add('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.add('active-speaking');
            if (this.elements.visualizerBlobWrapper) this.elements.visualizerBlobWrapper.classList.remove('active-speaking');
        } else {
            this.elements.arena.classList.add('state-idle');
            if (this.elements.pinkBlobWrapper) this.elements.pinkBlobWrapper.classList.remove('active-speaking');
            if (this.elements.lexiOrbWrapper) this.elements.lexiOrbWrapper.classList.remove('active-speaking');
            if (this.elements.visualizerBlobWrapper) this.elements.visualizerBlobWrapper.classList.remove('active-speaking');
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
        let targetBass = 0;

        if (this.isPlaying && this.analyser && this.freqData) {
            this.analyser.getByteFrequencyData(this.freqData);

            // Bass & Sub-Bass band (approx 20Hz - 160Hz)
            const bassBins = Math.min(6, this.freqData.length);
            let bassSum = 0;
            for (let i = 0; i < bassBins; i++) {
                bassSum += this.freqData[i];
            }
            targetBass = bassSum / (bassBins * 255);

            // Speech / vocal band (approx 180Hz - 2400Hz)
            const endBin = Math.min(34, this.freqData.length);
            let vocalSum = 0;
            for (let i = bassBins; i < endBin; i++) {
                vocalSum += this.freqData[i];
            }
            targetEnergy = vocalSum / ((endBin - bassBins) * 255);
        } else if (this.isPlaying) {
            // Fallback synthetic breathing pulse if Web Audio is suspended
            targetEnergy = 0.35 + Math.sin(Date.now() / 150) * 0.25;
            targetBass = 0.45 + Math.sin(Date.now() / 240) * 0.35;
        }

        // Smooth energy damping (lerp)
        this.smoothEnergy += (targetEnergy - this.smoothEnergy) * 0.22;
        this.smoothBassEnergy += (targetBass - this.smoothBassEnergy) * 0.28;

        const energy = Math.max(0, Math.min(1, this.smoothEnergy));
        const bassEnergy = Math.max(0, Math.min(1, this.smoothBassEnergy));

        // Pass real-time amplitude metrics to CSS variables for beat-reactive backgrounds
        if (this.elements.viewport) {
            this.elements.viewport.style.setProperty('--audio-energy', energy.toFixed(3));
            this.elements.viewport.style.setProperty('--audio-bass-energy', bassEnergy.toFixed(3));
        }

        // 1. Reactive Scale & Glow calculations
        const blobScale = (1 + energy * 0.38).toFixed(3);
        const ringScale = (1.15 + energy * 0.55).toFixed(3);
        const ringOpacity = (0.2 + energy * 0.65).toFixed(2);

        // Visualizer bass scales
        const vizScale = (1 + bassEnergy * 0.52).toFixed(3);
        const vizRingScale = (1.18 + bassEnergy * 0.72).toFixed(3);
        const vizRingOpacity = (0.3 + bassEnergy * 0.7).toFixed(2);

        // 2. Pink User Blob Audio-Reactive Styling
        if (this.elements.pinkBlob) {
            const isUserActive = this.currentSpeaker === 'user' || this.currentSpeaker === 'both';
            const isVizFallback = this.currentSpeaker === 'visualizer' && !this.elements.visualizerBlob;
            if ((isUserActive || isVizFallback) && this.isPlaying) {
                const effectiveScale = isVizFallback ? vizScale : blobScale;
                const userGlow = (25 + (isVizFallback ? bassEnergy : energy) * 70).toFixed(1);
                const userLightGlow = (45 + (isVizFallback ? bassEnergy : energy) * 95).toFixed(1);
                this.elements.pinkBlob.style.transform = `scale(${effectiveScale})`;
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

        // 4. Medixly Reactive Visualizer Blob Audio-Reactive Styling
        if (this.elements.visualizerBlob) {
            const isVizActive = this.currentSpeaker === 'visualizer';
            if (isVizActive && this.isPlaying) {
                const vizGlow = (35 + bassEnergy * 85).toFixed(1);
                this.elements.visualizerBlob.style.transform = `scale(${vizScale})`;
                this.elements.visualizerBlob.style.boxShadow = `
                    inset 0 0 20px 4px rgba(255, 255, 255, 0.5),
                    0 0 ${vizGlow}px rgba(168, 85, 247, ${(0.6 + bassEnergy * 0.4).toFixed(2)}),
                    0 0 ${(vizGlow * 1.5).toFixed(1)}px rgba(56, 189, 248, 0.45)
                `;
            } else {
                this.elements.visualizerBlob.style.transform = 'scale(1)';
            }
        }

        // 5. Update Resonance Rings
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
        if (this.elements.visualizerBlobWrapper) {
            const rings = this.elements.visualizerBlobWrapper.querySelectorAll('.blob-resonance-ring');
            rings.forEach((ring, idx) => {
                const mult = idx === 1 ? 1.25 : 1.0;
                ring.style.transform = `translate(-50%, -50%) scale(${(vizRingScale * mult).toFixed(3)})`;
                ring.style.opacity = vizRingOpacity;
            });
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
                if (this.countdownTimer) {
                    this.cancelCountdown();
                }
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

    toggleCleanMode(forceState) {
        this.isCleanMode = typeof forceState === 'boolean' ? forceState : !this.isCleanMode;
        if (this.elements.controlDock) {
            this.elements.controlDock.classList.toggle('dock-hidden', this.isCleanMode);
        }
        if (this.elements.topDock) {
            this.elements.topDock.classList.toggle('dock-hidden', this.isCleanMode);
        }
        if (this.elements.sceneHeader) {
            this.elements.sceneHeader.classList.toggle('header-hidden', this.isCleanMode);
            this.elements.sceneHeader.style.display = this.isCleanMode ? 'none' : '';
        }
        if (this.elements.viewport) {
            this.elements.viewport.classList.toggle('clean-mode-active', this.isCleanMode);
        }
        if (this.elements.stage) {
            this.elements.stage.classList.toggle('clean-mode-active', this.isCleanMode);
        }
        if (this.elements.tracksMenu) {
            this.elements.tracksMenu.classList.remove('menu-open');
        }
        const gearBtn = document.getElementById('btn-composition-gear');
        if (gearBtn) {
            gearBtn.style.display = this.isCleanMode ? 'none' : '';
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

    cancelCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        if (this.elements.countdownOverlay) {
            this.elements.countdownOverlay.classList.remove('visible');
        }
        if (this.elements.viewport) {
            this.elements.viewport.classList.remove('countdown-active');
        }
        if (this.elements.stage) {
            this.elements.stage.classList.remove('countdown-active');
        }
    }

    startCountdownRecord() {
        if (!this.elements.countdownOverlay || !this.elements.countdownNumber) return;
        if (this.audioEl) this.audioEl.pause();

        // 1. Immediately remove MEDIXLY AD STUDIO & Verified badge during countdown & enter clean mode
        if (this.elements.sceneHeader) {
            this.elements.sceneHeader.classList.add('header-hidden');
            this.elements.sceneHeader.style.display = 'none';
        }
        const gearBtn = document.getElementById('btn-composition-gear');
        if (gearBtn) {
            gearBtn.style.display = 'none';
        }
        if (this.elements.viewport) {
            this.elements.viewport.classList.add('countdown-active');
        }
        if (this.elements.stage) {
            this.elements.stage.classList.add('countdown-active');
        }
        if (!this.isCleanMode) {
            this.toggleCleanMode(true);
        }

        let count = 3;
        this.elements.countdownOverlay.classList.add('visible');
        this.elements.countdownNumber.textContent = count;

        if (this.countdownTimer) clearInterval(this.countdownTimer);
        this.countdownTimer = setInterval(() => {
            count--;
            if (count > 0) {
                this.elements.countdownNumber.textContent = count;
            } else {
                clearInterval(this.countdownTimer);
                this.countdownTimer = null;
                this.elements.countdownOverlay.classList.remove('visible');
                if (this.elements.viewport) {
                    this.elements.viewport.classList.remove('countdown-active');
                }
                if (this.elements.stage) {
                    this.elements.stage.classList.remove('countdown-active');
                }

                // Ensure clean mode remains active (header remains removed) and play
                if (!this.isCleanMode) {
                    this.toggleCleanMode(true);
                } else if (this.elements.sceneHeader) {
                    this.elements.sceneHeader.classList.add('header-hidden');
                    this.elements.sceneHeader.style.display = 'none';
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
        btns.forEach((btn) => {
            const isShowcaseBtn = btn.classList.contains('preset-showcase-btn');
            if (isShowcaseBtn) {
                btn.classList.toggle('active', Boolean(this.currentTrack?.isMasterShowcase));
            } else {
                const trackName = btn.querySelector('.track-name')?.textContent || '';
                const match = trackName.match(/Track (\d+)/i);
                if (match) {
                    const trackNum = parseInt(match[1], 10);
                    btn.classList.toggle('active', this.currentTrack?.trackNumber === trackNum && !this.currentTrack?.isMasterShowcase);
                }
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
        this.cancelCountdown();
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
