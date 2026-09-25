const fs = require('fs');
let code = fs.readFileSync('js/ads.js', 'utf8');
code = code.replace("import { auth, db } from './firebase-config.js';", "import { auth, db } from './firebase.js';");
fs.writeFileSync('js/ads.js', code, 'utf8');
