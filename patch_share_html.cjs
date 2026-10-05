const fs = require('fs');
let html = fs.readFileSync('medixly.html', 'utf8');

// Insert ctx-share into song-context-menu
if (!html.includes('id="ctx-share"')) {
    html = html.replace(
        /<button class="context-menu-item" id="ctx-view-artist">View Artist<\/button>/,
        '<button class="context-menu-item" id="ctx-view-artist">View Artist</button>\n        <button class="context-menu-item" id="ctx-share">Share Song</button>'
    );
    fs.writeFileSync('medixly.html', html, 'utf8');
    console.log("Patched medixly.html context menu");
}
