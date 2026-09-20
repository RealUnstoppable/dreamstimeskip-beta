const fs = require('fs');
let html = fs.readFileSync('harmonytunes.html', 'utf8');

// Remove original paint-spill
html = html.replace(/<div id="paint-spill-effect" class="paint-spill-effect hidden"><\/div>\n?/g, '');

// Insert into view-lyrics (line 113 approx)
html = html.replace(/(<div id="view-lyrics" class="view-lyrics".*?>)/, '$1\n        <div class="paint-spill-effect hidden"></div>');

// Insert into fullscreen-player
html = html.replace(/(<div id="fullscreen-player" class="fullscreen-player".*?>)/, '$1\n        <div class="paint-spill-effect hidden"></div>');

fs.writeFileSync('harmonytunes.html', html);
console.log("Patched harmonytunes.html");
