const fs = require('fs');
const file = 'js/medixly_new.js';
if(!fs.existsSync(file)) return;
let content = fs.readFileSync(file, 'utf8');

const funcDef = `    function updateSongTableActiveState() {
        if (!currentQueue || currentSongIndex < 0 || currentSongIndex >= currentQueue.length) return;
        const currentSongId = currentQueue[currentSongIndex].id;
        const rows = songListBody.querySelectorAll('tr');
        rows.forEach(row => {
            const isMatch = row.dataset.songId === currentSongId;
            if (isMatch) {
                row.classList.add('playing');
                const idxSpan = row.querySelector('.song-index');
                const iconSpan = row.querySelector('.playing-icon');
                if(idxSpan) idxSpan.style.display = 'none';
                if(iconSpan) iconSpan.style.display = 'inline';
            } else {
                row.classList.remove('playing');
                const idxSpan = row.querySelector('.song-index');
                const iconSpan = row.querySelector('.playing-icon');
                if(idxSpan) idxSpan.style.display = 'inline';
                if(iconSpan) iconSpan.style.display = 'none';
            }
        });
    }

    let currentRenderIndex = 0;`;

content = content.replace('    let currentRenderIndex = 0;', funcDef);

const targetUpdateUI = `        if(viewPlaylist.style.display !== 'none') {
            const showingFavs = playlistTitleEl.textContent === "Liked Songs";
            renderSongTable(showingFavs ? userFavorites : librarySongs);
        }`;

content = content.replace(targetUpdateUI, `        if(viewPlaylist.style.display !== 'none') {
            updateSongTableActiveState();
        }`);

const targetPlaySong = `            if(viewPlaylist.style.display !== 'none') {
                const showingFavs = playlistTitleEl.textContent === "Liked Songs";
                renderSongTable(showingFavs ? userFavorites : librarySongs);
            }`;

content = content.replace(targetPlaySong, `            if(viewPlaylist.style.display !== 'none') {
                updateSongTableActiveState();
            }`);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched updates for new.");
