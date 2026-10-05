const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

js = js.replace(/document\.getElementById\('mob-shuffle-btn'\)\?\.addEventListener\('click', \(\) => { toggleShuffle\(\); mobileOverlay\.classList\.add\('hidden'\); }\);/, "bindEvent(document.getElementById('mob-shuffle-btn'), () => { toggleShuffle(); mobileOverlay.classList.add('hidden'); });");
js = js.replace(/document\.getElementById\('mob-mixer-btn'\)\?\.addEventListener\('click', \(\) => { toggleMixer\(\); mobileOverlay\.classList\.add\('hidden'\); }\);/, "bindEvent(document.getElementById('mob-mixer-btn'), () => { toggleMixer(); mobileOverlay.classList.add('hidden'); });");
js = js.replace(/document\.getElementById\('mob-repeat-btn'\)\?\.addEventListener\('click', \(\) => { toggleRepeat\(\); mobileOverlay\.classList\.add\('hidden'\); }\);/, "bindEvent(document.getElementById('mob-repeat-btn'), () => { toggleRepeat(); mobileOverlay.classList.add('hidden'); });");
js = js.replace(/document\.getElementById\('mob-lyrics-btn'\)\?\.addEventListener\('click', \(\) => { toggleLyrics\(\); mobileOverlay\.classList\.add\('hidden'\); }\);/, "bindEvent(document.getElementById('mob-lyrics-btn'), () => { toggleLyrics(); mobileOverlay.classList.add('hidden'); });");
js = js.replace(/document\.getElementById\('mob-queue-btn'\)\?\.addEventListener\('click', \(\) => { toggleQueue\(\); mobileOverlay\.classList\.add\('hidden'\); }\);/, "bindEvent(document.getElementById('mob-queue-btn'), () => { toggleQueue(); mobileOverlay.classList.add('hidden'); });");

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched js/medixly.js further");
