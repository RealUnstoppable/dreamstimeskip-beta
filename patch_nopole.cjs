const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Update image
js = js.replace(/id: 'no-pole-remix',[\s\S]*?art: "\/images\/MugAllBrands300x300.png",/, 
`id: 'no-pole-remix',
            title: "No Pole x Where Have You Been", 
            artist: "Remix", 
            duration: "2:30", 
            src: "/music/No Pole x Where Have You Been (Remix).mp3", 
            art: "/images/nopole_cover.jpg",`);

// Update color
js = js.replace(/'no-pole-remix': '#2e8a19',    \/\/ Dim Green/, "'no-pole-remix': '#a11f8b',    // Neon Magenta");

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched No Pole image and color");
