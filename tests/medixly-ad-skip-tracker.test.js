// tests/medixly-ad-skip-tracker.test.js
// Unit tests for the Medixly Ad-Injection Engine & Skip Tracker

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
    AudioSkipTracker,
    getRandomSkipInterval,
    fetchAdStudioPayload,
    MIN_SKIP_INTERVAL,
    MAX_SKIP_INTERVAL,
    STORAGE_KEY_SKIP_COUNT,
    STORAGE_KEY_SKIP_THRESHOLD
} from '../js/audio-skip-tracker.js';

describe('Phase 2: Ad-Injection Engine & Skip Tracker', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new AudioSkipTracker();
        tracker.reset();
    });

    describe('Randomized Interval (10 to 15 skips)', () => {
        it('always generates randomized intervals strictly between 10 and 15 skips', () => {
            const results = new Set();
            for (let i = 0; i < 200; i++) {
                const interval = getRandomSkipInterval();
                expect(interval).toBeGreaterThanOrEqual(10);
                expect(interval).toBeLessThanOrEqual(15);
                results.add(interval);
            }

            // Verify natural randomization occurs across the range
            expect(results.size).toBeGreaterThan(1);
        });

        it('initializes targetSkipThreshold within 10-15 range and persists to storage', () => {
            const threshold = tracker.getTargetThreshold();
            expect(threshold).toBeGreaterThanOrEqual(10);
            expect(threshold).toBeLessThanOrEqual(15);

            expect(localStorage.getItem(STORAGE_KEY_SKIP_THRESHOLD)).toBe(String(threshold));
            expect(tracker.getSkipCount()).toBe(0);
        });
    });

    describe('Skip Monitoring & Threshold Triggering', () => {
        it('increments skip count on each manual skip', () => {
            expect(tracker.getSkipCount()).toBe(0);

            tracker.recordSkip();
            expect(tracker.getSkipCount()).toBe(1);
            expect(localStorage.getItem(STORAGE_KEY_SKIP_COUNT)).toBe('1');

            tracker.recordSkip();
            expect(tracker.getSkipCount()).toBe(2);
            expect(localStorage.getItem(STORAGE_KEY_SKIP_COUNT)).toBe('2');
        });

        it('triggers ad injection exactly when skip count hits the randomized threshold (between 10-15)', () => {
            const threshold = tracker.getTargetThreshold();
            expect(threshold).toBeGreaterThanOrEqual(10);
            expect(threshold).toBeLessThanOrEqual(15);

            // Skips prior to threshold must NOT trigger ad injection
            for (let i = 1; i < threshold; i++) {
                const res = tracker.recordSkip();
                expect(res.shouldInjectAd).toBe(false);
                expect(tracker.getSkipCount()).toBe(i);
            }

            // Reaching threshold triggers injection!
            const triggerRes = tracker.recordSkip();
            expect(triggerRes.shouldInjectAd).toBe(true);
            expect(triggerRes.skipCount).toBe(threshold);
        });

        it('automatically injects Medixly Ad Studio payload into queue as immediate next track', async () => {
            const mockQueue = [
                { id: 'song-1', title: 'Song 1' },
                { id: 'song-2', title: 'Song 2' },
                { id: 'song-3', title: 'Song 3' }
            ];
            const currentSongIndex = 0;

            const injectRes = await tracker.injectAdIntoQueue(mockQueue, currentSongIndex);

            expect(injectRes.injected).toBe(true);
            expect(injectRes.insertIndex).toBe(1); // Immediate next track!
            expect(mockQueue.length).toBe(4);

            const injectedTrack = mockQueue[1];
            expect(injectedTrack.isAd).toBe(true);
            expect(injectedTrack.unskippable).toBe(true);
            expect(injectedTrack.src).toMatch(/\.mp3$/);
            expect(injectedTrack.title).toContain('Medixly');

            // Counter must be reset to 0, and a new 10-15 threshold rolled
            expect(tracker.getSkipCount()).toBe(0);
            expect(tracker.getTargetThreshold()).toBeGreaterThanOrEqual(10);
            expect(tracker.getTargetThreshold()).toBeLessThanOrEqual(15);
        });

        it('fetches ad payload from Medixly Ad Studio database or curated fallback', async () => {
            const payload = await fetchAdStudioPayload(null);

            expect(payload).toBeDefined();
            expect(payload.id).toBeTruthy();
            expect(payload.src).toBeTruthy();
            expect(payload.isAd).toBe(true);
            expect(payload.unskippable).toBe(true);
            expect(payload.duration).toBeGreaterThan(0);
        });
    });

    describe('Unskippable Ad Enforcement', () => {
        it('blocks skip attempts when an ad track is currently playing', () => {
            const adTrack = {
                id: 'ad-track-1',
                title: 'Sponsored Message',
                isAd: true,
                unskippable: true
            };

            let playCalled = false;
            const mockAudioElement = {
                paused: true,
                play: () => {
                    playCalled = true;
                    return Promise.resolve();
                }
            };

            const result = tracker.handleSkipAttempt(adTrack, mockAudioElement);

            expect(result.allowed).toBe(false);
            expect(result.reason).toBe('unskippable_ad');
            // Playback must be enforced
            expect(playCalled).toBe(true);
        });

        it('allows normal track skips when current track is not an ad', () => {
            const normalTrack = {
                id: 'regular-song-1',
                title: 'Regular Music Track',
                isAd: false
            };

            const result = tracker.handleSkipAttempt(normalTrack);
            expect(result.allowed).toBe(true);
        });
    });

    describe('Premium User Exemption', () => {
        it('exempts premium users from skip counting and ad injections', async () => {
            tracker.setPremium(true);

            for (let i = 0; i < 20; i++) {
                const res = tracker.recordSkip();
                expect(res.shouldInjectAd).toBe(false);
                expect(res.isPremium).toBe(true);
            }

            const mockQueue = [{ id: 'song-1' }, { id: 'song-2' }];
            const injectRes = await tracker.injectAdIntoQueue(mockQueue, 0);

            expect(injectRes.injected).toBe(false);
            expect(mockQueue.length).toBe(2);
        });
    });
});
