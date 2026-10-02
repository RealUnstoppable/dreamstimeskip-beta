import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SONGS_DIR = "/Users/catalinandrian/Downloads/Songs/";

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// 1. Build map of slug -> full local path
const files = fs.readdirSync(SONGS_DIR);
const fileMap = new Map();

for (const file of files) {
    if (file.endsWith('.mp3') || file.endsWith('.m4a') || file.endsWith('.webm') || file.endsWith('.mp4') || file.endsWith('.wav')) {
        const basename = path.parse(file).name;
        const slug = slugify(basename) + ".mp3"; // everything was uploaded as mp3 by the previous script
        fileMap.set(slug, path.join(SONGS_DIR, file));
    }
}

// 2. Load song-data.js
let songDataRaw = fs.readFileSync("js/song-data.js", "utf8");
songDataRaw = songDataRaw.replace(/export\s+/g, "");
const getSongs = new Function(songDataRaw + "\nreturn librarySongs;");
const librarySongs = getSongs();

// 3. Update durations
let updatedCount = 0;
for (const song of librarySongs) {
    if (song.duration === "0:00" || !song.duration) {
        // Extract filename from src
        let srcFile = song.src.split('/').pop();
        if (srcFile.includes('?')) {
            srcFile = srcFile.split('?')[0]; // strip firebase token
        }
        // Firebase URL encodes it, so decode
        srcFile = decodeURIComponent(srcFile);
        
        // Remove "music/" prefix if it's there
        if (srcFile.startsWith('music/')) {
            srcFile = srcFile.substring(6);
        }

        const localPath = fileMap.get(srcFile);
        if (localPath) {
            try {
                // Get duration in seconds
                const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${localPath}"`;
                const durSecs = parseFloat(execSync(cmd, { encoding: 'utf8' }).trim());
                if (!isNaN(durSecs)) {
                    const m = Math.floor(durSecs / 60);
                    const s = Math.floor(durSecs % 60).toString().padStart(2, '0');
                    song.duration = `${m}:${s}`;
                    updatedCount++;
                }
            } catch (e) {
                console.error(`Failed to get duration for ${localPath}`);
            }
        } else {
            console.warn(`Local file not found for ${srcFile}`);
        }
    }
}

console.log(`Updated ${updatedCount} durations.`);

// 4. Save updated song-data.js
const updatedJson = JSON.stringify(librarySongs, null, 4);
const newContent = `// js/song-data.js
// Auto-generated song library

export const songColors = {
    "default": "linear-gradient(135deg, rgba(30, 30, 30, 0.8), rgba(10, 10, 10, 0.95))"
};

export const librarySongs = ${updatedJson};
`;
fs.writeFileSync("js/song-data.js", newContent, "utf8");
console.log("Saved js/song-data.js");
