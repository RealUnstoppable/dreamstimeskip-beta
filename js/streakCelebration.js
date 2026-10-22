/**
 * streakCelebration.js
 * 
 * Duolingo-style x Minecraft Voxel Streak Celebration Controller & Particle Engine.
 * High-craft, dopamine-driven 5-stage celebration sequence.
 */

import { streakAudio } from './streakSoundEngine.js';

/**
 * 1. VOXEL PARTICLE ENGINE
 * Strictly square pixel particles (4px, 6px, 8px, 10px), crisp image rendering,
 * with physics-driven burst, gravity, drag, and smoke fade-out.
 */
export class VoxelParticleCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        try {
            this.ctx = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
        } catch (_) {
            this.ctx = null;
        }
        this.particles = [];
        this.animFrameId = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.width = 0;
        this.height = 0;
        this.isSoulFire = false;

        if (this.canvas) {
            this.resize();
            this.handleResize = () => this.resize();
            window.addEventListener('resize', this.handleResize);
        }
    }

    setSoulFire(enabled) {
        this.isSoulFire = Boolean(enabled);
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = Math.max(10, Math.floor(rect.width));
        this.height = Math.max(10, Math.floor(rect.height));

        this.canvas.width = Math.floor(this.width * dpr);
        this.canvas.height = Math.floor(this.height * dpr);

        if (this.ctx) {
            this.ctx.scale(dpr, dpr);
            this.ctx.imageSmoothingEnabled = false;
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop = (now) => {
            if (!this.isRunning) return;
            const dt = Math.min((now - this.lastTime) / 1000, 0.1);
            this.lastTime = now;
            this.update(dt);
            this.render();
            this.animFrameId = requestAnimationFrame(this.loop);
        };
        this.animFrameId = requestAnimationFrame(this.loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    clear() {
        this.particles = [];
        if (this.ctx && this.width && this.height) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }

    destroy() {
        this.stop();
        this.clear();
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }
    }

    /**
     * Spawns slow drifting idle embers and XP orbs
     */
    spawnIdleParticle() {
        if (this.particles.length > 28) return;

        const isXpOrb = Math.random() < 0.22;
        const sizeOptions = [4, 6, 8];
        const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];

        const x = this.width * 0.2 + Math.random() * (this.width * 0.6);
        const y = this.height * 0.75 + Math.random() * (this.height * 0.2);

        let colors;
        if (isXpOrb) {
            colors = ['#55FF55', '#A3E635', '#FFFF55', '#FDE047'];
        } else if (this.isSoulFire) {
            colors = ['#00F0FF', '#00E5FF', '#80DEEA', '#00838F', '#E0F7FA'];
        } else {
            colors = ['#FF6A00', '#FFAA00', '#FFD83D', '#D92B04', '#FF3300'];
        }

        const color = colors[Math.floor(Math.random() * colors.length)];

        this.particles.push({
            type: isXpOrb ? 'xp' : 'ember',
            x,
            y,
            vx: (Math.random() - 0.5) * 20,
            vy: -(25 + Math.random() * 45),
            size,
            color,
            alpha: 0.1,
            maxAlpha: 0.75 + Math.random() * 0.25,
            life: 0,
            maxLife: 2.5 + Math.random() * 2.0,
            wobbleSpeed: 2 + Math.random() * 3,
            wobbleAmp: 12 + Math.random() * 18,
            wobbleOffset: Math.random() * Math.PI * 2
        });
    }

    /**
     * Ejects 35-50 physics-driven voxel particles in a 360-degree burst
     */
    spawnIgnitionBurst(originX, originY, count = 45) {
        const ox = originX !== undefined ? originX : this.width / 2;
        const oy = originY !== undefined ? originY : this.height * 0.42;

        const sizes = [4, 6, 6, 8, 8, 10];

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const speed = 70 + Math.random() * 220; // px/sec
            const size = sizes[Math.floor(Math.random() * sizes.length)];

            let colors;
            if (this.isSoulFire) {
                colors = ['#00F0FF', '#00E5FF', '#80DEEA', '#E0F7FA', '#FFFFFF'];
            } else {
                colors = ['#FF6A00', '#FFAA00', '#FFD83D', '#D92B04', '#FFFFFF'];
            }
            const color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push({
                type: 'burst',
                x: ox + (Math.random() - 0.5) * 12,
                y: oy + (Math.random() - 0.5) * 12,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 40, // slight upward bias
                size,
                color,
                alpha: 1,
                life: 0,
                maxLife: 0.9 + Math.random() * 0.8,
                drag: 0.965,
                gravity: 190, // px/sec^2
                smokeTurn: 0.45 + Math.random() * 0.2 // turn to smoke
            });
        }
    }

    /**
     * Spawns 10-14 square XP particles around a specific element/slot
     */
    spawnSlotLockBurst(originX, originY, count = 12) {
        const ox = originX !== undefined ? originX : this.width / 2;
        const oy = originY !== undefined ? originY : this.height * 0.75;
        const xpColors = ['#55FF55', '#86EFAC', '#FFFF55', '#FDE047', '#FFFFFF'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 110;
            const size = [4, 6, 8][Math.floor(Math.random() * 3)];
            const color = xpColors[Math.floor(Math.random() * xpColors.length)];

            this.particles.push({
                type: 'xp_burst',
                x: ox,
                y: oy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 30,
                size,
                color,
                alpha: 1,
                life: 0,
                maxLife: 0.6 + Math.random() * 0.5,
                drag: 0.94,
                gravity: 120
            });
        }
    }

    update(dt) {
        // Spawn occasional idle particles
        if (Math.random() < dt * 6) {
            this.spawnIdleParticle();
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life += dt;

            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
                continue;
            }

            const progress = p.life / p.maxLife;

            if (p.type === 'ember' || p.type === 'xp') {
                // Fade in then out
                if (progress < 0.2) {
                    p.alpha = (progress / 0.2) * p.maxAlpha;
                } else {
                    p.alpha = (1 - (progress - 0.2) / 0.8) * p.maxAlpha;
                }

                // Sinusoidal horizontal wobble
                p.x += (p.vx + Math.sin(p.life * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp) * dt;
                p.y += p.vy * dt;
            } else if (p.type === 'burst' || p.type === 'xp_burst') {
                // Apply physics
                p.vx *= Math.pow(p.drag, dt * 60);
                p.vy *= Math.pow(p.drag, dt * 60);
                p.vy += p.gravity * dt;

                p.x += p.vx * dt;
                p.y += p.vy * dt;

                // Smoke transition for burst
                if (p.type === 'burst' && progress > p.smokeTurn) {
                    p.color = '#374151'; // charcoal gray smoke
                }

                p.alpha = Math.max(0, 1 - progress);
            }
        }
    }

    render() {
        if (!this.ctx || !this.width || !this.height) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (p.alpha <= 0.01) continue;

            ctx.globalAlpha = Math.min(1, Math.max(0, p.alpha));
            ctx.fillStyle = p.color;

            // Strictly square integer-aligned pixel blocks
            const px = Math.round(p.x);
            const py = Math.round(p.y);
            ctx.fillRect(px, py, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }
}

/**
 * 2. PIXEL-ART VOXEL FLAME SVG GENERATOR
 * Generates a scalable 24x24 pixel grid voxel flame with crispEdges rendering.
 * Supports:
 * - 'dormant': Charcoal/ashen blocks
 * - 'ignited': Crimson, Blaze Orange, Golden Amber, Torch Yellow, White-Gold
 * - 'soulfire': Dark Cyan, Teal, Soul Cyan, Aqua, Pure White (>= 30 days)
 */
export function getVoxelFlameSvg(state = 'ignited', size = 80) {
    const isSoul = state === 'soulfire';
    const isDormant = state === 'dormant';

    // Color Palettes
    let mantleColor, mantleDark, coreColor, coreLight, heartColor;

    if (isDormant) {
        mantleDark = '#1F1B24';
        mantleColor = '#322B3A';
        coreColor = '#4B4254';
        coreLight = '#62586E';
        heartColor = '#7E738C';
    } else if (isSoul) {
        mantleDark = '#00363A';
        mantleColor = '#006064';
        coreColor = '#0097A7';
        coreLight = '#00E5FF';
        heartColor = '#E0F7FA';
    } else {
        // Classic Nether Blaze Fire
        mantleDark = '#8F1300';
        mantleColor = '#D92B04';
        coreColor = '#FF6A00';
        coreLight = '#FFAA00';
        heartColor = '#FFF6D6';
    }

    return `
    <svg class="mc-voxel-flame-svg ${state}" viewBox="0 0 24 24" width="${size}" height="${size}" 
         xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <!-- Base / Outline Voxel Pixels -->
        <g class="flame-layer mantle-dark">
            <rect x="9" y="21" width="6" height="2" fill="${mantleDark}"/>
            <rect x="7" y="19" width="10" height="2" fill="${mantleDark}"/>
            <rect x="6" y="15" width="12" height="4" fill="${mantleDark}"/>
            <rect x="5" y="12" width="14" height="3" fill="${mantleDark}"/>
            <rect x="6" y="8" width="12" height="4" fill="${mantleDark}"/>
            <rect x="8" y="5" width="8" height="3" fill="${mantleDark}"/>
            <rect x="10" y="2" width="4" height="3" fill="${mantleDark}"/>
        </g>

        <!-- Outer Mantle -->
        <g class="flame-layer mantle-main">
            <rect x="8" y="18" width="8" height="3" fill="${mantleColor}"/>
            <rect x="7" y="13" width="10" height="5" fill="${mantleColor}"/>
            <rect x="8" y="9" width="8" height="4" fill="${mantleColor}"/>
            <rect x="9" y="6" width="6" height="3" fill="${mantleColor}"/>
            <rect x="11" y="3" width="2" height="3" fill="${mantleColor}"/>
            <!-- Flickering Side Sparks -->
            <rect class="flame-spark spark-left" x="5" y="10" width="2" height="2" fill="${mantleColor}"/>
            <rect class="flame-spark spark-right" x="17" y="11" width="2" height="2" fill="${mantleColor}"/>
        </g>

        <!-- Middle Core -->
        <g class="flame-layer core-main">
            <rect x="9" y="16" width="6" height="4" fill="${coreColor}"/>
            <rect x="8" y="12" width="8" height="4" fill="${coreColor}"/>
            <rect x="9" y="8" width="6" height="4" fill="${coreColor}"/>
            <rect x="10" y="5" width="4" height="3" fill="${coreLight}"/>
        </g>

        <!-- Inner Heart -->
        <g class="flame-layer heart-main">
            <rect x="10" y="15" width="4" height="4" fill="${coreLight}"/>
            <rect x="10" y="11" width="4" height="4" fill="${heartColor}"/>
            <rect x="11" y="8" width="2" height="3" fill="${heartColor}"/>
            <rect x="11" y="13" width="2" height="2" fill="#FFFFFF"/>
        </g>
    </svg>
    `;
}

/**
 * 3. 7-DAY MINECRAFT HOTBAR / WEEKLY PROGRESS ROW GENERATOR
 * Generates an authentic Minecraft hotbar row with 7 slots (Mon-Sun).
 */
export function getWeeklyHotbarHtml(streak = 0, isClaimedToday = false, todaySlotIndex = null, referenceDate = null) {
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    
    // Resolve reference date cleanly (handles Date object, 'YYYY-MM-DD' string, or current local date)
    let refDate;
    if (referenceDate instanceof Date) {
        refDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    } else if (typeof referenceDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(referenceDate)) {
        const [y, m, d] = referenceDate.split('-').map(Number);
        refDate = new Date(y, m - 1, d);
    } else {
        const now = new Date();
        refDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const jsDay = refDate.getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday, etc.
    const currentDayIndex = todaySlotIndex !== null 
        ? todaySlotIndex 
        : (jsDay === 0 ? 6 : jsDay - 1); // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun

    // Calculate Monday of the current week (refDate - currentDayIndex days)
    const mondayDate = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - currentDayIndex);

    let html = `<div class="mc-weekly-hotbar" id="mc-weekly-hotbar" role="region" aria-label="7-Day Streak Progress">`;

    for (let i = 0; i < 7; i++) {
        const slotDate = new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + i);
        const slotDayNum = slotDate.getDate();
        const dateFormatted = `${slotDate.getMonth() + 1}/${slotDayNum}`;
        const isoDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDayNum).padStart(2, '0')}`;

        const isPastDay = i < currentDayIndex;
        const isToday = i === currentDayIndex;
        const isFutureDay = i > currentDayIndex;

        let slotClass = 'mc-hotbar-slot';
        let statusIcon = '';
        let statusTitle = '';

        if (isPastDay) {
            // If the current streak covers past days of this week
            const daysBehindToday = currentDayIndex - i;
            const wasClaimedInStreak = streak >= (isClaimedToday ? daysBehindToday + 1 : daysBehindToday);
            if (wasClaimedInStreak) {
                slotClass += ' claimed';
                statusIcon = `<span class="slot-mini-flame">🔥</span><span class="slot-check">✓</span>`;
                statusTitle = `${dayNames[i]} (${dateFormatted}): Streak Maintained`;
            } else {
                slotClass += ' missed';
                statusIcon = `<span class="slot-missed">✕</span>`;
                statusTitle = `${dayNames[i]} (${dateFormatted}): Missed`;
            }
        } else if (isToday) {
            if (isClaimedToday) {
                slotClass += ' claimed today';
                statusIcon = `<span class="slot-mini-flame today-ignited">🔥</span><span class="slot-check">✓</span>`;
                statusTitle = `Today (${dayNames[i]} ${dateFormatted}): Claimed!`;
            } else {
                slotClass += ' pending-today';
                statusIcon = `<span class="slot-mini-flame dormant">🔥</span>`;
                statusTitle = `Today (${dayNames[i]} ${dateFormatted}): Ready to Claim!`;
            }
        } else {
            // Future day
            slotClass += ' future';
            statusIcon = `<span class="slot-lock">🔒</span>`;
            statusTitle = `${dayNames[i]} (${dateFormatted}): Upcoming`;
        }

        html += `
        <div class="${slotClass}" data-day-index="${i}" data-date="${isoDateStr}" title="${statusTitle}">
            <span class="slot-day-label">${dayNames[i]}</span>
            <span class="slot-date-num">${slotDayNum}</span>
            <div class="slot-socket">
                ${statusIcon}
            </div>
            ${isToday ? '<span class="slot-today-indicator">TODAY</span>' : ''}
        </div>
        `;
    }

    html += `</div>`;
    return html;
}

/**
 * Minecraft Reward Item Pixel SVGs
 */
export function getMinecraftItemSvg(icon) {
    switch (icon) {
        case 'diamond':
            return `<svg viewBox="0 0 32 32" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11" y="4" width="10" height="2" fill="#55ffff"/>
                <rect x="7" y="6" width="18" height="2" fill="#00aaaa"/>
                <rect x="5" y="8" width="22" height="4" fill="#55ffff"/>
                <rect x="7" y="12" width="18" height="4" fill="#00aaaa"/>
                <rect x="9" y="16" width="14" height="4" fill="#008282"/>
                <rect x="11" y="20" width="10" height="4" fill="#005555"/>
                <rect x="13" y="24" width="6" height="3" fill="#003333"/>
                <rect x="15" y="27" width="2" height="2" fill="#002222"/>
                <rect x="9" y="8" width="4" height="2" fill="#ffffff"/>
                <rect x="7" y="10" width="2" height="2" fill="#ffffff"/>
                <rect x="18" y="9" width="3" height="2" fill="#ffffff"/>
            </svg>`;
        case 'netherite':
            return `<svg viewBox="0 0 32 32" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="20" height="11" rx="2" fill="#312a2b"/>
                <rect x="8" y="9" width="16" height="4" fill="#423b3c"/>
                <rect x="6" y="13" width="20" height="3" fill="#5a4f50"/>
                <rect x="6" y="21" width="20" height="3" fill="#1e191a"/>
                <rect x="9" y="14" width="4" height="2" fill="#7d3b5b"/>
                <rect x="19" y="15" width="3" height="2" fill="#9333ea"/>
                <rect x="14" y="10" width="4" height="2" fill="#c084fc"/>
                <rect x="15" y="18" width="3" height="2" fill="#dc2626"/>
            </svg>`;
        case 'elytra':
            return `<img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6f/Elytra_JE2_BE2.png/revision/latest?cb=20230930213939" alt="Elytra" class="mc-item-icon-img mc-elytra-img" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='images/elytra.png';" />`;
        case 'iron':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="20" height="11" rx="2" fill="#8f939d"/>
                <rect x="8" y="9" width="16" height="4" fill="#b0b5c0"/>
                <rect x="6" y="13" width="20" height="3" fill="#d2d7e2"/>
                <rect x="6" y="21" width="20" height="3" fill="#666a74"/>
                <rect x="9" y="10" width="6" height="2" fill="#ffffff"/>
            </svg>`;
        case 'gold':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="20" height="11" rx="2" fill="#d99b16"/>
                <rect x="8" y="9" width="16" height="4" fill="#f5bc18"/>
                <rect x="6" y="13" width="20" height="3" fill="#fde047"/>
                <rect x="6" y="21" width="20" height="3" fill="#a16207"/>
                <rect x="9" y="10" width="6" height="2" fill="#ffffff"/>
            </svg>`;
        case 'emerald':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11" y="5" width="10" height="22" rx="2" fill="#15803d"/>
                <rect x="13" y="7" width="6" height="18" fill="#22c55e"/>
                <rect x="14" y="9" width="4" height="14" fill="#86efac"/>
                <rect x="14" y="10" width="2" height="4" fill="#ffffff"/>
            </svg>`;
        case 'golden_apple':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="18" r="9" fill="#f5bc18"/>
                <ellipse cx="14" cy="16" rx="4" ry="5" fill="#fef08a"/>
                <rect x="15" y="6" width="2" height="4" fill="#854d0e"/>
                <path d="M17 7 C19 6 22 7 21 9" stroke="#22c55e" stroke-width="2" fill="none"/>
            </svg>`;
        case 'book':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="6" width="18" height="20" rx="2" fill="#78350f"/>
                <rect x="9" y="8" width="14" height="16" fill="#fef3c7"/>
                <line x1="16" y1="8" x2="16" y2="24" stroke="#d97706" stroke-width="2"/>
                <rect x="11" y="14" width="10" height="3" fill="#9333ea"/>
                <circle cx="16" cy="15.5" r="3" fill="#c084fc"/>
            </svg>`;
        case 'ender_pearl':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="9" fill="#064e3b"/>
                <circle cx="16" cy="16" r="6" fill="#0d9488"/>
                <circle cx="15" cy="14" r="3" fill="#5eead4"/>
                <circle cx="14" cy="13" r="1.5" fill="#ffffff"/>
            </svg>`;
        case 'redstone':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="7" fill="#dc2626"/>
                <circle cx="12" cy="20" r="4" fill="#ef4444"/>
                <circle cx="21" cy="19" r="4" fill="#b91c1c"/>
                <circle cx="14" cy="14" r="2.5" fill="#fca5a5"/>
            </svg>`;
        case 'lapis':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="14" height="14" rx="2" fill="#1e3a8a"/>
                <rect x="11" y="11" width="10" height="10" fill="#2563eb"/>
                <rect x="12" y="12" width="5" height="5" fill="#60a5fa"/>
            </svg>`;
        case 'totem':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11" y="6" width="10" height="9" fill="#f5bc18"/>
                <rect x="8" y="15" width="16" height="5" fill="#eab308"/>
                <rect x="12" y="20" width="8" height="8" fill="#ca8a04"/>
                <rect x="12" y="9" width="3" height="2" fill="#22c55e"/>
                <rect x="17" y="9" width="3" height="2" fill="#22c55e"/>
            </svg>`;
        case 'nether_star':
            return `<svg viewBox="0 0 32 32" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="16,3 20,12 29,16 20,20 16,29 12,20 3,16 12,12" fill="#f8fafc"/>
                <polygon points="16,7 18,13 25,16 18,19 16,25 14,19 7,16 14,13" fill="#38bdf8"/>
                <circle cx="16" cy="16" r="3" fill="#ffffff"/>
            </svg>`;
        default:
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none"><circle cx="16" cy="16" r="10" fill="#55ffff"/></svg>`;
    }
}

/**
 * 4. 5-STAGE DUOLINGO x MINECRAFT CELEBRATION ORCHESTRATOR
 * Timeline:
 * - Stage 1 (0ms - 200ms): Anticipation & Squash
 * - Stage 2 (200ms - 650ms): Flint & Steel Ignition + Camera Shake + Burst
 * - Stage 3 (600ms - 1100ms): Odometer Counter Roll (N -> N+1)
 * - Stage 4 (1000ms - 1550ms): 7-Day Hotbar Slot Lock-In
 * - Stage 5 (1550ms+): Celebratory Banner & Living Idle
 */
export class StreakCelebrationController {
    constructor() {
        this.modalEl = null;
        this.particleCanvas = null;
        this.activeTimers = [];
        this.isAnimating = false;
        this.soundEngine = streakAudio;
        this.onCollectCallback = null;
    }

    init() {
        this.modalEl = document.getElementById('mc-flare-modal');
        const canvas = document.getElementById('mc-celebration-canvas');
        if (canvas) {
            if (this.particleCanvas) {
                this.particleCanvas.destroy();
            }
            this.particleCanvas = new VoxelParticleCanvas(canvas);
        }
    }

    cleanupTimers() {
        this.activeTimers.forEach(id => clearTimeout(id));
        this.activeTimers = [];
    }

    closeModal() {
        this.cleanupTimers();
        if (this.handleKeyDown) {
            window.removeEventListener('keydown', this.handleKeyDown);
            this.handleKeyDown = null;
        }
        if (this.particleCanvas) {
            this.particleCanvas.stop();
            this.particleCanvas.clear();
        }
        if (this.modalEl) {
            this.modalEl.style.display = 'none';
            this.modalEl.classList.remove('streak-active', 'streak-camera-shake');
        }
        this.isAnimating = false;
    }

    /**
     * Executes the celebration sequence
     */
    triggerCelebration({
        previousStreak = 0,
        newStreak = 1,
        rewardItem = null,
        isReplay = false,
        onComplete = null,
        onCollect = null
    } = {}) {
        if (!this.modalEl || !this.modalEl.isConnected) this.init();
        if (!this.modalEl) return;

        this.onCollectCallback = onCollect;

        // Prevent spam-clicking overlapping runs
        if (this.isAnimating && !isReplay) return;
        this.isAnimating = true;
        this.cleanupTimers();

        const prefersReducedMotion = typeof window !== 'undefined' && 
            window.matchMedia && 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const isSoulFire = newStreak >= 30;

        // Ensure canvas is attached and sized
        let canvas = document.getElementById('mc-celebration-canvas');
        if (!canvas && this.modalEl) {
            canvas = document.createElement('canvas');
            canvas.id = 'mc-celebration-canvas';
            canvas.className = 'mc-celebration-canvas';
            this.modalEl.insertBefore(canvas, this.modalEl.firstChild);
        }
        if (!this.particleCanvas && canvas) {
            this.particleCanvas = new VoxelParticleCanvas(canvas);
        }

        if (this.particleCanvas) {
            this.particleCanvas.setSoulFire(isSoulFire);
            this.particleCanvas.resize();
            this.particleCanvas.clear();
            this.particleCanvas.start();
        }

        // Update modal styling & elements
        this.modalEl.style.display = 'flex';
        this.modalEl.classList.add('streak-active');
        this.modalEl.classList.toggle('soul-fire-theme', isSoulFire);

        // Flame element
        const flameContainer = document.getElementById('flare-voxel-flame-container');
        if (flameContainer) {
            flameContainer.innerHTML = getVoxelFlameSvg(isReplay ? (isSoulFire ? 'soulfire' : 'ignited') : 'dormant', 110);
            flameContainer.className = 'flare-voxel-flame-container dormant';
        }

        // Streak Odometer elements
        const rollPrev = document.getElementById('flare-streak-roll-prev');
        const rollNext = document.getElementById('flare-streak-roll-next');
        const staticNumber = document.getElementById('flare-streak-number');

        if (rollPrev) {
            rollPrev.textContent = previousStreak;
            rollPrev.className = 'odometer-digit digit-prev';
        }
        if (rollNext) {
            rollNext.textContent = newStreak;
            rollNext.className = 'odometer-digit digit-next prepare-bottom';
        }
        if (staticNumber) {
            staticNumber.textContent = newStreak;
        }

        // Weekly Hotbar slot container
        const hotbarContainer = document.getElementById('flare-weekly-hotbar-container');
        if (hotbarContainer) {
            // Render hotbar with today in pending state first
            hotbarContainer.innerHTML = getWeeklyHotbarHtml(newStreak, false);
        }

        // Reward information
        const rarityPill = document.getElementById('flare-rarity-pill');
        const itemName = document.getElementById('flare-item-name');
        const pointsBonus = document.getElementById('flare-points-bonus');
        const itemDesc = document.getElementById('flare-item-desc');
        const iconContainer = document.getElementById('flare-icon-container');

        if (rewardItem) {
            if (itemName) itemName.textContent = rewardItem.name || 'Daily Minecraft Reward';
            if (pointsBonus) pointsBonus.textContent = `+${rewardItem.points || 50} Unstoppable Loyalty Points`;
            if (itemDesc) itemDesc.textContent = rewardItem.desc || 'Consecutive daily check-in streak reward.';
            if (iconContainer && rewardItem.icon) {
                iconContainer.innerHTML = getMinecraftItemSvg(rewardItem.icon);
            }
            if (rarityPill) {
                rarityPill.className = `mc-flare-rarity-pill rarity-${rewardItem.rarity || 'common'}`;
                if (rewardItem.rarity === 'legendary') {
                    rarityPill.textContent = '💎 LEGENDARY REWARD';
                } else if (rewardItem.rarity === 'mythic') {
                    rarityPill.textContent = '🛡️ MYTHIC REWARD';
                } else if (rewardItem.rarity === 'elytra') {
                    rarityPill.textContent = '🪽 ULTRA GRAND FINALE';
                } else {
                    rarityPill.textContent = '✨ DAILY MINECRAFT TREASURE';
                }
            }
        }

        // Sub-message celebration banner
        const celebrationBanner = document.getElementById('flare-celebration-banner');
        if (celebrationBanner) {
            celebrationBanner.classList.remove('visible');
            let bannerText = 'STREAK IGNITED! Keep the furnace burning tomorrow!';
            if (newStreak >= 30) {
                bannerText = '🔥 SOUL FIRE UNLOCKED! 30-Day Immortal Streak Legend!';
            } else if (newStreak >= 14) {
                bannerText = '🛡️ 2-WEEK WARRIOR! Unstoppable Netherite Champion!';
            } else if (newStreak >= 7) {
                bannerText = '⚡ 7-DAY STREAK IGNITED! You are unstoppable!';
            }
            celebrationBanner.textContent = bannerText;
        }

        // Action buttons
        const collectBtn = document.getElementById('flare-collect-btn');
        const actionsContainer = document.getElementById('flare-actions-container');
        if (actionsContainer) actionsContainer.classList.remove('visible');

        // Play synchronized audio sequence
        this.soundEngine.playFullSequence();

        // ====================================================
        // STAGE 1: Anticipation & Squash (0ms - 200ms)
        // ====================================================
        if (flameContainer) {
            flameContainer.classList.add('anticipation-squash');
        }

        // ====================================================
        // STAGE 2: Flint & Steel Ignition (200ms - 650ms)
        // ====================================================
        const timerStage2 = setTimeout(() => {
            if (!prefersReducedMotion && this.modalEl) {
                this.modalEl.classList.add('streak-camera-shake');
                setTimeout(() => {
                    if (this.modalEl) this.modalEl.classList.remove('streak-camera-shake');
                }, 180);
            }

            // Shockwave ring
            const shockwave = document.getElementById('mc-shockwave-ring');
            if (shockwave) {
                shockwave.classList.remove('trigger-burst');
                void shockwave.offsetWidth; // Force reflow
                shockwave.classList.add('trigger-burst');
            }

            // Ignite flame with spring overshoot
            if (flameContainer) {
                flameContainer.classList.remove('anticipation-squash', 'dormant');
                flameContainer.innerHTML = getVoxelFlameSvg(isSoulFire ? 'soulfire' : 'ignited', 110);
                flameContainer.classList.add('ignite-spring');
            }

            // Expand heat bloom
            const heatBloom = document.getElementById('mc-flare-heat-bloom');
            if (heatBloom) {
                heatBloom.classList.add('bloom-burst');
            }

            // Particle ignition burst
            if (this.particleCanvas && !prefersReducedMotion) {
                this.particleCanvas.spawnIgnitionBurst();
            }
        }, 200);
        this.activeTimers.push(timerStage2);

        // ====================================================
        // STAGE 3: Odometer Streak Counter Roll (600ms - 1100ms)
        // ====================================================
        const timerStage3 = setTimeout(() => {
            if (rollPrev && rollNext) {
                rollPrev.classList.add('roll-up-out');
                rollNext.classList.remove('prepare-bottom');
                rollNext.classList.add('roll-up-in');
            }

            const counterContainer = document.getElementById('flare-streak-odometer-container');
            if (counterContainer) {
                counterContainer.classList.add('shine-sweep');
            }
        }, 600);
        this.activeTimers.push(timerStage3);

        // ====================================================
        // STAGE 4: 7-Day Hotbar Lock-In (1000ms - 1550ms)
        // ====================================================
        const timerStage4 = setTimeout(() => {
            if (hotbarContainer) {
                // Update hotbar to claimed today with slam animation
                hotbarContainer.innerHTML = getWeeklyHotbarHtml(newStreak, true);
                const todaySlot = hotbarContainer.querySelector('.mc-hotbar-slot.today');
                if (todaySlot) {
                    todaySlot.classList.add('slam-lock');

                    if (this.particleCanvas && !prefersReducedMotion) {
                        const rect = todaySlot.getBoundingClientRect();
                        const canvasRect = this.particleCanvas.canvas.getBoundingClientRect();
                        const slotCenterX = rect.left + rect.width / 2 - canvasRect.left;
                        const slotCenterY = rect.top + rect.height / 2 - canvasRect.top;
                        this.particleCanvas.spawnSlotLockBurst(slotCenterX, slotCenterY, 12);
                    }
                }
            }
        }, 1050);
        this.activeTimers.push(timerStage4);

        // ====================================================
        // STAGE 5: Celebratory Banner & Living Idle (1550ms+)
        // ====================================================
        const timerStage5 = setTimeout(() => {
            if (celebrationBanner) {
                celebrationBanner.classList.add('visible');
            }
            if (actionsContainer) {
                actionsContainer.classList.add('visible');
            }
            if (flameContainer) {
                flameContainer.classList.remove('ignite-spring');
                flameContainer.classList.add('living-idle');
            }
            const heatBloom = document.getElementById('mc-flare-heat-bloom');
            if (heatBloom) {
                heatBloom.classList.remove('bloom-burst');
                heatBloom.classList.add('bloom-idle');
            }

            this.isAnimating = false;
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, 1550);
        this.activeTimers.push(timerStage5);

        // Collect & Backdrop Dismiss Handlers
        const handleCollectAction = () => {
            const cb = this.onCollectCallback;
            this.onCollectCallback = null;
            this.closeModal();
            if (typeof cb === 'function') {
                cb();
            }
        };

        if (collectBtn) {
            collectBtn.onclick = handleCollectAction;
        }

        if (this.modalEl) {
            this.modalEl.onclick = (e) => {
                if (e.target === this.modalEl || e.target.classList.contains('mc-flare-backdrop')) {
                    handleCollectAction();
                }
            };
        }

        if (this.handleKeyDown) {
            window.removeEventListener('keydown', this.handleKeyDown);
        }
        this.handleKeyDown = (e) => {
            if (e.key === 'Escape' && this.modalEl && this.modalEl.style.display !== 'none') {
                handleCollectAction();
            }
        };
        window.addEventListener('keydown', this.handleKeyDown);
    }
}

// Global Singleton
export const streakCelebration = new StreakCelebrationController();

/**
 * Universal Flare Celebration Trigger
 * Used across account.html and dreamstimeskip.html
 */
export function triggerFlareAnimation(streak, rewardItem, previousStreak = Math.max(0, streak - 1), onCollect = null) {
    const flareModal = document.getElementById('mc-flare-modal');
    if (!flareModal) return;

    // Backward-compatible element updates
    const streakNumberEl = document.getElementById('flare-streak-number');
    const rarityPillEl = document.getElementById('flare-rarity-pill');
    const iconContainerEl = document.getElementById('flare-icon-container');
    const itemNameEl = document.getElementById('flare-item-name');
    const pointsBonusEl = document.getElementById('flare-points-bonus');
    const itemDescEl = document.getElementById('flare-item-desc');
    const collectBtn = document.getElementById('flare-collect-btn');

    if (streakNumberEl) streakNumberEl.textContent = streak;
    if (rewardItem) {
        if (itemNameEl) itemNameEl.textContent = rewardItem.name;
        if (pointsBonusEl) pointsBonusEl.textContent = `+${rewardItem.points} Unstoppable Loyalty Points Added!`;
        if (itemDescEl) itemDescEl.textContent = rewardItem.desc;

        if (rarityPillEl) {
            rarityPillEl.className = 'mc-flare-rarity-pill';
            if (rewardItem.rarity === 'legendary') {
                rarityPillEl.textContent = '💎 LEGENDARY REWARD';
                rarityPillEl.classList.add('legendary');
            } else if (rewardItem.rarity === 'mythic') {
                rarityPillEl.textContent = '🛡️ MYTHIC REWARD';
                rarityPillEl.classList.add('mythic');
            } else if (rewardItem.rarity === 'elytra') {
                rarityPillEl.textContent = '🪽 ULTRA GRAND FINALE';
                rarityPillEl.classList.add('grand');
            } else {
                rarityPillEl.textContent = '✨ DAILY MINECRAFT TREASURE';
            }
        }

        if (iconContainerEl && rewardItem.icon) {
            iconContainerEl.innerHTML = getMinecraftItemSvg(rewardItem.icon);
        }
    }

    streakCelebration.onCollectCallback = onCollect;

    // Trigger full 5-stage Duolingo x Minecraft celebration sequence!
    streakCelebration.triggerCelebration({
        previousStreak,
        newStreak: streak,
        rewardItem,
        isReplay: false,
        onCollect
    });

    if (collectBtn) {
        collectBtn.onclick = () => {
            const cb = streakCelebration.onCollectCallback;
            streakCelebration.onCollectCallback = null;
            streakCelebration.closeModal();
            if (typeof cb === 'function') {
                cb();
            }
        };
    }
}

export default streakCelebration;
