import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { lyricsData } from './lyrics-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const librarySongs = [
        { 
            id: 'pixy-legacy',
            title: "PIXY - LEGACY", 
            artist: "Catalin", 
            duration: "2:17", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg"
        },
        { 
            id: 'deorc-decuple',
            title: "Deorc Decuple", 
            artist: "FormantX", 
            duration: "3:45", 
            src: "/music/ES_Deorc Decuple - FormantX.mp3", 
            art: "/images/harmony-tunes-card.jpg"
        },
        { 
            id: 'no-pole-remix',
            title: "No Pole x Where Have You Been", 
            artist: "Remix", 
            duration: "2:30", 
            src: "/music/No Pole x Where Have You Been (Remix).mp3", 
            art: "/images/dreams-lobby.jpg"
        }
    ];

    // ⚡ Bolt: Pre-computed Map for O(1) library lookups, avoiding O(N) array search on play clicks
    const librarySongsMap = new Map(librarySongs.map(s => [s.id, s]));

    const tiktokData = [
        { title: "Viral Hit #1", img: "/images/UnstoppableHoodieModel300x300.png", url: "https://tiktok.com" },
        { title: "Studio Vibes", img: "/images/harmony-tunes-card.jpg", url: "https://tiktok.com" },
        { title: "New Release Teaser", img: "/images/DreamsTimeSkipModel300x300.jpg", url: "https://tiktok.com" },
        { title: "Behind the Scenes", img: "/images/dreams-lobby.jpg", url: "https://tiktok.com" },
        { title: "Top 10 This Week", img: "/images/un-logo-1.png", url: "https://tiktok.com" }
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
    let crossfadeDuration = 7;
    const mixerBtn = document.getElementById('mixer-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-slider');
    const playerTitle = document.getElementById('player-song-title');
    const playerArtist = document.getElementById('player-song-artist');
    const playerArt = document.getElementById('player-album-art');
    const playerLikeBtn = document.getElementById('player-like-btn');
    
    // Lyrics Elements
    const lyricsBtn = document.getElementById('lyrics-btn');
    const viewLyrics = document.getElementById('view-lyrics');
    const closeLyricsBtn = document.getElementById('close-lyrics-btn');
    const lyricsContent = document.getElementById('lyrics-content');
    const lyricsContainer = document.getElementById('lyrics-container');

    // --- INITIALIZATION ---
    function init() {
        renderHome();
        setupNavigation();
        setupPlayerEvents();
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
                    alert("Search feature coming soon!");
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
            console.error("Error loading playlist:", error);
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

        // 2. Recommended
        const recommended = [...librarySongs].sort(() => 0.5 - Math.random());
        containerRecommended.innerHTML = recommended.map(song => createSongCard(song)).join('');

        // 3. TikToks
        containerTikToks.innerHTML = tiktokData.map(tk => `
            <div class="tiktok-card" data-url="${tk.url}">
                <img src="${tk.img}" alt="${tk.title}">
                <div class="tiktok-overlay">
                    <div class="tiktok-title">${tk.title}</div>
                </div>
            </div>
        `).join('');

        // 4. Playlists
        const playlists = [
            { id: 'main', title: "All Tracks", desc: "Complete Library" },
            { id: 'favorites', title: "Liked Songs", desc: "Your Favorites" }
        ];
        containerPlaylists.innerHTML = playlists.map(pl => `
            <div class="music-card playlist-card" data-playlist-id="${pl.id}">
                <div class="card-img-wrapper">
                    <img src="/images/harmony-tunes-card.jpg" alt="${pl.title}">
                    <button class="card-play-btn">▶</button>
                </div>
                <div class="card-title">${pl.title}</div>
                <div class="card-desc">${pl.desc}</div>
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
                    // ⚡ Bolt: O(1) lookup replaces O(N) librarySongs.find()
                    const song = librarySongsMap.get(songId);
                    if (song) playContext([song], 0);
                }
                return;
            }

            const musicCard = e.target.closest('.music-card[data-song-id]');
            if (musicCard) {
                const id = musicCard.getAttribute('data-song-id');
                if (id) window.playSongById(id);
                return;
            }
        });
    }

    window.playSongById = (id) => {
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
                    <span class="song-index" style="${isActive ? 'display:none' : ''}">${index + 1}</span>
                    <span class="playing-icon" style="${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">${song.title}</td>
                <td>${song.artist}</td>
                <td style="text-align: right;">${song.duration}</td>
            `;

            row.addEventListener('click', () => {
                playContext(songs, index);
            });

            fragment.appendChild(row);
        });

        songListBody.appendChild(fragment);
    }

    // --- PLAYER LOGIC ---
    function playContext(newQueue, startIndex) {
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
        if (index < 0 || index >= currentQueue.length) return;
        const song = currentQueue[index];
        
        activeAudio.src = song.src;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        playerArt.src = song.art;

        // ⚡ Bolt: O(1) Set lookup replaces O(N) Array.some()
        const isFav = userFavoritesIds.has(song.id);
        playerLikeBtn.textContent = isFav ? '❤' : '♡';
        playerLikeBtn.classList.toggle('active', isFav);

        renderLyrics(song.id);

        updateProgress();
        if(viewPlaylist.style.display !== 'none') {
            const showingFavs = playlistTitleEl.textContent === "Liked Songs";
            renderSongTable(showingFavs ? userFavorites : librarySongs);
        }
    }

    function playSong() {
        activeAudio.play().then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(e => console.error(e));
    }

    function pauseSong() {
        activeAudio.pause();
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    function togglePlayPause() {
        if (activeAudio.paused) playSong();
        else pauseSong();
    }

    function nextSong() {
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
    function setupPlayerEvents() {
        playPauseBtn.addEventListener('click', togglePlayPause);
        nextBtn.addEventListener('click', nextSong);
        prevBtn.addEventListener('click', prevSong);
        [audioPlayer1, audioPlayer2].forEach(player => {
            player.addEventListener('timeupdate', (e) => {
                if (e.target === activeAudio) {
                    updateProgress();
                    checkCrossfade();
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

        mixerBtn.addEventListener('click', () => {
            isMixerMode = !isMixerMode;
            mixerBtn.style.color = isMixerMode ? 'var(--accent-green)' : '#ffffff';
        });

        volumeSlider.addEventListener('input', (e) => activeAudio.volume = e.target.value);

        progressBar.parentElement.addEventListener('click', (e) => {
            const width = progressBar.parentElement.clientWidth;
            const clickX = e.offsetX;
            const duration = activeAudio.duration;
            activeAudio.currentTime = (clickX / width) * duration;
        });

        shuffleBtn.addEventListener('click', () => {
            isShuffle = !isShuffle;
            shuffleBtn.style.color = isShuffle ? 'var(--accent-green)' : '#b3b3b3';
        });

        repeatBtn.addEventListener('click', () => {
            repeatMode = (repeatMode + 1) % 3;
            const indicator = repeatBtn.querySelector('.repeat-indicator');
            if (repeatMode === 0) {
                repeatBtn.style.color = '#b3b3b3';
                indicator.textContent = '';
            } else if (repeatMode === 1) {
                repeatBtn.style.color = 'var(--accent-green)';
                indicator.textContent = '.';
            } else {
                repeatBtn.style.color = 'var(--accent-green)';
                indicator.textContent = '1';
            }
        });

        playerLikeBtn.addEventListener('click', () => {
            if(currentQueue[currentSongIndex]) {
                toggleFavorite(currentQueue[currentSongIndex].id);
            }
        });

        // Lyrics Events
        lyricsBtn.addEventListener('click', () => {
            viewLyrics.style.display = 'flex';
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
        });

        closeLyricsBtn.addEventListener('click', () => {
            viewLyrics.style.display = 'none';
        });
    }

    // --- LYRICS RENDERING ---
    function renderLyrics(songId) {
        const data = lyricsData[songId];
        if (!data) {
            lyricsContent.innerHTML = '<p class="lyric-line" style="text-align: center; margin-top: 50px;">No lyrics available.</p>';
            return;
        }
        lyricsContent.innerHTML = data.map((line, lineIndex) => {
            const wordsHtml = line.words.map((word, wordIndex) => {
                return `<span class="lyric-word" data-start="${word.start}">${word.text}</span>`;
            }).join(' ');
            return `<div class="lyric-line" data-start="${line.start}" data-end="${line.end}">${wordsHtml}</div>`;
        }).join('');
        
        // Seek on click
        const lines = lyricsContent.querySelectorAll('.lyric-line');
        lines.forEach(line => {
            line.addEventListener('click', () => {
                const start = parseFloat(line.getAttribute('data-start'));
                if (!isNaN(start)) {
                    activeAudio.currentTime = start;
                    playSong();
                }
            });
        });
    }

    function handleLyricsScroll() {
        if (isProgrammaticScroll) return;
        isAutoScrolling = false;
        clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(() => {
            isAutoScrolling = true;
            if (activeLineIndex !== -1 && viewLyrics.style.display !== 'none') {
                const lines = lyricsContent.querySelectorAll('.lyric-line');
                const activeLine = lines[activeLineIndex];
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
        if (viewLyrics.style.display === 'none') return;
        const currentTime = activeAudio.currentTime;
        const lines = lyricsContent.querySelectorAll('.lyric-line');
        
        let newActiveLineIndex = -1;
        lines.forEach((line, index) => {
            const start = parseFloat(line.getAttribute('data-start'));
            const end = parseFloat(line.getAttribute('data-end'));
            
            // Allow active line to persist slightly if it's the last one sung, 
            // but strict matching is better for beat-by-beat
            if (currentTime >= start && currentTime <= end) {
                newActiveLineIndex = index;
                line.classList.add('active');
                
                const words = line.querySelectorAll('.lyric-word');
                words.forEach(word => {
                    const wStart = parseFloat(word.getAttribute('data-start'));
                    if (currentTime >= wStart) {
                        word.classList.add('active-word');
                    } else {
                        word.classList.remove('active-word');
                    }
                });
            } else {
                line.classList.remove('active');
                // clear word highlights if passed
                const words = line.querySelectorAll('.lyric-word');
                words.forEach(word => {
                    if (currentTime > end) {
                        word.classList.add('active-word');
                    } else {
                        word.classList.remove('active-word');
                    }
                });
            }
        });
        
        if (newActiveLineIndex !== -1 && newActiveLineIndex !== activeLineIndex) {
            activeLineIndex = newActiveLineIndex;
            if (isAutoScrolling) {
                const activeLine = lines[activeLineIndex];
                isProgrammaticScroll = true;
                lyricsContainer.scrollTo({
                    top: activeLine.offsetTop - lyricsContainer.clientHeight / 2,
                    behavior: 'smooth'
                });
                setTimeout(() => isProgrammaticScroll = false, 800);
            }
        }
    }

    function checkCrossfade() {
        if (!isMixerMode || isCrossfading) return;
        
        const remaining = activeAudio.duration - activeAudio.currentTime;
        if (remaining > 0 && remaining <= crossfadeDuration) {
            isCrossfading = true;
            
            const prevAudio = activeAudio;
            activeAudio = nextAudio;
            nextAudio = prevAudio;

            let nextIndex = currentSongIndex + 1;
            if (nextIndex >= currentQueue.length) {
                if (repeatMode === 1) nextIndex = 0;
                else if (repeatMode === 2) nextIndex = currentSongIndex;
                else {
                    isCrossfading = false;
                    nextAudio = activeAudio;
                    activeAudio = prevAudio;
                    return; 
                }
            }
            currentSongIndex = nextIndex;
            
            const song = currentQueue[currentSongIndex];
            activeAudio.src = song.src;
            playerTitle.textContent = song.title;
            playerArtist.textContent = song.artist;
            playerArt.src = song.art;
            
            const isFav = userFavoritesIds.has(song.id);
            playerLikeBtn.textContent = isFav ? '❤' : '♡';
            playerLikeBtn.classList.toggle('active', isFav);

            renderLyrics(song.id);
            if(viewPlaylist.style.display !== 'none') {
                const showingFavs = playlistTitleEl.textContent === "Liked Songs";
                renderSongTable(showingFavs ? userFavorites : librarySongs);
            }

            activeAudio.volume = 0;
            activeAudio.play().catch(e => console.error(e));

            const fadeStep = 50;
            const steps = (crossfadeDuration * 1000) / fadeStep;
            let currentStep = 0;
            const baseVolume = volumeSlider.value || 1;
            
            const fadeInterval = setInterval(() => {
                currentStep++;
                const ratio = currentStep / steps;
                
                prevAudio.volume = Math.max(0, baseVolume * (1 - ratio));
                activeAudio.volume = Math.min(baseVolume, baseVolume * ratio);

                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    prevAudio.pause();
                    prevAudio.currentTime = 0;
                    isCrossfading = false;
                }
            }, fadeStep);
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
                    currentTimeEl.textContent = formatTime(currentTime);
                    totalTimeEl.textContent = formatTime(duration);
                }
                syncLyrics();
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

        // ⚡ Bolt: O(1) lookup replaces O(N) librarySongs.find()
        const song = librarySongsMap.get(songId);
        // ⚡ Bolt: O(1) Set lookup replaces O(N) Array.some()
        const isFav = userFavoritesIds.has(songId);
        const userRef = doc(db, "users", currentUser.uid);

        try {
            if (isFav) {
                favoriteIds.delete(songId);
                userFavorites = userFavorites.filter(s => s.id !== songId);
                userFavoritesIds.delete(songId);
                await updateDoc(userRef, { musicFavorites: arrayRemove(songId) });
            } else {
                favoriteIds.add(songId);
                userFavorites.push(song);
                userFavoritesIds.add(songId);
                await updateDoc(userRef, { musicFavorites: arrayUnion(songId) });
            }
            // Update UI
            const isPlayingFav = (currentQueue[currentSongIndex]?.id === songId);
            if(isPlayingFav) {
                playerLikeBtn.textContent = !isFav ? '❤' : '♡'; // Toggle logic was inverted in var check
                playerLikeBtn.classList.toggle('active', !isFav);
            }
            if (viewPlaylist.style.display !== 'none' && playlistTitleEl.textContent === "Liked Songs") {
                renderSongTable(userFavorites);
            }
        } catch (e) {
            if (e.code === 'not-found') {
                await setDoc(userRef, { musicFavorites: [songId] }, { merge: true });
                favoriteIds.add(songId);
                userFavorites.push(song);
            }
        }
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().musicFavorites) {
                    const favIds = docSnap.data().musicFavorites;
                    // ⚡ Bolt: Convert to Set for O(1) lookup inside loop, improving performance for large library/favorites
                    const favIdsSet = new Set(favIds);
                    userFavorites = librarySongs.filter(song => favIdsSet.has(song.id));
                    favoriteIds = new Set(favIds);
                    userFavoritesIds = new Set(favIds);
                }
            } catch (e) { console.error(e); }
            
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

});

export function createSongCard(song) {
    return `
        <div class="music-card" data-song-id="${song.id}">
            <div class="card-img-wrapper">
                <img src="${song.art}" alt="${song.title}">
                <button class="card-play-btn">▶</button>
            </div>
            <div class="card-title">${song.title}</div>
            <div class="card-desc">${song.artist}</div>
        </div>
    `;
}

export function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
