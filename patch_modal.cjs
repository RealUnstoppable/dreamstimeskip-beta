const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

const modalLogic = `
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', async () => {
            if (!currentUser) return alert("Please sign in to create playlists.");
            const title = prompt("Enter a name for your new playlist:");
            if (!title) return;
            const newPl = { id: 'custom_' + Date.now() + Math.random().toString(36).substr(2,5), title, songs: [] };
            customPlaylists.push(newPl);
            await saveCustomPlaylists();
            renderHomePlaylists();
        });
    }

    const playlistSelectModal = document.getElementById('playlist-select-modal');
    const playlistSelectList = document.getElementById('playlist-select-list');
    const createAndAddBtn = document.getElementById('create-and-add-btn');
    const newPlaylistInput = document.getElementById('new-playlist-input');
    const closePlaylistModalBtn = document.getElementById('close-playlist-modal-btn');
    
    let targetSongIdForPlaylist = null;

    function openAddToPlaylistModal(songId) {
        if (!currentUser) return alert("Please sign in to manage playlists.");
        targetSongIdForPlaylist = songId;
        
        playlistSelectList.innerHTML = customPlaylists.map(pl => \`
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.05);padding:10px;border-radius:4px;">
                <span>\${escapeHTML(pl.title)}</span>
                <button class="action-btn-secondary add-to-existing-pl-btn" data-id="\${escapeHTML(pl.id)}" style="padding:4px 8px;font-size:0.8rem;">Add</button>
            </div>
        \`).join('') + (customPlaylists.length === 0 ? '<p style="color:#888;font-size:0.9rem;">No custom playlists yet.</p>' : '');
        
        playlistSelectList.querySelectorAll('.add-to-existing-pl-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const plId = e.target.getAttribute('data-id');
                const pl = customPlaylists.find(p => p.id === plId);
                if (pl && !pl.songs.includes(targetSongIdForPlaylist)) {
                    pl.songs.push(targetSongIdForPlaylist);
                    await saveCustomPlaylists();
                    alert('Added to ' + pl.title);
                } else if (pl) {
                    alert('Song already in playlist.');
                }
                playlistSelectModal.classList.add('hidden');
            });
        });
        
        playlistSelectModal.classList.remove('hidden');
    }

    if (closePlaylistModalBtn) {
        closePlaylistModalBtn.addEventListener('click', () => {
            playlistSelectModal.classList.add('hidden');
        });
    }

    if (createAndAddBtn) {
        createAndAddBtn.addEventListener('click', async () => {
            const title = newPlaylistInput.value.trim();
            if (!title) return;
            const newPl = { id: 'custom_' + Date.now(), title, songs: [targetSongIdForPlaylist] };
            customPlaylists.push(newPl);
            await saveCustomPlaylists();
            newPlaylistInput.value = '';
            playlistSelectModal.classList.add('hidden');
            renderHomePlaylists();
            alert('Created ' + title + ' and added song.');
        });
    }

    document.getElementById('ctx-add-playlist')?.addEventListener('click', () => {
        if(contextMenuTargetSongId) openAddToPlaylistModal(contextMenuTargetSongId);
        if(contextMenu) contextMenu.classList.add('hidden');
    });

    document.getElementById('qctx-add-playlist')?.addEventListener('click', () => {
        if(qctxTargetId) openAddToPlaylistModal(qctxTargetId);
        if(queueContextMenu) queueContextMenu.classList.add('hidden');
    });
`;

js = js.replace(/function setupNavigation\(\) \{/, modalLogic + '\n    function setupNavigation() {');

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched modal logic");
