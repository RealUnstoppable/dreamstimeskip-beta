const fs = require('fs');

function replaceColors(file) {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');

    // Replace explicit accent-blue and accent-green with accent-color
    css = css.replace(/var\(--accent-blue\)/g, 'var(--accent-color, #2563EB)');
    css = css.replace(/var\(--accent-green\)/g, 'var(--accent-color, #16A34A)');

    // Replace rigid backgrounds
    // Only replace some very specific ones to be non-destructive
    css = css.replace(/background-color: #0A0A0A;/g, 'background-color: var(--bg-color, #0A0A0A);');
    css = css.replace(/background: #0A0A0A;/g, 'background: var(--bg-color, #0A0A0A);');

    css = css.replace(/background-color: #1a1a1a;/ig, 'background-color: var(--primary-card-color, #1a1a1a);');
    css = css.replace(/background: #1a1a1a;/ig, 'background: var(--primary-card-color, #1a1a1a);');
    css = css.replace(/background-color: #121212;/ig, 'background-color: var(--secondary-card-color, #121212);');
    css = css.replace(/background: #121212;/ig, 'background: var(--secondary-card-color, #121212);');
    css = css.replace(/background-color: #000;/g, 'background-color: var(--bg-color, #000);');

    fs.writeFileSync(file, css, 'utf8');
    console.log("Patched", file);
}

replaceColors('css/shop.css');
replaceColors('css/harmonytunes.css');
replaceColors('css/style.css');
replaceColors('css/account.css');
