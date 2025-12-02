import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const audioPlayer = document.getElementById('audio-player');
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
    const songListBody = document.getElementById('song-list-body');
    const playerSongTitle = document.getElementById('player-song-title');
    const playerSongArtist = document.getElementById('player-song-artist');
    const playerAlbumArt = document.getElementById('player-album-art');
    const playlistListItems = document.querySelectorAll('#playlist-list li');
    const headerTitle = document.getElementById('playlist-title');

    // --- DATA ---
    // Only includes songs with actual files uploaded
    const librarySongs = [
        { 
            id: 'deorc-decuple',
            title: "Deorc Decuple", 
            artist: "FormantX", 
            duration: "Unknown", 
            src: "/music/ES_Deorc Decuple - FormantX.mp3", 
            art: "/images/harmony-tunes-card.jpg"
        },
        { 
            id: 'no-pole-remix',
            title: "No Pole x Where Have You Been", 
            artist: "Remix", 
            duration: "Unknown", 
            src: "/music/No Pole x Where Have You Been (Remix).mp3", 
            art: "/images/dreams-lobby.jpg"
        }
    ];

    let userFavorites = [];
    let currentQueue = [...librarySongs]; // Default to main library
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 0; // 0: none, 1: all, 2: one
    let currentUser = null;

    // --- AUTH & FIRESTORE LOGIC ---
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            await loadUserFavorites(user.uid);
        } else {
            userFavorites = []; // Clear favorites if logged out
        }
        // Refresh the list to show/hide hearts or update state
        renderSongList(); 
    });

    async function loadUserFavorites(uid) {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().musicFavorites) {
                // We store IDs in Firestore, so we filter the library
                const favIds = docSnap.data().musicFavorites;
                userFavorites = librarySongs.filter(song => favIds.includes(song.id));
            }
        } catch (e) {
            console.error("Error loading favorites:", e);
        }
    }

    async function toggleFavorite(songId) {
        if (!currentUser) {
            alert("Please sign in to save favorites.");
            return;
        }

        const song = librarySongs.find(s => s.id === songId);
        const isFav = userFavorites.some(s => s.id === songId);
        const userRef = doc(db, "users", currentUser.uid);

        try {
            if (isFav) {
                // Remove locally
                userFavorites = userFavorites.filter(s => s.id !== songId);
                // Remove from Firestore
                await updateDoc(userRef, {
                    musicFavorites: arrayRemove(songId)
                });
            } else {
                // Add locally
                userFavorites.push(song);
                // Add to Firestore
                await updateDoc(userRef, {
                    musicFavorites: arrayUnion(songId)
                });
            }
            renderSongList();
        } catch (e) {
            console.error("Error updating favorite:", e);
            // If the document doesn't exist yet, create it with the favorite
            if (e.code === 'not-found') {
                await setDoc(userRef, { musicFavorites: [songId] }, { merge: true });
                userFavorites.push(song);
                renderSongList();
            }
        }
    }

    // --- UI RENDERING ---
    function renderSongList() {
        songListBody.innerHTML = '';
        
        if (currentQueue.length === 0) {
            songListBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No songs found in this playlist.</td></tr>`;
            return;
        }

        currentQueue.forEach((song, index) => {
            const isFav = userFavorites.some(fav => fav.id === song.id);
            const row = document.createElement('tr');
            row.dataset.index = index;
            
            // Check if this row is currently playing
            const isActive = (audioPlayer.src.endsWith(encodeURI(song.src).split('/').pop()) || audioPlayer.src.includes(song.src));
            if (isActive) row.classList.add('playing');

            row.innerHTML = `
                <td>
                    <span class="song-index" style="${isActive ? 'display:none' : ''}">${index + 1}</span>
                    <span class="playing-icon" style="${isActive ? 'display:inline' : 'display:none'}">▶</span>
                </td>
                <td class="song-title">
                    ${song.title}
                    <button class="fav-btn" style="color: ${isFav ? 'var(--accent-red)' : 'inherit'}; border:none; background:none; cursor:pointer; margin-left:10px;">
                        ${isFav ? '❤' : '♡'}
                    </button>
                </td>
                <td>${song.artist}</td>
                <td>${song.duration}</td>
            `;

            // Attach Favorite Click Event
            row.querySelector('.fav-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row click
                toggleFavorite(song.id);
            });

            songListBody.appendChild(row);
        });
    }

    function switchPlaylist(type) {
        if (type === 'favorites') {
            currentQueue = [...userFavorites];
            headerTitle.textContent = "My Favorites";
        } else {
            currentQueue = [...librarySongs];
            headerTitle.textContent = "Available Tracks";
        }
        currentSongIndex = 0;
        renderSongList();
    }

    // --- PLAYER LOGIC ---
    function loadSong(index) {
        if (index < 0 || index >= currentQueue.length) return;
        
        currentSongIndex = index;
        const song = currentQueue[index];
        
        // Only update source if it's different to prevent reloading
        const currentSrc = audioPlayer.getAttribute('src');
        if (currentSrc !== song.src) {
            audioPlayer.src = song.src;
            audioPlayer.load();
        }

        playerSongTitle.textContent = song.title;
        playerSongArtist.textContent = song.artist;
        playerAlbumArt.src = song.art;
        
        // Update Metadata when loaded
        audioPlayer.onloadedmetadata = () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        };

        renderSongList(); // Update UI active state
    }

    function playSong() {
        if (!audioPlayer.src) loadSong(0);
        audioPlayer.play().then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(e => console.error("Playback error:", e));
    }

    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    function togglePlayPause() {
        if (audioPlayer.paused) playSong();
        else pauseSong();
    }

    function nextSong() {
        let nextIndex = currentSongIndex + 1;
        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * currentQueue.length);
        } else if (nextIndex >= currentQueue.length) {
            nextIndex = 0; // Loop back
        }
        loadSong(nextIndex);
        playSong();
    }

    function prevSong() {
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
        } else {
            let prevIndex = currentSongIndex - 1;
            if (prevIndex < 0) prevIndex = currentQueue.length - 1;
            loadSong(prevIndex);
            playSong();
        }
    }

    // --- UTILS ---
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        if (duration) {
            const percent = (currentTime / duration) * 100;
            progress.style.width = `${percent}%`;
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // --- EVENT LISTENERS ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 2) {
            audioPlayer.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });

    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', (e) => audioPlayer.volume = e.target.value);

    songListBody.addEventListener('click', (e) => {
        // Handle row click (ignoring if fav button was clicked)
        const row = e.target.closest('tr');
        if (row && !e.target.closest('.fav-btn')) {
            loadSong(parseInt(row.dataset.index));
            playSong();
        }
    });

    // Playlist Sidebar Clicking
    playlistListItems.forEach(item => {
        item.addEventListener('click', () => {
            // UI Update
            playlistListItems.forEach(i => i.classList.remove('active-playlist'));
            item.classList.add('active-playlist');
            
            // Logic Update
            switchPlaylist(item.dataset.playlist);
        });
    });

    // Initial Render
    renderSongList();
});