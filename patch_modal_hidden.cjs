const fs = require('fs');
let css = fs.readFileSync('css/harmonytunes.css', 'utf8');

if (!css.includes('.modal-overlay.hidden { display: none !important; }')) {
    css += '\n.modal-overlay.hidden { display: none !important; }\n';
    fs.writeFileSync('css/harmonytunes.css', css, 'utf8');
    console.log("Patched modal hidden class");
}
