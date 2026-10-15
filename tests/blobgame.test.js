/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setSfxVolume, getSfxVolume, playPopSound, startPullSound, updatePullSound, stopPullSound } from '../js/audio-synth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Squishly / Blob Game Options and Audio', () => {
    let htmlContent;

    beforeAll(() => {
        const htmlPath = path.join(ROOT_DIR, 'blobgame.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
    });

    describe('HTML Structure & Options Menu Verification', () => {
        beforeEach(() => {
            document.documentElement.innerHTML = htmlContent;
        });

        it('should have exactly one FPS Limit option group and NO duplicate id="fps-toggles"', () => {
            const fpsGroups = Array.from(document.querySelectorAll('.option-group')).filter(group => {
                const label = group.querySelector('label');
                return label && label.textContent.trim() === 'FPS Limit';
            });
            expect(fpsGroups.length).toBe(1);

            const fpsToggleElements = document.querySelectorAll('#fps-toggles');
            expect(fpsToggleElements.length).toBe(1);

            const buttons = fpsToggleElements[0].querySelectorAll('.toggle-btn');
            expect(buttons.length).toBe(3);
            const values = Array.from(buttons).map(b => b.getAttribute('data-val'));
            expect(values).toEqual(['30', '60', '120']);
        });

        it('should have Audio Volume group with SFX and Music sliders and value labels', () => {
            const sfxSlider = document.getElementById('sfx-vol');
            const musicSlider = document.getElementById('music-vol');
            const sfxVal = document.getElementById('sfx-vol-val');
            const musicVal = document.getElementById('music-vol-val');

            expect(sfxSlider).not.toBeNull();
            expect(musicSlider).not.toBeNull();
            expect(sfxVal).not.toBeNull();
            expect(musicVal).not.toBeNull();

            expect(sfxSlider.getAttribute('type')).toBe('range');
            expect(musicSlider.getAttribute('type')).toBe('range');
            expect(sfxSlider.getAttribute('min')).toBe('0');
            expect(sfxSlider.getAttribute('max')).toBe('1');
        });

        it('should have Graphics Quality options including Low, Med, High, and Ultra', () => {
            const qualityGroup = document.getElementById('quality-toggles');
            expect(qualityGroup).not.toBeNull();

            const buttons = qualityGroup.querySelectorAll('.toggle-btn');
            expect(buttons.length).toBe(4);
            const values = Array.from(buttons).map(b => b.getAttribute('data-val'));
            expect(values).toEqual(['low', 'medium', 'high', 'ultra']);

            const desc = document.getElementById('quality-desc');
            expect(desc).not.toBeNull();
        });

        it('should have Cinematic Features toggle for screen shake and time dilation', () => {
            const cinematicToggle = document.getElementById('toggle-cinematic');
            expect(cinematicToggle).not.toBeNull();
            expect(cinematicToggle.getAttribute('type')).toBe('checkbox');
        });

        it('should have valid audio elements with existing music sources', () => {
            const bgmMusic = document.getElementById('bgm-music');
            const bgmMenu = document.getElementById('bgm-menu');

            expect(bgmMusic).not.toBeNull();
            expect(bgmMenu).not.toBeNull();

            const musicSrc = bgmMusic.getAttribute('src');
            const menuSrc = bgmMenu.getAttribute('src');

            expect(musicSrc).toBeTruthy();
            expect(menuSrc).toBeTruthy();

            // Verify local files exist on disk
            const localMusicPath = path.join(ROOT_DIR, musicSrc.replace(/^\//, ''));
            const localMenuPath = path.join(ROOT_DIR, menuSrc.replace(/^\//, ''));

            expect(fs.existsSync(localMusicPath)).toBe(true);
            expect(fs.existsSync(localMenuPath)).toBe(true);
        });

        it('should have Options Back button', () => {
            const backBtn = document.getElementById('btn-opt-back');
            expect(backBtn).not.toBeNull();
        });
    });

    describe('Audio Synth Volume Control', () => {
        let mockAudioCtx;
        let mockOsc;
        let mockGain;
        let mockFilter;

        beforeEach(() => {
            mockGain = {
                gain: {
                    setValueAtTime: jest.fn(),
                    linearRampToValueAtTime: jest.fn(),
                    exponentialRampToValueAtTime: jest.fn(),
                    setTargetAtTime: jest.fn()
                },
                connect: jest.fn()
            };

            mockOsc = {
                type: 'sine',
                frequency: {
                    setValueAtTime: jest.fn(),
                    exponentialRampToValueAtTime: jest.fn(),
                    setTargetAtTime: jest.fn()
                },
                connect: jest.fn(),
                start: jest.fn(),
                stop: jest.fn(),
                disconnect: jest.fn()
            };

            mockFilter = {
                type: 'lowpass',
                frequency: {
                    setValueAtTime: jest.fn(),
                    setTargetAtTime: jest.fn()
                },
                Q: { value: 10 },
                connect: jest.fn()
            };

            mockAudioCtx = {
                currentTime: 0,
                state: 'running',
                destination: {},
                createOscillator: jest.fn(() => ({ ...mockOsc })),
                createGain: jest.fn(() => ({ ...mockGain })),
                createBiquadFilter: jest.fn(() => ({ ...mockFilter })),
                resume: jest.fn().mockResolvedValue()
            };

            window.AudioContext = jest.fn(() => mockAudioCtx);
            window.webkitAudioContext = window.AudioContext;
        });

        afterEach(() => {
            stopPullSound();
            jest.clearAllMocks();
        });

        it('should get and set SFX volume correctly', () => {
            setSfxVolume(0.75);
            expect(getSfxVolume()).toBe(0.75);

            setSfxVolume(0);
            expect(getSfxVolume()).toBe(0);

            // Clamping
            setSfxVolume(1.5);
            expect(getSfxVolume()).toBe(1.0);
            setSfxVolume(-0.5);
            expect(getSfxVolume()).toBe(0);
        });

        it('should not play pop sound when volume is 0', () => {
            setSfxVolume(0);
            playPopSound(0);
            expect(mockAudioCtx.createOscillator).not.toHaveBeenCalled();
        });

        it('should scale pop sound peak gain according to volume', () => {
            playPopSound(0.5);
            expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
                0.8 * 0.5,
                expect.any(Number)
            );
        });

        it('should not start pull sound when volume is 0', () => {
            startPullSound(0);
            expect(mockAudioCtx.createOscillator).not.toHaveBeenCalled();
        });

        it('should scale pull sound gain according to volume', () => {
            startPullSound(0.5);
            expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
                0.3 * 0.5,
                expect.any(Number)
            );
        });
    });

    describe('CSS Visual Verification', () => {
        let cssContent;

        beforeAll(() => {
            const cssPath = path.join(ROOT_DIR, 'css', 'blobgame.css');
            cssContent = fs.readFileSync(cssPath, 'utf8');
        });

        it('should have styles for audio range sliders with webkit and moz thumbs', () => {
            expect(cssContent).toContain('input[type="range"]');
            expect(cssContent).toContain('::-webkit-slider-thumb');
            expect(cssContent).toContain('::-moz-range-thumb');
        });

        it('should have ultra quality styles, shockwave animation, and screen shake', () => {
            expect(cssContent).toContain('.game-blob.ultra-quality');
            expect(cssContent).toContain('.game-shockwave');
            expect(cssContent).toContain('@keyframes game-shockwave-expand');
            expect(cssContent).toContain('.screen-shake');
            expect(cssContent).toContain('@keyframes screen-shake-anim');
        });
    });

    describe('Options Menu Runtime Functionality', () => {
        beforeAll(async () => {
            document.documentElement.innerHTML = htmlContent;
            // Mock audio methods for jsdom
            window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
            window.HTMLMediaElement.prototype.pause = jest.fn();

            // Import blobgame.js to initialize setupUI()
            await import('../js/blobgame.js');
        });

        it('navigates to Options and back to Main Menu', () => {
            const btnOptions = document.getElementById('btn-options');
            const btnOptBack = document.getElementById('btn-opt-back');
            const menuMain = document.getElementById('menu-main');
            const menuOptions = document.getElementById('menu-options');

            btnOptions.click();
            expect(menuOptions.classList.contains('hidden')).toBe(false);
            expect(menuMain.classList.contains('hidden')).toBe(true);

            btnOptBack.click();
            expect(menuOptions.classList.contains('hidden')).toBe(true);
            expect(menuMain.classList.contains('hidden')).toBe(false);
        });

        it('switches Graphics Quality and updates descriptions', () => {
            const qualityButtons = document.querySelectorAll('#quality-toggles .toggle-btn');
            const desc = document.getElementById('quality-desc');

            const btnLow = Array.from(qualityButtons).find(b => b.getAttribute('data-val') === 'low');
            const btnMed = Array.from(qualityButtons).find(b => b.getAttribute('data-val') === 'medium');
            const btnHigh = Array.from(qualityButtons).find(b => b.getAttribute('data-val') === 'high');
            const btnUltra = Array.from(qualityButtons).find(b => b.getAttribute('data-val') === 'ultra');

            btnLow.click();
            expect(btnLow.classList.contains('active')).toBe(true);
            expect(btnUltra.classList.contains('active')).toBe(false);
            expect(desc.textContent).toBe('Low: Static blobs, 50% fewer dots.');
            expect(localStorage.getItem('blobgame_quality')).toBe('low');

            btnMed.click();
            expect(btnMed.classList.contains('active')).toBe(true);
            expect(desc.textContent).toBe('Med: Animated blobs, 25% fewer dots.');
            expect(localStorage.getItem('blobgame_quality')).toBe('medium');

            btnHigh.click();
            expect(btnHigh.classList.contains('active')).toBe(true);
            expect(desc.textContent).toBe('High: Animated blobs, massive dot explosions.');
            expect(localStorage.getItem('blobgame_quality')).toBe('high');

            btnUltra.click();
            expect(btnUltra.classList.contains('active')).toBe(true);
            expect(desc.textContent).toBe('Ultra: Maximum particles and effects.');
            expect(localStorage.getItem('blobgame_quality')).toBe('ultra');
        });

        it('switches FPS Limit and updates active state and localStorage', () => {
            const fpsButtons = document.querySelectorAll('#fps-toggles .toggle-btn');
            const btn30 = Array.from(fpsButtons).find(b => b.getAttribute('data-val') === '30');
            const btn60 = Array.from(fpsButtons).find(b => b.getAttribute('data-val') === '60');
            const btn120 = Array.from(fpsButtons).find(b => b.getAttribute('data-val') === '120');

            btn30.click();
            expect(btn30.classList.contains('active')).toBe(true);
            expect(btn60.classList.contains('active')).toBe(false);
            expect(localStorage.getItem('blobgame_fps')).toBe('30');

            btn120.click();
            expect(btn120.classList.contains('active')).toBe(true);
            expect(btn30.classList.contains('active')).toBe(false);
            expect(localStorage.getItem('blobgame_fps')).toBe('120');

            btn60.click();
            expect(btn60.classList.contains('active')).toBe(true);
            expect(localStorage.getItem('blobgame_fps')).toBe('60');
        });

        it('updates SFX volume slider, percentage badge, and audio synth', () => {
            const sfxSlider = document.getElementById('sfx-vol');
            const sfxVal = document.getElementById('sfx-vol-val');

            sfxSlider.value = '0.75';
            sfxSlider.dispatchEvent(new Event('input'));

            expect(sfxVal.textContent).toBe('75%');
            expect(localStorage.getItem('blobgame_sfx_vol')).toBe('0.75');
            expect(getSfxVolume()).toBe(0.75);

            sfxSlider.value = '0';
            sfxSlider.dispatchEvent(new Event('input'));
            expect(sfxVal.textContent).toBe('0%');
            expect(localStorage.getItem('blobgame_sfx_vol')).toBe('0');
            expect(getSfxVolume()).toBe(0);
        });

        it('updates Music volume slider, percentage badge, audio elements, and muting', () => {
            const musicSlider = document.getElementById('music-vol');
            const musicVal = document.getElementById('music-vol-val');
            const bgmMusic = document.getElementById('bgm-music');
            const bgmMenu = document.getElementById('bgm-menu');

            musicSlider.value = '0.35';
            musicSlider.dispatchEvent(new Event('input'));

            expect(musicVal.textContent).toBe('35%');
            expect(localStorage.getItem('blobgame_music_vol')).toBe('0.35');
            expect(bgmMusic.volume).toBeCloseTo(0.35);
            expect(bgmMenu.volume).toBeCloseTo(0.35);

            // Muting music at 0
            musicSlider.value = '0';
            musicSlider.dispatchEvent(new Event('input'));
            expect(musicVal.textContent).toBe('0%');
            expect(bgmMusic.pause).toHaveBeenCalled();
            expect(bgmMenu.pause).toHaveBeenCalled();
        });

        it('toggles Cinematic features and persists to localStorage', () => {
            const toggle = document.getElementById('toggle-cinematic');

            toggle.checked = false;
            toggle.dispatchEvent(new Event('change'));
            expect(localStorage.getItem('blobgame_cinematic')).toBe('false');

            toggle.checked = true;
            toggle.dispatchEvent(new Event('change'));
            expect(localStorage.getItem('blobgame_cinematic')).toBe('true');
        });
    });
});

