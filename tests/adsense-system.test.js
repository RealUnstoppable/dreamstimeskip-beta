/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    ADSENSE_CLIENT_ID,
    DEFAULT_SLOT_ID,
    ensureAdSenseScript,
    mountAdUnit,
    removeAllAds,
    isNonPersonalizedAdsRequested,
    refreshAds
} from '../js/ads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Google AdSense Implementation & Policy Compliance Tests', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        localStorage.clear();
        delete window.adsbygoogle;
        delete navigator.globalPrivacyControl;
    });

    describe('Publisher ID & Static Files Verification', () => {
        it('uses correct publisher ID ca-pub-4254213062632381', () => {
            expect(ADSENSE_CLIENT_ID).toBe('ca-pub-4254213062632381');
        });

        it('ensures root ads.txt exists and is properly formatted', () => {
            const rootAdsTxt = fs.readFileSync(path.join(ROOT_DIR, 'ads.txt'), 'utf8');
            expect(rootAdsTxt).toContain('google.com, pub-4254213062632381, DIRECT, f08c47fec0942fa0');
        });

        it('ensures public/ads.txt exists and matches root ads.txt', () => {
            const publicAdsTxt = fs.readFileSync(path.join(ROOT_DIR, 'public/ads.txt'), 'utf8');
            expect(publicAdsTxt).toContain('google.com, pub-4254213062632381, DIRECT, f08c47fec0942fa0');
        });

        it('ensures dist/ads.txt exists after build', () => {
            const distAdsTxt = fs.readFileSync(path.join(ROOT_DIR, 'dist/ads.txt'), 'utf8');
            expect(distAdsTxt).toContain('google.com, pub-4254213062632381, DIRECT, f08c47fec0942fa0');
        });
    });

    describe('Script Loading Optimization', () => {
        it('injects core AdSense script with async and crossorigin="anonymous"', () => {
            ensureAdSenseScript();

            const script = document.querySelector('script[src*="adsbygoogle.js"]');
            expect(script).not.toBeNull();
            expect(script.getAttribute('src')).toContain(`client=${ADSENSE_CLIENT_ID}`);
            expect(script.async).toBe(true);
            expect(script.crossOrigin).toBe('anonymous');
        });

        it('does not duplicate script tag if already present in head', () => {
            ensureAdSenseScript();
            ensureAdSenseScript();

            const scripts = document.querySelectorAll('script[src*="adsbygoogle.js"]');
            expect(scripts.length).toBe(1);
        });
    });

    describe('Privacy, GDPR & Consent Mode Integration', () => {
        it('detects GPC (Global Privacy Control) and flags non-personalized ads', () => {
            Object.defineProperty(navigator, 'globalPrivacyControl', {
                value: true,
                configurable: true
            });

            expect(isNonPersonalizedAdsRequested()).toBe(true);

            ensureAdSenseScript();
            expect(window.adsbygoogle.requestNonPersonalizedAds).toBe(1);
        });

        it('detects cookies declined in localStorage and flags non-personalized ads', () => {
            localStorage.setItem('cookiesAccepted', 'false');

            expect(isNonPersonalizedAdsRequested()).toBe(true);

            ensureAdSenseScript();
            expect(window.adsbygoogle.requestNonPersonalizedAds).toBe(1);
        });
    });

    describe('Ad Unit Mounting & Duplicate Push Safety', () => {
        it('safely mounts an ins unit and pushes to adsbygoogle queue exactly once', () => {
            const ins = document.createElement('ins');
            ins.className = 'adsbygoogle';
            ins.setAttribute('data-ad-client', ADSENSE_CLIENT_ID);
            ins.setAttribute('data-ad-slot', '9876543210');
            document.body.appendChild(ins);

            mountAdUnit(ins);

            expect(ins.getAttribute('data-ad-initialized')).toBe('true');
            expect(window.adsbygoogle.length).toBe(1);

            // Second mount attempt should safely no-op without pushing again
            mountAdUnit(ins);
            expect(window.adsbygoogle.length).toBe(1);
        });

        it('skips mounting if element already marked done by AdSense', () => {
            const ins = document.createElement('ins');
            ins.className = 'adsbygoogle';
            ins.setAttribute('data-adsbygoogle-status', 'done');
            document.body.appendChild(ins);

            mountAdUnit(ins);

            expect(window.adsbygoogle).toBeUndefined();
        });
    });

    describe('Premium / Ad-Free Removal', () => {
        it('removes all ad containers and sections when removeAllAds is called', () => {
            document.body.innerHTML = `
                <div class="site-ad-section"><div class="ad-container"><ins class="adsbygoogle"></ins></div></div>
                <div class="ad-container ad-bottom-banner"></div>
                <div class="ad-rail-wrapper"></div>
                <div class="ad-mobile-sticky"></div>
                <main class="content"><p>Protected Content</p></main>
            `;

            removeAllAds();

            expect(document.querySelector('.site-ad-section')).toBeNull();
            expect(document.querySelector('.ad-container')).toBeNull();
            expect(document.querySelector('.ad-rail-wrapper')).toBeNull();
            expect(document.querySelector('.ad-mobile-sticky')).toBeNull();
            expect(document.querySelector('.content')).not.toBeNull();
        });
    });

    describe('Compliance Pages Disclosure Verification', () => {
        it('verifies privacy.html contains Google AdSense, DoubleClick/DART disclosures, and opt-out link', () => {
            const privacyHtml = fs.readFileSync(path.join(ROOT_DIR, 'privacy.html'), 'utf8');
            expect(privacyHtml).toContain('Google AdSense');
            expect(privacyHtml.toLowerCase()).toContain('cookies');
            expect(privacyHtml).toContain('https://www.google.com/settings/ads');
            expect(privacyHtml).toContain('aboutads.info');
        });

        it('verifies terms.html mentions Google AdSense in Third-Party Integrations', () => {
            const termsHtml = fs.readFileSync(path.join(ROOT_DIR, 'terms.html'), 'utf8');
            expect(termsHtml).toContain('Google AdSense advertising');
            expect(termsHtml).toContain('https://www.google.com/settings/ads');
        });

        it('verifies about.html and contact.html exist and contain publisher disclosures', () => {
            const aboutHtml = fs.readFileSync(path.join(ROOT_DIR, 'about.html'), 'utf8');
            const contactHtml = fs.readFileSync(path.join(ROOT_DIR, 'contact.html'), 'utf8');
            expect(aboutHtml).toContain(ADSENSE_CLIENT_ID);
            expect(aboutHtml).toContain('About Unstoppable');
            expect(contactHtml).toContain(ADSENSE_CLIENT_ID);
            expect(contactHtml).toContain('Contact Us');
        });
    });

    describe('AdSense High-Value Content & Policy Standards Verification', () => {
        it('verifies dreams-timeskip-first-look.html is a substantial, fully-written editorial article', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'dreams-timeskip-first-look.html'), 'utf8');
            expect(html).toContain('A First Look at Dreams TimeSkip: The Road to 2027');
            expect(html).toContain('Catalin Andrian');
            expect(html).toContain('"@type": "Article"');
            expect(html).toContain('Table of Contents');
            // Ensure no empty stubs: article text must be substantial
            const textContent = html.replace(/<[^>]+>/g, ' ');
            const wordCount = textContent.split(/\s+/).filter(Boolean).length;
            expect(wordCount).toBeGreaterThan(600);
        });

        it('verifies medixly-hits.html is a substantial, fully-written editorial article', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly-hits.html'), 'utf8');
            expect(html).toContain("Medixly: How We Find the Internet's Biggest Hits");
            expect(html).toContain('Catalin Andrian');
            expect(html).toContain('"@type": "Article"');
            expect(html).toContain('Table of Contents');
            const textContent = html.replace(/<[^>]+>/g, ' ');
            const wordCount = textContent.split(/\s+/).filter(Boolean).length;
            expect(wordCount).toBeGreaterThan(600);
        });

        it('verifies sitemap.xml is clean, canonical, and contains zero redirect stubs', () => {
            const sitemap = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
            expect(sitemap).toContain('https://realunstoppable.store/dreams-timeskip-first-look.html');
            expect(sitemap).toContain('https://realunstoppable.store/medixly-hits.html');
            expect(sitemap).toContain('https://realunstoppable.store/about.html');
            expect(sitemap).toContain('https://realunstoppable.store/contact.html');
            // Instant redirect stubs must not be present
            expect(sitemap).not.toContain('uds.html');
            expect(sitemap).not.toContain('dreamstimeskip.html');
            expect(sitemap).not.toContain('shop.html');
        });

        it('verifies robots.txt explicitly allows Mediapartners-Google crawler', () => {
            const robots = fs.readFileSync(path.join(ROOT_DIR, 'robots.txt'), 'utf8');
            expect(robots).toContain('Mediapartners-Google');
            expect(robots).toContain('sitemap.xml');
        });

        it('verifies unstoppable.html has eliminated "coming soon" placeholders with ads', () => {
            const unstoppableHtml = fs.readFileSync(path.join(ROOT_DIR, 'unstoppable.html'), 'utf8');
            expect(unstoppableHtml).not.toContain('Coming Soon...');
        });
    });
});
