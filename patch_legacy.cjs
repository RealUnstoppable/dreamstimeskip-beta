const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Update image
js = js.replace(/id: 'pixy-legacy',[\s\S]*?art: "\/images\/dreams-lobby.jpg",/, 
`id: 'pixy-legacy',
            title: "PIXY - LEGACY", 
            artist: "Catalin", 
            duration: "2:17", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/legacy_cover.jpg",`);

// Update color
js = js.replace(/'pixy-legacy': '#19548a',      \/\/ Dim Blue/, "'pixy-legacy': '#5c4a3d',      // Warm Brown");

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched Legacy image and color");
