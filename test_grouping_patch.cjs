const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

const groupingLogic = `
export function groupSongsByTitle(songs) {
    const groups = new Map();
    
    songs.forEach(song => {
        let title = song.title;
        let lowerTitle = title.toLowerCase();
        
        let version = "Original";
        if (lowerTitle.includes("slowed") || lowerTitle.includes("reverb")) {
            version = "Slowed + Reverb";
        } else if (lowerTitle.includes("sped")) {
            version = "Sped Up";
        } else if (lowerTitle.includes("remix")) {
            version = "Remix";
        } else if (lowerTitle.includes("instrumental")) {
            version = "Instrumental";
        } else if (lowerTitle.includes("acoustic")) {
            version = "Acoustic";
        }
        
        let baseTitle = title
            .replace(/slowed/ig, '')
            .replace(/reverb/ig, '')
            .replace(/sped\\s*up/ig, '')
            .replace(/remix/ig, '')
            .replace(/instrumental/ig, '')
            .replace(/acoustic/ig, '')
            .replace(/\\(\\s*\\)/g, '')
            .replace(/\\[\\s*\\]/g, '')
            .replace(/-\s*$/g, '')
            .replace(/\\s+/g, ' ')
            .trim();
        
        const key = baseTitle.toLowerCase() + "||" + song.artist.toLowerCase();
        if (!groups.has(key)) {
            groups.set(key, { baseTitle, baseSong: song, versions: [] });
        }
        const group = groups.get(key);
        
        if (version === "Original" && group.versions.length > 0) {
            group.baseSong = song;
        }
        
        group.versions.push({
            id: song.id,
            versionName: version === "Original" ? "Original" : title
        });
    });
    
    return Array.from(groups.values());
}

export function createGroupCard(group) {
    let optionsHtml = '';
    if (group.versions && group.versions.length > 1) {
        optionsHtml = \`
            <select class="version-select" onchange="this.closest('.music-card').dataset.songId = this.value" onclick="event.stopPropagation()">
                \${group.versions.map(v => \`<option value="\${escapeHTML(v.id)}">\${escapeHTML(v.versionName)}</option>\`).join('')}
            </select>
        \`;
    }

    return \`
        <div class="music-card" data-song-id="\${escapeHTML(group.baseSong.id)}">
            <div class="card-img-wrapper">
                <img src="\${escapeHTML(group.baseSong.art)}" alt="\${escapeHTML(group.baseTitle)}">
                <button class="card-play-btn" aria-label="Play \${escapeHTML(group.baseTitle)}">▶</button>
                <button class="add-queue-btn" title="Add to Queue" aria-label="Add \${escapeHTML(group.baseTitle)} to queue">+</button>
                <button class="card-more-btn" title="More Options" aria-label="More options for \${escapeHTML(group.baseTitle)}">...</button>
            </div>
            <div class="card-title">\${escapeHTML(group.baseTitle)}</div>
            <div class="card-desc">\${escapeHTML(group.baseSong.artist)}</div>
            \${optionsHtml}
        </div>
    \`;
}
`;

js = js.replace(/export function createSongCard\(song\) \{[\s\S]*?\n\}/, groupingLogic);

fs.writeFileSync('js/harmonytunes_new.js', js, 'utf8');
console.log("Patched grouping logic into new file");
