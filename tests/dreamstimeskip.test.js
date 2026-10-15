import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dreams TimeSkip Launch Portal Integrity', () => {
    const filePath = path.join(ROOT_DIR, 'dreamstimeskip.html');
    const html = fs.readFileSync(filePath, 'utf8');

    it('contains the Phase Two Road to 2027 DTS launch section (#dts)', () => {
        expect(html).toContain('id="dts"');
        expect(html).toContain('class="video-hero-container"');
        expect(html).toContain('DREAMS TIMESKIP LAUNCH');
    });

    it('renders all three buttons in the DTS launch section with correct links and triggers', () => {
        // DTS Launch Section buttons
        expect(html).toContain('id="dts-join-waitlist-btn"');
        expect(html).toContain('Claim Founder Whitelist');
        expect(html).toContain('id="dts-join-discord-btn"');
        expect(html).toContain('mc-btn-discord');
        expect(html).toContain('https://discord.gg/aYuEdG9Gh7');
        expect(html).toContain('id="dts-whats-new-btn"');
        expect(html).toContain('new-dts.html');
        expect(html).toContain("What's New in DTS");
    });

    it('contains valid CSS definitions for Discord 3D button and pointer-events layering', () => {
        expect(html).toContain('.mc-btn-discord');
        expect(html).toContain('#5865F2');
        expect(html).toContain('pointer-events: none');
        expect(html).toContain('.hero-buttons .mc-btn');
    });
});
