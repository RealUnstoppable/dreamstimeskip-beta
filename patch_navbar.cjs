const fs = require('fs');
let code = fs.readFileSync('js/navbar.js', 'utf8');

if (!code.includes("import './ads.js'")) {
    code = code.replace("import './sitewide-player.js?v=20260924';", "import './sitewide-player.js?v=20260924';\nimport './ads.js';");
    fs.writeFileSync('js/navbar.js', code, 'utf8');
}
