const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');
js = js.replace(/(id:\s*'tate-mcrae-its-okay-im-okay'[\s\S]*?outmixPoint:\s*)24/, '$129');
fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched outmixPoint to 29 for tate-mcrae");
