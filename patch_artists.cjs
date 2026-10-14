const fs = require('fs');

let code = fs.readFileSync('js/medixly-artists.js', 'utf8');

// Update createLyricLine
code = code.replace(
    /div\.innerHTML = `[\s\S]*?`;/,
    `div.innerHTML = \`
        <input type="number" step="0.1" class="lyric-time search-style-input" placeholder="0.0" value="\${time}">
        <input type="text" class="lyric-text search-style-input" placeholder="Lyric text" value="\${text}">
        <button class="sync-btn" title="Sync to Audio">Sync</button>
        <button class="remove-btn" title="Remove Line">&times;</button>
    \`;`
);

// Update "Process & Publish to Library" text replacements
code = code.replace(/"Process & Publish to Library"/g, '"Process & Publish"');

fs.writeFileSync('js/medixly-artists.js', code);
