let audioCtx = null;
let currentSfxVolume = 1.0;

export function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
}

export function setSfxVolume(volume) {
    currentSfxVolume = Math.max(0, Math.min(1, typeof volume === 'number' ? volume : (volume ? 1 : 0)));
    if (pullGain && audioCtx) {
        const peakGain = 0.3 * currentSfxVolume;
        pullGain.gain.setTargetAtTime(peakGain, audioCtx.currentTime, 0.03);
    }
}

export function getSfxVolume() {
    return currentSfxVolume;
}

// Generates a satisfying, juicy "pop" sound
export function playPopSound(volume = currentSfxVolume) {
    const effectiveVol = typeof volume === 'number' ? Math.max(0, Math.min(1, volume)) : (volume ? currentSfxVolume : 0);
    if (effectiveVol <= 0) return;
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Sine wave dropping rapidly in pitch creates a water-drop / bubble pop effect
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    // Quick attack and quick decay for the snap
    const peak = 0.8 * effectiveVol;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(peak, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * effectiveVol), audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// Variables to track the ongoing pull sound
let pullOsc = null;
let pullGain = null;
let pullFilter = null;

// Starts the rubbery stretch sound
export function startPullSound(volume = currentSfxVolume) {
    const effectiveVol = typeof volume === 'number' ? Math.max(0, Math.min(1, volume)) : (volume ? currentSfxVolume : 0);
    if (effectiveVol <= 0) return;
    initAudio();
    if (!audioCtx) return;
    if (pullOsc) return; // Already playing
    
    pullOsc = audioCtx.createOscillator();
    pullGain = audioCtx.createGain();
    pullFilter = audioCtx.createBiquadFilter();
    
    // Sawtooth + Lowpass filter = classic rubbery/creamy synth texture
    pullOsc.type = 'sawtooth';
    pullOsc.frequency.setValueAtTime(50, audioCtx.currentTime); // Low fundamental pitch
    
    pullFilter.type = 'lowpass';
    pullFilter.frequency.setValueAtTime(100, audioCtx.currentTime); // Starts muted
    pullFilter.Q.value = 10; // High resonance for that creamy squelch
    
    const peak = 0.3 * effectiveVol;
    pullGain.gain.setValueAtTime(0, audioCtx.currentTime);
    pullGain.gain.linearRampToValueAtTime(peak, audioCtx.currentTime + 0.05); // Fade in gently
    
    pullOsc.connect(pullFilter);
    pullFilter.connect(pullGain);
    pullGain.connect(audioCtx.destination);
    
    pullOsc.start();
}

// Modulates the sound based on stretch distance
export function updatePullSound(distance, volume = currentSfxVolume) {
    const effectiveVol = typeof volume === 'number' ? Math.max(0, Math.min(1, volume)) : (volume ? currentSfxVolume : 0);
    if (effectiveVol <= 0 || !audioCtx || !pullFilter || !pullOsc) return;
    
    // As the user pulls further, open the filter (brighter sound) and raise pitch slightly (tension)
    // Toned down to make it less harsh
    const mappedFreq = Math.min(1200, 100 + distance * 6);
    const mappedPitch = Math.min(100, 50 + distance * 0.2);
    
    pullFilter.frequency.setTargetAtTime(mappedFreq, audioCtx.currentTime, 0.03);
    pullOsc.frequency.setTargetAtTime(mappedPitch, audioCtx.currentTime, 0.03);
}

// Stops the stretch sound
export function stopPullSound() {
    if (!audioCtx || !pullOsc || !pullGain) return;
    
    const oscToStop = pullOsc;
    const gainToStop = pullGain;
    
    // Quick fade out to avoid clicking
    gainToStop.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    setTimeout(() => {
        try {
            oscToStop.stop();
            oscToStop.disconnect();
        } catch (e) {
            // Ignore errors if the oscillator is already stopped or disconnected
            console.error("Manager info: Error stopping oscillator:", e.message || e);
        }
    }, 100);
    
    pullOsc = null;
    pullGain = null;
    pullFilter = null;
}
