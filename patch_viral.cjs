const fs = require('fs');

let js = fs.readFileSync('js/song-data.js', 'utf8');

// Extract the librarySongs array
const match = js.match(/const librarySongs = (\[[\s\S]*?\]);\s*export/);
if (!match) {
    console.log("Could not find librarySongs");
    process.exit(1);
}

let songs;
try {
    songs = JSON.parse(match[1]);
} catch (e) {
    console.error("Failed to parse JSON", e);
    process.exit(1);
}

// Clear all viral tags
songs.forEach(s => {
    if (s.tags) {
        s.tags = s.tags.filter(t => t !== 'viral');
    }
});

// Popular artists to prioritize
const popularArtists = ["Drake", "The Weeknd", "Travis Scott", "Future", "Lil Baby", "Pop Smoke", "21 Savage", "Central Cee", "Doja Cat", "Yeat", "Playboi Carti", "Ken Carson", "Destroy Lonely", "Ice Spice", "SZA"];

// Score songs to pick top 100
let scoredSongs = songs.map(s => {
    let score = Math.random(); // Base random score
    if (popularArtists.some(a => s.artist.includes(a) || s.title.includes(a))) {
        score += 2; // High priority for popular artists
    }
    // Also prioritize certain trendy words
    if (s.title.toLowerCase().includes("sped up") || s.title.toLowerCase().includes("slowed")) {
        score += 1;
    }
    return { song: s, score };
});

scoredSongs.sort((a, b) => b.score - a.score);

// Pick top 100 and add viral tag
const top100 = scoredSongs.slice(0, 100);
top100.forEach(item => {
    if (!item.song.tags) item.song.tags = [];
    item.song.tags.push("viral");
});

const newJson = JSON.stringify(songs, null, 4);
js = js.replace(/const librarySongs = \[[\s\S]*?\];\s*export/, `const librarySongs = ${newJson};\n\nexport`);

fs.writeFileSync('js/song-data.js', js, 'utf8');
console.log("Viral playlist updated to exactly 100 songs.");
