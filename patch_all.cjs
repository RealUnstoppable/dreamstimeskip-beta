const fs = require('fs');

// 1. HTML
let html = fs.readFileSync('harmonytunes.html', 'utf8');

// Remove lyrics header
html = html.replace(/<div class="lyrics-header">[\s\S]*?<\/div>/, '');

// Reorganize fullscreen controls
html = html.replace(/<div class="fs-player-options">([\s\S]*?)<\/div>\s*<!-- Middle Row: Controls -->\s*<div class="fullscreen-controls">([\s\S]*?)<\/div>/, (match, options, controls) => {
    // Extract buttons from options
    const lyricsBtn = options.match(/<button[^>]*id="fs-lyrics-btn"[^>]*>[\s\S]*?<\/button>/)[0];
    const viralBtn = options.match(/<button[^>]*id="fs-viral-skip-btn"[^>]*>[\s\S]*?<\/button>/)[0];
    const likeBtn = options.match(/<button[^>]*id="fs-like-btn"[^>]*>.*?<\/button>/)[0];
    
    const mixerBtn = options.match(/<button[^>]*id="fs-mixer-btn"[^>]*>[\s\S]*?<\/button>/)[0];
    const shuffleBtn = options.match(/<button[^>]*id="fs-shuffle-btn"[^>]*>[\s\S]*?<\/button>/)[0];
    const repeatBtn = options.match(/<button[^>]*id="fs-repeat-btn"[^>]*>[\s\S]*?<\/button>/)[0];
    
    const newOptions = `
                <div class="fs-player-options">
                    ${lyricsBtn}
                    ${viralBtn}
                    ${likeBtn}
                </div>`;
                
    const newControls = `
                <div class="fullscreen-controls" style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;">
                    ${shuffleBtn}
                    ${mixerBtn}
                    ${controls.trim()}
                    ${repeatBtn}
                </div>`;
                
    return newOptions + '\n\n                <!-- Middle Row: Controls -->\n' + newControls;
});

// Cache buster
html = html.replace(/js\/harmonytunes\.js\?v=\d+/, `js/harmonytunes.js?v=${Date.now()}`);
fs.writeFileSync('harmonytunes.html', html);


// 2. JS
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Lyrics background
js = js.replace(/fsTitle\.textContent = song\.title;/, `fsTitle.textContent = song.title;
            const viewLyrics = document.getElementById('view-lyrics');
            if (viewLyrics) {
                viewLyrics.style.backgroundImage = \`linear-gradient(to bottom, color-mix(in srgb, var(--theme-color) 70%, black) 0%, color-mix(in srgb, var(--theme-color) 90%, black) 100%), url(\${song.art})\`;
                viewLyrics.style.backgroundSize = 'cover';
                viewLyrics.style.backgroundPosition = 'center';
            }`);

// Paint spill random flashes
js = js.replace(/effects\.forEach\(effect => \{[\s\S]*?effect\.classList\.add\('beat'\);\s*\}\);/, `effects.forEach(effect => {
                            const rx = Math.floor(Math.random() * 80) + 10;
                            const ry = Math.floor(Math.random() * 80) + 10;
                            effect.style.background = \`radial-gradient(circle at \${rx}% \${ry}%, color-mix(in srgb, var(--theme-color, #1a2b4c) 90%, transparent) 0%, transparent 60%), radial-gradient(circle at \${100-rx}% \${100-ry}%, color-mix(in srgb, var(--theme-color, #1a2b4c) 90%, transparent) 0%, transparent 60%)\`;
                            
                            effect.classList.remove('beat');
                            void effect.offsetWidth; // trigger reflow
                            effect.classList.add('beat');
                        });`);

fs.writeFileSync('js/harmonytunes.js', js);


// 3. CSS
let css = fs.readFileSync('css/harmonytunes.css', 'utf8');

// Allow paintBeat to have randomized scale from CSS without hardcoding
css = css.replace(/@keyframes paintBeat \{[\s\S]*?\}/,
`@keyframes paintBeat {
    0% {
        transform: scale(1) rotate(0deg);
        filter: blur(20px) contrast(1.5) brightness(1);
        opacity: 0.6;
    }
    20% {
        transform: scale(1.2) rotate(2deg);
        filter: blur(10px) contrast(3) brightness(3);
        opacity: 1;
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: blur(20px) contrast(1.5) brightness(1);
        opacity: 0.6;
    }
}`);

fs.writeFileSync('css/harmonytunes.css', css);

console.log("Patched fullscreen UI, paint spill JS, and lyrics bg.");
