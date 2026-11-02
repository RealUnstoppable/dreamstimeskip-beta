import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dreams & Dreams OG Realm Gallery System Integrity', () => {
    const galleryHtmlPath = path.join(ROOT_DIR, 'gallery.html');
    const dtsHtmlPath = path.join(ROOT_DIR, 'dts.html');

    it('verifies gallery.html exists and shares dts.html design system & fonts', () => {
        expect(fs.existsSync(galleryHtmlPath)).toBe(true);
        const html = fs.readFileSync(galleryHtmlPath, 'utf8');

        // Font & theme integrity
        expect(html).toContain('Press Start 2P');
        expect(html).toContain('Silkscreen');
        expect(html).toContain('/css/style.css');
        expect(html).toContain('/css/themes.css');
        expect(html).toContain('--mc-green: #3c8527');
        expect(html).toContain('--mc-red: #c52828');
        expect(html).toContain('--mc-dark-bg: #121417');
    });

    it('verifies the gallery control bar has a Back button to the left of the 3 buttons', () => {
        const html = fs.readFileSync(galleryHtmlPath, 'utf8');

        // Back button to the left
        const backBtnIndex = html.indexOf('id="gallery-back-btn"');
        const dreamsBtnIndex = html.indexOf('id="tab-btn-dreams"');
        const dreamsOgBtnIndex = html.indexOf('id="tab-btn-dreams-og"');
        const timeSkipBtnIndex = html.indexOf('id="tab-btn-timeskip"');

        expect(backBtnIndex).toBeGreaterThan(-1);
        expect(dreamsBtnIndex).toBeGreaterThan(backBtnIndex);
        expect(dreamsOgBtnIndex).toBeGreaterThan(dreamsBtnIndex);
        expect(timeSkipBtnIndex).toBeGreaterThan(dreamsOgBtnIndex);

        // Check button attributes & styles
        expect(html).toContain('href="/dts.html" class="mc-btn mc-btn-stone" id="gallery-back-btn"');
        expect(html).toContain('class="mc-btn mc-btn-red mc-gallery-tab" id="tab-btn-dreams"');
        expect(html).toContain('class="mc-btn mc-btn-green mc-gallery-tab');
        expect(html).toContain('class="mc-btn mc-btn-disabled" id="tab-btn-timeskip" disabled');
    });

    it('verifies dts.html contains the End Portal opens header, purple countdown, and gallery section', () => {
        const dtsHtml = fs.readFileSync(dtsHtmlPath, 'utf8');

        // Header and purple countdown in OG section
        expect(dtsHtml).toContain('<h1>End Portal opens 12:00 AM wednesday 4 2026</h1>');
        expect(dtsHtml).toContain('countdown-purple');
        expect(dtsHtml).toContain('background-image: url(\'/images/end-portal.jpg\');');
        expect(dtsHtml).toContain('new Countdown("2026-11-04T00:00:00-05:00", "countdown-1")');

        // Gallery section under End opening & Dreams OG
        expect(dtsHtml).toContain('id="realm-gallery"');
        expect(dtsHtml).toContain('id="hub-gallery-dreams"');
        expect(dtsHtml).toContain('id="hub-gallery-dreams-og"');
        expect(dtsHtml).toContain('id="hub-gallery-dreams-timeskip"');
        expect(dtsHtml).toContain('href="gallery.html?gallery=dreams"');
        expect(dtsHtml).toContain('href="gallery.html?gallery=dreams-og"');
    });

    it('verifies all 10 Dreams OG screenshots and thumbnails exist on disk', () => {
        const ogFiles = [
            '2026-10-20_19.06.49',
            '2026-10-20_20.59.25',
            '2026-10-20_21.00.36',
            '2026-10-20_21.01.05',
            '2026-10-20_21.01.13',
            '2026-10-21_19.18.37',
            '2026-10-21_19.18.52',
            '2026-10-21_19.19.01',
            '2026-10-21_19.19.11',
            '2026-10-22_18.35.44'
        ];

        ogFiles.forEach(file => {
            const pngPath = path.join(ROOT_DIR, 'images', 'gallery', 'dreams-og', `${file}.png`);
            const thumbPath = path.join(ROOT_DIR, 'images', 'gallery', 'thumbs', 'dreams-og', `${file}.jpg`);
            expect(fs.existsSync(pngPath)).toBe(true);
            expect(fs.existsSync(thumbPath)).toBe(true);
        });
    });

    it('verifies all 13 Dreams screenshots and thumbnails exist on disk', () => {
        const dreamsFiles = [
            '2026-10-13_22.49.41',
            '2026-10-15_03.09.38',
            '2026-10-15_03.09.53',
            '2026-10-15_03.10.45',
            '2026-10-15_03.11.15',
            '2026-10-15_03.11.54',
            '2026-10-15_03.12.05',
            '2026-10-15_03.12.18',
            '2026-10-15_03.12.24',
            '2026-10-15_03.12.47',
            '2026-10-15_03.13.08',
            '2026-10-15_03.13.22',
            '2026-10-15_03.13.51'
        ];

        dreamsFiles.forEach(file => {
            const pngPath = path.join(ROOT_DIR, 'images', 'gallery', 'dreams', `${file}.png`);
            const thumbPath = path.join(ROOT_DIR, 'images', 'gallery', 'thumbs', 'dreams', `${file}.jpg`);
            expect(fs.existsSync(pngPath)).toBe(true);
            expect(fs.existsSync(thumbPath)).toBe(true);
        });
    });

    it('verifies user uploaded End Portal background image exists in project', () => {
        const portalImgPath = path.join(ROOT_DIR, 'images', 'end-portal.jpg');
        expect(fs.existsSync(portalImgPath)).toBe(true);
        expect(fs.statSync(portalImgPath).size).toBeGreaterThan(10000);
    });

    it('includes accessible Lightbox dialog with navigation and download options', () => {
        const html = fs.readFileSync(galleryHtmlPath, 'utf8');
        expect(html).toContain('<dialog id="mc-lightbox-dialog"');
        expect(html).toContain('id="lightbox-prev-btn"');
        expect(html).toContain('id="lightbox-next-btn"');
        expect(html).toContain('id="lightbox-download-btn"');
        expect(html).toContain('id="lightbox-close-btn"');
    });

    it('provides gallery-dreams.html and gallery-og.html redirect helpers', () => {
        const dreamsRedirectPath = path.join(ROOT_DIR, 'gallery-dreams.html');
        const ogRedirectPath = path.join(ROOT_DIR, 'gallery-og.html');

        expect(fs.existsSync(dreamsRedirectPath)).toBe(true);
        expect(fs.existsSync(ogRedirectPath)).toBe(true);

        const dreamsContent = fs.readFileSync(dreamsRedirectPath, 'utf8');
        const ogContent = fs.readFileSync(ogRedirectPath, 'utf8');

        expect(dreamsContent).toContain('url=/gallery.html?gallery=dreams');
        expect(ogContent).toContain('url=/gallery.html?gallery=dreams-og');
    });
});
