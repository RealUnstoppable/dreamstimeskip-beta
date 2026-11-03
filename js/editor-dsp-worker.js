/**
 * js/editor-dsp-worker.js
 * High-performance Web Worker for background audio DSP analysis.
 * Offloads CPU-intensive tasks from the main thread:
 * 1. Multi-resolution peak mipmap pyramid generation (Float32Array).
 * 2. Spectral flux / energy peak transient detection.
 * 3. BPM and beat grid estimation.
 * 4. Sliding RMS energy analysis to detect peak viral hook windows.
 * 
 * Guarantees zero dropped frames on the main UI thread.
 */

/**
 * Computes multi-resolution peak mipmaps from raw PCM samples.
 * @param {Float32Array} pcm
 * @param {number} sampleRate
 * @returns {{ level0: object, level1: object, level2: object }}
 */
export function computePeaksMipmap(pcm, sampleRate = 44100) {
    const totalSamples = pcm.length;
    const overviewStep = Math.max(50, Math.floor(totalSamples / 1500));
    const step1 = Math.max(10, Math.floor(overviewStep / 8));
    const step2 = Math.max(1, Math.floor(overviewStep / 64));

    const buildLevel = (step) => {
        const numBuckets = Math.floor(totalSamples / step);
        const minPeaks = new Float32Array(numBuckets);
        const maxPeaks = new Float32Array(numBuckets);

        for (let b = 0; b < numBuckets; b++) {
            const start = b * step;
            const end = Math.min(totalSamples, start + step);
            let min = 0;
            let max = 0;
            for (let i = start; i < end; i++) {
                const s = pcm[i];
                if (s < min) min = s;
                if (s > max) max = s;
            }
            minPeaks[b] = min;
            maxPeaks[b] = max;
        }
        return { step, minPeaks, maxPeaks, sampleRate };
    };

    return {
        level0: buildLevel(overviewStep),
        level1: buildLevel(step1),
        level2: buildLevel(step2)
    };
}

/**
 * Detects transients using positive first-difference energy flux.
 * @param {Float32Array} pcm
 * @param {number} sampleRate
 * @param {object} [options]
 * @returns {Array<{ time: number, strength: number }>}
 */
export function computeTransients(pcm, sampleRate = 44100, options = {}) {
    const sensitivity = options.sensitivity ?? 0.6;
    const minSpacingMs = options.minSpacingMs ?? 50;
    const frameSize = 512;
    const hopSize = 256;
    const numHops = Math.floor((pcm.length - frameSize) / hopSize);

    if (numHops <= 0) return [];

    const energies = new Float32Array(numHops);
    for (let h = 0; h < numHops; h++) {
        const start = h * hopSize;
        let sum = 0;
        for (let i = 0; i < frameSize; i++) {
            const s = pcm[start + i];
            sum += s * s;
        }
        energies[h] = Math.sqrt(sum / frameSize);
    }

    // Positive first differences (spectral energy flux)
    const flux = new Float32Array(numHops);
    let maxFlux = 0.0001;
    for (let h = 1; h < numHops; h++) {
        const diff = energies[h] - energies[h - 1];
        flux[h] = diff > 0 ? diff : 0;
        if (flux[h] > maxFlux) maxFlux = flux[h];
    }

    // Adaptive threshold based on sensitivity
    const thresholdFactor = 0.85 - (sensitivity * 0.65);
    const minSpacingHops = Math.round((minSpacingMs / 1000) * (sampleRate / hopSize));

    const transients = [];
    let lastHop = -minSpacingHops;

    for (let h = 1; h < numHops - 1; h++) {
        const val = flux[h];
        const normalized = val / maxFlux;
        if (normalized >= thresholdFactor && val > flux[h - 1] && val >= flux[h + 1]) {
            if (h - lastHop >= minSpacingHops) {
                const timeSec = Number(((h * hopSize) / sampleRate).toFixed(4));
                transients.push({
                    time: timeSec,
                    strength: Number(normalized.toFixed(3))
                });
                lastHop = h;
            }
        }
    }

    return transients;
}

/**
 * Estimates BPM from detected transient intervals via histogram autocorrelation.
 * @param {Array<{ time: number, strength: number }>} transients
 * @param {number} [minBpm=70]
 * @param {number} [maxBpm=180]
 * @returns {{ bpm: number, confidence: number, downbeatOffset: number, beatIntervalMs: number }}
 */
export function computeBPM(transients, minBpm = 70, maxBpm = 180) {
    if (!transients || transients.length < 4) {
        return { bpm: 120, confidence: 0.1, downbeatOffset: 0, beatIntervalMs: 500 };
    }

    const intervals = [];
    for (let i = 0; i < transients.length - 1; i++) {
        for (let j = i + 1; j < Math.min(transients.length, i + 8); j++) {
            const dt = transients[j].time - transients[i].time;
            if (dt >= 0.25 && dt <= 1.2) {
                intervals.push(dt);
            }
        }
    }

    if (intervals.length === 0) {
        return { bpm: 120, confidence: 0.2, downbeatOffset: 0, beatIntervalMs: 500 };
    }

    // Group into 1 BPM bins
    const bins = new Map();
    for (const dt of intervals) {
        let rawBpm = 60 / dt;
        while (rawBpm < minBpm) rawBpm *= 2;
        while (rawBpm > maxBpm) rawBpm /= 2;
        const rounded = Math.round(rawBpm);
        bins.set(rounded, (bins.get(rounded) || 0) + 1);
    }

    let bestBpm = 120;
    let maxVotes = 0;
    for (const [bpm, votes] of bins.entries()) {
        if (votes > maxVotes) {
            maxVotes = votes;
            bestBpm = bpm;
        }
    }

    const confidence = Math.min(1.0, maxVotes / Math.max(1, intervals.length * 0.25));
    const firstStrongTransient = transients.find(t => t.strength > 0.6) || transients[0];
    const beatIntervalSec = 60 / bestBpm;
    const downbeatOffset = firstStrongTransient ? (firstStrongTransient.time % beatIntervalSec) : 0;

    return {
        bpm: bestBpm,
        confidence: Number(confidence.toFixed(2)),
        downbeatOffset: Number(downbeatOffset.toFixed(4)),
        beatIntervalMs: Math.round(beatIntervalSec * 1000)
    };
}

/**
 * Generates regular beat grid timestamps with downbeat flags.
 * @param {number} durationSec
 * @param {number} bpm
 * @param {number} downbeatOffset
 * @returns {Array<{ time: number, isDownbeat: boolean }>}
 */
export function computeBeatGrid(durationSec, bpm, downbeatOffset = 0) {
    if (bpm <= 0 || durationSec <= 0) return [];
    const beatInterval = 60 / bpm;
    const beats = [];
    let beatIndex = 0;

    for (let t = downbeatOffset; t <= durationSec; t += beatInterval) {
        if (t >= 0) {
            beats.push({
                time: Number(t.toFixed(4)),
                isDownbeat: (beatIndex % 4 === 0)
            });
        }
        beatIndex++;
    }
    return beats;
}

/**
 * Detects peak engagement / viral hook section using a sliding RMS energy window.
 * @param {Float32Array} pcm
 * @param {number} sampleRate
 * @param {number} [targetWindowSec=20]
 * @param {object} [metadata] - Optional pre-existing viralStart / viralEnd
 * @returns {{ start: number, end: number, confidence: number, label: string }}
 */
export function computeViralHookSection(pcm, sampleRate = 44100, targetWindowSec = 20, metadata = {}) {
    const totalDuration = pcm.length / sampleRate;

    // 1. Honor explicit metadata if present
    if (typeof metadata.viralStart === 'number' && typeof metadata.viralEnd === 'number' && metadata.viralEnd > metadata.viralStart) {
        return {
            start: Math.max(0, Number(metadata.viralStart.toFixed(3))),
            end: Math.min(totalDuration, Number(metadata.viralEnd.toFixed(3))),
            confidence: 1.0,
            label: '🔥 VIRAL HOOK'
        };
    }

    if (totalDuration <= targetWindowSec) {
        return {
            start: 0,
            end: Number(totalDuration.toFixed(3)),
            confidence: 0.8,
            label: '🔥 VIRAL HOOK'
        };
    }

    // 2. Sliding RMS window analysis (1-second step)
    const windowSamples = Math.floor(targetWindowSec * sampleRate);
    const stepSamples = Math.floor(1.0 * sampleRate); // 1s hop
    let maxRms = -1;
    let bestStartSample = 0;

    const maxStarts = Math.floor((pcm.length - windowSamples) / stepSamples);
    // Subsample step for speed on long tracks
    const stride = Math.max(1, Math.floor(sampleRate / 100)); // check 100 samples per second inside window

    for (let s = 0; s <= maxStarts; s++) {
        const startIdx = s * stepSamples;
        let sumSq = 0;
        let count = 0;

        for (let i = startIdx; i < startIdx + windowSamples; i += stride) {
            const v = pcm[i];
            sumSq += v * v;
            count++;
        }

        const rms = Math.sqrt(sumSq / Math.max(1, count));
        if (rms > maxRms) {
            maxRms = rms;
            bestStartSample = startIdx;
        }
    }

    const startSec = Number((bestStartSample / sampleRate).toFixed(3));
    const endSec = Number(Math.min(totalDuration, startSec + targetWindowSec).toFixed(3));

    return {
        start: startSec,
        end: endSec,
        confidence: 0.9,
        label: '🔥 VIRAL HOOK'
    };
}

/**
 * Web Worker Message Dispatcher
 */
if (typeof self !== 'undefined' && typeof self.postMessage === 'function' && typeof window === 'undefined') {
    self.onmessage = (e) => {
        const { id, type, pcm, sampleRate, sensitivity, metadata } = e.data;

        if (type === 'ANALYZE_AUDIO') {
            try {
                const sRate = sampleRate || 44100;
                const peaksMipmap = computePeaksMipmap(pcm, sRate);
                const transients = computeTransients(pcm, sRate, { sensitivity });
                const bpmData = computeBPM(transients);
                const duration = pcm.length / sRate;
                const beatGrid = computeBeatGrid(duration, bpmData.bpm, bpmData.downbeatOffset);
                const viralSection = computeViralHookSection(pcm, sRate, 20, metadata || {});

                // Collect transferables
                const transferList = [
                    peaksMipmap.level0.minPeaks.buffer,
                    peaksMipmap.level0.maxPeaks.buffer,
                    peaksMipmap.level1.minPeaks.buffer,
                    peaksMipmap.level1.maxPeaks.buffer,
                    peaksMipmap.level2.minPeaks.buffer,
                    peaksMipmap.level2.maxPeaks.buffer
                ];

                self.postMessage({
                    id,
                    success: true,
                    peaksMipmap,
                    transients,
                    bpmData,
                    beatGrid,
                    viralSection,
                    duration
                }, transferList);
            } catch (err) {
                self.postMessage({
                    id,
                    success: false,
                    error: err.message
                });
            }
        }
    };
}
