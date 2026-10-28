import fs from 'fs';
import path from 'path';

const songDataPath = path.resolve('js/song-data.js');
const oldSongDataPath = '/tmp/old-song-data.mjs';

async function main() {
    const curModule = await import(songDataPath);
    const oldModule = await import(oldSongDataPath);

    const librarySongs = curModule.librarySongs;
    const songColors = curModule.songColors;
    const oldSongs = oldModule.librarySongs;
    const oldMap = new Map(oldSongs.map(s => [s.id, s]));

    let restoredFirebase = 0;
    for (const s of librarySongs) {
        if (s.src && s.src.startsWith('/music/')) {
            const p = path.resolve('.' + s.src);
            if (!fs.existsSync(p)) {
                const oldS = oldMap.get(s.id);
                if (oldS && oldS.src && oldS.src.startsWith('https://firebasestorage.googleapis.com')) {
                    s.src = oldS.src;
                    if (s.streamUrl && s.streamUrl.startsWith('/music/')) {
                        s.streamUrl = oldS.src;
                    }
                    restoredFirebase++;
                }
            }
        }
    }
    console.log(`Restored ${restoredFirebase} songs to original Firebase Storage URLs`);

    const vincentFixes = {
        'fk-school-404vincent': {
            title: 'FK School',
            artist: '404vincent',
            duration: '1:48',
            src: '/music/fk-school-404vincent.mp3',
            art: '/music/fk-school-404vincent.jpg',
            tags: ['rap', 'hiphop', 'viral']
        },
        'dumb-luck-404vincent': {
            title: 'Dumb Luck',
            artist: '404vincent',
            duration: '2:18',
            src: '/music/dumb-luck-404vincent.mp3',
            streamUrl: 'https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdumb-luck-404vincent.mp3?alt=media&token=c938aa5d-f56d-49d5-ba60-1e781a6a4df3',
            art: '/music/fk-school-404vincent.jpg',
            tags: ['rap', 'hiphop']
        },
        'i-do-this-404vincent': {
            title: 'I Do This',
            artist: '404vincent',
            duration: '3:04',
            src: '/music/i-do-this-404vincent.mp3',
            streamUrl: 'https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-do-this-404vincent.mp3?alt=media&token=f1fba6b5-08b1-4af0-8c43-f97074c2aad4',
            art: '/music/fk-school-404vincent.jpg',
            tags: ['rap', 'hiphop']
        },
        'im-an-ae-404vincent': {
            title: "I'm An AE",
            artist: '404vincent',
            duration: '2:10',
            src: '/music/im-an-ae-404vincent.mp3',
            streamUrl: 'https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-an-ae-404vincent.mp3?alt=media&token=6cd191a0-8d10-4905-9a62-f276f497ecee',
            art: '/music/fk-school-404vincent.jpg',
            tags: ['rap', 'hiphop']
        },
        'pull-up-404vincent': {
            title: 'Pull Up',
            artist: '404vincent',
            duration: '2:18',
            src: '/music/pull-up-404vincent.mp3',
            streamUrl: 'https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpull-up-404vincent.mp3?alt=media&token=83422d06-0eec-4b0a-bdfe-7ff6ef6b406c',
            art: '/music/fk-school-404vincent.jpg',
            tags: ['rap', 'hiphop']
        },
        'talk-a-lot-404vincent': {
            title: 'Talk A Lot',
            artist: '404vincent',
            duration: '2:02',
            src: '/music/talk-a-lot-404vincent.mp3',
            streamUrl: 'https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftalk-a-lot-404vincent.mp3?alt=media&token=8ab832f6-58bc-4857-8fe0-5d166b48e9d5',
            art: '/music/fk-school-404vincent.jpg',
            tags: ['rap', 'hiphop']
        }
    };

    let vincentUpdated = 0;
    for (const s of librarySongs) {
        if (vincentFixes[s.id]) {
            Object.assign(s, vincentFixes[s.id]);
            vincentUpdated++;
        }
    }
    console.log(`Updated ${vincentUpdated} 404vincent songs`);

    let clearedPreviews = 0;
    for (const s of librarySongs) {
        if (s.streamUrl && s.streamUrl.includes('itunes.apple.com')) {
            s.streamUrl = null;
            clearedPreviews++;
        }
    }
    console.log(`Cleared ${clearedPreviews} 30-second iTunes preview URLs`);

    const fileContent = `// js/song-data.js
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

    fs.writeFileSync(songDataPath, fileContent, 'utf8');
    console.log(`Wrote updated ${songDataPath}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
