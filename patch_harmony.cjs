const fs = require('fs');
let code = fs.readFileSync('js/sitewide-player.js', 'utf8');

// Replace creation logic to skip if isHarmonyPage
const search = `        if (!orbWrapper || !orb) {
            // Create sitewide Lexi Orb
            orbWrapper = document.createElement('div');`;
            
const replace = `        if (!orbWrapper || !orb) {
            if (isHarmonyPage) return; // Skip injecting sitewide orb on HarmonyTunes to prevent duplicated animation
            // Create sitewide Lexi Orb
            orbWrapper = document.createElement('div');`;

code = code.replace(search, replace);

fs.writeFileSync('js/sitewide-player.js', code, 'utf8');
