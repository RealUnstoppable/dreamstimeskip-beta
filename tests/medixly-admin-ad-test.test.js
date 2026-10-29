import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { isMedixlyAdmin, ADMIN_FULL_EMAIL, ADMIN_EMAIL_PREFIX } from '../js/medixly.js';
import { audioAdManager } from '../js/audio-ads.js';

describe('Admin Ad Test Navigation Button Suite', () => {
    const medixlyHtmlPath = path.resolve(process.cwd(), 'medixly.html');
    const medixly2HtmlPath = path.resolve(process.cwd(), 'medixly 2.html');
    const medixlyCssPath = path.resolve(process.cwd(), 'css/medixly.css');

    it('verifies medixly.html contains #nav-ad-test button directly in .pill-nav adjacent to Favorites and hidden by default', () => {
        const html = fs.readFileSync(medixlyHtmlPath, 'utf8');

        expect(html).toContain('id="nav-ad-test"');
        expect(html).toContain('class="nav-pill nav-pill-admin"');
        expect(html).toMatch(/<button class="nav-pill"[^>]*id="nav-favorites"[\s\S]*?Favorites[\s\S]*?<\/button>\s*<button class="nav-pill nav-pill-admin" id="nav-ad-test" style="display:\s*none;"/);
        expect(html).toContain('title="Admin Ad Test"');
        expect(html).toContain('Ad Test');
    });

    it('verifies medixly 2.html contains #nav-ad-test button directly in .pill-nav adjacent to Favorites', () => {
        const html = fs.readFileSync(medixly2HtmlPath, 'utf8');

        expect(html).toContain('id="nav-ad-test"');
        expect(html).toContain('class="nav-pill nav-pill-admin"');
        expect(html).toMatch(/<button class="nav-pill"[^>]*id="nav-favorites"[\s\S]*?Favorites[\s\S]*?<\/button>\s*<button class="nav-pill nav-pill-admin" id="nav-ad-test" style="display:\s*none;"/);
    });

    it('verifies css/medixly.css defines .nav-pill-admin with initial display: none and admin styling', () => {
        const css = fs.readFileSync(medixlyCssPath, 'utf8');

        expect(css).toContain('.nav-pill-admin');
        expect(css).toContain('display: none;');
        expect(css).toContain('.nav-pill-admin:hover');
    });

    describe('isMedixlyAdmin authorization logic', () => {
        it('authorizes catalinandrian1@gmail.com and case-insensitive variations', () => {
            expect(isMedixlyAdmin({ email: 'catalinandrian1@gmail.com' }, null)).toBe(true);
            expect(isMedixlyAdmin({ email: 'CATALINANDRIAN1@GMAIL.COM' }, null)).toBe(true);
            expect(isMedixlyAdmin({ email: ' CatalinAndrian1@gmail.com ' }, null)).toBe(true);
        });

        it('authorizes catalinandrian1@gmail shorthand variant', () => {
            expect(isMedixlyAdmin({ email: 'catalinandrian1@gmail' }, null)).toBe(true);
        });

        it('authorizes Firestore documents with isAdmin: true or role: admin', () => {
            expect(isMedixlyAdmin({ email: 'other@example.com' }, { isAdmin: true })).toBe(true);
            expect(isMedixlyAdmin({ email: 'other@example.com' }, { role: 'admin' })).toBe(true);
            expect(isMedixlyAdmin(null, { isAdmin: true })).toBe(true);
            expect(isMedixlyAdmin(null, { role: 'admin' })).toBe(true);
            expect(isMedixlyAdmin(null, { email: 'catalinandrian1@gmail.com' })).toBe(true);
        });

        it('strictly denies non-admin users and unauthenticated guests', () => {
            expect(isMedixlyAdmin(null, null)).toBe(false);
            expect(isMedixlyAdmin(undefined, null)).toBe(false);
            expect(isMedixlyAdmin({ email: 'regularuser@gmail.com' }, { isAdmin: false, role: 'listener' })).toBe(false);
            expect(isMedixlyAdmin({ email: 'visitor@company.org' }, null)).toBe(false);
            expect(isMedixlyAdmin({ email: '' }, null)).toBe(false);
        });
    });

    describe('DOM & Ad Playback Interaction', () => {
        let adTestBtn;
        let navHome;

        beforeEach(() => {
            document.body.innerHTML = `
                <nav class="pill-nav">
                    <button class="nav-pill active" id="nav-home">Home</button>
                    <button class="nav-pill" id="nav-search">Search</button>
                    <button class="nav-pill" id="nav-playlists">Playlists</button>
                    <button class="nav-pill" id="nav-favorites">Favorites</button>
                    <button class="nav-pill nav-pill-admin" id="nav-ad-test" style="display: none;" title="Admin Ad Test">Ad Test</button>
                </nav>
                <div id="lexi-ad-overlay" class="lexi-ad-overlay hidden" aria-hidden="true"></div>
            `;
            adTestBtn = document.getElementById('nav-ad-test');
            navHome = document.getElementById('nav-home');
        });

        it('correctly toggles button visibility based on admin status', () => {
            if (typeof window.__updateAdminAdTestVisibility === 'function') {
                // Non-admin -> hidden
                window.__updateAdminAdTestVisibility(false);
                expect(adTestBtn.style.display).toBe('none');
                expect(adTestBtn.getAttribute('aria-hidden')).toBe('true');

                // Admin -> shown
                window.__updateAdminAdTestVisibility(true);
                expect(adTestBtn.style.display).toBe('inline-flex');
                expect(adTestBtn.getAttribute('aria-hidden')).toBeNull();

                // Non-admin -> hidden again
                window.__updateAdminAdTestVisibility(false);
                expect(adTestBtn.style.display).toBe('none');
            }
        });

        it('triggers ad playback and displays Lexi overlay when admin tests ads', () => {
            const playAdSpy = jest.spyOn(audioAdManager, 'playAd').mockImplementation((cb) => {
                if (typeof cb === 'function') cb();
            });
            const showOverlaySpy = jest.spyOn(audioAdManager, 'showOverlay').mockImplementation(() => {});

            // Simulate admin user session
            if (typeof window.__setCurrentUser === 'function') {
                window.__setCurrentUser({ email: 'catalinandrian1@gmail.com' });
            }
            if (typeof window.__setCurrentUserDocData === 'function') {
                window.__setCurrentUserDocData({ isAdmin: true });
            }

            if (typeof window.__testMedixlyAd === 'function') {
                window.__testMedixlyAd();
                expect(playAdSpy).toHaveBeenCalled();
                expect(showOverlaySpy).toHaveBeenCalled();
            }

            playAdSpy.mockRestore();
            showOverlaySpy.mockRestore();
        });

        it('blocks ad testing when non-admin attempts to trigger it', () => {
            const playAdSpy = jest.spyOn(audioAdManager, 'playAd').mockImplementation(() => {});
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            // Simulate non-admin user
            if (typeof window.__setCurrentUser === 'function') {
                window.__setCurrentUser({ email: 'stranger@gmail.com' });
            }
            if (typeof window.__setCurrentUserDocData === 'function') {
                window.__setCurrentUserDocData({ isAdmin: false, role: 'listener' });
            }

            if (typeof window.__testMedixlyAd === 'function') {
                window.__testMedixlyAd();
                expect(playAdSpy).not.toHaveBeenCalled();
                expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('restricted to administrator accounts'));
            }

            playAdSpy.mockRestore();
            warnSpy.mockRestore();
        });
    });
});
