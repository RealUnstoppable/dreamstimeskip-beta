const fs = require('fs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchItunes(query) {
    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return data.results[0];
        }
    } catch (e) {
        // ignore errors
    }
    return null;
}

async function run() {
    let js = fs.readFileSync('js/song-data.js', 'utf8');
    const match = js.match(/const librarySongs = (\[[\s\S]*?\]);\s*export/);
    if (!match) return;
    
    const songs = JSON.parse(match[1]);
    let enriched = 0;
    
    // Only process songs that are "Unknown Artist" OR have blank cover art
    const targets = songs.filter(s => s.artist === "Unknown Artist" || s.art.includes("blank_cover"));
    console.log(`Found ${targets.length} songs to enrich.`);
    
    // Process in batches of 10
    const batchSize = 10;
    for (let i = 0; i < targets.length; i += batchSize) {
        const batch = targets.slice(i, i + batchSize);
        const promises = batch.map(async (song) => {
            let query = song.title;
            // If it has artist, include it in query for better matches
            if (song.artist !== "Unknown Artist") {
                query += " " + song.artist;
            }
            
            // clean up query
            query = query.replace(/slowed/gi, '').replace(/reverb/gi, '').replace(/sped up/gi, '').trim();
            
            const track = await searchItunes(query);
            if (track) {
                if (song.artist === "Unknown Artist") {
                    song.title = track.trackName;
                    song.artist = track.artistName;
                }
                if (song.art.includes("blank_cover") && track.artworkUrl100) {
                    song.art = track.artworkUrl100.replace('100x100bb', '600x600bb');
                }
                enriched++;
            }
        });
        
        await Promise.all(promises);
        await sleep(500); // 500ms delay between batches to respect rate limits
        if (i % 100 === 0 && i > 0) console.log(`Processed ${i} songs...`);
    }
    
    console.log(`Successfully enriched ${enriched} songs.`);
    
    const newJson = JSON.stringify(songs, null, 4);
    js = js.replace(/const librarySongs = \[[\s\S]*?\];\s*export/, `const librarySongs = ${newJson};\n\nexport`);
    fs.writeFileSync('js/song-data.js', js, 'utf8');
}

run();
