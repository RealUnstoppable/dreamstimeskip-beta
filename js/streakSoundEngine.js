/**
 * streakSoundEngine.js
 * 
 * Procedural Web Audio API Sound Engine for Dreams TimeSkip Daily Streaks.
 * 100% self-contained, zero external audio asset dependencies, guaranteed reliable playback.
 * 
 * Sound Specifications:
 * 1. Flint & Steel Strike (t = 0ms): 45ms high-passed noise + 1900Hz->600Hz triangle transient
 * 2. Fire Ignition Whoosh (t = 160ms): 400ms band-pass noise swept 180Hz -> 1100Hz -> 350Hz
 * 3. Duolingo x Minecraft XP Arpeggio (t = 300ms - 950ms): F#5 (739.99Hz), A#5 (932.33Hz), C#6 (1108.73Hz), F#6 (1479.98Hz)
 * 4. Odometer Tick (t = 700ms): 880Hz -> 440Hz in 50ms
 * 5. Calendar Lock Pop (t = 1100ms): 1174Hz -> 1567Hz double-blip
 */

export class StreakSoundEngine {
    constructor() {
        this.ctx = null;
        this.storageKey = 'dts_streak_sound_muted';
        this.activeNodes = new Set();
        this.scheduledTimers = [];
        this.masterGain = null;
        this.isMuted = this.loadMutedState();
    }

    loadMutedState() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(this.storageKey) === 'true';
            }
        } catch (_) {}
        return false;
    }

    setMuted(muted) {
        this.isMuted = Boolean(muted);
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.storageKey, this.isMuted ? 'true' : 'false');
            }
        } catch (_) {}
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    toggleMute() {
        return this.setMuted(!this.isMuted);
    }

    getMuted() {
        return this.isMuted;
    }

    ensureContext() {
        if (typeof window === 'undefined') return null;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;

        if (!this.ctx) {
            try {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            } catch (err) {
                console.warn('Notice: Web Audio initialization notice:', err);
                return null;
            }
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }

        return this.ctx;
    }

    registerNode(node) {
        if (!node) return;
        this.activeNodes.add(node);
        const cleanup = () => {
            this.activeNodes.delete(node);
        };
        if (node.onended !== undefined) {
            node.addEventListener('ended', cleanup, { once: true });
        }
    }

    createNoiseBuffer(durationSeconds) {
        const ctx = this.ctx;
        if (!ctx) return null;
        const sampleRate = ctx.sampleRate || 44100;
        const bufferSize = Math.max(1, Math.floor(sampleRate * durationSeconds));
        const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // White noise between -1.0 and 1.0
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    /**
     * Sound 1: Flint & Steel Strike (t = 0ms)
     * 45ms white-noise buffer routed through a high-pass filter (2200Hz)
     * + sharp metallic triangle oscillator transient (1900Hz dropping to 600Hz over 40ms).
     */
    playFlintAndSteel(startTime = 0) {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const start = ctx.currentTime + startTime;

        // 1. Noise transient (45ms, high-pass 2200Hz)
        const noiseBuf = this.createNoiseBuffer(0.045);
        if (noiseBuf) {
            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noiseBuf;

            const hpFilter = ctx.createBiquadFilter();
            hpFilter.type = 'highpass';
            hpFilter.frequency.setValueAtTime(2200, start);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.0001, start);
            noiseGain.gain.linearRampToValueAtTime(0.55, start + 0.003);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);

            noiseSource.connect(hpFilter);
            hpFilter.connect(noiseGain);
            noiseGain.connect(this.masterGain);

            noiseSource.start(start);
            noiseSource.stop(start + 0.05);
            this.registerNode(noiseSource);
        }

        // 2. Metallic triangle transient (1900Hz -> 600Hz over 40ms)
        const triOsc = ctx.createOscillator();
        triOsc.type = 'triangle';
        triOsc.frequency.setValueAtTime(1900, start);
        triOsc.frequency.exponentialRampToValueAtTime(600, start + 0.04);

        const triGain = ctx.createGain();
        triGain.gain.setValueAtTime(0.0001, start);
        triGain.gain.linearRampToValueAtTime(0.45, start + 0.002);
        triGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);

        triOsc.connect(triGain);
        triGain.connect(this.masterGain);

        triOsc.start(start);
        triOsc.stop(start + 0.045);
        this.registerNode(triOsc);
    }

    /**
     * Sound 2: Fire Ignition Whoosh (t = 160ms)
     * 400ms noise buffer routed through a band-pass filter sweeping exponentially
     * from 180Hz -> 1100Hz -> 350Hz with a warm gain envelope.
     */
    playIgnitionWhoosh(startTime = 0) {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const start = ctx.currentTime + startTime;
        const duration = 0.40; // 400ms

        const noiseBuf = this.createNoiseBuffer(duration);
        if (!noiseBuf) return;

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;

        // Band-pass filter sweep
        const bpFilter = ctx.createBiquadFilter();
        bpFilter.type = 'bandpass';
        bpFilter.Q.setValueAtTime(2.6, start);
        bpFilter.frequency.setValueAtTime(180, start);
        bpFilter.frequency.exponentialRampToValueAtTime(1100, start + 0.16);
        bpFilter.frequency.exponentialRampToValueAtTime(350, start + duration);

        // Warm gain envelope
        const whooshGain = ctx.createGain();
        whooshGain.gain.setValueAtTime(0.0001, start);
        whooshGain.gain.linearRampToValueAtTime(0.65, start + 0.12);
        whooshGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        noiseSource.connect(bpFilter);
        bpFilter.connect(whooshGain);
        whooshGain.connect(this.masterGain);

        noiseSource.start(start);
        noiseSource.stop(start + duration + 0.02);
        this.registerNode(noiseSource);
    }

    /**
     * Helper to play an individual XP chime note
     * Layered triangle + sine oscillators with fast attack (8ms) and exponential decay.
     */
    playChimeNote(freq, startTime, duration = 0.45, isFinal = false) {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const start = ctx.currentTime + startTime;

        // Primary Sine Oscillator (pure bell body)
        const sineOsc = ctx.createOscillator();
        sineOsc.type = 'sine';
        sineOsc.frequency.setValueAtTime(freq, start);

        // Layered Triangle Oscillator (warm retro chime texture)
        const triOsc = ctx.createOscillator();
        triOsc.type = 'triangle';
        triOsc.frequency.setValueAtTime(freq, start);

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.0001, start);
        noteGain.gain.linearRampToValueAtTime(isFinal ? 0.40 : 0.32, start + 0.008);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        sineOsc.connect(noteGain);
        triOsc.connect(noteGain);
        noteGain.connect(this.masterGain);

        sineOsc.start(start);
        triOsc.start(start);
        sineOsc.stop(start + duration + 0.02);
        triOsc.stop(start + duration + 0.02);

        this.registerNode(sineOsc);
        this.registerNode(triOsc);

        // If it's the final note (F#6), add a shimmering 2nd harmonic overtone held slightly longer
        if (isFinal) {
            const harmonicOsc = ctx.createOscillator();
            harmonicOsc.type = 'sine';
            harmonicOsc.frequency.setValueAtTime(freq * 2, start);

            const harmonicGain = ctx.createGain();
            harmonicGain.gain.setValueAtTime(0.0001, start);
            harmonicGain.gain.linearRampToValueAtTime(0.12, start + 0.015);
            harmonicGain.gain.exponentialRampToValueAtTime(0.0001, start + duration + 0.15);

            harmonicOsc.connect(harmonicGain);
            harmonicGain.connect(this.masterGain);

            harmonicOsc.start(start);
            harmonicOsc.stop(start + duration + 0.2);
            this.registerNode(harmonicOsc);
        }
    }

    /**
     * Sound 3: Duolingo x Minecraft XP Reward Arpeggio (t = 300ms to 950ms)
     * Notes:
     * - F#5 (739.99 Hz) at 300ms
     * - A#5 (932.33 Hz) at 410ms
     * - C#6 (1108.73 Hz) at 520ms
     * - F#6 (1479.98 Hz) at 640ms (held longer with warm harmonic overtone)
     */
    playXpArpeggio(startTime = 0) {
        if (this.isMuted) return;
        this.playChimeNote(739.99, startTime + 0.00, 0.42, false); // F#5
        this.playChimeNote(932.33, startTime + 0.11, 0.45, false); // A#5
        this.playChimeNote(1108.73, startTime + 0.22, 0.50, false); // C#6
        this.playChimeNote(1479.98, startTime + 0.34, 0.65, true);  // F#6
    }

    /**
     * Sound 4a: Odometer Tick (t = 700ms)
     * Short pitch-drop sine/triangle pop (880Hz -> 440Hz in 50ms).
     */
    playOdometerTick(startTime = 0) {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const start = ctx.currentTime + startTime;
        const duration = 0.050; // 50ms

        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, start);
        osc.frequency.exponentialRampToValueAtTime(440, start + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.35, start + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + duration + 0.01);
        this.registerNode(osc);
    }

    /**
     * Sound 4b: Calendar Lock Pop (t = 1100ms)
     * Punchy double-blip (1174Hz -> 1567Hz).
     */
    playCalendarLockPop(startTime = 0) {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const start = ctx.currentTime + startTime;

        // Blip 1: 1174Hz (D6)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1174, start);
        osc1.frequency.exponentialRampToValueAtTime(900, start + 0.035);

        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0.0001, start);
        gain1.gain.linearRampToValueAtTime(0.40, start + 0.003);
        gain1.gain.exponentialRampToValueAtTime(0.0001, start + 0.038);

        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(start);
        osc1.stop(start + 0.045);
        this.registerNode(osc1);

        // Blip 2: 1567Hz (G6) at +45ms
        const start2 = start + 0.045;
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1567, start2);
        osc2.frequency.exponentialRampToValueAtTime(1200, start2 + 0.045);

        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.0001, start2);
        gain2.gain.linearRampToValueAtTime(0.45, start2 + 0.004);
        gain2.gain.exponentialRampToValueAtTime(0.0001, start2 + 0.05);

        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(start2);
        osc2.stop(start2 + 0.055);
        this.registerNode(osc2);
    }

    /**
     * Executes the synchronized 5-stage Duolingo x Minecraft audio choreography.
     * Timeline matches exact visual milestones:
     * - t = 0ms: Flint & Steel Strike
     * - t = 160ms: Fire Ignition Whoosh
     * - t = 300ms: XP Reward Arpeggio (F#5 -> A#5 -> C#6 -> F#6)
     * - t = 700ms: Odometer Tick (during roll)
     * - t = 1100ms: Calendar Lock Pop (daily slot lock)
     */
    playFullSequence() {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        this.stopAll();

        // Schedule Web Audio events using relative offsets in seconds
        this.playFlintAndSteel(0.000);
        this.playIgnitionWhoosh(0.160);
        this.playXpArpeggio(0.300);
        this.playOdometerTick(0.700);
        this.playCalendarLockPop(1.100);
    }

    stopAll() {
        this.scheduledTimers.forEach(id => clearTimeout(id));
        this.scheduledTimers = [];

        this.activeNodes.forEach(node => {
            try {
                if (typeof node.stop === 'function') node.stop();
                if (typeof node.disconnect === 'function') node.disconnect();
            } catch (_) {}
        });
        this.activeNodes.clear();
    }
}

// Global Singleton instance
export const streakAudio = new StreakSoundEngine();
export default streakAudio;
