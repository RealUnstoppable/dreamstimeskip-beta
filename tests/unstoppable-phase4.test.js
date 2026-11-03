import { describe, it, expect, beforeEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Phase 4: Unstoppable Exploding Particle Blob, Support CTA & Locked Premium Videos Suite', () => {
    let htmlContent;

    beforeEach(() => {
        htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'unstoppable.html'), 'utf8');
    });

    describe('Verification Gate 4.1: Header Top Spacing & Layout Clearance', () => {
        it('should have ample top padding on main and hero container to prevent navbar clipping', () => {
            expect(htmlContent).toContain('padding-top: 100px');
            expect(htmlContent).toContain('margin-top: 24px');
            expect(htmlContent).toContain('padding-top: 32px');
        });
    });

    describe('Verification Gate 4.2: High-Tension Particle Explosion & Regeneration Physics', () => {
        it('should contain the particle explosion canvas and interactive orb elements in unstoppable.html', () => {
            expect(htmlContent).toContain('id="orb-explosion-canvas"');
            expect(htmlContent).toContain('id="unstoppable-orb"');
            expect(htmlContent).toContain('unstoppable-blob.js');
        });

        it('should verify particle explosion parameters meet specification (150-300 particles, ~3s cooldown, 240px threshold)', async () => {
            await import('../js/unstoppable-blob.js');
            const physics = globalThis.UnstoppableBlobPhysics;
            expect(physics).toBeDefined();

            expect(physics.EXPLOSION_THRESHOLD_DISTANCE).toBeGreaterThanOrEqual(200);
            expect(physics.EXPLOSION_THRESHOLD_DISTANCE).toBeLessThanOrEqual(300);

            expect(physics.PARTICLE_COUNT).toBeGreaterThanOrEqual(150);
            expect(physics.PARTICLE_COUNT).toBeLessThanOrEqual(300);

            expect(physics.COOLDOWN_DURATION_MS).toBeGreaterThanOrEqual(2500);
            expect(physics.COOLDOWN_DURATION_MS).toBeLessThanOrEqual(3500);
        });

        it('should trigger explosion and regenerate orb correctly', async () => {
            await import('../js/unstoppable-blob.js');
            const { BlobExplosionEngine } = globalThis.UnstoppableBlobPhysics;

            // Mock DOM elements
            const mockOrb = {
                style: { opacity: '1', pointerEvents: 'auto', transform: 'scale(1)' },
                getBoundingClientRect: () => ({ left: 200, top: 150, width: 120, height: 120 }),
                addEventListener: () => {}
            };
            const mockCanvas = {
                parentElement: { getBoundingClientRect: () => ({ width: 800, height: 600 }) },
                getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
                getContext: () => ({
                    clearRect: () => {},
                    save: () => {},
                    restore: () => {},
                    beginPath: () => {},
                    arc: () => {},
                    fill: () => {}
                })
            };

            const engine = new BlobExplosionEngine(mockOrb, mockCanvas);
            expect(engine.isExploded).toBe(false);

            // Trigger explosion
            const exploded = engine.triggerExplosion(300, 200);
            expect(exploded).toBe(true);
            expect(engine.isExploded).toBe(true);
            expect(engine.particles.length).toBeGreaterThanOrEqual(150);
            expect(mockOrb.style.opacity).toBe('0');
            expect(mockOrb.style.pointerEvents).toBe('none');

            // Regenerate
            engine.regenerateBlob();
            expect(engine.isExploded).toBe(false);
            expect(mockOrb.style.opacity).toBe('1');
            expect(mockOrb.style.pointerEvents).toBe('auto');
            expect(mockOrb.style.transform).toBe('scale(1)');
        });
    });

    describe('Verification Gate 4.3: Support Us Button & Premium Videos Section', () => {
        it('should contain a prominent Support Us button in the hero area', () => {
            expect(htmlContent).toContain('id="unstoppable-support-btn"');
            expect(htmlContent).toContain('Support Us');
            expect(htmlContent).toContain('href="store.html"');
        });

        it('should contain the Premium Videos (Support to Unlock) section with locked badges', () => {
            expect(htmlContent).toContain('id="premium-videos-section"');
            expect(htmlContent).toContain('Premium Videos');
            expect(htmlContent).toContain('Support to Unlock');
            expect(htmlContent).toContain('Supporters Only');
            expect(htmlContent).toContain('SMP S4 Megastructure Masterclass (Uncut)');
            expect(htmlContent).toContain('Medixly Audio Engine: High-Tension DSP Stems');
        });
    });
});
