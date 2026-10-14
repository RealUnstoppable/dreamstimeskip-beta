const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

const oldLogic = `            activeAudio.src = song.src;
            const inmixPoint = songMetadata?.inmixPoint || 15;
            activeAudio.currentTime = inmixPoint;`;

const newLogic = `            activeAudio.src = song.src;
            const inmixPoint = songMetadata?.inmixPoint || 15;
            activeAudio.addEventListener('loadedmetadata', () => {
                activeAudio.currentTime = inmixPoint;
            }, { once: true });`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched playContext");
