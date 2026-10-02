#!/usr/bin/env node
/**
 * sync-songs.cjs
 * 
 * Scans the /music/ folder for MP3 files and auto-registers any new ones
 * into js/song-data.js so they appear on the site immediately.
 * 
 * Usage: node sync-songs.cjs
 * 
 * - Parses artist & title from filenames like "Artist - Title.mp3" or "title-artist.mp3"
 * - Assigns a blank cover (/images/blank_cover.svg) for new songs
 * - Adds them to the leaderboard (librarySongs array)
 * - Generates placeholder lyrics entries
 */

const fs = require('fs');
const path = require('path');

const MUSIC_DIR = path.join(__dirname, 'music');
const SONG_DATA_FILE = path.join(__dirname, 'js', 'song-data.js');
const LYRICS_DATA_FILE = path.join(__dirname, 'js', 'lyrics-data.js');
const BLANK_COVER = '/images/blank_cover.svg';

// --- Helpers ---

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-|-$/g, '');
}

function titleCase(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

function parseFilename(filename) {
    // Strip extension
    let name = filename.replace(/\.mp3$/i, '');

    let title, artist;

    // Pattern 1: "Artist - Title"
    if (name.includes(' - ')) {
        const parts = name.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
    }
    // Pattern 2: "title-feat-artist-name" (kebab-case with feat)
    else if (name.includes('-feat-') || name.includes('-ft-')) {
        const sep = name.includes('-feat-') ? '-feat-' : '-ft-';
        const parts = name.split(sep);
        title = titleCase(parts[0].replace(/-/g, ' ').trim());
        artist = titleCase(parts.slice(1).join(` ft. `).replace(/-/g, ' ').trim());
    }
    // Pattern 3: kebab-case "title-artist" — last segment might be artist
    else if (name.includes('-')) {
        // Just use the whole thing as title, artist unknown
        title = titleCase(name.replace(/-/g, ' ').replace(/_/g, ' ').trim());
        artist = 'Unknown Artist';
    }
    // Pattern 4: underscored or plain
    else {
        title = titleCase(name.replace(/_/g, ' ').trim());
        artist = 'Unknown Artist';
    }

    // Clean up common prefixes like "ES_"
    title = title.replace(/^Es\s+/i, '');

    return { title, artist };
}

// --- Read existing song-data.js ---

const songDataRaw = fs.readFileSync(SONG_DATA_FILE, 'utf8');

// Extract all src paths currently registered
const existingSrcs = new Set();
const srcRegex = /src:\s*["']([^"']+)["']/g;
let match;
while ((match = srcRegex.exec(songDataRaw)) !== null) {
    existingSrcs.add(match[1]);
}

// --- Scan music folder ---

const mp3Files = fs.readdirSync(MUSIC_DIR)
    .filter(f => f.toLowerCase().endsWith('.mp3'))
    .sort();

const newSongs = [];

for (const file of mp3Files) {
    const webPath = `/music/${file}`;

    if (existingSrcs.has(webPath)) {
        continue; // Already registered
    }

    // Also check URL-encoded version and common variations
    const decodedExisting = [...existingSrcs].some(s => 
        decodeURIComponent(s) === decodeURIComponent(webPath)
    );
    if (decodedExisting) continue;

    const { title, artist } = parseFilename(file);
    const id = slugify(`${title} ${artist !== 'Unknown Artist' ? artist : ''}`).substring(0, 60);

    newSongs.push({
        id,
        title,
        artist,
        duration: '0:00',
        src: webPath,
        art: BLANK_COVER,
        bpm: 120,
        energy: 0.7,
        inmixPoint: 10,
        outmixPoint: 10,
        tags: ['untagged']
    });
}

if (newSongs.length === 0) {
    console.log('✅ All MP3 files are already registered in song-data.js. Nothing to do!');
    process.exit(0);
}

console.log(`🎵 Found ${newSongs.length} new song(s) to register:\n`);
newSongs.forEach(s => console.log(`   + ${s.title} — ${s.artist}  (${s.src})`));

// --- Inject into song-data.js ---

// Build the new entries as JS text
const newEntries = newSongs.map(s => `    {
        id: '${s.id}',
        title: ${JSON.stringify(s.title)},
        artist: ${JSON.stringify(s.artist)},
        duration: "${s.duration}",
        src: ${JSON.stringify(s.src)},
        art: "${s.art}",
        bpm: ${s.bpm}, energy: ${s.energy}, inmixPoint: ${s.inmixPoint}, outmixPoint: ${s.outmixPoint},
        tags: ${JSON.stringify(s.tags)}
    }`).join(',\n');

// Insert before the closing "];" of librarySongs
// First, normalize: remove any trailing comma + whitespace before ];
let normalized = songDataRaw.replace(/,?\s*\n\];\s*\n\nexport const songColors/, `\n];\n\nexport const songColors`);
const updatedSongData = normalized.replace(
    /(\n\];\s*\n\nexport const songColors)/,
    `,\n${newEntries}\n];\n\nexport const songColors`
);

fs.writeFileSync(SONG_DATA_FILE, updatedSongData, 'utf8');
console.log(`\n✅ Updated js/song-data.js with ${newSongs.length} new song(s).`);

// --- Inject into lyrics-data.js ---

const lyricsRaw = fs.readFileSync(LYRICS_DATA_FILE, 'utf8');

const newLyricsEntries = newSongs.map(s => `    "${s.id}": [
        {
            "start": 0,
            "end": 10,
            "trending": false,
            "words": [
                {
                    "text": "[Lyrics not yet available]",
                    "start": 0
                }
            ]
        }
    ]`).join(',\n');

// Insert before the closing "};" 
const updatedLyrics = lyricsRaw.replace(
    /\n\};$/m,
    `,\n${newLyricsEntries}\n};`
);

fs.writeFileSync(LYRICS_DATA_FILE, updatedLyrics, 'utf8');
console.log(`✅ Updated js/lyrics-data.js with placeholder lyrics.`);
console.log(`\n🎉 Done! Commit and push to see them live.`);
