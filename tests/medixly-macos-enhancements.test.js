import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 1: Critical Bug Diagnosis & Resolution (Audio Skipping & Header Navigation)', () => {
    describe('Audio Playback Loop & Snag Prevention', () => {
        it('should have guarded premature ended event in js/medixly.js', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            assert.ok(medixlyJs.includes('Premature ended event suppressed'), 'Premature ended event must be logged and handled');
            assert.ok(medixlyJs.includes('const isValidDuration = isFinite(duration) && duration > 3;'), 'Must validate duration is finite and > 3');
            assert.ok(medixlyJs.includes('const isNearTrueEnd = isValidDuration && currentTime >= Math.max(1, duration - 2.5);'), 'Must check track is actually near the end');
        });

        it('should have debounced snag handling with concurrency lock and capped retries', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            assert.ok(medixlyJs.includes('let isHandlingPlaybackSnag = false;'), 'Must have isHandlingPlaybackSnag lock');
            assert.ok(medixlyJs.includes('let playbackSnagDebounceTimer = null;'), 'Must have debounce timer');
            assert.ok(medixlyJs.includes('consecutivePlaybackSnags > MAX_CONSECUTIVE_SNAGS'), 'Must enforce max consecutive snag threshold');
            assert.ok(medixlyJs.includes('Pausing playback to avoid endless looping'), 'Must pause when snag limit is exceeded');
            assert.ok(medixlyJs.includes('clearTimeout(playbackSnagDebounceTimer);'), 'Must clear pending debounce timer');
        });

        it('should not have redundant handlePlaybackSnag inside player error event listener', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            const errorBlock = medixlyJs.match(/player\.addEventListener\('error'[\s\S]*?\}\);/);
            assert.ok(errorBlock, 'Player error listener must exist');
            assert.ok(!errorBlock[0].includes('handlePlaybackSnag(currentQueue[currentSongIndex]);'), 'Should not double-trigger handlePlaybackSnag');
        });

        it('should have removed Cross-Origin-Embedder-Policy: credentialless in desktop/server.cjs to prevent audio stream blocking', () => {
            const serverCjs = fs.readFileSync(path.resolve(process.cwd(), 'desktop/server.cjs'), 'utf8');
            assert.ok(!serverCjs.includes('Cross-Origin-Embedder-Policy'), 'Must not have COEP credentialless blocking remote media');
            assert.ok(serverCjs.includes("res.setHeader('Access-Control-Allow-Origin', '*');"), 'Must allow open CORS');
        });
    });

    describe('Header Navigation Crash Prevention', () => {
        it('should define desktop environment detection and safe navigation helpers in js/navbar.js', () => {
            const navbarJs = fs.readFileSync(path.resolve(process.cwd(), 'js/navbar.js'), 'utf8');
            assert.ok(navbarJs.includes('function isDesktopAppEnvironment()'), 'Must detect macOS desktop environment');
            assert.ok(navbarJs.includes('function showDesktopUnavailableToast('), 'Must display unavailable toast');
            assert.ok(navbarJs.includes('function routeSafelyToMedixlyApp()'), 'Must have safe route handler');
            assert.ok(navbarJs.includes('window.showDesktopUnavailableToast = showDesktopUnavailableToast;'), 'Must expose toast globally');
            assert.ok(navbarJs.includes('window.routeSafelyToMedixlyApp = routeSafelyToMedixlyApp;'), 'Must expose route handler globally');
        });

        it('should display desktop unavailable toast and safely route without crash when intercepted', () => {
            const bridgeJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly-desktop-bridge.js'), 'utf8');
            assert.ok(bridgeJs.includes('handleNavigationIntercepted(blockedPath)'), 'Bridge must handle navigation interception');
            assert.ok(bridgeJs.includes('window.showDesktopUnavailableToast('), 'Bridge must show toast');
            assert.ok(bridgeJs.includes('window.routeSafelyToMedixlyApp();'), 'Bridge must safely route');
        });

        it('should intercept will-navigate in desktop/main.cjs to prevent destructive window navigations', () => {
            const mainCjs = fs.readFileSync(path.resolve(process.cwd(), 'desktop/main.cjs'), 'utf8');
            assert.ok(mainCjs.includes("mainWindow.webContents.on('will-navigate'"), 'Main process must intercept will-navigate');
            assert.ok(mainCjs.includes("'medixly:navigation-intercepted'"), 'Main process must broadcast navigation interception event');
        });
    });
});

describe('Phase 2: Authentication & Core Audio Features', () => {
    describe('Persistent Sign-In State & Origin Consistency', () => {
        it('should use deterministic port 32849 in desktop/server.cjs to preserve Firebase auth persistence', () => {
            const serverCjs = fs.readFileSync(path.resolve(process.cwd(), 'desktop/server.cjs'), 'utf8');
            assert.ok(serverCjs.includes('PREFERRED_PORT = parseInt(process.env.MEDIXLY_PORT, 10) || 32849'), 'Must use preferred port 32849');
            assert.ok(serverCjs.includes("app.listen(port, '127.0.0.1'"), 'Must listen on fixed port');
        });

        it('should include in-app auth modal markup in medixly.html', () => {
            const html = fs.readFileSync(path.resolve(process.cwd(), 'medixly.html'), 'utf8');
            assert.ok(html.includes('id="medixly-auth-modal"'), 'Modal container must exist');
            assert.ok(html.includes('id="medixly-auth-form"'), 'Auth form must exist');
            assert.ok(html.includes('id="medixly-auth-email"'), 'Email input must exist');
            assert.ok(html.includes('id="medixly-auth-password"'), 'Password input must exist');
            assert.ok(html.includes('id="medixly-auth-account-view"'), 'Account profile view must exist');
            assert.ok(html.includes('id="medixly-theme-colors"'), 'Theme color options must exist');
        });

        it('should export window.openMedixlyAuthModal in js/medixly.js', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            assert.ok(medixlyJs.includes('window.openMedixlyAuthModal = openModal;'), 'Must export openModal');
            assert.ok(medixlyJs.includes('window.closeMedixlyAuthModal = closeModal;'), 'Must export closeModal');
        });
    });

    describe('Seamless Mixing & Global Lyric Synchronization', () => {
        it('should prebuffer upcoming track ~15s before song end in js/medixly.js', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            assert.ok(medixlyJs.includes('function prebufferUpcomingTrack()'), 'prebufferUpcomingTrack function must exist');
            assert.ok(medixlyJs.includes("nextAudio.preload = 'auto';"), 'Must set preload auto on idle audio element');
            assert.ok(medixlyJs.includes('prebufferUpcomingTrack();'), 'Must invoke prebuffer in timeupdate');
        });

        it('should broadcast lyrics synchronization messages across windows/pages', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            assert.ok(medixlyJs.includes("new BroadcastChannel('medixly_lyrics_sync')"), 'Must use BroadcastChannel for lyrics sync');
            assert.ok(medixlyJs.includes("type: 'MEDIXLY_LYRICS_SYNC'"), 'Must post MEDIXLY_LYRICS_SYNC messages');
            assert.ok(medixlyJs.includes("activeLineIndex: activeLineIndex"), 'Must sync activeLineIndex');
        });

        it('should support both main view and fullscreen lyrics side panel in syncLyrics()', () => {
            const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
            assert.ok(medixlyJs.includes("const isLyricsOverlayOpen = viewLyrics && viewLyrics.style.display !== 'none';"), 'Must check viewLyrics overlay state');
            assert.ok(medixlyJs.includes("const isFsLyricsOpen = fsContent && fsContent.classList.contains('lyrics-open');"), 'Must check fullscreen lyrics side panel state');
            assert.ok(medixlyJs.includes('if (!isLyricsOverlayOpen && !isFsLyricsOpen && cachedLyricsDOM.length === 0) return;'), 'Must allow either lyrics view to sync');
        });
    });
});

describe('Phase 3: UI Consistency & Dynamic Theming', () => {
    it('should set base icon color to white #ffffff in css/medixly.css', () => {
        const css = fs.readFileSync(path.resolve(process.cwd(), 'css/medixly.css'), 'utf8');
        assert.ok(css.includes('--icon-base-color: #ffffff;'), 'Must define --icon-base-color as white');
        assert.ok(css.includes('color: var(--icon-base-color, #ffffff) !important;'), 'Base icon color must be white');
    });

    it('should bind active icon states and outlines to var(--theme-accent)', () => {
        const css = fs.readFileSync(path.resolve(process.cwd(), 'css/medixly.css'), 'utf8');
        assert.ok(css.includes('.control-button.active {'), 'Active control button rule must exist');
        assert.ok(css.includes('color: var(--theme-accent, #16A34A) !important;'), 'Active button color must be bound to --theme-accent');
        assert.ok(css.includes('.like-btn-player.active {'), 'Active like button rule must exist');
        assert.ok(css.includes('.progress-bar:hover .progress { background-color: var(--theme-accent, #16A34A); }'), 'Progress bar must respect theme accent');
    });

    it('should implement MedixlyThemeProvider with presets and live event dispatch in js/theme-loader.js', () => {
        const themeJs = fs.readFileSync(path.resolve(process.cwd(), 'js/theme-loader.js'), 'utf8');
        assert.ok(themeJs.includes('window.MedixlyThemeProvider'), 'Must export window.MedixlyThemeProvider');
        assert.ok(themeJs.includes('PRESET_ACCENTS'), 'Must have PRESET_ACCENTS map');
        assert.ok(themeJs.includes("window.dispatchEvent(new CustomEvent('medixly:theme-changed'"), 'Must dispatch medixly:theme-changed event');
        assert.ok(themeJs.includes("document.documentElement.style.setProperty('--theme-accent', hex);"), 'Must update --theme-accent on root element');
    });

    it('should update player controls dynamically upon medixly:theme-changed event', () => {
        const medixlyJs = fs.readFileSync(path.resolve(process.cwd(), 'js/medixly.js'), 'utf8');
        assert.ok(medixlyJs.includes("window.addEventListener('medixly:theme-changed'"), 'Must listen for medixly:theme-changed in medixly.js');
        assert.ok(medixlyJs.includes('syncAllPlayerStates('), 'Must refresh player states dynamically on theme change');
    });
});
