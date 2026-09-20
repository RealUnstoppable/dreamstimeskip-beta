const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Update image
js = js.replace(/id: 'deorc-decuple',[\s\S]*?art: "\/images\/Unstoppable Collection Logo.png",/, 
`id: 'deorc-decuple',
            title: "Deorc Decuple", 
            artist: "FormantX", 
            duration: "3:45", 
            src: "/music/ES_Deorc Decuple - FormantX.mp3", 
            art: "/images/deorc_cover.jpg",`);

// Update color
js = js.replace(/'deorc-decuple': '#8a196e',    \/\/ Dim Pink/, "'deorc-decuple': '#1d3036',    // Dark Teal Grey");

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched Deorc Decuple image and color");
