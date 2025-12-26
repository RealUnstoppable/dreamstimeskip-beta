import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CORE DATA ---
    // Only including files verified to exist
    const librarySongs = [
        { 
            id: 'deorc-decuple',
            title: "Deorc Decuple", 
            artist: "FormantX", 
            duration: "3:45", 
            src: "/music/ES_Deorc Decuple - FormantX.mp3", 
            art: "/images/harmony-tunes-card.jpg",
            themeColor: "#2a1b3d" // Deep purple
        },
        { 
            id: 'no-pole-remix',
            title: "No Pole x Where Have You Been", 
            artist: "Remix", 
            duration: "2:30", 
            src: "/music/No Pole x Where Have You Been (Remix).mp3", 
            art: "/images/dreams-lobby.jpg",
            themeColor: "#1a2f3a" // Deep teal
        }
    ];

    let userFavorites = [];
    let currentQueue = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let currentUser = null;

    // --- 2. DOM ELEMENTS ---
    const viewHome = document.getElementById('view-home');
    const viewPlaylist = document.getElementById('view-playlist');
    const containerMain = document.getElementById('container-main-library');
    const audioPlayer = document.getElementById('audio-player');
    const searchInput = document.getElementById('smart-search');
    
    // Request Modal
    const requestModal = document.getElementById('request-modal');
    const requestForm = document.getElementById('request-form');
    const statusModal = document.getElementById('status-modal');
    const statusList = document.getElementById('status-list');

    // --- 3. INITIALIZATION ---
    function init() {
        renderLibrary(librarySongs);
        setupNavigation();
        setupPlayerEvents();
        setupRequestSystem();
    }

    // --- 4. NAVIGATION & UX ---
    function setupNavigation() {
        document.getElementById('nav-home').onclick = () => showHome();
        
        document.getElementById('nav-library').onclick = () => {
            if(!currentUser) return alert("Please sign in to view your library.");
            loadPlaylistView('favorites');
        };

        // Modal Toggles
        document.getElementById('nav-request-song').onclick = () => {
            if(!currentUser) return alert("Please sign in to request songs.");
            requestModal.style.display = 'flex';
        };

        document.getElementById('nav-check-status').onclick = async () => {
            if(!currentUser) return alert("Please sign in.");
            await fetchUserRequests();
            statusModal.style.display = 'flex';
        };

        document.getElementById('close-request-modal').onclick = () => requestModal.style.display = 'none';
        document.getElementById('close-status-modal').onclick = () => statusModal.style.display = 'none';

        document.getElementById('back-to-home').onclick = showHome;

        // Smart Search (Local Filtering)
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = librarySongs.filter(s => 
                s.title.toLowerCase().includes(term) || 
                s.artist.toLowerCase().includes(term)
            );
            renderLibrary(filtered);
        });
    }

    function showHome() {
        viewHome.style.display = 'block';
        viewPlaylist.style.display = 'none';
        document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
        document.getElementById('nav-home').classList.add('active');
    }

    // --- 5. LIBRARY RENDERING ---
    function renderLibrary(songs) {
        if (songs.length === 0) {
            containerMain.innerHTML = `<p style="color:#666; width:100%;">No tracks found matching your vibe.</p>`;
            return;
        }
        containerMain.innerHTML = songs.map(song => `
            <div class="music-card" onclick="window.playSongById('${song.id}')">
                <div class="card-img-wrapper">
                    <img src="${song.art}" alt="${song.title}" loading="lazy">
                    <button class="card-play-btn">▶</button>
                </div>
                <div class="card-title">${song.title}</div>
                <div class="card-desc">${song.artist}</div>
            </div>
        `).join('');
    }

    window.playSongById = (id) => {
        const index = librarySongs.findIndex(s => s.id === id);
        if (index > -1) playContext(librarySongs, index);
    };

    function loadPlaylistView(type) {
        viewHome.style.display = 'none';
        viewPlaylist.style.display = 'block';
        
        const titleEl = document.getElementById('playlist-title');
        const listBody = document.getElementById('song-list-body');
        
        if (type === 'favorites') {
            titleEl.textContent = "Liked Songs";
            renderTable(userFavorites, listBody);
        }
    }

    function renderTable(songs, container) {
        container.innerHTML = '';
        if(songs.length === 0) {
            container.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No songs yet. Go discover!</td></tr>`;
            return;
        }
        songs.forEach((song, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i+1}</td>
                <td style="color: white; font-weight:500;">${song.title}</td>
                <td>${song.artist}</td>
                <td style="text-align:right;">${song.duration}</td>
            `;
            tr.onclick = () => playContext(songs, i);
            container.appendChild(tr);
        });
    }

    // --- 6. PLAYER LOGIC & DYNAMICS ---
    function playContext(queue, index) {
        currentQueue = [...queue];
        currentSongIndex = index;
        loadSong(currentQueue[currentSongIndex]);
        audioPlayer.play();
        isPlaying = true;
        updatePlayerUI(true);
    }

    function loadSong(song) {
        audioPlayer.src = song.src;
        document.getElementById('player-song-title').textContent = song.title;
        document.getElementById('player-song-artist').textContent = song.artist;
        document.getElementById('player-album-art').src = song.art;
        
        // Dynamic Visuals: Change background based on song theme
        document.documentElement.style.setProperty('--dynamic-bg', song.themeColor || '#121212');
        
        // Like State
        const isFav = userFavorites.some(s => s.id === song.id);
        const likeBtn = document.getElementById('player-like-btn');
        likeBtn.textContent = isFav ? '❤' : '♡';
        likeBtn.style.color = isFav ? 'var(--accent-green)' : '#b3b3b3';
    }

    function updatePlayerUI(playing) {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        if (playing) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    function setupPlayerEvents() {
        const playBtn = document.getElementById('play-pause-btn');
        playBtn.onclick = () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                updatePlayerUI(true);
            } else {
                audioPlayer.pause();
                updatePlayerUI(false);
            }
        };

        document.getElementById('next-btn').onclick = () => {
            currentSongIndex = (currentSongIndex + 1) % currentQueue.length;
            loadSong(currentQueue[currentSongIndex]);
            audioPlayer.play();
        };

        document.getElementById('prev-btn').onclick = () => {
            if(audioPlayer.currentTime > 3) audioPlayer.currentTime = 0;
            else {
                currentSongIndex = (currentSongIndex - 1 + currentQueue.length) % currentQueue.length;
                loadSong(currentQueue[currentSongIndex]);
                audioPlayer.play();
            }
        };

        audioPlayer.addEventListener('timeupdate', () => {
            const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            document.querySelector('.progress').style.width = `${pct}%`;
        });
        
        // Like Button
        document.getElementById('player-like-btn').onclick = async () => {
            if(!currentUser) return alert("Sign in to like songs.");
            const song = currentQueue[currentSongIndex];
            if(!song) return;
            
            const isFav = userFavorites.some(s => s.id === song.id);
            const userRef = doc(db, "users", currentUser.uid);

            if(isFav) {
                userFavorites = userFavorites.filter(s => s.id !== song.id);
                await updateDoc(userRef, { musicFavorites: arrayRemove(song.id) });
            } else {
                userFavorites.push(song);
                await updateDoc(userRef, { musicFavorites: arrayUnion(song.id) });
            }
            loadSong(song); // Refresh UI
        };
    }

    // --- 7. REQUEST SYSTEM (NEW) ---
    function setupRequestSystem() {
        requestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('req-title').value;
            const artist = document.getElementById('req-artist').value;
            const btn = requestForm.querySelector('.btn-submit');

            btn.textContent = "Sending...";
            btn.disabled = true;

            try {
                // 1. Add to global Admin queue
                await addDoc(collection(db, "song_requests"), {
                    title: title,
                    artist: artist,
                    userId: currentUser.uid,
                    userEmail: currentUser.email,
                    status: 'pending', // pending, approved, declined
                    timestamp: Timestamp.now()
                });

                // 2. Track in user profile for quick access
                const requestSummary = {
                    title, artist, status: 'pending', date: new Date().toISOString()
                };
                
                // Using arrayUnion for simple tracking (optional, depends on structure preference)
                // Actually, querying the 'song_requests' collection by userId is safer/cheaper for updates
                
                alert("Request sent! Check status in 'Track Requests'.");
                requestModal.style.display = 'none';
                requestForm.reset();
            } catch (err) {
                console.error(err);
                alert("Error sending request.");
            } finally {
                btn.textContent = "Send Request";
                btn.disabled = false;
            }
        });
    }

    async function fetchUserRequests() {
        statusList.innerHTML = '<p>Loading...</p>';
        const q = query(
            collection(db, "song_requests"), 
            where("userId", "==", currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        statusList.innerHTML = '';
        
        if(snapshot.empty) {
            statusList.innerHTML = '<p>No requests sent yet.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            let badgeClass = 'st-pending';
            if(data.status === 'approved') badgeClass = 'st-approved';
            if(data.status === 'declined') badgeClass = 'st-declined';

            const div = document.createElement('div');
            div.className = 'status-item';
            div.innerHTML = `
                <div class="status-info">
                    <h4>${data.title}</h4>
                    <p>${data.artist}</p>
                </div>
                <div class="status-badge ${badgeClass}">${data.status}</div>
            `;
            statusList.appendChild(div);
        });
    }

    // --- 8. AUTH ---
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            // Fetch Favorites
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().musicFavorites) {
                const favIds = userDoc.data().musicFavorites;
                userFavorites = librarySongs.filter(s => favIds.includes(s.id));
            }
            document.getElementById('greeting').textContent = `Welcome back, ${user.displayName || 'Creator'}`;
        }
        init();
    });
});