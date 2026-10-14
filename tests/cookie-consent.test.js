/**
 * @jest-environment jsdom
 */
import { initCookieConsent } from '../js/cookie-consent.js';

describe('Cookie Consent Banner', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    it('renders the banner when cookiesAccepted is not set', () => {
        initCookieConsent();

        const banner = document.getElementById('cookie-banner');
        expect(banner).not.toBeNull();
        expect(banner.textContent).toContain('agree to our Terms and Conditions and Privacy Policy');

        const termsLink = banner.querySelector('a[href="terms.html"]');
        const privacyLink = banner.querySelector('a[href="privacy.html"]');

        expect(termsLink).not.toBeNull();
        expect(termsLink.textContent).toBe('Terms and Conditions');
        expect(privacyLink).not.toBeNull();
        expect(privacyLink.textContent).toBe('Privacy Policy');
    });

    it('does not render banner if user has already accepted or declined', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        initCookieConsent();

        const banner = document.getElementById('cookie-banner');
        expect(banner).toBeNull();
    });

    it('sets cookiesAccepted to true on Accept click', () => {
        initCookieConsent();

        const acceptBtn = document.getElementById('accept-cookies');
        acceptBtn.click();

        expect(localStorage.getItem('cookiesAccepted')).toBe('true');
    });

    it('sets cookiesAccepted to false on Decline click', () => {
        initCookieConsent();

        const declineBtn = document.getElementById('decline-cookies');
        declineBtn.click();

        expect(localStorage.getItem('cookiesAccepted')).toBe('false');
    });
});
