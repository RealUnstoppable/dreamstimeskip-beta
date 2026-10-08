const fs = require('fs');
const file = 'functions/index.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const { onRequest } = require("firebase-functions/v2/https");')) {
    content = 'const { onRequest } = require("firebase-functions/v2/https");\n' + content;
}
content = content.replace(/functions\.https\.onRequest/g, 'onRequest');

fs.writeFileSync(file, content);
console.log("Upgraded onRequest to v2");
