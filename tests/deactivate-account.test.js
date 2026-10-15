import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Extremely Complicated Deactivate / Delete Account Gauntlet in account.html', () => {
    let accountHtml;
    let accountJs;
    let accountCss;

    beforeAll(() => {
        accountHtml = fs.readFileSync(path.join(ROOT_DIR, 'account.html'), 'utf-8');
        accountJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'account.js'), 'utf-8');
        accountCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'account.css'), 'utf-8');
    });

    describe('account.html structure', () => {
        test('includes deactivate account modal with all 8 gauntlet steps', () => {
            expect(accountHtml).toContain('id="deactivate-account-modal"');
            expect(accountHtml).toContain('id="deactivate-step-1"');
            expect(accountHtml).toContain('id="deactivate-step-2"');
            expect(accountHtml).toContain('id="deactivate-step-3"');
            expect(accountHtml).toContain('id="deactivate-step-4"');
            expect(accountHtml).toContain('id="deactivate-step-5"');
            expect(accountHtml).toContain('id="deactivate-step-6"');
            expect(accountHtml).toContain('id="deactivate-step-7"');
            expect(accountHtml).toContain('id="deactivate-step-8"');
        });

        test('includes all required inputs for account deactivation gauntlet', () => {
            // Email input
            expect(accountHtml).toContain('id="deactivate-email-input"');
            // Password input
            expect(accountHtml).toContain('id="deactivate-password-input"');
            // Confirm password input
            expect(accountHtml).toContain('id="deactivate-confirm-password-input"');
            // MC username input
            expect(accountHtml).toContain('id="deactivate-mc-input"');
            // Discord username input
            expect(accountHtml).toContain('id="deactivate-discord-input"');
            // Last four card input + checkbox
            expect(accountHtml).toContain('id="deactivate-card-input"');
            expect(accountHtml).toContain('id="deactivate-no-card-checkbox"');
        });

        test('includes loss of assets review and 10% retention offer with proper button triggers', () => {
            // Retention loss review buttons
            expect(accountHtml).toContain('id="deactivate-loss-goback-btn"');
            expect(accountHtml).toContain('id="deactivate-loss-nothanks-btn"');
            // 10% off coupon code & button to proceed to popup
            expect(accountHtml).toContain('STAY10DTS');
            expect(accountHtml).toContain('id="deactivate-claim-10-btn"');
            expect(accountHtml).toContain('id="deactivate-proceed-to-popup-btn"');
        });

        test('includes all required multi-stage deactivation and deletion popups', () => {
            // Popup 1: Are you sure? + password prompt
            expect(accountHtml).toContain('id="deactivate-confirm-popup"');
            expect(accountHtml).toContain('id="deactivate-popup-password"');
            expect(accountHtml).toContain('id="deactivate-popup-yes-btn"');
            expect(accountHtml).toContain('id="deactivate-popup-no-btn"');

            // Popup 2: If No -> ask if they want to delete account
            expect(accountHtml).toContain('id="delete-ask-popup"');
            expect(accountHtml).toContain('id="delete-ask-yes-btn"');
            expect(accountHtml).toContain('id="delete-ask-no-btn"');

            // Popup 3: Confirm delete -> prompt password
            expect(accountHtml).toContain('id="delete-confirm-popup"');
            expect(accountHtml).toContain('id="delete-popup-password"');
            expect(accountHtml).toContain('id="delete-confirm-yes-btn"');
            expect(accountHtml).toContain('id="delete-confirm-no-btn"');

            // Popup 4: Final warning -> This will delete your account forever
            expect(accountHtml).toContain('id="delete-forever-popup"');
            expect(accountHtml).toContain('THIS WILL DELETE YOUR ACCOUNT FOREVER');
            expect(accountHtml).toContain('id="delete-forever-accept-btn"');
            expect(accountHtml).toContain('id="delete-forever-goback-btn"');
        });

        test('includes similar gauntlet feature for cancelling subscription', () => {
            expect(accountHtml).toContain('id="cancel-membership-modal"');
            expect(accountHtml).toContain('id="cancel-email-input"');
            expect(accountHtml).toContain('id="cancel-password-input"');
            expect(accountHtml).toContain('id="cancel-confirm-password-input"');
            expect(accountHtml).toContain('id="cancel-mc-input"');
            expect(accountHtml).toContain('id="cancel-discord-input"');
            expect(accountHtml).toContain('id="cancel-card-input"');
            expect(accountHtml).toContain('id="sub-cancel-confirm-popup"');
            expect(accountHtml).toContain('id="sub-cancel-terminate-ask-popup"');
            expect(accountHtml).toContain('id="sub-cancel-terminate-confirm-popup"');
            expect(accountHtml).toContain('id="sub-cancel-terminate-forever-popup"');
        });
    });

    describe('Dark Pattern / iOS Big Blue Button Styling & Switch-Around', () => {
        test('account.css contains styles for .btn-ios-big-blue, .tricky-actions, and swap-order', () => {
            expect(accountCss).toContain('.btn-ios-big-blue');
            expect(accountCss).toContain('.tricky-actions');
            expect(accountCss).toContain('.swap-order');
            expect(accountCss).toContain('#007AFF');
            expect(accountCss).toContain('.deactivate-modal-overlay');
            expect(accountCss).toContain('.deactivate-popup-overlay');
        });

        test('account.html applies btn-ios-big-blue and tricky-goback-btn to Go Back / Safety buttons', () => {
            expect(accountHtml).toMatch(/class="[^"]*btn-ios-big-blue[^"]*"/);
            expect(accountHtml).toMatch(/class="[^"]*tricky-goback-btn[^"]*"/);
        });
    });

    describe('js/account.js controller implementation', () => {
        test('exports initDeactivateAccountWizard and initCancellationWizard', () => {
            expect(accountJs).toContain('export function initDeactivateAccountWizard');
            expect(accountJs).toContain('export function initCancellationWizard');
        });

        test('implements setupHostileButtonSwapper with hover and touch swap support', () => {
            expect(accountJs).toContain('setupHostileButtonSwapper');
            expect(accountJs).toContain("container.classList.toggle('swap-order')");
        });

        test('delete-account-btn triggers initDeactivateAccountWizard', () => {
            expect(accountJs).toMatch(/delete-account-btn.*initDeactivateAccountWizard/s);
        });

        test('validates email, password, confirm password, mc, discord, and card before advancing', () => {
            expect(accountJs).toContain('deactivate-to-step-2-btn');
            expect(accountJs).toContain('deactivate-to-step-3-btn');
            expect(accountJs).toContain('deactivate-to-step-4-btn');
            expect(accountJs).toContain('deactivate-to-step-5-btn');
            expect(accountJs).toContain('deactivate-to-step-6-btn');
            expect(accountJs).toContain('deactivate-to-step-7-btn');
            expect(accountJs).toContain('deactivate-loss-nothanks-btn');
        });

        test('clicking tricky Go Back button wipes verification and resets back to Step 1', () => {
            expect(accountJs).toContain('All verification has been wiped and reset back to Step 1');
            expect(accountJs).toContain('showStep(1)');
        });

        test('handles the deactivation popup chain: yes deactivates, no asks delete, confirm delete prompts password, final warning deletes forever or goes back', () => {
            expect(accountJs).toContain('deactivate-popup-yes-btn');
            expect(accountJs).toContain('deactivate-popup-no-btn');
            expect(accountJs).toContain('delete-ask-yes-btn');
            expect(accountJs).toContain('delete-ask-no-btn');
            expect(accountJs).toContain('delete-confirm-yes-btn');
            expect(accountJs).toContain('delete-confirm-no-btn');
            expect(accountJs).toContain('delete-forever-accept-btn');
            expect(accountJs).toContain('delete-forever-goback-btn');
        });
    });
});
