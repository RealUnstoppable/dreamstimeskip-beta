const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

const oldLogic = `            // Load the same song into the new active audio
            activeAudio.src = song.src;
            activeAudio.currentTime = block.paddedStart;
            
            activeAudio.volume = 0;
            activeAudio.play().catch(e => console.error("Manager info:", e));`;

const newLogic = `            // Load the same song into the new active audio
            activeAudio.src = song.src;
            
            activeAudio.addEventListener('loadedmetadata', () => {
                activeAudio.currentTime = block.paddedStart;
                activeAudio.volume = 0;
                activeAudio.play().catch(e => console.error("Manager info:", e));
            }, { once: true });`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched mixxer");
