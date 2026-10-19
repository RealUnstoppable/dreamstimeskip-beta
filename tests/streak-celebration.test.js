import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';
import { StreakSoundEngine, streakAudio } from '../js/streakSoundEngine.js';
import {
    VoxelParticleCanvas,
    getVoxelFlameSvg,
    getWeeklyHotbarHtml,
    StreakCelebrationController
} from '../js/streakCelebration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Duolingo x Minecraft Voxel Streak Celebration Suite', () => {
    let accountHtml;
    let accountCss;

    beforeAll(() => {
        accountHtml = fs.readFileSync(path.join(ROOT_DIR, 'account.html'), 'utf-8');
        accountCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'account.css'), 'utf-8');
    });

    // ========================================================
    // 1. PROCEDURAL WEB AUDIO API SOUND ENGINE TESTS
    // ========================================================
    describe('1. Web Audio API Streak Sound Engine', () => {
        let engine;
        let mockAudioCtx;
        let createdOscillators;
        let createdFilters;
        let createdGains;

        beforeEach(() => {
            localStorage.clear();
            createdOscillators = [];
            createdFilters = [];
            createdGains = [];

            mockAudioCtx = {
                currentTime: 0.1,
                sampleRate: 44100,
                state: 'running',
                destination: {},
                createBuffer: jest.fn(() => ({
                    getChannelData: jest.fn(() => new Float32Array(4410))
                })),
                createBufferSource: jest.fn(() => ({
                    buffer: null,
                    connect: jest.fn(),
                    start: jest.fn(),
                    stop: jest.fn(),
                    addEventListener: jest.fn()
                })),
                createGain: jest.fn(() => {
                    const g = {
                        gain: {
                            setValueAtTime: jest.fn(),
                            linearRampToValueAtTime: jest.fn(),
                            exponentialRampToValueAtTime: jest.fn()
                        },
                        connect: jest.fn()
                    };
                    createdGains.push(g);
                    return g;
                }),
                createOscillator: jest.fn(() => {
                    const osc = {
                        type: 'sine',
                        frequency: {
                            setValueAtTime: jest.fn(),
                            exponentialRampToValueAtTime: jest.fn()
                        },
                        connect: jest.fn(),
                        start: jest.fn(),
                        stop: jest.fn(),
                        addEventListener: jest.fn()
                    };
                    createdOscillators.push(osc);
                    return osc;
                }),
                createBiquadFilter: jest.fn(() => {
                    const f = {
                        type: 'lowpass',
                        Q: { setValueAtTime: jest.fn() },
                        frequency: {
                            setValueAtTime: jest.fn(),
                            exponentialRampToValueAtTime: jest.fn()
                        },
                        connect: jest.fn()
                    };
                    createdFilters.push(f);
                    return f;
                }),
                resume: jest.fn().mockResolvedValue(undefined)
            };

            window.AudioContext = jest.fn(() => mockAudioCtx);
            engine = new StreakSoundEngine();
        });

        test('exports singleton and initializes default unmuted state in localStorage', () => {
            expect(streakAudio).toBeDefined();
            expect(engine.getMuted()).toBe(false);
            expect(localStorage.getItem('dts_streak_sound_muted')).toBeNull();

            engine.setMuted(true);
            expect(engine.getMuted()).toBe(true);
            expect(localStorage.getItem('dts_streak_sound_muted')).toBe('true');

            engine.toggleMute();
            expect(engine.getMuted()).toBe(false);
            expect(localStorage.getItem('dts_streak_sound_muted')).toBe('false');
        });

        test('Sound 1: Flint & Steel Strike routes 2200Hz HP filter + 1900Hz->600Hz triangle transient', () => {
            engine.playFlintAndSteel(0);

            // High pass filter
            const hpFilter = createdFilters.find(f => f.type === 'highpass');
            expect(hpFilter).toBeDefined();
            expect(hpFilter.frequency.setValueAtTime).toHaveBeenCalledWith(2200, expect.any(Number));

            // Triangle transient
            const triOsc = createdOscillators.find(o => o.type === 'triangle');
            expect(triOsc).toBeDefined();
            expect(triOsc.frequency.setValueAtTime).toHaveBeenCalledWith(1900, expect.any(Number));
            expect(triOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(600, expect.any(Number));
        });

        test('Sound 2: Fire Ignition Whoosh sweeps band-pass filter from 180Hz to 1100Hz to 350Hz', () => {
            engine.playIgnitionWhoosh(0);

            const bpFilter = createdFilters.find(f => f.type === 'bandpass');
            expect(bpFilter).toBeDefined();
            expect(bpFilter.frequency.setValueAtTime).toHaveBeenCalledWith(180, expect.any(Number));
            expect(bpFilter.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(1100, expect.any(Number));
            expect(bpFilter.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(350, expect.any(Number));
        });

        test('Sound 3: Duolingo x Minecraft XP Arpeggio plays F#5, A#5, C#6, and F#6 with harmonic overtone', () => {
            engine.playXpArpeggio(0);

            const freqs = createdOscillators.map(o => o.frequency.setValueAtTime.mock.calls[0]?.[0]);
            expect(freqs).toContain(739.99); // F#5
            expect(freqs).toContain(932.33); // A#5
            expect(freqs).toContain(1108.73); // C#6
            expect(freqs).toContain(1479.98); // F#6
            // Final note overtone (2 * 1479.98 = 2959.96)
            expect(freqs).toContain(2959.96);
        });

        test('Sound 4: Odometer Tick (880Hz->440Hz) and Calendar Lock Pop (1174Hz and 1567Hz double blip)', () => {
            engine.playOdometerTick(0);
            const odoOsc = createdOscillators.find(o => o.frequency.setValueAtTime.mock.calls[0]?.[0] === 880);
            expect(odoOsc).toBeDefined();
            expect(odoOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(440, expect.any(Number));

            engine.playCalendarLockPop(0);
            const calOsc1 = createdOscillators.find(o => o.frequency.setValueAtTime.mock.calls[0]?.[0] === 1174);
            const calOsc2 = createdOscillators.find(o => o.frequency.setValueAtTime.mock.calls[0]?.[0] === 1567);
            expect(calOsc1).toBeDefined();
            expect(calOsc2).toBeDefined();
        });

        test('playFullSequence schedules all 5 choreographed audio events without errors', () => {
            expect(() => engine.playFullSequence()).not.toThrow();
            expect(createdOscillators.length).toBeGreaterThanOrEqual(10);
        });

        test('stopAll cleanly disconnects all active nodes', () => {
            engine.playFullSequence();
            expect(() => engine.stopAll()).not.toThrow();
            expect(engine.activeNodes.size).toBe(0);
        });

        test('does not produce sound nodes when muted', () => {
            engine.setMuted(true);
            createdOscillators = [];
            engine.playFullSequence();
            expect(createdOscillators.length).toBe(0);
        });
    });

    // ========================================================
    // 2. VOXEL PARTICLE ENGINE TESTS
    // ========================================================
    describe('2. Voxel Particle Canvas Engine', () => {
        let mockCanvas;
        let mockCtx;
        let engine;

        beforeEach(() => {
            mockCtx = {
                scale: jest.fn(),
                clearRect: jest.fn(),
                fillRect: jest.fn(),
                imageSmoothingEnabled: true,
                globalAlpha: 1,
                fillStyle: '#000000'
            };
            mockCanvas = {
                getBoundingClientRect: jest.fn(() => ({ width: 400, height: 600, left: 0, top: 0 })),
                getContext: jest.fn(() => mockCtx),
                width: 400,
                height: 600
            };
            engine = new VoxelParticleCanvas(mockCanvas);
        });

        afterEach(() => {
            engine.destroy();
        });

        test('configures crisp integer pixels without smoothing', () => {
            expect(mockCtx.imageSmoothingEnabled).toBe(false);
        });

        test('strictly spawns square particles (4px, 6px, 8px, 10px)', () => {
            engine.spawnIgnitionBurst(200, 250, 40);
            expect(engine.particles.length).toBe(40);
            engine.particles.forEach(p => {
                expect([4, 6, 8, 10]).toContain(p.size);
            });
        });

        test('ignition burst ejects 35-50 particles with gravity, drag, and smoke fade transition', () => {
            engine.spawnIgnitionBurst(200, 250, 45);
            expect(engine.particles.length).toBe(45);

            const initialColor = engine.particles[0].color;
            // Advance simulation dt = 0.8s
            engine.update(0.8);
            // Some particles should decay into charcoal gray smoke (#374151)
            const hasSmoke = engine.particles.some(p => p.color === '#374151');
            expect(hasSmoke).toBe(true);
        });

        test('switches to Soul Fire palette for milestone streaks', () => {
            engine.setSoulFire(true);
            engine.spawnIgnitionBurst(200, 250, 20);
            const soulColors = ['#00F0FF', '#00E5FF', '#80DEEA', '#E0F7FA', '#FFFFFF'];
            engine.particles.forEach(p => {
                expect(soulColors).toContain(p.color);
            });
        });

        test('renders square integer-aligned pixels to canvas', () => {
            engine.spawnIgnitionBurst(200, 250, 10);
            engine.render();
            expect(mockCtx.fillRect).toHaveBeenCalled();
            // Verify all x, y coordinates passed to fillRect are integers
            mockCtx.fillRect.mock.calls.forEach(([x, y, w, h]) => {
                expect(Number.isInteger(x)).toBe(true);
                expect(Number.isInteger(y)).toBe(true);
                expect(w).toBe(h); // Square particles
            });
        });
    });

    // ========================================================
    // 3. PIXEL-ART VOXEL FLAME SVG GENERATOR TESTS
    // ========================================================
    describe('3. Pixel-Art Voxel Flame SVG Generator', () => {
        test('generates valid SVG with shape-rendering="crispEdges"', () => {
            const svg = getVoxelFlameSvg('ignited', 90);
            expect(svg).toContain('<svg');
            expect(svg).toContain('shape-rendering="crispEdges"');
            expect(svg).toContain('class="mc-voxel-flame-svg ignited"');
        });

        test('generates 3-layer Nether fire colors in ignited state: Crimson, Blaze Orange, White-Gold', () => {
            const svg = getVoxelFlameSvg('ignited', 90);
            expect(svg).toContain('#D92B04'); // Crimson
            expect(svg).toContain('#FF6A00'); // Blaze Orange
            expect(svg).toContain('#FFAA00'); // Golden Amber
            expect(svg).toContain('#FFF6D6'); // Hot White-Gold
        });

        test('generates charcoal/ashen dormant palette for unclaimed state', () => {
            const svg = getVoxelFlameSvg('dormant', 90);
            expect(svg).toContain('class="mc-voxel-flame-svg dormant"');
            expect(svg).toContain('#322B3A'); // Charcoal
            expect(svg).toContain('#4B4254'); // Ashen
        });

        test('generates Cyan/Aqua Soul Fire palette for 30+ day milestones', () => {
            const svg = getVoxelFlameSvg('soulfire', 90);
            expect(svg).toContain('class="mc-voxel-flame-svg soulfire"');
            expect(svg).toContain('#00E5FF'); // Soul Cyan
            expect(svg).toContain('#E0F7FA'); // Aqua
        });
    });

    // ========================================================
    // 4. 7-DAY MINECRAFT HOTBAR ROW GENERATOR TESTS
    // ========================================================
    describe('4. 7-Day Minecraft Hotbar Progress Row', () => {
        test('renders all 7 days of the week: MON through SUN', () => {
            const html = getWeeklyHotbarHtml(3, false, 2); // Wed
            expect(html).toContain('MON');
            expect(html).toContain('TUE');
            expect(html).toContain('WED');
            expect(html).toContain('THU');
            expect(html).toContain('FRI');
            expect(html).toContain('SAT');
            expect(html).toContain('SUN');
            expect(html).toContain('TODAY');
        });

        test('marks claimed days and pending today accurately', () => {
            // User has 3-day streak on Wednesday (today is index 2), claimed earlier
            const htmlClaimed = getWeeklyHotbarHtml(3, true, 2);
            expect(htmlClaimed).toContain('class="mc-hotbar-slot claimed today"');

            // User has 2-day streak on Wednesday, pending today
            const htmlPending = getWeeklyHotbarHtml(2, false, 2);
            expect(htmlPending).toContain('class="mc-hotbar-slot pending-today"');
            expect(htmlPending).toContain('slot-mini-flame dormant');
        });
    });

    // ========================================================
    // 5. 5-STAGE CELEBRATION CONTROLLER ORCHESTRATION TESTS
    // ========================================================
    describe('5. Streak Celebration Orchestrator Timeline', () => {
        let controller;

        beforeEach(() => {
            jest.useFakeTimers();
            document.body.innerHTML = `
                <div id="mc-flare-modal" class="mc-flare-overlay" style="display: none;">
                    <canvas id="mc-celebration-canvas"></canvas>
                    <div id="mc-flare-heat-bloom" class="mc-flare-heat-bloom"></div>
                    <div class="mc-flare-rays"></div>
                    <div id="mc-shockwave-ring" class="mc-shockwave-ring"></div>
                    <div class="mc-flare-card">
                        <div id="flare-voxel-flame-container" class="flare-voxel-flame-container"></div>
                        <div id="flare-streak-odometer-container">
                            <span id="flare-streak-roll-prev">0</span>
                            <span id="flare-streak-roll-next">1</span>
                            <span id="flare-streak-number">1</span>
                        </div>
                        <div id="flare-weekly-hotbar-container"></div>
                        <div id="flare-rarity-pill"></div>
                        <div id="flare-icon-container"></div>
                        <h3 id="flare-item-name"></h3>
                        <p id="flare-points-bonus"></p>
                        <p id="flare-item-desc"></p>
                        <div id="flare-celebration-banner"></div>
                        <div id="flare-actions-container">
                            <button id="flare-collect-btn"></button>
                            <button id="flare-replay-btn"></button>
                        </div>
                    </div>
                </div>
            `;
            controller = new StreakCelebrationController();
            controller.init();
        });

        afterEach(() => {
            controller.closeModal();
            jest.useRealTimers();
        });

        test('Stage 1 (0ms-200ms): Sets squash anticipation and starts sound sequence', () => {
            const playSpy = jest.spyOn(controller.soundEngine, 'playFullSequence').mockImplementation(() => {});
            controller.triggerCelebration({ previousStreak: 4, newStreak: 5 });

            const flame = document.getElementById('flare-voxel-flame-container');
            expect(flame.classList.contains('anticipation-squash')).toBe(true);
            expect(playSpy).toHaveBeenCalled();
        });

        test('Stage 2 (200ms-650ms): Triggers Flint & Steel ignition, shockwave, and spring overshoot', () => {
            controller.triggerCelebration({ previousStreak: 4, newStreak: 5 });
            jest.advanceTimersByTime(210);

            const flame = document.getElementById('flare-voxel-flame-container');
            const shockwave = document.getElementById('mc-shockwave-ring');
            const bloom = document.getElementById('mc-flare-heat-bloom');

            expect(flame.classList.contains('ignite-spring')).toBe(true);
            expect(shockwave.classList.contains('trigger-burst')).toBe(true);
            expect(bloom.classList.contains('bloom-burst')).toBe(true);
        });

        test('Stage 3 (600ms-1100ms): Rolls odometer counter from N to N+1 with golden shine sweep', () => {
            controller.triggerCelebration({ previousStreak: 4, newStreak: 5 });
            jest.advanceTimersByTime(650);

            const rollPrev = document.getElementById('flare-streak-roll-prev');
            const rollNext = document.getElementById('flare-streak-roll-next');
            const counterContainer = document.getElementById('flare-streak-odometer-container');

            expect(rollPrev.classList.contains('roll-up-out')).toBe(true);
            expect(rollNext.classList.contains('roll-up-in')).toBe(true);
            expect(counterContainer.classList.contains('shine-sweep')).toBe(true);
        });

        test('Stage 4 (1000ms-1550ms): Slams in today weekly inventory slot with golden border', () => {
            controller.triggerCelebration({ previousStreak: 4, newStreak: 5 });
            jest.advanceTimersByTime(1100);

            const hotbarContainer = document.getElementById('flare-weekly-hotbar-container');
            const todaySlot = hotbarContainer.querySelector('.mc-hotbar-slot.today');
            expect(todaySlot).not.toBeNull();
            expect(todaySlot.classList.contains('slam-lock')).toBe(true);
        });

        test('Stage 5 (1550ms+): Displays motivational celebratory banner and unlocks action buttons', () => {
            controller.triggerCelebration({ previousStreak: 6, newStreak: 7 });
            jest.advanceTimersByTime(1600);

            const banner = document.getElementById('flare-celebration-banner');
            const actions = document.getElementById('flare-actions-container');

            expect(banner.classList.contains('visible')).toBe(true);
            expect(banner.textContent).toContain('7-DAY STREAK IGNITED');
            expect(actions.classList.contains('visible')).toBe(true);
        });

        test('Milestone detection displays Soul Fire theme for streak >= 30', () => {
            controller.triggerCelebration({ previousStreak: 29, newStreak: 30 });
            jest.advanceTimersByTime(1600);

            const modal = document.getElementById('mc-flare-modal');
            const banner = document.getElementById('flare-celebration-banner');

            expect(modal.classList.contains('soul-fire-theme')).toBe(true);
            expect(banner.textContent).toContain('SOUL FIRE UNLOCKED');
        });

        test('Replay mode can be triggered without error and resets sequence cleanly', () => {
            controller.triggerCelebration({ previousStreak: 0, newStreak: 1 });
            jest.advanceTimersByTime(1600);

            const replayBtn = document.getElementById('flare-replay-btn');
            expect(replayBtn).toBeDefined();
            expect(() => replayBtn.click()).not.toThrow();
        });
    });

    // ========================================================
    // 6. ACCOUNT HTML & CSS INTEGRATION AUDIT
    // ========================================================
    describe('6. HTML & CSS Integration Audit', () => {
        test('account.html contains sound toggle, 7-day hotbar, and replay streak button', () => {
            expect(accountHtml).toContain('id="streak-sound-toggle-btn"');
            expect(accountHtml).toContain('id="dashboard-weekly-hotbar"');
            expect(accountHtml).toContain('id="replay-streak-btn"');
            expect(accountHtml).toContain('id="mc-celebration-canvas"');
            expect(accountHtml).toContain('id="flare-voxel-flame-container"');
            expect(accountHtml).toContain('id="flare-streak-roll-prev"');
            expect(accountHtml).toContain('id="flare-streak-roll-next"');
            expect(accountHtml).toContain('id="flare-weekly-hotbar-container"');
            expect(accountHtml).toContain('id="flare-celebration-banner"');
            expect(accountHtml).toContain('id="flare-replay-btn"');
        });

        test('css/account.css defines Obsidian/Nether canvas with 16px pixelated grid and 3D beveled dark-stone border', () => {
            expect(accountCss).toContain('background-size: 16px 16px, 16px 16px');
            expect(accountCss).toContain('#24130E');
            expect(accountCss).toContain('#17101C');
            expect(accountCss).toContain('#0A080D');
            expect(accountCss).toContain('image-rendering: pixelated');
            expect(accountCss).toContain('border: 4px solid #141218');
        });

        test('css/account.css defines dynamic radial heat bloom with 4s breathing animation', () => {
            expect(accountCss).toContain('.mc-flare-heat-bloom');
            expect(accountCss).toContain('rgba(255, 106, 0, 0.28)');
            expect(accountCss).toContain('rgba(0, 240, 255, 0.28)'); // Soul fire
            expect(accountCss).toContain('animation: heatBloomBreathe 4s ease-in-out infinite');
        });

        test('css/account.css defines rotating pixel god-rays (25s linear infinite)', () => {
            expect(accountCss).toContain('animation: spinFlareRays 25s linear infinite');
            expect(accountCss).toContain('opacity: 0.08');
        });

        test('css/account.css includes 6px solid bottom border on tactile buttons that depresses on :active', () => {
            expect(accountCss).toContain('border-bottom: 6px solid #1c5212 !important');
            expect(accountCss).toContain('border-bottom-width: 2px !important');
            expect(accountCss).toContain('transform: translateY(4px) !important');
        });

        test('css/account.css contains reduced motion media query overrides', () => {
            expect(accountCss).toContain('@media (prefers-reduced-motion: reduce)');
            expect(accountCss).toContain('.mc-flare-overlay.streak-camera-shake .mc-flare-card');
        });
    });
});
