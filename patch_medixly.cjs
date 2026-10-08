const fs = require('fs');
const file = 'js/medixly.js';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                nextAudio.addEventListener('loadedmetadata', () => {
                    // Use the audio engine's offline block analyzer to find exact non-silent onset
                    mixEngine.trimSilence(nextAudio).then(({ startOffset }) => {
                        const inmixPoint = songMetadata?.inmixPoint || startOffset || 15;
                        nextAudio.currentTime = inmixPoint;
                    });
                }, { once: true });`;

const replacement = `                nextAudio.addEventListener('loadedmetadata', () => {
                    if (songMetadata && typeof songMetadata.inmixPoint === 'number') {
                        nextAudio.currentTime = songMetadata.inmixPoint;
                    } else {
                        // Fallback if no backend-computed inmixPoint exists
                        mixEngine.trimSilence(nextAudio).then(({ startOffset }) => {
                            nextAudio.currentTime = typeof startOffset === 'number' ? startOffset : 15;
                        });
                    }
                }, { once: true });`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync(file, content);
    console.log("Patched medixly.js");
} else {
    console.log("Could not find the target string in medixly.js");
}
