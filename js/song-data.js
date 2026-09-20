// js/song-data.js
// Centralized song library data for HarmonyTunes and sitewide background playback

export const librarySongs = [
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
];

export const songColors = {
    'pixy-legacy': '#5c4a3d',
    'deorc-decuple': '#1d3036',
    'no-pole-remix': '#a11f8b',
    'tate-mcrae-its-okay-im-okay': '#1a2b4c',
    'astrophage': '#00d4aa',
    'kesha-blow': '#e63995'
};

export function getSongById(id) {
    return librarySongs.find(s => s.id === id) || null;
}
