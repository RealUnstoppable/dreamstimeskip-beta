const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Add "Add to Playlist" to queueContextMenu
js = js.replace(
    /<button class="context-menu-item" id="qctx-share">Share Song<\/button>/,
    '<button class="context-menu-item" id="qctx-share">Share Song</button>\\n        <button class="context-menu-item" id="qctx-add-playlist">Add to Playlist</button>'
);

// Add custom playlist logic
const newLogic = `
    let customPlaylists = [];

    async function loadCustomPlaylists() {
        if (!currentUser) return;
        try {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                customPlaylists = data.customPlaylists || [];
                renderHomePlaylists();
            }
        } catch (e) {
            console.error("Failed to load custom playlists", e);
        }
    }

    async function saveCustomPlaylists() {
        if (!currentUser) return;
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, { customPlaylists });
        } catch (e) {
            console.error("Failed to save custom playlists", e);
        }
    }

    function renderHomePlaylists() {
        const playlists = [
            { id: 'main', title: "All Tracks", desc: "Complete Library" },
            { id: 'favorites', title: "Liked Songs", desc: "Your Favorites" },
            { id: 'hiphop', title: "Rap Caviar", desc: "Top Tier Rap" },
            { id: 'viral', title: "Viral Hits", desc: "Trending on TikTok" },
            { id: 'chill', title: "Late Night", desc: "Chill Vibes" }
        ];
        
        const allPlaylistsHtml = playlists.map(pl => \`
            <div class="music-card playlist-card" data-playlist-id="\${escapeHTML(pl.id)}">
                <div class="card-img-wrapper">
                    <img src="/images/harmony-tunes-card.jpg" alt="\${escapeHTML(pl.title)}">
                    <button class="card-play-btn" aria-label="Play \${escapeHTML(pl.title)}">▶</button>
                </div>
                <div class="card-title">\${escapeHTML(pl.title)}</div>
                <div class="card-desc">\${escapeHTML(pl.desc)}</div>
            </div>
        \`).join('') + customPlaylists.map(pl => \`
            <div class="music-card playlist-card" data-playlist-id="\${escapeHTML(pl.id)}">
                <div class="card-img-wrapper">
                    <img src="/images/harmony-tunes-card.jpg" alt="\${escapeHTML(pl.title)}">
                    <button class="card-play-btn" aria-label="Play \${escapeHTML(pl.title)}">▶</button>
                </div>
                <div class="card-title">\${escapeHTML(pl.title)}</div>
                <div class="card-desc">\${escapeHTML(pl.songs.length)} songs</div>
            </div>
        \`).join('');
        
        containerPlaylists.innerHTML = allPlaylistsHtml;
    }
`;

// Insert the functions right before `const playlists = [` in renderHome
js = js.replace(/const playlists = \[[\s\S]*?containerPlaylists\.innerHTML = playlists\.map[\s\S]*?join\(''\);/, 'renderHomePlaylists();');

// We need to inject the `newLogic` outside `init` but where it has access, or just inside `initHarmonyTunes()`
js = js.replace(/function initHarmonyTunes\(\) \{/, 'function initHarmonyTunes() {\n' + newLogic);

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched custom playlists storage logic");
