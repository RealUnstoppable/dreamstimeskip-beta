const fs = require('fs');
let js = fs.readFileSync('js/song-data.js', 'utf8');
const match = js.match(/const librarySongs = (\[[\s\S]*?\]);\s*export/);
const songsRaw = JSON.parse(match[1]);

// deduplicate by ID first
const songs = Array.from(new Map(songsRaw.map(s => [s.id, s])).values());

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
        
        // Remove artist name from end if "Unknown Artist" is used
        if (song.artist === "Unknown Artist") {
            // some titles have artist in them, but it's hard to strip.
        }
        
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

const grouped = groupSongsByTitle(songs);
const multiGroups = grouped.filter(g => g.versions.length > 1);
console.log(`Unique songs: ${songs.length}`);
console.log(`Groups with >1 version: ${multiGroups.length}`);
console.log(JSON.stringify(multiGroups.slice(0, 5), null, 2));

