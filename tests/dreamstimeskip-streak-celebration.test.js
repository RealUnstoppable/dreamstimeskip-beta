import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';
import { 
    StreakCelebrationController, 
    streakCelebration,
    triggerFlareAnimation, 
    getMinecraftItemSvg 
} from '../js/streakCelebration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dreams TimeSkip (dts.html) Streak Claim Celebration Integration', () => {
    let dtsHtml;
    let streakCss;

    beforeAll(() => {
        dtsHtml = fs.readFileSync(path.join(ROOT_DIR, 'dts.html'), 'utf-8');
        streakCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'streakCelebration.css'), 'utf-8');
    });

    describe('HTML Structure & Assets', () => {
        it('includes the streakCelebration.css stylesheet link', () => {
            expect(dtsHtml).toContain('<link rel="stylesheet" href="/css/streakCelebration.css">');
        });

        it('contains the #mc-flare-modal celebration modal markup identical to account.html', () => {
            expect(dtsHtml).toContain('id="mc-flare-modal"');
            expect(dtsHtml).toContain('class="mc-flare-overlay"');
            expect(dtsHtml).toContain('id="mc-celebration-canvas"');
            expect(dtsHtml).toContain('class="mc-flare-backdrop"');
            expect(dtsHtml).toContain('id="mc-flare-heat-bloom"');
            expect(dtsHtml).toContain('id="mc-shockwave-ring"');
            expect(dtsHtml).toContain('id="flare-voxel-flame-container"');
            expect(dtsHtml).toContain('id="flare-streak-odometer-container"');
            expect(dtsHtml).toContain('id="flare-streak-roll-prev"');
            expect(dtsHtml).toContain('id="flare-streak-roll-next"');
            expect(dtsHtml).toContain('id="flare-weekly-hotbar-container"');
            expect(dtsHtml).toContain('id="flare-rarity-pill"');
            expect(dtsHtml).toContain('id="flare-icon-container"');
            expect(dtsHtml).toContain('id="flare-item-name"');
            expect(dtsHtml).toContain('id="flare-points-bonus"');
            expect(dtsHtml).toContain('id="flare-item-desc"');
            expect(dtsHtml).toContain('id="flare-celebration-banner"');
            expect(dtsHtml).toContain('id="flare-collect-btn"');
        });

        it('places #mc-flare-modal outside of #og-streak-modal so dialog top-layer stacking is clean', () => {
            const streakModalEnd = dtsHtml.indexOf('</dialog>', dtsHtml.indexOf('id="og-streak-modal"'));
            const flareModalPos = dtsHtml.indexOf('id="mc-flare-modal"');
            expect(streakModalEnd).toBeGreaterThan(-1);
            expect(flareModalPos).toBeGreaterThan(streakModalEnd);
        });
    });

    describe('Celebration Animation Trigger & Lifecycle in DTS', () => {
        let container;

        beforeEach(() => {
            jest.useFakeTimers();
            document.body.innerHTML = `
                <div id="mc-flare-modal" class="mc-flare-overlay" style="display: none;" role="dialog" aria-modal="true" aria-label="Daily Streak Celebration">
                    <canvas id="mc-celebration-canvas" class="mc-celebration-canvas"></canvas>
                    <div class="mc-flare-backdrop"></div>
                    <div class="mc-flare-heat-bloom bloom-idle" id="mc-flare-heat-bloom"></div>
                    <div class="mc-shockwave-ring" id="mc-shockwave-ring"></div>
                    
                    <div class="mc-flare-card">
                        <div id="flare-voxel-flame-container" class="flare-voxel-flame-container dormant"></div>
                        <div id="flare-streak-odometer-container" class="flare-streak-odometer-container">
                            <div class="odometer-window">
                                <span id="flare-streak-roll-prev" class="odometer-digit digit-prev">0</span>
                                <span id="flare-streak-roll-next" class="odometer-digit digit-next prepare-bottom">1</span>
                            </div>
                            <span class="flare-days-label mc-pixel-font">DAY STREAK!</span>
                            <span class="mc-flare-days-count" id="flare-streak-number" style="display: none;">1</span>
                        </div>
                        <div id="flare-weekly-hotbar-container" class="flare-weekly-hotbar-wrap"></div>
                        <div class="flare-reward-card">
                            <div class="mc-flare-rarity-pill" id="flare-rarity-pill">LEGENDARY REWARD</div>
                            <div class="mc-flare-icon-container" id="flare-icon-container"></div>
                            <h3 class="mc-flare-item-name" id="flare-item-name">5x Diamonds</h3>
                            <p class="mc-flare-points-bonus" id="flare-points-bonus">+100 Unstoppable Loyalty Points</p>
                            <p class="mc-flare-desc" id="flare-item-desc">Crafted from the deepest caves of Dreams TimeSkip.</p>
                        </div>
                        <div id="flare-celebration-banner" class="flare-celebration-banner mc-pixel-font">
                            STREAK IGNITED! Keep the furnace burning tomorrow!
                        </div>
                        <div id="flare-actions-container" class="flare-actions-row">
                            <button type="button" id="flare-collect-btn" class="mc-button mc-button-collect mc-pixel-btn-claim">⚡ AWESOME / KEEP IT BURNING</button>
                        </div>
                    </div>
                </div>
            `;
        });

        afterEach(() => {
            streakCelebration.closeModal();
            jest.clearAllTimers();
            jest.useRealTimers();
        });

        it('triggerFlareAnimation opens modal, sets reward details and rolls odometer from previous to new streak', () => {
            const reward = {
                name: "10x Iron Ingots",
                rarity: "common",
                points: 20,
                icon: "iron",
                desc: "Starter resources queued for Oct 20th."
            };

            const onCollectSpy = jest.fn();
            triggerFlareAnimation(1, reward, 0, onCollectSpy);

            const modal = document.getElementById('mc-flare-modal');
            const itemName = document.getElementById('flare-item-name');
            const pointsBonus = document.getElementById('flare-points-bonus');
            const iconContainer = document.getElementById('flare-icon-container');
            const rollPrev = document.getElementById('flare-streak-roll-prev');
            const rollNext = document.getElementById('flare-streak-roll-next');

            expect(modal.style.display).toBe('flex');
            expect(modal.classList.contains('streak-active')).toBe(true);
            expect(itemName.textContent).toBe('10x Iron Ingots');
            expect(pointsBonus.textContent).toContain('20');
            expect(iconContainer.innerHTML).toContain('<svg');
            expect(rollPrev.textContent).toBe('0');
            expect(rollNext.textContent).toBe('1');

            // Advance through Stage 3 (odometer roll)
            jest.advanceTimersByTime(650);
            expect(rollPrev.classList.contains('roll-up-out')).toBe(true);
            expect(rollNext.classList.contains('roll-up-in')).toBe(true);

            // Advance to Stage 5 (banner + collect button ready)
            jest.advanceTimersByTime(1000);
            const collectBtn = document.getElementById('flare-collect-btn');
            collectBtn.click();

            expect(modal.style.display).toBe('none');
            expect(onCollectSpy).toHaveBeenCalledTimes(1);
        });

        it('supports clicking backdrop to dismiss and trigger onCollect callback', () => {
            const reward = {
                name: "5x Diamonds",
                rarity: "legendary",
                points: 100,
                icon: "diamond",
                desc: "Rare cyan gems!"
            };

            const onCollectSpy = jest.fn();
            triggerFlareAnimation(3, reward, 2, onCollectSpy);

            const modal = document.getElementById('mc-flare-modal');
            expect(modal.style.display).toBe('flex');

            // Click modal backdrop
            modal.click();

            expect(modal.style.display).toBe('none');
            expect(onCollectSpy).toHaveBeenCalledTimes(1);
        });

        it('generates item SVGs for all reward icons', () => {
            const icons = ['iron', 'diamond', 'netherite', 'elytra', 'gold', 'emerald', 'golden_apple', 'book', 'ender_pearl', 'redstone', 'lapis', 'totem', 'nether_star'];
            icons.forEach(icon => {
                const markup = getMinecraftItemSvg(icon);
                expect(markup).toBeTruthy();
                expect(markup.length).toBeGreaterThan(10);
            });
        });
    });

    describe('CSS Stylesheet Validity for DTS', () => {
        it('streakCelebration.css contains all critical overlay, canvas, and animation rules', () => {
            expect(streakCss).toContain('.mc-flare-overlay');
            expect(streakCss).toContain('.mc-flare-backdrop');
            expect(streakCss).toContain('.mc-celebration-canvas');
            expect(streakCss).toContain('.mc-flare-card');
            expect(streakCss).toContain('.flare-voxel-flame-container');
            expect(streakCss).toContain('.flare-streak-odometer-container');
            expect(streakCss).toContain('.mc-weekly-hotbar');
            expect(streakCss).toContain('.mc-hotbar-slot');
            expect(streakCss).toContain('.mc-button-collect');
            expect(streakCss).toContain('@media (prefers-reduced-motion: reduce)');
        });
    });
});
