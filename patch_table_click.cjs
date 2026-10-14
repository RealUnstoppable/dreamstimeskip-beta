const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

const tableClickOld = `            row.dataset.songId = song.id;
            
            row.addEventListener('click', (e) => {
                if (e.target.closest('.card-more-btn')) return; // ignore if clicking more btn
                playContext(songs, index);
            });`;

const tableClickNew = `            row.dataset.songId = song.id;
            
            row.addEventListener('click', (e) => {
                if (e.target.closest('.card-more-btn')) return; // ignore if clicking more btn
                if (e.target.closest('.version-select')) return; // ignore select click
                
                // Construct the queue from the current visible table state (including selected versions)
                const queueRows = Array.from(songListBody.querySelectorAll('tr'));
                // If songListBody isn't populated yet, map over groupedSongs
                const dynamicQueue = queueRows.length > 0 
                    ? queueRows.map(r => librarySongsMap.get(r.dataset.songId)).filter(Boolean)
                    : groupedSongs.map(g => librarySongsMap.get(row.dataset.songId || g.baseSong.id)).filter(Boolean);
                
                playContext(dynamicQueue, index);
            });`;

js = js.replace(tableClickOld, tableClickNew);

// Also need to patch runSpotlightSearch click event, it uses a predefined `activateFn`
const spotlightClickOld = `            const activateFn = () => {
                const songId = row.dataset.songId;
                const idx = librarySongs.findIndex(s => s.id === songId);
                if (idx !== -1) {
                    currentQueue = [...librarySongs];
                    currentSongIndex = idx;
                    loadSong(idx);
                    if (!isPlaying) togglePlayPause();
                }
                closeSpotlight();
            };`;

const spotlightClickNew = `            const activateFn = () => {
                const songId = row.dataset.songId;
                const song = librarySongsMap.get(songId);
                if (song) {
                    // For spotlight, queue is just the selected song
                    currentQueue = [song];
                    currentSongIndex = 0;
                    loadSong(0);
                    if (!isPlaying) togglePlayPause();
                }
                closeSpotlight();
            };`;

js = js.replace(spotlightClickOld, spotlightClickNew);

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched table and search click logic");
