let audioCtx = null;

export function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Generates a satisfying, juicy "pop" sound
export function playPopSound(enabled = true) {
    if (!enabled) return;
    initAudio();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Sine wave dropping rapidly in pitch creates a water-drop / bubble pop effect
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    // Quick attack and quick decay for the snap
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
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
export function startPullSound(enabled = true) {
    if (!enabled) return;
    initAudio();
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
    
    pullGain.gain.setValueAtTime(0, audioCtx.currentTime);
    pullGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05); // Fade in gently
    
    pullOsc.connect(pullFilter);
    pullFilter.connect(pullGain);
    pullGain.connect(audioCtx.destination);
    
    pullOsc.start();
}

// Modulates the sound based on stretch distance
export function updatePullSound(distance, enabled = true) {
    if (!enabled || !audioCtx || !pullFilter || !pullOsc) return;
    
    // As the user pulls further, open the filter (brighter sound) and raise pitch slightly (tension)
    const mappedFreq = Math.min(2000, 100 + distance * 12);
    const mappedPitch = Math.min(150, 50 + distance * 0.4);
    
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
        } catch (e) {}
    }, 100);
    
    pullOsc = null;
    pullGain = null;
    pullFilter = null;
}
