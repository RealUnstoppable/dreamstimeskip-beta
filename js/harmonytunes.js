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
    const playlistHeaderArt = document.querySelector('.playlist-header .album-art');


    const newPlaylistBtn = document.getElementById('new-playlist-btn');
    const sharePlaylistBtn = document.getElementById('share-playlist-btn');


    // --- STATE MANAGEMENT ---
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 0; // 0: no repeat, 1: repeat playlist, 2: repeat song
    let currentSongIndex = 0;
    let originalPlaylist = [];
    let playlists = {
        "Minecraft - Volume Alpha": [
            // Using the provided MP3 for all songs as a placeholder
            { title: "Key", artist: "C418", duration: "1:05", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Subwoofer Lullaby", artist: "C418", duration: "3:28", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Living Mice", artist: "C418", duration: "2:57", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Haggstrom", artist: "C418", duration: "3:24", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Minecraft", artist: "C418", duration: "4:14", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Mice on Venus", artist: "C418", duration: "4:41", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Dry Hands", artist: "C418", duration: "1:08", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Wet Hands", artist: "C418", duration: "1:30", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Clark", artist: "C418", duration: "3:11", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
            { title: "Sweden", artist: "C418", duration: "3:35", src: "No Pole x Where Have You Been (Remix).mp3", art: "dreams-lobby.jpg"},
        ],
        "My Favorites": []
    };
    let currentPlaylist = playlists["Minecraft - Volume Alpha"];

    // --- FUNCTIONS ---
    function loadPlaylist(playlist) {
        songListBody.innerHTML = '';
        if (!playlist || playlist.length === 0) {
            // Handle empty playlist case
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align:center;">This playlist is empty.</td>`;
            songListBody.appendChild(row);
            return;
        }
        playlist.forEach((song, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;
            row.innerHTML = `
                <td><span class="song-index">${index + 1}</span><span class="playing-icon" style="display:none;">▶</span></td>
                <td class="song-title">${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.duration}</td>
            `;
            songListBody.appendChild(row);
            // Inside the playlist.forEach loop...
row.innerHTML = `
    <td><span class="song-index">${index + 1}</span><span class="playing-icon" style="display:none;">▶</span></td>
    <td class="song-title">
        ${song.title}
        <button class="fav-btn" onclick="event.stopPropagation(); addToFavorites(${index})">❤</button>
    </td>
    <td>${song.artist}</td>
    <td>${song.duration}</td>
`;
        });
    }

    function loadSong(index) {
        if (index < 0 || index >= currentPlaylist.length) {
            return; // Invalid index
        }
        currentSongIndex = index;
        const song = currentPlaylist[index];
        audioPlayer.src = song.src;
        playerSongTitle.textContent = song.title;
        playerSongArtist.textContent = song.artist;
        if(song.art) {
            playerAlbumArt.src = song.art;
            playlistHeaderArt.src = song.art;
        }

        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';

        updatePlayingUI();
    }
    
    function updatePlayingUI() {
        document.querySelectorAll('.song-table tbody tr').forEach(row => {
            row.classList.remove('playing');
            row.querySelector('.song-index').style.display = 'block';
            row.querySelector('.playing-icon').style.display = 'none';
        });

        const currentRow = document.querySelector(`.song-table tbody tr[data-index="${currentSongIndex}"]`);
        if (currentRow) {
            currentRow.classList.add('playing');
             currentRow.querySelector('.song-index').style.display = 'none';
            currentRow.querySelector('.playing-icon').style.display = 'block';
        }
    }


    function playSong() {
        if (currentPlaylist.length === 0) return;
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
        if (!audioPlayer.src && currentPlaylist.length > 0) {
             loadSong(0);
        }
        isPlaying ? pauseSong() : playSong();
    }

    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= currentPlaylist.length) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
        } else {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = currentPlaylist.length - 1;
            }
            loadSong(currentSongIndex);
            playSong();
        }
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);

        if (isShuffle) {
            // Save the original order and currently playing song
            const currentSong = currentPlaylist[currentSongIndex];
            originalPlaylist = [...currentPlaylist];

            // Shuffle the playlist
            let shuffled = currentPlaylist.filter(song => song !== currentSong);
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            // Put the current song at the beginning
            currentPlaylist = [currentSong, ...shuffled];
            currentSongIndex = 0; // Reset index to the current song
        } else {
            // Restore the original order
            const currentSong = currentPlaylist[currentSongIndex];
            currentPlaylist = [...originalPlaylist];
            currentSongIndex = currentPlaylist.findIndex(song => song.src === currentSong.src && song.title === currentSong.title);
        }
        // Reload the playlist view to reflect the new order
        loadPlaylist(currentPlaylist);
        updatePlayingUI(); // Re-highlight the current song
    }


    function toggleRepeat() {
        repeatMode = (repeatMode + 1) % 3;
        repeatBtn.classList.toggle('active', repeatMode !== 0);
        
        const repeatIcon = repeatBtn.querySelector('svg');
        let repeatIndicator = repeatBtn.querySelector('.repeat-indicator');

        if (!repeatIndicator) {
            repeatIndicator = document.createElement('span');
            repeatIndicator.className = 'repeat-indicator';
            repeatBtn.appendChild(repeatIndicator);
        }

        if (repeatMode === 2) {
            repeatIndicator.textContent = '1';
        } else {
            repeatIndicator.textContent = '';
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
        } else if (repeatMode === 1) { // Repeat playlist
             nextSong();
        } else { // No repeat
            if (currentSongIndex === currentPlaylist.length - 1) {
                // If it's the last song, pause.
                pauseSong();
            } else {
                nextSong();
            }
        }
    }


    // --- EVENT LISTENERS ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleSongEnd);

    progressBar.addEventListener('click', setProgress);

    volumeSlider.addEventListener('input', (e) => audioPlayer.volume = e.target.value);

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    songListBody.addEventListener('click', (e) => {
        const songRow = e.target.closest('tr');
        if (songRow && songRow.dataset.index) {
            const index = parseInt(songRow.dataset.index);
            loadSong(index);
            playSong();
        }
    });

    sharePlaylistBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Playlist link copied to clipboard!');
        });
    });

    newPlaylistBtn.addEventListener('click', () => {
        const playlistName = prompt("Enter new playlist name:");
        if (playlistName && !playlists[playlistName]) {
            playlists[playlistName] = [];
            alert(`Playlist "${playlistName}" created!`);
            // You would then update the sidebar UI here to show the new playlist
        } else if (playlistName) {
            alert("A playlist with that name already exists.");
        }
    });


    // --- INITIALIZE ---
    loadPlaylist(currentPlaylist);
    window.addToFavorites = (index) => {
    const song = currentPlaylist[index];
    const favorites = playlists["My Favorites"];

    // Check if already in favorites to avoid duplicates
    if (!favorites.some(f => f.title === song.title)) {
        favorites.push(song);
        alert(`Added "${song.title}" to Favorites!`);
    } else {
        alert("Song is already in your favorites.");
    }
};
});