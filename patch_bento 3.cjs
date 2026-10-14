const fs = require('fs');

const files = ['css/style.css', 'css/style 2.css'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let css = fs.readFileSync(file, 'utf8');

    // Add overflow: hidden to .bento-card if not present
    if (!css.includes('overflow: hidden') && css.includes('.bento-card {')) {
        css = css.replace(/.bento-card\s*\{([\s\S]*?)\}/, (match, inner) => {
            if (!inner.includes('overflow:')) {
                return `.bento-card {${inner}    overflow: hidden;\n}`;
            }
            return match;
        });
    }

    // Add max-width/height to .bento-card img
    css = css.replace(/.bento-card img\s*\{([\s\S]*?)\}/, (match, inner) => {
        let newInner = inner;
        if (!newInner.includes('max-height:')) {
            newInner = newInner.replace('height: auto;', 'height: auto;\n    max-height: 80%;\n    max-width: 300px;');
        }
        return `.bento-card img {${newInner}}`;
    });

    fs.writeFileSync(file, css, 'utf8');
}

console.log("Patched bento CSS.");
