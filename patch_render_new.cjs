const fs = require('fs');
const file = 'js/medixly_new.js';
let content = fs.readFileSync(file, 'utf8');

const target = `    // --- RENDERING TABLE (Fixed Duration Bug) ---
    function renderSongTable(songs) {
        songListBody.innerHTML = '';
        if (songs.length === 0) {
            songListBody.innerHTML = \`<tr><td colspan="4" style="text-align:center; padding: 20px;">No songs found.</td></tr>\`;
            return;
        }

        // ⚡ Bolt: Use DocumentFragment to batch DOM insertions and avoid reflows during loop
        const fragment = document.createDocumentFragment();

        songs.forEach((song, index) => {
            const row = document.createElement('tr');
            
            const isActive = (currentQueue[currentSongIndex]?.id === song.id);
            if (isActive) row.classList.add('playing');

            // REMOVED HEART COLUMN, ADDED DURATION
            row.innerHTML = \`
                <td>
                    <span class="song-index" style="\${isActive ? 'display:none' : ''}">\${escapeHTML(index + 1)}</span>
                    <span class="playing-icon" style="\${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">\${escapeHTML(song.title)}</td>
                <td>\${escapeHTML(song.artist)}</td>
                <td style="text-align: right;">\${escapeHTML(song.duration)}</td>
            \`;

            row.addEventListener('click', () => {
                playContext(songs, index);
            });

            fragment.appendChild(row);
        });

        songListBody.appendChild(fragment);
    }`;

const replacement = `    // --- RENDERING TABLE (Fixed Duration Bug) ---
    let currentRenderIndex = 0;
    let currentGroupedSongs = [];
    const RENDER_CHUNK_SIZE = 50;
    let intersectionObserver = null;

    function renderSongTableChunk() {
        if (currentRenderIndex >= currentGroupedSongs.length) return;

        const fragment = document.createDocumentFragment();
        const endIndex = Math.min(currentRenderIndex + RENDER_CHUNK_SIZE, currentGroupedSongs.length);
        
        for (let index = currentRenderIndex; index < endIndex; index++) {
            const song = currentGroupedSongs[index];
            const row = document.createElement('tr');
            
            const isActive = (currentQueue[currentSongIndex]?.id === song.id);
            if (isActive) row.classList.add('playing');

            row.innerHTML = \`
                <td>
                    <span class="song-index" style="\${isActive ? 'display:none' : ''}">\${escapeHTML(index + 1)}</span>
                    <span class="playing-icon" style="\${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">\${escapeHTML(song.title)}</td>
                <td>\${escapeHTML(song.artist)}</td>
                <td style="text-align: right;">\${escapeHTML(song.duration)}</td>
            \`;

            row.addEventListener('click', () => {
                playContext(currentGroupedSongs, index);
            });

            fragment.appendChild(row);
        }

        songListBody.appendChild(fragment);
        currentRenderIndex = endIndex;
        
        if (currentRenderIndex < currentGroupedSongs.length) {
            setupIntersectionObserver();
        }
    }
    
    function setupIntersectionObserver() {
        if (intersectionObserver) {
            intersectionObserver.disconnect();
        }
        
        let sentinel = document.getElementById('table-sentinel-new');
        if (!sentinel) {
            sentinel = document.createElement('div');
            sentinel.id = 'table-sentinel-new';
            sentinel.style.height = '1px';
            songListBody.parentElement.appendChild(sentinel);
        }
        
        intersectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                renderSongTableChunk();
            }
        }, { rootMargin: '200px' });
        
        intersectionObserver.observe(sentinel);
    }

    function renderSongTable(songs) {
        songListBody.innerHTML = '';
        if (intersectionObserver) {
            intersectionObserver.disconnect();
        }
        
        if (songs.length === 0) {
            songListBody.innerHTML = \`<tr><td colspan="4" style="text-align:center; padding: 20px;">No songs found.</td></tr>\`;
            return;
        }

        currentGroupedSongs = songs;
        currentRenderIndex = 0;
        
        renderSongTableChunk();
    }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Patched successfully.");
} else {
    console.log("Could not find target to replace.");
}
