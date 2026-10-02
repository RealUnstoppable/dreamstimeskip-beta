const fs = require('fs');
let code = fs.readFileSync('js/lexi-physics.js', 'utf8');

const targetEntry = `    // Setup Entry Animation
    const bottomBar = document.querySelector('.bottom-bar');
    if (bottomBar) {
        const glow = document.createElement('div');
        glow.className = 'player-glow-overlay';
        bottomBar.appendChild(glow);
        setTimeout(() => glow.classList.add('animate'), 500); // Animate in shortly after load
    }`;

const replaceEntry = `    // Setup Entry Animation
    const bottomBar = document.querySelector('.bottom-bar');
    const mixerBtn = document.getElementById('mixer-btn');
    if (bottomBar && mixerBtn) {
        const glow = document.createElement('div');
        glow.className = 'player-glow-overlay';
        bottomBar.appendChild(glow);
        
        const blob = mixerBtn.querySelector('.lexi-mixxer-blob');
        if (blob) {
            // Fake entry animation: start from bottom right and fly in!
            // First, find the target position relative to the viewport
            const rect = blob.getBoundingClientRect();
            const startX = window.innerWidth - 80 - rect.left;
            const startY = window.innerHeight - 80 - rect.top;
            
            // Set initial state
            blob.style.transition = 'none';
            blob.style.transform = \`translate(\${startX}px, \${startY}px) scale(3)\`;
            
            // Trigger animation
            setTimeout(() => {
                blob.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Bouncy spring
                blob.style.transform = 'translate(0px, 0px) scale(1)';
                
                // Trigger glow right as it lands
                setTimeout(() => {
                    glow.classList.add('animate');
                }, 600);
            }, 100);
        }
    }`;

code = code.replace(targetEntry, replaceEntry);

fs.writeFileSync('js/lexi-physics.js', code, 'utf8');
console.log("Lexi entry animation patched.");
