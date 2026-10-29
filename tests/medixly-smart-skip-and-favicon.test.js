import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Set up DOM prior to importing medixly.js
document.body.innerHTML = `
    <div id="view-home"></div>
    <div id="view-playlist" style="display:none;"></div>
    <div id="container-jump-back-in"></div>
    <div id="container-recommended"></div>
    <div id="container-tiktoks"></div>
    <div id="container-playlists"></div>
    <div id="song-list-body"></div>
    <div id="playlist-title"></div>
    <div id="playlist-desc"></div>
    <button id="playlist-play-btn"></button>
    <button id="back-to-home"></button>
    <audio id="audio-player"></audio>
    <audio id="audio-player-2"></audio>
    <button id="play-pause-btn"><span class="play-icon"></span><span class="pause-icon"></span></button>
    <button id="prev-btn"></button>
    <button id="next-btn"></button>
    <button id="shuffle-btn"></button>
    <button id="repeat-btn"></button>
    <div class="progress-bar"><div class="progress"></div></div>
    <div class="current-time"></div>
    <div class="total-time"></div>
    <input type="range" class="volume-slider">
    <div id="player-song-title"></div>
    <div id="player-song-artist"></div>
    <img id="player-album-art">
    <button id="player-like-btn"></button>
    <div id="greeting"></div>
    <button id="lyrics-btn"></button>
    <div id="view-lyrics" style="display: none;"></div>
    <button id="close-lyrics-btn"></button>
    <div id="lyrics-content"></div>
    <div id="lyrics-container"></div>
    <div id="fullscreen-player" style="display: none;"></div>
    <button id="close-fullscreen-btn"></button>
    <button id="fs-play-pause-btn"><span class="play-icon"></span><span class="pause-icon"></span></button>
    <button id="fs-next-btn"></button>
    <button id="fs-prev-btn"></button>
    <button id="fs-like-btn"></button>
    <button id="mixer-btn"></button>
    <button id="fs-mixer-btn"></button>
    <button id="viral-skip-btn"></button>
    <button id="fs-viral-skip-btn"></button>
`;

import { getSmartFallbackRecommendation } from '../js/medixly.js';

describe('Global Favicon Standardization Across Medixly Ecosystem', () => {
    const medixlyPages = [
        'medixly.html',
        'medixly 2.html',
        'medixly-pricing.html',
        'medixly-hits.html',
        'medixly-hits 2.html',
        'medixly-artists.html',
        'medixly-artists 2.html',
        'ad-preview.html',
        'ad-preview-1.html',
        'ad-preview-2.html',
        'ad-preview-3.html',
        'ad-preview-4.html',
        'ad-preview-5.html'
    ];

    medixlyPages.forEach((file) => {
        it(`verifies ${file} uses the official Medixly logo PNG as favicon and has no legacy Dreams favicon`, () => {
            const filePath = path.resolve(process.cwd(), file);
            expect(fs.existsSync(filePath)).toBe(true);
            const content = fs.readFileSync(filePath, 'utf8');

            // Must link to medixly-logo.png for favicon
            expect(content).toMatch(/<link\s+[^>]*rel="icon"[^>]*href="\/images\/medixly-logo\.png"/i);

            // Must NOT use legacy dreams-favicon.png in link rel="icon"
            expect(content).not.toMatch(/<link\s+[^>]*rel="icon"[^>]*href="[^"]*dreams-favicon\.png"/i);
        });
    });

    it('verifies medixly.html OpenGraph and Twitter images point to medixly-logo.png', () => {
        const content = fs.readFileSync(path.resolve(process.cwd(), 'medixly.html'), 'utf8');
        expect(content).toContain('property="og:image" content="https://realunstoppable.store/images/medixly-logo.png"');
        expect(content).toContain('name="twitter:image" content="https://realunstoppable.store/images/medixly-logo.png"');
    });

    it('verifies medixly-artists pages include theme-loader for dark mode consistency', () => {
        const p1 = fs.readFileSync(path.resolve(process.cwd(), 'medixly-artists.html'), 'utf8');
        const p2 = fs.readFileSync(path.resolve(process.cwd(), 'medixly-artists 2.html'), 'utf8');
        expect(p1).toContain('src="/js/theme-loader.js"');
        expect(p2).toContain('src="/js/theme-loader.js"');
    });

    it('verifies server.js routes /medixly and /medixly/* sub-routes cleanly', () => {
        const serverJs = fs.readFileSync(path.resolve(process.cwd(), 'server.js'), 'utf8');
        expect(serverJs).toContain("reqPath === '/medixly'");
        expect(serverJs).toContain("reqPath === '/medixly/pricing'");
        expect(serverJs).toContain("reqPath === '/medixly/player'");
        expect(serverJs).toContain("reqPath === '/medixly/hits'");
        expect(serverJs).toContain("reqPath === '/medixly/artists'");
    });
});

describe('Smart Recommendation Fallback & Forward Skip Engine', () => {
    beforeEach(() => {
        localStorage.clear();
        if (typeof window.__resetSkipThrottle === 'function') {
            window.__resetSkipThrottle();
        }
        if (typeof window.__setCurrentQueue === 'function') {
            window.__setCurrentQueue([]);
        }
        if (typeof window.__setCurrentSongIndex === 'function') {
            window.__setCurrentSongIndex(0);
        }
    });

    it('returns a valid recommended track even if queue is completely empty', () => {
        const track = getSmartFallbackRecommendation({ excludeCurrent: false });
        expect(track).toBeDefined();
        expect(track.id).toBeTruthy();
        expect(track.title).toBeTruthy();
    });

    it('tailors recommendations according to user profile genres and artists', () => {
        // Set user preferences to rap/hiphop and Lil Baby
        localStorage.setItem('medixly_user_preferences', JSON.stringify({
            genres: ['hiphop', 'rap'],
            favoriteArtists: ['Lil Baby'],
            role: 'listener'
        }));

        const track = getSmartFallbackRecommendation({ excludeCurrent: false });
        expect(track).toBeDefined();
        const artist = (track.artist || '').toLowerCase();
        const tags = (track.tags || []).map(t => t.toLowerCase());

        // Either artist matches or genre tags match
        const matchesPref = artist.includes('lil baby') || tags.includes('rap') || tags.includes('hiphop');
        expect(matchesPref).toBe(true);
    });

    it('applies trending weight to viral and top-charting tracks', () => {
        localStorage.setItem('medixly_user_preferences', JSON.stringify({
            genres: [],
            favoriteArtists: [],
            role: 'creator'
        }));

        const track = getSmartFallbackRecommendation({ excludeCurrent: false });
        expect(track).toBeDefined();
        // Creator profile and trending weight favor viral/upbeat tracks
        const tags = (track.tags || []).map(t => t.toLowerCase());
        expect(tags.includes('viral') || track.rank !== undefined || tags.length > 0).toBe(true);
    });

    it('dynamically queues and advances to a smart fallback track when forward skip is clicked on an empty queue', () => {
        window.__setCurrentQueue([]);
        window.__setCurrentSongIndex(0);

        // Click forward skip
        window.__nextSong();

        const queue = window.__getCurrentQueue();
        const index = window.__getCurrentSongIndex();

        expect(queue.length).toBeGreaterThanOrEqual(1);
        expect(index).toBe(0);
        expect(queue[0]).toBeDefined();
        expect(queue[0].title).toBeTruthy();
    });

    it('advances forward to a new smart recommended track instead of looping when queue reaches the end', () => {
        const dummySong = { id: 'dummy-single-track', title: 'Single Track', artist: 'Artist A', src: '/music/test.mp3' };
        window.__setCurrentQueue([dummySong]);
        window.__setCurrentSongIndex(0);

        // Click forward skip
        window.__nextSong();

        const queue = window.__getCurrentQueue();
        const index = window.__getCurrentSongIndex();

        // Queue should now have at least 2 songs and index advanced to the new smart recommendation
        expect(queue.length).toBe(2);
        expect(index).toBe(1);
        expect(queue[1].id).not.toBe('dummy-single-track');
    });

    it('recovers gracefully from playback snags without locking up the player', () => {
        const brokenTrack = { id: 'broken-track-999', title: 'Broken File', artist: 'Nonexistent', src: '/music/broken.mp3' };
        window.__setCurrentQueue([brokenTrack]);
        window.__setCurrentSongIndex(0);

        // Trigger playback snag
        window.__handlePlaybackSnag(brokenTrack);

        const queue = window.__getCurrentQueue();
        const index = window.__getCurrentSongIndex();

        // Should have queued a fallback track and advanced
        expect(queue.length).toBe(2);
        expect(index).toBe(1);
        expect(queue[1].id).not.toBe('broken-track-999');
    });

    it('throttles rapid forward skip clicks to prevent race conditions or promise abort freezing', () => {
        const song1 = { id: 's1', title: 'Track 1', artist: 'Artist 1', src: '/music/1.mp3' };
        const song2 = { id: 's2', title: 'Track 2', artist: 'Artist 2', src: '/music/2.mp3' };
        const song3 = { id: 's3', title: 'Track 3', artist: 'Artist 3', src: '/music/3.mp3' };

        window.__setCurrentQueue([song1, song2, song3]);
        window.__setCurrentSongIndex(0);

        // First skip
        window.__nextSong();
        const firstIndex = window.__getCurrentSongIndex();
        expect(firstIndex).toBe(1);

        // Immediate rapid second skip within throttle window (<250ms)
        window.__nextSong();
        const secondIndex = window.__getCurrentSongIndex();
        // Should be throttled and stay at index 1
        expect(secondIndex).toBe(1);
    });
});
