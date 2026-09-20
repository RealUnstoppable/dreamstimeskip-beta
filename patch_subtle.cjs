const fs = require('fs');

// 1. JS
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Lyrics background
js = js.replace(/linear-gradient\(to bottom, color-mix\(in srgb, var\(--theme-color\) 70%, transparent\) 0%, color-mix\(in srgb, var\(--theme-color\) 90%, transparent\) 100%\)/, 
`linear-gradient(to bottom, color-mix(in srgb, var(--theme-color) 30%, transparent) 0%, color-mix(in srgb, var(--theme-color) 40%, transparent) 100%)`);

// Paint spill flashes
js = js.replace(/color-mix\(in srgb, var\(--theme-color, #1a2b4c\) 90%, transparent\) 0%, transparent 60%/g, 
`color-mix(in srgb, var(--theme-color, #1a2b4c) 40%, transparent) 0%, transparent 50%`);

fs.writeFileSync('js/harmonytunes.js', js);


// 2. CSS
let css = fs.readFileSync('css/harmonytunes.css', 'utf8');

// Allow paintBeat to have more subtle scale, contrast, and brightness
css = css.replace(/@keyframes paintBeat \{[\s\S]*?\}/,
`@keyframes paintBeat {
    0% {
        transform: scale(1) rotate(0deg);
        filter: blur(20px) contrast(1.1) brightness(1);
        opacity: 0.3;
    }
    20% {
        transform: scale(1.05) rotate(1deg);
        filter: blur(15px) contrast(1.3) brightness(1.2);
        opacity: 0.6;
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: blur(20px) contrast(1.1) brightness(1);
        opacity: 0.3;
    }
}`);

fs.writeFileSync('css/harmonytunes.css', css);

console.log("Patched to be more subtle.");
