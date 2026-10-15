import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Account Settings: Security Action Sign, Phone & 2FA, and Socials Profiles', () => {
    let accountHtml;
    let accountCss;
    let accountJs;
    let updateSecurityActionSign;
    let renderProfile;

    beforeAll(async () => {
        accountHtml = fs.readFileSync(path.join(ROOT_DIR, 'account.html'), 'utf-8');
        accountCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'account.css'), 'utf-8');
        accountJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'account.js'), 'utf-8');

        const module = await import('../js/account.js');
        updateSecurityActionSign = module.updateSecurityActionSign;
        renderProfile = module.renderProfile;
    });

    describe('1. HTML Markup Structure in account.html', () => {
        test('includes Enhanced Security Action Sign banner with badge, progress track, and checklist', () => {
            expect(accountHtml).toContain('id="security-action-sign"');
            expect(accountHtml).toContain('id="security-sign-badge"');
            expect(accountHtml).toContain('id="security-badge-icon"');
            expect(accountHtml).toContain('id="security-badge-text"');
            expect(accountHtml).toContain('id="security-score-text"');
            expect(accountHtml).toContain('id="security-progress-bar"');
            expect(accountHtml).toContain('id="security-checklist"');
            expect(accountHtml).toContain('id="security-check-email"');
            expect(accountHtml).toContain('id="security-check-phone"');
            expect(accountHtml).toContain('id="security-check-2fa"');
        });

        test('includes Security phone input and save button in Security settings card', () => {
            expect(accountHtml).toContain('id="security-phone-input"');
            expect(accountHtml).toContain('id="save-security-phone-btn"');
            expect(accountHtml).toContain('id="security-phone-notification"');
        });

        test('includes 2FA toggle, status indicator pill, and verification method selector', () => {
            expect(accountHtml).toContain('id="toggle-2fa"');
            expect(accountHtml).toContain('id="two-factor-status-pill"');
            expect(accountHtml).toContain('id="two-factor-method-select"');
            expect(accountHtml).toContain('value="sms"');
            expect(accountHtml).toContain('value="authenticator"');
            expect(accountHtml).toContain('value="email"');
        });

        test('includes Socials & Gaming Profiles card with Minecraft, Discord, TikTok, YouTube, Twitch, Twitter', () => {
            expect(accountHtml).toContain('id="socials-settings-card"');
            expect(accountHtml).toContain('id="socials-settings-form"');
            expect(accountHtml).toContain('id="social-minecraft"');
            expect(accountHtml).toContain('id="social-discord"');
            expect(accountHtml).toContain('id="social-tiktok"');
            expect(accountHtml).toContain('id="social-youtube"');
            expect(accountHtml).toContain('id="social-twitch"');
            expect(accountHtml).toContain('id="social-twitter"');
            expect(accountHtml).toContain('id="save-socials-btn"');
            expect(accountHtml).toContain('id="socials-notification"');
        });
    });

    describe('2. CSS Styling in css/account.css', () => {
        test('contains styling for security action sign and progress bar', () => {
            expect(accountCss).toContain('.security-action-sign-card');
            expect(accountCss).toContain('.security-sign-badge');
            expect(accountCss).toContain('.security-progress-track');
            expect(accountCss).toContain('.security-progress-bar');
            expect(accountCss).toContain('.security-checklist');
            expect(accountCss).toContain('.checklist-badge');
        });

        test('contains styling for phone action row and 2FA status pill', () => {
            expect(accountCss).toContain('.phone-action-row');
            expect(accountCss).toContain('#two-factor-status-pill');
        });

        test('contains styling for socials grid, input wrappers, and prefixes', () => {
            expect(accountCss).toContain('.socials-grid');
            expect(accountCss).toContain('.social-input-wrapper');
            expect(accountCss).toContain('.social-prefix');
            expect(accountCss).toContain('.social-help-text');
        });
    });

    describe('3. JavaScript Logic: updateSecurityActionSign()', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="card glass-card security-action-sign-card" id="security-action-sign">
                    <div class="security-sign-header">
                        <div class="security-sign-badge" id="security-sign-badge">
                            <span class="security-badge-icon" id="security-badge-icon">⚠️</span>
                            <span class="security-badge-text" id="security-badge-text"></span>
                        </div>
                        <div class="security-sign-score">
                            <span id="security-score-text"></span>
                        </div>
                    </div>
                    <div class="security-progress-track">
                        <div class="security-progress-bar" id="security-progress-bar"></div>
                    </div>
                    <p class="security-sign-desc" id="security-sign-desc"></p>
                    <div class="security-checklist" id="security-checklist">
                        <div class="security-checklist-item" id="security-check-email">
                            <span class="checklist-status-icon" id="email-check-icon"></span>
                            <span class="checklist-subtext" id="security-email-subtext"></span>
                            <span class="checklist-badge" id="email-check-badge"></span>
                        </div>
                        <div class="security-checklist-item" id="security-check-phone">
                            <span class="checklist-status-icon" id="phone-check-icon"></span>
                            <span class="checklist-subtext" id="security-phone-subtext"></span>
                            <a href="#security-phone-input" class="checklist-badge" id="phone-check-badge"></a>
                        </div>
                        <div class="security-checklist-item" id="security-check-2fa">
                            <span class="checklist-status-icon" id="twofa-check-icon"></span>
                            <span class="checklist-subtext" id="security-2fa-subtext"></span>
                            <a href="#toggle-2fa" class="checklist-badge" id="twofa-check-badge"></a>
                        </div>
                    </div>
                </div>
                <span class="badge" id="two-factor-status-pill"></span>
            `;
        });

        test('calculates 1/3 when only email is registered', () => {
            const user = { email: 'alex@example.com' };
            const userData = { phone: '', twoFactorEnabled: false };

            const result = updateSecurityActionSign(user, userData);
            expect(result.completedCount).toBe(1);
            expect(result.isFullySecured).toBe(false);

            expect(document.getElementById('security-score-text').textContent).toBe('1 / 3 Steps Completed');
            expect(document.getElementById('security-progress-bar').style.width).toBe('33%');
            expect(document.getElementById('security-badge-icon').textContent).toBe('⚠️');
            expect(document.getElementById('security-badge-text').textContent).toContain('2 Steps Remaining');
            expect(document.getElementById('phone-check-badge').textContent).toBe('Add Phone');
            expect(document.getElementById('twofa-check-badge').textContent).toBe('Enable 2FA');
            expect(document.getElementById('two-factor-status-pill').textContent).toBe('Inactive');
        });

        test('calculates 2/3 when email and phone are set but 2FA is disabled', () => {
            const user = { email: 'alex@example.com' };
            const userData = { phone: '+15551234567', twoFactorEnabled: false };

            const result = updateSecurityActionSign(user, userData);
            expect(result.completedCount).toBe(2);
            expect(result.isFullySecured).toBe(false);

            expect(document.getElementById('security-score-text').textContent).toBe('2 / 3 Steps Completed');
            expect(document.getElementById('security-progress-bar').style.width).toBe('67%');
            expect(document.getElementById('phone-check-badge').textContent).toBe('Added');
            expect(document.getElementById('phone-check-icon').textContent).toBe('✅');
            expect(document.getElementById('twofa-check-badge').textContent).toBe('Enable 2FA');
        });

        test('calculates 3/3 and activates Enhanced Security status when email, phone, and 2FA are complete', () => {
            const user = { email: 'alex@example.com' };
            const userData = { phone: '+15551234567', twoFactorEnabled: true };

            const result = updateSecurityActionSign(user, userData);
            expect(result.completedCount).toBe(3);
            expect(result.isFullySecured).toBe(true);

            expect(document.getElementById('security-action-sign').classList.contains('fully-secured')).toBe(true);
            expect(document.getElementById('security-score-text').textContent).toContain('3 / 3 Steps Completed (Fully Secured)');
            expect(document.getElementById('security-badge-icon').textContent).toBe('🛡️');
            expect(document.getElementById('security-badge-text').textContent).toBe('Enhanced Security Active');
            expect(document.getElementById('security-progress-bar').style.width).toBe('100%');
            expect(document.getElementById('security-progress-bar').classList.contains('completed')).toBe(true);
            expect(document.getElementById('phone-check-badge').textContent).toBe('Added');
            expect(document.getElementById('twofa-check-badge').textContent).toBe('Enabled');
            expect(document.getElementById('two-factor-status-pill').textContent).toBe('Active');
            expect(document.getElementById('two-factor-status-pill').classList.contains('active')).toBe(true);
        });
    });

    describe('4. JavaScript Logic: renderProfile() pre-population', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="welcome-header"></div>
                <div id="user-email-sidebar"></div>
                <input id="update-username" />
                <input id="update-phone" />
                <input id="security-phone-input" />
                <input id="update-email" />
                <select id="theme-select"><option value="system">System</option></select>
                <input id="custom-hex-color" />
                <button id="admin-back-button" style="display:none;"></button>
                <input type="checkbox" id="toggle-2fa" />
                <select id="two-factor-method-select">
                    <option value="sms">SMS</option>
                    <option value="authenticator">Authenticator</option>
                    <option value="email">Email</option>
                </select>
                <input id="social-minecraft" />
                <input id="social-discord" />
                <input id="social-tiktok" />
                <input id="social-youtube" />
                <input id="social-twitch" />
                <input id="social-twitter" />
                <div id="security-action-sign"></div>
                <span id="security-score-text"></span>
                <span id="two-factor-status-pill"></span>
            `;
        });

        test('pre-fills security phone and updates both phone inputs', () => {
            const user = { email: 'gamer@example.com' };
            const userData = { phone: '(555) 987-6543' };

            renderProfile(user, userData);

            expect(document.getElementById('update-phone').value).toBe('(555) 987-6543');
            expect(document.getElementById('security-phone-input').value).toBe('(555) 987-6543');
        });

        test('pre-fills 2FA toggle and method select', () => {
            const user = { email: 'gamer@example.com' };
            const userData = { twoFactorEnabled: true, twoFactorMethod: 'authenticator' };

            renderProfile(user, userData);

            expect(document.getElementById('toggle-2fa').checked).toBe(true);
            expect(document.getElementById('two-factor-method-select').value).toBe('authenticator');
        });

        test('pre-fills all socials from userData.socials object', () => {
            const user = { email: 'gamer@example.com' };
            const userData = {
                socials: {
                    minecraft: 'DTS_Player1',
                    discord: 'Alex#1337',
                    tiktok: 'alex_clips',
                    youtube: 'AlexGaming',
                    twitch: 'alex_live',
                    twitter: 'alex_tweets'
                }
            };

            renderProfile(user, userData);

            expect(document.getElementById('social-minecraft').value).toBe('DTS_Player1');
            expect(document.getElementById('social-discord').value).toBe('Alex#1337');
            expect(document.getElementById('social-tiktok').value).toBe('alex_clips');
            expect(document.getElementById('social-youtube').value).toBe('AlexGaming');
            expect(document.getElementById('social-twitch').value).toBe('alex_live');
            expect(document.getElementById('social-twitter').value).toBe('alex_tweets');
        });

        test('pre-fills minecraft and discord from legacy top-level userData fields as fallback', () => {
            const user = { email: 'gamer@example.com' };
            const userData = {
                minecraft: 'CraftMaster',
                discord: 'DiscordGuy'
            };

            renderProfile(user, userData);

            expect(document.getElementById('social-minecraft').value).toBe('CraftMaster');
            expect(document.getElementById('social-discord').value).toBe('DiscordGuy');
        });
    });

    describe('5. Handlers and Persistence logic in js/account.js', () => {
        test('includes save-security-phone-btn listener that updates Firestore and syncs inputs', () => {
            expect(accountJs).toContain('save-security-phone-btn');
            expect(accountJs).toContain("document.getElementById('security-phone-input')");
            expect(accountJs).toContain('security-phone-notification');
            expect(accountJs).toContain('updateSecurityActionSign(user, userData)');
        });

        test('includes 2FA toggle and two-factor-method-select listeners', () => {
            expect(accountJs).toContain('two-factor-method-select');
            expect(accountJs).toContain('twoFactorMethod');
            expect(accountJs).toContain('twoFactorEnabled');
        });

        test('includes socials-settings-form submit handler that persists socials, minecraft, and discord', () => {
            expect(accountJs).toContain('socials-settings-form');
            expect(accountJs).toContain('social-minecraft');
            expect(accountJs).toContain('social-discord');
            expect(accountJs).toContain('social-tiktok');
            expect(accountJs).toContain('social-youtube');
            expect(accountJs).toContain('social-twitch');
            expect(accountJs).toContain('social-twitter');
            expect(accountJs).toContain('save-socials-btn');
            expect(accountJs).toContain('socials-notification');
            expect(accountJs).toMatch(/await\s+updateDoc\(doc\(db,\s*"users",\s*user\.uid\),\s*\{[^}]*socials/);
        });

        test('validates Minecraft username uniqueness before saving and links to minecraft_links registry', () => {
            expect(accountHtml).toContain('id="social-minecraft-error"');
            expect(accountHtml).toContain('class="mc-ign-validation-msg"');
            expect(accountCss).toContain('.mc-ign-validation-msg');
            expect(accountJs).toContain('checkMinecraftAvailability');
            expect(accountJs).toContain('claimMinecraftLink');
            expect(accountJs).toContain('MC_ALREADY_LINKED_MESSAGE');
            expect(accountJs).toContain('social-minecraft-error');
        });
    });
});
