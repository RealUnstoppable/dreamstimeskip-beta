const fs = require('fs');
let code = fs.readFileSync('js/harmonytunes.js', 'utf8');

// When playSong() is called and successfully playing:
// Let's find updatePlayPauseIcon and inject Lexi states there!
const targetUpdateIcon = `function updatePlayPauseIcon(playing) {
        if(playing) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            if(fsPlayIcon) fsPlayIcon.style.display = 'none';
            if(fsPauseIcon) fsPauseIcon.style.display = 'block';
            if(mobPlayIcon) mobPlayIcon.style.display = 'none';
            if(mobPauseIcon) mobPauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            if(fsPlayIcon) fsPlayIcon.style.display = 'block';
            if(fsPauseIcon) fsPauseIcon.style.display = 'none';
            if(mobPlayIcon) mobPlayIcon.style.display = 'block';
            if(mobPauseIcon) mobPauseIcon.style.display = 'none';
        }
    }`;

const replaceUpdateIcon = `function updatePlayPauseIcon(playing) {
        if(playing) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            if(fsPlayIcon) fsPlayIcon.style.display = 'none';
            if(fsPauseIcon) fsPauseIcon.style.display = 'block';
            if(mobPlayIcon) mobPlayIcon.style.display = 'none';
            if(mobPauseIcon) mobPauseIcon.style.display = 'block';
            
            // Lexi State: Listening
            document.querySelectorAll('.lexi-mixer-wrapper').forEach(w => {
                if (!w.classList.contains('state-mixxing')) {
                    w.classList.remove('state-deactivated');
                    w.classList.add('state-listening');
                }
            });
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            if(fsPlayIcon) fsPlayIcon.style.display = 'block';
            if(fsPauseIcon) fsPauseIcon.style.display = 'none';
            if(mobPlayIcon) mobPlayIcon.style.display = 'block';
            if(mobPauseIcon) mobPauseIcon.style.display = 'none';
            
            // Lexi State: Default (Blue) if not mixxing
            document.querySelectorAll('.lexi-mixer-wrapper').forEach(w => {
                if (!w.classList.contains('state-mixxing')) {
                    w.classList.remove('state-listening', 'state-deactivated');
                }
            });
        }
    }`;

code = code.replace(targetUpdateIcon, replaceUpdateIcon);

// Find Mixer Toggle Logic
const targetMixerToggle = `const toggleMixerMode = () => {
        isMixerMode = !isMixerMode;
        if(mixerBtn) mixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';
        if(fsMixerBtn) fsMixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';
        if(mobMixerBtn) mobMixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';`;

const replaceMixerToggle = `const toggleMixerMode = () => {
        isMixerMode = !isMixerMode;
        if(mixerBtn) mixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';
        if(fsMixerBtn) fsMixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';
        if(mobMixerBtn) mobMixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';
        
        document.querySelectorAll('.lexi-mixer-wrapper').forEach(w => {
            if (isMixerMode) {
                w.classList.remove('state-listening', 'state-deactivated');
                w.classList.add('state-mixxing');
            } else {
                w.classList.remove('state-mixxing');
                w.classList.add('state-deactivated'); // Turns red when deactivated
                setTimeout(() => {
                    // Revert to listening or default after 2s of red
                    if (w.classList.contains('state-deactivated')) {
                        w.classList.remove('state-deactivated');
                        if (!activeAudio.paused) w.classList.add('state-listening');
                    }
                }, 2000);
            }
        });`;

code = code.replace(targetMixerToggle, replaceMixerToggle);

fs.writeFileSync('js/harmonytunes.js', code, 'utf8');
console.log("HarmonyTunes Lexi state logic patched.");
