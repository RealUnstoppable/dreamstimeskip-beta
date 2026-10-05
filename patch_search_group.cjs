const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

const searchOld = `        spotlightResults.innerHTML = matches.map(song => \`
            <div class="spotlight-result-row" tabindex="0" data-song-id="\${escapeHTML(song.id)}" role="button" aria-label="Play \${escapeHTML(song.title)}">
                <img class="spotlight-result-art" src="\${escapeHTML(song.art)}" alt="" loading="lazy">
                <div class="spotlight-result-info">
                    <div class="spotlight-result-title">\${highlightMatch(song.title, query)}</div>
                    <div class="spotlight-result-artist">\${highlightMatch(song.artist, query)}</div>
                </div>
                <span class="spotlight-result-play">▶</span>
                <button class="card-more-btn" style="background:transparent;border:none;color:#fff;padding:0 10px;font-size:16px;cursor:pointer;" title="More Options">...</button>
            </div>
        \`).join('');`;

const searchNew = `        const groupedMatches = groupSongsByTitle(matches);
        spotlightResults.innerHTML = groupedMatches.map(group => {
            let optionsHtml = '';
            if (group.versions && group.versions.length > 1) {
                optionsHtml = \`<select class="version-select" style="margin-right:10px;width:auto;max-width:120px;" onchange="this.closest('.spotlight-result-row').dataset.songId = this.value" onclick="event.stopPropagation()">\` +
                    group.versions.map(v => \`<option value="\${escapeHTML(v.id)}">\${escapeHTML(v.versionName)}</option>\`).join('') +
                \`</select>\`;
            }
            return \`
            <div class="spotlight-result-row" tabindex="0" data-song-id="\${escapeHTML(group.baseSong.id)}" role="button" aria-label="Play \${escapeHTML(group.baseTitle)}">
                <img class="spotlight-result-art" src="\${escapeHTML(group.baseSong.art)}" alt="" loading="lazy">
                <div class="spotlight-result-info">
                    <div class="spotlight-result-title">\${highlightMatch(group.baseTitle, query)}</div>
                    <div class="spotlight-result-artist">\${highlightMatch(group.baseSong.artist, query)}</div>
                </div>
                \${optionsHtml}
                <span class="spotlight-result-play">▶</span>
                <button class="card-more-btn" style="background:transparent;border:none;color:#fff;padding:0 10px;font-size:16px;cursor:pointer;" title="More Options">...</button>
            </div>
        \`}).join('');`;

js = js.replace(searchOld, searchNew);

// What about renderSongTable?
const tableOld = `        songs.forEach((song, index) => {
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
                <td style="width: 40px; text-align: center;">
                    <button class="card-more-btn" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer;" title="More Options">...</button>
                </td>
            \`;`;

const tableNew = `        const groupedSongs = groupSongsByTitle(songs);
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
            \`;`;

js = js.replace(tableOld, tableNew);

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched search and table groups");
