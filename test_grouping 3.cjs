const fs = require('fs');
let js = fs.readFileSync('js/song-data.js', 'utf8');
const match = js.match(/const librarySongs = (\[[\s\S]*?\]);\s*export/);
const songs = JSON.parse(match[1]);

function groupSongsByTitle(songs) {
    const groups = new Map();
    
    songs.forEach(song => {
        let title = song.title;
        let lowerTitle = title.toLowerCase();
        
        let version = "Original";
        if (lowerTitle.includes("slowed") || lowerTitle.includes("reverb")) {
            version = "Slowed";
        } else if (lowerTitle.includes("sped")) {
            version = "Sped Up";
        } else if (lowerTitle.includes("remix")) {
            version = "Remix";
        }
        
        // Strip out version info from title to get base title
        let baseTitle = title
            .replace(/slowed/ig, '')
            .replace(/reverb/ig, '')
            .replace(/sped\s*up/ig, '')
            .replace(/remix/ig, '')
            .replace(/\(\s*\)/g, '')
            .replace(/\[\s*\]/g, '')
            .replace(/\|\s*\|/g, '')
            .replace(/-\s*$/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        const key = baseTitle.toLowerCase() + "||" + song.artist.toLowerCase();
        if (!groups.has(key)) {
            groups.set(key, { baseTitle, baseSong: song, versions: [] });
        }
        const group = groups.get(key);
        
        if (version === "Original") {
            group.baseSong = song;
        }
        
        group.versions.push({
            id: song.id,
            versionName: version === "Original" ? "Original" : title
        });
    });
    
    return Array.from(groups.values());
}

const grouped = groupSongsByTitle(songs);
const multiGroups = grouped.filter(g => g.versions.length > 1);
console.log(`Total original songs: ${songs.length}`);
console.log(`Grouped into: ${grouped.length} unique titles`);
console.log(`Groups with >1 version: ${multiGroups.length}`);
console.log(JSON.stringify(multiGroups.slice(0, 5), null, 2));

