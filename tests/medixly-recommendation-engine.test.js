// tests/medixly-recommendation-engine.test.js
// Unit tests for the Medixly Algorithmic Endless Queue & Recommendation Engine

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
    computeTrackRelevanceScore,
    getRecommendedTrack,
    fetchUserRecommendationContext,
    clearRecommendationCache,
    EndlessQueueManager
} from '../js/recommendation-engine.js';

describe('Phase 1: Algorithmic Recommendation & Endless Queue Engine', () => {
    // Mock catalog of tracks
    const mockLibrary = [
        {
            id: 'track-hiphop-1',
            title: 'Hustle Hard',
            artist: 'Drake',
            tags: ['hiphop', 'rap', 'viral'],
            bpm: 125,
            energy: 0.8,
            src: '/music/track-hiphop-1.mp3'
        },
        {
            id: 'track-hiphop-2',
            title: 'Midnight Drive',
            artist: 'Lil Baby',
            tags: ['hiphop', 'trap'],
            bpm: 130,
            energy: 0.75,
            src: '/music/track-hiphop-2.mp3'
        },
        {
            id: 'track-rock-1',
            title: 'Thunderstruck Live',
            artist: 'Rock Band',
            tags: ['rock', 'metal'],
            bpm: 135,
            energy: 0.9,
            src: '/music/track-rock-1.mp3'
        },
        {
            id: 'track-pop-1',
            title: 'Neon Lights',
            artist: 'Pop Star',
            tags: ['pop', 'top100'],
            bpm: 120,
            energy: 0.7,
            src: '/music/track-pop-1.mp3'
        },
        {
            id: 'track-ambient-1',
            title: 'Ocean Breeze',
            artist: 'Chill Wave',
            tags: ['lofi', 'chill', 'ambient'],
            bpm: 85,
            energy: 0.3,
            src: '/music/track-ambient-1.mp3'
        }
    ];

    beforeEach(() => {
        clearRecommendationCache();
    });

    describe('Scoring Algorithm Accuracy', () => {
        it('calculates higher score for tracks matching user genre preferences', () => {
            const userProfile = {
                genres: ['hiphop'],
                favoriteArtists: [],
                likedTrackIds: new Set(),
                likedTracks: [],
                listeningHistory: []
            };

            const hiphopScore = computeTrackRelevanceScore(mockLibrary[0], userProfile, { jitter: false });
            const rockScore = computeTrackRelevanceScore(mockLibrary[2], userProfile, { jitter: false });

            expect(hiphopScore).toBeGreaterThan(rockScore);
        });

        it('awards significant bonus for matching user favorite artists', () => {
            const userProfile = {
                genres: ['pop'],
                favoriteArtists: ['Drake'],
                likedTrackIds: new Set(),
                likedTracks: [],
                listeningHistory: []
            };

            const drakeTrack = mockLibrary[0]; // Drake
            const lilBabyTrack = mockLibrary[1]; // Lil Baby

            const drakeScore = computeTrackRelevanceScore(drakeTrack, userProfile, { jitter: false });
            const lilBabyScore = computeTrackRelevanceScore(lilBabyTrack, userProfile, { jitter: false });

            expect(drakeScore).toBeGreaterThan(lilBabyScore + 40);
        });

        it('boosts tracks that are in liked tracks or share artist with liked tracks', () => {
            const userProfile = {
                genres: [],
                favoriteArtists: [],
                likedTrackIds: new Set(['track-hiphop-1']),
                likedTracks: [mockLibrary[0]],
                listeningHistory: []
            };

            const likedScore = computeTrackRelevanceScore(mockLibrary[0], userProfile, { jitter: false });
            const unlikedScore = computeTrackRelevanceScore(mockLibrary[4], userProfile, { jitter: false });

            expect(likedScore).toBeGreaterThan(unlikedScore);
        });

        it('applies anti-fatigue penalty to tracks recently played in listening history', () => {
            const userProfile = {
                genres: ['hiphop'],
                favoriteArtists: ['Drake'],
                likedTrackIds: new Set(['track-hiphop-1']),
                likedTracks: [],
                listeningHistory: []
            };

            // Not recently played
            const freshScore = computeTrackRelevanceScore(mockLibrary[0], userProfile, {
                recentHistoryIds: ['other-1', 'other-2'],
                jitter: false
            });

            // Played in the last 2 songs
            const fatiguedScore = computeTrackRelevanceScore(mockLibrary[0], userProfile, {
                recentHistoryIds: ['other-1', 'track-hiphop-1'],
                jitter: false
            });

            expect(freshScore - fatiguedScore).toBeGreaterThanOrEqual(70);
        });

        it('rewards harmonic/sonic continuity when candidate has similar BPM to current playing track', () => {
            const userProfile = {
                genres: [],
                favoriteArtists: [],
                likedTrackIds: new Set(),
                likedTracks: [],
                listeningHistory: []
            };

            const currentTrack = { id: 'now-playing', bpm: 124, energy: 0.8 };
            const matchingBpmTrack = mockLibrary[0]; // 125 bpm
            const slowBpmTrack = mockLibrary[4]; // 85 bpm

            const matchingScore = computeTrackRelevanceScore(matchingBpmTrack, userProfile, { currentTrack, jitter: false });
            const slowScore = computeTrackRelevanceScore(slowBpmTrack, userProfile, { currentTrack, jitter: false });

            expect(matchingScore).toBeGreaterThan(slowScore);
        });
    });

    describe('getRecommendedTrack Candidate Selection', () => {
        it('returns the most relevant track matching mock user preferences', () => {
            const userProfile = {
                genres: ['hiphop'],
                favoriteArtists: ['Lil Baby'],
                likedTrackIds: new Set(),
                likedTracks: [],
                listeningHistory: []
            };

            const selected = getRecommendedTrack(mockLibrary, userProfile, { jitter: false });
            expect(selected).not.toBeNull();
            expect(selected.id).toBe('track-hiphop-2'); // Lil Baby track
        });

        it('excludes currently playing track from being immediately selected', () => {
            const userProfile = {
                genres: ['hiphop'],
                favoriteArtists: ['Drake'],
                likedTrackIds: new Set(),
                likedTracks: [],
                listeningHistory: []
            };

            const currentTrack = mockLibrary[0]; // Drake track
            const selected = getRecommendedTrack(mockLibrary, userProfile, { currentTrack, excludeCurrent: true, jitter: false });

            expect(selected.id).not.toBe(currentTrack.id);
            expect(selected.tags).toContain('hiphop');
        });

        it('gracefully returns a playable fallback when user profile is completely empty', () => {
            const emptyProfile = {};
            const selected = getRecommendedTrack(mockLibrary, emptyProfile, { jitter: false });

            expect(selected).toBeDefined();
            expect(selected.src).toBeTruthy();
        });
    });

    describe('Database Query Optimization & Caching', () => {
        it('caches user recommendation context in memory to eliminate buffering on repeat queries', async () => {
            let firestoreReads = 0;
            const mockDb = {
                doc: (database, col, id) => ({ col, id }),
                getDoc: async () => {
                    firestoreReads++;
                    return {
                        exists: () => true,
                        data: () => ({
                            genres: ['electronic', 'synth'],
                            favoriteArtists: ['Kavinsky'],
                            musicFavorites: ['song-abc'],
                            musicHistory: ['song-xyz']
                        })
                    };
                }
            };

            // First fetch: executes database read
            const profile1 = await fetchUserRecommendationContext(mockDb, 'user-123');
            expect(firestoreReads).toBe(1);
            expect(profile1.genres).toEqual(['electronic', 'synth']);

            // Second fetch: retrieved instantly from in-memory cache with 0 database reads
            const profile2 = await fetchUserRecommendationContext(mockDb, 'user-123');
            expect(firestoreReads).toBe(1);
            expect(profile2.genres).toEqual(['electronic', 'synth']);
        });

        it('falls back to local preferences gracefully if database query throws error', async () => {
            const mockFailingDb = {
                doc: () => {},
                getDoc: async () => {
                    throw new Error('Firestore connection offline');
                }
            };

            const localFallback = {
                genres: ['lofi'],
                role: 'listener'
            };

            const profile = await fetchUserRecommendationContext(mockFailingDb, 'user-999', localFallback);
            expect(profile.genres).toEqual(['lofi']);
            expect(profile.role).toBe('listener');
        });
    });

    describe('EndlessQueueManager Integration', () => {
        it('respects manual queue when user has queued tracks manually', () => {
            const manager = new EndlessQueueManager({
                librarySongs: mockLibrary,
                userProfile: { genres: ['hiphop'] }
            });

            const manualQueue = [mockLibrary[2]]; // User explicitly queued Rock track
            const currentQueue = [mockLibrary[0]];

            const queued = manager.handleQueueCheck({
                manualQueue,
                currentQueue,
                currentSongIndex: 0
            });

            // When manual queue is NOT empty, do not inject auto-recommendations
            expect(queued).toBeNull();
            expect(currentQueue.length).toBe(1);
        });

        it('triggers recommendation function and auto-queues when manual queue is empty', () => {
            const manager = new EndlessQueueManager({
                librarySongs: mockLibrary,
                userProfile: { genres: ['rock'] }
            });

            const manualQueue = []; // Empty manual queue!
            const currentQueue = [mockLibrary[0]]; // Only 1 song, at index 0

            const queued = manager.handleQueueCheck({
                manualQueue,
                currentQueue,
                currentSongIndex: 0,
                recentHistory: [mockLibrary[0]]
            });

            expect(queued).not.toBeNull();
            expect(queued.tags).toContain('rock');
            expect(currentQueue.length).toBe(2);
            expect(currentQueue[1].id).toBe(queued.id);
        });
    });
});
