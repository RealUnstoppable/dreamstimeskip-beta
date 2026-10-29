// js/audio-ads.js
// Audio Ad Orchestration & Lexi Soundwave Visualizer

export const AD_AUDIO_SOURCES = [
    '/music/ads/ad-1.mp3',
    '/music/ads/ad-2.mp3'
];

export const STORAGE_KEY_LAST_INDEX = 'medixly_last_ad_index';
export const STORAGE_KEY_LAST_TIMESTAMP = 'medixly_last_ad_timestamp';
export const STORAGE_KEY_SONGS_COUNT = 'medixly_songs_played_count';
export const SESSION_KEY_FIRST_PLAYED = 'medixly_session_ad_played';

export const FIFTEEN_MINUTES_MS = 15 * 60 * 1000; // 900,000 ms

export class AudioAdManager {
    constructor() {
        this.adAudio = null;
        this.mixEngine = null;
        this.analyser = null;
        this.freqData = null;
        this.timeData = null;
        this.animFrameId = null;
        this.currentEnergy = 0;

        this.isPlaying = false;
        this.isPremium = false;
        this.currentUser = null;
        this.onCompleteMergeCallback = null;

        // UI references
        this.ui = {
            overlay: null,
            orb: null,
            canvas: null,
            canvasCtx: null,
            ring1: null,
            ring2: null,
            ring3: null,
            currentTimeEl: null,
            totalTimeEl: null,
            progressFill: null,
            closeBtn: null,
            viewLyrics: null,
            fsPlayer: null,
            bottomBar: {
                title: null,
                artist: null,
                art: null,
                progressFill: null,
                playIcon: null,
                pauseIcon: null
            }
        };

        // Cache last ad timestamp
        this.initStorageState();
    }

    initStorageState() {
        try {
            if (typeof localStorage !== 'undefined') {
                if (!localStorage.getItem(STORAGE_KEY_LAST_TIMESTAMP)) {
                    localStorage.setItem(STORAGE_KEY_LAST_TIMESTAMP, Date.now().toString());
                }
                if (!localStorage.getItem(STORAGE_KEY_SONGS_COUNT)) {
                    localStorage.setItem(STORAGE_KEY_SONGS_COUNT, '0');
                }
            }
        } catch (_) {}
    }

    /**
     * Bind DOM elements and services
     */
    init(options = {}) {
        this.mixEngine = options.mixEngine || null;
        this.ui.viewLyrics = options.viewLyrics || document.getElementById('view-lyrics');
        this.ui.fsPlayer = options.fsPlayer || document.getElementById('fullscreen-player');

        // Resolve or create ad audio element
        let audioEl = options.adAudio || document.getElementById('medixly-ad-audio');
        if (!audioEl && typeof document !== 'undefined') {
            audioEl = document.createElement('audio');
            audioEl.id = 'medixly-ad-audio';
            audioEl.preload = 'auto';
            document.body.appendChild(audioEl);
        }
        this.adAudio = audioEl;

        if (this.adAudio) {
            this.adAudio.addEventListener('timeupdate', () => this.handleTimeUpdate());
            this.adAudio.addEventListener('ended', () => this.handleAdEnded());
            this.adAudio.addEventListener('pause', () => this.handlePause());
            this.adAudio.addEventListener('play', () => this.handlePlay());
            this.adAudio.addEventListener('error', (e) => {
                console.warn('AudioAdManager: Ad audio playback error:', e);
                // Fallback: gracefully merge if playback cannot start
                if (this.isPlaying) {
                    this.completeAd();
                }
            });
        }

        // Overlay DOM
        if (typeof document !== 'undefined') {
            this.ui.overlay = document.getElementById('lexi-ad-overlay');
            if (this.ui.overlay) {
                this.ui.orb = document.getElementById('lexi-ad-orb');
                this.ui.canvas = document.getElementById('lexi-ad-canvas');
                if (this.ui.canvas && typeof this.ui.canvas.getContext === 'function') {
                    try {
                        this.ui.canvasCtx = this.ui.canvas.getContext('2d');
                    } catch (_) {
                        this.ui.canvasCtx = null;
                    }
                }
                this.ui.ring1 = this.ui.overlay.querySelector('.lexi-ad-ring.ring-1');
                this.ui.ring2 = this.ui.overlay.querySelector('.lexi-ad-ring.ring-2');
                this.ui.ring3 = this.ui.overlay.querySelector('.lexi-ad-ring.ring-3');
                this.ui.currentTimeEl = document.getElementById('lexi-ad-current-time');
                this.ui.totalTimeEl = document.getElementById('lexi-ad-total-time');
                this.ui.progressFill = document.getElementById('lexi-ad-progress-fill');
                this.ui.closeBtn = document.getElementById('lexi-ad-close-btn');

                if (this.ui.closeBtn) {
                    this.ui.closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.minimizeOverlay();
                    });
                }
            }

            // Bottom bar hooks
            this.ui.bottomBar.title = options.playerTitle || document.getElementById('player-song-title');
            this.ui.bottomBar.artist = options.playerArtist || document.getElementById('player-song-artist');
            this.ui.bottomBar.art = options.playerArt || document.getElementById('player-album-art');
            this.ui.bottomBar.progressFill = options.progressFill || document.querySelector('.progress-bar .progress');
            this.ui.bottomBar.playIcon = options.playIcon || document.querySelector('#play-pause-btn .play-icon');
            this.ui.bottomBar.pauseIcon = options.pauseIcon || document.querySelector('#play-pause-btn .pause-icon');
        }

        // Check if user is already premium
        this.checkPremiumStatus();
    }

    /**
     * Sets user auth state and membership tier
     */
    setUser(user, isPremium = false) {
        this.currentUser = user;
        this.isPremium = !!isPremium;
    }

    checkPremiumStatus() {
        try {
            if (typeof localStorage !== 'undefined') {
                const ruConsent = localStorage.getItem('ru_membership');
                if (ruConsent === 'premium' || ruConsent === 'ultimate') {
                    this.isPremium = true;
                }
            }
        } catch (_) {}
    }

    isUserPremium() {
        return this.isPremium;
    }

    getSongsPlayedCount() {
        try {
            if (typeof localStorage !== 'undefined') {
                return parseInt(localStorage.getItem(STORAGE_KEY_SONGS_COUNT) || '0', 10);
            }
        } catch (_) {}
        return 0;
    }

    setSongsPlayedCount(count) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_SONGS_COUNT, Math.max(0, count).toString());
            }
        } catch (_) {}
    }

    getLastAdTimestamp() {
        try {
            if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(STORAGE_KEY_LAST_TIMESTAMP);
                if (raw) return parseInt(raw, 10);
            }
        } catch (_) {}
        return Date.now();
    }

    setLastAdTimestamp(ts = Date.now()) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_LAST_TIMESTAMP, ts.toString());
            }
        } catch (_) {}
    }

    isSessionAdPlayed() {
        try {
            if (typeof sessionStorage !== 'undefined') {
                return sessionStorage.getItem(SESSION_KEY_FIRST_PLAYED) === 'true';
            }
        } catch (_) {}
        return false;
    }

    setSessionAdPlayed(val = true) {
        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(SESSION_KEY_FIRST_PLAYED, val ? 'true' : 'false');
            }
        } catch (_) {}
    }

    /**
     * Determines whether an ad should trigger based on:
     * 1) Before user plays a song (session start)
     * 2) After every 5 songs
     * 3) After 15 minutes of listening
     */
    shouldPlayAd(context = 'play_request') {
        if (this.isUserPremium()) {
            return false;
        }

        if (this.isPlaying) {
            return false;
        }

        // Rule 1: Before a user plays a song (session start)
        if (!this.isSessionAdPlayed() && (context === 'before_play' || context === 'play_request')) {
            return true;
        }

        // Rule 2: After every 5 songs
        if (this.getSongsPlayedCount() >= 5) {
            return true;
        }

        // Rule 3: After 15 minutes
        const elapsed = Date.now() - this.getLastAdTimestamp();
        if (elapsed >= FIFTEEN_MINUTES_MS) {
            return true;
        }

        return false;
    }

    /**
     * Called whenever a song completes playback
     */
    onSongCompleted() {
        const nextCount = this.getSongsPlayedCount() + 1;
        this.setSongsPlayedCount(nextCount);
    }

    /**
     * Alternates between the 2 uploaded ad audios:
     * ad-1.mp3 -> ad-2.mp3 -> ad-1.mp3 ...
     */
    getNextAdIndex() {
        try {
            let lastIndex = 1;
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY_LAST_INDEX);
                if (stored !== null) {
                    lastIndex = parseInt(stored, 10);
                }
            }
            const nextIndex = (lastIndex + 1) % AD_AUDIO_SOURCES.length;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_LAST_INDEX, nextIndex.toString());
            }
            return nextIndex;
        } catch (_) {
            return 0;
        }
    }

    getNextAdSrc() {
        const idx = this.getNextAdIndex();
        return AD_AUDIO_SOURCES[idx] || AD_AUDIO_SOURCES[0];
    }

    isAdPlaying() {
        return this.isPlaying;
    }

    isPaused() {
        return !this.adAudio || this.adAudio.paused;
    }

    togglePlayPause() {
        if (!this.adAudio) return;
        if (this.adAudio.paused) {
            try {
                const p = this.adAudio.play();
                if (p && typeof p.catch === 'function') p.catch(() => {});
            } catch (_) {}
        } else {
            this.adAudio.pause();
        }
    }

    /**
     * Check if user is currently inside the lyrics view or fullscreen player
     */
    isUserInLyricsOrPlayer() {
        const lyrics = this.ui.viewLyrics || document.getElementById('view-lyrics');
        const fs = this.ui.fsPlayer || document.getElementById('fullscreen-player');

        const inLyrics = lyrics && lyrics.style.display !== 'none' && !lyrics.classList.contains('slide-down-active');
        const inPlayer = fs && fs.style.display !== 'none' && !fs.classList.contains('fs-hiding');

        return !!(inLyrics || inPlayer);
    }

    /**
     * Begins ad playback, shows Lexi orb if in player/lyrics, and prepares merge callback
     */
    playAd(onCompleteMerge) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.onCompleteMergeCallback = onCompleteMerge;

        const adSrc = this.getNextAdSrc();

        if (this.adAudio) {
            this.adAudio.src = adSrc;
            this.adAudio.currentTime = 0;
            this.setupAudioNodes();

            try {
                const playPromise = this.adAudio.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.then(() => {
                        this.updatePlayStateUI(true);
                    }).catch((err) => {
                        console.warn('AudioAdManager: autoplay check', err?.message || err);
                        this.updatePlayStateUI(false);
                        this.completeAd();
                    });
                } else {
                    this.updatePlayStateUI(true);
                }
            } catch (err) {
                console.warn('AudioAdManager: play exception', err?.message || err);
                this.updatePlayStateUI(false);
                this.completeAd();
            }
        }

        // Show Lexi orb in dim blue background if in lyrics or player
        if (this.isUserInLyricsOrPlayer()) {
            this.showOverlay();
        }

        // Update bottom bar title/artist
        this.updateBottomBarForAd();

        // Start real-time audio soundwave reactive visualizer
        this.startVisualizer();
    }

    updateBottomBarForAd() {
        if (this.ui.bottomBar.title) {
            this.ui.bottomBar.title.textContent = 'Advertisement • Medixly Premium';
        }
        if (this.ui.bottomBar.artist) {
            this.ui.bottomBar.artist.textContent = 'Medixly Official';
        }
        if (this.ui.bottomBar.art) {
            this.ui.bottomBar.art.src = '/images/medixly-logo.png';
        }
        if (this.ui.bottomBar.progressFill) {
            this.ui.bottomBar.progressFill.style.width = '0%';
        }
    }

    updatePlayStateUI(playing) {
        if (this.ui.bottomBar.playIcon) {
            this.ui.bottomBar.playIcon.style.display = playing ? 'none' : 'block';
        }
        if (this.ui.bottomBar.pauseIcon) {
            this.ui.bottomBar.pauseIcon.style.display = playing ? 'block' : 'none';
        }
        const fsPlayPause = document.getElementById('fs-play-pause-btn');
        if (fsPlayPause) {
            const playI = fsPlayPause.querySelector('.play-icon');
            const pauseI = fsPlayPause.querySelector('.pause-icon');
            if (playI) playI.style.display = playing ? 'none' : 'block';
            if (pauseI) pauseI.style.display = playing ? 'block' : 'none';
        }
    }

    handlePlay() {
        this.updatePlayStateUI(true);
    }

    handlePause() {
        this.updatePlayStateUI(false);
    }

    handleTimeUpdate() {
        if (!this.adAudio || !this.isPlaying) return;
        const cur = this.adAudio.currentTime || 0;
        const dur = this.adAudio.duration || 31.7;

        if (this.ui.currentTimeEl) {
            this.ui.currentTimeEl.textContent = this.formatTime(cur);
        }
        if (this.ui.totalTimeEl) {
            this.ui.totalTimeEl.textContent = this.formatTime(dur);
        }

        const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
        if (this.ui.progressFill) {
            this.ui.progressFill.style.width = `${pct}%`;
        }
        if (this.ui.bottomBar.progressFill) {
            this.ui.bottomBar.progressFill.style.width = `${pct}%`;
        }

        const curTimeText = document.querySelector('.current-time');
        const totTimeText = document.querySelector('.total-time');
        if (curTimeText) curTimeText.textContent = this.formatTime(cur);
        if (totTimeText) totTimeText.textContent = this.formatTime(dur);

        // Check if user navigated into lyrics or player while ad is running
        if (this.isUserInLyricsOrPlayer() && (!this.ui.overlay || !this.ui.overlay.classList.contains('visible'))) {
            this.showOverlay();
        }
    }

    handleAdEnded() {
        this.completeAd();
    }

    /**
     * Completes the ad, resets counters, and smoothly merges into the next song
     */
    completeAd() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        // Mark counters
        this.setSessionAdPlayed(true);
        this.setSongsPlayedCount(0);
        this.setLastAdTimestamp(Date.now());

        if (this.adAudio) {
            this.adAudio.pause();
            this.adAudio.currentTime = 0;
        }

        this.stopVisualizer();

        // Visual merge: cross-dissolve overlay into the next song
        const overlay = this.ui.overlay || document.getElementById('lexi-ad-overlay');
        if (overlay && overlay.classList.contains('visible')) {
            overlay.classList.add('merging');
            setTimeout(() => {
                overlay.classList.remove('visible', 'merging');
                overlay.classList.add('hidden');
                overlay.setAttribute('aria-hidden', 'true');
            }, 750);
        }

        // Execute merge callback into next song
        const cb = this.onCompleteMergeCallback;
        this.onCompleteMergeCallback = null;
        if (typeof cb === 'function') {
            try {
                cb();
            } catch (err) {
                console.error('AudioAdManager: merge to song callback error', err);
            }
        }
    }

    showOverlay() {
        const overlay = this.ui.overlay || document.getElementById('lexi-ad-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden', 'merging');
        overlay.removeAttribute('aria-hidden');
        overlay.offsetHeight; // trigger reflow
        overlay.classList.add('visible');
    }

    hideOverlay() {
        const overlay = this.ui.overlay || document.getElementById('lexi-ad-overlay');
        if (!overlay) return;
        overlay.classList.remove('visible', 'merging');
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
    }

    minimizeOverlay() {
        this.hideOverlay();
        const lyrics = this.ui.viewLyrics || document.getElementById('view-lyrics');
        const fs = this.ui.fsPlayer || document.getElementById('fullscreen-player');
        if (lyrics) lyrics.style.display = 'none';
        if (fs) {
            fs.style.display = 'none';
            fs.classList.remove('fs-visible');
        }
    }

    /**
     * Connects Web Audio Analyser for real-time soundwave extraction
     */
    setupAudioNodes() {
        if (!this.mixEngine || typeof window === 'undefined') return;

        try {
            const ctx = this.mixEngine.getContext();
            if (!ctx) return;

            // Connect ad audio to mixEngine master gain
            if (typeof this.mixEngine.connectAdElement === 'function') {
                this.mixEngine.connectAdElement(this.adAudio);
            }

            // Retrieve or instantiate analyser
            if (typeof this.mixEngine.getAnalyser === 'function') {
                this.analyser = this.mixEngine.getAnalyser();
            }

            if (!this.analyser && ctx) {
                this.analyser = ctx.createAnalyser();
                this.analyser.fftSize = 256;
                this.analyser.smoothingTimeConstant = 0.8;
                const masterGain = this.mixEngine.getMasterGain();
                if (masterGain) masterGain.connect(this.analyser);
            }

            if (this.analyser) {
                this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
                this.timeData = new Uint8Array(this.analyser.fftSize);
            }
        } catch (e) {
            console.warn('AudioAdManager: Web Audio analyser setup notice', e);
        }
    }

    /**
     * Animation frame loop: pulses the Lexi Orb and waveform based on audio soundwave
     */
    startVisualizer() {
        this.stopVisualizer();

        const step = (timestamp) => {
            if (!this.isPlaying) return;

            let energy = 0;
            let timeVal = timestamp * 0.003;

            if (this.analyser && this.freqData && this.timeData) {
                try {
                    this.analyser.getByteFrequencyData(this.freqData);
                    this.analyser.getByteTimeDomainData(this.timeData);

                    // Bass frequencies (voice fundamental transients)
                    let bassSum = 0;
                    for (let i = 1; i <= 8; i++) {
                        bassSum += this.freqData[i];
                    }
                    const bass = bassSum / (8 * 255);

                    // RMS waveform amplitude
                    let sumSq = 0;
                    for (let i = 0; i < this.timeData.length; i++) {
                        const v = (this.timeData[i] - 128) / 128;
                        sumSq += v * v;
                    }
                    const rms = Math.sqrt(sumSq / this.timeData.length);

                    energy = bass * 0.65 + rms * 0.35;
                } catch (_) {
                    energy = 0.15 + Math.sin(timeVal) * 0.1;
                }
            } else {
                // Procedural pulse fallback if AudioContext is unsupported/mocked
                energy = 0.18 + Math.sin(timeVal * 2.5) * 0.12;
            }

            // Smooth interpolation
            this.currentEnergy += (energy - this.currentEnergy) * 0.28;

            this.renderVisualizerFrame(this.currentEnergy);

            this.animFrameId = requestAnimationFrame(step);
        };

        if (typeof requestAnimationFrame === 'function') {
            this.animFrameId = requestAnimationFrame(step);
        }
    }

    renderVisualizerFrame(energy) {
        const orb = this.ui.orb || document.getElementById('lexi-ad-orb');
        if (!orb) return;

        // Dynamic scale and glow on the blob
        const scale = 1 + energy * 0.38;
        const glow = 25 + energy * 65;
        const lightGlow = 50 + energy * 85;

        orb.style.transform = `scale(${scale.toFixed(3)})`;
        orb.style.boxShadow = `inset 0 0 16px 3px rgba(255, 255, 255, 0.35), 0 0 ${glow.toFixed(1)}px rgba(56, 189, 248, ${(0.45 + energy * 0.45).toFixed(2)}), 0 0 ${lightGlow.toFixed(1)}px rgba(30, 64, 175, 0.45)`;

        // Clear canvas if present to ensure no lines are drawn
        if (this.ui.canvasCtx && this.ui.canvas) {
            this.ui.canvasCtx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        }
    }

    stopVisualizer() {
        if (this.animFrameId && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    resetForTesting() {
        this.isPlaying = false;
        this.currentEnergy = 0;
        this.setSongsPlayedCount(0);
        this.setSessionAdPlayed(false);
        this.setLastAdTimestamp(Date.now());
        this.stopVisualizer();
        this.hideOverlay();
    }
}

export const audioAdManager = new AudioAdManager();
