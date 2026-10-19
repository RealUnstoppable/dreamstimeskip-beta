import { jest } from '@jest/globals';
import { loadFooter } from '../js/footer.js';

describe('Footer Component (js/footer.js)', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('footer');
        container.className = 'main-footer';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    test('should inject complete footer structure into .main-footer', () => {
        loadFooter();

        expect(container.querySelector('.footer-container')).not.toBeNull();
        expect(container.querySelector('.footer-grid')).not.toBeNull();
        expect(container.querySelector('.footer-newsletter')).not.toBeNull();
        expect(container.querySelector('.footer-bottom')).not.toBeNull();
        expect(container.textContent).toContain('2026 Unstoppable LLC');
    });

    test('should render navigation, beta, connect, and company links', () => {
        loadFooter();

        const links = Array.from(container.querySelectorAll('a')).map(a => a.textContent.trim());
        expect(links).toContain('Overview');
        expect(links).toContain('Unstoppable');
        expect(links).toContain('Dreams TimeSkip');
        expect(links).toContain('Medixly');
        expect(links).toContain('YouTube');
        expect(links).toContain('Privacy Policy');
        expect(links).toContain('Terms of Service');
    });

    test('should include newsletter form with required inputs', () => {
        loadFooter();

        const form = container.querySelector('.signup-form');
        expect(form).not.toBeNull();
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        expect(emailInput).not.toBeNull();
        expect(emailInput.hasAttribute('required')).toBe(true);
        expect(phoneInput).not.toBeNull();
        expect(submitBtn).not.toBeNull();
    });

    test('should wire up privacy choices button to window.openPrivacyChoices', () => {
        window.openPrivacyChoices = jest.fn();
        loadFooter();

        const privacyBtn = container.querySelector('#footer-privacy-choices');
        expect(privacyBtn).not.toBeNull();

        privacyBtn.click();
        expect(window.openPrivacyChoices).toHaveBeenCalledTimes(1);
    });

    test('should handle missing .main-footer gracefully without error', () => {
        document.body.innerHTML = '<div class="other-container"></div>';

        expect(() => {
            loadFooter();
        }).not.toThrow();
    });

    test('should expose loadFooter on window object', () => {
        expect(typeof window.loadFooter).toBe('function');
    });
});
