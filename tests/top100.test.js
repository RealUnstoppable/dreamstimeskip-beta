import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { librarySongs } from '../js/song-data.js';

describe('Medixly Top 100 Playlist and Songs', () => {
    it('should have exactly 100 songs tagged with top100', () => {
        const top100 = librarySongs.filter(s => s.tags && s.tags.includes('top100'));
        expect(top100.length).toBe(100);
    });

    it('should have properly ranked songs from 1 to 100 without duplicates', () => {
        const top100 = librarySongs
            .filter(s => s.tags && s.tags.includes('top100'))
            .sort((a, b) => a.rank - b.rank);

        expect(top100.length).toBe(100);
        for (let i = 0; i < 100; i++) {
            expect(top100[i].rank).toBe(i + 1);
        }
    });

    it('should have #1 Blinding Lights by The Weeknd', () => {
        const rank1 = librarySongs.find(s => s.rank === 1);
        expect(rank1).toBeDefined();
        expect(rank1.title).toBe('Blinding Lights');
        expect(rank1.artist).toBe('The Weeknd');
    });

    it('should have existing MP3 files on disk for all top 100 songs', () => {
        const top100 = librarySongs.filter(s => s.tags && s.tags.includes('top100'));
        
        for (const song of top100) {
            expect(song.src).toBeDefined();
            expect(typeof song.src).toBe('string');
            expect(song.src.startsWith('/music/')).toBe(true);

            const diskPath = path.join(process.cwd(), '.' + song.src);
            expect(fs.existsSync(diskPath)).toBe(true);
            const stats = fs.statSync(diskPath);
            expect(stats.size).toBeGreaterThan(10000);
        }
    });

    it('should have valid art, duration, and genre tags for all top 100 songs', () => {
        const top100 = librarySongs.filter(s => s.tags && s.tags.includes('top100'));
        
        for (const song of top100) {
            expect(song.art).toBeTruthy();
            expect(song.duration).toBeTruthy();
            expect(song.duration).not.toBe('N/A');
            expect(song.tags.length).toBeGreaterThanOrEqual(2);
        }
    });

    it('should include key viral and billboard hits in top 20', () => {
        const top20Titles = librarySongs
            .filter(s => s.tags && s.tags.includes('top100') && s.rank <= 20)
            .map(s => s.title);

        expect(top20Titles).toContain('Blinding Lights');
        expect(top20Titles).toContain('Sunflower');
        expect(top20Titles).toContain('Shape of You');
        expect(top20Titles).toContain('Billie Jean');
        expect(top20Titles).toContain('Not Like Us');
        expect(top20Titles).toContain("God's Plan");
        expect(top20Titles).toContain('Last Night');
        expect(top20Titles).toContain('7 rings');
    });
});
