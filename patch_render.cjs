const fs = require('fs');
const file = 'js/harmonytunes.js';
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

        const groupedSongs = groupSongsByTitle(songs);
        groupedSongs.forEach((group, index) => {
            const row = document.createElement('tr');
            const song = group.baseSong;
            
            const isActive = (currentQueue[currentSongIndex]?.id === song.id);
            if (isActive) row.classList.add('playing');
            
            let optionsHtml = escapeHTML(group.baseTitle);
            if (group.versions && group.versions.length > 1) {
                optionsHtml += \`<br><select class="version-select" style="margin-top:4px;width:100%;max-width:200px;" onchange="this.closest('tr').dataset.songId = this.value; event.stopPropagation();" onclick="event.stopPropagation()">\` +
                    group.versions.map(v => \`<option value="\${escapeHTML(v.id)}">\${escapeHTML(v.versionName)}</option>\`).join('') +
                \`</select>\`;
            }

            row.innerHTML = \`
                <td>
                    <span class="song-index" style="\${isActive ? 'display:none' : ''}">\${escapeHTML(index + 1)}</span>
                    <span class="playing-icon" style="\${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">\${optionsHtml}</td>
                <td>\${escapeHTML(song.artist)}</td>
                <td style="text-align: right;">\${escapeHTML(song.duration)}</td>
                <td style="width: 40px; text-align: center;">
                    <button class="card-more-btn" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer;" title="More Options">...</button>
                </td>
            \`;

            // Assign data-song-id to the row so context menu click can find it
            row.dataset.songId = song.id;
            
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
            const group = currentGroupedSongs[index];
            const row = document.createElement('tr');
            const song = group.baseSong;
            
            const isActive = (currentQueue[currentSongIndex]?.id === song.id);
            if (isActive) row.classList.add('playing');
            
            let optionsHtml = escapeHTML(group.baseTitle);
            if (group.versions && group.versions.length > 1) {
                optionsHtml += \`<br><select class="version-select" style="margin-top:4px;width:100%;max-width:200px;" onchange="this.closest('tr').dataset.songId = this.value; event.stopPropagation();" onclick="event.stopPropagation()">\` +
                    group.versions.map(v => \`<option value="\${escapeHTML(v.id)}">\${escapeHTML(v.versionName)}</option>\`).join('') +
                \`</select>\`;
            }

            row.innerHTML = \`
                <td>
                    <span class="song-index" style="\${isActive ? 'display:none' : ''}">\${escapeHTML(index + 1)}</span>
                    <span class="playing-icon" style="\${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">\${optionsHtml}</td>
                <td>\${escapeHTML(song.artist)}</td>
                <td style="text-align: right;">\${escapeHTML(song.duration)}</td>
                <td style="width: 40px; text-align: center;">
                    <button class="card-more-btn" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer;" title="More Options">...</button>
                </td>
            \`;

            row.dataset.songId = song.id;
            
            row.addEventListener('click', (e) => {
                if (e.target.closest('.card-more-btn')) return;
                if (e.target.closest('.version-select')) return;
                
                const queueRows = Array.from(songListBody.querySelectorAll('tr'));
                const dynamicQueue = queueRows.length > 0 
                    ? queueRows.map(r => librarySongsMap.get(r.dataset.songId)).filter(Boolean)
                    : currentGroupedSongs.map(g => librarySongsMap.get(row.dataset.songId || g.baseSong.id)).filter(Boolean);
                
                playContext(dynamicQueue, index);
            });

            fragment.appendChild(row);
        }

        songListBody.appendChild(fragment);
        currentRenderIndex = endIndex;
        
        // Setup observer for next chunk if needed
        if (currentRenderIndex < currentGroupedSongs.length) {
            setupIntersectionObserver();
        }
    }
    
    function setupIntersectionObserver() {
        if (intersectionObserver) {
            intersectionObserver.disconnect();
        }
        
        // Find or create sentinel
        let sentinel = document.getElementById('table-sentinel');
        if (!sentinel) {
            sentinel = document.createElement('div');
            sentinel.id = 'table-sentinel';
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

        currentGroupedSongs = groupSongsByTitle(songs);
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
