// js/recommendation-engine.js
// Algorithmic Recommendation & Endless Queue Engine for Medixly

/**
 * In-memory cache for user recommendation profiles to prevent redundant Firestore queries
 * and eliminate playback transition buffering.
 */
const profileCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Normalizes an artist name or tag string for fuzzy comparison
 */
function normalizeTerm(term) {
    if (!term) return '';
    return String(term).toLowerCase().trim();
}

/**
 * Computes a multi-dimensional recommendation score for a candidate track
 * based on user genre preferences, liked tracks, listening history, and sonic continuity.
 *
 * @param {Object} candidate - Track object from catalog
 * @param {Object} userProfile - User preference & history profile
 * @param {Object} options - Additional context (currentTrack, recentHistoryIds, upcomingQueueIds, jitter)
 * @returns {number} Computed relevance score
 */
export function computeTrackRelevanceScore(candidate, userProfile = {}, options = {}) {
    if (!candidate) return -Infinity;

    let score = 0;
    const songArtist = normalizeTerm(candidate.artist);
    const rawTags = Array.isArray(candidate.tags) ? candidate.tags : [];
    const songTags = rawTags.map(normalizeTerm);

    const {
        currentTrack = null,
        recentHistoryIds = [],
        upcomingQueueIds = new Set(),
        jitter = true
    } = options;

    const genres = Array.isArray(userProfile.genres) ? userProfile.genres.map(normalizeTerm) : [];
    const favoriteArtists = Array.isArray(userProfile.favoriteArtists) ? userProfile.favoriteArtists.map(normalizeTerm) : [];
    const likedTrackIds = userProfile.likedTrackIds instanceof Set
        ? userProfile.likedTrackIds
        : new Set(Array.isArray(userProfile.likedTrackIds) ? userProfile.likedTrackIds : []);
    const listeningHistory = Array.isArray(userProfile.listeningHistory) ? userProfile.listeningHistory : [];
    const likedTracks = Array.isArray(userProfile.likedTracks) ? userProfile.likedTracks : [];

    // 1. Profile Genre Preferences (+35 points per match)
    for (const genre of genres) {
        if (!genre) continue;
        if (songTags.includes(genre)) {
            score += 35;
        } else if (genre === 'hiphop' && (songTags.includes('rap') || songTags.includes('hip-hop') || songTags.includes('trap'))) {
            score += 35;
        } else if (genre === 'lofi' && (songTags.includes('lo-fi') || songTags.includes('chill') || songTags.includes('relaxed'))) {
            score += 35;
        } else if (genre === 'electronic' && (songTags.includes('dance') || songTags.includes('edm') || songTags.includes('synth'))) {
            score += 35;
        } else if (genre === 'pop' && (songTags.includes('dark pop') || songTags.includes('hyperpop'))) {
            score += 35;
        } else if (genre === 'rock' && (songTags.includes('metal') || songTags.includes('punk') || songTags.includes('alt'))) {
            score += 35;
        } else if (genre === 'rb' && (songTags.includes('r&b') || songTags.includes('soul'))) {
            score += 35;
        }
    }

    // 2. Favorite Artist Match (+60 points)
    for (const favArtist of favoriteArtists) {
        if (!favArtist) continue;
        if (songArtist.includes(favArtist) || favArtist.includes(songArtist)) {
            score += 60;
            break;
        }
    }

    // 3. Liked Tracks Affinity (+40 for direct favorite, +25 for artist affinity, +15 for shared tags)
    if (likedTrackIds.has(candidate.id)) {
        score += 40;
    }

    let likedArtistMatches = 0;
    let likedTagMatches = 0;
    for (const liked of likedTracks) {
        if (!liked) continue;
        const likedArtist = normalizeTerm(liked.artist);
        if (likedArtist && (likedArtist.includes(songArtist) || songArtist.includes(likedArtist))) {
            likedArtistMatches++;
        }
        const lTags = Array.isArray(liked.tags) ? liked.tags.map(normalizeTerm) : [];
        for (const t of songTags) {
            if (lTags.includes(t)) likedTagMatches++;
        }
    }
    score += Math.min(35, likedArtistMatches * 15);
    score += Math.min(25, likedTagMatches * 5);

    // 4. Listening History Affinity (Artist & Genre frequency reinforcement)
    let historyArtistFrequency = 0;
    let historyTagFrequency = 0;
    for (const histItem of listeningHistory) {
        if (!histItem) continue;
        const histArtist = normalizeTerm(histItem.artist || (typeof histItem === 'object' ? histItem.artist : ''));
        if (histArtist && (histArtist.includes(songArtist) || songArtist.includes(histArtist))) {
            historyArtistFrequency++;
        }
        const hTags = Array.isArray(histItem.tags) ? histItem.tags.map(normalizeTerm) : [];
        for (const t of songTags) {
            if (hTags.includes(t)) historyTagFrequency++;
        }
    }
    score += Math.min(30, historyArtistFrequency * 8);
    score += Math.min(20, historyTagFrequency * 4);

    // 5. Anti-Fatigue / Recency Penalty (avoids immediate repetitive playback)
    const recentIndex = recentHistoryIds.lastIndexOf(candidate.id);
    if (recentIndex !== -1) {
        const songsAgo = recentHistoryIds.length - recentIndex;
        if (songsAgo <= 2) {
            score -= 85;
        } else if (songsAgo <= 5) {
            score -= 50;
        } else if (songsAgo <= 10) {
            score -= 25;
        }
    }

    // 6. Upcoming Queue Collision Penalty
    if (upcomingQueueIds.has(candidate.id)) {
        score -= 60;
    }

    // 7. Sonic Continuity & BPM Flow with Current Track
    if (currentTrack && typeof currentTrack.bpm === 'number' && typeof candidate.bpm === 'number') {
        const bpmDiff = Math.abs(currentTrack.bpm - candidate.bpm);
        if (bpmDiff <= 8) {
            score += 20; // Harmonic match
        } else if (bpmDiff <= 18) {
            score += 10;
        }
    }

    // Energy similarity
    if (currentTrack && typeof currentTrack.energy === 'number' && typeof candidate.energy === 'number') {
        const energyDiff = Math.abs(currentTrack.energy - candidate.energy);
        if (energyDiff <= 0.15) {
            score += 10;
        }
    }

    // 8. Persona / Role Adjustments
    const role = normalizeTerm(userProfile.role || 'listener');
    if (role === 'creator') {
        if (songTags.includes('viral')) score += 25;
        if (songTags.includes('upbeat') || songTags.includes('energetic')) score += 15;
    } else if (role === 'artist') {
        if (songTags.includes('synth') || songTags.includes('remix') || songTags.includes('acoustic')) score += 20;
    } else if (role === 'listener') {
        if (songTags.includes('top100') || songTags.includes('viral')) score += 20;
    } else if (role === 'explorer') {
        if (songTags.includes('indie') || songTags.includes('alternative') || songTags.includes('latin')) score += 25;
    }

    // 9. Popularity / Ranking Boost
    if (typeof candidate.rank === 'number' && candidate.rank > 0) {
        score += Math.max(5, Math.round(30 - (candidate.rank / 4)));
    }
    if (songTags.includes('viral')) score += 20;
    if (songTags.includes('trending')) score += 15;

    // 10. Jitter for natural variety
    if (jitter) {
        score += Math.random() * 6;
    }

    return score;
}

/**
 * Selects the optimal next track using the lightweight recommendation algorithm.
 *
 * @param {Array<Object>} candidates - Available library tracks
 * @param {Object} userProfile - User preferences, history, and favorites
 * @param {Object} options - Context options
 * @returns {Object|null} Top recommended track
 */
export function getRecommendedTrack(candidates = [], userProfile = {}, options = {}) {
    if (!Array.isArray(candidates) || candidates.length === 0) return null;

    const {
        currentTrack = null,
        excludeSongIds = new Set(),
        excludeCurrent = true,
        recentHistoryIds = [],
        upcomingQueueIds = new Set(),
        jitter = true
    } = options;

    const excluded = new Set(excludeSongIds);
    if (excludeCurrent && currentTrack?.id) {
        excluded.add(currentTrack.id);
    }

    // Filter candidate pool to only playable, non-hidden tracks
    const pool = candidates.filter(song => {
        if (!song || song.isHidden) return false;
        const hasAudioSrc = Boolean(song.src || song.streamUrl || song.audioUrl || song.url);
        if (!hasAudioSrc) return false;
        if (excluded.has(song.id)) return false;
        return true;
    });

    if (pool.length === 0) {
        // Fallback to any valid playable song
        const fallbacks = candidates.filter(s => s && !s.isHidden && (s.src || s.streamUrl));
        return fallbacks[0] || candidates[0] || null;
    }

    // Score candidates
    const scored = pool.map(candidate => ({
        track: candidate,
        score: computeTrackRelevanceScore(candidate, userProfile, {
            currentTrack,
            recentHistoryIds,
            upcomingQueueIds,
            jitter
        })
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored[0]?.track || pool[0];
}

/**
 * Optimized database query helper that retrieves user listening history, liked tracks,
 * and profile genre preferences with in-memory caching to eliminate buffering delay.
 *
 * @param {Object} db - Firestore database instance
 * @param {string} userId - Firebase user UID
 * @param {Object} localFallback - In-memory / localStorage fallback data
 * @returns {Promise<Object>} Resolved recommendation profile
 */
export async function fetchUserRecommendationContext(db, userId, localFallback = {}) {
    // 1. Check in-memory cache first for instant retrieval
    if (userId && profileCache.has(userId)) {
        const cached = profileCache.get(userId);
        if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return cached.data;
        }
    }

    // Default structure from local fallback
    const resolvedProfile = {
        genres: Array.isArray(localFallback.genres) ? localFallback.genres : ['hiphop', 'pop'],
        favoriteArtists: Array.isArray(localFallback.favoriteArtists) ? localFallback.favoriteArtists : [],
        likedTrackIds: localFallback.likedTrackIds instanceof Set
            ? localFallback.likedTrackIds
            : new Set(Array.isArray(localFallback.likedTrackIds) ? localFallback.likedTrackIds : []),
        likedTracks: Array.isArray(localFallback.likedTracks) ? localFallback.likedTracks : [],
        listeningHistory: Array.isArray(localFallback.listeningHistory) ? localFallback.listeningHistory : [],
        role: localFallback.role || 'listener',
        sfxNeeds: localFallback.sfxNeeds || 'moderate'
    };

    // 2. If authenticated and database is provided, query Firestore
    if (db && userId) {
        try {
            // Lazy import Firestore doc/getDoc if not globally passed
            let docFn = db.doc;
            let getDocFn = db.getDoc;

            if (!docFn || !getDocFn) {
                // If running in browser or Node test with standard firebase SDK
                try {
                    const firestoreMod = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js').catch(() => null);
                    if (firestoreMod) {
                        docFn = firestoreMod.doc;
                        getDocFn = firestoreMod.getDoc;
                    }
                } catch (_) {}
            }

            if (docFn && getDocFn) {
                const userRef = docFn(db, 'users', userId);
                const userSnap = await getDocFn(userRef);

                if (userSnap && typeof userSnap.exists === 'function' && userSnap.exists()) {
                    const data = userSnap.data() || {};
                    if (Array.isArray(data.genres) && data.genres.length > 0) {
                        resolvedProfile.genres = data.genres;
                    }
                    if (Array.isArray(data.favoriteArtists)) {
                        resolvedProfile.favoriteArtists = data.favoriteArtists;
                    }
                    if (Array.isArray(data.musicFavorites)) {
                        resolvedProfile.likedTrackIds = new Set(data.musicFavorites);
                    }
                    if (Array.isArray(data.musicHistory)) {
                        resolvedProfile.listeningHistory = data.musicHistory.map(item =>
                            typeof item === 'string' ? { id: item } : item
                        );
                    }
                    if (data.role) resolvedProfile.role = data.role;
                    if (data.sfxNeeds) resolvedProfile.sfxNeeds = data.sfxNeeds;
                }
            }
        } catch (err) {
            // Fallback gracefully without throwing to ensure non-blocking playback
            console.warn('[Medixly Recommendation] Firestore profile query note:', err?.message || err);
        }

        // Cache the retrieved profile
        profileCache.set(userId, {
            data: resolvedProfile,
            timestamp: Date.now()
        });
    }

    return resolvedProfile;
}

/**
 * Clears the user profile cache (useful for testing or profile updates)
 */
export function clearRecommendationCache(userId = null) {
    if (userId) {
        profileCache.delete(userId);
    } else {
        profileCache.clear();
    }
}

/**
 * Endless Queue Controller
 * Bridges playback events with the recommendation algorithm.
 */
export class EndlessQueueManager {
    constructor(options = {}) {
        this.isEnabled = options.isEnabled !== false;
        this.librarySongs = options.librarySongs || [];
        this.userProfile = options.userProfile || {};
        this.db = options.db || null;
        this.userId = options.userId || null;
    }

    setLibrarySongs(songs) {
        this.librarySongs = Array.isArray(songs) ? songs : [];
    }

    setUserProfile(profile) {
        this.userProfile = profile || {};
    }

    setEnabled(enabled) {
        this.isEnabled = !!enabled;
    }

    /**
     * Checks if recommendation should fire early in track lifecycle (e.g. 25s before end or at 10s playback)
     * to ensure the upcoming track is buffered and ready before the 5-second crossfade window.
     */
    shouldTriggerEarly(currentTime, duration, upcomingCount = 0) {
        if (!this.isEnabled) return false;
        if (upcomingCount > 0) return false; // Already has upcoming track queued
        
        const validDur = typeof duration === 'number' && !isNaN(duration) && duration > 5;
        if (!validDur) return true; // Queue immediately if duration unknown

        const remaining = duration - currentTime;
        // Trigger early: between 20-25 seconds before song end, or once song is at least 10s in
        return remaining <= 25 || currentTime >= 10;
    }

    /**
     * Inspects manual queue and upcoming queue. If manual queue is empty,
     * triggers recommendation and auto-queues the best next track.
     *
     * @param {Object} context - Playback queue context
     * @returns {Object|null} Recommended track if queued, otherwise null
     */
    handleQueueCheck(context = {}) {
        if (!this.isEnabled) return null;

        const {
            manualQueue = [],
            currentQueue = [],
            currentSongIndex = 0,
            recentHistory = []
        } = context;

        // If manual queue has items, user intention takes priority
        if (Array.isArray(manualQueue) && manualQueue.length > 0) {
            return null;
        }

        // Check if upcoming items already exist beyond current index
        const upcomingCount = Math.max(0, currentQueue.length - (currentSongIndex + 1));
        if (upcomingCount > 0) {
            return null; // Already has upcoming songs
        }

        // Upcoming is empty and manual queue is empty -> Trigger Recommendation!
        const currentTrack = currentQueue[currentSongIndex] || null;
        const recentHistoryIds = recentHistory.map(s => s?.id || s).filter(Boolean);
        const upcomingQueueIds = new Set(currentQueue.slice(currentSongIndex + 1).map(s => s?.id).filter(Boolean));

        const nextTrack = getRecommendedTrack(this.librarySongs, this.userProfile, {
            currentTrack,
            recentHistoryIds,
            upcomingQueueIds,
            excludeCurrent: true
        });

        if (nextTrack) {
            currentQueue.push(nextTrack);
            return nextTrack;
        }

        return null;
    }

    /**
     * Async database-connected endless queue trigger that pulls fresh user profile
     * and injects next recommended song early into queue and idle player deck.
     */
    async autoQueueNextTrackWithContext(context = {}) {
        if (!this.isEnabled) return null;
        const {
            db = this.db,
            userId = this.userId,
            localFallback = {},
            manualQueue = [],
            currentQueue = [],
            currentSongIndex = 0,
            recentHistory = [],
            idleAudio = null
        } = context;

        if (Array.isArray(manualQueue) && manualQueue.length > 0) {
            return null;
        }

        const upcomingCount = Math.max(0, currentQueue.length - (currentSongIndex + 1));
        if (upcomingCount > 0) {
            return currentQueue[currentSongIndex + 1];
        }

        let profile = this.userProfile;
        if (db && userId) {
            try {
                profile = await fetchUserRecommendationContext(db, userId, localFallback);
                this.userProfile = profile;
            } catch (_) {}
        }

        const currentTrack = currentQueue[currentSongIndex] || null;
        const recentHistoryIds = recentHistory.map(s => s?.id || s).filter(Boolean);
        const upcomingQueueIds = new Set(currentQueue.slice(currentSongIndex + 1).map(s => s?.id).filter(Boolean));

        const nextTrack = getRecommendedTrack(this.librarySongs, profile, {
            currentTrack,
            recentHistoryIds,
            upcomingQueueIds,
            excludeCurrent: true
        });

        if (nextTrack) {
            currentQueue.push(nextTrack);
            if (idleAudio && nextTrack.src) {
                try {
                    idleAudio.src = nextTrack.src;
                    idleAudio.load();
                } catch (_) {}
            }
            return nextTrack;
        }

        return null;
    }
}
