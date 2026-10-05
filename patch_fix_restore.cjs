const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

js = js.replace(/if \(savedRaw\) \{/, 'if (savedRaw && !restored) {');

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched restore condition");
