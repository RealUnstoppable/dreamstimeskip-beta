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

    it('renders the Pre-Launch Streak callout and button in the Everything New in OG section', () => {
        expect(html).toContain('Everything New in OG');
        expect(html).toContain('From custom biomes to revamped quests and new bosses, discover all the updates that make October 20 the ultimate OG experience.');
        expect(html).toContain('class="og-streak-callout"');
        expect(html).toContain('PRE-LAUNCH STREAK');
        expect(html).toContain('Start earning daily streaks before the server opens! All rewards will be received in-game on <strong>October 20th</strong>.');
        expect(html).toContain('id="og-unlock-streak-btn"');
        expect(html).toContain('Unlock Pre-Launch Streak');
    });

    it('positions the Unlock Pre-Launch Streak button strictly above the Learn More button in Card 2', () => {
        const cardStart = html.indexOf('Everything New in OG');
        expect(cardStart).toBeGreaterThan(-1);

        const streakBtnPos = html.indexOf('id="og-unlock-streak-btn"', cardStart);
        const learnMoreBtnPos = html.indexOf('Learn More', streakBtnPos);

        expect(streakBtnPos).toBeGreaterThan(cardStart);
        expect(learnMoreBtnPos).toBeGreaterThan(streakBtnPos);
    });

    it('includes the Pre-Launch Streak dialog modal with account & Minecraft IGN requirements and rewards roadmap', () => {
        expect(html).toContain('id="og-streak-modal"');
        expect(html).toContain('PRE-LAUNCH DAILY STREAK');
        expect(html).toContain('All accumulated rewards will be received directly in your Minecraft inventory on October 20th!');
        
        // Form views
        expect(html).toContain('id="og-streak-auth-view"');
        expect(html).toContain('id="og-streak-link-view"');
        expect(html).toContain('id="og-streak-dashboard-view"');

        // Minecraft IGN inputs and heads
        expect(html).toContain('id="og-reg-mc-ign"');
        expect(html).toContain('id="og-reg-head"');
        expect(html).toContain('id="og-login-mc-ign"');
        expect(html).toContain('id="og-login-head"');
        expect(html).toContain('id="og-link-mc-ign"');
        expect(html).toContain('id="og-link-head"');

        // Claim button and roadmap
        expect(html).toContain('id="og-dash-claim-btn"');
        expect(html).toContain('id="og-streak-rewards-list"');
    });

    it('contains CSS styling for .mc-btn-streak and .og-streak-callout', () => {
        expect(html).toContain('.og-streak-callout');
        expect(html).toContain('.mc-btn-streak');
        expect(html).toContain('.mc-btn-streak.claimed');
        expect(html).toContain('.og-reward-card-mini');
    });
});
