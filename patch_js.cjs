const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

js = js.replace(/playPauseBtn\.addEventListener\('click', togglePlayPause\);/, 'bindEvent(playPauseBtn, togglePlayPause);');
js = js.replace(/nextBtn\.addEventListener\('click', nextSong\);/, 'bindEvent(nextBtn, nextSong);');
js = js.replace(/prevBtn\.addEventListener\('click', prevSong\);/, 'bindEvent(prevBtn, prevSong);');

js = js.replace(/mobileOverflowBtn\.addEventListener\('click', \(e\) => {[\s\S]*?toggleOverlay\(e\);\s*}\);/, 'bindEvent(mobileOverflowBtn, () => { mobileOverlay.classList.toggle("hidden"); });');

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched js/harmonytunes.js");
