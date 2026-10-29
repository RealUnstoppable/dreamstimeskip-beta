import fs from 'fs';
import path from 'path';

const songDataPath = path.resolve('js/song-data.js');
const bucket = 'dts-hub-website.firebasestorage.app';

function normalize(str) {
    return (str || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

async function main() {
    const songDataContent = fs.readFileSync(songDataPath, 'utf8');
    const songColorsMatch = songDataContent.match(/export const songColors = (\{[\s\S]*?\});/);
    const songColors = songColorsMatch ? JSON.parse(songColorsMatch[1]) : {};

    const libMatch = songDataContent.match(/export const librarySongs = (\[[\s\S]*?\]);/);
    if (!libMatch) {
        throw new Error("Could not find librarySongs in js/song-data.js");
    }
    const librarySongs = JSON.parse(libMatch[1]);

    // Build complete Firebase file map
    const fbItems = JSON.parse(fs.readFileSync('/tmp/firebase_music_items.json', 'utf8'));
    const allFirebaseMap = new Map();
    fbItems.forEach(i => {
        const fn = path.basename(i.name);
        allFirebaseMap.set(fn, {
            filename: fn,
            token: i.token,
            url: `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent('music/' + fn)}?alt=media${i.token ? `&token=${i.token}` : ''}`
        });
    });

    // Merge uploaded songs from scratch
    if (fs.existsSync('scratch/uploaded_songs.json')) {
        const newlyUploaded = JSON.parse(fs.readFileSync('scratch/uploaded_songs.json', 'utf8'));
        for (const [fn, info] of Object.entries(newlyUploaded)) {
            allFirebaseMap.set(fn, info);
        }
    }

    const localFiles = new Set(fs.readdirSync('music'));
    console.log(`Total Firebase storage map entries: ${allFirebaseMap.size}`);
    console.log(`Total local music files: ${localFiles.size}`);

    let linkedLocalToFirebase = 0;
    let linkedLocalDisk = 0;
    let alreadyWorking = 0;
    let fuzzyLinked = 0;

    // Create normalized maps for fuzzy matching
    const fbNormMap = new Map();
    for (const [fn, info] of allFirebaseMap.entries()) {
        const norm = normalize(fn.replace(/\.mp3$/, ''));
        fbNormMap.set(norm, info);
    }

    for (const s of librarySongs) {
        if (s.id === 'krushdafight-n2uthehartlocker') {
            s.title = 'KRUSHDAFIGHT!';
            s.artist = 'N2UtheHartlocker';
            s.duration = '2:19';
            s.src = '/music/krushdafight-n2uthehartlocker.mp3';
            s.streamUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/music%2Fkrushdafight-n2uthehartlocker.mp3?alt=media&token=4870f07a-e5ab-4724-97ea-f7a1968a61c0`;
            s.art = '/images/krushdafight.svg';
            s.bpm = 125;
            s.energy = 0.85;
            s.inmixPoint = 10;
            s.outmixPoint = 10;
            s.tags = ['phonk', 'brazilian phonk', 'electronic', 'gaming'];
            continue;
        }

        // Case 1: points to local /music/
        if (s.src && s.src.startsWith('/music/')) {
            const fn = path.basename(s.src);
            if (localFiles.has(fn)) {
                // Exists locally! Check if we also have streamUrl
                if (!s.streamUrl && allFirebaseMap.has(fn)) {
                    s.streamUrl = allFirebaseMap.get(fn).url;
                }
                alreadyWorking++;
            } else if (allFirebaseMap.has(fn)) {
                // Missing on local disk, but in Firebase Storage!
                s.src = allFirebaseMap.get(fn).url;
                linkedLocalToFirebase++;
            } else {
                // Try normalized fuzzy matching
                const normSlug = normalize(fn.replace(/\.mp3$/, ''));
                const normTitleArtist = normalize(`${s.title || ''}${s.artist || ''}`);
                const match = fbNormMap.get(normSlug) || fbNormMap.get(normTitleArtist);
                if (match) {
                    s.src = match.url;
                    fuzzyLinked++;
                }
            }
        }
        // Case 2: points to Firebase Storage
        else if (s.src && s.src.startsWith('https://firebasestorage.googleapis.com')) {
            const m = s.src.match(/\/o\/music%2F([^?]+)/);
            if (m) {
                const fn = decodeURIComponent(m[1]);
                if (localFiles.has(fn)) {
                    s.streamUrl = s.src;
                    s.src = `/music/${fn}`;
                    linkedLocalDisk++;
                } else {
                    alreadyWorking++;
                }
            }
        }
    }

    console.log(`Linking summary:`);
    console.log(`- Linked missing local tracks to Firebase Storage: ${linkedLocalToFirebase}`);
    console.log(`- Fuzzy matched unlinked tracks to Firebase Storage: ${fuzzyLinked}`);
    console.log(`- Switched Firebase URLs to local disk files where available: ${linkedLocalDisk}`);
    console.log(`- Already working files: ${alreadyWorking}`);

    // Ensure songColors has krushdafight
    songColors['krushdafight-n2uthehartlocker'] = '#c51818';

    const newContent = `// js/song-data.js
// Auto-generated song library with Medixly Top 100 playlist

export const songColors = ${JSON.stringify(songColors, null, 4)};

export const librarySongs = ${JSON.stringify(librarySongs, null, 4)};

export function getSongById(id) {
    if (!id) return null;
    return librarySongs.find(song => song.id === id) ||
           librarySongs.find(song => song.id === \`top100-\${id}\`) ||
           librarySongs.find(song => song.id.replace(/^top100-/, '') === id);
}
`;

    fs.writeFileSync(songDataPath, newContent, 'utf8');
    console.log(`Successfully updated ${songDataPath}`);
}

main().catch(err => {
    console.error("Linking error:", err);
    process.exit(1);
});
