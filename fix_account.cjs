const fs = require('fs');
let code = fs.readFileSync('js/account.js', 'utf8');

code = code.replace(/\\\$/g, '$').replace(/\\`/g, '`');

fs.writeFileSync('js/account.js', code, 'utf8');
