import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Medixly Desktop Audio Engine, Ad-Locking & Endless Queue Suite', () => {

    describe('Phase 1: Audio Engine Refactor, Mutual Exclusion & 5s Crossfading', () => {
        let AudioMixEngine, AudioPlaybackLock, EQ_PRESETS;

        beforeEach(async () => {
            const engineModule = await import('../js/audio-engine.js');
            AudioMixEngine = engineModule.AudioMixEngine;
            AudioPlaybackLock = engineModule.AudioPlaybackLock;
            EQ_PRESETS = engineModule.EQ_PRESETS;
        });

        it('should initialize AudioPlaybackLock with strict mutual exclusion states', () => {
            const mockEngine = { ctx: { currentTime: 0 } };
            const lock = new AudioPlaybackLock(mockEngine);

            expect(lock.state).toBe('idle');
            expect(lock.isAdLocked).toBe(false);

            // Acquire ad lock
            const acquired = lock.acquireAdLock({ source: 'audio-ad' });
            expect(acquired).toBe(true);
            expect(lock.state).toBe('ad');
            expect(lock.isAdLocked).toBe(true);

            // Attempting to acquire song playback while ad lock is active should be rejected
            const songAcquired = lock.acquireSongPlayback({ trackId: 'song-1' });
            expect(songAcquired).toBe(false);
            expect(lock.state).toBe('ad');

            // Release ad lock
            lock.releaseAdLock();
            expect(lock.isAdLocked).toBe(false);
            expect(lock.state).toBe('idle');

            // Song playback can now be acquired
            const songAcquiredAfter = lock.acquireSongPlayback({ trackId: 'song-1' });
            expect(songAcquiredAfter).toBe(true);
            expect(lock.state).toBe('song');
        });

        it('should enforce default 5-second crossfade duration', () => {
            const engine = new AudioMixEngine();
            expect(engine.defaultCrossfadeDuration).toBe(5);

            // Test custom duration clamping
            engine.setCrossfadeDuration(8);
            expect(engine.defaultCrossfadeDuration).toBe(8);

            engine.setCrossfadeDuration(5);
            expect(engine.defaultCrossfadeDuration).toBe(5);
        });

        it('should support curated sound profile EQ presets and custom 3-band adjustments', () => {
            expect(EQ_PRESETS.flat).toBeDefined();
            expect(EQ_PRESETS.bass_boost).toEqual(expect.objectContaining({ bass: 7 }));
            expect(EQ_PRESETS.vocal).toEqual(expect.objectContaining({ mid: 5 }));
            expect(EQ_PRESETS.electronic).toEqual(expect.objectContaining({ bass: 6, treble: 5 }));

            const engine = new AudioMixEngine();
            expect(engine.activeSoundProfile).toBe('flat');

            // Applying preset updates sound profile state
            engine.applySoundProfile('bass_boost');
            expect(engine.activeSoundProfile).toBe('bass_boost');
            const profile = engine.getSoundProfile();
            expect(profile.activeProfile).toBe('bass_boost');
            expect(profile.preset.bass).toBe(7);

            // Custom EQ overload supports (bass, mid, treble)
            const custom = engine.setEQ(3, 1, 4);
            expect(custom.bass).toBe(3);
            expect(custom.mid).toBe(1);
            expect(custom.treble).toBe(4);
        });

        it('should crossfade smoothly between ad and song with strict mutual exclusion and 5s duration', (done) => {
            const engine = new AudioMixEngine();
            const lock = engine.playbackLock;

            // Simulate ad audio element and song audio element
            const mockAdAudio = {
                volume: 1,
                pause: jest.fn(),
                play: jest.fn().mockResolvedValue(undefined)
            };
            const mockSongAudio = {
                volume: 0,
                pause: jest.fn(),
                play: jest.fn().mockResolvedValue(undefined)
            };

            // Acquire ad lock
            lock.acquireAdLock({ source: 'ad-unit' });
            expect(lock.isAdLocked).toBe(true);

            // Trigger crossfade from ad to song (using fast 0.05s duration in test)
            engine.crossfadeAdToSong(mockAdAudio, mockSongAudio, 0.05, () => {
                expect(mockAdAudio.pause).toHaveBeenCalled();
                expect(mockSongAudio.play).toHaveBeenCalled();
                expect(lock.isAdLocked).toBe(false);
                expect(lock.state).toBe('song');
                done();
            });
        });
    });

    describe('Phase 1 (Continued): Ad-Skipping Prevention & UI Control Locking', () => {
        let AudioAdManager;

        beforeEach(async () => {
            const adsModule = await import('../js/audio-ads.js');
            AudioAdManager = adsModule.AudioAdManager;

            document.body.innerHTML = `
                <button id="next-btn">Next</button>
                <button id="prev-btn">Prev</button>
                <button id="fs-next-btn">FS Next</button>
                <button id="fs-prev-btn">FS Prev</button>
                <button id="mob-next-btn">Mob Next</button>
                <button id="mob-prev-btn">Mob Prev</button>
                <button id="viral-skip-btn">Skip</button>
                <div class="progress-bar" id="progress-bar"></div>
                <div id="fs-progress-bar"></div>
            `;
        });

        it('should strictly disable next, prev, and seek buttons while ad payload is active', () => {
            const manager = new AudioAdManager();

            // Lock controls
            manager.setControlsLocked(true);
            expect(manager.controlsLocked).toBe(true);

            const nextBtn = document.getElementById('next-btn');
            const prevBtn = document.getElementById('prev-btn');
            const fsNextBtn = document.getElementById('fs-next-btn');
            const fsPrevBtn = document.getElementById('fs-prev-btn');
            const mobNextBtn = document.getElementById('mob-next-btn');
            const mobPrevBtn = document.getElementById('mob-prev-btn');
            const skipBtn = document.getElementById('viral-skip-btn');
            const progressBar = document.getElementById('progress-bar');
            const fsProgressBar = document.getElementById('fs-progress-bar');

            expect(nextBtn.disabled).toBe(true);
            expect(nextBtn.classList.contains('ad-locked')).toBe(true);
            expect(prevBtn.disabled).toBe(true);
            expect(fsNextBtn.disabled).toBe(true);
            expect(fsPrevBtn.disabled).toBe(true);
            expect(mobNextBtn.disabled).toBe(true);
            expect(mobPrevBtn.disabled).toBe(true);
            expect(skipBtn.disabled).toBe(true);

            expect(progressBar.classList.contains('ad-locked')).toBe(true);
            expect(progressBar.classList.contains('seek-disabled')).toBe(true);
            expect(fsProgressBar.classList.contains('ad-locked')).toBe(true);
            expect(fsProgressBar.classList.contains('seek-disabled')).toBe(true);

            // Unlock controls when ad completes
            manager.setControlsLocked(false);
            expect(manager.controlsLocked).toBe(false);
            expect(nextBtn.disabled).toBe(false);
            expect(nextBtn.classList.contains('ad-locked')).toBe(false);
            expect(progressBar.classList.contains('seek-disabled')).toBe(false);
        });

        it('should pause any active song audio immediately upon playAd() to prevent first-click overlap', () => {
            const manager = new AudioAdManager();
            const pauseSongMock = jest.fn();
            window.__getActiveAudio = () => ({ pause: pauseSongMock });

            manager.playAd(() => {});

            expect(pauseSongMock).toHaveBeenCalled();
            expect(manager.controlsLocked).toBe(true);

            manager.completeAd();
            expect(manager.controlsLocked).toBe(false);
            delete window.__getActiveAudio;
        });
    });

    describe('Phase 2: Recommendation Logic & Early Endless Queue Triggering', () => {
        let EndlessQueueManager;

        beforeEach(async () => {
            const recModule = await import('../js/recommendation-engine.js');
            EndlessQueueManager = recModule.EndlessQueueManager;
        });

        it('should trigger early enough in track lifecycle to buffer next track before 5s crossfade', () => {
            const manager = new EndlessQueueManager();
            manager.setEnabled(true);

            // Track duration 180s, current time 5s, upcoming count 0 -> should not trigger yet
            expect(manager.shouldTriggerEarly(5, 180, 0)).toBe(false);

            // At 10s playback -> triggers early preloading
            expect(manager.shouldTriggerEarly(10, 180, 0)).toBe(true);

            // 20s before song end (remaining <= 25s) -> triggers early preloading
            expect(manager.shouldTriggerEarly(165, 180, 0)).toBe(true);

            // If an upcoming track is already queued (upcomingCount > 0) -> does not trigger redundant queue
            expect(manager.shouldTriggerEarly(165, 180, 1)).toBe(false);

            // If endless queue is disabled -> never triggers
            manager.setEnabled(false);
            expect(manager.shouldTriggerEarly(165, 180, 0)).toBe(false);
        });

        it('should auto-queue next track from profile preferences and pre-buffer idle deck', async () => {
            const sampleSongs = [
                { id: 'song-current', title: 'Current Song', genre: 'Pop', energy: 0.7, bpm: 120, src: 'music/curr.mp3' },
                { id: 'song-rec-1', title: 'Recommended Hit', genre: 'Pop', energy: 0.8, bpm: 124, src: 'music/rec1.mp3' },
                { id: 'song-rec-2', title: 'Acoustic Track', genre: 'Acoustic', energy: 0.3, bpm: 80, src: 'music/rec2.mp3' }
            ];

            const manager = new EndlessQueueManager();
            manager.setLibrarySongs(sampleSongs);
            manager.setUserProfile({ preferredGenres: ['Pop'], listeningHistory: ['song-current'] });

            const currentQueue = [sampleSongs[0]];
            const idleAudio = { src: '', load: jest.fn() };

            const queuedTrack = await manager.autoQueueNextTrackWithContext({
                manualQueue: [],
                currentQueue,
                currentSongIndex: 0,
                recentHistory: ['song-current'],
                idleAudio
            });

            expect(queuedTrack).toBeDefined();
            expect(queuedTrack.id).toBe('song-rec-1');
            expect(currentQueue.length).toBe(2);
            expect(currentQueue[1].id).toBe('song-rec-1');
            expect(idleAudio.src).toBe('music/rec1.mp3');
            expect(idleAudio.load).toHaveBeenCalled();
        });
    });

    describe('Phase 3: Desktop-Only Architecture & Header Redesign', () => {
        let loadNavbar, initSettingsModal, openMedixlySettingsModal, closeMedixlySettingsModal;

        beforeEach(async () => {
            const navModule = await import('../js/navbar.js');
            loadNavbar = navModule.loadNavbar;
            initSettingsModal = navModule.initSettingsModal;
            openMedixlySettingsModal = navModule.openMedixlySettingsModal;
            closeMedixlySettingsModal = navModule.closeMedixlySettingsModal;

            // Setup DOM
            document.body.innerHTML = `
                <header class="main-header"></header>
                <div id="medixly-settings-modal" class="medixly-auth-modal hidden" aria-hidden="true">
                    <div id="medixly-settings-backdrop"></div>
                    <button id="medixly-settings-close-btn"></button>
                    <div id="medixly-eq-presets">
                        <button class="medixly-preset-btn active" data-preset="flat">Flat</button>
                        <button class="medixly-preset-btn" data-preset="bass_boost">Bass</button>
                        <button class="medixly-preset-btn" data-preset="vocal">Vocal</button>
                    </div>
                    <input type="range" id="eq-slider-bass" value="0">
                    <span id="eq-val-bass">+0 dB</span>
                    <input type="range" id="eq-slider-mid" value="0">
                    <span id="eq-val-mid">+0 dB</span>
                    <input type="range" id="eq-slider-treble" value="0">
                    <span id="eq-val-treble">+0 dB</span>
                    <div id="medixly-crossfade-selector">
                        <button class="crossfade-pill" data-duration="3">3s</button>
                        <button class="crossfade-pill active" data-duration="5">5s</button>
                        <button class="crossfade-pill" data-duration="8">8s</button>
                    </div>
                    <div id="medixly-app-version-box">
                        <span id="medixly-app-version-tag">v1.1.0</span>
                        <span id="medixly-update-status">Up to date</span>
                        <button id="medixly-check-update-btn">Check for Updates</button>
                        <div id="medixly-update-message" class="hidden"></div>
                    </div>
                </div>
            `;
        });

        it('should strip out web Google AdSense tags from medixly.html', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).not.toContain('adsbygoogle.js');
            expect(html).not.toContain('ca-pub-4254213062632381');
            expect(html).not.toContain('google-adsense-account');
        });

        it('should render the redesigned desktop header with ONLY Medixly logo on left and Sign In, Notifications, Memberships, Settings on right', () => {
            window.history.pushState({}, '', '/medixly.html');

            loadNavbar();

            const header = document.querySelector('.main-header');
            expect(header).toBeDefined();

            // Left side
            const navLeft = header.querySelector('.medixly-nav-left');
            expect(navLeft).toBeDefined();
            const brandLockup = navLeft.querySelector('.medixly-brand-lockup');
            expect(brandLockup).toBeDefined();
            expect(brandLockup.innerHTML).toContain('Medixly');
            expect(brandLockup.innerHTML).toMatch(/BY un|by Unstoppable/i);
            expect(brandLockup.querySelector('#medixly-navbar-logo')).toBeDefined();

            // Right side
            const navRight = header.querySelector('.medixly-nav-right');
            expect(navRight).toBeDefined();

            // Verify aligned right side buttons
            const signInBtn = navRight.querySelector('#auth-link');
            const notifBtn = navRight.querySelector('#notification-bell-btn');
            const membershipsBtn = navRight.querySelector('#nav-upgrade-btn, #nav-memberships-btn');
            const settingsBtn = navRight.querySelector('#header-settings-btn');

            expect(signInBtn).toBeDefined();
            expect(notifBtn).toBeDefined();
            expect(membershipsBtn).toBeDefined();
            expect(settingsBtn).toBeDefined();
        });

        it('Phase 2 Verification Gate: Medixly header, collapsible ecosystem bar, admin toolbar & Get App', () => {
            window.history.pushState({}, '', '/medixly.html');
            loadNavbar();

            const header = document.querySelector('.main-header');
            expect(header).toBeDefined();

            // 1. Verify MedixlyBY un brand lockup and URL
            const brandLockup = header.querySelector('.medixly-brand-lockup');
            expect(brandLockup).toBeDefined();
            expect(brandLockup.getAttribute('href')).toBe('https://realunstoppable.store/medixly.html');
            expect(brandLockup.querySelector('.medixly-brand-subtitle').textContent.trim()).toBe('BY un');

            // 2. Verify Upgrade ($0.99 Today) button in header
            const upgradeBtn = header.querySelector('#nav-upgrade-btn');
            expect(upgradeBtn).toBeDefined();
            expect(upgradeBtn.getAttribute('href')).toBe('https://realunstoppable.store/medixly-pricing.html');
            expect(upgradeBtn.textContent).toContain('Upgrade ($0.99 Today)');

            // 3. Verify expandable > ecosystem arrow toggle button
            const ecoToggle = header.querySelector('#medixly-ecosystem-toggle');
            expect(ecoToggle).toBeDefined();
            const ecoDrawer = header.querySelector('#medixly-ecosystem-drawer');
            expect(ecoDrawer).toBeDefined();
            expect(ecoDrawer.classList.contains('is-open')).toBe(false);

            // Toggle open
            ecoToggle.click();
            expect(ecoDrawer.classList.contains('is-open')).toBe(true);
            expect(ecoToggle.classList.contains('active')).toBe(true);

            // Verify ecosystem drawer links
            const track = ecoDrawer.querySelector('.medixly-ecosystem-track');
            expect(track).toBeDefined();
            const links = Array.from(track.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
            expect(links).toEqual(expect.arrayContaining([
                { text: 'Home', href: 'https://realunstoppable.store/index.html' },
                { text: 'Unstoppable', href: 'https://realunstoppable.store/unstoppable.html' },
                { text: 'Dreams TimeSkip', href: 'https://realunstoppable.store/dts.html' },
                { text: 'Shop', href: 'https://realunstoppable.store/store.html' },
                { text: 'Cart', href: 'https://realunstoppable.store/cart.html' },
                { text: 'Blog', href: 'https://realunstoppable.store/blog.html' },
                { text: 'Autolux', href: 'https://autolux.realunstoppable.store/' }
            ]));

            // Toggle close
            ecoToggle.click();
            expect(ecoDrawer.classList.contains('is-open')).toBe(false);

            // 4. Parity check on medixly-pricing.html
            window.history.pushState({}, '', '/medixly-pricing.html');
            loadNavbar();
            const pricingHeader = document.querySelector('.main-header');
            expect(pricingHeader.querySelector('.medixly-desktop-navbar')).toBeDefined();
            expect(pricingHeader.querySelector('.medixly-brand-subtitle').textContent.trim()).toBe('BY un');
            expect(pricingHeader.querySelector('#nav-upgrade-btn')).toBeDefined();
            expect(pricingHeader.querySelector('#medixly-ecosystem-drawer')).toBeDefined();

            // 5. HTML check for Artist Upload toolbar positioning directly between Ad Test and For Editors
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
            expect(html).toContain('id="nav-artist-upload"');
            expect(html).toContain('id="nav-get-app"');
            expect(html).toMatch(/id="nav-ad-test"[\s\S]*?id="nav-artist-upload"[\s\S]*?id="nav-editors"[\s\S]*?id="nav-get-app"/);
            expect(html).not.toMatch(/class="greet-actions"[\s\S]*?Artist Upload/); // Removed from public greet-actions
        });

        it('should open and close Settings modal, update EQ presets and crossfade durations', () => {
            window.history.pushState({}, '', '/medixly.html');
            loadNavbar();

            const settingsBtn = document.getElementById('header-settings-btn');
            const settingsModal = document.getElementById('medixly-settings-modal');

            expect(settingsModal.classList.contains('hidden')).toBe(true);

            // Click settings button in header
            settingsBtn.click();
            expect(settingsModal.classList.contains('hidden')).toBe(false);
            expect(settingsModal.getAttribute('aria-hidden')).toBe('false');

            // Close modal
            const closeBtn = document.getElementById('medixly-settings-close-btn');
            closeBtn.click();
            expect(settingsModal.classList.contains('hidden')).toBe(true);

            // Re-open and test preset button click
            openMedixlySettingsModal();
            const bassBtn = document.querySelector('#medixly-eq-presets button[data-preset="bass_boost"]');
            bassBtn.click();
            expect(bassBtn.classList.contains('active')).toBe(true);

            // Test crossfade pill click
            const pill8s = document.querySelector('#medixly-crossfade-selector button[data-duration="8"]');
            pill8s.click();
            expect(pill8s.classList.contains('active')).toBe(true);
            expect(window.__medixlyCrossfadeDuration).toBe(8);

            closeMedixlySettingsModal();
            expect(settingsModal.classList.contains('hidden')).toBe(true);
        });

        it('should contain the Check for Updates versioning button inside the Settings modal in medixly.html', () => {
            const html = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');

            expect(html).toContain('id="medixly-settings-modal"');
            expect(html).toContain('id="medixly-app-version-box"');
            expect(html).toContain('id="medixly-check-update-btn"');
            expect(html).toContain('id="medixly-app-version-tag"');
            expect(html).toContain('id="medixly-update-status"');
            expect(html).toContain('Sound Profile & Equalizer');
            expect(html).toContain('Seamless Crossfade');
            expect(html).toContain('Application & Updates');
        });
    });
});
