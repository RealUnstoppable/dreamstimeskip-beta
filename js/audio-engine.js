/**
 * AudioMixEngine
 * Professional dual-deck mixing engine using the Web Audio API.
 * 
 * Provides equal-power crossfading, ducking, BPM matching, and silent trimming.
 */

const CURVE_LENGTH = 256;
const fadeOutCurve = new Float32Array(CURVE_LENGTH);
const fadeInCurve = new Float32Array(CURVE_LENGTH);
for (let i = 0; i < CURVE_LENGTH; i++) {
  const x = i / (CURVE_LENGTH - 1);
  fadeOutCurve[i] = Math.cos((Math.PI / 2) * x);
  fadeInCurve[i] = Math.sin((Math.PI / 2) * x);
}

// Ensure ramp doesn't go exactly to 0 for exponential ramps
const EPSILON = 0.0001;

export class AudioMixEngine {
  constructor() {
    this.ctx = null;
    this.deckAGain = null;
    this.deckBGain = null;
    this.masterGain = null;
    
    // 3-Band Equalizers for Deck A and B
    this.deckAEQ = null;
    this.deckBEQ = null;
    this.defaultCrossfadeDuration = 15;
    this.streamHooks = [];
    
    // WeakMap to prevent double-creation of MediaElementSource
    this.elementSources = new WeakMap();
    
    this.crossfadeTimeout = null;
    this.duckTimeout = null;
  }

  /**
   * Helper to create a 3-band equalizer chain (lowshelf, peaking, highshelf)
   */
  createEQChain(ctx) {
    if (!ctx) return null;
    try {
      const low = ctx.createBiquadFilter();
      low.type = 'lowshelf';
      low.frequency.value = 250;
      low.gain.value = 0;

      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1500;
      mid.Q.value = 1.0;
      mid.gain.value = 0;

      const high = ctx.createBiquadFilter();
      high.type = 'highshelf';
      high.frequency.value = 4000;
      high.gain.value = 0;

      low.connect(mid);
      mid.connect(high);

      return {
        input: low,
        output: high,
        low,
        mid,
        high,
        settings: { bass: 0, mid: 0, treble: 0 }
      };
    } catch (err) {
      console.warn('AudioMixEngine: could not build EQ chain', err);
      return null;
    }
  }

  /**
   * Wires two <audio> elements into the Web Audio graph
   * @param {HTMLMediaElement} audioEl1 - The first audio element (Deck A)
   * @param {HTMLMediaElement} audioEl2 - The second audio element (Deck B)
   */
  init(audioEl1, audioEl2) {
    if (!this.ctx) {
      const AudioContext = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;
      if (!AudioContext) {
        console.warn('AudioContext not supported in this environment');
        return;
      }
      this.ctx = new AudioContext({ latencyHint: 'interactive' });
      
      this.ctx.onstatechange = () => {
        if (this.ctx.state === 'interrupted') {
          console.warn('AudioContext interrupted, will try to resume when possible');
        }
      };
    }

    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      if (this.analyser) {
        try { this.masterGain.connect(this.analyser); } catch (_) {}
      }
    }

    if (!this.deckAGain) {
      this.deckAGain = this.ctx.createGain();
      this.deckAGain.connect(this.masterGain);
    }
    
    if (!this.deckBGain) {
      this.deckBGain = this.ctx.createGain();
      this.deckBGain.connect(this.masterGain);
    }

    // Initialize EQ chains
    if (!this.deckAEQ) {
      this.deckAEQ = this.createEQChain(this.ctx);
      if (this.deckAEQ) {
        this.deckAEQ.output.connect(this.deckAGain);
      }
    }
    if (!this.deckBEQ) {
      this.deckBEQ = this.createEQChain(this.ctx);
      if (this.deckBEQ) {
        this.deckBEQ.output.connect(this.deckBGain);
      }
    }

    const deckAInput = this.deckAEQ ? this.deckAEQ.input : this.deckAGain;
    const deckBInput = this.deckBEQ ? this.deckBEQ.input : this.deckBGain;

    // Connect Deck A
    if (!this.elementSources.has(audioEl1)) {
      try {
        const sourceA = this.ctx.createMediaElementSource(audioEl1);
        sourceA.connect(deckAInput);
        this.elementSources.set(audioEl1, sourceA);
      } catch (err) {
        console.error('Failed to create source for Deck A', err);
      }
    } else {
      const sourceA = this.elementSources.get(audioEl1);
      try {
        sourceA.disconnect();
        sourceA.connect(deckAInput);
      } catch (err) {
        console.warn('AudioMixEngine: Deck A reconnect note', err);
      }
    }

    // Connect Deck B
    if (!this.elementSources.has(audioEl2)) {
      try {
        const sourceB = this.ctx.createMediaElementSource(audioEl2);
        sourceB.connect(deckBInput);
        this.elementSources.set(audioEl2, sourceB);
      } catch (err) {
        console.error('Failed to create source for Deck B', err);
      }
    } else {
      const sourceB = this.elementSources.get(audioEl2);
      try {
        sourceB.disconnect();
        sourceB.connect(deckBInput);
      } catch (err) {
        console.warn('AudioMixEngine: Deck B reconnect note', err);
      }
    }
  }

  /**
   * Handles autoplay policy and suspended states
   * @returns {Promise<boolean>} True if running, false if failed
   */
  async ensureRunning() {
    if (!this.ctx) return false;
    
    try {
      if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
        await this.ctx.resume();
      }
      return this.ctx.state === 'running';
    } catch (err) {
      console.error('Failed to resume AudioContext:', err);
      return false;
    }
  }

  /**
   * Returns the underlying AudioContext
   * @returns {AudioContext}
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Returns the GainNode for a specific deck
   * @param {string} deck - 'A' or 'B'
   * @returns {GainNode}
   */
  getDeckGain(deck) {
    return deck === 'A' ? this.deckAGain : this.deckBGain;
  }

  /**
   * Returns the master GainNode
   * @returns {GainNode}
   */
  getMasterGain() {
    return this.masterGain;
  }

  /**
   * Sets the volume of a deck, optionally with a ramp
   * @param {string} deck - 'A' or 'B'
   * @param {number} value - Target volume (0.0 to 1.0)
   * @param {number} rampTime - Time in seconds to reach the value
   */
  setDeckVolume(deck, value, rampTime = 0) {
    const gainNode = this.getDeckGain(deck);
    if (!gainNode) return;

    const t = this.ctx.currentTime;
    const targetVal = Math.max(0, Math.min(1, value));

    // Cancel previously scheduled changes to prevent conflict
    gainNode.gain.cancelScheduledValues(t);
    // Explicitly set value at current time so ramp starts exactly here
    gainNode.gain.setValueAtTime(gainNode.gain.value, t);

    if (rampTime > 0) {
      if (targetVal === 0) {
        // Use linear for fading to 0 as exponential to 0 is invalid
        gainNode.gain.linearRampToValueAtTime(0, t + rampTime);
      } else {
        const safeTarget = Math.max(EPSILON, targetVal);
        gainNode.gain.exponentialRampToValueAtTime(safeTarget, t + rampTime);
      }
    } else {
      gainNode.gain.setValueAtTime(targetVal, t);
    }
  }

  /**
   * Perform a crossfade from one deck to another
   * @param {string} fromDeck - 'A' or 'B'
   * @param {string} toDeck - 'A' or 'B'
   * @param {number} duration - Duration in seconds
   * @param {Object} options - Crossfade options (equalPower, onComplete)
   * @returns {Object} Object with a cancel() method
   */
  crossfade(fromDeck, toDeck, duration, options = {}) {
    const equalPower = options.equalPower !== false;
    const onComplete = options.onComplete;
    
    const fromGain = this.getDeckGain(fromDeck);
    const toGain = this.getDeckGain(toDeck);

    if (!fromGain || !toGain) return { cancel: () => {} };

    const t = this.ctx.currentTime;
    
    fromGain.gain.cancelScheduledValues(t);
    toGain.gain.cancelScheduledValues(t);

    fromGain.gain.setValueAtTime(fromGain.gain.value, t);
    toGain.gain.setValueAtTime(toGain.gain.value, t);

    if (equalPower) {
      fromGain.gain.setValueCurveAtTime(fadeOutCurve, t, duration);
      toGain.gain.setValueCurveAtTime(fadeInCurve, t, duration);
    } else {
      fromGain.gain.linearRampToValueAtTime(0, t + duration);
      toGain.gain.linearRampToValueAtTime(1, t + duration);
    }

    if (this.crossfadeTimeout) clearTimeout(this.crossfadeTimeout);
    
    if (onComplete) {
      this.crossfadeTimeout = setTimeout(() => {
        onComplete();
      }, duration * 1000);
    }

    return {
      cancel: () => {
        this.cancelCrossfade();
      }
    };
  }

  /**
   * Cancels any in-progress crossfade by canceling scheduled values
   */
  cancelCrossfade() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (this.deckAGain) this.deckAGain.gain.cancelScheduledValues(t);
    if (this.deckBGain) this.deckBGain.gain.cancelScheduledValues(t);
    if (this.crossfadeTimeout) clearTimeout(this.crossfadeTimeout);
  }

  /**
   * Ducks the master volume (useful for voiceovers)
   * @param {number} targetVolume - Volume to duck to
   * @param {number} attackMs - Ramp down time in ms
   * @param {number} releaseMs - Ramp up time in ms for unduck
   * @returns {Function} Function to unduck (restore volume)
   */
  duck(targetVolume, attackMs = 80, releaseMs = 1500) {
    if (!this.masterGain) return () => {};
    
    const t = this.ctx.currentTime;
    const gain = this.masterGain.gain;
    const currentVol = gain.value;
    
    gain.cancelScheduledValues(t);
    gain.setValueAtTime(currentVol, t);
    
    const safeTarget = Math.max(EPSILON, targetVolume);
    gain.exponentialRampToValueAtTime(safeTarget, t + (attackMs / 1000));

    return () => {
      const now = this.ctx.currentTime;
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value, now);
      gain.exponentialRampToValueAtTime(1.0, now + (releaseMs / 1000));
    };
  }

  /**
   * Fades in a deck to target volume
   * @param {string} deck - 'A' or 'B'
   * @param {number} duration - Fade duration in seconds
   * @param {number} targetVolume - Final volume
   */
  fadeIn(deck, duration = 0.5, targetVolume = 1) {
    const gainNode = this.getDeckGain(deck);
    if (!gainNode) return;

    const t = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(t);
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(targetVolume, t + duration);
  }

  /**
   * Fades out a deck to 0
   * @param {string} deck - 'A' or 'B'
   * @param {number} duration - Fade duration in seconds
   * @param {Function} onComplete - Callback when done
   */
  fadeOut(deck, duration = 0.5, onComplete = null) {
    const gainNode = this.getDeckGain(deck);
    if (!gainNode) return;

    const t = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(t);
    gainNode.gain.setValueAtTime(gainNode.gain.value, t);
    gainNode.gain.linearRampToValueAtTime(0, t + duration);
    
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, duration * 1000);
    }
  }

  /**
   * Apply BPM matching to an audio element
   * @param {HTMLMediaElement} audioElement - The audio element
   * @param {number} sourceBpm - Original BPM of the track
   * @param {number} targetBpm - Target BPM to match
   * @param {number} maxStretch - Maximum stretch ratio deviation from 1
   * @returns {boolean} True if matched, false if outside limits
   */
  applyBeatMatch(audioElement, sourceBpm, targetBpm, maxStretch = 0.08) {
    if (!sourceBpm || !targetBpm) return false;
    
    const ratio = targetBpm / sourceBpm;
    if (Math.abs(ratio - 1) > maxStretch) {
      return false; // Unmatchable
    }

    if ('preservesPitch' in audioElement) {
      audioElement.preservesPitch = true;
    }
    
    audioElement.playbackRate = ratio;
    return true;
  }

  /**
   * Gradually drifts the playback rate of an element back to 1.0
   * @param {HTMLMediaElement} audioElement - The audio element
   * @param {number} durationMs - Duration of drift in ms
   * @returns {Function} A cancel function
   */
  driftPlaybackRateToNormal(audioElement, durationMs = 3000) {
    const startRate = audioElement.playbackRate;
    if (Math.abs(startRate - 1.0) < 0.001) return () => {}; 

    const startTime = performance.now();
    let rAF;

    const step = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      audioElement.playbackRate = startRate + (1.0 - startRate) * progress;

      if (progress < 1) {
        rAF = requestAnimationFrame(step);
      }
    };

    rAF = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rAF);
    };
  }

  /**
   * Analyzes an audio element's underlying file to find start/end non-silent points
   * @param {HTMLMediaElement} audioElement 
   * @returns {Promise<{startOffset: number, endOffset: number}>}
   */
  async trimSilence(audioElement) {
    try {
      const src = audioElement.currentSrc || audioElement.src;
      if (!src) throw new Error('No audio source found');
      
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      
      const tempCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
      tempCtx.close();

      const channelData = audioBuffer.getChannelData(0); 
      const sampleRate = audioBuffer.sampleRate;
      
      const windowSize = Math.floor(sampleRate * 0.05); // 50ms windows
      const threshold = 0.01;
      
      let startOffset = 0;
      let endOffset = audioBuffer.duration;

      for (let i = 0; i < channelData.length; i += windowSize) {
        let sum = 0;
        const end = Math.min(i + windowSize, channelData.length);
        for (let j = i; j < end; j++) {
          sum += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sum / (end - i));
        if (rms > threshold) {
          startOffset = i / sampleRate;
          break;
        }
      }

      for (let i = channelData.length - windowSize; i >= 0; i -= windowSize) {
        let sum = 0;
        const end = Math.min(i + windowSize, channelData.length);
        for (let j = i; j < end; j++) {
          sum += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sum / (end - i));
        if (rms > threshold) {
          endOffset = (i + windowSize) / sampleRate;
          break;
        }
      }

      return { startOffset, endOffset };
    } catch (err) {
      console.warn('Silent trim failed:', err);
      return { startOffset: 0, endOffset: audioElement.duration || 0 };
    }
  }

  /**
   * Returns a connected AnalyserNode for audio visualization
   * @returns {AnalyserNode|null}
   */
  getAnalyser() {
    if (!this.ctx) return null;
    if (!this.analyser) {
      try {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;
        if (this.masterGain) {
          this.masterGain.connect(this.analyser);
        }
      } catch (err) {
        console.warn('AudioMixEngine: analyser note', err);
      }
    }
    return this.analyser;
  }

  /**
   * Wires an ad audio element into the master audio graph
   * @param {HTMLMediaElement} audioElement
   */
  connectAdElement(audioElement) {
    if (!this.ctx || !audioElement) return;
    if (!this.elementSources.has(audioElement)) {
      try {
        const source = this.ctx.createMediaElementSource(audioElement);
        if (!this.adGain) {
          this.adGain = this.ctx.createGain();
          if (this.masterGain) {
            this.adGain.connect(this.masterGain);
          }
        }
        source.connect(this.adGain);
        this.elementSources.set(audioElement, source);
      } catch (err) {
        console.warn('AudioMixEngine: connectAdElement note', err);
      }
    }
  }

  /**
   * Sets the 3-band EQ parameters for Deck A or Deck B
   * @param {string} deck - 'A' or 'B'
   * @param {Object} eqValues - { bass?: number, mid?: number, treble?: number } (-12 to +12 dB)
   */
  setEQ(deck, { bass, mid, treble } = {}) {
    const eq = deck === 'A' ? this.deckAEQ : (deck === 'B' ? this.deckBEQ : null);
    if (!eq || !this.ctx) return null;
    
    const clampGain = (val) => Math.max(-12, Math.min(12, typeof val === 'number' ? val : 0));
    const t = this.ctx.currentTime;

    if (typeof bass === 'number') {
      const g = clampGain(bass);
      eq.low.gain.setValueAtTime(g, t);
      eq.settings.bass = g;
    }
    if (typeof mid === 'number') {
      const g = clampGain(mid);
      eq.mid.gain.setValueAtTime(g, t);
      eq.settings.mid = g;
    }
    if (typeof treble === 'number') {
      const g = clampGain(treble);
      eq.high.gain.setValueAtTime(g, t);
      eq.settings.treble = g;
    }

    this.triggerStreamHooks('eqChange', { deck, settings: { ...eq.settings } });
    return { ...eq.settings };
  }

  /**
   * Gets current 3-band EQ settings for Deck A or Deck B
   * @param {string} deck - 'A' or 'B'
   */
  getEQ(deck) {
    const eq = deck === 'A' ? this.deckAEQ : (deck === 'B' ? this.deckBEQ : null);
    return eq ? { ...eq.settings } : { bass: 0, mid: 0, treble: 0 };
  }

  /**
   * Sets the default or target crossfade duration
   * @param {number} duration - seconds (1 to 30)
   */
  setCrossfadeDuration(duration) {
    if (typeof duration === 'number' && !isNaN(duration)) {
      this.defaultCrossfadeDuration = Math.max(1, Math.min(30, duration));
      this.triggerStreamHooks('crossfadeDurationChange', { duration: this.defaultCrossfadeDuration });
    }
    return this.defaultCrossfadeDuration;
  }

  getCrossfadeDuration() {
    return this.defaultCrossfadeDuration || 15;
  }

  /**
   * Register audio stream hooks for real-time visualization or mixer callbacks
   * @param {Function} hook - callback(event, payload)
   */
  addStreamHook(hook) {
    if (typeof hook === 'function') {
      this.streamHooks.push(hook);
    }
  }

  triggerStreamHooks(event, payload) {
    for (const hook of this.streamHooks) {
      try {
        hook(event, payload);
      } catch (err) {
        console.warn('AudioMixEngine stream hook notice:', err);
      }
    }
  }

  /**
   * Destroys the engine, disconnecting nodes and closing context
   */
  destroy() {
    this.cancelCrossfade();
    
    if (this.deckAGain) this.deckAGain.disconnect();
    if (this.deckBGain) this.deckBGain.disconnect();
    if (this.masterGain) this.masterGain.disconnect();
    
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    
    this.deckAGain = null;
    this.deckBGain = null;
    this.masterGain = null;
  }
}

export const mixEngine = new AudioMixEngine();
if (typeof window !== 'undefined') {
  window.mixEngine = mixEngine;
}
