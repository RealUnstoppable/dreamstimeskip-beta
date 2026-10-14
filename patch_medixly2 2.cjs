const fs = require('fs');
const file = 'js/medixly.js';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                nextAudio.addEventListener('loadedmetadata', () => {
                    if (songMetadata && typeof songMetadata.inmixPoint === 'number') {
                        nextAudio.currentTime = songMetadata.inmixPoint;
                    } else {
                        // Fallback if no backend-computed inmixPoint exists
                        mixEngine.trimSilence(nextAudio).then(({ startOffset }) => {
                            nextAudio.currentTime = typeof startOffset === 'number' ? startOffset : 15;
                        });
                    }
                }, { once: true });`;

const replacement = `                nextAudio.addEventListener('loadedmetadata', () => {
                    if (songMetadata && typeof songMetadata.inmixPoint === 'number') {
                        nextAudio.currentTime = songMetadata.inmixPoint;
                    } else {
                        // Removed frontend processing (trimSilence) to prevent the 5-second pause during crossfade
                        nextAudio.currentTime = 0; // Default to 0 instead of pausing the UI to compute
                    }
                }, { once: true });`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync(file, content);
    console.log("Patched medixly.js (removed trimSilence fallback)");
} else {
    console.log("Could not find the target string in medixly.js (2)");
}
