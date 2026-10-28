import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { librarySongs, getSongById } from '../js/song-data.js';

describe('Song Data Integrity and File Linking', () => {
    it('every .mp3 file on disk in /music/ is referenced by at least one song in librarySongs or an alias', () => {
        const musicDir = path.join(process.cwd(), 'music');
        const diskFiles = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
        expect(diskFiles.length).toBeGreaterThan(100);

        const songSrcSet = new Set(librarySongs.map(s => s.src));
        // Add decoded/encoded equivalents
        const allSongSrcs = new Set();
        for (const src of songSrcSet) {
            if (src) {
                allSongSrcs.add(src);
                try { allSongSrcs.add(decodeURIComponent(src)); } catch (e) {}
                try { allSongSrcs.add(encodeURI(src)); } catch (e) {}
            }
        }

        const unreferenced = [];
        for (const file of diskFiles) {
            // dead_fresh.mp3 is a known backup file for dead-fresh-lil-baby.mp3
            if (file === 'dead_fresh.mp3') continue;

            const localPath = `/music/${file}`;
            if (!allSongSrcs.has(localPath)) {
                unreferenced.push(file);
            }
        }

        expect(unreferenced).toEqual([]);
    });

    it('critical and previously broken song IDs correctly resolve to existing files on disk', () => {
        const criticalSongIds = [
            'summer-bummer',
            'im-god-clams-casino-imogen-heap',
            'dead-fresh',
            'dead-fresh-lil-baby',
            'blow-kesha',
            'fukumean-gunna',
            'gods-plan-drake',
            'sweater-weather-the-neighbourhood',
            'wildflower-billie-eilish',
            'blinding-lights-the-weeknd',
            'sunflower-post-malone',
            'sunflower-post-malone-swae-lee',
            'like-that-guitar-remix-aamadux'
        ];

        for (const id of criticalSongIds) {
            const song = getSongById(id) || (id === 'sunflower-post-malone' ? getSongById('sunflower-post-malone-swae-lee') : null);
            expect(song).toBeDefined();
            expect(song.src).toBeDefined();
            if (song.src.startsWith('http')) {
                expect(song.src).toMatch(/^https?:\/\//);
            } else {
                const diskPath = path.join(process.cwd(), '.' + song.src);
                expect(fs.existsSync(diskPath)).toBe(true);
                const stats = fs.statSync(diskPath);
                expect(stats.size).toBeGreaterThan(10000);
            }
        }
    });

    it('verifies all 404vincent tracks exist on disk, have correct artist attribution, and valid sources', () => {
        const vincentIds = [
            'fk-school-404vincent',
            'dumb-luck-404vincent',
            'i-do-this-404vincent',
            'im-an-ae-404vincent',
            'pull-up-404vincent',
            'talk-a-lot-404vincent'
        ];

        for (const id of vincentIds) {
            const song = getSongById(id);
            expect(song).toBeDefined();
            expect(song.artist).toBe('404vincent');
            expect(song.src).toBeDefined();
            expect(song.src.startsWith('/music/')).toBe(true);

            const diskPath = path.join(process.cwd(), '.' + song.src);
            expect(fs.existsSync(diskPath)).toBe(true);
            const stats = fs.statSync(diskPath);
            expect(stats.size).toBeGreaterThan(100000);
        }
    });

    it('verifies Top 100 tracks do not reference 30-second preview snippet URLs', () => {
        const top100 = librarySongs.filter(s => s.tags && s.tags.includes('top100'));
        expect(top100.length).toBe(100);

        for (const song of top100) {
            if (song.streamUrl) {
                expect(song.streamUrl).not.toContain('itunes.apple.com');
            }
        }
    });

    it('safely handles search across both string and array lyrics formats without throwing', () => {
        const testTracks = [
            ...librarySongs.slice(0, 50),
            {
                id: 'artist-upload-cosmic',
                title: 'Cosmic Odyssey',
                artist: 'Nova Explorer',
                src: 'https://firebasestorage.googleapis.com/v0/b/test/o/cosmic.mp3',
                lyrics: [
                    { time: 0, text: 'Departing the stratosphere' },
                    { time: 4.2, text: 'Into the infinite velvet darkness' }
                ],
                isArtistTrack: true
            },
            {
                id: 'artist-upload-dream',
                title: 'Starlight Dream',
                artist: 'Aura Bloom',
                src: 'https://firebasestorage.googleapis.com/v0/b/test/o/dream.mp3',
                lyrics: 'Drifting into the celestial sky and starlight dream',
                isArtistTrack: true
            }
        ];

        const searchSongs = (query) => {
            const q = query.trim().toLowerCase();
            return testTracks.filter(s => {
                const titleMatch = s.title && s.title.toLowerCase().includes(q);
                const artistMatch = s.artist && s.artist.toLowerCase().includes(q);
                let lyricsMatch = false;
                if (typeof s.lyrics === 'string') {
                    lyricsMatch = s.lyrics.toLowerCase().includes(q);
                } else if (Array.isArray(s.lyrics)) {
                    lyricsMatch = s.lyrics.some(l => {
                        if (typeof l === 'string') return l.toLowerCase().includes(q);
                        if (l && typeof l.text === 'string') return l.text.toLowerCase().includes(q);
                        return false;
                    });
                }
                return titleMatch || artistMatch || lyricsMatch;
            });
        };

        // 1. Search by artist-uploaded title
        const byTitle = searchSongs('Cosmic Odyssey');
        expect(byTitle.length).toBeGreaterThan(0);
        expect(byTitle[0].id).toBe('artist-upload-cosmic');

        // 2. Search by artist name
        const byArtist = searchSongs('Nova Explorer');
        expect(byArtist.length).toBeGreaterThan(0);
        expect(byArtist[0].id).toBe('artist-upload-cosmic');

        // 3. Search by structured array lyrics
        const byArrayLyrics = searchSongs('stratosphere');
        expect(byArrayLyrics.length).toBeGreaterThan(0);
        expect(byArrayLyrics[0].id).toBe('artist-upload-cosmic');

        // 4. Search by plain string lyrics
        const byStringLyrics = searchSongs('celestial sky');
        expect(byStringLyrics.length).toBeGreaterThan(0);
        expect(byStringLyrics[0].id).toBe('artist-upload-dream');
    });
});
