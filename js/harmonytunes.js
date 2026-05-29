import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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
            art: "/images/dreams-lobby.jpg",
            bpm: 120, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'deorc-decuple',
            title: "Deorc Decuple", 
            artist: "FormantX", 
            duration: "3:45", 
            src: "/music/ES_Deorc Decuple - FormantX.mp3", 
            art: "/images/harmony-tunes-card.jpg",
            bpm: 118, energy: 0.7, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'no-pole-remix',
            title: "No Pole x Where Have You Been", 
            artist: "Remix", 
            duration: "2:30", 
            src: "/music/No Pole x Where Have You Been (Remix).mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 122, energy: 0.9, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-0',
            title: "Blinding Lights", 
            artist: "The Weeknd", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 108, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-1',
            title: "Shape of You", 
            artist: "Ed Sheeran", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 109, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-2',
            title: "Dance Monkey", 
            artist: "Tones And I", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 116, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-3',
            title: "Someone You Loved", 
            artist: "Lewis Capaldi", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 121, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-4',
            title: "Rockstar", 
            artist: "Post Malone", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 109, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-5',
            title: "Sunflower", 
            artist: "Post Malone", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 136, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-6',
            title: "One Dance", 
            artist: "Drake", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 121, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-7',
            title: "Closer", 
            artist: "The Chainsmokers", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 128, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-8',
            title: "Believer", 
            artist: "Imagine Dragons", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 114, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-9',
            title: "Stay", 
            artist: "The Kid LAROI, Justin Bieber", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 101, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-10',
            title: "Perfect", 
            artist: "Ed Sheeran", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 106, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-11',
            title: "Heat Waves", 
            artist: "Glass Animals", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 109, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-12',
            title: "Señorita", 
            artist: "Shawn Mendes, Camila Cabello", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 115, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-13',
            title: "bad guy", 
            artist: "Billie Eilish", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 113, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-14',
            title: "Say You Won't Let Go", 
            artist: "James Arthur", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 134, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-15',
            title: "Thinking out Loud", 
            artist: "Ed Sheeran", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 123, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-16',
            title: "Lucid Dreams", 
            artist: "Juice WRLD", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 101, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-17',
            title: "Watermelon Sugar", 
            artist: "Harry Styles", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 106, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-18',
            title: "God's Plan", 
            artist: "Drake", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 128, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-19',
            title: "Photograph", 
            artist: "Ed Sheeran", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 114, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-20',
            title: "Something Just Like This", 
            artist: "The Chainsmokers", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 119, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-21',
            title: "Shallow", 
            artist: "Lady Gaga, Bradley Cooper", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 125, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-22',
            title: "Love Yourself", 
            artist: "Justin Bieber", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 100, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-23',
            title: "Bohemian Rhapsody", 
            artist: "Queen", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 100, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-24',
            title: "Take Me To Church", 
            artist: "Hozier", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 135, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-25',
            title: "As It Was", 
            artist: "Harry Styles", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 101, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-26',
            title: "Sweater Weather", 
            artist: "The Neighbourhood", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 115, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-27',
            title: "All of Me", 
            artist: "John Legend", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 106, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-28',
            title: "Counting Stars", 
            artist: "OneRepublic", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 121, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-29',
            title: "THATS WHAT I LIKE", 
            artist: "Bruno Mars", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 125, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-30',
            title: "Levitating", 
            artist: "Dua Lipa", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 109, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-31',
            title: "Peaches", 
            artist: "Justin Bieber", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 118, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-32',
            title: "good 4 u", 
            artist: "Olivia Rodrigo", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 137, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-33',
            title: "drivers license", 
            artist: "Olivia Rodrigo", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 139, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-34',
            title: "Save Your Tears", 
            artist: "The Weeknd", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 130, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-35',
            title: "Starboy", 
            artist: "The Weeknd", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 103, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-36',
            title: "Cruel Summer", 
            artist: "Taylor Swift", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 128, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-37',
            title: "Anti-Hero", 
            artist: "Taylor Swift", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 100, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-38',
            title: "Flowers", 
            artist: "Miley Cyrus", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 115, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-39',
            title: "Kill Bill", 
            artist: "SZA", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 117, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-40',
            title: "Creepin'", 
            artist: "Metro Boomin", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 123, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-41',
            title: "Die For You", 
            artist: "The Weeknd", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 133, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-42',
            title: "Calm Down", 
            artist: "Rema", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 128, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-43',
            title: "I'm Good (Blue)", 
            artist: "David Guetta", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 133, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        },
        { 
            id: 'top-hit-44',
            title: "Unholy", 
            artist: "Sam Smith, Kim Petras", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 103, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['party', 'dance', 'club']
        },
        { 
            id: 'top-hit-45',
            title: "Ella Baila Sola", 
            artist: "Eslabon Armado", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 102, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['dark', 'electronic', 'intense']
        },
        { 
            id: 'top-hit-46',
            title: "La Bebe - Remix", 
            artist: "Yng Lvcas", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 133, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['chill', 'lo-fi', 'relaxed']
        },
        { 
            id: 'top-hit-47',
            title: "vampire", 
            artist: "Olivia Rodrigo", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 139, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['upbeat', 'pop', 'happy']
        },
        { 
            id: 'top-hit-48',
            title: "Paint The Town Red", 
            artist: "Doja Cat", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 109, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['workout', 'high-energy', 'hip-hop']
        },
        { 
            id: 'top-hit-49',
            title: "Water", 
            artist: "Tyla", 
            duration: "3:00", 
            src: "/music/PIXY - LEGACY.mp3", 
            art: "/images/dreams-lobby.jpg",
            bpm: 126, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
            tags: ['acoustic', 'mellow', 'sad']
        }
    ];

    // ⚡ Bolt: Pre-computed Map for O(1) library lookups, avoiding O(N) array search on play clicks
    const librarySongsMap = new Map(librarySongs.map(s => [s.id, s]));

    const songColors = {
        'pixy-legacy': '#19548a',      // Dim Blue
        'deorc-decuple': '#8a196e',    // Dim Pink
        'no-pole-remix': '#2e8a19'     // Dim Green
    };

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
    let isListening = false;
    let crossfadeDuration = 15;
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
    const fsPlayIcon = fsPlayPauseBtn.querySelector('.play-icon');
    const fsPauseIcon = fsPlayPauseBtn.querySelector('.pause-icon');
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


    // Global Search
    const globalSearch = document.getElementById('global-search');

    // --- INITIALIZATION ---
    
    const searchInput = document.getElementById('global-search');
    const searchContainer = document.getElementById('search-container');
    const navSearchBtn = document.getElementById('nav-search');

    if(navSearchBtn) {
        navSearchBtn.addEventListener('click', () => {
            searchContainer.style.display = searchContainer.style.display === 'none' ? 'flex' : 'none';
            if(searchContainer.style.display === 'flex') searchInput.focus();
        });
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.song-card');
            cards.forEach(card => {
                const titleEl = card.querySelector('.song-title');
                const artistEl = card.querySelector('p:last-of-type');
                if(!titleEl || !artistEl) return;
                
                const titleText = titleEl.textContent;
                const artistText = artistEl.textContent;
                const isMatch = titleText.toLowerCase().includes(query) || artistText.toLowerCase().includes(query);
                
                card.style.display = isMatch ? 'flex' : 'none';
                
                if(query && isMatch) {
                    titleEl.innerHTML = titleText.replace(new RegExp(query, 'gi'), match => `<span class="search-highlight">${match}</span>`);
                    artistEl.innerHTML = artistText.replace(new RegExp(query, 'gi'), match => `<span class="search-highlight">${match}</span>`);
                } else {
                    titleEl.textContent = titleText;
                    artistEl.textContent = artistText;
                }
            });
            
            const rows = document.querySelectorAll('.song-table tbody tr');
            rows.forEach(row => {
                const titleEl = row.querySelector('.song-title');
                const artistEl = row.querySelector('.song-artist');
                if(!titleEl || !artistEl) return;
                
                const titleText = titleEl.textContent;
                const artistText = artistEl.textContent;
                const isMatch = titleText.toLowerCase().includes(query) || artistText.toLowerCase().includes(query);
                
                row.style.display = isMatch ? 'table-row' : 'none';
                
                if(query && isMatch) {
                    titleEl.innerHTML = titleText.replace(new RegExp(query, 'gi'), match => `<span class="search-highlight">${match}</span>`);
                    artistEl.innerHTML = artistText.replace(new RegExp(query, 'gi'), match => `<span class="search-highlight">${match}</span>`);
                } else {
                    titleEl.textContent = titleText;
                    artistEl.textContent = artistText;
                }
            });
        });
    }

    function init() {
        renderHome();
        setupNavigation();
        setupPlayerEvents();
        
        // Initialize the queue so the player bar (and favorites) work before pressing play
        currentQueue = [...librarySongs];
        currentSongIndex = 0;
        loadSong(0);
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
                    const searchContainer = document.querySelector('.search-container');
                    searchContainer.classList.toggle('active');
                    if (searchContainer.classList.contains('active')) {
                        globalSearch.focus();
                    }
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
        
        isListening = false;
        if(mixerBtn) mixerBtn.classList.remove('analyzing');

        activeAudio.src = song.src;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        playerArt.src = song.art;
        document.documentElement.style.setProperty('--lyrics-color', songColors[song.id] || '#2d1445');

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
    }

    function playSong() {
        if (fadeInterval) clearInterval(fadeInterval);
        
        const targetVol = parseFloat(volumeSlider.value) || 1;
        
        if (isCrossfading) {
            activeAudio.play().catch(e => console.error(e));
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            fsPlayIcon.style.display = 'none';
            fsPauseIcon.style.display = 'block';
            return;
        }

        activeAudio.volume = 0;
        activeAudio.play().then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            fsPlayIcon.style.display = 'none';
            fsPauseIcon.style.display = 'block';
            
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
        }).catch(e => console.error(e));
    }

    function pauseSong() {
        if (fadeInterval) clearInterval(fadeInterval);
        
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        fsPlayIcon.style.display = 'block';
        fsPauseIcon.style.display = 'none';

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
    
    let showCountdown = false;
    const toggleCountdown = () => { showCountdown = !showCountdown; updateProgress(); };
    if(totalTimeEl) totalTimeEl.addEventListener('click', toggleCountdown);
    if(fsTotalTime) fsTotalTime.addEventListener('click', toggleCountdown);

    function setupPlayerEvents() {
        
        if(fsPrevBtn) fsPrevBtn.addEventListener('click', prevSong);
        if(fsNextBtn) fsNextBtn.addEventListener('click', nextSong);
        if(fsPlayPauseBtn) fsPlayPauseBtn.addEventListener('click', togglePlayPause);
        if(fsMixerBtn) fsMixerBtn.addEventListener('click', () => mixerBtn.click());

        if(fsLyricsBtn) fsLyricsBtn.addEventListener('click', () => { lyricsBtn.click(); closeFullscreen(); });
        if(fsViralSkipBtn) fsViralSkipBtn.addEventListener('click', () => { viralSkipBtn.click(); closeFullscreen(); });
        if(fsLikeBtn) fsLikeBtn.addEventListener('click', () => playerLikeBtn.click());
        if(fsShuffleBtn) fsShuffleBtn.addEventListener('click', () => shuffleBtn.click());
        if(fsRepeatBtn) fsRepeatBtn.addEventListener('click', () => repeatBtn.click());
        
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
            if(currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                setDoc(userRef, { mixerToggled: isMixerMode }, { merge: true }).catch(console.error);
            }

            mixerBtn.classList.toggle('active', isMixerMode);
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
            shuffleBtn.style.color = isShuffle ? 'var(--accent-green)' : '#b3b3b3';
        });

        repeatBtn.addEventListener('click', () => {
            repeatMode = (repeatMode + 1) % 3;
            const indicator = repeatBtn.querySelector('.repeat-indicator'); const fsIndicator = document.getElementById('fs-repeat-indicator');
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

        // Viral Skip
        viralSkipBtn.addEventListener('click', () => {
            const currentSong = currentQueue[currentSongIndex];
            if(!currentSong) return;
            const data = lyricsData[currentSong.id];
            if(data) {
                const trendingLine = data.find(l => l.trending);
                if(trendingLine) {
                    activeAudio.currentTime = trendingLine.start;
                    playSong();
                }
            }
        });

        // Lyrics Events
        lyricsBtn.addEventListener('click', () => {
            if (viewLyrics.style.display !== 'none' && !viewLyrics.classList.contains('slide-down-active')) {
                viewLyrics.classList.remove('slide-up-active');
                viewLyrics.classList.add('slide-down-active');
                setTimeout(() => {
                    viewLyrics.style.display = 'none';
                    viewLyrics.classList.remove('slide-down-active');
                }, 400);
            } else {
                viewLyrics.classList.remove('slide-down-active');
                viewLyrics.classList.add('slide-up-active');
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

        // Fullscreen Player
        playerArt.addEventListener('click', () => {
            const song = currentQueue[currentSongIndex];
            if(!song) return;
            fsArt.src = song.art;
            fsBg.style.backgroundImage = `url(${song.art})`;
            fsTitle.textContent = song.title;
            fsArtist.textContent = song.artist;
            fsPlayer.style.display = 'flex';
            if (isPlaying) {
                fsPlayIcon.style.display = 'none';
                fsPauseIcon.style.display = 'block';
            } else {
                fsPlayIcon.style.display = 'block';
                fsPauseIcon.style.display = 'none';
            }
        });
        closeFsBtn.addEventListener('click', () => {
            fsPlayer.style.display = 'none';
        });
        fsPlayPauseBtn.addEventListener('click', togglePlayPause);
        fsNextBtn.addEventListener('click', nextSong);
        fsPrevBtn.addEventListener('click', prevSong);
        
        // Artist Profile
        const openArtistProfile = (artistName) => {
            document.getElementById('artist-name').textContent = artistName;
            artistProfile.style.display = 'block';
            document.getElementById('artist-track-list').innerHTML = `<p style="padding:10px; background:rgba(255,255,255,0.1); border-radius:8px; margin-bottom:5px;">Top hit by ${artistName}</p>`;
        };
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
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (viewPlaylist.style.display !== 'none' && playlistTitleEl.textContent === "Liked Songs") {
                const filtered = userFavorites.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
                renderSongTable(filtered);
            } else if (viewHome.style.display !== 'none') {
                const filtered = librarySongs.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
                renderMusicGrid(filtered);
            }
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
            const trendingClass = line.trending ? ' trending-lyric' : '';
            
            let badgeHtml = '';
            if (line.trending && (!data[lineIndex - 1] || !data[lineIndex - 1].trending)) {
                badgeHtml = `<div style="font-size: 0.8rem; font-weight: bold; color: #b854f5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>Viral</div>`;
            }
            
            return `${badgeHtml}<div class="lyric-line${trendingClass}" data-start="${line.start}" data-end="${line.end}">${wordsHtml}</div>`;
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
        if (!isMixerMode) return;
        
        const remaining = activeAudio.duration - activeAudio.currentTime;

        if (remaining > 0 && remaining <= 45 && !isListening && !isCrossfading) {
            isListening = true;
            mixerBtn.classList.add('analyzing'); if(fsMixerBtn) fsMixerBtn.classList.add('analyzing');
            
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
            isCrossfading = true;
            mixerBtn.classList.add('pulsing'); if(fsMixerBtn) fsMixerBtn.classList.add('pulsing');
            
            const prevAudio = activeAudio;
            activeAudio = nextAudio;
            nextAudio = prevAudio;

            let nextIndex = currentSongIndex + 1;
            if (repeatMode === 2) {
                nextIndex = currentSongIndex;
            } else if (nextIndex >= currentQueue.length) {
                if (repeatMode === 1) nextIndex = 0;
                else {
                    isCrossfading = false;
                    mixerBtn.classList.remove('pulsing');
                    nextAudio = activeAudio;
                    activeAudio = prevAudio;
                    return; 
                }
            }
            currentSongIndex = nextIndex;
            
            const song = currentQueue[currentSongIndex];
            const songMetadata = librarySongsMap.get(song.id);
            
            activeAudio.src = song.src;
            const inmixPoint = songMetadata?.inmixPoint || 15;
            activeAudio.currentTime = inmixPoint;
            
            playerTitle.textContent = song.title;
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
            activeAudio.play().catch(e => console.error(e));

            const fadeStep = 50;
            const steps = (crossfadeDuration * 1000) / fadeStep;
            let currentStep = 0;
            const baseVolume = parseFloat(volumeSlider.value) || 1;
            
            const fadeIntervalCrossfade = setInterval(() => {
                currentStep++;
                const ratio = currentStep / steps;
                
                prevAudio.volume = Math.max(0, baseVolume * (1 - ratio));
                activeAudio.volume = Math.min(baseVolume, baseVolume * ratio);

                if (currentStep >= steps) {
                    clearInterval(fadeIntervalCrossfade);
                    prevAudio.pause();
                    prevAudio.currentTime = 0;
                    isCrossfading = false;
                    mixerBtn.classList.remove('pulsing');
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
            if(fsProgress) fsProgress.style.width = `${percent}%`;
            if(fsCurrentTime) fsCurrentTime.textContent = formatTime(activeAudio.currentTime);
            if(fsTotalTime && activeAudio.duration) fsTotalTime.textContent = showCountdown ? "-" + formatTime(activeAudio.duration - activeAudio.currentTime) : formatTime(activeAudio.duration);

                    currentTimeEl.textContent = formatTime(currentTime);
                    totalTimeEl.textContent = showCountdown ? "-" + formatTime(duration - currentTime) : formatTime(duration);
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
                console.error("Firebase error:", e);
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
                    }
                    if(docSnap.data().musicFavorites) {
                    const favIds = docSnap.data().musicFavorites;
                    // ⚡ Bolt: Convert to Set for O(1) lookup inside loop, improving performance for large library/favorites
                    const favIdsSet = new Set(favIds);
                    userFavorites = librarySongs.filter(song => favIdsSet.has(song.id));
                    favoriteIds = new Set(favIds);
                    userFavoritesIds = new Set(favIds);
                    }
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
