const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

js = js.replace(/if \(savedRaw\) \{/, 'if (savedRaw && !restored) {');

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched restore condition");
