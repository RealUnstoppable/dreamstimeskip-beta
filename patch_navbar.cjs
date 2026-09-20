const fs = require('fs');
let js = fs.readFileSync('js/navbar.js', 'utf8');

js = js.replace(/import \{ auth, db, getCachedUserProfile \} from '\.\/auth\.js\?v=\d+';/,
    `import { auth, db } from './auth.js?v=1784516229';\nimport { getCachedUserProfile } from './utils.js';`);

fs.writeFileSync('js/navbar.js', js);
console.log("Patched navbar imports");
