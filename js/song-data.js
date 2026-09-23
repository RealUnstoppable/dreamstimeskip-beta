// js/song-data.js
// Centralized song library data for HarmonyTunes and sitewide background playback

export const librarySongs = [
    {
        id: 'summer-bummer',
        title: "Summer Bummer (Lights On)",
        artist: "Rhy Rhy",
        duration: "4:20",
        src: "/music/summer bummer (lights on).mp3",
        art: "/images/summer_bummer_rhy_rhy.jpg",
        bpm: 100, energy: 0.6, inmixPoint: 10, outmixPoint: 10,
        tags: ['pop', 'viral']
    },
    {
        id: 'on-the-floor',
        title: "On The Floor",
        artist: "Jennifer Lopez ft. Pitbull",
        duration: "3:50",
        src: "/music/on_the_floor.mp3",
        art: "/images/on_the_floor.jpg",
        bpm: 130, energy: 0.9, inmixPoint: 10, outmixPoint: 10,
        tags: ['pop', 'viral']
    },
    {
        id: 'radiance-harp',
        title: "Radiance",
        artist: "Santan Dave",
        duration: "3:40",
        src: "/music/radiance_the_boy_who_played_the_harp.mp3",
        art: "/images/radiance_the_boy_who_played_the_harp.jpg",
        bpm: 90, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ['rap', 'viral']
    },
    {
        id: 'rockstar',
        title: "rockstar",
        artist: "21 Savage",
        duration: "3:38",
        src: "/music/rockstar.mp3",
        art: "/images/rockstar.jpg",
        bpm: 90, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ['rap', 'viral']
    },
    {
        id: 'dead-fresh',
        title: "Dead Fresh",
        artist: "Lil Baby",
        duration: "3:00",
        src: "/music/dead_fresh.mp3",
        art: "/images/dead_fresh.jpg",
        bpm: 120, energy: 0.8, inmixPoint: 10, outmixPoint: 10,
        tags: ['rap', 'viral']
    },
    {
        id: 'isabel-larosa-dont-make-them-like-me',
        title: "dont make them like me",
        artist: "Isabel LaRosa",
        duration: "2:05",
        src: "/music/dont_make_em_like_me.mp3",
        art: "/images/isabel_larosa_cover.jpg",
        bpm: 110, energy: 0.8, inmixPoint: 10, outmixPoint: 10,
        tags: ['pop', 'viral']
    },
    {
        id: 'tate-mcrae-its-okay-im-okay',
        title: "It's ok I'm ok",
        artist: "Tate McRae",
        duration: "3:02",
        src: "/music/tate_mcrae_its_okay_im_okay.mp3",
        art: "/images/tate_mcrae_cover_v2.png",
        bpm: 120, energy: 0.8, inmixPoint: 15, outmixPoint: 29,
        tags: ['pop', 'upbeat']
    },
    {
        id: 'astrophage',
        title: "Astrophage",
        artist: "Lupus Nocte",
        duration: "3:10",
        src: "/music/Astrophage.mp3",
        art: "/images/astrophage_cover.jpg",
        bpm: 125, energy: 0.9, inmixPoint: 15, outmixPoint: 15,
        tags: ['electronic', 'synth', 'energetic']
    },
    { 
        id: 'pixy-legacy',
        title: "PIXY - LEGACY", 
        artist: "Catalin", 
        duration: "2:17", 
        src: "/music/PIXY - LEGACY.mp3", 
        art: "/images/legacy_cover.jpg",
        bpm: 120, energy: 0.8, inmixPoint: 15, outmixPoint: 15,
        tags: ['dark', 'electronic', 'intense']
    },
    { 
        id: 'kesha-blow',
        title: "Blow", 
        artist: "Kesha", 
        duration: "3:40", 
        src: "/music/Blow - Kesha.mp3", 
        art: "/images/blow_cover.jpg",
        bpm: 120, energy: 0.9, inmixPoint: 15, outmixPoint: 15,
        tags: ['pop', 'party', 'electronic']
    },
    { 
        id: 'deorc-decuple',
        title: "Deorc Decuple", 
        artist: "FormantX", 
        duration: "3:45", 
        src: "/music/ES_Deorc Decuple - FormantX.mp3", 
        art: "/images/deorc_cover.jpg",
        bpm: 118, energy: 0.7, inmixPoint: 15, outmixPoint: 15,
        tags: ['chill', 'lo-fi', 'relaxed']
    },
    { 
        id: 'no-pole-remix',
        title: "No Pole x Where Have You Been", 
        artist: "Remix", 
        duration: "2:30", 
        src: "/music/No Pole x Where Have You Been (Remix).mp3", 
        art: "/images/nopole_cover.jpg",
        bpm: 122, energy: 0.9, inmixPoint: 15, outmixPoint: 15,
        tags: ['upbeat', 'pop', 'happy']
    },
    { 
        id: 'isabel-larosa-dont-make-them-like-me',
        title: "Don't Make Them Like Me", 
        artist: "Isabel LaRosa", 
        duration: "3:43", 
        src: "/music/isabel_larosa_dont_make_them_like_me.mp3", 
        art: "/images/isabel_larosa_cover.jpg",
        bpm: 116, energy: 0.85, inmixPoint: 12, outmixPoint: 22,
        tags: ['pop', 'dark pop', 'viral', 'trending']
    },
];

export const songColors = {
    'pixy-legacy': '#5c4a3d',
    'deorc-decuple': '#1d3036',
    'no-pole-remix': '#a11f8b',
    'tate-mcrae-its-okay-im-okay': '#1a2b4c',
    'astrophage': '#00d4aa',
    'kesha-blow': '#e63995',
    'isabel-larosa-dont-make-them-like-me': '#4a2535'
};

export function getSongById(id) {
    return librarySongs.find(s => s.id === id) || null;
}
