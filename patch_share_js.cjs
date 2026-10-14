const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

// 1. Add URL parsing on load
const urlParseLogic = `
    const params = new URLSearchParams(window.location.search);
    const initialSongId = params.get('song');
    const initialPlaylist = params.get('playlist');
    
    // Fallback share handling
    async function generateShortLink(url) {
        try {
            const res = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url));
            if (res.ok) return await res.text();
        } catch (e) {
            console.error(e);
        }
        return url; // fallback to long url
    }

    async function handleShare(type, id) {
        const baseUrl = window.location.origin + window.location.pathname;
        let targetUrl = baseUrl;
        if (type === 'song') targetUrl += '?song=' + encodeURIComponent(id);
        else if (type === 'playlist') targetUrl += '?playlist=' + encodeURIComponent(id);
        
        const originalText = document.activeElement ? document.activeElement.innerText : 'Share';
        if (document.activeElement && document.activeElement.classList.contains('context-menu-item')) {
            document.activeElement.innerText = 'Generating...';
        }

        const shortUrl = await generateShortLink(targetUrl);
        
        try {
            await navigator.clipboard.writeText(shortUrl);
            alert("Link copied to clipboard!\\n" + shortUrl);
        } catch (err) {
            prompt("Copy this link:", shortUrl);
        }
        
        if (document.activeElement && document.activeElement.classList.contains('context-menu-item')) {
            document.activeElement.innerText = originalText;
        }
        
        if (contextMenu) contextMenu.classList.add('hidden');
        if (queueContextMenu) queueContextMenu.classList.add('hidden');
    }

    // Assign to window for inline calls if needed
    window.handleShare = handleShare;

    // Attach to playlist share button
    const sharePlaylistBtn = document.getElementById('share-playlist-btn');
    if (sharePlaylistBtn) {
        sharePlaylistBtn.addEventListener('click', () => {
            const currentPlaylistId = playlistTitleEl.textContent === 'Liked Songs' ? 'favorites' : 
                                     playlistTitleEl.textContent === 'All Available Tracks' ? 'main' :
                                     playlistTitleEl.textContent === 'Viral Hits' ? 'viral' :
                                     playlistTitleEl.textContent === 'Rap Caviar' ? 'hiphop' :
                                     playlistTitleEl.textContent === 'Late Night' ? 'chill' : 'main';
            handleShare('playlist', currentPlaylistId);
        });
    }
`;

// Insert the logic near the top of init()
js = js.replace(/function init\(\) \{/, 'function init() {\n' + urlParseLogic);

// Modify state restore to override if URL params exist
const stateRestoreRegex = /const savedRaw = localStorage\.getItem\('dts_music_state'\);/;
const stateRestoreReplacement = `
            if (initialSongId) {
                const sIndex = librarySongs.findIndex(s => s.id === initialSongId);
                if (sIndex !== -1) {
                    currentQueue = [...librarySongs];
                    currentSongIndex = sIndex;
                    loadSong(currentSongIndex);
                    activeAudio.addEventListener('loadedmetadata', () => {
                        playSong();
                    }, { once: true });
                    restored = true;
                    // Remove param from URL without reloading
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } else if (initialPlaylist) {
                window.loadPlaylistView = loadPlaylistView; // ensure it's available
                setTimeout(() => loadPlaylistView(initialPlaylist), 100);
                window.history.replaceState({}, document.title, window.location.pathname);
                // Continue standard resume in background
            }
            
            const savedRaw = localStorage.getItem('dts_music_state');
`;
js = js.replace(stateRestoreRegex, stateRestoreReplacement);

// 2. Add 'qctx-share' to queueContextMenu innerHTML
js = js.replace(
    /<button class="context-menu-item" id="qctx-remove" style="color: #ff4444;">Remove from Queue<\/button>/,
    '<button class="context-menu-item" id="qctx-share">Share Song</button>\n        <button class="context-menu-item" id="qctx-remove" style="color: #ff4444;">Remove from Queue</button>'
);

// 3. Bind ctx-share
const bindCtxShare = `
    document.getElementById('ctx-share')?.addEventListener('click', () => {
        if(contextMenuTargetSongId) {
            handleShare('song', contextMenuTargetSongId);
        }
    });
`;
js = js.replace(/document\.getElementById\('ctx-view-artist'\)\?\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/, match => match + '\n' + bindCtxShare);

// 4. Bind qctx-share
const bindQctxShare = `
    document.getElementById('qctx-share')?.addEventListener('click', () => {
        if(qctxTargetId) {
            handleShare('song', qctxTargetId);
        }
    });
`;
js = js.replace(/document\.getElementById\('qctx-play-next'\)\?\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/, match => match + '\n' + bindQctxShare);

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched JS for sharing");
