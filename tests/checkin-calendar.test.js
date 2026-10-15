import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Daily Check-in Streaks Calendar & Elytra Icon', () => {
    const ELYTRA_URL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6f/Elytra_JE2_BE2.png/revision/latest?cb=20230930213939';
    let accountHtml;
    let accountCss;

    beforeAll(() => {
        accountHtml = fs.readFileSync(path.join(ROOT_DIR, 'account.html'), 'utf-8');
        accountCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'account.css'), 'utf-8');
    });

    test('css/account.css positions Day 28 Netherite marker to the left to prevent overlap with Elytra', () => {
        const m28Match = accountCss.match(/\.mc-milestone-marker\.m-28\s*\{\s*left:\s*([0-9.]+)%;/);
        expect(m28Match).not.toBeNull();
        const leftPercent = parseFloat(m28Match[1]);
        // Previously it was 93.33%, which interfered with Day 30 at 100%. It should now be shifted to <= 85%
        expect(leftPercent).toBeLessThanOrEqual(85);
        expect(leftPercent).toBeGreaterThanOrEqual(75);
    });

    test('js/account.js getMinecraftItemSvg returns actual Elytra icon img with user specified URL', () => {
        const accountJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'account.js'), 'utf-8');
        expect(accountJs).toContain(ELYTRA_URL);
        expect(accountJs).toContain('case \'elytra\':');
        expect(accountJs).toMatch(/case 'elytra':[\s\S]*?<img src="https:\/\/static\.wikia\.nocookie\.net[\s\S]*?alt="Elytra"/);
        expect(accountJs).toContain('referrerpolicy="no-referrer"');
        expect(accountJs).toContain("this.src='images/elytra.png'");
    });

    test('account.html includes actual Elytra image in artifact showcase and calendar modal', () => {
        expect(accountHtml).toContain(ELYTRA_URL);
        expect(accountHtml).toMatch(/<div class="mc-milestone-marker m-30"[^>]*>[\s\S]*?Elytra[\s\S]*?<img[^>]*src="https:\/\/static\.wikia\.nocookie\.net/);
        expect(accountHtml).toMatch(/<span class="legend-item">[\s\S]*?<img[^>]*src="https:\/\/static\.wikia\.nocookie\.net[\s\S]*?30-Day Streak: Elytra/);
    });

    test('local fallback images/elytra.png exists and is non-empty', () => {
        const localElytraPath = path.join(ROOT_DIR, 'images', 'elytra.png');
        expect(fs.existsSync(localElytraPath)).toBe(true);
        const stats = fs.statSync(localElytraPath);
        expect(stats.size).toBeGreaterThan(500);
    });

    test('css/account.css styles Elytra and pixel icons with crisp pixelated rendering', () => {
        expect(accountCss).toContain('image-rendering: pixelated');
        expect(accountCss).toContain('.mc-marker-icon-img');
        expect(accountCss).toContain('.mc-legend-icon-img');
        expect(accountCss).toContain('.mc-item-icon-wrap img');
    });
});
