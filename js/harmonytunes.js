import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { lyricsData } from './lyrics-data.js?v=1789909119';

import { librarySongs, songColors, getSongById } from './song-data.js?v=20260920';

// Utility to prevent DOM-based and Stored XSS
function escapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initHarmonyTunes() {
    // --- STATE ---
    // ⚡ Bolt: Pre-computed Map for O(1) library lookups, avoiding O(N) array search on play clicks
    const librarySongsMap = new Map(librarySongs.map(s => [s.id, s]));

    // TikTok videos — using direct iframe embed (no embed.js needed, always works after dynamic injection)
    const tiktokVideos = [
        { id: '7361214658742652206', caption: 'if you read this u have to follow #fyp #viral #music' },
        { id: '7343010577624747306', caption: 'If this video gets 100 likes we will start uploading daily #fyp #music #viral' },
        { id: '7340749763630894378', caption: 'Exes - Tate McRae - HarmonyTunes #fyp #viral #music' },
        { id: '7286740931238317342', caption: 'New songs every week! #liltay #fyp #viral' },
    ];


    let userFavorites = [];
    let favoriteIds = new Set();
    // ⚡ Bolt: Maintain a Set of favorite IDs for O(1) lookups instead of O(N) Array.some() checks
    let userFavoritesIds = new Set();
    let currentQueue = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 0; // 0: none, 1: all, 2: one
    let activeLineIndex = -1;
    // ⚡ Bolt: Cache DOM queries for lyrics to prevent O(N) DOM lookups on every timeupdate
    let cachedLyricLines = [];
    let isAutoScrolling = true;
    let autoScrollTimeout = null;
    let isProgrammaticScroll = false;
    let currentUser = null;
    window.__setCurrentUser = (u) => currentUser = u;
    window.__setUserFavorites = (f) => {
        userFavorites = f;
        userFavoritesIds = new Set(f.map(s => s.id));
    };
    window.__setCurrentQueue = (q) => currentQueue = q;
    window.__setCurrentSongIndex = (i) => currentSongIndex = i;
    window.__getUserFavorites = () => userFavorites;

    // --- DOM ELEMENTS ---
    const viewHome = document.getElementById('view-home');
    const viewPlaylist = document.getElementById('view-playlist');
    const navPills = document.querySelectorAll('.nav-pill');
    const backToHomeBtn = document.getElementById('back-to-home');
    
    // Containers
    const containerJumpBack = document.getElementById('container-jump-back-in');
    const containerRecommended = document.getElementById('container-recommended');
    const containerTikToks = document.getElementById('container-tiktoks');
    const containerPlaylists = document.getElementById('container-playlists');
    const songListBody = document.getElementById('song-list-body');
    const homeHistoryBtn = document.getElementById('home-history-btn');
    
    // Playlist Elements
    const playlistTitleEl = document.getElementById('playlist-title');
    const playlistDescEl = document.getElementById('playlist-desc');
    const playlistPlayBtn = document.getElementById('playlist-play-btn');
    
    // Player Elements
    const audioPlayer1 = document.getElementById('audio-player');
    const audioPlayer2 = document.getElementById('audio-player-2');
    let activeAudio = audioPlayer1;
    let nextAudio = audioPlayer2;
    let isMixerMode = false;
    let isCrossfading = false;
    let isListening = false;
    let viralLocked = false;

    // Calculate optimal crossfade duration in seconds based on BPM
    // Aim for 4 bars (16 beats) or 8 bars (32 beats) of overlap
    const calculateOptimalCrossfade = (bpm) => {
        if (!bpm || bpm <= 0) return 8; // Default 8 seconds if no BPM
        // 1 beat = 60 / BPM seconds
        const beatDuration = 60 / bpm;
        let fadeDuration = beatDuration * 16; // 4 bars
        if (fadeDuration < 5) fadeDuration = beatDuration * 32; // 8 bars if 4 bars is too short
        if (fadeDuration > 15) fadeDuration = 15; // Cap at 15s
        return fadeDuration;
    };

    // Helper to get viral block bounds
    const getViralBlock = (songId, audioEl) => {
        const data = lyricsData[songId];
        if (!data) return null;
        const trendingLines = data.filter(l => l.trending);
        if (trendingLines.length === 0) return null;
        
        const firstLine = trendingLines[0];
        const lastLine = trendingLines[trendingLines.length - 1];
        
        const firstIdx = data.indexOf(firstLine);
        const lastIdx = data.indexOf(lastLine);
        
        const blockStart = firstLine.start;
        const maxEndDur = audioEl.duration || blockStart + 15;
        // Add 1.3 seconds to blockEnd to ensure the entire final lyric is captured when Mixxer is OFF
        const blockEnd = (lastLine.end || (data[lastIdx + 1] ? data[lastIdx + 1].start : maxEndDur)) + 1.3;
        
        // Calculate optimal fade based on BPM
        const bpm = librarySongsMap.get(songId)?.bpm || 0;
        const optimalFade = calculateOptimalCrossfade(bpm);
        
        // Dynamically find how many lines before we need to satisfy optimalFade (max 3 edge cases)
        let startLineIdx = firstIdx;
        let leadIn = 0;
        while (startLineIdx > 0 && leadIn < optimalFade && (firstIdx - startLineIdx) < 3) {
            startLineIdx--;
            leadIn = blockStart - data[startLineIdx].start;
        }
        
        // Dynamically find how many lines after we need to satisfy optimalFade (max 3 edge cases)
        let endLineIdx = lastIdx;
        let tailOut = 0;
        while (endLineIdx < data.length - 1 && tailOut < optimalFade && (endLineIdx - lastIdx) < 3) {
            endLineIdx++;
            let currentEnd = data[endLineIdx].end || (data[endLineIdx + 1] ? data[endLineIdx + 1].start : maxEndDur);
            tailOut = currentEnd - blockEnd;
        }
        
        const maxLeadIn = blockStart - data[startLineIdx].start;
        
        let paddedEndVal = data[endLineIdx].end || (data[endLineIdx + 1] ? data[endLineIdx + 1].start : maxEndDur);
        const maxTailOut = Math.max(0, Math.min(maxEndDur, paddedEndVal) - blockEnd);
        
        // Cap actualFadeDur to the dynamically found boundaries
        let actualFadeDur = Math.max(0, Math.min(optimalFade, maxLeadIn, maxTailOut));
        
        // --- "NEURAL NETWORK" SHORT SONG RULE ---
        const songDuration = audioEl.duration || 180;
        const blockDuration = blockEnd - blockStart;
        
        // Never let the crossfade overlap be longer than 35% of the viral block itself
        actualFadeDur = Math.min(actualFadeDur, blockDuration * 0.35);

        // Scale down aggressively for short songs (preventing interfering overlap)
        if (songDuration < 60) {
            actualFadeDur = Math.min(actualFadeDur, 3);
        } else if (songDuration < 120) {
            actualFadeDur = Math.min(actualFadeDur, 7);
        }
        
        // Only use the padding needed for the crossfade
        const paddedStart = Math.max(0, blockStart - actualFadeDur);
        const paddedEnd = Math.min(songDuration, blockEnd + actualFadeDur);
        
        return { blockStart, blockEnd, paddedStart, paddedEnd, actualFadeDur };
    };

    let crossfadeDuration = 15;
    let crossfadeInterval = null;
    let fadeIntervalCrossfade = null;
    let fadeInterval = null;
    const mixerBtn = document.getElementById('mixer-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.querySelector('.music-player-bar .progress-bar');
    const progress = document.querySelector('.music-player-bar .progress');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-slider');
    const playerTitle = document.getElementById('player-song-title');
    const playerArtist = document.getElementById('player-song-artist');
    const playerArt = document.getElementById('player-album-art');
    
    // Lyrics Elements
    const lyricsBtn = document.getElementById('lyrics-btn');
    const viewLyrics = document.getElementById('view-lyrics');
    const closeLyricsBtn = document.getElementById('close-lyrics-btn');
    const lyricsContent = document.getElementById('lyrics-content');
    const lyricsContainer = document.getElementById('lyrics-container');

    // Player Bar Global Buttons
    const playerLikeBtn = document.getElementById('player-like-btn');

    // New Features
    const viralSkipBtn = document.getElementById('viral-skip-btn');
    const fsPlayer = document.getElementById('fullscreen-player');
    const closeFsBtn = document.getElementById('close-fullscreen-btn');
    const fsBg = document.getElementById('fullscreen-bg');
    const fsArt = document.getElementById('fullscreen-art');
    const fsTitle = document.getElementById('fullscreen-title');
    const fsArtist = document.getElementById('fullscreen-artist');
    

    const fsPlayPauseBtn = document.getElementById('fs-play-pause-btn');
    const fsNextBtn = document.getElementById('fs-next-btn');
    const fsPrevBtn = document.getElementById('fs-prev-btn');
    const fsPlayIcon = fsPlayPauseBtn ? fsPlayPauseBtn.querySelector('.play-icon') : null;
    const fsPauseIcon = fsPlayPauseBtn ? fsPlayPauseBtn.querySelector('.pause-icon') : null;
    const fsMixerBtn = document.getElementById('fs-mixer-btn');
    const artistProfile = document.getElementById('artist-profile');
    const closeArtistBtn = document.getElementById('close-artist-btn');

    const fsLyricsBtn = document.getElementById('fs-lyrics-btn');
    const fsViralSkipBtn = document.getElementById('fs-viral-skip-btn');
    const fsLikeBtn = document.getElementById('fs-like-btn');
    const fsShuffleBtn = document.getElementById('fs-shuffle-btn');
    const fsRepeatBtn = document.getElementById('fs-repeat-btn');
    const fsProgressBar = document.getElementById('fs-progress-bar');
    const fsProgress = document.getElementById('fs-progress');

    const fsCurrentTime = document.querySelector('.fs-current-time');
    const fsTotalTime = document.querySelector('.fs-total-time');


    // ===== Spotlight Search =====
    const spotlightOverlay = document.getElementById('spotlight-overlay');
    const spotlightInput   = document.getElementById('global-search');
    const spotlightResults = document.getElementById('spotlight-results');

    function openSpotlight() {
        if (!spotlightOverlay) return;
        spotlightOverlay.classList.remove('hidden');
        spotlightInput.value = '';
        spotlightResults.innerHTML = '';
        spotlightInput.focus();
    }

    function closeSpotlight() {
        if (!spotlightOverlay) return;
        spotlightOverlay.classList.add('hidden');
        spotlightInput.value = '';
        spotlightResults.innerHTML = '';
    }

    function highlightMatch(text, query) {
        if (!query) return escapeHTML(text);
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(${escaped})`, 'gi');
        return escapeHTML(text).replace(re, '<mark style="background:rgba(29,185,84,0.35);color:#fff;border-radius:2px;">$1</mark>');
    }

    function runSpotlightSearch(query) {
        if (!spotlightResults) return;
        const q = query.trim().toLowerCase();

        if (!q) {
            spotlightResults.innerHTML = '';
            return;
        }

        const matches = librarySongs.filter(s =>
            s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
        );

        if (matches.length === 0) {
            spotlightResults.innerHTML = `<div class="spotlight-no-results">No results for "<strong>${escapeHTML(query)}</strong>"</div>`;
            return;
        }

        spotlightResults.innerHTML = matches.map(song => `
            <div class="spotlight-result-row" tabindex="0" data-song-id="${escapeHTML(song.id)}" role="button" aria-label="Play ${escapeHTML(song.title)}">
                <img class="spotlight-result-art" src="${escapeHTML(song.art)}" alt="" loading="lazy">
                <div class="spotlight-result-info">
                    <div class="spotlight-result-title">${highlightMatch(song.title, query)}</div>
                    <div class="spotlight-result-artist">${highlightMatch(song.artist, query)}</div>
                </div>
                <span class="spotlight-result-play">▶</span>
            </div>
        `).join('');

        spotlightResults.querySelectorAll('.spotlight-result-row').forEach(row => {
            const activateFn = () => {
                const songId = row.dataset.songId;
                const idx = librarySongs.findIndex(s => s.id === songId);
                if (idx !== -1) {
                    currentQueue = [...librarySongs];
                    currentSongIndex = idx;
                    loadSong(idx);
                    if (!isPlaying) togglePlayPause();
                }
                closeSpotlight();
            };
            row.addEventListener('click', activateFn);
            row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateFn(); }});
        });
    }

    // Wire up input
    if (spotlightInput) {
        let searchTimeout;
        spotlightInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => runSpotlightSearch(e.target.value), 150);
        });
    }

    // Close on ESC or backdrop click
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && spotlightOverlay && !spotlightOverlay.classList.contains('hidden')) {
            closeSpotlight();
        }
    });
    if (spotlightOverlay) {
        spotlightOverlay.addEventListener('click', (e) => {
            if (e.target === spotlightOverlay) closeSpotlight();
        });
    }
    // ESC hint button
    document.querySelector('.spotlight-esc-hint')?.addEventListener('click', closeSpotlight);

    // --- INITIALIZATION ---

    let hasInitialized = false;
    function init() {
        if (hasInitialized) {
            renderHome();
            return;
        }
        hasInitialized = true;
        renderHome();
        setupNavigation();
        setupPlayerEvents();
        
        let restored = false;
        try {
            const savedRaw = localStorage.getItem('dts_music_state');
            if (savedRaw) {
                const saved = JSON.parse(savedRaw);
                if (Array.isArray(saved.queue) && saved.queue.length) {
                    const mapped = saved.queue.map(id => librarySongsMap.get(id)).filter(Boolean);
                    if (mapped.length) currentQueue = mapped;
                } else {
                    currentQueue = [...librarySongs];
                }

                currentSongIndex = typeof saved.queueIndex === 'number' && saved.queueIndex < currentQueue.length ? saved.queueIndex : 0;
                loadSong(currentSongIndex);

                const elapsed = Math.max(0, (Date.now() - (saved.timestamp || Date.now())) / 1000);
                if (saved.isPlaying && elapsed < 20) {
                    const targetTime = (saved.currentTime || 0) + elapsed;
                    activeAudio.addEventListener('loadedmetadata', () => {
                        activeAudio.currentTime = targetTime;
                        playSong();
                    }, { once: true });
                    if (activeAudio.readyState >= 1) {
                        activeAudio.currentTime = targetTime;
                        playSong();
                    }
                } else if (saved.currentTime) {
                    activeAudio.currentTime = saved.currentTime;
                }
                restored = true;
            }
        } catch (_) {}

        if (!restored) {
            currentQueue = [...librarySongs];
            currentSongIndex = 0;
            loadSong(0);
        }
    }

    // --- NAVIGATION ---
    function setupNavigation() {
        navPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // UI Toggle
                navPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Logic
                const id = pill.id;
                if (id === 'nav-home') {
                    showHome();
                } else if (id === 'nav-favorites') {
                    loadPlaylistView('favorites');
                } else if (id === 'nav-playlists') {
                    // Just scroll to playlist section on home for now
                    showHome();
                    containerPlaylists.scrollIntoView({ behavior: 'smooth' });
                } else if (id === 'nav-search') {
                    openSpotlight();
                    // Deselect the pill so it doesn't look "stuck"
                    pill.classList.remove('active');
                    document.getElementById('nav-home')?.classList.add('active');
                }
            });
        });

        backToHomeBtn.addEventListener('click', () => {
            showHome();
            document.getElementById('nav-home').classList.add('active');
            document.getElementById('nav-favorites').classList.remove('active');
        });
    }

    function showHome() {
        viewHome.style.display = 'block';
        viewPlaylist.style.display = 'none';
    }

    function loadPlaylistView(type) {
        viewHome.style.display = 'none';
        viewPlaylist.style.display = 'block';
        
        try {
            if (type === 'favorites') {
                playlistTitleEl.textContent = "Liked Songs";
                playlistDescEl.textContent = `${currentUser ? currentUser.displayName || 'User' : 'Guest'}'s Favorites • ${userFavorites.length} songs`;
                renderSongTable(userFavorites);
                playlistPlayBtn.onclick = () => {
                    if (userFavorites.length > 0) playContext(userFavorites, 0);
                };
            } else {
                // Default Main
                playlistTitleEl.textContent = "All Available Tracks";
                playlistDescEl.textContent = "Unstoppable Media • Official Library";
                renderSongTable(librarySongs);
                playlistPlayBtn.onclick = () => {
                    playContext(librarySongs, 0);
                };
            }
        } catch (error) {
            console.error("Error loading playlist - Manager info:", error);
            try { playlistTitleEl.textContent = "Error"; } catch (e) {}
            try { playlistDescEl.innerHTML = "Could not load playlist data."; } catch (e) {}
            try { songListBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color: red;">Failed to load playlist. Please try again later.</td></tr>`; } catch (e) {}
            try { playlistPlayBtn.onclick = null; } catch (e) {}
        }
    }

    // --- RENDERING HOME ---
    function renderHome() {
        // 1. Jump Back In
        containerJumpBack.innerHTML = librarySongs.slice(0, 2).map(song => createSongCard(song)).join('');

        
        // Viral Now
        const containerViralNow = document.getElementById('container-viral-now');
        if (containerViralNow) {
            // Re-order library for leaderboard
            let viralSongs = [...librarySongs];
            
            // Move Tate McRae to #1, PIXY to #2, Isabel LaRosa to #3
            const tate = viralSongs.find(s => s.id === 'tate-mcrae-its-okay-im-okay');
            const pixy = viralSongs.find(s => s.id === 'pixy-legacy');
            const isabel = viralSongs.find(s => s.id === 'isabel-larosa-dont-make-them-like-me');
            
            viralSongs = viralSongs.filter(s => s.id !== 'tate-mcrae-its-okay-im-okay' && s.id !== 'pixy-legacy' && s.id !== 'isabel-larosa-dont-make-them-like-me');
            
            if (isabel) viralSongs.unshift(isabel);
            if (pixy) viralSongs.unshift(pixy);
            if (tate) viralSongs.unshift(tate);
            
            // Mock views and trends (#1 Tate: 14.2M up, #2 PIXY: 11.8M up, #3 Isabel: 10.4M up)
            const mockViews = ['14.2M', '11.8M', '10.4M', '9.4M', '6.1M', '3.8M', '1.2M', '800K', '400K'];
            const mockTrends = ['up', 'up', 'up', 'down', 'up', 'down', 'flat', 'down', 'up'];
            
            // Mock per-song extra stats
            const mockPeakRanks = ['#1', '#2', '#3', '#1', '#4', '#5', '#4', '#7', '#6'];
            const mockWeeks     = ['8 wks', '6 wks', '5 wks', '4 wks', '3 wks', '2 wks', '2 wks', '1 wk', '1 wk'];

            const renderLeaderboard = (limit) => {
                containerViralNow.innerHTML = viralSongs.slice(0, limit).map((song, idx) => {
                    const trend = mockTrends[idx] || 'flat';
                    const trendIcon = trend === 'up' ? '▲' : (trend === 'down' ? '▼' : '–');
                    const trendClass = trend === 'up' ? 'trend-up' : (trend === 'down' ? 'trend-down' : 'trend-flat');
                    return `
                        <div class="leaderboard-item" data-viral-idx="${idx}" style="cursor:pointer;">
                            <div class="leaderboard-rank">${idx + 1}</div>
                            <div class="leaderboard-trend ${trendClass}">${trendIcon}</div>
                            <img class="leaderboard-art" src="${song.art}" alt="Art">
                            <div class="leaderboard-info">
                                <div class="leaderboard-title">${escapeHTML(song.title)}</div>
                                <div class="leaderboard-artist">${escapeHTML(song.artist)}</div>
                            </div>
                            <div class="leaderboard-views">${mockViews[idx] || '1M'}</div>
                        </div>
                    `;
                }).join('');

                // Wire up click → stats popup
                containerViralNow.querySelectorAll('.leaderboard-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const idx = parseInt(item.dataset.viralIdx, 10);
                        openViralStats(idx);
                    });
                });
            };

            // ===== Viral Stats Popup =====
            const viralOverlay  = document.getElementById('viral-stats-overlay');
            const viralBg       = document.getElementById('viral-stats-bg');
            const viralArt      = document.getElementById('viral-stats-art');
            const viralRank     = document.getElementById('viral-stats-rank');
            const viralTitle    = document.getElementById('viral-stats-title');
            const viralArtist   = document.getElementById('viral-stats-artist');
            const viralViews    = document.getElementById('vstats-views');
            const viralTrend    = document.getElementById('vstats-trend');
            const viralPeak     = document.getElementById('vstats-peak');
            const viralWeeks    = document.getElementById('vstats-weeks');
            const viralPlayBtn  = document.getElementById('viral-stats-play-btn');
            const viralClose    = document.getElementById('viral-stats-close');

            let viralTargetSongId = null;

            function openViralStats(idx) {
                const song = viralSongs[idx];
                if (!song || !viralOverlay) return;

                viralTargetSongId = song.id;

                // Populate
                viralBg.style.backgroundImage   = `url(${song.art})`;
                viralArt.src                     = song.art;
                viralRank.textContent            = `#${idx + 1}`;
                viralTitle.textContent           = song.title;
                viralArtist.textContent          = song.artist;
                viralViews.textContent           = mockViews[idx] || '1M';
                const trend = mockTrends[idx] || 'flat';
                const trendLabel = trend === 'up' ? '▲ Rising' : (trend === 'down' ? '▼ Falling' : '– Stable');
                viralTrend.textContent           = trendLabel;
                viralTrend.style.color           = trend === 'up' ? '#1db954' : (trend === 'down' ? '#ff4d4d' : '#888');
                viralPeak.textContent            = mockPeakRanks[idx] || '#1';
                viralWeeks.textContent           = mockWeeks[idx] || '1 wk';

                viralOverlay.classList.remove('hidden');
            }

            function closeViralStats() {
                if (viralOverlay) viralOverlay.classList.add('hidden');
                viralTargetSongId = null;
            }

            if (viralClose) viralClose.addEventListener('click', closeViralStats);
            if (viralOverlay) {
                viralOverlay.addEventListener('click', (e) => {
                    if (e.target === viralOverlay) closeViralStats();
                });
            }
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && viralOverlay && !viralOverlay.classList.contains('hidden')) {
                    closeViralStats();
                }
            });
            if (viralPlayBtn) {
                viralPlayBtn.addEventListener('click', () => {
                    if (!viralTargetSongId) return;
                    const songIdx = librarySongs.findIndex(s => s.id === viralTargetSongId);
                    if (songIdx !== -1) {
                        currentQueue = [...librarySongs];
                        currentSongIndex = songIdx;
                        loadSong(songIdx);
                        if (!isPlaying) togglePlayPause();
                    }
                    closeViralStats();
                });
            }

            renderLeaderboard(3); // initially show 3

            const showMoreBtn = document.getElementById('show-more-viral');
            let viralExpanded = false;
            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', () => {
                    viralExpanded = !viralExpanded;
                    renderLeaderboard(viralExpanded ? viralSongs.length : 3);
                    showMoreBtn.textContent = viralExpanded ? 'Show Less' : 'Show More';
                });
            }
        }

        // 2. Recommended
        const recommended = [...librarySongs].sort(() => 0.5 - Math.random());
        containerRecommended.innerHTML = recommended.map(song => createSongCard(song)).join('');
        containerRecommended.insertAdjacentHTML('afterend', '<button id="show-more-recommended" class="show-more-btn">Show More</button>');
        document.getElementById('show-more-recommended').addEventListener('click', (e) => {
            containerRecommended.classList.toggle('expanded');
            e.target.textContent = containerRecommended.classList.contains('expanded') ? 'Show Less' : 'Show More';
        });

        // 3. TikToks — preserve the 4 official blockquotes embedded directly in HTML for embed.js
        if (containerTikToks && containerTikToks.children.length === 0) {
            // Keep container clean if already loaded
        }

        // 4. Playlists
        const playlists = [
            { id: 'main', title: "All Tracks", desc: "Complete Library" },
            { id: 'favorites', title: "Liked Songs", desc: "Your Favorites" }
        ];
        containerPlaylists.innerHTML = playlists.map(pl => `
            <div class="music-card playlist-card" data-playlist-id="${escapeHTML(pl.id)}">
                <div class="card-img-wrapper">
                    <img src="/images/harmony-tunes-card.jpg" alt="${escapeHTML(pl.title)}">
                    <button class="card-play-btn" aria-label="Play ${escapeHTML(pl.title)} playlist">▶</button>
                </div>
                <div class="card-title">${escapeHTML(pl.title)}</div>
                <div class="card-desc">${escapeHTML(pl.desc)}</div>
            </div>
        `).join('');

        // Event delegation for dynamically created cards
        document.addEventListener('click', (e) => {
            const tiktokCard = e.target.closest('.tiktok-card');
            if (tiktokCard) {
                const url = tiktokCard.getAttribute('data-url');
                if (url) window.open(url, '_blank');
                return;
            }

            const playlistCard = e.target.closest('.playlist-card');
            if (playlistCard) {
                const id = playlistCard.getAttribute('data-playlist-id');
                if (id) window.loadPlaylistView(id);
                return;
            }

            const playBtn = e.target.closest('.card-play-btn');
            if (playBtn) {
                e.stopPropagation();
                const card = playBtn.closest('.music-card');
                const songId = card.dataset.songId;
                if (songId) {
                    const song = librarySongsMap.get(songId);
                    if (song) playContext([song], 0);
                }
                return;
            }

            const addQueueBtn = e.target.closest('.add-queue-btn');
            if (addQueueBtn) {
                e.stopPropagation();
                const card = addQueueBtn.closest('.music-card');
                const songId = card.dataset.songId;
                if (songId) {
                    const song = librarySongsMap.get(songId);
                    if (song && typeof window.__addToUserQueue === 'function') {
                        window.__addToUserQueue(song);
                        // Brief success animation
                        const originalText = addQueueBtn.innerHTML;
                        addQueueBtn.innerHTML = '✓';
                        setTimeout(() => addQueueBtn.innerHTML = originalText, 1000);
                    }
                }
                return;
            }

            if (e.target.closest('.card-more-btn')) return;

            const musicCard = e.target.closest('.music-card[data-song-id]');
            if (musicCard) {
                const id = musicCard.getAttribute('data-song-id');
                if (id) window.playSongById(id);
                return;
            }
        });
    }

    window.playSongById = (id) => {
        __recordHistory();
        const songIndex = librarySongs.findIndex(s => s.id === id);
        if (songIndex > -1) playContext(librarySongs, songIndex);
    };
    
    window.loadPlaylistView = loadPlaylistView;

    // --- RENDERING TABLE (Fixed Duration Bug) ---
    function renderSongTable(songs) {
        songListBody.innerHTML = '';
        if (songs.length === 0) {
            songListBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No songs found.</td></tr>`;
            return;
        }

        // ⚡ Bolt: Use DocumentFragment to batch DOM insertions and avoid reflows during loop
        const fragment = document.createDocumentFragment();

        songs.forEach((song, index) => {
            const row = document.createElement('tr');
            
            const isActive = (currentQueue[currentSongIndex]?.id === song.id);
            if (isActive) row.classList.add('playing');

            // REMOVED HEART COLUMN, ADDED DURATION
            row.innerHTML = `
                <td>
                    <span class="song-index" style="${isActive ? 'display:none' : ''}">${escapeHTML(index + 1)}</span>
                    <span class="playing-icon" style="${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">${escapeHTML(song.title)}</td>
                <td>${escapeHTML(song.artist)}</td>
                <td style="text-align: right;">${escapeHTML(song.duration)}</td>
            `;

            row.addEventListener('click', () => {
                playContext(songs, index);
            });

            fragment.appendChild(row);
        });

        songListBody.appendChild(fragment);
    }

    // --- PLAYER LOGIC ---
    function __recordHistory() {
        if (currentSongIndex >= 0 && currentQueue[currentSongIndex]) {
            if(typeof window.__pushToHistory === 'function') {
                window.__pushToHistory(currentQueue[currentSongIndex]);
            }
        }
    }

    function playContext(newQueue, startIndex) {
        __recordHistory();
        currentQueue = [...newQueue];
        if (isShuffle) {
            const first = currentQueue[startIndex];
            const rest = currentQueue.filter((_, i) => i !== startIndex).sort(() => Math.random() - 0.5);
            currentQueue = [first, ...rest];
            currentSongIndex = 0;
        } else {
            currentSongIndex = startIndex;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function loadSong(index) {
        if(index < 0 || index >= currentQueue.length) return;

        currentSongIndex = index;
        const song = currentQueue[currentSongIndex];
        
        activeAudio.removeAttribute('data-no-crossfade');
        isListening = false;
        if(mixerBtn) mixerBtn.classList.remove('analyzing');
        if(typeof fsMixerBtn !== 'undefined' && fsMixerBtn) fsMixerBtn.classList.remove('analyzing');
        const mobMixerBtn = document.getElementById('mob-mixer-btn');
        if(mobMixerBtn) { mobMixerBtn.classList.remove('analyzing'); mobMixerBtn.classList.remove('pulsing'); }

        activeAudio.src = song.src;
        playerTitle.textContent = song.title; checkMarquee(); checkMarquee();
        playerArtist.textContent = song.artist;
        playerArt.src = song.art;
        document.documentElement.style.setProperty('--lyrics-color', songColors[song.id] || '#2d1445');
        
        const paintSpillEffects = document.querySelectorAll('.paint-spill-effect');
        paintSpillEffects.forEach(paintSpillEffect => {
            if (song.id === 'tate-mcrae-its-okay-im-okay') {
                paintSpillEffect.classList.remove('hidden');
                setTimeout(() => paintSpillEffect.classList.add('active'), 50);
            } else {
                paintSpillEffect.classList.remove('active');
                setTimeout(() => paintSpillEffect.classList.add('hidden'), 500);
            }
        });

        // ⚡ Bolt: O(1) Set lookup replaces O(N) Array.some()
        const isFav = userFavoritesIds.has(song.id);
        playerLikeBtn.textContent = isFav ? '♥' : '♡'; if(fsLikeBtn) { fsLikeBtn.innerHTML = isFav ? '&#x2665;&#xFE0E;' : '&#x2661;&#xFE0E;'; fsLikeBtn.classList.toggle('active', isFav); }
        playerLikeBtn.classList.toggle('active', isFav);

        renderLyrics(song.id);

        updateProgress();
        if(viewPlaylist.style.display !== 'none') {
            const showingFavs = playlistTitleEl.textContent === "Liked Songs";
            renderSongTable(showingFavs ? userFavorites : librarySongs);
        }
        
        // Trigger Background Mixxer AI
        if (typeof backgroundMixxerAI === 'function') {
            backgroundMixxerAI();
        }
    }

    
    function checkMarquee() {
        const playerTitle = document.getElementById('player-song-title');
        const titles = [playerTitle, document.getElementById('fs-song-title'), document.getElementById('lyrics-title')];
        titles.forEach(el => {
            if(!el) return;
            el.classList.remove('marquee');
            setTimeout(() => {
                if (el.scrollWidth > el.clientWidth) {
                    el.classList.add('marquee');
                }
            }, 50);
        });
    }

    function saveSitewideMusicState(extra = {}) {
        const currentSong = currentQueue[currentSongIndex] || librarySongs[0];
        try {
            const state = {
                songId: currentSong ? currentSong.id : librarySongs[0].id,
                isPlaying: isPlaying,
                currentTime: activeAudio ? activeAudio.currentTime : 0,
                queue: currentQueue.map(s => s.id),
                queueIndex: currentSongIndex,
                timestamp: Date.now(),
                volume: activeAudio ? activeAudio.volume : 1,
                ...extra
            };
            localStorage.setItem('dts_music_state', JSON.stringify(state));
        } catch (_) {}
    }

    function playSong() {
        if (fadeInterval) clearInterval(fadeInterval);
        if (fadeIntervalCrossfade) clearInterval(fadeIntervalCrossfade);
        if (crossfadeInterval) clearInterval(crossfadeInterval);

        isCrossfading = false;
        mixerBtn.classList.remove('pulsing');
        if (typeof fsMixerBtn !== 'undefined' && fsMixerBtn) fsMixerBtn.classList.remove('pulsing');
        const mobMixerBtn = document.getElementById('mob-mixer-btn');
        if (mobMixerBtn) mobMixerBtn.classList.remove('pulsing');

        nextAudio.pause(); // Ensure next audio is stopped if we cancelled a crossfade

        const targetVol = parseFloat(volumeSlider.value) || 1;

        activeAudio.volume = 0;
        activeAudio.play().then(() => {
            isPlaying = true;
            saveSitewideMusicState({ isPlaying: true });
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            if(fsPlayIcon) fsPlayIcon.style.display = 'none';
            if(fsPauseIcon) fsPauseIcon.style.display = 'block';
            
            const fadeStep = 50;
            const durationMs = 500;
            const steps = durationMs / fadeStep;
            let currentStep = 0;
            
            fadeInterval = setInterval(() => {
                currentStep++;
                activeAudio.volume = targetVol * (currentStep / steps);
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    activeAudio.volume = targetVol;
                }
            }, fadeStep);
        }).catch(e => console.error("Manager info:", e));
    }

    function pauseSong() {
        if (fadeInterval) clearInterval(fadeInterval);
        
        isPlaying = false;
        saveSitewideMusicState({ isPlaying: false });
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        if(fsPlayIcon) fsPlayIcon.style.display = 'block';
        if(fsPauseIcon) fsPauseIcon.style.display = 'none';

        if (isCrossfading) {
            activeAudio.pause();
            nextAudio.pause();
            return;
        }

        const startVol = activeAudio.volume;
        const targetVol = parseFloat(volumeSlider.value) || 1;
        const fadeStep = 50;
        const durationMs = 500;
        const steps = durationMs / fadeStep;
        let currentStep = 0;
        
        fadeInterval = setInterval(() => {
            currentStep++;
            const newVol = startVol * (1 - (currentStep / steps));
            activeAudio.volume = Math.max(0, newVol);
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                activeAudio.pause();
                activeAudio.volume = targetVol;
            }
        }, fadeStep);
    }

    function togglePlayPause() {
        if (activeAudio.paused) playSong();
        else pauseSong();
    }

    function nextSong() {
        if(activeAudio && currentQueue[currentSongIndex]) {
            const currentTime = activeAudio.currentTime;
            const duration = activeAudio.duration;
            const songId = currentQueue[currentSongIndex].id;
            
            if (currentTime < 5) {
                logPlaybackEvent('skip_quick', songId, { skippedAt: currentTime });
            } else if (duration && currentTime < duration * 0.5) {
                logPlaybackEvent('skip_through', songId, { skippedAt: currentTime, percentCompleted: (currentTime / duration) * 100 });
            }
        }

        if(typeof window.__pullFromUserQueue === 'function') {
            const nextUserSong = window.__pullFromUserQueue();
            if(nextUserSong) {
                currentQueue.splice(currentSongIndex + 1, 0, nextUserSong);
                loadSong(currentSongIndex + 1);
                playSong();
                return;
            }
        }

        __recordHistory();
        let nextIndex = currentSongIndex + 1;
        if (nextIndex >= currentQueue.length) {
            if (repeatMode === 1) nextIndex = 0;
            else return;
        }
        currentSongIndex = nextIndex;
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        if (activeAudio.currentTime > 3) {
            activeAudio.currentTime = 0;
        } else {
            __recordHistory();
            let prevIndex = currentSongIndex - 1;
            if (prevIndex < 0) {
                if (repeatMode === 1) prevIndex = currentQueue.length - 1;
                else prevIndex = 0;
            }
            currentSongIndex = prevIndex;
            loadSong(currentSongIndex);
            playSong();
        }
    }

    // --- EVENTS ---
    
    let showCountdown = false;
    const toggleCountdown = () => { showCountdown = !showCountdown; updateProgress(); };
    if(totalTimeEl) totalTimeEl.addEventListener('click', toggleCountdown);
    if(fsTotalTime) fsTotalTime.addEventListener('click', toggleCountdown);

    function setupPlayerEvents() {
        
        const bindEvent = (btn, handler) => {
            if(btn) {
                btn.addEventListener('click', (e) => { e.preventDefault(); handler(); });
                btn.addEventListener('touchstart', (e) => { e.preventDefault(); handler(); }, {passive: false});
            }
        };

        bindEvent(fsPrevBtn, prevSong);
        bindEvent(fsNextBtn, nextSong);
        bindEvent(fsPlayPauseBtn, togglePlayPause);

        // Instead of calling .click(), call the actual handlers directly or dispatch proper Event
        const triggerClick = (targetBtn) => {
            if(targetBtn) targetBtn.dispatchEvent(new Event('click', { bubbles: true }));
        };

        bindEvent(fsMixerBtn, () => triggerClick(mixerBtn));
        bindEvent(fsLyricsBtn, () => { triggerClick(lyricsBtn); closeFullscreen(); });
        // fsViralSkipBtn is handled via pointer events below, so it's not bound to basic click here
        bindEvent(fsLikeBtn, () => triggerClick(playerLikeBtn));
        bindEvent(fsShuffleBtn, () => triggerClick(shuffleBtn));
        bindEvent(fsRepeatBtn, () => triggerClick(repeatBtn));
        
        if(fsProgressBar) {
            fsProgressBar.addEventListener('click', (e) => {
                const width = fsProgressBar.clientWidth;
                const clickX = e.offsetX;
                const duration = activeAudio.duration;
                if(duration) {
                    activeAudio.currentTime = (clickX / width) * duration;
                    const targetTime = (clickX / width) * duration;
                    if(currentQueue[currentSongIndex]) {
                        logPlaybackEvent('scrub_to', currentQueue[currentSongIndex].id, {
                            fromTime: activeAudio.currentTime,
                            toTime: targetTime
                        });
                    }
                }
            });
        }

        playPauseBtn.addEventListener('click', togglePlayPause);
        nextBtn.addEventListener('click', nextSong);
        prevBtn.addEventListener('click', prevSong);
        let lastStateSaveTime = 0;
        [audioPlayer1, audioPlayer2].forEach(player => {
            player.addEventListener('timeupdate', (e) => {
                if (e.target === activeAudio) {
                    updateProgress();
                    if (viralLocked) {
                        checkViralCrossfade();
                    } else {
                        checkCrossfade();
                    }

                    const now = Date.now();
                    if (now - lastStateSaveTime > 1000) {
                        lastStateSaveTime = now;
                        saveSitewideMusicState();
                    }
                }
            });
            player.addEventListener('ended', (e) => {
                if (e.target === activeAudio) {
                    if (isMixerMode && isCrossfading) return;
                    if (repeatMode === 2) {
                        activeAudio.currentTime = 0;
                        playSong();
                    } else {
                        nextSong();
                    }
                }
            });
        });

        window.addEventListener('beforeunload', () => {
            saveSitewideMusicState({ isPlaying: !activeAudio.paused });
        });

        mixerBtn.addEventListener('click', () => {
            isMixerMode = !isMixerMode;
            if(currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                setDoc(userRef, { mixerToggled: isMixerMode }, { merge: true }).catch(e => console.error("Manager info:", e));
            }
            // Sync .active on both main and fullscreen mixer buttons
            mixerBtn.classList.toggle('active', isMixerMode);
            if(fsMixerBtn) fsMixerBtn.classList.toggle('active', isMixerMode);
            const mobMixerBtn = document.getElementById('mob-mixer-btn');
            if(mobMixerBtn) mobMixerBtn.classList.toggle('active', isMixerMode);
        });

        volumeSlider.addEventListener('input', (e) => {
            if (fadeInterval) {
                clearInterval(fadeInterval);
                fadeInterval = null;
            }
            activeAudio.volume = e.target.value;
        });

        progressBar.addEventListener('click', (e) => {
            const width = progressBar.clientWidth;
            const clickX = e.offsetX;
            const duration = activeAudio.duration;
            activeAudio.currentTime = (clickX / width) * duration;
        });

        shuffleBtn.addEventListener('click', () => {
            isShuffle = !isShuffle;
            const color = isShuffle ? 'var(--accent-green)' : '#b3b3b3';
            shuffleBtn.style.color = color;
            if(fsShuffleBtn) fsShuffleBtn.style.color = color;
            const mobShuffleBtn = document.getElementById('mob-shuffle-btn');
            if(mobShuffleBtn) mobShuffleBtn.style.color = color;
        });

        repeatBtn.addEventListener('click', () => {
            repeatMode = (repeatMode + 1) % 3;
            const updateRepeatVisuals = (btn, indicator) => {
                if(!btn) return;
                if (repeatMode === 0) {
                    btn.style.color = '#b3b3b3';
                    if(indicator) indicator.textContent = '';
                } else if (repeatMode === 1) {
                    btn.style.color = 'var(--accent-green)';
                    if(indicator) indicator.textContent = '.';
                } else {
                    btn.style.color = 'var(--accent-green)';
                    if(indicator) indicator.textContent = '1';
                }
            };
            
            updateRepeatVisuals(repeatBtn, repeatBtn.querySelector('.repeat-indicator'));
            if(fsRepeatBtn) updateRepeatVisuals(fsRepeatBtn, document.getElementById('fs-repeat-indicator'));
            const mobRepeatBtn = document.getElementById('mob-repeat-btn');
            if(mobRepeatBtn) updateRepeatVisuals(mobRepeatBtn, null);
        });

        playerLikeBtn.addEventListener('click', () => {
            if(currentQueue[currentSongIndex]) {
                toggleFavorite(currentQueue[currentSongIndex].id);
            }
        });

        // Viral Skip: Double Tap to Loop, Single Tap to Skip
        let viralLastTapTime = 0;
        const toggleViralLock = (forceUnlock = false) => {
            if (viralLocked || forceUnlock) {
                viralLocked = false;
                viralSkipBtn.classList.remove('viral-locked');
                if(fsViralSkipBtn) fsViralSkipBtn.classList.remove('viral-locked');
            } else {
                viralLocked = true;
                viralSkipBtn.classList.add('viral-locked');
                if(fsViralSkipBtn) fsViralSkipBtn.classList.add('viral-locked');
            }
        };
        const handleViralClick = (e) => {
            if(e) e.preventDefault();
            const now = Date.now();
            if (now - viralLastTapTime < 5000 && viralLastTapTime !== 0) {
                // Double tap detected (within 5 seconds)
                toggleViralLock();
                viralLastTapTime = 0; // reset
            } else {
                // Single tap detected
                viralLastTapTime = now;
                const song = currentQueue[currentSongIndex];
                if (song && song.inmixPoint) {
                    activeAudio.currentTime = song.inmixPoint;
                    if (activeAudio.paused) playSong();
                }
            }
        };

        [viralSkipBtn, fsViralSkipBtn].forEach(btn => {
            if (!btn) return;
            btn.addEventListener('click', handleViralClick);
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        });

        lyricsBtn.addEventListener('click', () => {
            const mobLyricsBtn = document.getElementById('mob-lyrics-btn');
            if (viewLyrics.style.display !== 'none' && !viewLyrics.classList.contains('slide-down-active')) {
                viewLyrics.classList.remove('slide-up-active');
                viewLyrics.classList.add('slide-down-active');
                setTimeout(() => {
                    viewLyrics.style.display = 'none';
                    lyricsBtn.style.color = '#b3b3b3';
                    if(fsLyricsBtn) fsLyricsBtn.style.color = '#b3b3b3';
                    if(mobLyricsBtn) mobLyricsBtn.style.color = '#b3b3b3';
                }, 300);
            } else {
                viewLyrics.classList.remove('slide-down-active');
                viewLyrics.classList.add('slide-up-active');
                viewLyrics.style.display = 'flex';
                lyricsBtn.style.color = 'var(--accent-green)';
                if(fsLyricsBtn) fsLyricsBtn.style.color = 'var(--accent-green)';
                if(mobLyricsBtn) mobLyricsBtn.style.color = 'var(--accent-green)';
                setTimeout(() => {
                    const activeLine = lyricsContent.querySelector('.lyric-line.active');
                    if (activeLine && isAutoScrolling) {
                        isProgrammaticScroll = true;
                        lyricsContainer.scrollTo({
                            top: activeLine.offsetTop - lyricsContainer.clientHeight / 2,
                            behavior: 'auto'
                        });
                        setTimeout(() => isProgrammaticScroll = false, 800);
                    }
                }, 50);
            }
        });

        closeLyricsBtn.addEventListener('click', () => {
            viewLyrics.classList.remove('slide-up-active');
            viewLyrics.classList.add('slide-down-active');
            setTimeout(() => {
                viewLyrics.style.display = 'none';
                viewLyrics.classList.remove('slide-down-active');
            }, 400);
        });

        // Fullscreen Player — slide-up open/close
        function openFullscreen() {
            const song = currentQueue[currentSongIndex];
            if(!song) return;
            fsArt.src = song.art;
            fsBg.style.backgroundImage = `url(${song.art})`;
            fsTitle.textContent = song.title;
            fsArtist.textContent = song.artist;
            // Sync state into fullscreen buttons
            if(fsMixerBtn) fsMixerBtn.classList.toggle('active', isMixerMode);
            if(fsShuffleBtn) fsShuffleBtn.classList.toggle('active', isShuffle);
            if(fsViralSkipBtn) fsViralSkipBtn.classList.toggle('viral-locked', viralLocked);
            // Sync progress
            if(fsProgress && activeAudio.duration) {
                fsProgress.style.width = `${(activeAudio.currentTime / activeAudio.duration) * 100}%`;
            }
            // Show with slide-up animation
            fsPlayer.style.display = 'flex';
            // Force reflow so transition fires
            fsPlayer.offsetHeight;
            fsPlayer.classList.remove('fs-hiding');
            fsPlayer.classList.add('fs-visible');

            if (isPlaying) {
                if(fsPlayIcon) fsPlayIcon.style.display = 'none';
                if(fsPauseIcon) fsPauseIcon.style.display = 'block';
            } else {
                if(fsPlayIcon) fsPlayIcon.style.display = 'block';
                if(fsPauseIcon) fsPauseIcon.style.display = 'none';
            }
        }
        function closeFullscreen() {
            fsPlayer.classList.remove('fs-visible');
            fsPlayer.classList.add('fs-hiding');
            setTimeout(() => {
                fsPlayer.style.display = 'none';
                fsPlayer.classList.remove('fs-hiding');
                // Also collapse lyrics side panel
                const fsContent = document.getElementById('fullscreen-content');
                if (fsContent) fsContent.classList.remove('lyrics-open');
                if(fsLyricsBtn) fsLyricsBtn.style.color = '#b3b3b3';
            }, 420);
        }

        playerArt.addEventListener('click', openFullscreen);
        if(playerTitle) playerTitle.addEventListener('click', openFullscreen);
        const songInfoText = document.querySelector('.current-song-details .song-info-text');
        if(songInfoText) songInfoText.style.cursor = 'pointer';
        if(songInfoText) songInfoText.addEventListener('click', (e) => {
            if (!e.target.closest('.like-btn-player')) openFullscreen();
        });
        if(closeFsBtn) closeFsBtn.addEventListener('click', closeFullscreen);
        if(fsPlayPauseBtn) fsPlayPauseBtn.addEventListener('click', togglePlayPause);
        if(fsNextBtn) fsNextBtn.addEventListener('click', nextSong);
        if(fsPrevBtn) fsPrevBtn.addEventListener('click', prevSong);

        // Fullscreen lyrics button → side panel (not the old full-screen lyrics view)
        if (fsLyricsBtn) {
            fsLyricsBtn.addEventListener('click', () => {
                const fsContent = document.getElementById('fullscreen-content');
                const fsSidePanel = document.getElementById('fs-lyrics-side-panel');
                if (!fsContent || !fsSidePanel) return;

                const isOpen = fsContent.classList.toggle('lyrics-open');
                fsLyricsBtn.style.color = isOpen ? 'var(--accent-green)' : '#b3b3b3';

                if (isOpen) {
                    // Mirror the current lyrics content into the side panel
                    const lyricsSource = document.getElementById('lyrics-content');
                    if (lyricsSource) {
                        fsSidePanel.innerHTML = lyricsSource.innerHTML;
                        // Scroll to active line
                        setTimeout(() => {
                            const activeLine = fsSidePanel.querySelector('.lyric-line.active');
                            if (activeLine) {
                                activeLine.scrollIntoView({ block: 'center', behavior: 'smooth' });
                            }
                        }, 380);
                    } else {
                        fsSidePanel.innerHTML = '<p style="color:rgba(255,255,255,0.4);padding:20px;text-align:center;">No lyrics available.</p>';
                    }
                }
            });
        }


        // Artist Profile
        const openArtistProfile = (artistName) => {
            const cleanName = (artistName || '').toLowerCase().trim();
            // Find songs by artist (case-insensitive + alias support for Isabel / Isabella)
            const artistSongs = librarySongs.filter(s => {
                const sArtist = s.artist.toLowerCase();
                return sArtist === cleanName ||
                    (cleanName.includes('larosa') && sArtist.includes('larosa')) ||
                    (cleanName.includes('isabel') && sArtist.includes('isabel'));
            });

            const displayArtistName = artistSongs.length > 0 ? artistSongs[0].artist : artistName;
            document.getElementById('artist-name').textContent = displayArtistName;
            
            const avatarDiv = document.getElementById('artist-avatar');
            if (avatarDiv && artistSongs.length > 0) {
                avatarDiv.style.backgroundImage = `url("${escapeHTML(artistSongs[0].art)}")`;
                avatarDiv.style.backgroundSize = 'cover';
                avatarDiv.style.backgroundPosition = 'center';
            } else if (avatarDiv) {
                avatarDiv.style.backgroundImage = 'none';
            }
            
            if (artistSongs.length > 0) {
                const trackListHTML = artistSongs.map(song => createSongCard(song)).join('');
                document.getElementById('artist-track-list').innerHTML = `<div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));">${trackListHTML}</div>`;
            } else {
                document.getElementById('artist-track-list').innerHTML = `<p style="padding:10px; background:rgba(255,255,255,0.1); border-radius:8px; margin-bottom:5px;">Top hit by ${escapeHTML(displayArtistName)}</p>`;
            }
            
            artistProfile.style.display = 'block';
        };
        window.openArtistProfile = openArtistProfile;
        playerArtist.addEventListener('click', () => {
            if(currentQueue[currentSongIndex]) openArtistProfile(currentQueue[currentSongIndex].artist);
        });
        fsArtist.addEventListener('click', () => {
            fsPlayer.style.display = 'none';
            if(currentQueue[currentSongIndex]) openArtistProfile(currentQueue[currentSongIndex].artist);
        });
        closeArtistBtn.addEventListener('click', () => {
            artistProfile.style.display = 'none';
        });

        // Global Search
        let globalSearchTimeout;
        globalSearch.addEventListener('input', (e) => {
            clearTimeout(globalSearchTimeout);
            globalSearchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                if (viewPlaylist.style.display !== 'none' && playlistTitleEl.textContent === "Liked Songs") {
                    const filtered = userFavorites.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
                    renderSongTable(filtered);
                } else if (viewHome.style.display !== 'none') {
                    const filtered = librarySongs.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
                    renderMusicGrid(filtered);
                }
            }, 300); // ⚡ Bolt: Debounce global search to reduce unnecessary re-renders
        });

        // --- Mobile Overflow ("...") Button ---
        const mobileOverlay = document.getElementById('mobile-controls-overlay');
        const mobileOverflowBtn = document.getElementById('mobile-overflow-btn');
        if (mobileOverflowBtn && mobileOverlay) {
            mobileOverflowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                mobileOverlay.classList.toggle('hidden');
            });
            // Delegate mobile button clicks to desktop counterparts
            document.getElementById('mob-shuffle-btn')?.addEventListener('click', () => { triggerClick(shuffleBtn); mobileOverlay.classList.add('hidden'); });
            document.getElementById('mob-mixer-btn')?.addEventListener('click', () => { triggerClick(mixerBtn); mobileOverlay.classList.add('hidden'); });
            document.getElementById('mob-repeat-btn')?.addEventListener('click', () => { triggerClick(repeatBtn); mobileOverlay.classList.add('hidden'); });
            document.getElementById('mob-lyrics-btn')?.addEventListener('click', () => { triggerClick(lyricsBtn); mobileOverlay.classList.add('hidden'); });
            document.getElementById('mob-queue-btn')?.addEventListener('click', () => { triggerClick(queueBtn); mobileOverlay.classList.add('hidden'); });
            
            // For Viral Skip
            const mobViralBtn = document.getElementById('mob-viral-btn');
            if (mobViralBtn) {
                mobViralBtn.addEventListener('click', (e) => {
                    handleViralClick(e);
                    // Overlay intentionally stays open for double tap
                });
            }

            // Close overlay when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileOverlay.classList.contains('hidden') && !mobileOverlay.contains(e.target) && e.target !== mobileOverflowBtn) {
                    mobileOverlay.classList.add('hidden');
                }
            });
        }
    }

    // --- LYRICS RENDERING ---
    // ⚡ Bolt: Cache DOM elements and timestamps to avoid O(N) queries on every frame
    let cachedLyricsDOM = [];

    function renderLyrics(songId) {
        const data = lyricsData[songId];
        if (!data) {
            lyricsContent.innerHTML = '<p class="lyric-line" style="text-align: center; margin-top: 50px;">No lyrics available.</p>';
            return;
        }
        lyricsContent.innerHTML = data.map((line, lineIndex) => {
            const wordsHtml = line.words.map((word, wordIndex) => {
                return `<span class="lyric-word" data-start="${escapeHTML(word.start)}">${escapeHTML(word.text)}</span>`;
            }).join(' ');
            const trendingClass = line.trending ? ' trending-lyric' : '';
            
            let badgeHtml = '';
            if (line.trending && (!data[lineIndex - 1] || !data[lineIndex - 1].trending)) {
                badgeHtml = `<div style="font-size: 0.8rem; font-weight: bold; color: #00BFFF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>Viral</div>`;
            }
            
            return `${badgeHtml}<div class="lyric-line${trendingClass}" data-start="${escapeHTML(line.start)}" data-end="${escapeHTML(line.end)}">${wordsHtml}</div>`;
        }).join('');
        
        // ⚡ Bolt: Cache DOM queries and parsed floats ahead of time
        const lines = lyricsContent.querySelectorAll('.lyric-line');
        cachedLyricLines = Array.from(lines).map(line => ({
            el: line,
            start: parseFloat(line.getAttribute('data-start')),
            end: parseFloat(line.getAttribute('data-end')),
            words: Array.from(line.querySelectorAll('.lyric-word')).map(word => ({
                el: word,
                start: parseFloat(word.getAttribute('data-start'))
            }))
        }));

        // Seek on click
        cachedLyricLines.forEach(lineData => {
            const line = lineData.el;
            line.addEventListener('click', () => {
                const start = parseFloat(line.getAttribute('data-start'));
                if (!isNaN(start)) {
                    activeAudio.currentTime = start;
                    playSong();
                }
            });
        });

        // Cache DOM and timestamps
        cachedLyricsDOM = Array.from(lines).map(line => {
            const words = Array.from(line.querySelectorAll('.lyric-word')).map(word => ({
                el: word,
                start: parseFloat(word.getAttribute('data-start'))
            }));

            return {
                el: line,
                start: parseFloat(line.getAttribute('data-start')),
                end: parseFloat(line.getAttribute('data-end')),
                words: words
            };
        });
    }

    function handleLyricsScroll() {
        if (isProgrammaticScroll) return;
        isAutoScrolling = false;
        clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(() => {
            isAutoScrolling = true;
            if (activeLineIndex !== -1 && viewLyrics.style.display !== 'none' && cachedLyricsDOM.length > 0) {
                const activeLine = cachedLyricsDOM[activeLineIndex].el;
                if (activeLine) {
                    isProgrammaticScroll = true;
                    lyricsContainer.scrollTo({
                        top: activeLine.offsetTop - lyricsContainer.clientHeight / 2,
                        behavior: 'smooth'
                    });
                    setTimeout(() => isProgrammaticScroll = false, 800);
                }
            }
        }, 3000);
    }

    lyricsContainer.addEventListener('scroll', handleLyricsScroll, { passive: true });

    function syncLyrics() {
        if (viewLyrics.style.display === 'none' || cachedLyricsDOM.length === 0) return;
        const currentTime = activeAudio.currentTime;
        
        // ⚡ Bolt: Track time deltas to distinguish between continuous playback and seeks,
        // replacing O(N) DOM iterations with amortized O(1) state updates per frame.
        if (typeof window._lastSyncTime === 'undefined') window._lastSyncTime = 0;
        const isSeek = Math.abs(currentTime - window._lastSyncTime) > 1; // >1s jump is a seek
        window._lastSyncTime = currentTime;

        let newActiveLineIndex = -1;

        // Amortized O(1) check of current or adjacent lines during normal playback
        if (!isSeek && activeLineIndex !== -1 && cachedLyricsDOM[activeLineIndex]) {
            const currentLine = cachedLyricsDOM[activeLineIndex];
            if (currentTime >= currentLine.start && currentTime <= currentLine.end) {
                newActiveLineIndex = activeLineIndex;
            } else if (currentTime > currentLine.end && activeLineIndex + 1 < cachedLyricsDOM.length) {
                const nextLine = cachedLyricsDOM[activeLineIndex + 1];
                if (currentTime >= nextLine.start && currentTime <= nextLine.end) {
                    newActiveLineIndex = activeLineIndex + 1;
                }
            }
        }

        // Fallback to O(log N) binary search for seeks or if amortized check failed
        if (newActiveLineIndex === -1) {
            let low = 0, high = cachedLyricsDOM.length - 1;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const line = cachedLyricsDOM[mid];
                if (currentTime >= line.start && currentTime <= line.end) {
                    newActiveLineIndex = mid;
                    break;
                } else if (currentTime < line.start) {
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }
        }

        if (isSeek) {
            // On seek, O(N) sweep to fix all stale skipped states
            cachedLyricsDOM.forEach((lineCache, index) => {
                if (index === newActiveLineIndex) {
                    lineCache.el.classList.add('active');
                    lineCache.words.forEach(wordCache => {
                        if (currentTime >= wordCache.start) {
                            wordCache.el.classList.add('active-word');
                        } else {
                            wordCache.el.classList.remove('active-word');
                        }
                    });
                } else {
                    lineCache.el.classList.remove('active');
                    lineCache.words.forEach(wordCache => {
                        if (currentTime > lineCache.end) {
                            wordCache.el.classList.add('active-word');
                        } else {
                            wordCache.el.classList.remove('active-word');
                        }
                    });
                }
            });
        } else {
            // Normal O(1) continuous playback update
            if (activeLineIndex !== -1 && activeLineIndex !== newActiveLineIndex && cachedLyricsDOM[activeLineIndex]) {
                const oldLine = cachedLyricsDOM[activeLineIndex];
                oldLine.el.classList.remove('active');
                oldLine.words.forEach(wordCache => {
                    if (currentTime > oldLine.end) {
                        wordCache.el.classList.add('active-word');
                    } else {
                        wordCache.el.classList.remove('active-word');
                    }
                });
            }
            if (newActiveLineIndex !== -1) {
                const line = cachedLyricsDOM[newActiveLineIndex];
                line.el.classList.add('active');
                line.words.forEach(wordCache => {
                    if (currentTime >= wordCache.start) {
                        wordCache.el.classList.add('active-word');
                    } else {
                        wordCache.el.classList.remove('active-word');
                    }
                });
            }
        }
        
        if (newActiveLineIndex !== -1 && newActiveLineIndex !== activeLineIndex) {
            activeLineIndex = newActiveLineIndex;
            if (isAutoScrolling) {
                const activeLine = cachedLyricsDOM[activeLineIndex].el;
                isProgrammaticScroll = true;
                lyricsContainer.scrollTo({
                    top: activeLine.offsetTop - lyricsContainer.clientHeight / 2,
                    behavior: 'smooth'
                });
                setTimeout(() => isProgrammaticScroll = false, 800);
            }

            // Mirror active line into the fs-lyrics-side-panel if open
            const fsSidePanel = document.getElementById('fs-lyrics-side-panel');
            const fsContent = document.getElementById('fullscreen-content');
            if (fsSidePanel && fsContent && fsContent.classList.contains('lyrics-open')) {
                const sideLines = fsSidePanel.querySelectorAll('.lyric-line');
                sideLines.forEach((el, i) => {
                    el.classList.toggle('active', i === activeLineIndex);
                });
                const sideActiveLine = sideLines[activeLineIndex];
                if (sideActiveLine) {
                    sideActiveLine.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }
        }
    }

    function checkViralCrossfade() {
        if (!viralLocked) return;
        const song = currentQueue[currentSongIndex];
        if (!song) return;
        const block = getViralBlock(song.id, activeAudio);
        if (!block) return;
        
        const remainingToViralEnd = block.paddedEnd - activeAudio.currentTime;

        // If Mixxer is OFF, just do a hard cut exactly at the viral lyrics boundary
        if (!isMixerMode) {
            if (activeAudio.currentTime >= block.blockEnd) {
                activeAudio.currentTime = block.blockStart;
            }
            return;
        }

        // If Mixxer is ON, apply the dynamic crossfade
        const fadeDur = block.actualFadeDur;
        
        if (fadeDur <= 0) {
            // No room to crossfade without bleeding into viral lyrics, fallback to cut
            if (activeAudio.currentTime >= block.paddedEnd) {
                activeAudio.currentTime = block.paddedStart;
            }
            return;
        }

        // "Analyzing" phase (start analyzing 3 seconds before the crossfade)
        if (remainingToViralEnd > fadeDur && remainingToViralEnd <= fadeDur + 3 && !isListening && !isCrossfading) {
            isListening = true;
            mixerBtn.classList.add('analyzing'); if(fsMixerBtn) fsMixerBtn.classList.add('analyzing');
            const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.add('analyzing');
        }

        // "Crossfading" phase
        if (remainingToViralEnd > 0 && remainingToViralEnd <= fadeDur && !isCrossfading) {
            isListening = false;
            mixerBtn.classList.remove('analyzing'); if(fsMixerBtn) fsMixerBtn.classList.remove('analyzing');
            const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.remove('analyzing');
            isCrossfading = true;
            mixerBtn.classList.add('pulsing'); if(fsMixerBtn) fsMixerBtn.classList.add('pulsing');
            if(mobMixerBtn) mobMixerBtn.classList.add('pulsing');
            
            // Swap players for intra-song crossfade
            const prevAudio = activeAudio;
            activeAudio = nextAudio;
            nextAudio = prevAudio;

            // Load the same song into the new active audio
            activeAudio.src = song.src;
            activeAudio.currentTime = block.paddedStart;
            
            activeAudio.volume = 0;
            activeAudio.play().catch(e => console.error("Manager info:", e));

            const fadeMs = fadeDur * 1000;
            const startTime = Date.now();
            const baseVolume = parseFloat(volumeSlider.value) || 1;
            
            if (fadeIntervalCrossfade) clearInterval(fadeIntervalCrossfade);
            fadeIntervalCrossfade = setInterval(() => {
                let elapsed = Date.now() - startTime;
                let ratio = elapsed / fadeMs;
                if (ratio >= 1) ratio = 1;
                
                prevAudio.volume = Math.max(0, baseVolume * (1 - ratio));
                activeAudio.volume = Math.min(baseVolume, baseVolume * ratio);

                if (ratio >= 1) {
                    clearInterval(fadeIntervalCrossfade);
                    prevAudio.pause();
                    prevAudio.currentTime = 0;
                    isCrossfading = false;
                    mixerBtn.classList.remove('pulsing'); if(fsMixerBtn) fsMixerBtn.classList.remove('pulsing');
                    const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.remove('pulsing');
                }
            }, 50);
        }
    }

    function checkCrossfade() {
        if (!isMixerMode) return;
        if (activeAudio.getAttribute('data-no-crossfade') === 'true') return;
        
        const remaining = activeAudio.duration - activeAudio.currentTime;

        if (remaining > 0 && remaining <= 45 && !isListening && !isCrossfading) {
            isListening = true;
            mixerBtn.classList.add('analyzing'); if(fsMixerBtn) fsMixerBtn.classList.add('analyzing');
            const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.add('analyzing');
            
            // If there is no next song and repeat is off, auto-queue the best fit using AI
            if (currentSongIndex + 1 >= currentQueue.length && repeatMode !== 1) {
                if (typeof backgroundMixxerAI === 'function') {
                    backgroundMixxerAI(); // Analyzes and adds the next song
                }
            }
            
            if (repeatMode !== 2 && currentQueue.length > 1) {
                const currentMetadata = librarySongsMap.get(currentQueue[currentSongIndex].id);
                if (currentMetadata) {
                    let bestMatchIndex = currentSongIndex + 1;
                    if (bestMatchIndex >= currentQueue.length) bestMatchIndex = 0;
                    
                    let smallestBpmDiff = Infinity;
                    for (let i = 0; i < currentQueue.length; i++) {
                        if (i === currentSongIndex) continue;
                        const candidate = librarySongsMap.get(currentQueue[i].id);
                        if (candidate) {
                            const diff = Math.abs((candidate.bpm || 120) - currentMetadata.bpm);
                            if (diff < smallestBpmDiff) {
                                smallestBpmDiff = diff;
                                bestMatchIndex = i;
                            }
                        }
                    }
                    
                    if (bestMatchIndex !== (currentSongIndex + 1) % currentQueue.length && !isShuffle) {
                        const temp = currentQueue[(currentSongIndex + 1) % currentQueue.length];
                        currentQueue[(currentSongIndex + 1) % currentQueue.length] = currentQueue[bestMatchIndex];
                        currentQueue[bestMatchIndex] = temp;
                    }
                }
            }
        }

        if (remaining > 0 && remaining <= crossfadeDuration && !isCrossfading) {
            isListening = false;
            mixerBtn.classList.remove('analyzing');
            const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.remove('analyzing');
            isCrossfading = true;
            mixerBtn.classList.add('pulsing'); if(fsMixerBtn) fsMixerBtn.classList.add('pulsing');
            if(mobMixerBtn) mobMixerBtn.classList.add('pulsing');
            
            const prevAudio = activeAudio;
            activeAudio = nextAudio;
            nextAudio = prevAudio;

            let nextIndex = currentSongIndex + 1;
            if (repeatMode === 2) {
                nextIndex = currentSongIndex;
            } else if (nextIndex >= currentQueue.length) {
                if (repeatMode === 1) nextIndex = 0;
                else {
                    // Try one last time if it's still empty!
                    if (typeof backgroundMixxerAI === 'function') {
                        backgroundMixxerAI();
                    }
                    if (currentSongIndex + 1 < currentQueue.length) {
                        nextIndex = currentSongIndex + 1;
                    } else {
                        // Utterly failed to find a song, abort crossfade completely
                        isCrossfading = false;
                        mixerBtn.classList.remove('pulsing');
                        if(fsMixerBtn) fsMixerBtn.classList.remove('pulsing');
                        const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.remove('pulsing');
                        nextAudio = activeAudio;
                        activeAudio = prevAudio;
                        activeAudio.setAttribute('data-no-crossfade', 'true');
                        return; 
                    }
                }
            }
            currentSongIndex = nextIndex;
            
            const song = currentQueue[currentSongIndex];
            const songMetadata = librarySongsMap.get(song.id);
            
            activeAudio.src = song.src;
            const inmixPoint = songMetadata?.inmixPoint || 15;
            activeAudio.currentTime = inmixPoint;
            
            playerTitle.textContent = song.title; checkMarquee(); checkMarquee();
            playerArtist.textContent = song.artist;
            playerArt.src = song.art;
            document.documentElement.style.setProperty('--lyrics-color', songColors[song.id] || '#2d1445');
            
            const isFav = userFavoritesIds.has(song.id);
            playerLikeBtn.textContent = isFav ? '♥' : '♡'; if(fsLikeBtn) { fsLikeBtn.innerHTML = isFav ? '&#x2665;&#xFE0E;' : '&#x2661;&#xFE0E;'; fsLikeBtn.classList.toggle('active', isFav); }
            playerLikeBtn.classList.toggle('active', isFav);

            renderLyrics(song.id);
            if(viewPlaylist.style.display !== 'none') {
                const showingFavs = playlistTitleEl.textContent === "Liked Songs";
                renderSongTable(showingFavs ? userFavorites : librarySongs);
            }

            activeAudio.volume = 0;
            activeAudio.play().catch(e => console.error("Manager info:", e));

            const fadeMs = crossfadeDuration * 1000;
            const startTime = Date.now();
            const baseVolume = parseFloat(volumeSlider.value) || 1;
            
            if (fadeIntervalCrossfade) clearInterval(fadeIntervalCrossfade);
            fadeIntervalCrossfade = setInterval(() => {
                let elapsed = Date.now() - startTime;
                let ratio = elapsed / fadeMs;
                if (ratio >= 1) ratio = 1;
                
                prevAudio.volume = Math.max(0, baseVolume * (1 - ratio));
                activeAudio.volume = Math.min(baseVolume, baseVolume * ratio);

                if (ratio >= 1) {
                    clearInterval(fadeIntervalCrossfade);
                    prevAudio.pause();
                    prevAudio.currentTime = 0;
                    isCrossfading = false;
                    mixerBtn.classList.remove('pulsing');
                    if(typeof fsMixerBtn !== 'undefined' && fsMixerBtn) fsMixerBtn.classList.remove('pulsing');
                    const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.remove('pulsing');
                }
            }, 50);
        }
    }

    // ⚡ Bolt: Throttling high-frequency timeupdate event using requestAnimationFrame
    // to decouple rapid event firing from expensive DOM updates.
    let isUpdatingProgress = false;
    function updateProgress() {
        if (!isUpdatingProgress) {
            window.requestAnimationFrame(() => {
                const { duration, currentTime } = activeAudio;
                if (duration) {
                    const percent = (currentTime / duration) * 100;
                    progress.style.width = `${percent}%`;
            if(fsProgress) fsProgress.style.width = `${percent}%`;
            if(fsCurrentTime) fsCurrentTime.textContent = formatTime(activeAudio.currentTime);
            if(fsTotalTime && activeAudio.duration) fsTotalTime.textContent = showCountdown ? "-" + formatTime(activeAudio.duration - activeAudio.currentTime) : formatTime(activeAudio.duration);

                    currentTimeEl.textContent = formatTime(currentTime);
                    totalTimeEl.textContent = showCountdown ? "-" + formatTime(duration - currentTime) : formatTime(duration);
                }
                syncLyrics();
                
                // Beat reaction for Tate McRae song
                if (currentQueue[currentSongIndex]?.id === 'tate-mcrae-its-okay-im-okay' && !activeAudio.paused) {
                    const beatInterval = 60 / 120; // 120 BPM
                    const currentBeat = Math.floor(currentTime / beatInterval);
                    if (window._lastPaintBeat !== currentBeat) {
                        window._lastPaintBeat = currentBeat;
                        const effects = document.querySelectorAll('.paint-spill-effect');
                        effects.forEach(effect => {
                            const rx = Math.floor(Math.random() * 80) + 10;
                            const ry = Math.floor(Math.random() * 80) + 10;
                            effect.style.background = `radial-gradient(circle at ${rx}% ${ry}%, color-mix(in srgb, var(--theme-color, #1a2b4c) 40%, transparent) 0%, transparent 50%), radial-gradient(circle at ${100-rx}% ${100-ry}%, color-mix(in srgb, var(--theme-color, #1a2b4c) 40%, transparent) 0%, transparent 50%)`;
                            
                            effect.classList.remove('beat');
                            void effect.offsetWidth; // trigger reflow
                            effect.classList.add('beat');
                        });
                    }
                }
                
                isUpdatingProgress = false;
            });
            isUpdatingProgress = true;
        }
    }



    window.toggleFavorite = async function toggleFavorite(songId) {
        if (!currentUser) {
            alert("Please sign in to save favorites.");
            return;
        }

        const song = librarySongsMap.get(songId);
        if (!song) return;
        
        const isFav = userFavoritesIds.has(songId);
        const userRef = doc(db, "users", currentUser.uid);

        try {
            if (isFav) {
                userFavorites = userFavorites.filter(s => s.id !== songId);
                userFavoritesIds.delete(songId);
                await updateDoc(userRef, { musicFavorites: arrayRemove(songId) });
            } else {
                userFavorites.push(song);
                userFavoritesIds.add(songId);
                await updateDoc(userRef, { musicFavorites: arrayUnion(songId) });
            }
        } catch (e) {
            if (e.code === 'not-found') {
                await setDoc(userRef, { musicFavorites: [songId] }, { merge: true });
                if(!isFav) {
                    userFavorites.push(song);
                    userFavoritesIds.add(songId);
                }
            } else {
                console.error("Firebase error - Manager info:", e);
                // Revert state on failure
                if (isFav) {
                    userFavorites.push(song);
                    userFavoritesIds.add(songId);
                } else {
                    userFavorites = userFavorites.filter(s => s.id !== songId);
                    userFavoritesIds.delete(songId);
                }
            }
        }
        
        // Update UI unconditionally based on actual final state
        const finalFav = userFavoritesIds.has(songId);
        const isPlayingFav = (currentQueue[currentSongIndex]?.id === songId);
        if(isPlayingFav && playerLikeBtn) {
            playerLikeBtn.textContent = finalFav ? '♥' : '♡';
            playerLikeBtn.classList.toggle('active', finalFav); if(fsLikeBtn) { fsLikeBtn.innerHTML = finalFav ? '&#x2665;&#xFE0E;' : '&#x2661;&#xFE0E;'; fsLikeBtn.classList.toggle('active', finalFav); }
        }
        if (viewPlaylist.style.display !== 'none' && playlistTitleEl.textContent === "Liked Songs") {
            renderSongTable(userFavorites);
        }
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    if(docSnap.data().mixerToggled !== undefined) {
                        isMixerMode = docSnap.data().mixerToggled;
                        mixerBtn.classList.toggle('active', isMixerMode);
                        if(typeof fsMixerBtn !== 'undefined' && fsMixerBtn) fsMixerBtn.classList.toggle('active', isMixerMode);
                        const mobMixerBtn = document.getElementById('mob-mixer-btn');
                        if(mobMixerBtn) mobMixerBtn.classList.toggle('active', isMixerMode);
                    }
                    if(docSnap.data().musicFavorites) {
                        const favIds = docSnap.data().musicFavorites;
                        // ⚡ Bolt: Convert to Set for O(1) lookup inside loop, improving performance for large library/favorites
                        const favIdsSet = new Set(favIds);
                        userFavorites = librarySongs.filter(song => favIdsSet.has(song.id));
                        favoriteIds = new Set(favIds);
                        userFavoritesIds = new Set(favIds);
                    }
                    if(docSnap.data().musicHistory) {
                        const historyIds = docSnap.data().musicHistory;
                        historyQueue = historyIds.map(id => librarySongsMap.get(id)).filter(s => s);
                        if(typeof renderQueue === 'function') renderQueue();
                    }
                }
            } catch (e) { console.error("Manager info:", e); }
            
            const hour = new Date().getHours();
            const timeGreeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
            document.getElementById('greeting').textContent = `${timeGreeting}, ${user.displayName || 'Friend'}`;
        }
        init();
    });

    // --- WHAT'S NEW MODAL ---
    const whatsNewOverlay = document.getElementById('whats-new-overlay');
    const closeWhatsNewBtn = document.getElementById('close-whats-new-btn');
    const gotItBtn = document.getElementById('got-it-btn');

    const WHAT_NEW_VERSION = 'harmonytunes_whatsnew_v1';
    
    if (whatsNewOverlay && !localStorage.getItem(WHAT_NEW_VERSION)) {
        setTimeout(() => {
            whatsNewOverlay.style.display = 'flex';
        }, 1000);
    }

    function closeWhatsNew() {
        if(whatsNewOverlay) {
            whatsNewOverlay.style.display = 'none';
            localStorage.setItem(WHAT_NEW_VERSION, 'true');
        }
    }

    if(closeWhatsNewBtn) closeWhatsNewBtn.addEventListener('click', closeWhatsNew);
    if(gotItBtn) gotItBtn.addEventListener('click', closeWhatsNew);

    // --- QUEUE & HISTORY STATE & LOGIC ---
    let userQueue = [];
    let historyQueue = [];
    let currentTab = 'upnext';
    let surveyTimeout = null;

    const queuePanel = document.getElementById('queue-panel');
    const queueBtn = document.getElementById('queue-btn');
    const closeQueueBtn = document.getElementById('close-queue-btn');
    const tabUpNext = document.getElementById('tab-up-next');
    const tabHistory = document.getElementById('tab-history');
    const queueContentArea = document.getElementById('queue-content-area');
    
    const mixxerSurvey = document.getElementById('mixxer-survey');
    const surveyUp = document.getElementById('survey-up');
    const surveyDown = document.getElementById('survey-down');

    window.__addToUserQueue = (song) => {
        userQueue.push(song);
        if(queuePanel && queuePanel.classList.contains('open')) renderQueue();
    };

    window.__pullFromUserQueue = () => {
        if(userQueue.length > 0) {
            const song = userQueue.shift();
            if(queuePanel && queuePanel.classList.contains('open')) renderQueue();
            return song;
        }
        return null;
    };

    window.__pushToHistory = (song) => {
        historyQueue.push(song);
        if(historyQueue.length > 50) historyQueue.shift();
        if(queuePanel && queuePanel.classList.contains('open')) renderQueue();
        
        // Push to Firebase
        if(currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            const historyIds = historyQueue.map(s => s.id);
            updateDoc(userRef, { musicHistory: historyIds }).catch(e => {
                if(e.code === 'not-found') {
                    setDoc(userRef, { musicHistory: historyIds }, { merge: true }).catch(e => console.error("Manager info:", e));
                } else {
                    console.error("Firebase history update error - Manager info:", e);
                }
            });
        }
    };

    // --- CONTEXT MENU LOGIC ---
    const contextMenu = document.getElementById('song-context-menu');
    let contextMenuTargetSongId = null;

    document.addEventListener('click', (e) => {
        const moreBtn = e.target.closest('.card-more-btn');
        if (moreBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = moreBtn.closest('.music-card');
            contextMenuTargetSongId = card.dataset.songId;
            
            // Position menu
            const rect = moreBtn.getBoundingClientRect();
            if (contextMenu) {
                contextMenu.style.left = `${Math.min(rect.left, window.innerWidth - 220)}px`;
                contextMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
                contextMenu.classList.remove('hidden');
            }
            return;
        }
        
        // Hide on outside click
        if (contextMenu && !contextMenu.classList.contains('hidden') && !e.target.closest('.song-context-menu')) {
            contextMenu.classList.add('hidden');
        }
    });

    document.getElementById('ctx-play-next')?.addEventListener('click', () => {
        if(contextMenuTargetSongId) {
            const song = librarySongsMap.get(contextMenuTargetSongId);
            if(song) {
                userQueue.unshift(song);
                if(queuePanel && queuePanel.classList.contains('open')) renderQueue();
            }
        }
        if(contextMenu) contextMenu.classList.add('hidden');
    });

    document.getElementById('ctx-play-last')?.addEventListener('click', () => {
        if(contextMenuTargetSongId) {
            const song = librarySongsMap.get(contextMenuTargetSongId);
            if(song) window.__addToUserQueue(song);
        }
        if(contextMenu) contextMenu.classList.add('hidden');
    });

    document.getElementById('ctx-favorite')?.addEventListener('click', () => {
        if(contextMenuTargetSongId) {
            if(typeof window.toggleFavorite === 'function') {
                window.toggleFavorite(contextMenuTargetSongId);
            } else if (typeof toggleFavorite === 'function') {
                toggleFavorite(contextMenuTargetSongId);
            }
        }
        if(contextMenu) contextMenu.classList.add('hidden');
    });

    document.getElementById('ctx-view-artist')?.addEventListener('click', () => {
        if(contextMenuTargetSongId) {
            const song = librarySongsMap.get(contextMenuTargetSongId);
            if(song) {
                if (typeof window.openArtistProfile === 'function') {
                    window.openArtistProfile(song.artist);
                } else if (typeof openArtistProfile === 'function') {
                    openArtistProfile(song.artist);
                }
            }
        }
        if(contextMenu) contextMenu.classList.add('hidden');
    });

    if(homeHistoryBtn) {
        homeHistoryBtn.addEventListener('click', () => {
            if (!queuePanel.classList.contains('open')) {
                if(queueBtn) queueBtn.click();
            }
            const histTab = document.getElementById('tab-history');
            if(histTab) histTab.click();
        });
    }

    if(queueBtn) {
        queueBtn.addEventListener('click', () => {
            if (queuePanel.classList.contains('open')) {
                queuePanel.classList.remove('open');
            } else {
                queuePanel.classList.remove('hidden');
                setTimeout(() => queuePanel.classList.add('open'), 10);
                renderQueue();
            }
        });
    }
    if(closeQueueBtn) {
        closeQueueBtn.addEventListener('click', () => {
            queuePanel.classList.remove('open');
        });
    }
    
    if(tabUpNext) {
        tabUpNext.addEventListener('click', () => {
            currentTab = 'upnext';
            tabUpNext.classList.add('active');
            tabHistory.classList.remove('active');
            renderQueue();
        });
    }
    if(tabHistory) {
        tabHistory.addEventListener('click', () => {
            currentTab = 'history';
            tabHistory.classList.add('active');
            tabUpNext.classList.remove('active');
            renderQueue();
        });
    }

let dragItem = null;
    let dragStartY = 0;
    let dragStartTop = 0;
    let dragTimeout = null;
    let isDragging = false;

    document.addEventListener('pointermove', (e) => {
        if (isDragging && dragItem) {
            const deltaY = e.clientY - dragStartY;
            dragItem.style.transform = `translateY(${deltaY}px)`;

            // Visual Drop Indicator
            const items = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));
            items.forEach(el => { el.style.borderTop = ''; el.style.borderBottom = ''; });

            for (let i = 0; i < items.length; i++) {
                if (items[i] === dragItem) continue;
                const rect = items[i].getBoundingClientRect();
                if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    if (e.clientY < rect.top + rect.height / 2) {
                        items[i].style.borderTop = "2px solid rgba(255,255,255,0.3)";
                    } else {
                        items[i].style.borderBottom = "2px solid rgba(255,255,255,0.3)";
                    }
                    break;
                }
            }
        }
    });

    document.addEventListener('pointerup', (e) => {
        if (dragTimeout) clearTimeout(dragTimeout);
        if (isDragging && dragItem) {
            const itemsNodeList = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));
            const idx = itemsNodeList.indexOf(dragItem);

            isDragging = false;

            dragItem.style.position = '';
            dragItem.style.zIndex = '';
            dragItem.style.transform = '';
            dragItem.classList.remove('dragging');
            queueContentArea.style.cursor = '';

            // Calculate drop index based on position
            const items = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));
            let droppedIdx = idx;
            for (let i = 0; i < items.length; i++) {
                const rect = items[i].getBoundingClientRect();
                if (e.clientY < rect.top + rect.height / 2) {
                    droppedIdx = i;
                    break;
                } else if (i === items.length - 1) {
                    droppedIdx = items.length - 1;
                }
            }

            if (droppedIdx !== idx) {
                const movedSong = userQueue.splice(idx, 1)[0];
                userQueue.splice(droppedIdx, 0, movedSong);
            }
            dragItem = null;
            renderQueue();
        }
    });


    function renderQueue() {
        if(!queueContentArea) return;
        queueContentArea.innerHTML = '';
        
        let displayList = [];
        if (currentTab === 'upnext') {
            displayList = [
                ...userQueue.map(s => ({...s, isUserQueue: true})),
                ...currentQueue.slice(currentSongIndex + 1).map(s => ({...s, isUserQueue: false}))
            ];
        } else {
            displayList = [...historyQueue].reverse(); // Most recent first
        }

        if(displayList.length === 0) {
            queueContentArea.innerHTML = `<p style="text-align: center; color: #b3b3b3; margin-top: 20px;">${currentTab === 'upnext' ? 'Queue is empty' : 'No history yet'}</p>`;
            return;
        }

        // ⚡ Bolt: Use a DocumentFragment to batch DOM insertions for the queue items.
        // This reduces synchronous layout reflows from O(N) to O(1), significantly
        // speeding up render time and preventing main thread blocking, especially for long lists.
        // ⚡ Bolt: Use DocumentFragment to batch DOM insertions and avoid reflows
        const fragment = document.createDocumentFragment();

        displayList.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = 'queue-item';
            
            const isDraggable = currentTab === 'upnext' && song.isUserQueue;
            item.dataset.index = idx; // Maps 1:1 with userQueue index since userQueue is added first
            item.dataset.songId = song.id;
            
            item.innerHTML = `
                <img src="${song.art}" alt="${song.title}">
                <div class="queue-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                ${isDraggable ? '<div class="queue-more-btn" title="Drag to move, click for options">...</div>' : ''}
            `;
            
            if(isDraggable) {
                const moreBtn = item.querySelector('.queue-more-btn');
                
                moreBtn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    isDragging = false;
                    dragItem = item; // Track the clicked item for pointerup handling
                    dragTimeout = setTimeout(() => {
                        isDragging = true;
                        dragStartY = e.clientY;
                        dragStartTop = item.offsetTop;
                        item.style.position = 'relative';
                        item.style.zIndex = '100';
                        item.classList.add('dragging');
                        if(queueContentArea) queueContentArea.style.cursor = 'grabbing';
                    }, 200); // 200ms hold to drag
                });
                
                moreBtn.addEventListener('pointerup', (e) => {
                    if (dragTimeout) clearTimeout(dragTimeout);
                    if (!isDragging) {
                        // It was just a tap/click! Open context menu
                        let contextMenuIdx = idx;
                        const items = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));
                        const currentItemIdx = items.indexOf(item);
                        if (currentItemIdx !== -1) {
                            contextMenuIdx = currentItemIdx;
                        }
                        openQueueContextMenu(e, song.id, contextMenuIdx);
                    }
                    if (!isDragging) {
                        dragItem = null;
                    }
                });
            }

            fragment.appendChild(item);
        });

        queueContentArea.appendChild(fragment);
    }

    // Queue Context Menu
    const queueContextMenu = document.createElement('div');
    queueContextMenu.className = 'song-context-menu hidden glass-panel';
    queueContextMenu.innerHTML = `
        <button class="context-menu-item" id="qctx-play-next">Play Next</button>
        <button class="context-menu-item" id="qctx-play-last">Play Last</button>
        <button class="context-menu-item" id="qctx-favorite">Favorite</button>
        <button class="context-menu-item" id="qctx-suggest-more">Suggest More by Mixxer</button>
        <button class="context-menu-item" id="qctx-suggest-less">Suggest Less</button>
        <button class="context-menu-item" id="qctx-remove" style="color: #ff4444;">Remove from Queue</button>
    `;
    queueContextMenu.style.zIndex = '3100';
    document.body.appendChild(queueContextMenu);
    
    let qctxTargetId = null;
    let qctxTargetIdx = null;

    function openQueueContextMenu(e, songId, idx) {
        e.preventDefault();
        e.stopPropagation();
        qctxTargetId = songId;
        qctxTargetIdx = idx;
        const rect = e.target.getBoundingClientRect();
        queueContextMenu.style.left = `${Math.min(rect.left - 150, window.innerWidth - 220)}px`;
        queueContextMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
        queueContextMenu.classList.remove('hidden');
    }

    document.addEventListener('click', (e) => {
        if (!queueContextMenu.classList.contains('hidden') && !e.target.closest('.song-context-menu') && !e.target.closest('.queue-more-btn')) {
            queueContextMenu.classList.add('hidden');
        }
    });

    document.getElementById('qctx-play-next')?.addEventListener('click', () => {
        if (qctxTargetIdx !== null) {
            const movedSong = userQueue.splice(qctxTargetIdx, 1)[0];
            userQueue.unshift(movedSong);
            renderQueue();
            qctxTargetIdx = 0; // update index in case they click something else
        }
    });

    document.getElementById('qctx-play-last')?.addEventListener('click', () => {
        if (qctxTargetIdx !== null) {
            const movedSong = userQueue.splice(qctxTargetIdx, 1)[0];
            userQueue.push(movedSong);
            renderQueue();
            qctxTargetIdx = userQueue.length - 1; // update index
        }
    });

    document.getElementById('qctx-favorite')?.addEventListener('click', () => {
        if (qctxTargetId && typeof toggleFavorite === 'function') toggleFavorite(qctxTargetId);
    });

    document.getElementById('qctx-remove')?.addEventListener('click', () => {
        if (qctxTargetIdx !== null) {
            userQueue.splice(qctxTargetIdx, 1);
            renderQueue();
        }
        queueContextMenu.classList.add('hidden'); // explicitly hide when removing, since the target no longer exists
    });
    
    document.getElementById('qctx-suggest-more')?.addEventListener('click', () => {
        // Implement suggest more logic if needed
    });
    
    document.getElementById('qctx-suggest-less')?.addEventListener('click', () => {
        // Implement suggest less logic if needed
    });

    window.__triggerSurvey = () => {
        if(!mixxerSurvey) return;
        if(surveyTimeout) clearTimeout(surveyTimeout);
        mixxerSurvey.classList.add('visible');
        surveyTimeout = setTimeout(() => {
            mixxerSurvey.classList.remove('visible');
        }, 15000);
    };
    
    [surveyUp, surveyDown].forEach(btn => {
        if(!btn) return;
        btn.addEventListener('click', () => {
            mixxerSurvey.classList.remove('visible');
            if(surveyTimeout) clearTimeout(surveyTimeout);
        });
    });

    // --- BACKGROUND MIXXER AI ---
    window.backgroundMixxerAI = async function() {
        if (!activeAudio || !currentQueue[currentSongIndex]) return;
        
        // If we have plenty of songs queued, or user manually queued songs, do nothing
        if (currentQueue.length - currentSongIndex > 3 || userQueue.length > 0) return;
        
        const currentSong = currentQueue[currentSongIndex];
        const currentBpm = currentSong.bpm || 120;
        
        // Find songs in the library that match the BPM roughly, aren't recently played, and aren't already in queue
        const historyIds = new Set(historyQueue.map(s => s.id));
        const queueIds = new Set(currentQueue.map(s => s.id));
        
        const candidates = librarySongs.filter(song => {
            if (historyIds.has(song.id) || queueIds.has(song.id)) return false;
            const bpmDiff = Math.abs((song.bpm || 120) - currentBpm);
            return bpmDiff < 15; // Within 15 BPM
        });
        
        if (candidates.length > 0) {
            // Pick a random compatible song
            const nextSuggested = candidates[Math.floor(Math.random() * candidates.length)];
            currentQueue.push(nextSuggested);
            if(queuePanel && !queuePanel.classList.contains('hidden')) renderQueue();
        } else {
            // Fallback: just add a random unplayed song
                        // ⚡ Bolt: Use a generator/loop for fallback to avoid Array.find in a hot path
            let fallback = null;
            for (const s of librarySongs) {
                if (!historyIds.has(s.id) && !queueIds.has(s.id)) {
                    fallback = s;
                    break;
                }
            }
            if (fallback) {
                currentQueue.push(fallback);
                if(queuePanel && !queuePanel.classList.contains('hidden')) renderQueue();
            }
        }
    };
    
    const clearQueueBtn = document.getElementById('clear-queue-btn');
    if (clearQueueBtn) {
        clearQueueBtn.addEventListener('click', () => {
            if (currentTab === 'upnext') {
                userQueue = [];
                renderQueue();
            } else if (currentTab === 'history') {
                historyQueue = [];
                if(currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    updateDoc(userRef, { musicHistory: [] }).catch(e => console.error("Manager info:", e));
                }
                renderQueue();
            }
        });
    }

    // Initialize immediately without waiting for auth resolution
    init();

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHarmonyTunes);
} else {
    initHarmonyTunes();
}

export function createSongCard(song) {
    return `
        <div class="music-card" data-song-id="${escapeHTML(song.id)}">
            <div class="card-img-wrapper">
                <img src="${escapeHTML(song.art)}" alt="${escapeHTML(song.title)}">
                <button class="card-play-btn" aria-label="Play ${escapeHTML(song.title)}">▶</button>
                <button class="add-queue-btn" title="Add to Queue" aria-label="Add ${escapeHTML(song.title)} to queue">+</button>
                <button class="card-more-btn" title="More Options" aria-label="More options for ${escapeHTML(song.title)}">...</button>
            </div>
            <div class="card-title">${escapeHTML(song.title)}</div>
            <div class="card-desc">${escapeHTML(song.artist)}</div>
        </div>
    `;
}

export function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
