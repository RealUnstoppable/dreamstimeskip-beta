const fs = require('fs');
let html = fs.readFileSync('medixly.html', 'utf8');

// Insert Create Playlist button
const sectionMatch = /<h2>Playlists<\/h2>/;
html = html.replace(sectionMatch, '<div style="display:flex;justify-content:space-between;align-items:center;"><h2>Playlists</h2><button id="create-playlist-btn" class="action-btn-secondary" style="margin-right:20px;padding:6px 12px;font-size:0.8rem;">+ Create Playlist</button></div>');

// Insert Delete Playlist button into playlist view
const plControlsMatch = /<button id="share-playlist-btn" class="action-btn-secondary">Share<\/button>/;
html = html.replace(plControlsMatch, '<button id="share-playlist-btn" class="action-btn-secondary">Share</button>\n                            <button id="delete-playlist-btn" class="action-btn-secondary" style="color:var(--accent-red);border-color:var(--accent-red);display:none;">Delete</button>');

// Insert "Add to Playlist" to context menus
html = html.replace(/<button class="context-menu-item" id="ctx-share">Share Song<\/button>/, '<button class="context-menu-item" id="ctx-share">Share Song</button>\n        <button class="context-menu-item" id="ctx-add-playlist">Add to Playlist</button>');

// We also need a small modal to select which playlist to add to
const modalHtml = `
    <!-- Playlist Selection Modal -->
    <div id="playlist-select-modal" class="modal-overlay hidden" style="z-index: 4000;">
        <div class="modal-content" style="max-width: 300px;">
            <h2 class="modal-title" style="font-size: 1.2rem; margin-bottom: 15px;">Add to Playlist</h2>
            <div id="playlist-select-list" style="display:flex;flex-direction:column;gap:10px;max-height:300px;overflow-y:auto;margin-bottom:15px;">
                <!-- Dynamically populated -->
            </div>
            <div style="display:flex;gap:10px;">
                <input type="text" id="new-playlist-input" placeholder="New Playlist Name" style="flex:1;background:var(--secondary-bg);color:#fff;border:1px solid var(--border-color);border-radius:4px;padding:5px;">
                <button id="create-and-add-btn" class="action-btn-primary" style="padding:5px 10px;">Create</button>
            </div>
            <button id="close-playlist-modal-btn" class="modal-close-btn" style="margin-top:15px;width:100%;">Close</button>
        </div>
    </div>
`;
html = html.replace('</body>', modalHtml + '\n</body>');

fs.writeFileSync('medixly.html', html, 'utf8');
console.log("Patched medixly.html for custom playlists");
