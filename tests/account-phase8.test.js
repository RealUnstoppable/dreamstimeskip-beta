/**
 * tests/account-phase8.test.js
 * Comprehensive Verification Suite for Phase 8:
 * 1. Smart Contrast-Aware Theme Engine (WCAG relative luminance calculation & CSS variables)
 * 2. Password-Locked Profile Fields & Re-Authentication Modal
 * 3. Expanded Security Settings (Session Management, Sign Out All Devices, Recent Activity Log)
 * 4. Multi-Step Deactivation Flow with Strict 'DEACTIVATE MY ACCOUNT' Phrase Confirmation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateLuminance, computeContrastVariables } from '../js/theme-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('PHASE 8: Account Adaptive Theme Engine, Password Locks & Deactivation Flow', () => {

    describe('1. Smart Contrast-Aware Theme Engine', () => {
        const themeLoaderJs = fs.readFileSync(path.join(rootDir, 'js', 'theme-loader.js'), 'utf-8');
        const accountHtml = fs.readFileSync(path.join(rootDir, 'account.html'), 'utf-8');

        test('calculateLuminance correctly computes WCAG relative luminance for extreme colors', () => {
            const whiteLum = calculateLuminance('#ffffff');
            const blackLum = calculateLuminance('#000000');
            const yellowLum = calculateLuminance('#ffff00');
            const blueLum = calculateLuminance('#2563eb');

            expect(whiteLum).toBeCloseTo(1.0, 1);
            expect(blackLum).toBeCloseTo(0.0, 1);
            expect(yellowLum).toBeGreaterThan(0.8);
            expect(blueLum).toBeLessThan(0.45);
        });

        test('computeContrastVariables flips button and surface text colors for high legibility', () => {
            const yellowContrast = computeContrastVariables('#ffff00', 'black');
            expect(yellowContrast['--btn-text']).toBe('#0a0a0c'); // Dark text on bright yellow
            expect(yellowContrast['--text-shadow']).not.toBe('none');

            const whiteContrast = computeContrastVariables('#ffffff', 'black');
            expect(whiteContrast['--btn-text']).toBe('#0a0a0c'); // Dark text on pure white

            const darkBlueContrast = computeContrastVariables('#1e3a8a', 'black');
            expect(darkBlueContrast['--btn-text']).toBe('#ffffff'); // White text on dark blue

            const lightThemeContrast = computeContrastVariables('#2563eb', 'white');
            expect(lightThemeContrast['--text-primary']).toBe('#0f172a'); // Dark text on light surface
            expect(lightThemeContrast['--bg-surface']).toBe('#f8fafc');
        });

        test('account.html has Theme Preset selector, Custom Hex Color, Save Theme, and Reset to Default', () => {
            expect(accountHtml).toContain('id="theme-select"');
            expect(accountHtml).toContain('id="custom-hex-color"');
            expect(accountHtml).toContain('id="save-theme-btn"');
            expect(accountHtml).toContain('id="reset-theme-btn"');
        });
    });

    describe('2. Password-Locked Profile Fields & Re-Authentication Modal', () => {
        const accountHtml = fs.readFileSync(path.join(rootDir, 'account.html'), 'utf-8');
        const accountJs = fs.readFileSync(path.join(rootDir, 'js', 'account.js'), 'utf-8');

        test('account.html has lock icons (🔒) on profile fields and locked-profile-field readonly class', () => {
            expect(accountHtml).toContain('profile-field-lock');
            expect(accountHtml).toContain('locked-profile-field');
            expect(accountHtml).toMatch(/<input[^>]*id="update-username"[^>]*readonly/);
            expect(accountHtml).toMatch(/<input[^>]*id="update-phone"[^>]*readonly/);
            expect(accountHtml).toMatch(/<input[^>]*id="social-discord"[^>]*readonly/);
        });

        test('account.html contains Re-Authentication Modal (#reauth-modal)', () => {
            expect(accountHtml).toContain('id="reauth-modal"');
            expect(accountHtml).toContain('id="reauth-password-input"');
            expect(accountHtml).toContain('id="confirm-reauth-btn"');
        });

        test('account.js implements initPasswordLockedFields unlocking mechanism', () => {
            expect(accountJs).toContain('initPasswordLockedFields');
            expect(accountJs).toContain('window.__profileEditingUnlocked');
            expect(accountJs).toContain("lock.textContent = '🔓'");
        });
    });

    describe('3. Expanded Security Settings (Session Management & Audit Log)', () => {
        const accountHtml = fs.readFileSync(path.join(rootDir, 'account.html'), 'utf-8');
        const accountJs = fs.readFileSync(path.join(rootDir, 'js', 'account.js'), 'utf-8');

        test('account.html includes Session Management card and Sign Out All Devices button', () => {
            expect(accountHtml).toContain('id="session-management-card"');
            expect(accountHtml).toContain('id="sign-out-all-devices-btn"');
            expect(accountHtml).toContain('Sign Out of All Devices');
        });

        test('account.html includes Recent Security Activity card with audit events', () => {
            expect(accountHtml).toContain('id="security-activity-card"');
            expect(accountHtml).toContain('Recent Security Activity');
            expect(accountHtml).toContain('Successful Sign-In');
        });

        test('account.js wires sign-out-all-devices-btn', () => {
            expect(accountJs).toContain('sign-out-all-devices-btn');
            expect(accountJs).toContain('Sign out of all active devices?');
        });
    });

    describe('4. Multi-Step Deactivation Flow with Exact Phrase Confirmation', () => {
        const accountHtml = fs.readFileSync(path.join(rootDir, 'account.html'), 'utf-8');
        const accountJs = fs.readFileSync(path.join(rootDir, 'js', 'account.js'), 'utf-8');

        test('account.html contains deactivation confirmation phrase input', () => {
            expect(accountHtml).toContain('id="deactivate-popup-phrase"');
            expect(accountHtml).toContain('DEACTIVATE MY ACCOUNT');
        });

        test('account.js strictly validates phrase "DEACTIVATE MY ACCOUNT" before allowing deactivation', () => {
            expect(accountJs).toContain("phrase !== 'DEACTIVATE MY ACCOUNT'");
            expect(accountJs).toContain('Please type "DEACTIVATE MY ACCOUNT" exactly to confirm.');
            expect(accountJs).toContain('deactivated: true');
        });
    });
});
