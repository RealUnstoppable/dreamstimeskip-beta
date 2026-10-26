import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dreams TimeSkip Launch Portal Integrity', () => {
    const filePath = path.join(ROOT_DIR, 'dts.html');
    const html = fs.readFileSync(filePath, 'utf8');

    it('verifies dts.html has canonical URL https://realunstoppable.store/dts and dreamstimeskip.html redirect', () => {
        expect(html).toContain('<link rel="canonical" href="https://realunstoppable.store/dts">');
        expect(html).toContain('<meta property="og:url" content="https://realunstoppable.store/dts">');

        const legacyRedirectPath = path.join(ROOT_DIR, 'dreamstimeskip.html');
        expect(fs.existsSync(legacyRedirectPath)).toBe(true);
        const redirectHtml = fs.readFileSync(legacyRedirectPath, 'utf8');
        expect(redirectHtml).toContain('url=/dts');
    });

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

    describe('Sitewide Minecraft Username Uniqueness & Account Linking Protection', () => {
        it('imports checkMinecraftAvailability, claimMinecraftLink, and MC_ALREADY_LINKED_MESSAGE from minecraft-link-service.js', () => {
            expect(html).toContain("from './js/minecraft-link-service.js'");
            expect(html).toContain('checkMinecraftAvailability');
            expect(html).toContain('claimMinecraftLink');
        });

        it('verifies username availability before creating account in waitlist registration form (#wl-register-form)', () => {
            expect(html).toContain('checkMinecraftAvailability(mcUsername, null');
            expect(html).toContain('claimMinecraftLink(db, user.uid, mcUsername');
        });

        it('verifies username availability before linking in waitlist login form (#wl-login-form)', () => {
            expect(html).toContain('checkMinecraftAvailability(mcUsername, user.uid');
            expect(html).toContain('claimMinecraftLink(db, user.uid, mcUsername');
        });

        it('verifies username availability in authenticated waitlist form (#wl-authed-form)', () => {
            expect(html).toContain('checkMinecraftAvailability(mcUsername, currentUser.uid');
        });

        it('verifies username availability before creating account in streak registration form (#og-streak-register-form)', () => {
            expect(html).toContain('checkMinecraftAvailability(mcUsername, null');
            expect(html).toContain('claimMinecraftLink(db, user.uid, mcUsername');
        });

        it('verifies username availability in streak login and link forms', () => {
            expect(html).toContain('checkMinecraftAvailability(mcUsername, user.uid');
            expect(html).toContain('checkMinecraftAvailability(mcUsername, currentUser.uid');
        });

        it('displays the exact required collision message when taken', () => {
            expect(html).toContain('This Minecraft username is already linked to a different account. If you think this is a mistake, contact us.');
        });
    });

    describe('Dreams OG Launch Countdown Configuration', () => {
        it('configures the Dreams OG countdown for 11:59 PM EDT on October 20, 2026', () => {
            expect(html).toContain('new Countdown("2026-10-20T23:59:00-04:00", "countdown-1")');
        });

        it('sets the Founder whitelist cutoff to 11:59 PM EDT launch on October 20, 2026', () => {
            expect(html).toContain("const cutoff = new Date('2026-10-20T23:59:00-04:00');");
        });
    });

    describe('Dreams OG Live & Server Maintenance Complete Verification', () => {
        it('confirms Dreams OG is Live across announcement banner, badge, and section header', () => {
            expect(html).toContain('DREAMS OG IS LIVE');
            expect(html).toContain('OFFICIAL MINECRAFT RELEASE • DREAMS OG IS LIVE');
            expect(html).toContain('<h1>DREAMS OG IS LIVE</h1>');
        });

        it('renders the server maintenance complete box with server is now working and join below notice', () => {
            expect(html).toContain('class="mc-maintenance-box');
            expect(html).toContain('MAINTENANCE COMPLETE');
            expect(html).toContain('Server is now working — join below!');
            expect(html).toContain('Server is now working • Join below');
            expect(html).toContain('Maintenance Complete');
        });

        it('features the complete progress bar graphic showing maintenance complete', () => {
            expect(html).toContain('class="mc-progress-bar-complete"');
            expect(html).toContain('class="mc-progress-track"');
            expect(html).toContain('mcCompleteShimmer');
            expect(html).toContain('100% Complete • Online');
        });

        it('contains accessible markup for the maintenance complete box and progress graphic', () => {
            expect(html).toContain('role="region" aria-label="Server Status - Maintenance Complete"');
            expect(html).toContain('role="progressbar" aria-label="Server maintenance complete" aria-valuenow="100"');
        });
    });

    describe('Join Server Button & Crossplay Connection Modal Verification', () => {
        it('renders the Join Server button in the hero buttons container', () => {
            expect(html).toContain('id="join-server-btn"');
            expect(html).toContain('Join Server');
            expect(html).toContain('open-join-server-trigger');
        });

        it('includes the Join Server dialog modal with accessible attributes and Minecraft styling', () => {
            expect(html).toContain('id="join-server-modal"');
            expect(html).toContain('class="mc-modal mc-join-server-modal"');
            expect(html).toContain('JOIN DREAMS SERVER');
            expect(html).toContain('id="close-join-server-btn"');
        });

        it('displays all three connection fields: Java IP, Bedrock Address, and Bedrock Port', () => {
            expect(html).toContain('id="display-java-ip"');
            expect(html).toContain('id="display-bedrock-ip"');
            expect(html).toContain('id="display-bedrock-port"');
            expect(html).toContain('19132');
            expect(html).toContain('dts.realunstoppable.store');
        });

        it('clarifies that Java does not require a port and Bedrock port is 19132', () => {
            expect(html).toContain('NO PORT REQUIRED');
            expect(html).toContain('Bedrock Port is <strong>19132</strong> (Java Edition does not have a port)');
        });

        it('provides individual copy buttons for all 3 fields', () => {
            expect(html).toContain('id="copy-java-ip-btn"');
            expect(html).toContain('Copy Java IP');
            expect(html).toContain('id="copy-bedrock-ip-btn"');
            expect(html).toContain('Copy Address');
            expect(html).toContain('id="copy-bedrock-port-btn"');
            expect(html).toContain('Copy Port');
        });

        it('includes Open Minecraft launcher buttons for both mobile and Java launcher', () => {
            expect(html).toContain('id="open-mc-mobile-btn"');
            expect(html).toContain('minecraft://?addExternalServer=Dreams%20TimeSkip|dts.realunstoppable.store:19132');
            expect(html).toContain('Open Bedrock (Mobile)');
            expect(html).toContain('id="open-mc-java-btn"');
            expect(html).toContain('Open Java Launcher');
        });

        it('contains CSS definitions for Join Server modal and launcher buttons', () => {
            expect(html).toContain('.mc-join-server-modal');
            expect(html).toContain('.join-fields-container');
            expect(html).toContain('.join-field-card');
            expect(html).toContain('.join-copy-btn');
            expect(html).toContain('.join-launch-btn');
        });
    });

    describe("What's New in DTS (new-dts.html) Join Server Modal Verification", () => {
        const newDtsPath = path.join(ROOT_DIR, 'new-dts.html');
        const newDtsHtml = fs.readFileSync(newDtsPath, 'utf8');

        it('renders the Join Server button on new-dts.html', () => {
            expect(newDtsHtml).toContain('id="join-server-btn"');
            expect(newDtsHtml).toContain('Join Server');
        });

        it('includes the Join Server modal and copy buttons in new-dts.html', () => {
            expect(newDtsHtml).toContain('id="join-server-modal"');
            expect(newDtsHtml).toContain('id="copy-java-ip-btn"');
            expect(newDtsHtml).toContain('id="copy-bedrock-ip-btn"');
            expect(newDtsHtml).toContain('id="copy-bedrock-port-btn"');
            expect(newDtsHtml).toContain('19132');
            expect(newDtsHtml).toContain('id="open-mc-mobile-btn"');
            expect(newDtsHtml).toContain('id="open-mc-java-btn"');
        });
    });

    describe('Pre-Launch Streak Celebration Animation & Web Audio Integration', () => {
        it('links the shared streakCelebration.css stylesheet', () => {
            expect(html).toContain('href="/css/streakCelebration.css"');
        });

        it('contains the Duolingo x Minecraft celebration modal (#mc-flare-modal) with canvas, odometer, and flame container', () => {
            expect(html).toContain('id="mc-flare-modal"');
            expect(html).toContain('id="mc-celebration-canvas"');
            expect(html).toContain('id="mc-flare-heat-bloom"');
            expect(html).toContain('id="mc-shockwave-ring"');
            expect(html).toContain('id="flare-voxel-flame-container"');
            expect(html).toContain('id="flare-streak-odometer-container"');
            expect(html).toContain('id="flare-streak-roll-prev"');
            expect(html).toContain('id="flare-streak-roll-next"');
            expect(html).toContain('id="flare-weekly-hotbar-container"');
            expect(html).toContain('id="flare-rarity-pill"');
            expect(html).toContain('id="flare-icon-container"');
            expect(html).toContain('id="flare-item-name"');
            expect(html).toContain('id="flare-points-bonus"');
            expect(html).toContain('id="flare-item-desc"');
            expect(html).toContain('id="flare-celebration-banner"');
            expect(html).toContain('id="flare-collect-btn"');
        });

        it('imports triggerFlareAnimation and streakAudio in script module', () => {
            expect(html).toContain("import { triggerFlareAnimation, streakCelebration } from './js/streakCelebration.js';");
            expect(html).toContain("import { streakAudio } from './js/streakSoundEngine.js';");
        });

        it('triggers celebration animation and audio context upon successful streak claim', () => {
            expect(html).toContain('triggerFlareAnimation(claimRes.streak, claimRes.rewardItem');
            expect(html).toContain('streakAudio.ensureContext()');
        });
    });
});

