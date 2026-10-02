const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

js = js.replace(/mobViralBtn\.addEventListener\('click', \(e\) => {[\s\S]*?handleViralClick\(e\);[\s\S]*?}\);/, "bindEvent(mobViralBtn, () => { handleViralClick({preventDefault:()=>{}, stopPropagation:()=>{}}); });");

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched mobViralBtn");
