import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Phone Number Collection Across Site & Cancellation/Deactivation Flow', () => {
    let signinHtml, authJs, dtsHtml, medixlyOnboardingJs, trackerHtml, bookingHtml, footerJs, newsletterJs, accountHtml, accountJs;

    beforeAll(() => {
        signinHtml = fs.readFileSync(path.join(ROOT_DIR, 'sign in beta.html'), 'utf-8');
        authJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'auth.js'), 'utf-8');
        dtsHtml = fs.readFileSync(path.join(ROOT_DIR, 'dts.html'), 'utf-8');
        medixlyOnboardingJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'medixly-onboarding.js'), 'utf-8');
        trackerHtml = fs.readFileSync(path.join(ROOT_DIR, 'tracker.html'), 'utf-8');
        bookingHtml = fs.readFileSync(path.join(ROOT_DIR, 'booking.html'), 'utf-8');
        footerJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'footer.js'), 'utf-8');
        newsletterJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'newsletter.js'), 'utf-8');
        accountHtml = fs.readFileSync(path.join(ROOT_DIR, 'account.html'), 'utf-8');
        accountJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'account.js'), 'utf-8');
    });

    describe('Primary Sign In / Sign Up Form (sign in beta.html & js/auth.js)', () => {
        test('sign in beta.html includes phone input group in auth-form', () => {
            expect(signinHtml).toContain('id="phone-group"');
            expect(signinHtml).toContain('id="phone"');
            expect(signinHtml).toContain('type="tel"');
        });

        test('js/auth.js toggles phone-group visibility and requires phone for sign up', () => {
            expect(authJs).toContain("document.getElementById('phone-group')");
            expect(authJs).toContain("phoneGroup.style.display = isSignUp ? 'block' : 'none'");
            expect(authJs).toContain('phoneInput.required = isSignUp');
        });

        test('js/auth.js validates phone and writes phone to users collection on sign up', () => {
            expect(authJs).toContain("document.getElementById('phone')");
            expect(authJs).toMatch(/isSignUp.*!phone/s);
            expect(authJs).toMatch(/setDoc\(doc\(db,\s*"users",\s*userCredential\.user\.uid\),\s*\{[^}]*phone:\s*phone/s);
        });
    });

    describe('Dreams TimeSkip Launch Portal (dts.html)', () => {
        test('includes phone input in wl-register-form', () => {
            expect(dtsHtml).toContain('id="wl-phone"');
            expect(dtsHtml).toContain('name="phone"');
        });

        test('validates phone and persists phone to both users and dts_waitlist collections', () => {
            expect(dtsHtml).toContain("document.getElementById('wl-phone')");
            expect(dtsHtml).toContain("Please enter your phone number.");
            expect(dtsHtml).toMatch(/setDoc\(doc\(db,\s*"users",\s*user\.uid\),\s*\{[^}]*phone:\s*phone/s);
            expect(dtsHtml).toMatch(/setDoc\(doc\(db,\s*"dts_waitlist",\s*user\.uid\),\s*\{[^}]*phone:\s*phone/s);
        });
    });

    describe('Medixly Music Onboarding (js/medixly-onboarding.js)', () => {
        test('includes phone input in onboarding form markup', () => {
            expect(medixlyOnboardingJs).toContain('id="ob-phone"');
            expect(medixlyOnboardingJs).toContain('type="tel"');
        });

        test('validates phone input and stores phone in users collection', () => {
            expect(medixlyOnboardingJs).toContain("document.getElementById('ob-phone').value.trim()");
            expect(medixlyOnboardingJs).toMatch(/!phone/);
            expect(medixlyOnboardingJs).toMatch(/setDoc\(doc\(db,\s*"users",\s*user\.uid\),\s*\{[^}]*phone:\s*phone/s);
        });
    });

    describe('Business Tracker Portal (tracker.html)', () => {
        test('includes authPhoneGroup and authPhone input in authForm', () => {
            expect(trackerHtml).toContain('id="authPhoneGroup"');
            expect(trackerHtml).toContain('id="authPhone"');
        });

        test('toggles authPhoneGroup when switching between sign in and sign up modes', () => {
            expect(trackerHtml).toContain("document.getElementById('authPhoneGroup')");
            expect(trackerHtml).toContain("phoneGroup.style.display = isRegisterMode ? 'block' : 'none'");
            expect(trackerHtml).toContain('phoneInput.required = isRegisterMode');
        });

        test('passes phone number to setup step upon registration', () => {
            expect(trackerHtml).toContain("document.getElementById('authPhone')");
            expect(trackerHtml).toContain('setupPhone.value = phone');
        });
    });

    describe('Booking & Quote Form (booking.html)', () => {
        test('includes phone input and persists phone to users collection on account creation', () => {
            expect(bookingHtml).toContain('id="b-phone"');
            expect(bookingHtml).toMatch(/setDoc\(doc\(db,\s*"users",\s*finalUid\),\s*\{[^}]*phone:\s*phone/s);
        });
    });

    describe('Newsletter / Footer Form (js/footer.js & js/newsletter.js)', () => {
        test('footer includes phone input in .signup-form', () => {
            expect(footerJs).toMatch(/<form class="signup-form"[^>]*>[\s\S]*<input type="tel"/);
        });

        test('newsletter.js extracts and saves phone in newsletter_subscribers collection', () => {
            expect(newsletterJs).toContain("form.querySelector('input[type=\"tel\"]')");
            expect(newsletterJs).toMatch(/phone:\s*phone/);
        });
    });

    describe('Account Deactivation & Membership Cancellation Gauntlets (account.html & js/account.js)', () => {
        test('deactivate-step-1 contains phone input placed directly after email input', () => {
            const emailIdx = accountHtml.indexOf('id="deactivate-email-input"');
            const phoneIdx = accountHtml.indexOf('id="deactivate-phone-input"');
            const pwdIdx = accountHtml.indexOf('id="deactivate-password-input"');
            expect(emailIdx).toBeGreaterThan(-1);
            expect(phoneIdx).toBeGreaterThan(emailIdx);
            expect(pwdIdx).toBeGreaterThan(phoneIdx);
        });

        test('cancel-step-2 contains phone input placed directly after email input', () => {
            const cancelEmailIdx = accountHtml.indexOf('id="cancel-email-input"');
            const cancelPhoneIdx = accountHtml.indexOf('id="cancel-phone-input"');
            const cancelPwdIdx = accountHtml.indexOf('id="cancel-password-input"');
            expect(cancelEmailIdx).toBeGreaterThan(-1);
            expect(cancelPhoneIdx).toBeGreaterThan(cancelEmailIdx);
            expect(cancelPwdIdx).toBeGreaterThan(cancelPhoneIdx);
        });

        test('update-profile-form includes phone input and saves to firestore', () => {
            expect(accountHtml).toContain('id="update-phone"');
            expect(accountJs).toContain("document.getElementById('update-phone')");
            expect(accountJs).toMatch(/updateDoc\(doc\(db,\s*"users",\s*user\.uid\),\s*\{[^}]*phone:\s*newPhone/s);
        });

        test('initDeactivateAccountWizard validates phone right after email before advancing to step 2', () => {
            expect(accountJs).toContain('deactivate-phone-input');
            expect(accountJs).toContain('deactivate-phone-error');
            expect(accountJs).toMatch(/deactivate-to-step-2-btn[\s\S]*?phoneVal[\s\S]*?Please enter your account phone number\.[\s\S]*?showStep\(2\)/);
        });

        test('initCancellationWizard validates phone right after email before advancing to step 3', () => {
            expect(accountJs).toContain('cancel-phone-input');
            expect(accountJs).toContain('cancel-phone-error');
            expect(accountJs).toMatch(/cancel-to-step-3-btn[\s\S]*?phoneVal[\s\S]*?Please enter your account phone number\.[\s\S]*?showStep\(3\)/);
        });
    });
});
