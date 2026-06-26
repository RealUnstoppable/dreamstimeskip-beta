import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
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
            id: 'kesha-blow',
            title: "Blow", 
            artist: "Kesha", 
            duration: "3:40", 
            src: "/music/Blow - Kesha.mp3", 
            art: "/images/harmony-tunes-card.jpg",
            bpm: 120, energy: 0.9, inmixPoint: 15, outmixPoint: 15,
            tags: ['pop', 'party', 'electronic']
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

    const tiktokEmbeds = [
        `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@harmonytunesofficial/video/7361214658742652206" data-video-id="7361214658742652206" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@harmonytunesofficial" href="https://www.tiktok.com/@harmonytunesofficial?refer=embed">@harmonytunesofficial</a> if you read this u have to follow <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="viral" target="_blank" href="https://www.tiktok.com/tag/viral?refer=embed">#viral</a> <a title="music" target="_blank" href="https://www.tiktok.com/tag/music?refer=embed">#music</a> <a target="_blank" title="♬ Silence 1 Minute - silence moments" href="https://www.tiktok.com/music/Silence-1-Minute-6736021306824738817?refer=embed">♬ Silence 1 Minute - silence moments</a> </section> </blockquote>`,
        `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@harmonytunesofficial/video/7286740931238317342" data-video-id="7286740931238317342" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@harmonytunesofficial" href="https://www.tiktok.com/@harmonytunesofficial?refer=embed">@harmonytunesofficial</a> New songs every week! Follow us for the latest popular hits, delivered straight to your feed. We&#39;re the best place to discover new music and stay ahead of the trends. Plus, we&#39;re always up for a good time, so expect plenty of fun videos. <a title="liltay" target="_blank" href="https://www.tiktok.com/tag/liltay?refer=embed">#liltay</a> <a title="edit" target="_blank" href="https://www.tiktok.com/tag/edit?refer=embed">#edit</a> <a title="sucker4green" target="_blank" href="https://www.tiktok.com/tag/sucker4green?refer=embed">#sucker4green</a> <a title="fypシ" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7?refer=embed">#fypシ</a> <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a target="_blank" title="♬ SUCKER 4 GREEN (MONEY) - LIL TAY" href="https://www.tiktok.com/music/SUCKER-4-GREEN-MONEY-7284095435357095938?refer=embed">♬ SUCKER 4 GREEN (MONEY) - LIL TAY</a> </section> </blockquote>`,
        `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@harmonytunesofficial/video/7340749763630894378" data-video-id="7340749763630894378" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@harmonytunesofficial" href="https://www.tiktok.com/@harmonytunesofficial?refer=embed">@harmonytunesofficial</a> Exes - Tate McRae - HarmonyTunes Follow Us on Socials and join our Discord Community ;) <a title="fypシ" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7?refer=embed">#fypシ</a> <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="fyppage" target="_blank" href="https://www.tiktok.com/tag/fyppage?refer=embed">#fyppage</a> <a title="viral" target="_blank" href="https://www.tiktok.com/tag/viral?refer=embed">#viral</a> <a title="soundtok" target="_blank" href="https://www.tiktok.com/tag/soundtok?refer=embed">#soundtok</a> <a title="sound" target="_blank" href="https://www.tiktok.com/tag/sound?refer=embed">#sound</a> <a title="music" target="_blank" href="https://www.tiktok.com/tag/music?refer=embed">#music</a> <a title="musictok" target="_blank" href="https://www.tiktok.com/tag/musictok?refer=embed">#musictok</a> <a title="viraltiktok" target="_blank" href="https://www.tiktok.com/tag/viraltiktok?refer=embed">#viraltiktok</a> <a target="_blank" title="♬ original sound - preppy - miaaxess" href="https://www.tiktok.com/music/original-sound-preppy-7247743262663641857?refer=embed">♬ original sound - preppy - miaaxess</a> </section> </blockquote>`,
        `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@harmonytunesofficial/video/7339769870399081770" data-video-id="7339769870399081770" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@harmonytunesofficial" href="https://www.tiktok.com/@harmonytunesofficial?refer=embed">@harmonytunesofficial</a> @Dan!k On Spotify! Follow us for more music each week, and join our discord community in the profile description. <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="fypシ" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7?refer=embed">#fypシ</a> <a title="fyppage" target="_blank" href="https://www.tiktok.com/tag/fyppage?refer=embed">#fyppage</a> <a title="soundtok" target="_blank" href="https://www.tiktok.com/tag/soundtok?refer=embed">#soundtok</a> <a title="musictok" target="_blank" href="https://www.tiktok.com/tag/musictok?refer=embed">#musictok</a> <a target="_blank" title="♬ Dream. - Dan!k" href="https://www.tiktok.com/music/Dream-7322348789938128898?refer=embed">♬ Dream. - Dan!k</a> </section> </blockquote>`,
        `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@harmonytunesofficial/video/7343010577624747306" data-video-id="7343010577624747306" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@harmonytunesofficial" href="https://www.tiktok.com/@harmonytunesofficial?refer=embed">@harmonytunesofficial</a> If this video gets 100 likes we will start uploading daily. If you have a song you want us to do next leave a comment. <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="fypage" target="_blank" href="https://www.tiktok.com/tag/fypage?refer=embed">#fypage</a> <a title="music" target="_blank" href="https://www.tiktok.com/tag/music?refer=embed">#music</a> <a title="viral" target="_blank" href="https://www.tiktok.com/tag/viral?refer=embed">#viral</a> <a title="fypシ" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7?refer=embed">#fypシ</a> <a title="soundtok" target="_blank" href="https://www.tiktok.com/tag/soundtok?refer=embed">#soundtok</a> <a title="viraltiktok" target="_blank" href="https://www.tiktok.com/tag/viraltiktok?refer=embed">#viraltiktok</a> <a target="_blank" title="♬ original sound - HarmonyTunes" href="https://www.tiktok.com/music/original-sound-7343010650165087018?refer=embed">♬ original sound - HarmonyTunes</a> </section> </blockquote>`
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
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
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
            }, 300); // ⚡ Bolt: Debounce search input to prevent layout thrashing
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
        containerRecommended.insertAdjacentHTML('afterend', '<button id="show-more-recommended" class="show-more-btn">Show More</button>');
        document.getElementById('show-more-recommended').addEventListener('click', (e) => {
            containerRecommended.classList.toggle('expanded');
            e.target.textContent = containerRecommended.classList.contains('expanded') ? 'Show Less' : 'Show More';
        });

        // 3. TikToks
        containerTikToks.innerHTML = tiktokEmbeds.map(embed => `
            <div class="tiktok-card">
                ${embed}
            </div>
        `).join('');
        
        // Dynamically load TikTok script to render the embeds properly
        const tiktokScript = document.createElement('script');
        tiktokScript.src = "https://www.tiktok.com/embed.js";
        tiktokScript.async = true;
        document.body.appendChild(tiktokScript);

        // 4. Playlists
        const playlists = [
            { id: 'main', title: "All Tracks", desc: "Complete Library" },
            { id: 'favorites', title: "Liked Songs", desc: "Your Favorites" }
        ];
        containerPlaylists.innerHTML = playlists.map(pl => `
            <div class="music-card playlist-card" data-playlist-id="${escapeHTML(pl.id)}">
                <div class="card-img-wrapper">
                    <img src="/images/harmony-tunes-card.jpg" alt="${escapeHTML(pl.title)}">
                    <button class="card-play-btn">▶</button>
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

    function playSong() {
        if (fadeInterval) clearInterval(fadeInterval);
        
        const targetVol = parseFloat(volumeSlider.value) || 1;
        
        if (isCrossfading) {
            nextAudio.play().then(() => {
                const fadeStep = 50;
                const steps = (fadeDur * 1000) / fadeStep;
                let currentStep = 0;
                
                crossfadeInterval = setInterval(() => {
                    currentStep++;
                    if (currentStep >= steps) {
                        clearInterval(crossfadeInterval);
                        activeAudio.pause();
                        activeAudio.currentTime = 0;
                        activeAudio.volume = targetVol;
                        nextAudio.volume = targetVol;
                        isCrossfading = false;
                        if(window.__triggerSurvey) window.__triggerSurvey();
                    } else {
                        activeAudio.volume = Math.max(0, targetVol * (1 - currentStep/steps));
                        nextAudio.volume = Math.min(targetVol, targetVol * (currentStep/steps));
                    }
                }, fadeStep);
            }).catch(e => {
                console.error("Crossfade play failed:", e);
                isCrossfading = false;
            });
            return;
        }

        activeAudio.volume = 0;
        activeAudio.play().then(() => {
            isPlaying = true;
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
        }).catch(e => console.error(e));
    }

    function pauseSong() {
        if (fadeInterval) clearInterval(fadeInterval);
        
        isPlaying = false;
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
        [audioPlayer1, audioPlayer2].forEach(player => {
            player.addEventListener('timeupdate', (e) => {
                if (e.target === activeAudio) {
                    updateProgress();
                    if (viralLocked) {
                        checkViralCrossfade();
                    } else {
                        checkCrossfade();
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

        mixerBtn.addEventListener('click', () => {
            isMixerMode = !isMixerMode;
            if(currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                setDoc(userRef, { mixerToggled: isMixerMode }, { merge: true }).catch(console.error);
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

        // Fullscreen Player
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
            fsPlayer.style.display = 'flex';
            if (isPlaying) {
                if(fsPlayIcon) fsPlayIcon.style.display = 'none';
                if(fsPauseIcon) fsPauseIcon.style.display = 'block';
            } else {
                if(fsPlayIcon) fsPlayIcon.style.display = 'block';
                if(fsPauseIcon) fsPauseIcon.style.display = 'none';
            }
        }
        function closeFullscreen() {
            fsPlayer.style.display = 'none';
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
            activeAudio.play().catch(e => console.error(e));

            const fadeMs = fadeDur * 1000;
            const startTime = Date.now();
            const baseVolume = parseFloat(volumeSlider.value) || 1;
            
            const fadeIntervalCrossfade = setInterval(() => {
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
            activeAudio.play().catch(e => console.error(e));

            const fadeMs = crossfadeDuration * 1000;
            const startTime = Date.now();
            const baseVolume = parseFloat(volumeSlider.value) || 1;
            
            const fadeIntervalCrossfade = setInterval(() => {
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
                    setDoc(userRef, { musicHistory: historyIds }, { merge: true }).catch(console.error);
                } else {
                    console.error("Firebase history update error:", e);
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

    // Extracted global pointermove listener to prevent memory leaks and layout thrashing issues
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

        const fragment = document.createDocumentFragment();

        displayList.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = 'queue-item';
            
            const isDraggable = currentTab === 'upnext' && song.isUserQueue;
            item.dataset.index = idx;
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
                    dragTimeout = setTimeout(() => {
                        isDragging = true;
                        dragItem = item;
                        dragStartY = e.clientY;
                        dragStartTop = item.offsetTop;
                        item.style.position = 'relative';
                        item.style.zIndex = '100';
                        item.classList.add('dragging');
                        queueContentArea.style.cursor = 'grabbing';
                    }, 200); // 200ms hold to drag
                });
                
                moreBtn.addEventListener('pointerup', (e) => {
                    if (dragTimeout) clearTimeout(dragTimeout);
                    if (isDragging && dragItem === item) {
                        isDragging = false;
                        dragItem = null;
                        item.style.position = '';
                        item.style.zIndex = '';
                        item.style.transform = '';
                        item.classList.remove('dragging');
                        queueContentArea.style.cursor = '';
                        
                        // Calculate drop index based on position
                        const items = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));

                        // Use indexOf instead of stale closure variable 'idx'
                        let currentItemIdx = items.indexOf(item);
                        if (currentItemIdx === -1) currentItemIdx = idx;

                        let droppedIdx = currentItemIdx;
                        for (let i = 0; i < items.length; i++) {
                            const rect = items[i].getBoundingClientRect();
                            if (e.clientY < rect.top + rect.height / 2) {
                                droppedIdx = i;
                                break;
                            } else if (i === items.length - 1) {
                                droppedIdx = items.length - 1;
                            }
                        }
                        
                        if (droppedIdx !== currentItemIdx) {
                            const movedSong = userQueue.splice(currentItemIdx, 1)[0];
                            userQueue.splice(droppedIdx, 0, movedSong);
                        }
                        renderQueue();
                    } else if (!isDragging) {
                        // It was just a tap/click! Open context menu
                        let contextMenuIdx = idx;
                        const items = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));
                        const currentItemIdx = items.indexOf(item);
                        if (currentItemIdx !== -1) {
                            contextMenuIdx = currentItemIdx;
                        }
                        openQueueContextMenu(e, song.id, contextMenuIdx);
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

});

export function createSongCard(song) {
    return `
        <div class="music-card" data-song-id="${escapeHTML(song.id)}">
            <div class="card-img-wrapper">
                <img src="${escapeHTML(song.art)}" alt="${escapeHTML(song.title)}">
                <button class="card-play-btn">▶</button>
                <button class="add-queue-btn" title="Add to Queue">+</button>
                <button class="card-more-btn" title="More Options">...</button>
            </div>
            <div class="card-title">${escapeHTML(song.title)}</div>
            <div class="card-desc">${escapeHTML(song.artist)}</div>
        </div>
    `;
}
}

export function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

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
            console.log("Mixxer AI: Seamlessly injected", nextSuggested.title, "to match", currentSong.title);
            if(queuePanel && !queuePanel.classList.contains('hidden')) renderQueue();
        } else {
            // Fallback: just add a random unplayed song
            const fallback = librarySongs.find(s => !historyIds.has(s.id) && !queueIds.has(s.id));
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
                    updateDoc(userRef, { musicHistory: [] }).catch(console.error);
                }
                renderQueue();
            }
        });
    }
