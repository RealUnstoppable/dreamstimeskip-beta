/**
 * Unstoppable High-Tension Particle Explosion & Regeneration Physics
 *
 * Tracks user stretch tension on the interactive hero blob.
 * When pulled past the critical tension threshold (distance > 240px or tension > 0.85):
 * 1. Shudders and violently explodes into 150-300 glowing physics particles.
 * 2. Particles fly outward with radial blast velocities, drag deceleration, and glowing luminescence.
 * 3. After a 2.5-3.5s cooldown, gravitational physics pull all particles back to the center.
 * 4. Particles coalesce and regenerate the full blob with an elastic pop animation so it can be exploded infinitely.
 */

(function (root, factory) {
    const exported = factory();
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = exported;
    } else if (typeof define === 'function' && define.amd) {
        define([], () => exported);
    }
    const g = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : root || {}));
    g.UnstoppableBlobPhysics = exported;
}(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {

    const EXPLOSION_THRESHOLD_DISTANCE = 240;
    const PARTICLE_COUNT = 220;
    const COOLDOWN_DURATION_MS = 3000;
    const COALESCE_START_MS = 2200; // start drawing back in at 2.2s

    const GLOW_COLORS = [
        '#9333EA', // Purple
        '#A855F7', // Light Purple
        '#3B82F6', // Blue
        '#60A5FA', // Light Blue
        '#06B6D4', // Cyan
        '#EC4899', // Pink
        '#F43F5E', // Rose
        '#FFFFFF'  // White spark
    ];

    class Particle {
        constructor(x, y, angle, speed) {
            this.x = x;
            this.y = y;
            this.startX = x;
            this.startY = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = Math.random() * 4 + 2;
            this.color = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
            this.alpha = 1;
            this.drag = 0.93;
            this.life = 0;
            this.maxLife = COOLDOWN_DURATION_MS;
        }

        update(dt, elapsedMs, targetX, targetY) {
            this.life += dt;

            if (elapsedMs < COALESCE_START_MS) {
                // Outward explosion with drag
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= this.drag;
                this.vy *= this.drag;
            } else {
                // Coalesce / Gravitational pull back to center
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const dist = Math.hypot(dx, dy);
                const pullProgress = (elapsedMs - COALESCE_START_MS) / (COOLDOWN_DURATION_MS - COALESCE_START_MS);
                const strength = Math.min(0.25, pullProgress * 0.35 + 0.05);

                this.vx += (dx * strength);
                this.vy += (dy * strength);
                this.x += this.vx * 0.4;
                this.y += this.vy * 0.4;

                if (dist < 8) {
                    this.alpha = Math.max(0, this.alpha - 0.2);
                }
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class BlobExplosionEngine {
        constructor(orbElement, canvasElement) {
            this.orb = orbElement;
            this.canvas = canvasElement;
            this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
            this.particles = [];
            this.isExploded = false;
            this.explosionStartTime = 0;
            this.centerX = 0;
            this.centerY = 0;
            this.animFrameId = null;
            this.onExplodeCallback = null;
            this.onRegenerateCallback = null;
        }

        init() {
            if (!this.orb || !this.canvas) return;
            this.resizeCanvas();
            this.bindEvents();

            if (typeof window !== 'undefined') {
                window.addEventListener('resize', () => this.resizeCanvas());
            }
        }

        resizeCanvas() {
            if (!this.canvas) return;
            const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width || window.innerWidth;
            this.canvas.height = rect.height || window.innerHeight;
        }

        triggerExplosion(sourceX, sourceY) {
            if (this.isExploded) return false;
            this.isExploded = true;
            this.explosionStartTime = performance.now();

            const rect = this.orb.getBoundingClientRect();
            const parentRect = this.canvas.getBoundingClientRect();

            this.centerX = (sourceX || (rect.left + rect.width / 2)) - parentRect.left;
            this.centerY = (sourceY || (rect.top + rect.height / 2)) - parentRect.top;

            // Hide the orb element while shattered
            this.orb.style.opacity = '0';
            this.orb.style.pointerEvents = 'none';
            this.orb.style.transform = 'scale(0)';

            // Spawn 150-300 particles
            this.particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 18 + 4; // High blast velocity
                this.particles.push(new Particle(this.centerX, this.centerY, angle, speed));
            }

            if (typeof this.onExplodeCallback === 'function') {
                this.onExplodeCallback({ count: this.particles.length, x: this.centerX, y: this.centerY });
            }

            this.runExplosionLoop();
            return true;
        }

        runExplosionLoop() {
            if (!this.ctx || !this.canvas) return;

            let lastTime = performance.now();

            const loop = (currentTime) => {
                const dt = currentTime - lastTime;
                lastTime = currentTime;
                const elapsed = currentTime - this.explosionStartTime;

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.update(dt, elapsed, this.centerX, this.centerY);
                    p.draw(this.ctx);
                }

                if (elapsed >= COOLDOWN_DURATION_MS) {
                    this.regenerateBlob();
                    return;
                }

                this.animFrameId = requestAnimationFrame(loop);
            };

            this.animFrameId = requestAnimationFrame(loop);
        }

        regenerateBlob() {
            if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
            this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles = [];
            this.isExploded = false;

            // Smoothly restore orb with bounce / pop
            this.orb.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.orb.style.opacity = '1';
            this.orb.style.pointerEvents = 'auto';
            this.orb.style.transform = 'scale(1)';

            setTimeout(() => {
                this.orb.style.transition = '';
            }, 650);

            if (typeof this.onRegenerateCallback === 'function') {
                this.onRegenerateCallback();
            }
        }

        bindEvents() {
            let isDragging = false;
            let startClientX = 0;
            let startClientY = 0;

            const onStart = (cx, cy) => {
                if (this.isExploded) return;
                isDragging = true;
                const rect = this.orb.getBoundingClientRect();
                startClientX = rect.left + rect.width / 2;
                startClientY = rect.top + rect.height / 2;
            };

            const onMove = (cx, cy) => {
                if (!isDragging || this.isExploded) return;
                const dx = cx - startClientX;
                const dy = cy - startClientY;
                const dist = Math.hypot(dx, dy);

                // If pulled beyond critical threshold, TRIGGER EXPLOSION!
                if (dist >= EXPLOSION_THRESHOLD_DISTANCE) {
                    isDragging = false;
                    this.triggerExplosion(cx, cy);
                }
            };

            const onEnd = () => {
                isDragging = false;
            };

            this.orb.addEventListener('mousedown', (e) => {
                e.preventDefault();
                onStart(e.clientX, e.clientY);
            });

            window.addEventListener('mousemove', (e) => {
                if (isDragging) onMove(e.clientX, e.clientY);
            });

            window.addEventListener('mouseup', onEnd);

            this.orb.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    onStart(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (isDragging && e.touches.length === 1) {
                    onMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: false });

            window.addEventListener('touchend', onEnd);
        }
    }

    return {
        BlobExplosionEngine,
        EXPLOSION_THRESHOLD_DISTANCE,
        PARTICLE_COUNT,
        COOLDOWN_DURATION_MS,
        initUnstoppableBlob: (orbId = 'unstoppable-orb', canvasId = 'orb-explosion-canvas') => {
            const orb = document.getElementById(orbId) || document.querySelector('.orb');
            const canvas = document.getElementById(canvasId);
            if (!orb || !canvas) return null;
            const engine = new BlobExplosionEngine(orb, canvas);
            engine.init();
            return engine;
        }
    };
}));
