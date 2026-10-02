const fs = require('fs');

let js = fs.readFileSync('js/theme-loader.js', 'utf8');

js = js.replace('if (localTheme) document.body.dataset.theme = localTheme;',
    `if (localTheme) {
        let t = localTheme;
        if (t === 'dark') t = 'black';
        if (t === 'light') t = 'white';
        document.body.dataset.theme = t;
    }`);

js = js.replace('document.body.dataset.theme = theme || \'black\';',
    `let t = theme || 'black';
    if (t === 'dark') t = 'black';
    if (t === 'light') t = 'white';
    document.body.dataset.theme = t;`);

fs.writeFileSync('js/theme-loader.js', js, 'utf8');
