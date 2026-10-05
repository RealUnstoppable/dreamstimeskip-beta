const fs = require('fs');
let css = fs.readFileSync('css/medixly.css', 'utf8');

css = css.replace(/--card-bg: #121212;/g, '--card-bg: var(--primary-card-color, #121212);');
css = css.replace(/--card-bg-hover: #1f1f1f;/g, '--card-bg-hover: var(--secondary-card-color, #1f1f1f);');

fs.writeFileSync('css/medixly.css', css, 'utf8');
console.log("Patched card-bg");
