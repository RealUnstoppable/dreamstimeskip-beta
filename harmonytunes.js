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
    
    const newPlaylistBtn = document.getElementById('new-playlist-btn');
    const sharePlaylistBtn = document.getElementById('share-playlist-btn');


    // --- STATE MANAGEMENT ---
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 0; // 0: no repeat, 1: repeat playlist, 2: repeat song
    let currentSongIndex = 0;
    let playlists = {
        "Minecraft - Volume Alpha": [
             // Simulating fetching from YouTube
            { title: "Key", artist: "C418", duration: "1:05", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Subwoofer Lullaby", artist: "C418", duration: "3:28", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Living Mice", artist: "C418", duration: "2:57", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Haggstrom", artist: "C418", duration: "3:24", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Minecraft", artist: "C418", duration: "4:14", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Mice on Venus", artist: "C418", duration: "4:41", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Dry Hands", artist: "C418", duration: "1:08", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Wet Hands", artist: "C418", duration: "1:30", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Clark", artist: "C418", duration: "3:11", src: "No Pole x Where Have You Been (Remix).mp3"},
            { title: "Sweden", artist: "C418", duration: "3:35", src: "No Pole x Where Have You Been (Remix).mp3"},
        ],
        "My Favorites": []
    };
    let currentPlaylist = playlists["Minecraft - Volume Alpha"];

    // --- FUNCTIONS ---
    function loadPlaylist(playlist) {
        songListBody.innerHTML = '';
        playlist.forEach((song, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="song-title">${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.duration}</td>
            `;
            songListBody.appendChild(row);
        });
    }

    function loadSong(index) {
        currentSongIndex = index;
        const song = currentPlaylist[index];
        audioPlayer.src = song.src;
        playerSongTitle.textContent = song.title;
        playerSongArtist.textContent = song.artist;
        // Reset progress bar for new song
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        
        // Highlight current song in list
        document.querySelectorAll('.song-table tbody tr').forEach(row => {
            row.classList.remove('playing');
        });
        document.querySelector(`.song-table tbody tr[data-index="${index}"]`).classList.add('playing');
    }

    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }

    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    function togglePlayPause() {
        if (!audioPlayer.src) {
             loadSong(0);
        }
        isPlaying ? pauseSong() : playSong();
    }
    
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= currentPlaylist.length) {
            currentSongIndex = 0; // Loop back to the start
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        // If song has played for more than 3 seconds, restart it. Otherwise, go to prev.
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
        } else {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = currentPlaylist.length - 1; // Go to end of list
            }
            loadSong(currentSongIndex);
            playSong();
        }
    }


    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        if (duration) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    }
    
    function handleSongEnd() {
        if(repeatMode === 2){ // Repeat song
            audioPlayer.currentTime = 0;
            playSong();
        } else {
            nextSong();
            // If repeat playlist is off and we're at the end, stop playback.
            if(repeatMode === 0 && currentSongIndex === 0) {
                 pauseSong();
            }
        }
    }


    // --- EVENT LISTENERS ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleSongEnd);

    progressBar.addEventListener('click', setProgress);
    
    volumeSlider.addEventListener('input', (e) => audioPlayer.volume = e.target.value);

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    repeatBtn.addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;
        repeatBtn.style.color = repeatMode !== 0 ? 'var(--accent-green)' : '#b3b3b3';
        repeatBtn.innerHTML = repeatMode === 2 ? '<svg>...</svg><span>1</span>' : '<svg>...</svg>'; // Add indicator for repeat one
    });
    
    songListBody.addEventListener('click', (e) => {
        const songRow = e.target.closest('tr');
        if (songRow) {
            const index = parseInt(songRow.dataset.index);
            loadSong(index);
            playSong();
        }
    });

    sharePlaylistBtn.addEventListener('click', () => {
        const dummyUrl = 'https://example.com/playlist/minecraft-alpha';
        navigator.clipboard.writeText(dummyUrl).then(() => {
            alert('Playlist link copied to clipboard!');
        });
    });

    newPlaylistBtn.addEventListener('click', () => {
        const playlistName = prompt("Enter new playlist name:");
        if (playlistName && !playlists[playlistName]) {
            playlists[playlistName] = [];
            alert(`Playlist "${playlistName}" created!`);
            // You would then update the sidebar UI here
        } else if (playlistName) {
            alert("A playlist with that name already exists.");
        }
    });


    // --- INITIALIZE ---
    loadPlaylist(currentPlaylist);
});