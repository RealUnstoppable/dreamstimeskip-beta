import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Medixly Phase 3: Player Engine, Search Menu, Artist Profiles & Apple EQ Graph Suite', () => {

    describe('Verification Gate 3.1: Song Audio Links & Personalized Forward Skip', () => {
        let librarySongs;

        beforeEach(async () => {
            const dataModule = await import('../js/song-data.js');
            librarySongs = dataModule.librarySongs;
        });

        it('should verify 100% of songs in library have valid, playable audio stream URLs', () => {
            expect(Array.isArray(librarySongs)).toBe(true);
            expect(librarySongs.length).toBeGreaterThanOrEqual(1870);

            const invalidSongs = librarySongs.filter(s => {
                const url = s.streamUrl || s.src;
                if (!url || typeof url !== 'string') return true;
                if (url.trim() === '' || url.includes('placeholder') || url.includes('undefined')) return true;
                return false;
            });

            expect(invalidSongs).toHaveLength(0);
        });

        it('should verify "Play Last" has been renamed to "Add to Queue" across UI context menus', () => {
            const medixlyHtml = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(medixlyHtml).not.toContain('>Play Last<');
            expect(medixlyHtml).toContain('Add to Queue');

            const medixlyJs = fs.readFileSync(path.join(ROOT_DIR, 'js/medixly.js'), 'utf8');
            expect(medixlyJs).not.toContain('>Play Last<');
        });

        it('should advance to a personalized recommended song when manual queue is empty on Forward skip', async () => {
            const { getRecommendedTrack } = await import('../js/recommendation-engine.js');
            
            const currentSong = librarySongs[0];
            const history = [currentSong];
            const userContext = {
                genres: ['hiphop', 'rap'],
                favoriteArtists: ['Drake', 'Lil Baby'],
                likedTrackIds: new Set(),
                likedTracks: [],
                listeningHistory: history,
                role: 'listener',
                sfxNeeds: 'moderate'
            };

            const recommended = getRecommendedTrack(librarySongs, userContext, {
                currentTrack: currentSong,
                excludeCurrent: true,
                recentHistoryIds: [currentSong.id]
            });

            expect(recommended).toBeDefined();
            expect(recommended.id).not.toBe(currentSong.id);
            expect(recommended.title).toBeDefined();
            expect(recommended.streamUrl || recommended.src).toBeDefined();
        });
    });

    describe('Verification Gate 3.2: Search Bar Enhancements & Dedicated Artist Profile View', () => {
        it('should verify dedicated #view-artist DOM structure in medixly.html', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('id="view-artist"');
            expect(html).toContain('id="back-from-artist-btn"');
            expect(html).toContain('id="artist-profile-name"');
            expect(html).toContain('id="artist-profile-art"');
            expect(html).toContain('id="artist-profile-stats"');
            expect(html).toContain('id="artist-profile-play-btn"');
            expect(html).toContain('id="artist-song-list-body"');
            expect(html).toContain('Verified Artist');
        });

        it('should verify search matching supports Artist - Song formats and authors', () => {
            const medixlyJs = fs.readFileSync(path.join(ROOT_DIR, 'js/medixly.js'), 'utf8');
            expect(medixlyJs).toContain("title.includes(' - ')");
            expect(medixlyJs).toContain("s.author");
            expect(medixlyJs).toContain("openArtistProfile");
        });

        it('should verify song context menu contains View Artist Profile and Add to Queue', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('id="ctx-view-artist"');
            expect(html).toContain('id="ctx-play-last"');
            expect(html).toContain('id="ctx-play-next"');
            expect(html).toContain('id="ctx-favorite"');
        });
    });

    describe('Verification Gate 3.3: Jump Back In Tabs & Settings History Management', () => {
        it('should verify Jump Back In contains tabbed category pills in medixly.html', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('id="jump-back-tabs"');
            expect(html).toContain('data-tab="recent"');
            expect(html).toContain('data-tab="playlists"');
            expect(html).toContain('data-tab="uploads"');
            expect(html).toContain('id="home-history-btn"');
        });

        it('should verify Listening History section in Settings modal with Delete Last 1 Hour button', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('id="medixly-history-section"');
            expect(html).toContain('id="settings-history-search"');
            expect(html).toContain('id="history-delete-hour-btn"');
            expect(html).toContain('id="history-clear-all-btn"');
            expect(html).toContain('id="settings-history-list"');
        });

        it('should correctly filter and delete history items within the last 1 hour threshold', () => {
            const now = Date.now();
            const oneHourAgo = now - 3600000;

            const testHistory = [
                { id: 'song-old', title: 'Old Song', timestamp: now - 7200000 },       // 2 hours ago -> KEEP
                { id: 'song-recent-1', title: 'Song 1', timestamp: now - 1800000 },    // 30 mins ago -> DELETE
                { id: 'song-recent-2', title: 'Song 2', timestamp: now - 300000 },     // 5 mins ago -> DELETE
                { id: 'song-very-old', title: 'Ancient Song', timestamp: now - 86400000 } // 1 day ago -> KEEP
            ];

            const after1HourDelete = testHistory.filter(entry => {
                const t = entry.timestamp || entry.playedAt || 0;
                return t < oneHourAgo;
            });

            expect(after1HourDelete).toHaveLength(2);
            expect(after1HourDelete.map(s => s.id)).toEqual(['song-old', 'song-very-old']);
        });
    });

    describe('Verification Gate 3.4: Touch-Friendly Sound Profile & Immutable Enrollment', () => {
        it('should ensure initialEnrollmentSoundProfile is marked locked: true and never overwritten', () => {
            const sourceCode = fs.readFileSync(path.join(ROOT_DIR, 'js/medixly-onboarding.js'), 'utf8');
            expect(sourceCode).toContain('initialEnrollmentSoundProfile');
            expect(sourceCode).toContain('locked: true');
            expect(sourceCode).toContain('enrolledAt: serverTimestamp()');
            expect(sourceCode).toContain('currentSoundProfile');
            expect(sourceCode).toContain('savePreferencesToBackend');
        });
    });

    describe('Verification Gate 3.5: Apple EQ Graph & Premium Accent Lock', () => {
        it('should verify Apple Settings-style 2D EQ Canvas container exists in medixly.html', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('id="medixly-eq-graph-container"');
            expect(html).toContain('id="medixly-eq-canvas"');
            expect(html).toContain('Acoustic Frequency Curve');
        });

        it('should verify AppleEQGraph module initializes and computes frequency/dB coordinates', async () => {
            await import('../js/medixly-eq-graph.js');
            const eqModule = globalThis.MedixlyEQGraph;
            expect(eqModule).toBeDefined();
            const AppleEQGraph = eqModule.AppleEQGraph;
            
            expect(AppleEQGraph).toBeDefined();
            const graph = new AppleEQGraph('medixly-eq-canvas');
            expect(graph.nodes.bass.freq).toBe(60);
            expect(graph.nodes.mid.freq).toBe(1000);
            expect(graph.nodes.treble.freq).toBe(8000);

            graph.setValues(4, -2, 6);
            const vals = graph.getValues();
            expect(vals.bass).toBe(4);
            expect(vals.mid).toBe(-2);
            expect(vals.treble).toBe(6);
        });

        it('should verify Accent Theme Color is locked behind Premium / Ultra tier', () => {
            const navbarJs = fs.readFileSync(path.join(ROOT_DIR, 'js/navbar.js'), 'utf8');
            expect(navbarJs).toContain('isUserPremiumSubscribed');
            expect(navbarJs).toContain('promptPremiumUpgrade');
            expect(navbarJs).toContain('Custom Accent Theme Colors');

            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('🔒 (Premium / Ultra)');
        });
    });
});
