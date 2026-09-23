const fs = require('fs');
let code = fs.readFileSync('js/harmonytunes.js', 'utf8');

const targetMixerToggle = `        const toggleMixer = () => {
            isMixerMode = !isMixerMode;
            if(currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                setDoc(userRef, { mixerToggled: isMixerMode }, { merge: true }).catch(e => console.error("Manager info:", e));
            }
            mixerBtn.classList.toggle('active', isMixerMode);
            if(fsMixerBtn) fsMixerBtn.classList.toggle('active', isMixerMode);
            const mobMixerBtn = document.getElementById('mob-mixer-btn');
            if(mobMixerBtn) mobMixerBtn.classList.toggle('active', isMixerMode);
        };`;

const replaceMixerToggle = `        const toggleMixer = () => {
            isMixerMode = !isMixerMode;
            if(currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                setDoc(userRef, { mixerToggled: isMixerMode }, { merge: true }).catch(e => console.error("Manager info:", e));
            }
            mixerBtn.classList.toggle('active', isMixerMode);
            if(fsMixerBtn) fsMixerBtn.classList.toggle('active', isMixerMode);
            const mobMixerBtn = document.getElementById('mob-mixer-btn');
            if(mobMixerBtn) mobMixerBtn.classList.toggle('active', isMixerMode);
            
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
            });
        };
        
        window.toggleMixerMode = toggleMixer;`;

code = code.replace(targetMixerToggle, replaceMixerToggle);

fs.writeFileSync('js/harmonytunes.js', code, 'utf8');
console.log("HarmonyTunes Lexi mixxer state logic patched.");
