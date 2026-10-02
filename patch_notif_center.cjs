const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');

css = css.replace(/align-items: flex-start;/g, 'align-items: center;');
fs.writeFileSync('css/style.css', css, 'utf8');
console.log("Patched flex-start to center");
