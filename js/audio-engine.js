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
    
    // WeakMap to prevent double-creation of MediaElementSource
    this.elementSources = new WeakMap();
    
    this.crossfadeTimeout = null;
    this.duckTimeout = null;
  }

  /**
   * Wires two <audio> elements into the Web Audio graph
   * @param {HTMLMediaElement} audioEl1 - The first audio element (Deck A)
   * @param {HTMLMediaElement} audioEl2 - The second audio element (Deck B)
   */
  init(audioEl1, audioEl2) {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
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
    }

    if (!this.deckAGain) {
      this.deckAGain = this.ctx.createGain();
      this.deckAGain.connect(this.masterGain);
    }
    
    if (!this.deckBGain) {
      this.deckBGain = this.ctx.createGain();
      this.deckBGain.connect(this.masterGain);
    }

    // Connect Deck A
    audioEl1.crossOrigin = 'anonymous';
    if (!this.elementSources.has(audioEl1)) {
      try {
        const sourceA = this.ctx.createMediaElementSource(audioEl1);
        sourceA.connect(this.deckAGain);
        this.elementSources.set(audioEl1, sourceA);
      } catch (err) {
        console.error('Failed to create source for Deck A', err);
      }
    } else {
      const sourceA = this.elementSources.get(audioEl1);
      sourceA.disconnect();
      sourceA.connect(this.deckAGain);
    }

    // Connect Deck B
    audioEl2.crossOrigin = 'anonymous';
    if (!this.elementSources.has(audioEl2)) {
      try {
        const sourceB = this.ctx.createMediaElementSource(audioEl2);
        sourceB.connect(this.deckBGain);
        this.elementSources.set(audioEl2, sourceB);
      } catch (err) {
        console.error('Failed to create source for Deck B', err);
      }
    } else {
      const sourceB = this.elementSources.get(audioEl2);
      sourceB.disconnect();
      sourceB.connect(this.deckBGain);
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
