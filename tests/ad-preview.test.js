import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Set up clean JSDOM structure before importing modules
document.body.innerHTML = `
    <div id="ad-viewport" class="ad-preview-viewport">
        <main id="ad-stage" class="ad-recording-stage">
            <header id="ad-scene-header" class="ad-scene-header">
                <div class="ad-brand-pill">
                    <span class="ad-brand-text">Medixly Ad Studio</span>
                </div>
                <div id="ad-track-badge" class="ad-track-badge"></div>
            </header>
            <div id="ad-track-title" class="ad-track-title"></div>
            <div id="ad-blobs-arena" class="ad-blobs-arena state-idle">
                <div id="blob-slot-user" class="blob-slot blob-slot-user">
                    <div id="pink-user-wrapper" class="pink-user-blob-wrapper">
                        <div class="blob-resonance-ring"></div>
                        <div id="pink-user-blob" class="pink-user-blob"></div>
                    </div>
                    <div id="speaker-tag-user" class="speaker-tag speaker-tag-user">
                        <span class="speaker-tag-dot"></span>
                        <span id="speaker-name-user">User</span>
                    </div>
                </div>
                <div id="blob-slot-lexi" class="blob-slot blob-slot-lexi">
                    <div id="lexi-ai-wrapper" class="lexi-ai-orb-wrapper">
                        <div class="blob-resonance-ring"></div>
                        <div id="lexi-ai-orb" class="lexi-ai-orb"></div>
                    </div>
                    <div id="speaker-tag-lexi" class="speaker-tag speaker-tag-lexi">
                        <span class="speaker-tag-dot"></span>
                        <span>Lexi AI</span>
                    </div>
                </div>
            </div>
            <section class="ad-captions-stage">
                <div id="caption-card" class="caption-card speaker-user">
                    <div id="caption-text" class="caption-text"></div>
                    <div class="caption-progress-track">
                        <div id="caption-progress-fill" class="caption-progress-fill"></div>
                    </div>
                </div>
            </section>
        </main>
        <div id="ad-countdown-overlay" class="ad-countdown-overlay">
            <div id="countdown-number" class="countdown-number">3</div>
        </div>
        <div id="clean-record-hint" class="clean-record-hint"></div>
        <nav id="ad-top-dock" class="ad-top-dock">
            <button id="btn-aspect-toggle"></button>
            <button id="btn-tracks-menu"></button>
        </nav>
        <div id="tracks-dropdown-menu" class="ad-tracks-menu">
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
            <button class="track-item-btn"></button>
        </div>
        <nav id="ad-control-dock" class="ad-control-dock">
            <button id="btn-play-pause"><span class="btn-icon"></span><span class="btn-text"></span></button>
            <button id="btn-restart"></button>
            <button id="btn-record-mode"></button>
            <button id="btn-hide-ui"></button>
        </nav>
        <audio id="ad-audio"></audio>
        <div id="ad-security-overlay" class="ad-security-overlay" style="display: none;">
            <span id="security-user-email"></span>
            <button id="security-google-signin"></button>
        </div>
    </div>
`;

// Media stubs for jsdom
if (typeof window !== 'undefined') {
    if (window.HTMLMediaElement) {
        window.HTMLMediaElement.prototype.play = () => Promise.resolve();
        window.HTMLMediaElement.prototype.pause = () => {};
        window.HTMLMediaElement.prototype.load = () => {};
    }
}

import { AD_TRACKS, getTrackById } from '../js/ad-preview-data.js';
import { AdPreviewController, AUTHORIZED_EMAIL } from '../js/ad-preview-controller.js';
import { CompositionStudio } from '../js/ad-composition-studio.js';

describe('Ad Screen-Recording Preview Scene & Secure Route Suite', () => {
    let controller;

    beforeEach(() => {
        controller = new AdPreviewController({ initialTrackId: 'ad-preview-1' });
        controller.bindDOM();
        controller.setupAudioElement();
    });

    afterEach(() => {
        if (controller) {
            controller.destroy();
        }
    });

    it('verifies all 9 ad audio files exist on disk with valid file size (> 100KB)', () => {
        for (let i = 1; i <= 9; i++) {
            const filePath = path.join(ROOT_DIR, `music/ads/ad-preview-${i}.mp3`);
            expect(fs.existsSync(filePath)).toBe(true);

            const stat = fs.statSync(filePath);
            expect(stat.size).toBeGreaterThan(100000); // > 100KB
        }
    });

    it('verifies AD_TRACKS metadata integrity for all 9 registered audio files', () => {
        expect(AD_TRACKS.length).toBe(9);

        AD_TRACKS.forEach((track, index) => {
            const trackNum = index + 1;
            expect(track.id).toBe(`ad-preview-${trackNum}`);
            expect(track.trackNumber).toBe(trackNum);
            expect(track.src).toBe(`/music/ads/ad-preview-${trackNum}.mp3`);
            expect(track.duration).toBeGreaterThan(5.0);
            expect(Array.isArray(track.choreography)).toBe(true);
            expect(track.choreography.length).toBeGreaterThanOrEqual(2);

            // Verify choreography intervals have words and speaker definitions
            track.choreography.forEach(seg => {
                expect(['user', 'lexi', 'both', 'transition']).toContain(seg.speaker);
                expect(typeof seg.start).toBe('number');
                expect(typeof seg.end).toBe('number');
                expect(seg.end).toBeGreaterThan(seg.start);
            });
        });
    });

    it('getTrackById resolves tracks correctly by id and by trackNumber', () => {
        expect(getTrackById('ad-preview-1').trackNumber).toBe(1);
        expect(getTrackById('ad-preview-3').trackNumber).toBe(3);
        expect(getTrackById(5).id).toBe('ad-preview-5');
        // Fallback to track 1 for unknown id
        expect(getTrackById('non-existent').id).toBe('ad-preview-1');
    });

    it('strictly enforces authorization guard exclusively for catalinandrian1@gmail.com', () => {
        expect(AUTHORIZED_EMAIL).toBe('catalinandrian1@gmail.com');

        // Test unauthorized guest
        controller.denyAccess(null);
        expect(controller.isAuthorized).toBe(false);
        const overlay = document.getElementById('ad-security-overlay');
        expect(overlay.style.display).toBe('flex');
        expect(document.getElementById('security-user-email').textContent).toBe('Unauthenticated Guest');

        // Test unauthorized wrong email
        controller.denyAccess({ email: 'intruder@example.com' });
        expect(controller.isAuthorized).toBe(false);
        expect(document.getElementById('security-user-email').textContent).toBe('intruder@example.com');

        // Test authorized user
        controller.grantAccess({ email: 'catalinandrian1@gmail.com' });
        expect(controller.isAuthorized).toBe(true);
        expect(overlay.style.display).toBe('none');
        expect(document.getElementById('ad-track-badge').textContent).toContain('catalinandrian1@gmail.com');
    });

    it('swaps dual-blob choreography classes dynamically based on speaker state', () => {
        const arena = document.getElementById('ad-blobs-arena');
        const pinkWrapper = document.getElementById('pink-user-wrapper');
        const lexiWrapper = document.getElementById('lexi-ai-wrapper');

        // User speaking: pink blob active
        controller.setSpeakerState('user');
        expect(arena.classList.contains('state-user-active')).toBe(true);
        expect(pinkWrapper.classList.contains('active-speaking')).toBe(true);
        expect(lexiWrapper.classList.contains('active-speaking')).toBe(false);

        // Lexi speaking: lexi orb active
        controller.setSpeakerState('lexi');
        expect(arena.classList.contains('state-lexi-active')).toBe(true);
        expect(pinkWrapper.classList.contains('active-speaking')).toBe(false);
        expect(lexiWrapper.classList.contains('active-speaking')).toBe(true);

        // Both speaking
        controller.setSpeakerState('both');
        expect(arena.classList.contains('state-both-active')).toBe(true);
        expect(pinkWrapper.classList.contains('active-speaking')).toBe(true);
        expect(lexiWrapper.classList.contains('active-speaking')).toBe(true);

        // Idle
        controller.setSpeakerState('idle');
        expect(arena.classList.contains('state-idle')).toBe(true);
        expect(pinkWrapper.classList.contains('active-speaking')).toBe(false);
        expect(lexiWrapper.classList.contains('active-speaking')).toBe(false);
    });

    it('synchronizes word-level captions and active states based on playback time', () => {
        controller.initTrack('ad-preview-1');
        
        // Track 1: at 0.5s User is speaking word 'Lexi,'
        controller.syncChoreography(0.7);
        expect(controller.currentSpeaker).toBe('user');
        
        const captionText = document.getElementById('caption-text');
        expect(captionText.innerHTML).toContain('caption-word');
        expect(captionText.innerHTML).toContain('Hey');
        expect(captionText.innerHTML).toContain('Lexi,');

        // At 5.0s Lexi is speaking
        controller.syncChoreography(5.0);
        expect(controller.currentSpeaker).toBe('lexi');
        expect(captionText.innerHTML).toContain('Medixly');
    });

    it('switches tracks cleanly and resets timeline', () => {
        controller.initTrack(3);
        expect(controller.currentTrack.id).toBe('ad-preview-3');
        expect(controller.audioEl.src).toContain('/music/ads/ad-preview-3.mp3');

        controller.initTrack(5);
        expect(controller.currentTrack.id).toBe('ad-preview-5');
        expect(controller.audioEl.src).toContain('/music/ads/ad-preview-5.mp3');
    });

    it('toggles aspect ratio between full 16:9, mobile 9:16 (TikTok) and 1:1 square', () => {
        const stage = document.getElementById('ad-stage');
        expect(controller.aspectRatio).toBe('full');

        controller.toggleAspectRatio();
        expect(controller.aspectRatio).toBe('9-16');
        expect(stage.className).toContain('aspect-9-16');

        controller.toggleAspectRatio();
        expect(controller.aspectRatio).toBe('1-1');
        expect(stage.className).toContain('aspect-1-1');

        controller.toggleAspectRatio();
        expect(controller.aspectRatio).toBe('full');
        expect(stage.className).toBe('ad-recording-stage');
    });

    it('toggles clean screen recording mode cleanly hiding toolbars, header, and auth badge', () => {
        const controlDock = document.getElementById('ad-control-dock');
        const topDock = document.getElementById('ad-top-dock');
        const sceneHeader = document.getElementById('ad-scene-header');

        expect(controller.isCleanMode).toBe(false);
        controller.toggleCleanMode();
        expect(controller.isCleanMode).toBe(true);
        expect(controlDock.classList.contains('dock-hidden')).toBe(true);
        expect(topDock.classList.contains('dock-hidden')).toBe(true);
        expect(sceneHeader.classList.contains('header-hidden')).toBe(true);
        expect(sceneHeader.style.display).toBe('none');

        controller.toggleCleanMode();
        expect(controller.isCleanMode).toBe(false);
        expect(controlDock.classList.contains('dock-hidden')).toBe(false);
        expect(topDock.classList.contains('dock-hidden')).toBe(false);
        expect(sceneHeader.classList.contains('header-hidden')).toBe(false);
        expect(sceneHeader.style.display).toBe('');
    });

    it('removes MEDIXLY AD STUDIO and Verified badge immediately during recording countdown', () => {
        const sceneHeader = document.getElementById('ad-scene-header');
        const countdownOverlay = document.getElementById('ad-countdown-overlay');
        const viewport = document.getElementById('ad-viewport');

        expect(sceneHeader.classList.contains('header-hidden')).toBe(false);

        // Start countdown
        controller.startCountdownRecord();

        // While countdown is running, header (Medixly Ad Studio & Verified badge) must be removed
        expect(sceneHeader.classList.contains('header-hidden')).toBe(true);
        expect(sceneHeader.style.display).toBe('none');
        expect(countdownOverlay.classList.contains('visible')).toBe(true);
        expect(viewport.classList.contains('countdown-active')).toBe(true);

        // Cancel countdown cleanly
        controller.cancelCountdown();
        expect(countdownOverlay.classList.contains('visible')).toBe(false);
        expect(viewport.classList.contains('countdown-active')).toBe(false);
    });

    it('manages settings gear modal with caption box toggle (on and off) and editable user display name', () => {
        const studio = new CompositionStudio(controller);
        studio.mount();

        const captionsStage = document.querySelector('.ad-captions-stage');
        const captionCard = document.getElementById('caption-card');
        const userTag = document.getElementById('speaker-tag-user');
        const gearBtn = document.getElementById('btn-composition-gear');

        expect(gearBtn).not.toBeNull();
        expect(gearBtn.title).toContain('Settings');

        // Test caption box toggle - defaults to true (ON)
        expect(studio.showCaptionBox).toBe(true);
        expect(studio.showDialogBox).toBe(true);

        // Toggle OFF -> Removes the box under the blobs
        studio.setCaptionBox(false);
        expect(studio.showCaptionBox).toBe(false);
        expect(studio.showDialogBox).toBe(false);
        expect(captionsStage.classList.contains('captions-hidden')).toBe(true);
        expect(captionsStage.style.display).toBe('none');
        expect(captionCard.classList.contains('caption-box-hidden')).toBe(true);
        expect(captionCard.style.display).toBe('none');

        // Toggle ON -> Restores the box under the blobs
        studio.setCaptionBox(true);
        expect(studio.showCaptionBox).toBe(true);
        expect(studio.showDialogBox).toBe(true);
        expect(captionsStage.classList.contains('captions-hidden')).toBe(false);
        expect(captionsStage.style.display).toBe('');
        expect(captionCard.classList.contains('caption-box-hidden')).toBe(false);
        expect(captionCard.style.display).toBe('');

        // Backwards compatibility check for setDialogBox
        studio.setDialogBox(false);
        expect(studio.showCaptionBox).toBe(false);
        expect(captionsStage.classList.contains('captions-hidden')).toBe(true);

        studio.setDialogBox(true);
        expect(studio.showCaptionBox).toBe(true);
        expect(captionsStage.classList.contains('captions-hidden')).toBe(false);

        // Test checkbox interaction in settings panel
        const toggleCheckbox = document.getElementById('comp-toggle-caption-box');
        if (toggleCheckbox) {
            toggleCheckbox.checked = false;
            toggleCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            expect(studio.showCaptionBox).toBe(false);
            expect(captionsStage.classList.contains('captions-hidden')).toBe(true);
        }

        // Test editable user name
        studio.setUserName('Alex Editor');
        expect(studio.userName).toBe('Alex Editor');
        expect(userTag.textContent).toContain('Alex Editor');

        // Reset user name
        studio.setUserName('User');
        expect(studio.userName).toBe('User');
        expect(userTag.textContent).toContain('User');

        studio.destroy();
    });

    it('verifies all 10 ad preview HTML pages exist on disk and have required components', () => {
        const pages = [
            'ad-preview.html',
            'ad-preview-1.html',
            'ad-preview-2.html',
            'ad-preview-3.html',
            'ad-preview-4.html',
            'ad-preview-5.html',
            'ad-preview-6.html',
            'ad-preview-7.html',
            'ad-preview-8.html',
            'ad-preview-9.html'
        ];

        pages.forEach(page => {
            const pagePath = path.join(ROOT_DIR, page);
            expect(fs.existsSync(pagePath)).toBe(true);

            const content = fs.readFileSync(pagePath, 'utf8');
            expect(content).toContain('id="ad-viewport"');
            expect(content).toContain('id="pink-user-blob"');
            expect(content).toContain('id="lexi-ai-orb"');
            expect(content).toContain('id="caption-card"');
            expect(content).toContain('id="ad-security-overlay"');
            expect(content).toContain('catalinandrian1@gmail.com');
            expect(content).toContain('ad-waves-svg');
        });
    });
});
