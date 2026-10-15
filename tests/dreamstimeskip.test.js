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

    it('styles .info-card-wide to extend across free space in the grid', () => {
        expect(html).toContain('.info-card.info-card-wide');
        expect(html).toContain('grid-column: 1 / -1');
        expect(html).toContain('grid-template-columns: 440px 1fr');
    });

    it('renders the LINK MINECRAFT IGN & START STREAK cta and unlinked status badge', () => {
        expect(html).toContain('⚔️ LINK MINECRAFT IGN &amp; START STREAK');
        expect(html).toContain('Link your Minecraft IGN to start earning pre-launch streak rewards!');
    });

    describe('Streak button & status conditional behavior based on account settings', () => {
        let dom;
        let getEffectiveLinkedUser;
        let updatePreLaunchStreakUI;

        beforeEach(() => {
            // Setup DOM environment matching dreamstimeskip.html
            document.body.innerHTML = `
                <div class="og-streak-callout" id="og-streak-callout-box">
                    <div id="og-streak-card-status" class="og-streak-status-badge">Link your Minecraft IGN to start earning pre-launch streak rewards!</div>
                </div>
                <button id="og-unlock-streak-btn" class="mc-btn mc-btn-streak" type="button">⚔️ LINK MINECRAFT IGN &amp; START STREAK</button>
            `;

            // Extract the function implementation from dreamstimeskip.html
            const funcMatch = html.match(/function getEffectiveLinkedUser[\s\S]*?return \{[\s\S]*?\};?\s*\}/);
            const updateMatch = html.match(/function updatePreLaunchStreakUI[\s\S]*?\n        \}/);
            
            expect(funcMatch).not.toBeNull();
            expect(updateMatch).not.toBeNull();

            // Evaluate functions in test scope
            const evalFn = new Function(funcMatch[0] + '\n' + updateMatch[0] + '\nreturn { getEffectiveLinkedUser, updatePreLaunchStreakUI };');
            const funcs = evalFn();
            getEffectiveLinkedUser = funcs.getEffectiveLinkedUser;
            updatePreLaunchStreakUI = funcs.updatePreLaunchStreakUI;
        });

        test('unlinked user / signed out: shows link callout and LINK MINECRAFT IGN & START STREAK button', () => {
            updatePreLaunchStreakUI(null, null);

            const btn = document.getElementById('og-unlock-streak-btn');
            const cardStatus = document.getElementById('og-streak-card-status');

            expect(btn.innerHTML).toContain('LINK MINECRAFT IGN');
            expect(cardStatus.style.display).not.toBe('none');
            expect(cardStatus.textContent).toContain('Link your Minecraft IGN');
        });

        test('user with username in settings: shows View Streak and hides link account section', () => {
            const mockUser = { uid: 'user_123', email: 'test@example.com' };
            const mockProfile = { username: 'Dreamer_01' };

            updatePreLaunchStreakUI(mockUser, mockProfile);

            const btn = document.getElementById('og-unlock-streak-btn');
            const cardStatus = document.getElementById('og-streak-card-status');

            expect(btn.innerHTML).toContain('View Streak');
            expect(cardStatus.style.display).toBe('none');
        });

        test('user with minecraft username in settings (socials.minecraft or minecraft): shows View Streak and hides link section', () => {
            const mockUser = { uid: 'user_456' };
            const mockProfile = { socials: { minecraft: 'Notch_OG' } };

            updatePreLaunchStreakUI(mockUser, mockProfile);

            const btn = document.getElementById('og-unlock-streak-btn');
            const cardStatus = document.getElementById('og-streak-card-status');

            expect(btn.innerHTML).toContain('View Streak');
            expect(cardStatus.style.display).toBe('none');
        });

        test('user with empty settings profile: remains unlinked with link account prompt', () => {
            const mockUser = { uid: 'user_789' };
            const mockProfile = { username: '', minecraft: '' };

            updatePreLaunchStreakUI(mockUser, mockProfile);

            const btn = document.getElementById('og-unlock-streak-btn');
            const cardStatus = document.getElementById('og-streak-card-status');

            expect(btn.innerHTML).toContain('LINK MINECRAFT IGN');
            expect(cardStatus.style.display).not.toBe('none');
        });
    });
});
