import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { OnboardingStateMachine } from '../dist/components/OnboardingStateMachine.js';

describe('Advanced Onboarding Architecture & Personalization Engine', () => {
    let onboardingJs;
    let onboardingCss;
    let medixlyJs;

    beforeAll(() => {
        onboardingJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly-onboarding.js'), 'utf8');
        onboardingCss = fs.readFileSync(path.resolve(process.cwd(), 'css/onboarding.css'), 'utf8');
        medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
    });

    describe('1. Multi-Step Onboarding Architecture & Progressive Disclosure', () => {
        test('Step 1 contains credentials, phone, date of birth, and OAuth buttons', () => {
            expect(onboardingJs).toContain('id="ob-username"');
            expect(onboardingJs).toContain('id="ob-email"');
            expect(onboardingJs).toContain('id="ob-phone"');
            expect(onboardingJs).toContain('type="tel"');
            expect(onboardingJs).toContain('id="ob-dob"');
            expect(onboardingJs).toContain('id="ob-password"');
            expect(onboardingJs).toContain('id="ob-google-btn"');
            expect(onboardingJs).toContain('Continue with Google');
            expect(onboardingJs).toContain('id="ob-try-first"');
        });

        test('Step 2 contains Role & Intent options (Listener, Creator, Artist, Explorer)', () => {
            expect(onboardingJs).toContain('data-role="listener"');
            expect(onboardingJs).toContain('data-role="creator"');
            expect(onboardingJs).toContain('data-role="artist"');
            expect(onboardingJs).toContain('data-role="explorer"');
            expect(onboardingJs).toContain('Video Editor / Content Creator');
            expect(onboardingJs).toContain('Artist / Producer');
        });

        test('Step 3 contains Acquisition Insights (TikTok, Instagram, YouTube, Friend, Search, Discord, Other)', () => {
            expect(onboardingJs).toContain('data-source="tiktok"');
            expect(onboardingJs).toContain('data-source="instagram"');
            expect(onboardingJs).toContain('data-source="youtube"');
            expect(onboardingJs).toContain('data-source="friend"');
            expect(onboardingJs).toContain('data-source="search"');
            expect(onboardingJs).toContain('data-source="discord"');
            expect(onboardingJs).toContain('data-source="other"');
        });

        test('Step 4 contains Platform Usage multi-select toggles', () => {
            expect(onboardingJs).toContain('data-platform="tiktok"');
            expect(onboardingJs).toContain('data-platform="instagram"');
            expect(onboardingJs).toContain('data-platform="youtube"');
            expect(onboardingJs).toContain('data-platform="twitch"');
            expect(onboardingJs).toContain('data-platform="twitter"');
        });

        test('Step 5 contains Genre Selection, SFX Needs, and Artist/Vibe chips', () => {
            expect(onboardingJs).toContain('data-genre="hiphop"');
            expect(onboardingJs).toContain('data-genre="lofi"');
            expect(onboardingJs).toContain('data-genre="electronic"');
            expect(onboardingJs).toContain('data-genre="pop"');
            expect(onboardingJs).toContain('data-genre="cinematic"');
            expect(onboardingJs).toContain('data-sfx="light"');
            expect(onboardingJs).toContain('data-sfx="moderate"');
            expect(onboardingJs).toContain('data-sfx="heavy"');
            expect(onboardingJs).toContain('data-chip="Lil Baby"');
            expect(onboardingJs).toContain('data-chip="Drake"');
            expect(onboardingJs).toContain('data-chip="Late Night Drive"');
        });
    });

    describe('2. UX & Micro-Interactions & Styling Compliance', () => {
        test('Includes progress bar track and dynamic percentage indicator', () => {
            expect(onboardingJs).toContain('id="ob-step-counter"');
            expect(onboardingJs).toContain('id="ob-progress-fill"');
            expect(onboardingJs).toContain('id="ob-step-dots"');
            expect(onboardingCss).toContain('.onboarding-progress-track');
            expect(onboardingCss).toContain('.onboarding-progress-fill');
            expect(onboardingCss).toContain('.onboarding-step-dot');
        });

        test('Provides Back and Skip navigation options across preference steps', () => {
            expect(onboardingJs).toContain('data-back-to');
            expect(onboardingJs).toContain('data-skip-to');
            expect(onboardingJs).toContain('Skip for now');
            expect(onboardingCss).toContain('.onboarding-back-btn');
            expect(onboardingCss).toContain('.onboarding-skip-btn');
        });

        test('Enforces Unstoppable dark-mode aesthetic with neon accents & accessibility focus rings', () => {
            expect(onboardingCss).toContain('--ob-accent-purple: #bb86fc');
            expect(onboardingCss).toContain('--ob-accent-pink: #ff79c6');
            expect(onboardingCss).toContain('--ob-accent-cyan: #00f2fe');
            expect(onboardingCss).toContain(':focus-visible');
        });
    });

    describe('3. Data Persistence & Recommendation Personalization Sync', () => {
        test('Persists collected attributes to Firestore and localStorage', () => {
            expect(onboardingJs).toMatch(/setDoc\(doc\(db,\s*"users",/);
            expect(onboardingJs).toContain('role:');
            expect(onboardingJs).toContain('acquisitionSource:');
            expect(onboardingJs).toContain('platforms:');
            expect(onboardingJs).toContain('genres:');
            expect(onboardingJs).toContain('sfxNeeds:');
            expect(onboardingJs).toContain('favoriteArtists:');
            expect(onboardingJs).toContain('onboardingCompleted: true');
            expect(onboardingJs).toContain('medixly_user_preferences');
            expect(onboardingJs).toContain('medixly:preferences-updated');
        });

        test('Medixly engine loads preferences and scores songs based on genres, artists, and role', () => {
            expect(medixlyJs).toContain('loadActiveUserPreferences');
            expect(medixlyJs).toContain('computePersonalizedScore');
            expect(medixlyJs).toContain('renderRecommendedSongs');
            expect(medixlyJs).toContain('medixly:preferences-updated');
            expect(medixlyJs).toContain('curated-mix');
            expect(medixlyJs).toContain('creator-vault');
            expect(medixlyJs).toContain('artist-spotlight');
        });
    });

    describe('4. State Machine Architecture Unit Verification', () => {
        test('Initializes with default step 1 and validates credentials', () => {
            const sm = new OnboardingStateMachine();
            expect(sm.getState().currentStep).toBe(1);

            // Incomplete step 1 validation
            const invalidResult = sm.validateStep(1);
            expect(invalidResult.valid).toBe(false);

            // Complete step 1
            sm.setAccount({
                username: 'producer_x',
                email: 'test@unstoppable.com',
                phone: '555-123-4567',
                dob: '2000-01-01'
            });
            const validResult = sm.validateStep(1);
            expect(validResult.valid).toBe(true);
        });

        test('Transitions through steps cleanly with state updates', () => {
            const sm = new OnboardingStateMachine();
            sm.setAccount({
                username: 'editor_pro',
                email: 'pro@medixly.io',
                phone: '555-987-6543',
                dob: '1998-05-12'
            });

            sm.nextStep();
            expect(sm.getState().currentStep).toBe(2);

            sm.setRole('creator');
            expect(sm.getState().role).toBe('creator');

            sm.nextStep();
            expect(sm.getState().currentStep).toBe(3);

            sm.setAcquisitionSource('tiktok');
            expect(sm.getState().acquisitionSource).toBe('tiktok');

            sm.nextStep();
            expect(sm.getState().currentStep).toBe(4);

            sm.togglePlatform('tiktok');
            sm.togglePlatform('youtube');
            expect(sm.getState().platforms).toEqual(['tiktok', 'youtube']);

            sm.nextStep();
            expect(sm.getState().currentStep).toBe(5);

            sm.toggleGenre('hiphop');
            sm.toggleGenre('cinematic');
            sm.setSfxNeeds('heavy');
            sm.toggleArtistOrVibe('Lil Baby');
            sm.toggleArtistOrVibe('Cinematic Hype');

            const exported = sm.exportPreferences();
            expect(exported.role).toBe('creator');
            expect(exported.acquisitionSource).toBe('tiktok');
            expect(exported.platforms).toContain('tiktok');
            expect(exported.genres).toContain('hiphop');
            expect(exported.genres).toContain('cinematic');
            expect(exported.sfxNeeds).toBe('heavy');
            expect(exported.favoriteArtists).toContain('Lil Baby');
            expect(exported.completed).toBe(true);

            // Test back navigation
            sm.prevStep();
            expect(sm.getState().currentStep).toBe(4);
            sm.prevStep();
            expect(sm.getState().currentStep).toBe(3);
        });
    });
});
