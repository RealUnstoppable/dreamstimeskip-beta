const fs = require('fs');

const path = 'js/song-data.js';
let content = fs.readFileSync(path, 'utf8');

const newSongs = `
    {
        id: 'summer-bummer',
        title: "Summer Bummer",
        artist: "Rhy Rhy",
        duration: "4:20",
        src: "/music/summer_bummer_rhy_rhy.mp3",
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
        title: "Radiance (The Boy Who Played the Harp)",
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
    },`;

content = content.replace('export const librarySongs = [', 'export const librarySongs = [' + newSongs);
fs.writeFileSync(path, content, 'utf8');
