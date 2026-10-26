import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dreams OG Trailer Integration & High Quality Verification', () => {
    const dtsHtml = fs.readFileSync(path.join(ROOT_DIR, 'dts.html'), 'utf8');
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    const trailerVideoPath = path.join(ROOT_DIR, 'video/dreams-trailer.mp4');

    it('verifies the new improved trailer file exists and has high quality file size (> 9MB)', () => {
        expect(fs.existsSync(trailerVideoPath)).toBe(true);
        const stats = fs.statSync(trailerVideoPath);
        // The new Premiere Pro Full HD export is ~9.99 MB (9,997,745 bytes)
        expect(stats.size).toBeGreaterThan(9_000_000);
        expect(stats.size).toBe(9997745);
    });

    it('ensures dts.html references the trailer modal, video source, and open triggers', () => {
        expect(dtsHtml).toContain('id="trailer-modal"');
        expect(dtsHtml).toContain('/video/dreams-trailer.mp4');
        expect(dtsHtml).toContain('open-trailer-trigger');
        expect(dtsHtml).toContain('DREAMS OG OFFICIAL TRAILER');
        expect(dtsHtml).toContain('modalVideo.load()');
    });

    it('ensures index.html references the trailer modal, video source, open triggers, and DTS background video', () => {
        expect(indexHtml).toContain('id="trailer-modal"');
        expect(indexHtml).toContain('/video/dreams-trailer.mp4');
        expect(indexHtml).toContain('open-trailer-trigger');
        expect(indexHtml).toContain('id="dts-watch-trailer-btn"');
        expect(indexHtml).toContain('DREAMS OG OFFICIAL TRAILER');
        expect(indexHtml).toContain('dts-bg-video');
        expect(indexHtml).toContain('Dreams OG Launch Trailer');
    });
});
