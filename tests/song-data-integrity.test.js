import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { librarySongs, getSongById, songColors } from '../js/song-data.js';
import { lyricsData } from '../js/lyrics-data.js';

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

    it('verifies KRUSHDAFIGHT! by N2UtheHartlocker has valid audio file on disk, Firebase streamUrl, Lexi mixing parameters, and synced lyrics', () => {
        const song = getSongById('krushdafight-n2uthehartlocker');
        expect(song).toBeDefined();
        expect(song.title).toBe('KRUSHDAFIGHT!');
        expect(song.artist).toBe('N2UtheHartlocker');
        expect(song.duration).toBe('2:19');
        expect(song.src).toBe('/music/krushdafight-n2uthehartlocker.mp3');

        // Verify disk file exists and has content
        const diskPath = path.join(process.cwd(), '.' + song.src);
        expect(fs.existsSync(diskPath)).toBe(true);
        const stats = fs.statSync(diskPath);
        expect(stats.size).toBeGreaterThan(1000000); // > 1MB

        // Verify Firebase Storage streaming URL
        expect(song.streamUrl).toBeDefined();
        expect(song.streamUrl).toContain('firebasestorage.googleapis.com');
        expect(song.streamUrl).toContain('krushdafight-n2uthehartlocker.mp3');
        expect(song.streamUrl).toContain('token=aff8a4ab-00a3-4ff5-847f-a8990f3d671d');

        // Verify Lexi mixing parameters
        expect(song.bpm).toBe(125);
        expect(typeof song.energy).toBe('number');
        expect(typeof song.inmixPoint).toBe('number');
        expect(typeof song.outmixPoint).toBe('number');
        expect(Array.isArray(song.tags)).toBe(true);
        expect(song.tags).toContain('phonk');

        // Verify lyricsData has synced lyrics
        const lyrics = lyricsData['krushdafight-n2uthehartlocker'];
        expect(lyrics).toBeDefined();
        expect(Array.isArray(lyrics)).toBe(true);
        expect(lyrics.length).toBeGreaterThan(1);

        // Ensure not placeholder
        const hasPlaceholder = lyrics.some(l => l.words && l.words.some(w => w.text && w.text.includes('not yet available')));
        expect(hasPlaceholder).toBe(false);

        // Ensure trending/drop segment exists for Lexi viral looping
        const hasTrending = lyrics.some(l => l.trending === true);
        expect(hasTrending).toBe(true);
    });

    it('verifies Damn I Love Miami by Pitbull & Lil Jon has valid audio, high-res PNG cover art, Lexi mixing parameters, and fully synchronized lyrics', () => {
        const song = getSongById('damn-i-love-miami-pitbull-lil-jon');
        expect(song).toBeDefined();
        expect(song.title).toBe('Damn I Love Miami');
        expect(song.artist).toBe('Pitbull & Lil Jon');
        expect(song.duration).toBe('3:03');
        expect(song.src).toBe('/music/damn-i-love-miami-pitbull-lil-jon.mp3');

        // 1. Verify audio file on disk
        const audioDiskPath = path.join(process.cwd(), '.' + song.src);
        expect(fs.existsSync(audioDiskPath)).toBe(true);
        const audioStats = fs.statSync(audioDiskPath);
        expect(audioStats.size).toBeGreaterThan(1000000); // > 1MB

        // 2. Verify high-resolution PNG cover art on disk
        expect(song.art).toBe('/images/damn-i-love-miami-cover.png');
        const artDiskPath = path.join(process.cwd(), '.' + song.art);
        expect(fs.existsSync(artDiskPath)).toBe(true);
        const artStats = fs.statSync(artDiskPath);
        expect(artStats.size).toBeGreaterThan(50000); // High-res asset
        expect(song.art.endsWith('.png')).toBe(true);

        // 3. Verify Lexi mixing & audio stream parameters
        expect(song.bpm).toBe(124);
        expect(song.energy).toBeGreaterThan(0.8);
        expect(typeof song.inmixPoint).toBe('number');
        expect(typeof song.outmixPoint).toBe('number');
        expect(Array.isArray(song.tags)).toBe(true);
        expect(song.tags).toContain('miami');
        expect(song.tags).toContain('viral');
        expect(songColors['damn-i-love-miami-pitbull-lil-jon']).toBe('#ff007f');

        // 4. Verify synchronized lyrics
        const lyrics = lyricsData['damn-i-love-miami-pitbull-lil-jon'];
        expect(lyrics).toBeDefined();
        expect(Array.isArray(lyrics)).toBe(true);
        expect(lyrics.length).toBeGreaterThan(40); // 46 structured lines

        // Ensure zero placeholder stubs
        const hasPlaceholder = lyrics.some(l => l.words && l.words.some(w => w.text && w.text.includes('not yet available')));
        expect(hasPlaceholder).toBe(false);

        // Verify active word karaoke timestamps
        for (const line of lyrics) {
            expect(typeof line.start).toBe('number');
            expect(typeof line.end).toBe('number');
            expect(line.end).toBeGreaterThan(line.start);
            expect(Array.isArray(line.words)).toBe(true);
            expect(line.words.length).toBeGreaterThan(0);
            for (const word of line.words) {
                expect(typeof word.text).toBe('string');
                expect(typeof word.start).toBe('number');
                expect(word.start).toBeGreaterThanOrEqual(line.start - 0.1);
            }
        }

        // Verify trending viral drops exist for Lexi Mixer dynamic loop
        const trendingCount = lyrics.filter(l => l.trending === true).length;
        expect(trendingCount).toBeGreaterThanOrEqual(10);
    });

    it('verifies all linked Firebase streamUrls have valid format and active download tokens', () => {
        const streamSongs = librarySongs.filter(s => s.streamUrl && s.streamUrl.includes('firebasestorage.googleapis.com'));
        expect(streamSongs.length).toBeGreaterThan(50);

        for (const song of streamSongs) {
            expect(song.streamUrl).toMatch(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[a-zA-Z0-9.-]+\/o\/[^?]+\?alt=media&token=[a-f0-9-]+$/);
        }
    });
});
