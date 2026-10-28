import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Set up minimal DOM before importing audio-ads.js
document.body.innerHTML = `
    <div id="view-lyrics" style="display: none;"></div>
    <div id="fullscreen-player" style="display: none;"></div>
    <div id="lexi-ad-overlay" class="lexi-ad-overlay hidden" aria-hidden="true">
        <div class="lexi-ad-header">
            <button id="lexi-ad-close-btn" class="lexi-ad-close-btn"></button>
        </div>
        <div class="lexi-ad-orb-stage">
            <canvas id="lexi-ad-canvas" width="320" height="320"></canvas>
            <div class="lexi-ad-ring ring-1"></div>
            <div class="lexi-ad-ring ring-2"></div>
            <div class="lexi-ad-ring ring-3"></div>
            <div class="lexi-ad-orb" id="lexi-ad-orb"></div>
        </div>
        <div class="lexi-ad-footer">
            <span id="lexi-ad-current-time">0:00</span>
            <div class="lexi-ad-progress-track">
                <div id="lexi-ad-progress-fill" class="lexi-ad-progress-fill"></div>
            </div>
            <span id="lexi-ad-total-time">0:31</span>
        </div>
    </div>
    <audio id="medixly-ad-audio"></audio>
    <div id="player-song-title"></div>
    <div id="player-song-artist"></div>
    <img id="player-album-art">
    <div class="progress-bar"><div class="progress"></div></div>
    <button id="play-pause-btn"><span class="play-icon"></span><span class="pause-icon"></span></button>
    <button id="next-btn"></button>
    <button id="prev-btn"></button>
`;

// Stub HTMLMediaElement.prototype.play/pause and getContext for clean test execution
if (typeof window !== 'undefined') {
    if (window.HTMLMediaElement) {
        window.HTMLMediaElement.prototype.play = () => Promise.resolve();
        window.HTMLMediaElement.prototype.pause = () => {};
    }
    if (window.HTMLCanvasElement) {
        window.HTMLCanvasElement.prototype.getContext = () => null;
    }
}

import {
    audioAdManager,
    AD_AUDIO_SOURCES,
    STORAGE_KEY_LAST_INDEX,
    STORAGE_KEY_LAST_TIMESTAMP,
    STORAGE_KEY_SONGS_COUNT,
    SESSION_KEY_FIRST_PLAYED,
    FIFTEEN_MINUTES_MS
} from '../js/audio-ads.js';

describe('Audio Ad Manager & Alternation System', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        audioAdManager.resetForTesting();
        audioAdManager.init();
    });

    it('verifies both ad audio files exist on disk with valid file size (> 500KB)', () => {
        const ad1Path = path.join(ROOT_DIR, 'music/ads/ad-1.mp3');
        const ad2Path = path.join(ROOT_DIR, 'music/ads/ad-2.mp3');

        expect(fs.existsSync(ad1Path)).toBe(true);
        expect(fs.existsSync(ad2Path)).toBe(true);

        const stat1 = fs.statSync(ad1Path);
        const stat2 = fs.statSync(ad2Path);

        expect(stat1.size).toBeGreaterThan(500000);
        expect(stat2.size).toBeGreaterThan(500000);
    });

    it('triggers ad playback before a user plays a song (session start)', () => {
        // Initially no session ad has played
        expect(audioAdManager.isSessionAdPlayed()).toBe(false);
        expect(audioAdManager.shouldPlayAd('before_play')).toBe(true);
        expect(audioAdManager.shouldPlayAd('play_request')).toBe(true);
    });

    it('strictly alternates between the 2 ad audio files across triggers', () => {
        // Reset index to initial state
        localStorage.setItem(STORAGE_KEY_LAST_INDEX, '1');

        // 1st ad -> ad-1.mp3 (index 0)
        const firstAdSrc = audioAdManager.getNextAdSrc();
        expect(firstAdSrc).toBe('/music/ads/ad-1.mp3');
        expect(localStorage.getItem(STORAGE_KEY_LAST_INDEX)).toBe('0');

        // 2nd ad -> ad-2.mp3 (index 1)
        const secondAdSrc = audioAdManager.getNextAdSrc();
        expect(secondAdSrc).toBe('/music/ads/ad-2.mp3');
        expect(localStorage.getItem(STORAGE_KEY_LAST_INDEX)).toBe('1');

        // 3rd ad -> ad-1.mp3 (index 0)
        const thirdAdSrc = audioAdManager.getNextAdSrc();
        expect(thirdAdSrc).toBe('/music/ads/ad-1.mp3');
        expect(localStorage.getItem(STORAGE_KEY_LAST_INDEX)).toBe('0');

        // 4th ad -> ad-2.mp3 (index 1)
        const fourthAdSrc = audioAdManager.getNextAdSrc();
        expect(fourthAdSrc).toBe('/music/ads/ad-2.mp3');
        expect(localStorage.getItem(STORAGE_KEY_LAST_INDEX)).toBe('1');
    });

    it('triggers an ad after every 5 songs played', () => {
        // Simulate session ad already completed
        audioAdManager.setSessionAdPlayed(true);
        audioAdManager.setLastAdTimestamp(Date.now());
        audioAdManager.setSongsPlayedCount(0);

        // Before 5 songs: no ad
        for (let i = 1; i <= 4; i++) {
            audioAdManager.onSongCompleted();
            expect(audioAdManager.getSongsPlayedCount()).toBe(i);
            expect(audioAdManager.shouldPlayAd('next_song')).toBe(false);
        }

        // 5th song completes -> should trigger ad
        audioAdManager.onSongCompleted();
        expect(audioAdManager.getSongsPlayedCount()).toBe(5);
        expect(audioAdManager.shouldPlayAd('next_song')).toBe(true);

        // Simulating ad completion resets counter to 0
        audioAdManager.playAd(() => {});
        audioAdManager.completeAd();

        expect(audioAdManager.getSongsPlayedCount()).toBe(0);
        expect(audioAdManager.shouldPlayAd('next_song')).toBe(false);
    });

    it('triggers an ad after 15 minutes of listening', () => {
        // Simulate session ad played, and less than 5 songs played
        audioAdManager.setSessionAdPlayed(true);
        audioAdManager.setSongsPlayedCount(2);

        // Set last ad timestamp to 16 minutes ago
        const sixteenMinsAgo = Date.now() - (16 * 60 * 1000);
        audioAdManager.setLastAdTimestamp(sixteenMinsAgo);

        // Should trigger ad due to 15 min rule
        expect(audioAdManager.shouldPlayAd('next_song')).toBe(true);
        expect(audioAdManager.shouldPlayAd('play_request')).toBe(true);

        // Completing ad resets timestamp
        audioAdManager.playAd(() => {});
        audioAdManager.completeAd();

        const newTimestamp = audioAdManager.getLastAdTimestamp();
        expect(Date.now() - newTimestamp).toBeLessThan(1000);
        expect(audioAdManager.shouldPlayAd('next_song')).toBe(false);
    });

    it('exempts premium users from audio ads', () => {
        audioAdManager.setUser({ uid: 'test-user' }, true);
        expect(audioAdManager.isUserPremium()).toBe(true);

        // Even on session start, after 5 songs, or after 15 mins:
        audioAdManager.setSessionAdPlayed(false);
        audioAdManager.setSongsPlayedCount(10);
        audioAdManager.setLastAdTimestamp(Date.now() - (30 * 60 * 1000));

        expect(audioAdManager.shouldPlayAd('before_play')).toBe(false);
        expect(audioAdManager.shouldPlayAd('next_song')).toBe(false);
        expect(audioAdManager.shouldPlayAd('play_request')).toBe(false);
    });
});

describe('Lexi Orb Audio-Reactive Visualizer & Overlay', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        audioAdManager.resetForTesting();
        audioAdManager.init();

        const viewLyrics = document.getElementById('view-lyrics');
        const fsPlayer = document.getElementById('fullscreen-player');
        viewLyrics.style.display = 'none';
        fsPlayer.style.display = 'none';
    });

    it('detects when user is in lyrics or player views', () => {
        const viewLyrics = document.getElementById('view-lyrics');
        const fsPlayer = document.getElementById('fullscreen-player');

        expect(audioAdManager.isUserInLyricsOrPlayer()).toBe(false);

        // In lyrics
        viewLyrics.style.display = 'flex';
        expect(audioAdManager.isUserInLyricsOrPlayer()).toBe(true);
        viewLyrics.style.display = 'none';

        // In player
        fsPlayer.style.display = 'flex';
        expect(audioAdManager.isUserInLyricsOrPlayer()).toBe(true);
        fsPlayer.style.display = 'none';
    });

    it('switches to Lexi orb overlay with dim blue background when ad plays in lyrics or player', () => {
        const viewLyrics = document.getElementById('view-lyrics');
        viewLyrics.style.display = 'flex';

        const overlay = document.getElementById('lexi-ad-overlay');
        expect(overlay.classList.contains('visible')).toBe(false);

        // Start ad
        audioAdManager.playAd(() => {});

        expect(audioAdManager.isAdPlaying()).toBe(true);
        expect(overlay.classList.contains('visible')).toBe(true);
        expect(overlay.classList.contains('hidden')).toBe(false);
    });

    it('pulses the Lexi orb and rings based on audio energy', () => {
        const orb = document.getElementById('lexi-ad-orb');
        const ring1 = document.querySelector('.lexi-ad-ring.ring-1');

        // Test with high soundwave energy (e.g. vocal peak 0.8)
        audioAdManager.renderVisualizerFrame(0.8);

        // Scale should be > 1.25 on high energy
        expect(orb.style.transform).toContain('scale(');
        const scaleMatch = orb.style.transform.match(/scale\(([0-9.]+)\)/);
        expect(scaleMatch).toBeTruthy();
        const scaleVal = parseFloat(scaleMatch[1]);
        expect(scaleVal).toBeGreaterThan(1.2);

        // Box shadow should reflect cyan/blue glow
        expect(orb.style.boxShadow).toContain('56, 189, 248');

        // Ring 1 should expand and become more opaque
        expect(ring1.style.transform).toContain('scale(');
        expect(parseFloat(ring1.style.opacity)).toBeGreaterThan(0.6);
    });

    it('merges smoothly to the next song when ad finishes', (done) => {
        const overlay = document.getElementById('lexi-ad-overlay');
        overlay.classList.add('visible');

        let nextSongMerged = false;
        audioAdManager.playAd(() => {
            nextSongMerged = true;
        });

        // Complete ad
        audioAdManager.completeAd();

        // Merging class should be added for smooth cross-dissolve
        expect(overlay.classList.contains('merging')).toBe(true);
        expect(nextSongMerged).toBe(true);
        expect(audioAdManager.isAdPlaying()).toBe(false);
        done();
    });

    it('allows user to minimize overlay back to song table while ad finishes in background', () => {
        const viewLyrics = document.getElementById('view-lyrics');
        viewLyrics.style.display = 'flex';
        audioAdManager.playAd(() => {});

        const overlay = document.getElementById('lexi-ad-overlay');
        expect(overlay.classList.contains('visible')).toBe(true);

        audioAdManager.minimizeOverlay();

        expect(overlay.classList.contains('visible')).toBe(false);
        expect(viewLyrics.style.display).toBe('none');
        // Ad remains playing
        expect(audioAdManager.isAdPlaying()).toBe(true);
    });
});

describe('HTML & CSS Integration Integrity', () => {
    it('verifies medixly.html contains the Lexi ad overlay, audio element, and dim blue background styles in css/medixly.css', () => {
        const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
        const css = fs.readFileSync(path.join(ROOT_DIR, 'css/medixly.css'), 'utf8');

        // HTML checks
        expect(html).toContain('id="lexi-ad-overlay"');
        expect(html).toContain('id="lexi-ad-orb"');
        expect(html).toContain('id="lexi-ad-canvas"');
        expect(html).toContain('id="medixly-ad-audio"');
        expect(html).toContain('id="lexi-ad-close-btn"');

        // CSS checks for dim blue background & Lexi signature styling
        expect(css).toContain('.lexi-ad-overlay');
        expect(css).toContain('radial-gradient(circle at 50% 45%, #0d264f 0%, #061326 55%, #020712 100%)');
        expect(css).toContain('.lexi-ad-orb');
        expect(css).toContain('linear-gradient(135deg, #0a192f 0%, #1e40af 50%, #38bdf8 100%)');
    });
});
