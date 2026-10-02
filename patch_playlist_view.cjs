const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Patch loadPlaylistView
const oldViewLogic = `            if (type === 'favorites') {
                playlistTitleEl.textContent = "Liked Songs";`;
const newViewLogic = `            const delBtn = document.getElementById('delete-playlist-btn');
            if (delBtn) delBtn.style.display = 'none';

            if (type === 'favorites') {
                playlistTitleEl.textContent = "Liked Songs";`;
js = js.replace(oldViewLogic, newViewLogic);

const oldViewFallback = `            } else {
                playlistTitleEl.textContent = "All Available Tracks";`;
const newViewFallback = `            } else if (type.startsWith('custom_')) {
                const pl = customPlaylists.find(p => p.id === type);
                if (pl) {
                    playlistTitleEl.textContent = pl.title;
                    playlistDescEl.textContent = \`\${pl.songs.length} songs\`;
                    const mappedSongs = pl.songs.map(id => librarySongsMap.get(id)).filter(Boolean);
                    renderSongTable(mappedSongs);
                    playlistPlayBtn.onclick = () => {
                        if (mappedSongs.length > 0) playContext(mappedSongs, 0);
                    };
                    const delBtn = document.getElementById('delete-playlist-btn');
                    if (delBtn) {
                        delBtn.style.display = 'inline-block';
                        delBtn.onclick = async () => {
                            if (confirm("Delete this playlist?")) {
                                customPlaylists = customPlaylists.filter(p => p.id !== type);
                                await saveCustomPlaylists();
                                renderHomePlaylists();
                                showHome();
                            }
                        };
                    }
                }
            } else {
                playlistTitleEl.textContent = "All Available Tracks";`;
js = js.replace(oldViewFallback, newViewFallback);

// Patch Auth
js = js.replace(/userFavoritesIds = new Set\(userFavorites\.map\(s => s\.id\)\);\n\s*if \(viewPlaylist\.style\.display !== 'none' && playlistTitleEl\.textContent === "Liked Songs"\) \{/, `userFavoritesIds = new Set(userFavorites.map(s => s.id));
                loadCustomPlaylists();
                if (viewPlaylist.style.display !== 'none' && playlistTitleEl.textContent === "Liked Songs") {`);

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched playlist view logic");
