const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

const oldLogic = `                const elapsed = Math.max(0, (Date.now() - (saved.timestamp || Date.now())) / 1000);
                if (saved.isPlaying && elapsed < 20) {
                    const targetTime = (saved.currentTime || 0) + elapsed;
                    activeAudio.addEventListener('loadedmetadata', () => {
                        activeAudio.currentTime = targetTime;
                        playSong();
                    }, { once: true });
                    if (activeAudio.readyState >= 1) {
                        activeAudio.currentTime = targetTime;
                        playSong();
                    }
                } else if (saved.currentTime) {
                    activeAudio.currentTime = saved.currentTime;
                }`;

const newLogic = `                const elapsed = Math.max(0, (Date.now() - (saved.timestamp || Date.now())) / 1000);
                const isRecent = elapsed < 20;
                
                const targetTime = (saved.currentTime || 0) + (saved.isPlaying && isRecent ? elapsed : 0);
                
                const restorePositionAndState = () => {
                    activeAudio.currentTime = targetTime;
                    if (saved.isPlaying && isRecent) {
                        playSong();
                    }
                };

                if (activeAudio.readyState >= 1) {
                    restorePositionAndState();
                } else {
                    activeAudio.addEventListener('loadedmetadata', restorePositionAndState, { once: true });
                }`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched init logic");
