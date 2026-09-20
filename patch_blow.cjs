const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Update image
js = js.replace(/id: 'kesha-blow',[\s\S]*?art: "\/images\/un-logo.png",/, 
`id: 'kesha-blow',
            title: "Blow", 
            artist: "Kesha", 
            duration: "3:40", 
            src: "/music/Blow - Kesha.mp3", 
            art: "/images/blow_cover.jpg",`);

// Update color
js = js.replace(/const songColors = \{[\s\S]*?\};/, (match) => {
    return match.replace("};", "    'kesha-blow': '#e63995' // Neon Pink\n    };");
});

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched Blow image and color");
