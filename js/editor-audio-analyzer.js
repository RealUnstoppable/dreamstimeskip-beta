/**
 * js/editor-audio-analyzer.js
 * High-precision Web Audio DSP engine for transient detection, beat tracking, and BPM analysis.
 * Built for audio/video editor synchronization workflows.
 */

/**
 * Calculates Root Mean Square (RMS) energy and Onset Detection Function (ODF)
 * across overlapping audio frames.
 * 
 * @param {Float32Array} pcmData - Mono PCM samples
 * @param {number} sampleRate - Audio sample rate (e.g. 44100 or 48000)
 * @param {number} windowSize - Window size in samples (default 1024)
 * @param {number} hopSize - Hop step size in samples (default 512)
 * @returns {{ odf: Float32Array, times: Float32Array }}
 */
export function computeOnsetDetectionFunction(pcmData, sampleRate, windowSize = 1024, hopSize = 512) {
    const totalFrames = Math.floor((pcmData.length - windowSize) / hopSize);
    if (totalFrames <= 0) {
        return { odf: new Float32Array(0), times: new Float32Array(0) };
    }

    const energies = new Float32Array(totalFrames);
    const times = new Float32Array(totalFrames);
    const odf = new Float32Array(totalFrames);

    // 1. Calculate frame RMS energy
    for (let f = 0; f < totalFrames; f++) {
        const offset = f * hopSize;
        let sumSquares = 0;
        for (let i = 0; i < windowSize; i++) {
            const s = pcmData[offset + i];
            sumSquares += s * s;
        }
        energies[f] = Math.sqrt(sumSquares / windowSize);
        times[f] = (offset + windowSize / 2) / sampleRate;
    }

    // 2. Spectral/Energy Flux: positive first-difference
    odf[0] = energies[0];
    for (let f = 1; f < totalFrames; f++) {
        const diff = energies[f] - energies[f - 1];
        odf[f] = diff > 0 ? diff : 0;
    }

    return { odf, times };
}

/**
 * Detects transient attack points from mono PCM audio data using adaptive thresholding.
 * 
 * @param {Float32Array|AudioBuffer} audioData - Float32Array PCM or Web Audio AudioBuffer
 * @param {Object} [options]
 * @param {number} [options.sampleRate=44100]
 * @param {number} [options.sensitivity=0.6] - 0.1 (fewer transients) to 1.0 (more transients)
 * @param {number} [options.minSpacingMs=60] - Minimum spacing between detected transients in ms
 * @param {number} [options.windowSize=1024]
 * @param {number} [options.hopSize=512]
 * @returns {Array<{ time: number, timeMs: number, strength: number }>}
 */
export function detectTransients(audioData, options = {}) {
    let pcm;
    let sampleRate = options.sampleRate || 44100;

    if (audioData && typeof audioData.getChannelData === 'function') {
        sampleRate = audioData.sampleRate;
        // Mixdown to mono if stereo
        if (audioData.numberOfChannels > 1) {
            const ch0 = audioData.getChannelData(0);
            const ch1 = audioData.getChannelData(1);
            pcm = new Float32Array(ch0.length);
            for (let i = 0; i < ch0.length; i++) {
                pcm[i] = (ch0[i] + ch1[i]) * 0.5;
            }
        } else {
            pcm = audioData.getChannelData(0);
        }
    } else if (audioData instanceof Float32Array) {
        pcm = audioData;
    } else {
        throw new Error('detectTransients: Invalid audio data provided. Expected Float32Array or AudioBuffer.');
    }

    const sensitivity = Math.max(0.1, Math.min(1.0, options.sensitivity ?? 0.6));
    const minSpacingMs = options.minSpacingMs ?? 60;
    const windowSize = options.windowSize ?? 1024;
    const hopSize = options.hopSize ?? 512;

    const { odf, times } = computeOnsetDetectionFunction(pcm, sampleRate, windowSize, hopSize);
    if (odf.length === 0) return [];

    // Adaptive threshold calculation
    // Moving window radius: ~200ms around each frame
    const framesPerSec = sampleRate / hopSize;
    const radius = Math.max(3, Math.round(framesPerSec * 0.2));
    const kFactor = (1.1 - sensitivity) * 2.2; // higher sensitivity -> lower threshold

    const minSpacingSec = minSpacingMs / 1000;
    const transients = [];
    let lastTransientTime = -999;

    for (let f = 1; f < odf.length - 1; f++) {
        // Calculate local mean and standard deviation
        const start = Math.max(0, f - radius);
        const end = Math.min(odf.length - 1, f + radius);
        const count = end - start + 1;

        let sum = 0;
        for (let i = start; i <= end; i++) sum += odf[i];
        const mean = sum / count;

        let varSum = 0;
        for (let i = start; i <= end; i++) {
            const diff = odf[i] - mean;
            varSum += diff * diff;
        }
        const std = Math.sqrt(varSum / count);
        const threshold = mean + kFactor * std;

        const val = odf[f];
        // Peak condition: strictly greater than neighbors and above threshold
        if (val > threshold && val > odf[f - 1] && val >= odf[f + 1]) {
            const t = times[f];
            if (t - lastTransientTime >= minSpacingSec) {
                // Normalize strength relative to threshold
                const strength = Math.min(1.0, Math.max(0.1, (val - threshold) / (std + 1e-6)));
                transients.push({
                    time: Number(t.toFixed(4)),
                    timeMs: Math.round(t * 1000),
                    strength: Number(strength.toFixed(3))
                });
                lastTransientTime = t;
            }
        }
    }

    return transients;
}

/**
 * Estimates BPM (Beats Per Minute) from detected transients or raw audio using Inter-Onset
 * Interval (IOI) histogram clustering and autocorrelation.
 * 
 * @param {Array<{ time: number, strength?: number }>|AudioBuffer|Float32Array} input - Transients array or audio
 * @param {Object} [options]
 * @param {number} [options.minBpm=65]
 * @param {number} [options.maxBpm=190]
 * @param {number} [options.sampleRate=44100]
 * @returns {{ bpm: number, confidence: number, downbeatOffset: number, beatIntervalMs: number }}
 */
export function estimateBPM(input, options = {}) {
    const minBpm = options.minBpm ?? 65;
    const maxBpm = options.maxBpm ?? 190;

    let transients = [];
    if (Array.isArray(input)) {
        transients = input;
    } else {
        transients = detectTransients(input, options);
    }

    if (transients.length < 4) {
        return {
            bpm: 120.0,
            confidence: 0.1,
            downbeatOffset: transients[0]?.time ? Number(transients[0].time.toFixed(3)) : 0,
            beatIntervalMs: 500
        };
    }

    // Build Inter-Onset Interval (IOI) histogram
    // Map time intervals delta in [60/maxBpm, 60/minBpm] (approx 0.315s to 0.923s)
    const minInterval = 60 / maxBpm;
    const maxInterval = 60 / minBpm;
    const bins = new Map();

    const addInterval = (delta, weight = 1.0) => {
        if (delta <= 0) return;
        // Check fundamental, double, and half harmonics
        let candidate = delta;
        while (candidate > maxInterval) candidate /= 2;
        while (candidate < minInterval) candidate *= 2;

        if (candidate >= minInterval && candidate <= maxInterval) {
            // Round to 5ms resolution
            const key = Math.round(candidate * 200) / 200;
            bins.set(key, (bins.get(key) || 0) + weight);
        }
    };

    // Calculate intervals between nearby transients (up to 8 consecutive steps)
    for (let i = 0; i < transients.length - 1; i++) {
        const t1 = transients[i].time;
        const w1 = transients[i].strength || 1.0;
        const maxLookahead = Math.min(transients.length, i + 8);
        for (let j = i + 1; j < maxLookahead; j++) {
            const t2 = transients[j].time;
            const w2 = transients[j].strength || 1.0;
            const delta = t2 - t1;
            if (delta > 3.0) break; // Beyond 3 seconds
            addInterval(delta, Math.sqrt(w1 * w2));
        }
    }

    // Find highest peak bin
    let bestInterval = 0.5; // default 120 BPM
    let maxWeight = 0;
    let totalWeight = 0;

    for (const [interval, weight] of bins.entries()) {
        totalWeight += weight;
        if (weight > maxWeight) {
            maxWeight = weight;
            bestInterval = interval;
        }
    }

    let calculatedBpm = 60 / bestInterval;
    // Normalize to popular radio/hip-hop/pop tempo window [75, 160]
    while (calculatedBpm < 75) calculatedBpm *= 2;
    while (calculatedBpm > 175) calculatedBpm /= 2;

    const roundedBpm = Number(calculatedBpm.toFixed(1));
    const confidence = totalWeight > 0 ? Math.min(1.0, Number((maxWeight / (totalWeight * 0.25)).toFixed(2))) : 0.2;
    const beatIntervalSec = 60 / roundedBpm;

    // Find optimal downbeat phase offset t0 in [0, beatIntervalSec)
    // Score each transient modulo beatIntervalSec
    let bestOffset = 0;
    let bestPhaseScore = -1;

    for (let step = 0; step < 20; step++) {
        const candidateOffset = (step / 20) * beatIntervalSec;
        let score = 0;
        for (const tr of transients.slice(0, 30)) {
            const phase = ((tr.time - candidateOffset) % beatIntervalSec + beatIntervalSec) % beatIntervalSec;
            const distFromBeat = Math.min(phase, beatIntervalSec - phase);
            if (distFromBeat < 0.04) {
                // Close to candidate grid
                score += (tr.strength || 1.0) * (1 - distFromBeat / 0.04);
            }
        }
        if (score > bestPhaseScore) {
            bestPhaseScore = score;
            bestOffset = candidateOffset;
        }
    }

    return {
        bpm: roundedBpm,
        confidence,
        downbeatOffset: Number(bestOffset.toFixed(3)),
        beatIntervalMs: Math.round(beatIntervalSec * 1000)
    };
}

/**
 * Generates an array of beat timestamps across an audio track duration.
 * 
 * @param {number} durationSec - Total track duration in seconds
 * @param {number} bpm - Tempo in Beats Per Minute
 * @param {number} [downbeatOffset=0] - First beat offset in seconds
 * @returns {Array<{ time: number, timeMs: number, beatIndex: number, isDownbeat: boolean }>}
 */
export function generateBeatGrid(durationSec, bpm, downbeatOffset = 0) {
    if (!bpm || bpm <= 0 || durationSec <= 0) return [];
    const beatInterval = 60 / bpm;
    const beats = [];

    let t = downbeatOffset;
    // Align backwards to near zero if offset > beatInterval
    while (t > beatInterval) t -= beatInterval;
    while (t < 0) t += beatInterval;

    let index = 0;
    while (t <= durationSec) {
        beats.push({
            time: Number(t.toFixed(4)),
            timeMs: Math.round(t * 1000),
            beatIndex: index,
            isDownbeat: (index % 4 === 0)
        });
        t += beatInterval;
        index++;
    }

    return beats;
}

/**
 * Snaps a target timestamp (in ms) to the nearest detected transient or beat grid line
 * within a tolerance window.
 * 
 * @param {number} timeMs - Target time in milliseconds
 * @param {Array<{ timeMs: number }>} candidates - Array of candidate markers/transients/beats
 * @param {number} [maxDistanceMs=50] - Maximum snapping distance in ms
 * @returns {{ snappedMs: number, didSnap: boolean, deltaMs: number, candidate: object|null }}
 */
export function snapToNearest(timeMs, candidates, maxDistanceMs = 50) {
    if (!candidates || candidates.length === 0) {
        return { snappedMs: timeMs, didSnap: false, deltaMs: 0, candidate: null };
    }

    let closest = null;
    let minDiff = Infinity;

    for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        const diff = Math.abs(c.timeMs - timeMs);
        if (diff < minDiff) {
            minDiff = diff;
            closest = c;
        }
        // Early break if candidates are sorted chronologically
        if (c.timeMs > timeMs + maxDistanceMs && minDiff <= maxDistanceMs) {
            break;
        }
    }

    if (closest && minDiff <= maxDistanceMs) {
        return {
            snappedMs: closest.timeMs,
            didSnap: true,
            deltaMs: closest.timeMs - timeMs,
            candidate: closest
        };
    }

    return { snappedMs: timeMs, didSnap: false, deltaMs: 0, candidate: null };
}
