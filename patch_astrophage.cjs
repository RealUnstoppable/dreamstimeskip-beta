const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Update image
js = js.replace(/id: 'astrophage',[\s\S]*?art: "\/images\/harmony-tunes-card.jpg",/, 
`id: 'astrophage',
            title: "Astrophage",
            artist: "Lupus Nocte",
            duration: "3:10",
            src: "/music/Astrophage.mp3",
            art: "/images/astrophage_cover.jpg",`);

// Add color
js = js.replace(/const songColors = \{[\s\S]*?\};/, (match) => {
    return match.replace("};", "    'astrophage': '#2a0c3b' // Synthwave Dark Purple\n    };");
});

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched Astrophage image and color");
