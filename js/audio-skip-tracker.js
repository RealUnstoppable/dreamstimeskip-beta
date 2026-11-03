// js/audio-skip-tracker.js
// Ad-Injection Engine & Robust Skip Tracker for Medixly

export const STORAGE_KEY_SKIP_COUNT = 'medixly_skip_count';
export const STORAGE_KEY_SKIP_THRESHOLD = 'medixly_skip_threshold';
export const MIN_SKIP_INTERVAL = 10;
export const MAX_SKIP_INTERVAL = 15;

/**
 * Returns a randomized skip threshold between min and max (inclusive)
 */
export function getRandomSkipInterval(min = MIN_SKIP_INTERVAL, max = MAX_SKIP_INTERVAL) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Curated fallback ad studio payload catalog
 */
export const DEFAULT_AD_PAYLOADS = [
    {
        id: 'ad-studio-preview-1',
        title: 'Skip to Good Part • Medixly Ad Studio',
        subtitle: 'Medixly AI Audio • Sponsor',
        src: '/music/ads/ad-1.mp3',
        duration: 15,
        art: '/images/medixly-logo.png'
    },
    {
        id: 'ad-studio-preview-2',
        title: 'Zero Ads & Unlimited Skips • Medixly Premium',
        subtitle: 'Upgrade Today • Sponsor',
        src: '/music/ads/ad-2.mp3',
        duration: 15,
        art: '/images/medixly-logo.png'
    }
];

/**
 * Fetches an audio ad payload from Medixly Ad Studio database/catalog
 *
 * @param {Object} db - Firestore database instance (optional)
 * @returns {Promise<Object>} Formatted ad track payload
 */
export async function fetchAdStudioPayload(db = null) {
    // 1. Try querying Firestore Ad Studio collection if available
    if (db) {
        try {
            let collectionFn = db.collection;
            let getDocsFn = db.getDocs;
            let limitFn = db.limit;
            let queryFn = db.query;

            if (!collectionFn || !getDocsFn) {
                try {
                    const firestoreMod = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js').catch(() => null);
                    if (firestoreMod) {
                        collectionFn = firestoreMod.collection;
                        getDocsFn = firestoreMod.getDocs;
                        limitFn = firestoreMod.limit;
                        queryFn = firestoreMod.query;
                    }
                } catch (_) {}
            }

            if (collectionFn && getDocsFn && queryFn && limitFn) {
                const adsRef = collectionFn(db, 'ad_studio_campaigns');
                const q = queryFn(adsRef, limitFn(5));
                const snap = await getDocsFn(q);
                if (snap && snap.docs && snap.docs.length > 0) {
                    const randomDoc = snap.docs[Math.floor(Math.random() * snap.docs.length)];
                    const data = randomDoc.data();
                    if (data && (data.src || data.audioUrl)) {
                        return {
                            id: 'ad-studio-' + randomDoc.id,
                            title: data.title || 'Advertisement • Medixly Ad Studio',
                            artist: data.sponsor || data.subtitle || 'Medixly Sponsor',
                            subtitle: data.subtitle || 'Medixly Ad Studio',
                            src: data.src || data.audioUrl,
                            duration: data.duration || 15,
                            art: data.art || '/images/medixly-logo.png',
                            isAd: true,
                            unskippable: true
                        };
                    }
                }
            }
        } catch (err) {
            console.warn('[Ad Studio Tracker] Notice: Ad Studio remote fetch fallback:', err?.message || err);
        }
    }

    // 2. Select from curated Ad Studio catalog
    const chosen = DEFAULT_AD_PAYLOADS[Math.floor(Math.random() * DEFAULT_AD_PAYLOADS.length)];
    return {
        id: chosen.id,
        title: chosen.title,
        artist: chosen.subtitle,
        subtitle: 'Medixly Ad Studio',
        src: chosen.src,
        duration: chosen.duration,
        art: chosen.art,
        isAd: true,
        unskippable: true
    };
}

/**
 * Global Audio Skip Tracker & Ad-Injection Engine
 * Manages skip count, randomized intervals (10-15), ad injection, and unskippable enforcement.
 */
export class AudioSkipTracker {
    constructor(options = {}) {
        this.minInterval = options.minInterval || MIN_SKIP_INTERVAL;
        this.maxInterval = options.maxInterval || MAX_SKIP_INTERVAL;
        this.isPremium = !!options.isPremium;
        this.listeners = new Set();
        this.db = options.db || null;

        this.skipCount = 0;
        this.targetSkipThreshold = this.getRandomThreshold();
        this.isAdActive = false;
        this.currentAdTrack = null;

        this.initFromStorage();
    }

    getRandomThreshold() {
        return getRandomSkipInterval(this.minInterval, this.maxInterval);
    }

    initFromStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                const storedCount = localStorage.getItem(STORAGE_KEY_SKIP_COUNT);
                if (storedCount !== null) {
                    const parsed = parseInt(storedCount, 10);
                    if (!isNaN(parsed) && parsed >= 0) this.skipCount = parsed;
                }

                const storedThreshold = localStorage.getItem(STORAGE_KEY_SKIP_THRESHOLD);
                if (storedThreshold !== null) {
                    const parsed = parseInt(storedThreshold, 10);
                    if (!isNaN(parsed) && parsed >= this.minInterval && parsed <= this.maxInterval) {
                        this.targetSkipThreshold = parsed;
                    }
                } else {
                    this.saveState();
                }
            }
        } catch (_) {}
    }

    saveState() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_SKIP_COUNT, String(this.skipCount));
                localStorage.setItem(STORAGE_KEY_SKIP_THRESHOLD, String(this.targetSkipThreshold));
            }
        } catch (_) {}
    }

    setPremium(isPremium) {
        this.isPremium = !!isPremium;
        this.notify();
    }

    getSkipCount() {
        return this.skipCount;
    }

    getTargetThreshold() {
        return this.targetSkipThreshold;
    }

    /**
     * Resets skip counter and rolls a new randomized threshold between 10 and 15
     */
    reset() {
        this.skipCount = 0;
        this.targetSkipThreshold = this.getRandomThreshold();
        this.isAdActive = false;
        this.currentAdTrack = null;
        this.saveState();
        this.notify();
    }

    /**
     * Increments skip counter and evaluates whether an ad payload should be injected.
     * If user is premium, skip count increments are bypassed.
     *
     * @returns {Object} Evaluation result { shouldInjectAd, skipCount, targetThreshold }
     */
    recordSkip() {
        if (this.isPremium) {
            return {
                shouldInjectAd: false,
                skipCount: this.skipCount,
                targetThreshold: this.targetSkipThreshold,
                isPremium: true
            };
        }

        this.skipCount++;
        this.saveState();
        this.notify();

        const shouldInject = this.skipCount >= this.targetSkipThreshold;
        return {
            shouldInjectAd: shouldInject,
            skipCount: this.skipCount,
            targetThreshold: this.targetSkipThreshold,
            isPremium: false
        };
    }

    /**
     * Injects an ad payload into the queue immediately after currentSongIndex.
     *
     * @param {Array<Object>} queue - Current audio queue
     * @param {number} currentSongIndex - Current playing index
     * @param {Object} db - Optional Firestore instance
     * @returns {Promise<Object>} Result of ad injection
     */
    async injectAdIntoQueue(queue, currentSongIndex, db = null) {
        if (this.isPremium) {
            return { injected: false, reason: 'premium_user' };
        }

        const adPayload = await fetchAdStudioPayload(db || this.db);
        const insertIndex = Math.max(0, currentSongIndex + 1);

        if (Array.isArray(queue)) {
            queue.splice(insertIndex, 0, adPayload);
        }

        const oldThreshold = this.targetSkipThreshold;
        // Reset counter and roll new 10-15 interval
        this.skipCount = 0;
        this.targetSkipThreshold = this.getRandomThreshold();
        this.saveState();
        this.notify();

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('medixly:ad-injected', {
                detail: { adTrack: adPayload, insertIndex, previousThreshold: oldThreshold, nextThreshold: this.targetSkipThreshold }
            }));
        }

        return {
            injected: true,
            adTrack: adPayload,
            insertIndex,
            newThreshold: this.targetSkipThreshold
        };
    }

    /**
     * Checks if current track is an ad that cannot be skipped.
     */
    isAdTrack(track) {
        if (!track) return false;
        return Boolean(track.isAd || track.unskippable);
    }

    /**
     * Sets whether an ad payload is currently active in the player,
     * updating state and locking/unlocking media player UI controls.
     */
    setAdActive(active, track = null) {
        this.isAdActive = Boolean(active);
        this.currentAdTrack = active ? track : null;
        this.lockPlayerControls(this.isAdActive);
        this.notify();
    }

    /**
     * Locks or unlocks media player UI controls (next, prev, seek bars)
     */
    lockPlayerControls(isLocked) {
        if (typeof document === 'undefined') return;
        const controlIds = [
            'next-btn', 'prev-btn',
            'fs-next-btn', 'fs-prev-btn',
            'mob-next-btn', 'mob-prev-btn',
            'viral-skip-btn', 'fs-viral-skip-btn'
        ];
        controlIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.disabled = isLocked;
                el.setAttribute('aria-disabled', String(isLocked));
                if (isLocked) {
                    el.classList.add('ad-locked', 'control-locked');
                } else {
                    el.classList.remove('ad-locked', 'control-locked');
                }
            }
        });

        const seekBars = document.querySelectorAll('.progress-bar, #fs-progress-bar, #progress-bar');
        seekBars.forEach(bar => {
            if (isLocked) {
                bar.classList.add('ad-locked', 'seek-disabled');
                bar.setAttribute('aria-disabled', 'true');
            } else {
                bar.classList.remove('ad-locked', 'seek-disabled');
                bar.removeAttribute('aria-disabled');
            }
        });
    }

    /**
     * Validates whether a skip action is allowed. If current track is an ad,
     * prevents the skip, enforces continuous playback, and optionally pauses momentarily.
     *
     * @param {Object} currentTrack - Track currently playing
     * @param {HTMLMediaElement} audioElement - Audio element playing the track
     * @returns {Object} { allowed: boolean, reason?: string }
     */
    handleSkipAttempt(currentTrack, audioElement = null) {
        if (this.isAdTrack(currentTrack) || this.isAdActive) {
            // Unskippable ad in progress!
            if (audioElement) {
                // If user tried to force skip by calling pause or next, enforce playback
                try {
                    if (audioElement.paused) {
                        const playPromise = audioElement.play();
                        if (playPromise && typeof playPromise.catch === 'function') {
                            playPromise.catch(() => {});
                        }
                    }
                } catch (_) {}
            }

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('medixly:ad-skip-blocked', {
                    detail: { track: currentTrack, message: 'Advertisements cannot be skipped.' }
                }));
            }

            return {
                allowed: false,
                reason: 'unskippable_ad',
                message: 'Advertisements cannot be skipped. Please wait for the message to complete.'
            };
        }

        return { allowed: true };
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        const state = {
            skipCount: this.skipCount,
            targetSkipThreshold: this.targetSkipThreshold,
            isPremium: this.isPremium
        };
        this.listeners.forEach(fn => {
            try { fn(state); } catch (_) {}
        });

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('medixly:skip-count-changed', { detail: state }));
        }
    }
}

// Global singleton instance
export const audioSkipTracker = new AudioSkipTracker();
