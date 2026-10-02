const fs = require('fs');
let css = fs.readFileSync('css/harmonytunes.css', 'utf8');

css = css.replace(/background:\s*radial-gradient.*?;\n/s,
    `background: radial-gradient(circle at -10% 50%, color-mix(in srgb, var(--theme-color, #1a2b4c) 80%, transparent) 0%, transparent 50%),
                radial-gradient(circle at 110% 50%, color-mix(in srgb, var(--theme-color, #1a2b4c) 80%, transparent) 0%, transparent 50%);\n`);

css = css.replace(/@keyframes paintBeat \{[\s\S]*?\}/,
`@keyframes paintBeat {
    0% {
        transform: scale(1);
        filter: blur(20px) contrast(1.5) brightness(1);
        opacity: 0.6;
    }
    30% {
        transform: scale(1.15);
        filter: blur(10px) contrast(2.5) brightness(2.5);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        filter: blur(20px) contrast(1.5) brightness(1);
        opacity: 0.6;
    }
}`);

fs.writeFileSync('css/harmonytunes.css', css);
console.log("Patched css");
