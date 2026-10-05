const fs = require('fs');
let css = fs.readFileSync('css/medixly.css', 'utf8');

if (!css.includes('.modal-overlay.hidden { display: none !important; }')) {
    css += '\n.modal-overlay.hidden { display: none !important; }\n';
    fs.writeFileSync('css/medixly.css', css, 'utf8');
    console.log("Patched modal hidden class");
}
