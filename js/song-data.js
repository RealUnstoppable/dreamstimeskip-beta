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
    {
        id: 'dancin-krono-remix-luvli-aaron-smith',
        title: "Dancin Krono Remix",
        artist: "Luvli Aaron Smith",
        duration: "0:00",
        src: "/music/dancin-krono-remix-feat-luvli-aaron-smith.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'did-i-tell-u-that-i-miss-u-adore',
        title: "Did I Tell U That I Miss U Adore",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/did-i-tell-u-that-i-miss-u-adore.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'died-once-guitar-remix-aamadux',
        title: "Died Once Guitar Remix Aamadux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/died-once-guitar-remix-aamadux.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fame-is-a-gun-addison-rae',
        title: "Fame Is A Gun Addison Rae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/fame-is-a-gun-addison-rae.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-feel-lost-aaron-hibell',
        title: "I Feel Lost Aaron Hibell",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/i-feel-lost-aaron-hibell.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-smoked-away-my-brain-im-god-x-demons-mashup-imogen-heap-cl',
        title: "I Smoked Away My Brain Im God X Demons Mashup",
        artist: "Imogen Heap Clams Casino Aap Rocky",
        duration: "0:00",
        src: "/music/i-smoked-away-my-brain-im-god-x-demons-mashup-feat-imogen-heap-clams-casino-aap-rocky.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-that-guitar-remix-aamadux',
        title: "Like That Guitar Remix Aamadux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/like-that-guitar-remix-aamadux.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'loverboy-a-wall',
        title: "Loverboy A Wall",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/loverboy-a-wall.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'summer-bummer-rhy-rhy',
        title: "Summer Bummer Rhy Rhy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/summer_bummer_rhy_rhy.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '100-am-civ',
        title: "100 Am Civ",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/100-am-civ.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '2-dangerous-brennan-story-rarin',
        title: "2 Dangerous Brennan Story Rarin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/2-dangerous-brennan-story-rarin.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '505-arctic-monkeys',
        title: "505 Arctic Monkeys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/505-arctic-monkeys.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '7-rings-ariana-grande',
        title: "7 Rings Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/7-rings-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '9pm-in-shibuya-432hz-adturnup',
        title: "9pm In Shibuya 432hz Adturnup",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/9pm-in-shibuya-432hz-adturnup.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'abismo-mixed-clap-freckles',
        title: "Abismo Mixed Clap Freckles",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/abismo-mixed-clap-freckles.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-about-that-bass-chrxs-beats-bread-beatz',
        title: "All About That Bass Chrxs Beats Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/all-about-that-bass-chrxs-beats-bread-beatz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'answer-to-everything-mixed-any-act',
        title: "Answer To Everything Mixed Any Act",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/answer-to-everything-mixed-any-act.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'anything-adrianne-lenker',
        title: "Anything Adrianne Lenker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/anything-adrianne-lenker.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'are-you-falling-in-love-akucum',
        title: "Are You Falling In Love Akucum",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/are-you-falling-in-love-akucum.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ash-kaashh-lilbubblegum-1nonly',
        title: "Ash Kaashh",
        artist: "Lilbubblegum 1nonly",
        duration: "0:00",
        src: "/music/ash-kaashh-feat-lilbubblegum-1nonly.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'automotivo-bibi-fogosa-bibi-babydoll-dj-brunin-xm-kza-produc',
        title: "Automotivo Bibi Fogosa Bibi Babydoll Dj Brunin Xm Kza ProduçÕEs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/automotivo-bibi-fogosa-bibi-babydoll-dj-brunin-xm-kza-produções.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'automotivo-bibi-fogosa-slowed-reverb-bbygirl',
        title: "Automotivo Bibi Fogosa Slowed Reverb Bbygirl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/automotivo-bibi-fogosa-slowed-reverb-bbygirl.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'b2b-charli-xcx',
        title: "B2b Charli Xcx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/b2b-charli-xcx.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'babydoll-ari-abdul',
        title: "Babydoll Ari Abdul",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/babydoll-ari-abdul.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-bitch-axaero-aio-holmes',
        title: "Bad Bitch",
        artist: "Axaero Aio Holmes",
        duration: "0:00",
        src: "/music/bad-bitch-feat-axaero-aio-holmes.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'baila-jazzao-chrxs-beats-bread-beatz',
        title: "Baila JazzãO Chrxs Beats Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/baila-jazzão-chrxs-beats-bread-beatz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'birds-of-a-feather-billie-eilish',
        title: "Birds Of A Feather Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/birds-of-a-feather-billie-eilish.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-out-days-slowed-reverb-tell-me-all-the-ways-to-stay-aw',
        title: "Black Out Days Slowed Reverb Tell Me All The Ways To Stay Away Creamy Untrusted 1111 Music Group",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/black-out-days-slowed-reverb-tell-me-all-the-ways-to-stay-away-creamy-untrusted-1111-music-group.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bleach-blvck-svm',
        title: "Bleach Blvck Svm",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/bleach-blvck-svm.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blondie-current-joys',
        title: "Blondie Current Joys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/blondie-current-joys.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bloodstained-shawty-ciscaux',
        title: "Bloodstained Shawty Ciscaux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/bloodstained-shawty-ciscaux.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bludlust-daegho-ngxt',
        title: "Bludlust Daegho Ngxt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/bludlust-daegho-ngxt.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blue-billie-eilish',
        title: "Blue Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/blue-billie-eilish.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'body-cash-cobain-a-boogie-wit-da-hoodie',
        title: "Body",
        artist: "Cash Cobain A Boogie Wit Da Hoodie",
        duration: "0:00",
        src: "/music/body-feat-cash-cobain-a-boogie-wit-da-hoodie.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bop-aj-gravity',
        title: "Bop Aj Gravity",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/bop-aj-gravity.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bop-it-aliyahs-interlude',
        title: "Bop It Aliyahs Interlude",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/bop-it-aliyahs-interlude.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'brag-aj-gravity',
        title: "Brag Aj Gravity",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/brag-aj-gravity.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'break-up-with-your-girlfriend-im-bored-ariana-grande',
        title: "Break Up With Your Girlfriend Im Bored Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/break-up-with-your-girlfriend-im-bored-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bubble-gum-clairo',
        title: "Bubble Gum Clairo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/bubble-gum-clairo.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'buster-atori-zoom',
        title: "Buster Atori Zoom",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/buster-atori-zoom.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cabo-bankrol-hayden',
        title: "Cabo Bankrol Hayden",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/cabo-bankrol-hayden.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cant-feel-myself-dadanny',
        title: "Cant Feel Myself Dadanny",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/cant-feel-myself-dadanny.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'celestial-angels-slowed-andromeda',
        title: "Celestial Angels Slowed Andromeda",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/celestial-angels-slowed-andromeda.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cloud-9-beach-bunny',
        title: "Cloud 9 Beach Bunny",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/cloud-9-beach-bunny.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cross-my-heart-artemas',
        title: "Cross My Heart Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/cross-my-heart-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cryst4l-darkxhawk',
        title: "Cryst4l Darkxhawk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/cryst4l-darkxhawk.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'death-is-no-more-slowed-blessed-mane',
        title: "Death Is No More Slowed Blessed Mane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/death-is-no-more-slowed-blessed-mane.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'do-it-civ',
        title: "Do It Civ",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/do-it-civ.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dream-girl-crisaunt',
        title: "Dream Girl Crisaunt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/dream-girl-crisaunt.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'duvet-boa',
        title: "Duvet BôA",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/duvet-bôa.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'echo-the-boyz',
        title: "Echo The Boyz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/echo-the-boyz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'emo-boy-ayesha-erotica',
        title: "Emo Boy Ayesha Erotica",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/emo-boy-ayesha-erotica.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'empty-dreams-cypariss',
        title: "Empty Dreams Cypariss",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/empty-dreams-cypariss.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fantasy-bazzi',
        title: "Fantasy Bazzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/fantasy-bazzi.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fk-school-404vincent',
        title: "Fk School 404vincent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/fk-school-404vincent.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fluxxwave-8d-audio-clovis-reyes',
        title: "Fluxxwave 8d Audio Clovis Reyes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/fluxxwave-8d-audio-clovis-reyes.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fluxxwave-clovis-reyes',
        title: "Fluxxwave Clovis Reyes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/fluxxwave-clovis-reyes.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gilded-lily-cults',
        title: "Gilded Lily Cults",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/gilded-lily-cults.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'government-hooker-bread-beatz',
        title: "Government Hooker Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/government-hooker-bread-beatz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'government-hooker-slowed-bread-beatz',
        title: "Government Hooker Slowed Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/government-hooker-slowed-bread-beatz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'grove-cheryltje',
        title: "Grove Cheryltje",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/grove-cheryltje.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gta-iv-slowed-bianc0-stuck-in-98',
        title: "Gta Iv Slowed Bianc0 Stuck In 98",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/gta-iv-slowed-bianc0-stuck-in-98.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'guess-featuring-billie-eilish-charli-xcx-billie-eilish',
        title: "Guess Featuring Billie Eilish Charli Xcx Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/guess-featuring-billie-eilish-charli-xcx-billie-eilish.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hatchback-cochise',
        title: "Hatchback Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/hatchback-cochise.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hate-that-i-made-you-love-me-ariana-grande',
        title: "Hate That I Made You Love Me Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/hate-that-i-made-you-love-me-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'haza-tiktok-version-udiennx',
        title: "Haza Tiktok Version Udiennx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/haza-tiktok-version-udiennx.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hdmi-bones',
        title: "Hdmi Bones",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/hdmi-bones.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hey-hi-hello-1nonly-lilbubblegum-ciscaux',
        title: "Hey Hi Hello",
        artist: "1nonly Lilbubblegum Ciscaux",
        duration: "0:00",
        src: "/music/hey-hi-hello-feat-1nonly-lilbubblegum-ciscaux.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'honest-baby-keem',
        title: "Honest Baby Keem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/honest-baby-keem.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hot-to-go-chappell-roan',
        title: "Hot To Go Chappell Roan",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/hot-to-go-chappell-roan.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'how-could-u-love-somebody-like-me-artemas',
        title: "How Could U Love Somebody Like Me Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/how-could-u-love-somebody-like-me-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hydroplane-cochise',
        title: "Hydroplane Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/hydroplane-cochise.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-feel-it-bryansanon',
        title: "I Feel It Bryansanon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/i-feel-it-bryansanon.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-like-the-way-you-kiss-me-artemas',
        title: "I Like The Way You Kiss Me Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/i-like-the-way-you-kiss-me-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-wait-for-you-alex-g-offline',
        title: "I Wait For You Alex G Offline",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/i-wait-for-you-alex_g_offline.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-wanna-be-yours-arctic-monkeys',
        title: "I Wanna Be Yours Arctic Monkeys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/i-wanna-be-yours-arctic-monkeys.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'id-rather-pretend-a-colors-show-bryant-barnes',
        title: "Id Rather Pretend A Colors Show Bryant Barnes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/id-rather-pretend-a-colors-show-bryant-barnes.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'idfc-blackbear',
        title: "Idfc Blackbear",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/idfc-blackbear.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'idfc-tarro-remix-blackbear',
        title: "Idfc Tarro Remix Blackbear",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/idfc-tarro-remix-blackbear.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'if-u-think-im-pretty-artemas',
        title: "If U Think Im Pretty Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/if-u-think-im-pretty-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'if-you-care-akiaura-lonown-dj-pointless',
        title: "If You Care Akiaura Lonown Dj Pointless",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/if-you-care-akiaura-lonown-dj-pointless.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-god-clams-casino-imogen-heap',
        title: "Im God Clams Casino Imogen Heap",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/im-god-clams-casino-imogen-heap.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'in-this-darkness-clara-la-san',
        title: "In This Darkness Clara La San",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/in-this-darkness-clara-la-san.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'job-application-chase-icon',
        title: "Job Application Chase Icon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/job-application-chase-icon.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jug-a-jug-mixed-any-act',
        title: "Jug A Jug Mixed Any Act",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/jug-a-jug-mixed-any-act.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'just-want-u-to-feel-something-artemas',
        title: "Just Want U To Feel Something Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/just-want-u-to-feel-something-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kerosene-crystal-castles',
        title: "Kerosene Crystal Castles",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/kerosene-crystal-castles.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'knicks-cochise',
        title: "Knicks Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/knicks-cochise.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'laa-mixed-danny-l-harle',
        title: "Laa Mixed Danny L Harle",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/laa-mixed-danny-l-harle.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legendary-lovers-x-save-me-aurelia-dopuu-b-star',
        title: "Legendary Lovers X Save Me Aurelia Dopuu B Star",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/legendary-lovers-x-save-me-aurelia-dopuu-b-star.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'les-childish-gambino',
        title: "Les Childish Gambino",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/les-childish-gambino.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-the-world-burn-chris-grey',
        title: "Let The World Burn Chris Grey",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/let-the-world-burn-chris-grey.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-the-world-burn-hoodtrap-mylancore-remix-chris-grey-r3bel',
        title: "Let The World Burn Hoodtrap Mylancore Remix Chris Grey R3bel Kryd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/let-the-world-burn-hoodtrap-mylancore-remix-chris-grey-r3bel-kryd.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-you-go-clara-la-san',
        title: "Let You Go Clara La San",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/let-you-go-clara-la-san.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lets-go-away-young-thug-a-boogie-wit-da-hoodie',
        title: "Lets Go Away",
        artist: "Young Thug A Boogie Wit Da Hoodie",
        duration: "0:00",
        src: "/music/lets-go-away-feat-young-thug-a-boogie-wit-da-hoodie.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lipstick-sped-up-version-burnedsam',
        title: "Lipstick Sped Up Version Burnedsam",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/lipstick-sped-up-version-burnedsam.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'look-back-at-it-a-boogie-wit-da-hoodie',
        title: "Look Back At It A Boogie Wit Da Hoodie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/look-back-at-it-a-boogie-wit-da-hoodie.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lost-souls-baby-keem',
        title: "Lost Souls Baby Keem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/lost-souls-baby-keem.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-game-bread-beatz',
        title: "Love Game Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/love-game-bread-beatz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-island-civ',
        title: "Love Island Civ",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/love-island-civ.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-potions-princess-paparazzi-bj-lips',
        title: "Love Potions",
        artist: "Princess Paparazzi Bj Lips",
        duration: "0:00",
        src: "/music/love-potions-feat-princess-paparazzi-bj-lips.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'loyal-lil-wayne-tyga-chris-brown',
        title: "Loyal",
        artist: "Lil Wayne Tyga Chris Brown",
        duration: "0:00",
        src: "/music/loyal-feat-lil-wayne-tyga-chris-brown.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lunch-billie-eilish',
        title: "Lunch Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/lunch-billie-eilish.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lyfe-prodbysky-teefaygoo-guitar-remix-ahfxck',
        title: "Lyfe",
        artist: "Prodbysky Teefaygoo Guitar Remix Ahfxck",
        duration: "0:00",
        src: "/music/lyfe-feat-prodbysky-teefaygoo-guitar-remix-ahfxck.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'makeba-sped-up-reverb-bbygirl',
        title: "Makeba Sped Up Reverb Bbygirl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/makeba-sped-up-reverb-bbygirl.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'manasha-slowed-ashreveal-ashish-swargiary',
        title: "Manasha Slowed Ashreveal Ashish Swargiary",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/manasha-slowed-ashreveal-ashish-swargiary.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'me-vs-me-jaeychino-slimegetem',
        title: "Me Vs Me Jaeychino Slimegetem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/me-vs-me-jaeychino-slimegetem.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'meet-me-halfway-black-eyed-peas',
        title: "Meet Me Halfway Black Eyed Peas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/meet-me-halfway-black-eyed-peas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mine-bazzi',
        title: "Mine Bazzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/mine-bazzi.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-coma-andromeda-elysian',
        title: "Montagem Coma Andromeda Elysian",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/montagem-coma-andromeda-elysian.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-kawaii-arxf-sayfalse',
        title: "Montagem Kawaii Arxf Sayfalse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/montagem-kawaii-arxf-sayfalse.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-ladrao-super-slowed-atlxs-mxzi-itamar-mc',
        title: "Montagem LadrãO Super Slowed Atlxs Mxzi Itamar Mc",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/montagem-ladrão-super-slowed-atlxs-mxzi-itamar-mc.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-rebola-atlxs-dj-fku',
        title: "Montagem Rebola Atlxs Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/montagem-rebola-atlxs-dj-fku.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'motion-party-bossman-dlow',
        title: "Motion Party Bossman Dlow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/motion-party-bossman-dlow.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'move-yo-body-sped-up-bryansanon',
        title: "Move Yo Body Sped Up Bryansanon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/move-yo-body-sped-up-bryansanon.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mr-pot-scraper-bossman-dlow',
        title: "Mr Pot Scraper Bossman Dlow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/mr-pot-scraper-bossman-dlow.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-turn-ayetrappin-yeat',
        title: "My Turn Ayetrappin Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/my-turn-ayetrappin-yeat.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'na-bala-bread-beatz-chrxs-beats',
        title: "Na Bala Bread Beatz Chrxs Beats",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/na-bala-bread-beatz-chrxs-beats.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-crumbs-radio-edit-alex-laws',
        title: "No Crumbs Radio Edit Alex Laws",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/no-crumbs-radio-edit-alex-laws.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'on-my-own-darci',
        title: "On My Own Darci",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/on-my-own-darci.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'on-on-daniel-levi-cartoon-jeja',
        title: "On On",
        artist: "Daniel Levi Cartoon JéJa",
        duration: "0:00",
        src: "/music/on-on-feat-daniel-levi-cartoon-jéja.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'orange-soda-baby-keem',
        title: "Orange Soda Baby Keem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/orange-soda-baby-keem.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'orions-belt-yeat-slowed-reverb-version-dammntc',
        title: "Orions Belt",
        artist: "Yeat Slowed Reverb Version Dammntc",
        duration: "0:00",
        src: "/music/orions-belt-feat-yeat-slowed-reverb-version-dammntc.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'palace-adturnup',
        title: "Palace Adturnup",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/palace-adturnup.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'passo-bem-solto-atlxs',
        title: "Passo Bem Solto Atlxs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/passo-bem-solto-atlxs.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'passo-bem-solto-slowed-atlxs',
        title: "Passo Bem Solto Slowed Atlxs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/passo-bem-solto-slowed-atlxs.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'petal-in-the-pavement-ariana-grande',
        title: "Petal In The Pavement Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/petal-in-the-pavement-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'phonk-and-furious-atlxs',
        title: "Phonk And Furious Atlxs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/phonk-and-furious-atlxs.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'piano-tiles-2-armani-west-6arelyhuman-cortisa-star',
        title: "Piano Tiles 2 Armani West 6arelyhuman Cortisa Star",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/piano-tiles-2-armani-west-6arelyhuman-cortisa-star.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'piano-tiles-armani-west',
        title: "Piano Tiles Armani West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/piano-tiles-armani-west.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pocket-rocket-cochise',
        title: "Pocket Rocket Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/pocket-rocket-cochise.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pop-dat-thang-dababy',
        title: "Pop Dat Thang Dababy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/pop-dat-thang-dababy.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pretty-girl-clairo',
        title: "Pretty Girl Clairo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/pretty-girl-clairo.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pretty-scene-girl-clover',
        title: "Pretty Scene Girl Clover",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/pretty-scene-girl-clover.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'prettygrungewav-artemas',
        title: "Prettygrungewav Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/prettygrungewav-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'py-millions-travis-scott-drake-21-savage',
        title: "Py Millions",
        artist: "Travis Scott Drake 21 Savage",
        duration: "0:00",
        src: "/music/py-millions-feat-travis-scott-drake-21-savage.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rather-be-jess-glynne-clean-bandit',
        title: "Rather Be",
        artist: "Jess Glynne Clean Bandit",
        duration: "0:00",
        src: "/music/rather-be-feat-jess-glynne-clean-bandit.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'relationship-without-status-alkan-shade',
        title: "Relationship Without Status Alkan Shade",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/relationship-without-status-alkan-shade.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ridin-brxkenbxy',
        title: "Ridin Brxkenbxy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/ridin-brxkenbxy.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ritual-andromeda-onimxru-maxpvnk',
        title: "Ritual Andromeda Onimxru Maxpvnk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/ritual-andromeda-onimxru-maxpvnk.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rock-that-body-black-eyed-peas',
        title: "Rock That Body Black Eyed Peas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/rock-that-body-black-eyed-peas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rockstar-made-8d-audio-benz',
        title: "Rockstar Made 8d Audio Benz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/rockstar-made-8d-audio-benz.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'romantic-homicide-d4vd',
        title: "Romantic Homicide D4vd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/romantic-homicide-d4vd.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'roxanne-arizona-zervas',
        title: "Roxanne Arizona Zervas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/roxanne-arizona-zervas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sad-girlz-luv-money-kali-uchis-remix-amaarae-moliy',
        title: "Sad Girlz Luv Money",
        artist: "Kali Uchis Remix Amaarae Moliy",
        duration: "0:00",
        src: "/music/sad-girlz-luv-money-feat-kali-uchis-remix-amaarae-moliy.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sell-out-basco',
        title: "Sell Out Basco",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/sell-out-basco.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sex-drugs-etc-beach-weather',
        title: "Sex Drugs Etc Beach Weather",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/sex-drugs-etc-beach-weather.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shake-sumn-remix-dababy-sexyy-red',
        title: "Shake Sumn Remix Dababy Sexyy Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/shake-sumn-remix-dababy-sexyy-red.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shower-becky-g',
        title: "Shower Becky G",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/shower-becky-g.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'side-to-side-nicki-minaj-ariana-grande',
        title: "Side To Side",
        artist: "Nicki Minaj Ariana Grande",
        duration: "0:00",
        src: "/music/side-to-side-feat-nicki-minaj-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sigma-boy-betsy-maria-iankovskaia',
        title: "Sigma Boy сигма бой Betsy Maria Iankovskaia",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/sigma-boy-сигма-бой-betsy-maria-iankovskaia.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sleepwalker-slowed-akiaura-lonown-stm',
        title: "Sleepwalker Slowed Akiaura Lonown Stm",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/sleepwalker-slowed-akiaura-lonown-stm.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slow-down-chase-atlantic',
        title: "Slow Down Chase Atlantic",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/slow-down-chase-atlantic.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sofia-clairo',
        title: "Sofia Clairo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/sofia-clairo.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'somebody-future-a-boogie-wit-da-hoodie',
        title: "Somebody",
        artist: "Future A Boogie Wit Da Hoodie",
        duration: "0:00",
        src: "/music/somebody-feat-future-a-boogie-wit-da-hoodie.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'someday-ill-get-it-alek-olsen',
        title: "Someday Ill Get It Alek Olsen",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/someday-ill-get-it-alek-olsen.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sonidero-mixed-ale-rossi',
        title: "Sonidero Mixed Ale Rossi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/sonidero-mixed-ale-rossi.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'space-song-beach-house',
        title: "Space Song Beach House",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/space-song-beach-house.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stranger-things-chase-the-vulture',
        title: "Stranger Things Chase The Vulture",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/stranger-things-chase-the-vulture.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'swim-chase-atlantic',
        title: "Swim Chase Atlantic",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/swim-chase-atlantic.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tek-it-cafune',
        title: "Tek It Cafuné",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/tek-it-cafuné.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tek-it-sped-up-cafune',
        title: "Tek It Sped Up Cafuné",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/tek-it-sped-up-cafuné.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-em-cochise-not',
        title: "Tell Em Cochise Not",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/tell-em-cochise-not.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-days-notion-remix-slowed-chrystal',
        title: "The Days Notion Remix Slowed Chrystal",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/the-days-notion-remix-slowed-chrystal.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-perfect-pair-beabadoobee',
        title: "The Perfect Pair Beabadoobee",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/the-perfect-pair-beabadoobee.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'this-side-of-paradise-coyote-theory',
        title: "This Side Of Paradise Coyote Theory",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/this-side-of-paradise-coyote-theory.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'time-alone-w-u-artemas',
        title: "Time Alone W U Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/time-alone-w-u-artemas.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'time-ariana-grande-childish-gambino',
        title: "Time",
        artist: "Ariana Grande Childish Gambino",
        duration: "0:00",
        src: "/music/time-feat-ariana-grande-childish-gambino.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'toradora-swoodeasu-caspy-breeton-boi',
        title: "Toradora",
        artist: "Swoodeasu Caspy Breeton Boi",
        duration: "0:00",
        src: "/music/toradora-feat-swoodeasu-caspy-breeton-boi.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'transgender-crystal-castles',
        title: "Transgender Crystal Castles",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/transgender-crystal-castles.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trap-royalty-epic-version-carameii',
        title: "Trap Royalty Epic Version Carameii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/trap-royalty-epic-version-carameii.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tuca-donka-cursedevil-dj-fku-skorde',
        title: "Tuca Donka Cursedevil Dj Fku Skorde",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/tuca-donka-cursedevil-dj-fku-skorde.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-werent-here-i-really-miss-you-cult-member-mia-martina',
        title: "U Werent Here I Really Miss You Cult Member Mia Martina",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/u-werent-here-i-really-miss-you-cult-member-mia-martina.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-werent-here-i-really-miss-you-slowed-cult-member-mia-marti',
        title: "U Werent Here I Really Miss You Slowed Cult Member Mia Martina",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/u-werent-here-i-really-miss-you-slowed-cult-member-mia-martina.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'uwukrush-bemax-ovg',
        title: "Uwukrush Bemax Ovg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/uwukrush-bemax-ovg.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vyzee-slowed-charbo',
        title: "Vyzee Slowed Charbo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/vyzee-slowed-charbo.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wap-megan-thee-stallion-cardi-b',
        title: "Wap",
        artist: "Megan Thee Stallion Cardi B",
        duration: "0:00",
        src: "/music/wap-feat-megan-thee-stallion-cardi-b.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'we-cant-be-friends-wait-for-your-love-ariana-grande',
        title: "We Cant Be Friends Wait For Your Love Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/we-cant-be-friends-wait-for-your-love-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'we-on-go-bia',
        title: "We On Go Bia",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/we-on-go-bia.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'what-was-i-made-for-from-the-motion-picture-barbie-billie-ei',
        title: "What Was I Made For From The Motion Picture Barbie Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/what-was-i-made-for-from-the-motion-picture-barbie-billie-eilish.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'whoopty-cj',
        title: "Whoopty Cj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/whoopty-cj.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'whyd-you-only-call-me-when-youre-high-arctic-monkeys',
        title: "Whyd You Only Call Me When Youre High Arctic Monkeys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/whyd-you-only-call-me-when-youre-high-arctic-monkeys.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yes-and-ariana-grande',
        title: "Yes And Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/yes-and-ariana-grande.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'you-and-i-d4vd',
        title: "You And I D4vd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/you-and-i-d4vd.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yummy-righteous-remix-ayesha-erotica-mo-beats',
        title: "Yummy Righteous Remix Ayesha Erotica Mo Beats",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "/music/yummy-righteous-remix-ayesha-erotica-mo-beats.mp3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '1-intro-future-metro-boomin',
        title: "1 Intro Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F1-intro-future-metro-boomin.mp3?alt=media&token=b1bb8375-be26-41b7-becf-830bc9ed890c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '10-freaky-girls-21-savage-metro-boomin',
        title: "10 Freaky Girls",
        artist: "21 Savage Metro Boomin",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F10-freaky-girls-feat-21-savage-metro-boomin.mp3?alt=media&token=8a4edfac-7052-4e24-af23-ba74a2e946d8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '100-am-civ',
        title: "100 Am Civ",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F100-am-civ.mp3?alt=media&token=556907e1-7648-4573-97dc-63b603a12848",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '1093-yeat',
        title: "1093 Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F1093-yeat.mp3?alt=media&token=e455cf0e-b1b0-4c83-8489-075d987bc262",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '2-dangerous-brennan-story-rarin',
        title: "2 Dangerous Brennan Story Rarin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F2-dangerous-brennan-story-rarin.mp3?alt=media&token=8df4a255-4891-428c-bf00-6a43c2489de6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '2-hands-tate-mcrae',
        title: "2 Hands Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F2-hands-tate-mcrae.mp3?alt=media&token=2466fe63-4233-4899-a6c8-3cfa0f8be6a4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '2-hard-4-the-radio-drake',
        title: "2 Hard 4 The Radio Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F2-hard-4-the-radio-drake.mp3?alt=media&token=018cd23f-286f-4496-a048-9cd63bd88e60",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '20-min-jace',
        title: "20 Min Jace",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F20-min-jace.mp3?alt=media&token=1b4fd42a-a608-4f83-bb2a-834baece142c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '20-min-lil-uzi-vert',
        title: "20 Min Lil Uzi Vert",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F20-min-lil-uzi-vert.mp3?alt=media&token=05414c73-bd3f-465f-b16f-aa34679244d8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '2055-sleepy-hallow',
        title: "2055 Sleepy Hallow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F2055-sleepy-hallow.mp3?alt=media&token=f441e616-5b31-4f07-b392-1e0efe97da24",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '2093-yeat',
        title: "2093 Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F2093-yeat.mp3?alt=media&token=027abe57-7143-485f-98a5-411ae91f6dd7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '24-songs-void-ciaffa-fedo-dj',
        title: "24 Songs Void Ciaffa Fedo Dj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F24-songs-void-ciaffa-fedo-dj.mp3?alt=media&token=91e2ca90-471a-4d82-847b-c2a86ec16d11",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '30-bizzy-banks-pop-smoke',
        title: "30",
        artist: "Bizzy Banks Pop Smoke",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F30-feat-bizzy-banks-pop-smoke.mp3?alt=media&token=5ca26d12-636c-47ec-9f7e-42f3128d06ee",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '330-am-deluxe-jean-ka',
        title: "330 Am Deluxe Jean Ka",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F330-am-deluxe-jean-ka.mp3?alt=media&token=d926b8d8-1ca1-4105-84e3-df7e63c8af6b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '35-ian',
        title: "35 Ian",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F35-ian.mp3?alt=media&token=98b9a355-1eac-4e76-8364-3e6744933b7a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '4-raws-esdeekid',
        title: "4 Raws Esdeekid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F4-raws-esdeekid.mp3?alt=media&token=f0632bef-fe72-4419-bd76-7d2018924b4d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '5-2-h-60-yeat-septembersrich',
        title: "5 2 üH 60",
        artist: "Yeat Septembersrich",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F5-2-%C3%BCh-60-feat-yeat-septembersrich.mp3?alt=media&token=ba410eb7-3a54-4f6f-8ec0-7de2eea888f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '500lbs-lil-tecca',
        title: "500lbs Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F500lbs-lil-tecca.mp3?alt=media&token=08a66125-10f7-4d16-a53d-c23f87812e7a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '505-arctic-monkeys',
        title: "505 Arctic Monkeys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F505-arctic-monkeys.mp3?alt=media&token=0fc55cb3-f181-45fb-a9a3-15ca6ed272e2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '679-i-got-a-glock-in-my-rari-sped-remix-dj-samentro',
        title: "679 I Got A Glock In My Rari Sped Remix Dj Samentro",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F679-i-got-a-glock-in-my-rari-sped-remix-dj-samentro.mp3?alt=media&token=998c4bb1-3d04-4051-bc87-6b2a0dd5f966",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '7-leere-zimmer-ufo361-henning-may',
        title: "7 Leere Zimmer Ufo361 Henning May",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F7-leere-zimmer-ufo361-henning-may.mp3?alt=media&token=e7cfc060-9c62-40da-83c9-c1297f92ccd2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '7-rings-ariana-grande',
        title: "7 Rings Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F7-rings-ariana-grande.mp3?alt=media&token=5b7408a1-c146-4e80-9ceb-345639f8d620",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '7-weeks-3-days-yungatita',
        title: "7 Weeks 3 Days Yungatita",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F7-weeks-3-days-yungatita.mp3?alt=media&token=3853ff7d-e258-4193-837c-194d0d8f3f0c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '90miles-setgare',
        title: "90miles Setgare",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F90miles-setgare.mp3?alt=media&token=ce030ea3-161c-46f9-b5cf-08f8b033db9d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '9am-in-vixen-fallen-angel',
        title: "9am In Vixen Fallen Angel",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F9am-in-vixen-fallen-angel.mp3?alt=media&token=d3ecf000-b337-4d90-b183-17e366454919",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '9mm-memphis-cult-groove-dealers-splyxer',
        title: "9mm Memphis Cult Groove Dealers Splyxer",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F9mm-memphis-cult-groove-dealers-splyxer.mp3?alt=media&token=cdace606-35aa-49a0-b33c-097aa1c4c6ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: '9pm-in-shibuya-432hz-adturnup',
        title: "9pm In Shibuya 432hz Adturnup",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F9pm-in-shibuya-432hz-adturnup.mp3?alt=media&token=492ea2bf-7af2-47e6-b1cd-20eb1c8ac8e3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'a-birds-last-look-macabre-plaza',
        title: "A Birds Last Look Macabre Plaza",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fa-birds-last-look-macabre-plaza.mp3?alt=media&token=86f8932c-7b51-4d6d-a67a-f73520b29c62",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'a-good-man-with-a-broken-heart-lovibe',
        title: "A Good Man With A Broken Heart Lovibe",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fa-good-man-with-a-broken-heart-lovibe.mp3?alt=media&token=4c71217e-e3ab-40a3-9f7c-993cce13a7c0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'a-milli-lil-wayne',
        title: "A Milli Lil Wayne",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fa-milli-lil-wayne.mp3?alt=media&token=72c27801-088b-4af2-b753-dd47560a1f76",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'a-new-kind-of-love-demo-guy-sigsworth-imogen-heap-frou-frou',
        title: "A New Kind Of Love Demo Guy Sigsworth Imogen Heap Frou Frou",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fa-new-kind-of-love-demo-guy-sigsworth-imogen-heap-frou-frou.mp3?alt=media&token=f3af8a60-5ab8-42ba-9386-8b5e0de31f6e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'abismo-mixed-clap-freckles',
        title: "Abismo Mixed Clap Freckles",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fabismo-mixed-clap-freckles.mp3?alt=media&token=d41c09d8-9e5f-4b62-8828-388311b3dbad",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'abolish-the-irs-ptasinski-rj-pasin',
        title: "Abolish The Irs Ptasinski Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fabolish-the-irs-ptasinski-rj-pasin.mp3?alt=media&token=8c022af9-8268-4f28-a894-5f65c1395ab6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'acido-alt-ver-over-slowed-udiennx',
        title: "Acido Alt Ver Over Slowed Udiennx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Facido-alt-ver-over-slowed-udiennx.mp3?alt=media&token=3911e6f9-747b-4bda-bc87-21412b384c90",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'actin-a-smoochie-ice-spice',
        title: "Actin A Smoochie Ice Spice",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Factin-a-smoochie-ice-spice.mp3?alt=media&token=5ba4fa2c-1755-4a09-bf8b-9aa5be94fc80",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'add-khantrast',
        title: "Add Khantrast",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fadd-khantrast.mp3?alt=media&token=c589cab4-f455-4ad6-be30-012126a960fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'addict-re-hab-xxxiii',
        title: "Addict Re Hab Xxxiii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faddict-re-hab-xxxiii.mp3?alt=media&token=ff5e26e3-5c36-4bb3-a7f4-0f4a28fdd260",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'adhd-mae-stephens',
        title: "Adhd Mae Stephens",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fadhd-mae-stephens.mp3?alt=media&token=afb57c29-9fe4-418e-a244-bc7ebec0ab8b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'adrenalina-grioten-xlout',
        title: "Adrenalina Grioten Xlout",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fadrenalina-grioten-xlout.mp3?alt=media&token=7cdf1aa8-c4cd-48c1-99ab-93987b071723",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'aesthetic-xilo',
        title: "Aesthetic Xilo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faesthetic-xilo.mp3?alt=media&token=7aa59092-d243-4b74-9967-1a549871f147",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'af1-lilbubblegum',
        title: "Af1 Lilbubblegum",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faf1-lilbubblegum.mp3?alt=media&token=8bc1dea6-9cf2-4eb9-9e53-8101a6fe74b0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'afterparty-loat-slxrppy',
        title: "Afterparty",
        artist: "Loat Slxrppy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fafterparty-feat-loat-slxrppy.mp3?alt=media&token=aa1fdf32-c083-4916-8f8b-07715dd03b3a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'again-shiloh-dynasty-timmies',
        title: "Again Shiloh Dynasty Timmies",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fagain-shiloh-dynasty-timmies.mp3?alt=media&token=38f5e139-f9c2-4119-bcac-c9505690552d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'agora-hills-doja-cat',
        title: "Agora Hills Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fagora-hills-doja-cat.mp3?alt=media&token=ed407364-1766-408f-8352-a6430f3ffde8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'airplane-mode-moneyboss-slxrppy',
        title: "Airplane Mode",
        artist: "Moneyboss Slxrppy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fairplane-mode-feat-moneyboss-slxrppy.mp3?alt=media&token=c8873a9f-4e11-485c-9936-8dd60ed0f42f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'akai-slowed-udiennx-hxvsage',
        title: "Akai Slowed Udiennx Hxvsage",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fakai-slowed-udiennx-hxvsage.mp3?alt=media&token=6721d20d-59f1-4050-acfc-e711982f2ca1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'al-nacer-slowed-sayfalse-nulteex',
        title: "Al Nacer Slowed Sayfalse Nulteex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fal-nacer-slowed-sayfalse-nulteex.mp3?alt=media&token=1a2a240e-1091-4e67-9c1e-60f37cc36e76",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'al1en-jump-super-slowed-nxxkz',
        title: "Al1en Jump Super Slowed Nxxkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fal1en_jump-super-slowed-nxxkz.mp3?alt=media&token=b617d906-22aa-486b-b859-fc660a74afaf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'alcoholics-pingmas',
        title: "Alcoholics Pingmas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Falcoholics-pingmas.mp3?alt=media&token=27e9af3d-2631-4d46-87d2-9b07eef211a3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-about-that-bass-chrxs-beats-bread-beatz',
        title: "All About That Bass Chrxs Beats Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-about-that-bass-chrxs-beats-bread-beatz.mp3?alt=media&token=c09bb269-86fc-4816-bdb7-4b10fb90f3e6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-girls-are-the-same-juice-wrld',
        title: "All Girls Are The Same Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-girls-are-the-same-juice-wrld.mp3?alt=media&token=b644bec3-c7de-4926-8362-f11a3817420a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-girls-are-the-same-rnin',
        title: "All Girls Are The Same RøNin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-girls-are-the-same-r%C3%B8nin.mp3?alt=media&token=d12f51c9-9127-4c3e-8b64-a10577f7e903",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-i-can-say-kali-uchis',
        title: "All I Can Say Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-i-can-say-kali-uchis.mp3?alt=media&token=cf9818bc-6e72-4a15-b19a-5c08d70d7dad",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-i-want-is-you-hoshie-star-rebzyyx',
        title: "All I Want Is You",
        artist: "Hoshie Star Rebzyyx",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-i-want-is-you-feat-hoshie-star-rebzyyx.mp3?alt=media&token=4a6ea6b4-da24-4c6b-9fcb-17757449930a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-my-life-future-metro-boomin-lil-baby',
        title: "All My Life Future Metro Boomin Lil Baby",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-my-life-future-metro-boomin-lil-baby.mp3?alt=media&token=af5cf48d-338d-4956-b7ec-d2e145f9111e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-night-dance-pw',
        title: "All Night Dance PøW",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-night-dance-p%C3%B8w.mp3?alt=media&token=4fbdfdf0-cde7-46fe-88e3-330663b3d647",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-night-mannyily-mxlu-slxrppy',
        title: "All Night",
        artist: "Mannyily Mxlu Slxrppy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-night-feat-mannyily-mxlu-slxrppy.mp3?alt=media&token=b633b26f-d5d9-4999-a0e9-61b1073d31c7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-night-ive-saweetie',
        title: "All Night Ive Saweetie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-night-ive-saweetie.mp3?alt=media&token=b5c11830-f717-4a9c-8efe-ff4ada419f22",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'all-to-myself-future-metro-boomin-the-weeknd',
        title: "All To Myself Future Metro Boomin The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fall-to-myself-future-metro-boomin-the-weeknd.mp3?alt=media&token=02e7e837-138d-4a5d-acd5-d10df28b0a6a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'aloha-2-dmeanor-konsole',
        title: "Aloha 2",
        artist: "Dmeanor Konsole",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faloha-2-feat-dmeanor-konsole.mp3?alt=media&token=68d9198d-5843-4ef1-9253-df07ff0acbb1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'alpha-squad-hampus-naeselius',
        title: "Alpha Squad Hampus Naeselius",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Falpha-squad-hampus-naeselius.mp3?alt=media&token=5856fe2f-7533-4bca-84ae-a1bbaadf6572",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'already-dead-juice-wrld',
        title: "Already Dead Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Falready-dead-juice-wrld.mp3?alt=media&token=515cc93a-be02-4ba2-bf62-a335d0b9dc99",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'already-dead-lil-kaktus',
        title: "Already Dead Lil Kaktus",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Falready-dead-lil-kaktus.mp3?alt=media&token=76cab300-dfb8-436c-8df1-dfdeebd88523",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'already-rich-yeat',
        title: "Already Rich Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Falready-rich-yeat.mp3?alt=media&token=c66ddd61-5bd5-4f0a-8c4e-0135e2a099f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'always-be-my-fault-future-metro-boomin-the-weeknd',
        title: "Always Be My Fault Future Metro Boomin The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Falways-be-my-fault-future-metro-boomin-the-weeknd.mp3?alt=media&token=993f57f5-45a7-4dba-a58d-6e20dc91deb1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'amazing-interlude-future-metro-boomin',
        title: "Amazing Interlude Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Famazing-interlude-future-metro-boomin.mp3?alt=media&token=43baa932-ef5d-4077-9812-11e9c643e60a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'amigo-lil-tecca',
        title: "Amigo Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Famigo-lil-tecca.mp3?alt=media&token=c445d9f2-b3f5-4a8d-a208-1c34f4cf28e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'amiri-trendsetter-rich-amiri-osamason',
        title: "Amiri Trendsetter Rich Amiri Osamason",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Famiri-trendsetter-rich-amiri-osamason.mp3?alt=media&token=38ef87a9-fe5c-4029-a2c0-2f976f31b35b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'angels-all-around-me-kali-uchis',
        title: "Angels All Around Me Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fangels-all-around-me-kali-uchis.mp3?alt=media&token=01583518-1e16-4a51-a74d-1b220d90b76e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'anime-thighs-wonder-mc-virgins',
        title: "Anime Thighs",
        artist: "Wonder Mc Virgins",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fanime-thighs-feat-wonder-mc-virgins.mp3?alt=media&token=89cbf68f-7acc-4b7f-a83f-69c7f8c4cbd7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'anime-thighs-ovg-remix-ovg',
        title: "Anime Thighs Ovg Remix Ovg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fanime-thighs-ovg-remix-ovg.mp3?alt=media&token=90f826a0-1025-4fa7-b100-535694d97829",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'annihilate-spider-man-across-the-spider-verse-metro-boomin-s',
        title: "Annihilate Spider Man Across The Spider Verse Metro Boomin Swae Lee Lil Wayne Offset",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fannihilate-spider-man-across-the-spider-verse-metro-boomin-swae-lee-lil-wayne-offset.mp3?alt=media&token=b80a1468-0436-45b8-b521-fa4765cd4133",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'answer-to-everything-mixed-any-act',
        title: "Answer To Everything Mixed Any Act",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fanswer-to-everything-mixed-any-act.mp3?alt=media&token=60f7be9e-693d-401c-8a96-963af73a5d69",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'antisocial-2-slump6s-yung-fazo-xhulooo-ssgkobe-tana',
        title: "Antisocial 2",
        artist: "Slump6s Yung Fazo Xhulooo Ssgkobe Tana",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fantisocial-2-feat-slump6s-yung-fazo-xhulooo-ssgkobe-tana.mp3?alt=media&token=859ff315-90ef-43fb-9270-859cf3e53897",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'antisocial-tana-slump6s',
        title: "Antisocial Tana Slump6s",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fantisocial-tana-slump6s.mp3?alt=media&token=f98ff1dc-f133-4f50-a524-09451b9f7404",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'anyone-justin-bieber',
        title: "Anyone Justin Bieber",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fanyone-justin-bieber.mp3?alt=media&token=3bee90b6-0691-4f27-b1b2-84e087711aa0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'anything-adrianne-lenker',
        title: "Anything Adrianne Lenker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fanything-adrianne-lenker.mp3?alt=media&token=f012d83f-f8b7-44a3-9912-4b9ecca8b025",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'apathy-neheart',
        title: "Apathy øNeheart",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fapathy-%C3%B8neheart.mp3?alt=media&token=32856df7-775d-4599-bfdc-818edcc085ea",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'april-showers-proleter',
        title: "April Showers Proleter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fapril-showers-proleter.mp3?alt=media&token=f71a73e9-c10c-474f-9ef7-0fcc5fd3bec7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'archangel-slowed-dj-anemia-crier-sixnite',
        title: "Archangel Slowed Dj Anemia Crier Sixnite",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Farchangel-slowed-dj-anemia-crier-sixnite.mp3?alt=media&token=4f4b506f-de74-4689-b9fb-1c2cc958288d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'are-you-falling-in-love-akucum',
        title: "Are You Falling In Love Akucum",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fare-you-falling-in-love-akucum.mp3?alt=media&token=40b4d420-a732-4f12-9504-63a7f3c59a42",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'arlong-park-cochise-yung-baller',
        title: "Arlong Park",
        artist: "Cochise Yung Baller",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Farlong-park-feat-cochise-yung-baller.mp3?alt=media&token=1ea095ca-70f2-4cdd-b989-43ab992b9914",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'armed-and-dangerous-juice-wrld',
        title: "Armed And Dangerous Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Farmed-and-dangerous-juice-wrld.mp3?alt=media&token=6c57f234-0685-4995-bb0f-a90a8ca890b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'armed-dangerous-king-von',
        title: "Armed Dangerous King Von",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Farmed-dangerous-king-von.mp3?alt=media&token=b3648b08-9467-4c87-becc-54e58fa254c4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'army-of-angels-edgar-hopp',
        title: "Army Of Angels Edgar Hopp",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Farmy-of-angels-edgar-hopp.mp3?alt=media&token=4a8e958c-5ade-484e-86ea-a1d1d14bc775",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'around-the-world-techno-remix-fyex',
        title: "Around The World Techno Remix Fyex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faround-the-world-techno-remix-fyex.mp3?alt=media&token=bd1edd1b-b49d-4f4b-aab4-d3bb1e66769a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ascendance-killthechosen-mxlu',
        title: "Ascendance",
        artist: "Killthechosen Mxlu",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fascendance-feat-killthechosen-mxlu.mp3?alt=media&token=3f45e69d-b881-4107-b1dd-56f4a2df1064",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'astro-slowboy-ivoxygen-zaichkou888',
        title: "Astro Slowboy Ivoxygen Zaichkou888",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fastro-slowboy-ivoxygen-zaichkou888.mp3?alt=media&token=0e5ebd92-a5bc-47d3-9489-c42e69c633d1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'astrophage-lupus-nocte',
        title: "Astrophage Lupus Nocte",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fastrophage-lupus-nocte.mp3?alt=media&token=2022efc3-bc1f-419b-87bb-fc0f42075e4e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'asuna-kid-sora-miraie',
        title: "Asuna",
        artist: "Kid Sora Miraie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fasuna-feat-kid-sora-miraie.mp3?alt=media&token=06b503b5-5976-4f2e-844c-1717e18257c3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'attack-mixed-scrufizzer-33-below',
        title: "Attack Mixed Scrufizzer 33 Below",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fattack-mixed-scrufizzer-33-below.mp3?alt=media&token=c0617fb2-dc6d-4ab9-8275-f15fc135071b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'attracted-to-you-pinkpantheress',
        title: "Attracted To You Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fattracted-to-you-pinkpantheress.mp3?alt=media&token=5ef67b67-9cc0-422a-a04c-2c2ec8b27be7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'aura-ogryzek',
        title: "Aura Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faura-ogryzek.mp3?alt=media&token=6cb5a08e-bb29-427a-a0f7-ea2a89bf7012",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'aurora-love-xxephyrr-hxi',
        title: "Aurora Love Xxephyrr Hxi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faurora-love-xxephyrr-hxi.mp3?alt=media&token=f5d94bae-baa7-4f55-a5f9-4cd259c2bd6f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'aurora-slowed-rushlow-sayfalse',
        title: "Aurora Slowed Rushlow Sayfalse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Faurora-slowed-rushlow-sayfalse.mp3?alt=media&token=a8e701c7-edb0-4283-97f2-233471d2d8be",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'automotivo-amar-ma-ma-ma-dj-brunin-xm-bibi-babydoll-mc-erika',
        title: "Automotivo Amar Ma Ma Ma Dj Brunin Xm Bibi Babydoll Mc Erikah",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fautomotivo-amar-ma-ma-ma-dj-brunin-xm-bibi-babydoll-mc-erikah.mp3?alt=media&token=96c15dba-c422-407a-aa3b-b1fd77185d33",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'automotivo-bibi-fogosa-bibi-babydoll-dj-brunin-xm-kza-produe',
        title: "Automotivo Bibi Fogosa Bibi Babydoll Dj Brunin Xm Kza ProduçõEs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fautomotivo-bibi-fogosa-bibi-babydoll-dj-brunin-xm-kza-produ%C3%A7%C3%B5es.mp3?alt=media&token=586f8de0-5bc1-489e-8fd6-06d676bd9ec3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'automotivo-bibi-fogosa-slowed-reverb-bbygirl',
        title: "Automotivo Bibi Fogosa Slowed Reverb Bbygirl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fautomotivo-bibi-fogosa-slowed-reverb-bbygirl.mp3?alt=media&token=f1fed8d2-7ea5-4e6e-9486-8c311dcd69cd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'avangard-slowed-lonown',
        title: "Avangard Slowed Lonown",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Favangard-slowed-lonown.mp3?alt=media&token=7503ce60-6c27-4137-b422-a3a83d349171",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'awoo-instrumental-prodbysky',
        title: "Awoo Instrumental Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fawoo-instrumental-prodbysky.mp3?alt=media&token=0c82481f-360d-4b5e-81db-96909a3d4158",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'b2b-charli-xcx',
        title: "B2b Charli Xcx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fb2b-charli-xcx.mp3?alt=media&token=bf943334-8213-471f-a10e-4f46b517f100",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'baby-ludacris-justin-bieber',
        title: "Baby",
        artist: "Ludacris Justin Bieber",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbaby-feat-ludacris-justin-bieber.mp3?alt=media&token=2fb99e13-a77d-4984-836e-7c6f35254503",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'baby-im-yours-irfane-breakbot',
        title: "Baby Im Yours",
        artist: "Irfane Breakbot",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbaby-im-yours-feat-irfane-breakbot.mp3?alt=media&token=0c58ab3a-2f05-4cd4-952b-3b07c05bddac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'babydoll-ari-abdul',
        title: "Babydoll Ari Abdul",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbabydoll-ari-abdul.mp3?alt=media&token=333b471e-816e-497a-9b75-5522a344f0ab",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'babydoll-x-the-perfect-girl-extella',
        title: "Babydoll X The Perfect Girl Extella",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbabydoll-x-the-perfect-girl-extella.mp3?alt=media&token=8899d03f-73c4-4cc3-949a-8dbdd1aee6db",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'babydoll-x-the-perfect-girl-remake-cover-renewwed-capella-ta',
        title: "Babydoll X The Perfect Girl Remake Cover Renewwed Capella Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbabydoll-x-the-perfect-girl-remake-cover-renewwed-capella-tazzy.mp3?alt=media&token=bfd421f0-ee26-476e-aff4-743b1b69bbf8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'babydoll-x-the-perfect-girl-slowed-reverb-slo-twilight-tazzy',
        title: "Babydoll X The Perfect Girl Slowed Reverb Slo Twilight Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbabydoll-x-the-perfect-girl-slowed-reverb-slo-twilight-tazzy.mp3?alt=media&token=d9b62cf4-4232-45b8-a6bf-78201374a78f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'back-it-up-lilbubblegum-letoa',
        title: "Back It Up",
        artist: "Lilbubblegum Letoa",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fback-it-up-feat-lilbubblegum-letoa.mp3?alt=media&token=ccbc5383-b3b2-4aa9-9ade-fa13d32a04d2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-bitch-41-jenn-carter-kyle-richh',
        title: "Bad Bitch 41 Jenn Carter Kyle Richh",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-bitch-41-jenn-carter-kyle-richh.mp3?alt=media&token=1470f0f9-a627-4715-9253-68db33d4167e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-bitch-axaero-aio-holmes',
        title: "Bad Bitch",
        artist: "Axaero Aio Holmes",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-bitch-feat-axaero-aio-holmes.mp3?alt=media&token=7e81f09c-d29b-4302-ba23-9568617c5b5e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-bitch-from-tokyo-intro-pop-smoke',
        title: "Bad Bitch From Tokyo Intro Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-bitch-from-tokyo-intro-pop-smoke.mp3?alt=media&token=80bb0881-978e-46fa-b903-0bdc624d8d20",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-habit-steve-lacy',
        title: "Bad Habit Steve Lacy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-habit-steve-lacy.mp3?alt=media&token=9d9a4a85-6b67-42f9-a630-31fafd9b4f64",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-intentions-slxrppy',
        title: "Bad Intentions Slxrppy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-intentions-slxrppy.mp3?alt=media&token=2e019d11-9508-4c4f-85a6-b8aaf0271765",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-romance-lady-gaga',
        title: "Bad Romance Lady Gaga",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-romance-lady-gaga.mp3?alt=media&token=57a2974c-a9c2-48d7-bea6-c056c291ac1e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bad-time-lil-tecca',
        title: "Bad Time Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbad-time-lil-tecca.mp3?alt=media&token=8ca04ba0-b410-4ca5-b95a-951bda9b51e3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'badman-mixed-kromestar',
        title: "Badman Mixed Kromestar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbadman-mixed-kromestar.mp3?alt=media&token=c85b5533-3060-4485-9b76-50f51bbe02a6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'baila-jazzo-chrxs-beats-bread-beatz',
        title: "Baila JazzãO Chrxs Beats Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbaila-jazz%C3%A3o-chrxs-beats-bread-beatz.mp3?alt=media&token=5dfe767e-31fa-44de-be35-62edf5320131",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'baixo-xxanteria',
        title: "Baixo Xxanteria",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbaixo-xxanteria.mp3?alt=media&token=892361bc-d067-412c-9b43-3faee8f067d2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ballad-neheart',
        title: "Ballad øNeheart",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fballad-%C3%B8neheart.mp3?alt=media&token=542ac08a-bf53-4ae9-b7f1-253c93bfdc1d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ballon-dor-slowed-melly-mike',
        title: "Ballon Dor Slowed Melly Mike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fballon-dor-slowed-melly-mike.mp3?alt=media&token=22f90a07-39f0-47e9-9ae9-5910963070d5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'balmain-miss-madeline-chase-icon',
        title: "Balmain Miss Madeline Chase Icon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbalmain-miss-madeline-chase-icon.mp3?alt=media&token=6ff62ede-b8a0-4667-b5d9-9b172da0516d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bandit-don-toliver',
        title: "Bandit Don Toliver",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbandit-don-toliver.mp3?alt=media&token=2f318155-6f72-4395-9822-abd9ca87785c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bando-makai',
        title: "Bando Makai",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbando-makai.mp3?alt=media&token=47be0340-7d1d-4d4f-b8ed-fc0b3f5a732e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bando-slowed-reverb-sl-twilight-tazzy',
        title: "Bando Slowed Reverb Slō Twilight Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbando-slowed-reverb-sl%C5%8D-twilight-tazzy.mp3?alt=media&token=d5b56afa-4238-4700-bd7c-c9ef808f908c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bang-bang-jessie-j-ariana-grande-nicki-minaj',
        title: "Bang Bang Jessie J Ariana Grande Nicki Minaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbang-bang-jessie-j-ariana-grande-nicki-minaj.mp3?alt=media&token=13d5204d-3163-4a34-b6c3-1c6521538f85",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bang-bang-lil-mabu',
        title: "Bang Bang Lil Mabu",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbang-bang-lil-mabu.mp3?alt=media&token=ec0d6c3e-f40d-4f94-a201-6cfb5c9bbcbb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bangmychest-mo-beats-poodee-headband-andy',
        title: "Bangmychest",
        artist: "Mo Beats Poodee Headband Andy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbangmychest-feat-mo-beats-poodee-headband-andy.mp3?alt=media&token=23ee33c0-56c0-4804-bbbc-f5a184e7da8d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bank-account-21-savage',
        title: "Bank Account 21 Savage",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbank-account-21-savage.mp3?alt=media&token=b5df303e-9ddb-41af-bacd-208caccb9efa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bate-na-bachi-20-ultra-slowed-dj-eu4oria-1nzzident-g2-bem-la',
        title: "Bate Na Bachi 20 Ultra Slowed Dj Eu4oria 1nzzident G2 Bemò Label",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbate-na-bachi-20-ultra-slowed-dj-eu4oria-1nzzident-g2-bem%C3%B2-label.mp3?alt=media&token=3e447240-fc56-46f5-b8a6-92a8a6b383c9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bbw-drake',
        title: "Bbw Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbbw-drake.mp3?alt=media&token=5bc34b8c-d60c-4004-8280-45e2c9102285",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bear-paws-mixed-kysh-records-seigg',
        title: "Bear Paws Mixed Kysh Records Seigg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbear-paws-mixed-kysh-records-seigg.mp3?alt=media&token=60410d71-8172-46a2-b6f5-5834d4d515f1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'beat-it-future-metro-boomin',
        title: "Beat It Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbeat-it-future-metro-boomin.mp3?alt=media&token=0e797a14-2592-451c-b195-5e62b2aa7de9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'beckham-kj-swervo-dee-billz-kyle-richh-kai-swervo',
        title: "Beckham",
        artist: "Kj Swervo Dee Billz Kyle Richh Kai Swervo",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbeckham-feat-kj-swervo-dee-billz-kyle-richh-kai-swervo.mp3?alt=media&token=8293b33d-7504-49a4-9807-f982cef06986",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bed-chem-sabrina-carpenter',
        title: "Bed Chem Sabrina Carpenter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbed-chem-sabrina-carpenter.mp3?alt=media&token=c8f0cc79-3831-4543-9360-2686733b7cb8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'before-i-go-ii-haztik-callon-b',
        title: "Before I Go Ii Haztik Callon B",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbefore-i-go-ii-haztik-callon-b.mp3?alt=media&token=b6df59e3-1589-4127-9f01-984bbcfe70e1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bent-tata-slowed-reverb-41-kyle-richh-jenn-carter',
        title: "Bent",
        artist: "Tata Slowed Reverb 41 Kyle Richh Jenn Carter",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbent-feat-tata-slowed-reverb-41-kyle-richh-jenn-carter.mp3?alt=media&token=b854bcec-3290-4487-92f5-a03af4bf1c6b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bentley-prodbysky',
        title: "Bentley Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbentley-prodbysky.mp3?alt=media&token=30c13303-4345-43ad-8ebe-34561f48eefa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'best-friend-doja-cat-saweetie',
        title: "Best Friend",
        artist: "Doja Cat Saweetie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbest-friend-feat-doja-cat-saweetie.mp3?alt=media&token=ef7862f1-aa69-4f09-a248-9f6bfb9d3f54",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bestill-kim-swear',
        title: "Bestill Kim Swear",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbestill-kim-swear.mp3?alt=media&token=00c691b0-d600-4f1e-bd45-9e6fdb8e5607",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bevlynous-ultra-slowed-ilyhiryu',
        title: "Bevlynous Ultra Slowed Ilyhiryu",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbevlynous-ultra-slowed-ilyhiryu.mp3?alt=media&token=073cb3e6-1e48-48bb-9a4d-4a1f0cc1775a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bible-x3-hardtekk-eclipse',
        title: "Bible X3 Hardtekk Eclipse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbible-x3-hardtekk-eclipse.mp3?alt=media&token=98368caa-851a-424e-92ea-f7efb5c71fb7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'big-dawgs-hanumankind-kalmi',
        title: "Big Dawgs Hanumankind Kalmi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbig-dawgs-hanumankind-kalmi.mp3?alt=media&token=8acfb801-660c-44ae-8f1a-75f31a76fc95",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'big-gangsta-kevin-gates',
        title: "Big Gangsta Kevin Gates",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbig-gangsta-kevin-gates.mp3?alt=media&token=8f2dafd1-307a-4ed3-95f8-b7f70db23d66",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'big-poe-sk8brd-tyler-the-creator-pharrell-williams',
        title: "Big Poe",
        artist: "Sk8brd Tyler The Creator Pharrell Williams",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbig-poe-feat-sk8brd-tyler-the-creator-pharrell-williams.mp3?alt=media&token=35dd698b-b8fd-4279-9399-f531197d2e43",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'big-tonka-lil-uzi-vert-yeat',
        title: "Big Tonka",
        artist: "Lil Uzi Vert Yeat",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbig-tonka-feat-lil-uzi-vert-yeat.mp3?alt=media&token=41905d00-1e76-4527-816c-b1667ec204b7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bigger-thn-everything-yeat',
        title: "Bigger ThëN Everything Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbigger-th%C3%ABn-everything-yeat.mp3?alt=media&token=58139785-7617-4b64-b730-9322bc246e03",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'birds-of-a-feather-billie-eilish',
        title: "Birds Of A Feather Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbirds-of-a-feather-billie-eilish.mp3?alt=media&token=32fb7333-1c3c-4ca2-8745-316597cff410",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bitch-dont-kill-my-vibe-kendrick-lamar',
        title: "Bitch Dont Kill My Vibe Kendrick Lamar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbitch-dont-kill-my-vibe-kendrick-lamar.mp3?alt=media&token=0db6bb0d-d97d-4b51-bc63-8482545b399e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-beatles-gucci-mane-rae-sremmurd',
        title: "Black Beatles",
        artist: "Gucci Mane Rae Sremmurd",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblack-beatles-feat-gucci-mane-rae-sremmurd.mp3?alt=media&token=581a7381-728b-4253-8335-1469409a10dc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-out-days-phantogram',
        title: "Black Out Days Phantogram",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblack-out-days-phantogram.mp3?alt=media&token=72d3d9c1-fce7-43c8-a45a-3d4f9d903e1f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-out-days-slowed-reverb-tell-me-all-the-ways-to-stay-aw',
        title: "Black Out Days Slowed Reverb Tell Me All The Ways To Stay Away Creamy Untrusted 1111 Music Group",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblack-out-days-slowed-reverb-tell-me-all-the-ways-to-stay-away-creamy-untrusted-1111-music-group.mp3?alt=media&token=fa69f1f7-d869-4951-a9b6-fcc34fd5d6ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-out-days-sped-up-phantogram-speed-radio-esteve',
        title: "Black Out Days Sped Up Phantogram Speed Radio Esteve",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblack-out-days-sped-up-phantogram-speed-radio-esteve.mp3?alt=media&token=29cb8c83-c2fd-4b1b-8317-cb4042a7c5ac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-out-days-stay-away-ian-asher-phantogram',
        title: "Black Out Days Stay Away Ian Asher Phantogram",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblack-out-days-stay-away-ian-asher-phantogram.mp3?alt=media&token=e0e43328-a5f0-4e9e-a2b5-825a4ce67dee",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'black-tech-trippin4u-slxrppy',
        title: "Black Tech",
        artist: "Trippin4u Slxrppy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblack-tech-feat-trippin4u-slxrppy.mp3?alt=media&token=0205ccf6-b049-4119-bda4-4c5ff883672f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blackout-snap-slxrppy',
        title: "Blackout Snap Slxrppy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblackout-snap-slxrppy.mp3?alt=media&token=8ef0f6b7-0ffe-4cc7-884b-9172192c36aa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bleach-blvck-svm',
        title: "Bleach Blvck Svm",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbleach-blvck-svm.mp3?alt=media&token=ce39e426-8bdc-4129-ac25-87027c607259",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blinding-lights-the-weeknd',
        title: "Blinding Lights The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblinding-lights-the-weeknd.mp3?alt=media&token=3a416be2-09e4-4e5f-a243-1308dd6ed9f2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bliss-klsr',
        title: "Bliss Klsr",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbliss-klsr.mp3?alt=media&token=affbbed2-b84e-4f26-b3b8-ae56863a00ff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blitz-slowed-reverb-zmajor',
        title: "Blitz Slowed Reverb Zmajor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblitz-slowed-reverb-zmajor.mp3?alt=media&token=1de5df72-229a-44fd-a305-8ab7ff1a27d3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blondie-current-joys',
        title: "Blondie Current Joys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblondie-current-joys.mp3?alt=media&token=552beb23-f7dd-4321-97a8-cfd7e76363a9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bloodonmyhands-flo-milli-tate-mcrae',
        title: "Bloodonmyhands",
        artist: "Flo Milli Tate Mcrae",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbloodonmyhands-feat-flo-milli-tate-mcrae.mp3?alt=media&token=33628d39-c90c-43b7-98c5-b50ef00ecc88",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bloodstained-shawty-ciscaux',
        title: "Bloodstained Shawty Ciscaux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbloodstained-shawty-ciscaux.mp3?alt=media&token=2c37ccce-59f3-4c7c-88bd-eaead156beed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blooming-mvsterious-kirxsha',
        title: "Blooming Mvsterious Kirxsha",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblooming-mvsterious-kirxsha.mp3?alt=media&token=69c4071e-8fc7-4bd4-8f3a-4ec87b260c2d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blow-hoodtrap-mylancore-kryd',
        title: "Blow Hoodtrap Mylancore Kryd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblow-hoodtrap-mylancore-kryd.mp3?alt=media&token=573bc141-e217-4550-9394-356473a988a7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blow-kesha-audio-edit',
        title: "Blow Kesha Audio Edit",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblow-kesha-audio-edit.mp3?alt=media&token=8fea8aef-cc07-4425-8016-2a5a13b42349",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blow-kesha',
        title: "Blow Kesha",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblow-kesha.mp3?alt=media&token=676a8589-d265-4b0c-94ae-8cb5b4ad5de8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blow-the-scene-up-tsuyo-jixplosion-indxgo',
        title: "Blow The Scene Up",
        artist: "Tsuyo Jixplosion Indxgo",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblow-the-scene-up-feat-tsuyo-jixplosion-indxgo.mp3?alt=media&token=a22309b6-9200-43d1-a4a6-a5325051c70f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bludlust-daegho-ngxt',
        title: "Bludlust Daegho Ngxt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbludlust-daegho-ngxt.mp3?alt=media&token=4cb3acd8-666c-40b6-ae58-d06849993409",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blue-billie-eilish',
        title: "Blue Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblue-billie-eilish.mp3?alt=media&token=e9e66541-ccc7-4154-a25a-daa516585b13",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blue-hair-tv-girl',
        title: "Blue Hair Tv Girl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblue-hair-tv-girl.mp3?alt=media&token=cf26282c-cad4-4124-ba8f-c018bae91fd7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blue-strips-hypertechno-sped-up-maxrush-turborave',
        title: "Blue Strips Hypertechno Sped Up Maxrush Turborave",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblue-strips-hypertechno-sped-up-maxrush-turborave.mp3?alt=media&token=6d3078a0-c1f9-4f88-bb32-36141a73606d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blue-strips-jessie-murph',
        title: "Blue Strips Jessie Murph",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblue-strips-jessie-murph.mp3?alt=media&token=b56b377d-cc29-4fda-a27c-6d14bbc120fa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blueberry-faygo-lil-mosey',
        title: "Blueberry Faygo Lil Mosey",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblueberry-faygo-lil-mosey.mp3?alt=media&token=c9bffbda-a5d7-4f59-9638-f3b6dc0a7d2b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'blunt-bitches-lumi-athena',
        title: "Blunt Bitches Lumi Athena",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fblunt-bitches-lumi-athena.mp3?alt=media&token=1eadbda6-2ab7-44e4-b5df-534bf3c5ba6f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'boa-chopped-screwed-megan-thee-stallion',
        title: "Boa Chopped Screwed Megan Thee Stallion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fboa-chopped-screwed-megan-thee-stallion.mp3?alt=media&token=f1655d47-b77f-4832-bfbb-c6a1bd2fbcc4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'body-dysmorphia-eyedress',
        title: "Body Dysmorphia Eyedress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbody-dysmorphia-eyedress.mp3?alt=media&token=0ead1319-42bf-4ef8-bfef-61f6b19d0e10",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'body-cash-cobain-a-boogie-wit-da-hoodie',
        title: "Body",
        artist: "Cash Cobain A Boogie Wit Da Hoodie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbody-feat-cash-cobain-a-boogie-wit-da-hoodie.mp3?alt=media&token=39bbc741-f3b3-4fab-a70e-be111f744c86",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'body-remix-arrdee-e1-3x3-zt-3x3-bugzy-malone-buni-fivio-fore',
        title: "Body Remix",
        artist: "Arrdee E1 3x3 Zt 3x3 Bugzy Malone Buni Fivio Foreign Darkoo Tion Wayne Russ Millions",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbody-remix-feat-arrdee-e1-3x3-zt-3x3-bugzy-malone-buni-fivio-foreign-darkoo-tion-wayne-russ-millions.mp3?alt=media&token=a5f78e55-6911-4dd2-b38b-5e19677a5449",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bon-apptit-migos-katy-perry',
        title: "Bon AppéTit",
        artist: "Migos Katy Perry",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbon-app%C3%A9tit-feat-migos-katy-perry.mp3?alt=media&token=85002e0e-3c89-41dc-b0ee-525ed6be5a98",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bonito-roubo-scythermane-dj-lyvixra-hugomasked',
        title: "Bonito Roubo Scythermane Dj Lyvixra Hugomasked",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbonito-roubo-scythermane-dj-lyvixra-hugomasked.mp3?alt=media&token=5aa1e6a2-16de-4545-be0d-d7515d7a4070",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bonsai-kempachii',
        title: "Bonsai Kempachii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbonsai-kempachii.mp3?alt=media&token=ed43cae9-7400-4614-aba4-8e5b812a1914",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'book-club-ovg',
        title: "Book Club Ovg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbook-club-ovg.mp3?alt=media&token=b8041716-a3fe-4dd2-beff-599326508d48",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bop-aj-gravity',
        title: "Bop Aj Gravity",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbop-aj-gravity.mp3?alt=media&token=683a1fa9-394a-42df-a342-3775c2dac689",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bop-dababy',
        title: "Bop Dababy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbop-dababy.mp3?alt=media&token=ea7aaf53-e0e9-42e0-b9c0-ae11b96e37eb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bop-it-aliyahs-interlude',
        title: "Bop It Aliyahs Interlude",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbop-it-aliyahs-interlude.mp3?alt=media&token=306258a1-5f53-4203-a8e1-438dcb1c8bb5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'boss-bitch-doja-cat',
        title: "Boss Bitch Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fboss-bitch-doja-cat.mp3?alt=media&token=3b33b249-d760-4348-a8a0-41a7dd75ef6d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bought-the-earth-yeat',
        title: "Bought The Earth Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbought-the-earth-yeat.mp3?alt=media&token=13c8d44c-948c-4775-8eac-472bb76e57dc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bounce-i-just-wanna-dance-joyful',
        title: "Bounce I Just Wanna Dance фрози Joyful",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbounce-i-just-wanna-dance-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-joyful.mp3?alt=media&token=15eafd62-cdc9-4b44-80c5-0311de9a23b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bow-bow-bow-f-my-baby-dad-sexyy-red',
        title: "Bow Bow Bow F My Baby Dad Sexyy Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbow-bow-bow-f-my-baby-dad-sexyy-red.mp3?alt=media&token=6b30a329-05a1-409e-bfd5-4a9ae7279208",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'boys-a-liar-pinkpantheress',
        title: "Boys A Liar Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fboys-a-liar-pinkpantheress.mp3?alt=media&token=7200993b-7511-49ec-8439-202859ff663f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'boys-a-liar-pt-2-pinkpantheress-ice-spice',
        title: "Boys A Liar Pt 2 Pinkpantheress Ice Spice",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fboys-a-liar-pt-2-pinkpantheress-ice-spice.mp3?alt=media&token=d6bdba19-b29a-48b1-9159-f8f428966e16",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'brag-aj-gravity',
        title: "Brag Aj Gravity",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbrag-aj-gravity.mp3?alt=media&token=0bc027cd-3b97-4ed7-80d2-1f311726f458",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'brain-diplo-artemas-d00mscrvll',
        title: "Brain Diplo Artemas D00mscrvll",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbrain-diplo-artemas-d00mscrvll.mp3?alt=media&token=c1200504-d651-4149-a0ef-35e40070d8f7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bratz-steve-breaux',
        title: "Bratz Steve Breaux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbratz-steve-breaux.mp3?alt=media&token=80b0843a-89c5-4bfa-bf42-24053b18ba5e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'break-it-off-pinkpantheress',
        title: "Break It Off Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbreak-it-off-pinkpantheress.mp3?alt=media&token=a6c5bb04-ce63-4183-8284-ea72f3ba1f89",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'break-up-with-your-girlfriend-im-bored-ariana-grande',
        title: "Break Up With Your Girlfriend Im Bored Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbreak-up-with-your-girlfriend-im-bored-ariana-grande.mp3?alt=media&token=56796add-359f-4f1b-a90c-781149560417",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'breathe-me-in-mixed-ennio',
        title: "Breathe Me In Mixed Ennio",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbreathe-me-in-mixed-ennio.mp3?alt=media&token=93b2468b-07f3-4c03-beae-e4141f61d26d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'breathe-yeat',
        title: "Breathe Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbreathe-yeat.mp3?alt=media&token=d93f5a8f-4850-4d0c-a77d-bce62a9b7f4e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'breeze-kali-uchis',
        title: "Breeze Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbreeze-kali-uchis.mp3?alt=media&token=d80ad166-5327-4d08-848e-77fa43573034",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bronco-freestyle-jerome-the-prince',
        title: "Bronco Freestyle Jerome The Prince",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbronco-freestyle-jerome-the-prince.mp3?alt=media&token=bbdab640-9011-4779-b687-b51ff1f8257e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'brooklynbloodpop-syko',
        title: "Brooklynbloodpop Syko",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbrooklynbloodpop-syko.mp3?alt=media&token=dd549777-43c4-4ffb-8980-991c697e3902",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'brown-eyes-re6ce',
        title: "Brown Eyes Re6ce",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbrown-eyes-re6ce.mp3?alt=media&token=d5b4a315-17b3-424a-afeb-312fa0234a71",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bruce-wayne-tskinz',
        title: "Bruce Wayne Tskinz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbruce-wayne-tskinz.mp3?alt=media&token=0a006ab8-98da-4c52-9769-98ca7bed212f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bruv-kairo-keyz',
        title: "Bruv Kairo Keyz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbruv-kairo-keyz.mp3?alt=media&token=93fa751f-e79f-4a0c-b17c-a59ece080eaf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bruxo-mistico-lxngvx-dj-moigus',
        title: "Bruxo Mistico Lxngvx Dj Moigus",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbruxo-mistico-lxngvx-dj-moigus.mp3?alt=media&token=8b649eac-80d2-447f-8d76-cf71cb5ca136",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bs-on-the-table-drake-21-savage',
        title: "Bs On The Table Drake 21 Savage",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbs-on-the-table-drake-21-savage.mp3?alt=media&token=26d282f5-a2f2-4fe1-87c6-a5aeb03a0edb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'buban-doll-molly-brazy-cuban-doll',
        title: "Buban Doll Molly Brazy Cuban Doll",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbuban-doll-molly-brazy-cuban-doll.mp3?alt=media&token=cde12871-565a-4d0f-9780-0d12b044ac94",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bubble-gum-clairo',
        title: "Bubble Gum Clairo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbubble-gum-clairo.mp3?alt=media&token=6749a948-82f7-47b4-bda5-02fa74b46093",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bully-freestyle-ice-spice',
        title: "Bully Freestyle Ice Spice",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbully-freestyle-ice-spice.mp3?alt=media&token=8c5e7be1-daac-4d55-9430-dc54e160c7cf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bungee-gum-haarper',
        title: "Bungee Gum Haarper",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbungee-gum-haarper.mp3?alt=media&token=01c2d750-828e-4280-a858-a77f25d974e9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bunny-girl-ciscaux-1nonly',
        title: "Bunny Girl",
        artist: "Ciscaux 1nonly",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbunny-girl-feat-ciscaux-1nonly.mp3?alt=media&token=a5126a97-6850-4105-8bc6-3892e7337a34",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bunny-girl-in-the-franxx-lil-boom-yunglex',
        title: "Bunny Girl In The Franxx",
        artist: "Lil Boom Yunglex",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbunny-girl-in-the-franxx-feat-lil-boom-yunglex.mp3?alt=media&token=9ba6aa7a-df2c-46b6-80ef-6e9d311a07a0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'bunny-shoujo-ovg',
        title: "Bunny Shoujo Ovg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbunny-shoujo-ovg.mp3?alt=media&token=250bfbf6-ebc4-402f-9865-729e70771224",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'burn-juice-wrld',
        title: "Burn Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fburn-juice-wrld.mp3?alt=media&token=44fc12fb-cea6-40ed-a91c-01198f485159",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'burn-kanye-west-ty-dolla-ign',
        title: "Burn Kanye West Ty Dolla Ign",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fburn-kanye-west-ty-dolla-ign.mp3?alt=media&token=a6556e4b-9fe6-4c34-bfa3-9d666b3db6f9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'buster-atori-zoom',
        title: "Buster Atori Zoom",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbuster-atori-zoom.mp3?alt=media&token=a3c4b365-8c0a-4291-9a44-26ef9421d82a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'butterfly-effect-travis-scott',
        title: "Butterfly Effect Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbutterfly-effect-travis-scott.mp3?alt=media&token=07c42d65-1ec9-45b0-82ea-bb6457a74d4a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'byebyewav-sxcredmane',
        title: "Byebyewav Sxcredmane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fbyebyewav-sxcredmane.mp3?alt=media&token=166e8b64-a069-4a7d-8371-55d1378d6f53",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cabo-bankrol-hayden',
        title: "Cabo Bankrol Hayden",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcabo-bankrol-hayden.mp3?alt=media&token=bac2dc4f-6564-4dd0-8af7-0a4709a92915",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cake-by-the-ocean-dnce',
        title: "Cake By The Ocean Dnce",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcake-by-the-ocean-dnce.mp3?alt=media&token=78eaf0f2-10c0-42fd-987a-510a72c49912",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cala-bonita-dj-samir-mc-locked',
        title: "Cala Bonita Dj Samir Mc Locked",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcala-bonita-dj-samir-mc-locked.mp3?alt=media&token=07df5d8b-e1bc-4043-9e96-8eee78428383",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'california-girls-future',
        title: "California Girls Future",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcalifornia-girls-future.mp3?alt=media&token=b6a51626-cc88-4c87-8ddf-01de6879fd25",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'call-me-girl-rarin',
        title: "Call Me Girl Rarin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcall-me-girl-rarin.mp3?alt=media&token=ec0e3c43-1920-4ec6-a5dc-4f5c431aa5ac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'calling-my-phone-lil-tjay-6lack',
        title: "Calling My Phone Lil Tjay 6lack",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcalling-my-phone-lil-tjay-6lack.mp3?alt=media&token=2d47f2b7-4e06-4fae-9a8a-90286c3531f2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'came-a-long-way-moxas',
        title: "Came A Long Way Moxas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcame-a-long-way-moxas.mp3?alt=media&token=bd8b24a3-720c-47a9-9a9d-685ee1deb641",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'came-to-the-party-future-metro-boomin',
        title: "Came To The Party Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcame-to-the-party-future-metro-boomin.mp3?alt=media&token=3843a620-fb1a-4b2a-9d81-f00da24214a0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'can-we-kiss-forever-adriana-proenza-kina',
        title: "Can We Kiss Forever",
        artist: "Adriana Proenza Kina",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcan-we-kiss-forever-feat-adriana-proenza-kina.mp3?alt=media&token=dd9ef7d5-446b-41f6-b597-deb4fc232619",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'can-you-hear-the-music-ludwig-gransson',
        title: "Can You Hear The Music Ludwig GöRansson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcan-you-hear-the-music-ludwig-g%C3%B6ransson.mp3?alt=media&token=b5e86e84-2fb6-4fde-bdf5-5b8e9a159b66",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'can-you-remember-the-rain-elliot-norlander',
        title: "Can You Remember The Rain Elliot Norlander",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcan-you-remember-the-rain-elliot-norlander.mp3?alt=media&token=5ee8bdb2-78c0-4940-99de-689e4090ed7b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cancun-armut-ayparia',
        title: "Cancun Armut Ayparia",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcancun-armut-ayparia.mp3?alt=media&token=615403b6-f6ca-47b8-8d8f-c60a544b6246",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'candy-apple-drip-miss-madeline-chase-icon',
        title: "Candy Apple Drip Miss Madeline Chase Icon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcandy-apple-drip-miss-madeline-chase-icon.mp3?alt=media&token=db61f56e-f7d2-41cb-94c7-289000e19c33",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'candy-doja-cat',
        title: "Candy Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcandy-doja-cat.mp3?alt=media&token=46e0ae2d-c66b-4faa-b63e-f700cf10128a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cannot-give-up-my-soul-e2-hako',
        title: "Cannot Give Up My Soul E2 Hako",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcannot-give-up-my-soul-e2-hako.mp3?alt=media&token=9a830005-b52f-4e44-a2a0-f686b23b4be8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cant-feel-my-face-the-weeknd',
        title: "Cant Feel My Face The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcant-feel-my-face-the-weeknd.mp3?alt=media&token=1494242d-78d2-41a3-a9e0-68591ec1cb21",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cant-feel-myself-dadanny',
        title: "Cant Feel Myself Dadanny",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcant-feel-myself-dadanny.mp3?alt=media&token=a5cfeb10-892c-4d42-a6e7-3af8e82c6228",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canta-la-kvrxd-wexwhvt',
        title: "Canta La Kvrxd Wexwhvt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanta-la-kvrxd-wexwhvt.mp3?alt=media&token=78e7c1d7-ff66-42bc-a7ce-e779579dcf5a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canta-la-slowed-trxshbxy-nxppy-clasyxx-fyex',
        title: "Canta La Slowed Trxshbxy Nxppy Clasyxx Fyex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanta-la-slowed-trxshbxy-nxppy-clasyxx-fyex.mp3?alt=media&token=f85a282c-7438-41c2-9aa4-39f5af71c6ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canta-la-sped-up-trxshbxy-nxppy-clasyxx-fyex',
        title: "Canta La Sped Up Trxshbxy Nxppy Clasyxx Fyex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanta-la-sped-up-trxshbxy-nxppy-clasyxx-fyex.mp3?alt=media&token=6bf0324d-e514-441a-9b5b-d40b8726225b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canta-la-super-slowed-trxshbxy-nxppy-clasyxx-fyex',
        title: "Canta La Super Slowed Trxshbxy Nxppy Clasyxx Fyex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanta-la-super-slowed-trxshbxy-nxppy-clasyxx-fyex.mp3?alt=media&token=339257f7-5d41-4b01-805c-a32491aeb857",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canta-la-trxshbxy-nxppy-clasyxx-fyex',
        title: "Canta La Trxshbxy Nxppy Clasyxx Fyex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanta-la-trxshbxy-nxppy-clasyxx-fyex.mp3?alt=media&token=6da41630-9fe4-4431-8791-a1de3b45fe8c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canta-la-ultra-slowed-trxshbxy-nxppy-clasyxx-fyex',
        title: "Canta La Ultra Slowed Trxshbxy Nxppy Clasyxx Fyex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanta-la-ultra-slowed-trxshbxy-nxppy-clasyxx-fyex.mp3?alt=media&token=5ac9e7c4-1fde-4b64-9e2d-a4fddaf022b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'canto-de-luna-h6itam-dysmane-icedmane',
        title: "Canto De Luna H6itam Dysmane Icedmane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcanto-de-luna-h6itam-dysmane-icedmane.mp3?alt=media&token=8597c74b-be96-409c-a46e-e26b5048098c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'carascene-zachz-winner',
        title: "Carascene фрози Zachz Winner",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcarascene-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-zachz-winner.mp3?alt=media&token=79011916-8fca-47a5-85f0-766853437112",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'carnival-kanye-west-ty-dolla-ign',
        title: "Carnival Kanye West Ty Dolla Ign",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcarnival-kanye-west-ty-dolla-ign.mp3?alt=media&token=71e4dc4f-82a0-4d16-a344-dfd18dfc0934",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'carnival-x-fein-offtopic-afex',
        title: "Carnival X Fein Offtopic Afex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcarnival-x-fein-offtopic-afex.mp3?alt=media&token=0560a4b3-0945-427c-98fa-f3e56b9161f4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ceilings-lizzy-mcalpine',
        title: "Ceilings Lizzy Mcalpine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fceilings-lizzy-mcalpine.mp3?alt=media&token=cb8f4b36-ffd0-4ede-b4da-4fbd132ebc96",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ceilings-slowed-reverb-slo-twilight-tazzy',
        title: "Ceilings Slowed Reverb Slo Twilight Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fceilings-slowed-reverb-slo-twilight-tazzy.mp3?alt=media&token=32072aab-06a4-4517-b74c-3bca0e144aff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ceilings-sped-up-reverb-pearl-fast-forward-tazzy',
        title: "Ceilings Sped Up Reverb Pearl Fast Forward Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fceilings-sped-up-reverb-pearl-fast-forward-tazzy.mp3?alt=media&token=0a7514eb-bd9a-4bee-b214-21e6733667fb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'celestial-angels-slowed-andromeda',
        title: "Celestial Angels Slowed Andromeda",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcelestial-angels-slowed-andromeda.mp3?alt=media&token=e42e77a1-c0b2-46b7-a21c-85f3de57acf7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cendrillon-hatsune-miku-kaito-2019-live-tokyo-philharmonic-o',
        title: "Cendrillon",
        artist: "Hatsune Miku Kaito 2019 Live Tokyo Philharmonic Orchestra",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcendrillon-feat-hatsune-miku-kaito-2019-live-tokyo-philharmonic-orchestra.mp3?alt=media&token=aee31f3f-b923-4dd5-a08d-351cb14a6dc0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'chainaw-remix-remix-nxi',
        title: "Chainaw Remix Remix Nxi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchainaw-remix-remix-nxi.mp3?alt=media&token=71b3a070-acf5-423a-9660-93772cda9ac5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'chamber-of-reflection-mac-demarco',
        title: "Chamber Of Reflection Mac Demarco",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchamber-of-reflection-mac-demarco.mp3?alt=media&token=50db80ad-1b22-4176-a1c9-96beda80c124",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'champions-wc-26-ishowspeed',
        title: "Champions Wc 26 Ishowspeed",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchampions-wc-26-ishowspeed.mp3?alt=media&token=ed69359e-1ae2-44a7-8eb3-138211e7286c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'change-yandere-waifu-lilac',
        title: "Change Yandere Waifu Lilac",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchange-yandere-waifu-lilac.mp3?alt=media&token=16060fd3-e967-4d9b-8cf3-6128285da7e2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cheetah-print-drake-sexyy-red',
        title: "Cheetah Print Drake Sexyy Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcheetah-print-drake-sexyy-red.mp3?alt=media&token=a541bb6e-9615-4317-9857-c0fa16e629be",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'chihiro-billie-eilish',
        title: "Chihiro Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchihiro-billie-eilish.mp3?alt=media&token=b7e91da3-ad38-4d56-a698-34d369661ab0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'chill-bill-j-davi-spooks-rob-tone',
        title: "Chill Bill",
        artist: "J Davi Spooks Rob Tone",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchill-bill-feat-j-davi-spooks-rob-tone.mp3?alt=media&token=bbe2a816-05d0-4ba1-b1e9-e71356c4eb8f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'chinatown-22december-shady-moon',
        title: "Chinatown 22december Shady Moon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchinatown-22december-shady-moon.mp3?alt=media&token=54d9e45a-1452-4f8c-bf88-91f3af97406c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'choke-hold-idris-elba',
        title: "Choke Hold Idris Elba",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fchoke-hold-idris-elba.mp3?alt=media&token=e020b4b6-63c0-4c2c-96a2-04df98bff9f0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cigarettes-juice-wrld',
        title: "Cigarettes Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcigarettes-juice-wrld.mp3?alt=media&token=4d0049ca-f305-4c61-85cc-b1f93a7ceaae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cigarettes-out-the-window-tv-girl',
        title: "Cigarettes Out The Window Tv Girl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcigarettes-out-the-window-tv-girl.mp3?alt=media&token=2c88fb6f-7442-47b0-a739-e2f019ecb7f5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'classic-drake',
        title: "Classic Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fclassic-drake.mp3?alt=media&token=13e7f4ba-4bd7-4ad4-a250-819730fe6e68",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cleared-remix-lilithzplug',
        title: "Cleared Remix Lilithzplug",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcleared-remix-lilithzplug.mp3?alt=media&token=2797c455-77f9-49ad-a2a2-05598b6ee674",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'clima-funk-gxmz-repsaj-dj-k3yve',
        title: "Clima Funk Gxmz Repsaj Dj K3yve",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fclima-funk-gxmz-repsaj-dj-k3yve.mp3?alt=media&token=d16c4cbe-2500-43b6-918b-34f319d359f5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'clima-lindo-gxmz-repsaj',
        title: "Clima Lindo Gxmz Repsaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fclima-lindo-gxmz-repsaj.mp3?alt=media&token=5c5a0dd0-b1f9-48bc-a8ff-3e4100ad20fa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'climax-12k-gotti',
        title: "Climax 12k Gotti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fclimax-12k-gotti.mp3?alt=media&token=71665708-3a21-4a43-8b0d-7f98f05f1c12",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cloud-9-beach-bunny',
        title: "Cloud 9 Beach Bunny",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcloud-9-beach-bunny.mp3?alt=media&token=dfa787b1-7b05-46c5-b29f-b2fc4f3705ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cmon-yeat',
        title: "Cmon Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcmon-yeat.mp3?alt=media&token=0867f73d-414a-49e9-97bc-211ae01b0146",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cold-angelicxmei-miraie',
        title: "Cold",
        artist: "Angelicxmei Miraie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcold-feat-angelicxmei-miraie.mp3?alt=media&token=46282131-c91a-4c75-856e-ca70e97462f1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'com-medo-sayfalse-scythermane',
        title: "Com Medo Sayfalse Scythermane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcom-medo-sayfalse-scythermane.mp3?alt=media&token=137df59e-a4fa-4b3d-9847-e6577559133e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'com-medo-super-slowed-sayfalse-scythermane',
        title: "Com Medo Super Slowed Sayfalse Scythermane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcom-medo-super-slowed-sayfalse-scythermane.mp3?alt=media&token=335fa29e-20be-4378-8b3a-c81720d90e53",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'come-go-juice-wrld-marshmello',
        title: "Come Go Juice Wrld Marshmello",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcome-go-juice-wrld-marshmello.mp3?alt=media&token=abd4a137-1fe8-4bb9-9464-41b7dfe4f7b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'come-here-22-dec',
        title: "Come Here 22 Dec",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcome-here-22-dec.mp3?alt=media&token=0d0edb4b-abb0-4c11-9773-09448b35c81d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'come-thru-shady-moon-ciscaux-1nonly',
        title: "Come Thru",
        artist: "Shady Moon Ciscaux 1nonly",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcome-thru-feat-shady-moon-ciscaux-1nonly.mp3?alt=media&token=191e24f3-e522-477f-a464-4de5c2ffacf5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'comeback-imis-pay4n',
        title: "Comeback Imis Pay4n",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcomeback-imis-pay4n.mp3?alt=media&token=e155472a-c147-4ae2-9565-f37273fa7e9b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'coming-down-original-the-weeknd',
        title: "Coming Down Original The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcoming-down-original-the-weeknd.mp3?alt=media&token=ed084c6c-e321-4aa4-8ba6-9d8d51be5552",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'coming-down-x-hotline-bling-skyemane',
        title: "Coming Down X Hotline Bling Skyemane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcoming-down-x-hotline-bling-skyemane.mp3?alt=media&token=d14524bc-1a37-4a9c-a9e9-6ba8b8edbb10",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'com-n-go-yeat',
        title: "Comë N Go Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcom%C3%AB-n-go-yeat.mp3?alt=media&token=f6d160ac-050c-48b1-b1d7-3c661dd8c0b1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'confident-chance-the-rapper-justin-bieber',
        title: "Confident",
        artist: "Chance The Rapper Justin Bieber",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fconfident-feat-chance-the-rapper-justin-bieber.mp3?alt=media&token=e75b31d3-1083-4a0d-abc2-a06a13c2a687",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'congratulations-drake',
        title: "Congratulations Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcongratulations-drake.mp3?alt=media&token=9e51d6ec-96b8-457d-b93f-55835c272c6d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'congratulations-jarononthebeat-haztik',
        title: "Congratulations",
        artist: "Jarononthebeat Haztik",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcongratulations-feat-jarononthebeat-haztik.mp3?alt=media&token=43322778-31c7-41d0-b15d-cdd68e96ece0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'congratulations-quavo-post-malone',
        title: "Congratulations",
        artist: "Quavo Post Malone",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcongratulations-feat-quavo-post-malone.mp3?alt=media&token=c2b13993-e354-4e56-8d63-309d57e17a7d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'conversations-juice-wrld',
        title: "Conversations Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fconversations-juice-wrld.mp3?alt=media&token=116299e7-b7d2-410f-a954-882a3b506a48",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'count-my-bandz-rich-amiri',
        title: "Count My Bandz Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcount-my-bandz-rich-amiri.mp3?alt=media&token=b09ad0e9-8259-43da-896e-758f9ab3ca50",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'counting-stars-sped-up-syrex-eqric-pharah-timmy-commerford-s',
        title: "Counting Stars Sped Up",
        artist: "Syrex Eqric PharaøH Timmy Commerford Sped Up Mage",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcounting-stars-sped-up-feat-syrex-eqric-phara%C3%B8h-timmy-commerford-sped-up-mage.mp3?alt=media&token=d1e8504b-3021-433c-bac6-260815d94034",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cowbell-warrior-sxmpra',
        title: "Cowbell Warrior Sxmpra",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcowbell-warrior-sxmpra.mp3?alt=media&token=e9d943d2-4881-42bc-9aae-741946adc268",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'craveme-mxlu',
        title: "Craveme Mxlu",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcraveme-mxlu.mp3?alt=media&token=34ffe1cc-2859-4723-bbb8-13592f36e574",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cravin-stileto-kendyle-paige',
        title: "Cravin Stileto Kendyle Paige",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcravin-stileto-kendyle-paige.mp3?alt=media&token=7fb66d48-9561-4b1a-9069-a37ebcb96dcf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crazy-clientele-future-metro-boomin',
        title: "Crazy Clientele Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrazy-clientele-future-metro-boomin.mp3?alt=media&token=523a926f-0242-4937-beae-e2e7fbef4dbb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crazy-slowed-reverb-ver-le-sserafim',
        title: "Crazy Slowed Reverb Ver Le Sserafim",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrazy-slowed-reverb-ver-le-sserafim.mp3?alt=media&token=6e74c574-4c59-453f-baee-8588d145b8cc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crazy-story-20-lil-durk-king-von',
        title: "Crazy Story 20",
        artist: "Lil Durk King Von",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrazy-story-20-feat-lil-durk-king-von.mp3?alt=media&token=d4259576-7170-4652-afa7-d116b1128b50",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crazy-story-lil-durk-remix-remix-king-von',
        title: "Crazy Story",
        artist: "Lil Durk Remix Remix King Von",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrazy-story-feat-lil-durk-remix-remix-king-von.mp3?alt=media&token=e2db43d9-29d7-4915-b472-c870de2ce9e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crazy-story-king-von',
        title: "Crazy Story King Von",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrazy-story-king-von.mp3?alt=media&token=7301c918-cc8d-4d78-ac3d-382098daae6f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crazy-story-pt-3-king-von',
        title: "Crazy Story Pt 3 King Von",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrazy-story-pt-3-king-von.mp3?alt=media&token=da2156d4-beaa-4625-a178-a4748eba67ce",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'creepin-metro-boomin-the-weeknd-21-savage',
        title: "Creepin Metro Boomin The Weeknd 21 Savage",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcreepin-metro-boomin-the-weeknd-21-savage.mp3?alt=media&token=caf0cac3-5fac-415b-ac65-21444e416afa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cross-my-heart-artemas',
        title: "Cross My Heart Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcross-my-heart-artemas.mp3?alt=media&token=2f224e27-d241-4349-98fd-0c93c189993a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crossed-out-future-metro-boomin',
        title: "Crossed Out Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrossed-out-future-metro-boomin.mp3?alt=media&token=e25ec241-a9d7-4a17-854e-c596ee6888a2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crsh-travis-scott-strick',
        title: "Crsh",
        artist: "Travis Scott Strick",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrsh-feat-travis-scott-strick.mp3?alt=media&token=69b22524-0db8-49e8-9443-0d8b86f0b2bf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crush-aturn-slevpy808',
        title: "Crush",
        artist: "Aturn Slevpy808",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrush-feat-aturn-slevpy808.mp3?alt=media&token=635ca3c8-884c-4f5a-b37f-c34634611363",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cryst4l-darkxhawk',
        title: "Cryst4l Darkxhawk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcryst4l-darkxhawk.mp3?alt=media&token=5efe2f6c-3e31-48fa-8041-ede7c2228d11",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'crystals-isolateexe',
        title: "Crystals Isolateexe",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcrystals-isolateexe.mp3?alt=media&token=97ad1740-5d1b-430e-9434-71de754b3e2e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cul-de-sac-mills',
        title: "Cul De Sac Mills",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcul-de-sac-mills.mp3?alt=media&token=99102f56-4bf3-43ad-85a5-21359c627a4c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cupid-twin-ver-live-studio-version-ot4-fifty-fifty',
        title: "Cupid Twin Ver Live Studio Version Ot4 Fifty Fifty",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcupid-twin-ver-live-studio-version-ot4-fifty-fifty.mp3?alt=media&token=ef683490-27b2-4f84-b3b7-5ba479f3bc4a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cupid-twin-version-fifty-fifty',
        title: "Cupid Twin Version Fifty Fifty",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcupid-twin-version-fifty-fifty.mp3?alt=media&token=49eb1f8f-452c-4e17-ac44-2b65bea596df",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'cyber-sex-doja-cat',
        title: "Cyber Sex Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fcyber-sex-doja-cat.mp3?alt=media&token=cf110a03-8aec-4104-aa57-511c52a71727",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'daddy-sexyy-red-tokischa',
        title: "Daddy",
        artist: "Sexyy Red Tokischa",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdaddy-feat-sexyy-red-tokischa.mp3?alt=media&token=d0811121-1400-4b11-b938-ec625cfc4f94",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'daggers-kali-uchis',
        title: "Daggers Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdaggers-kali-uchis.mp3?alt=media&token=8652e6aa-acca-42d5-9e61-8732a5a8731b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'daly-daly-slowed-nomi-xd-eekinomia',
        title: "Daly Daly Slowed Nomi Xd Eekinomia",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdaly-daly-slowed-nomi-xd-eekinomia.mp3?alt=media&token=7f54b655-6c1a-4bae-8259-e1ef4c594aff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dance-deyluvkirby-eddyoetty',
        title: "Dance Deyluvkirby Eddyoetty фрози",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdance-deyluvkirby-eddyoetty-%D1%84%D1%80%D0%BE%D0%B7%D0%B8.mp3?alt=media&token=0dd47128-aee6-45fb-baa8-6d4abfb8ebf0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dance-ciscaux-wassup-rocker-1nonly',
        title: "Dance",
        artist: "Ciscaux Wassup Rocker 1nonly",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdance-feat-ciscaux-wassup-rocker-1nonly.mp3?alt=media&token=4ede438c-1e59-47de-a5e1-0760eeb7e7f4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dancin-krono-remix-luvli-aaron-smith',
        title: "Dancin Krono Remix",
        artist: "Luvli Aaron Smith",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdancin-krono-remix-feat-luvli-aaron-smith.mp3?alt=media&token=6bf52ce0-ff30-4a13-ae5b-e8070c532563",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dare-sayfalse-trxveler-dj-alim',
        title: "Dare Sayfalse Trxveler Dj Alim",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdare-sayfalse-trxveler-dj-alim.mp3?alt=media&token=c6141a0e-08e9-49c9-aafa-c05170664331",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dare-slowed-sayfalse-trxveler-dj-alim',
        title: "Dare Slowed Sayfalse Trxveler Dj Alim",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdare-slowed-sayfalse-trxveler-dj-alim.mp3?alt=media&token=21b17cb9-dad2-4e79-8e48-384af6b286fe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-aria-hiroyuki-sawano',
        title: "Dark Aria Hiroyuki Sawano",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-aria-hiroyuki-sawano.mp3?alt=media&token=21371302-a5d6-43f8-b22d-dbd9b310611e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-aria-lv2-xai-sawanohiroyukinzk',
        title: "Dark Aria Lv2",
        artist: "Xai Sawanohiroyukinzk",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-aria-lv2-feat-xai-sawanohiroyukinzk.mp3?alt=media&token=e71ea9e8-896b-4176-9cb8-1d030497d8f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-beach-pastel-ghost',
        title: "Dark Beach Pastel Ghost",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-beach-pastel-ghost.mp3?alt=media&token=6f0acb07-8f7a-442f-9f7f-eb8124be458d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-beach-slowed-reverb-sl-twilight-tazzy',
        title: "Dark Beach Slowed Reverb Slō Twilight Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-beach-slowed-reverb-sl%C5%8D-twilight-tazzy.mp3?alt=media&token=ae95c75d-3fe4-4fd3-a5d1-b7a84638b8df",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-hole-super-slowed-inxky',
        title: "Dark Hole Super Slowed Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-hole-super-slowed-inxky.mp3?alt=media&token=d7820c56-e2cc-4758-b74d-740f580791d1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-red-steve-lacy',
        title: "Dark Red Steve Lacy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-red-steve-lacy.mp3?alt=media&token=25916d3b-a238-474b-9cfd-5544be0769f0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dark-side-of-the-moon-suisside',
        title: "Dark Side Of The Moon Suisside",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdark-side-of-the-moon-suisside.mp3?alt=media&token=1c603e8e-d43d-409a-9f86-14dfa3e54d03",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'day-after-day-rich-amiri',
        title: "Day After Day Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fday-after-day-rich-amiri.mp3?alt=media&token=3ea10016-a4d5-4aa3-ae12-5111063f6ea6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ddlg-ppcocaine',
        title: "Ddlg Ppcocaine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fddlg-ppcocaine.mp3?alt=media&token=6837d75f-5c28-4d96-af5b-bc35c38bddc0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dead-fresh-lil-baby',
        title: "Dead Fresh Lil Baby",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdead-fresh-lil-baby.mp3?alt=media&token=3f2e100a-c7c8-4492-a962-ea54fa713c37",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dear-god-tate-mcrae',
        title: "Dear God Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdear-god-tate-mcrae.mp3?alt=media&token=74270e7c-d252-44ab-9bac-638c5c3002a6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'death-is-no-more-slowed-blessed-mane',
        title: "Death Is No More Slowed Blessed Mane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeath-is-no-more-slowed-blessed-mane.mp3?alt=media&token=fa7650ee-81f2-4df2-8b0f-0339fbd72bea",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'death-lotto-ovg-grioten',
        title: "Death Lotto Ovg Grioten",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeath-lotto-ovg-grioten.mp3?alt=media&token=67985df1-3736-4b9a-9346-47f1f03f2c57",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'death-lotto-remix-sadfriendd-ovg-grioten',
        title: "Death Lotto Remix Sadfriendd Ovg Grioten",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeath-lotto-remix-sadfriendd-ovg-grioten.mp3?alt=media&token=1df0e58c-ffad-4882-ad3f-982014b499f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'death-of-alzamalir-slowed-reverb-ilyhiryu',
        title: "Death Of Alzamalir Slowed Reverb Ilyhiryu",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeath-of-alzamalir-slowed-reverb-ilyhiryu.mp3?alt=media&token=a98cfa16-ea0e-4869-b7a6-20c8ee633bc8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'deep-down-youngboy-never-broke-again',
        title: "Deep Down Youngboy Never Broke Again",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeep-down-youngboy-never-broke-again.mp3?alt=media&token=0b1b683f-2fe9-45e8-80a5-5526de2876a5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'deixa-rolar-eternxlkz',
        title: "Deixa Rolar Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeixa-rolar-eternxlkz.mp3?alt=media&token=66295f3a-528b-408d-baab-85581622eb64",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'demon-king-jamar-rose-haztik',
        title: "Demon King",
        artist: "Jamar Rose Haztik",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdemon-king-feat-jamar-rose-haztik.mp3?alt=media&token=4c8b17c1-87e1-4340-a46e-4ca45d336f80",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'demons-doja-cat',
        title: "Demons Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdemons-doja-cat.mp3?alt=media&token=0132bc70-1a75-4b0b-a8c0-9dfc0f97a468",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'denial-ptasinski-rj-pasin',
        title: "Denial Ptasinski Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdenial-ptasinski-rj-pasin.mp3?alt=media&token=3b88eea8-3715-4531-ab16-ba1a5e03ba50",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'denk-zu-viel-nach-ufo361',
        title: "Denk Zu Viel Nach Ufo361",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdenk-zu-viel-nach-ufo361.mp3?alt=media&token=2bf3df6a-ed1f-4d92-bd2a-869ab94c75b5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'deseo-insaciable-tessareims-ruido-con-h-remix-mixed-dj-fucci',
        title: "Deseo Insaciable",
        artist: "Tessareims Ruido Con H Remix Mixed Dj Fucci",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeseo-insaciable-feat-tessareims-ruido-con-h-remix-mixed-dj-fucci.mp3?alt=media&token=f09b259d-925a-4f0e-999e-b5a9f5ac8a3f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'deseo-insaciable-tessareims-ruido-con-h-remix-mixed-dj-fucci',
        title: "Deseo Insaciable",
        artist: "Tessareims Ruido Con H Remix Mixed Dj Fucci",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdeseo-insaciable-feat-tessareims-ruido-con-h-remix-mixed-dj-fucci.mp3?alt=media&token=4567dee0-9ac7-454e-a913-a02c1f7ccb54",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dia-delcia-nakama-mc-staff-p',
        title: "Dia DelíCia Nakama Mc Staff σP",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdia-del%C3%ADcia-nakama-mc-staff-%CF%83p.mp3?alt=media&token=bce6e1ef-8426-44c6-b87d-0b7f5c9b196a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'diamonds-pearls-qkreign-vaporgod',
        title: "Diamonds Pearls Qkreign Vaporgod",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdiamonds-pearls-qkreign-vaporgod.mp3?alt=media&token=577aef42-086e-4a43-b07c-a16f836eb48f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'diamondz-n-roses-vaporgod',
        title: "Diamondz N Roses Vaporgod",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdiamondz-n-roses-vaporgod.mp3?alt=media&token=b1be8791-92f9-4a6f-bb61-edafea5228e0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'did-i-tell-u-that-i-miss-u-adore',
        title: "Did I Tell U That I Miss U Adore",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdid-i-tell-u-that-i-miss-u-adore.mp3?alt=media&token=3d93a342-ed04-438f-bbd1-5712ffc44413",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'did-it-again-lil-tecca',
        title: "Did It Again Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdid-it-again-lil-tecca.mp3?alt=media&token=5d0013d3-9a98-41cf-a233-7af3d2eeee8a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'did-it-first-ice-spice-central-cee',
        title: "Did It First Ice Spice Central Cee",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdid-it-first-ice-spice-central-cee.mp3?alt=media&token=b557057a-e379-45f6-ab66-64b3b44df728",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'did-it-first-instrumental-slowed-skyemane',
        title: "Did It First Instrumental Slowed Skyemane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdid-it-first-instrumental-slowed-skyemane.mp3?alt=media&token=7ab8b1b6-3d99-4770-8f27-8ebb728b8e09",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'did-it-first-slowed-down-ice-spice',
        title: "Did It First Slowed Down Ice Spice",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdid-it-first-slowed-down-ice-spice.mp3?alt=media&token=14765b17-0b30-476d-bce6-9a037bf9d53e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'died-once-guitar-remix-aamadux',
        title: "Died Once Guitar Remix Aamadux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdied-once-guitar-remix-aamadux.mp3?alt=media&token=cc38c311-8031-45f9-8e30-fcfbf5a1239b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'died-once-hallsking',
        title: "Died Once Hallsking",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdied-once-hallsking.mp3?alt=media&token=63256821-4d8c-4315-82d4-0788a9f7e31b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dimension-shift-kid-sora-miraie',
        title: "Dimension Shift",
        artist: "Kid Sora Miraie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdimension-shift-feat-kid-sora-miraie.mp3?alt=media&token=5bea6a73-08d8-4dae-9804-2c43fdac5477",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dior-bonus-pop-smoke',
        title: "Dior Bonus Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdior-bonus-pop-smoke.mp3?alt=media&token=6f8eaf30-dc3f-4623-8754-d73c1784b93a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dior-pop-smoke',
        title: "Dior Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdior-pop-smoke.mp3?alt=media&token=d6c344dd-a641-4326-9d9b-3faa18d88d58",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'distance-rarin',
        title: "Distance Rarin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdistance-rarin.mp3?alt=media&token=6674bf98-11fd-4848-aa61-54d7c562c6b2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dive-in-jeleel',
        title: "Dive In Jeleel",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdive-in-jeleel.mp3?alt=media&token=ced2b542-e5fe-4091-afd0-afbda07e6f23",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'do-it-civ',
        title: "Do It Civ",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdo-it-civ.mp3?alt=media&token=89709e80-149a-42ff-9435-3c4094803710",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-copy-my-flow-luke-willies',
        title: "Dont Copy My Flow Luke Willies",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-copy-my-flow-luke-willies.mp3?alt=media&token=b46b33fc-c5ca-4b1d-a4a2-595d9733b202",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-copy-my-flow-mwizz-george-kipa',
        title: "Dont Copy My Flow фрози Mwizz George Kipa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-copy-my-flow-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-mwizz-george-kipa.mp3?alt=media&token=96dc696a-3e1a-405f-9e89-67837b9310c4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-make-me-rich-amiri',
        title: "Dont Make Me Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-make-me-rich-amiri.mp3?alt=media&token=363cc4c3-bd79-4263-9ce2-73396a5a6f5d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-make-them-like-me-isabel-larosa',
        title: "Dont Make Them Like Me Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-make-them-like-me-isabel-larosa.mp3?alt=media&token=dc961fc8-2510-43f9-a43a-0c404e320e8b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-make-them-like-me',
        title: "Dont Make Them Like Me",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-make-them-like-me.mp3?alt=media&token=f8c9865e-8460-4534-95a9-12d6c8a41db1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-tap-that-glass-tweakin-tyler-the-creator',
        title: "Dont Tap That Glass Tweakin Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-tap-that-glass-tweakin-tyler-the-creator.mp3?alt=media&token=7c2aabab-9d5d-4444-9931-4315769199f4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-worry-drake',
        title: "Dont Worry Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-worry-drake.mp3?alt=media&token=c50afacf-bb4e-458a-ac5a-5c700804c313",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dont-you-worry-baby-madison-mcferrin-tyler-the-creator',
        title: "Dont You Worry Baby",
        artist: "Madison Mcferrin Tyler The Creator",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdont-you-worry-baby-feat-madison-mcferrin-tyler-the-creator.mp3?alt=media&token=e9b42223-229e-425f-9a2e-ab27ea15cc4d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'doodle-zachz-winner',
        title: "Doodle Zachz Winner",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdoodle-zachz-winner.mp3?alt=media&token=16b7f3b3-7c4d-4bf9-8ae5-447d518e9a72",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'door-to-dusk-odetari',
        title: "Door To Dusk Odetari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdoor-to-dusk-odetari.mp3?alt=media&token=8aa54463-7400-486a-8457-816835cf63ac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'double-life-from-despicable-me-4-pharrell-williams',
        title: "Double Life From Despicable Me 4 Pharrell Williams",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdouble-life-from-despicable-me-4-pharrell-williams.mp3?alt=media&token=8e17613b-17a2-4a45-b49a-f4d748356a7c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'down-with-me-lil-tecca',
        title: "Down With Me Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdown-with-me-lil-tecca.mp3?alt=media&token=9a9ff112-dfb4-4057-abb4-54c42c8167b8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'downstream-ptasinski-rj-pasin',
        title: "Downstream Ptasinski Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdownstream-ptasinski-rj-pasin.mp3?alt=media&token=ad8aa347-2580-485c-897d-0f6a2c53014e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'doyalike-mikeeysmind',
        title: "Doyalike Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdoyalike-mikeeysmind.mp3?alt=media&token=72f50c49-d867-40e7-a2ca-9d0a40a469d9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'doyalike-slowed-mikeeysmind',
        title: "Doyalike Slowed Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdoyalike-slowed-mikeeysmind.mp3?alt=media&token=95dede1b-aa0b-4e2e-a8de-3d3cfb8f9b80",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dracula-with-jennie-tame-impala',
        title: "Dracula With Jennie Tame Impala",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdracula-with-jennie-tame-impala.mp3?alt=media&token=042ab500-1d90-4750-af81-4847434b3cb6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'drake-nokia-official-music-video',
        title: "Drake Nokia Official Music Video",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdrake-nokia-official-music-video.mp3?alt=media&token=da638b4e-2e70-4367-b6d6-907accfee24d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'drankin-n-smokin-future-lil-uzi-vert',
        title: "Drankin N Smokin Future Lil Uzi Vert",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdrankin-n-smokin-future-lil-uzi-vert.mp3?alt=media&token=5c0b2bd5-86f7-4202-9eae-9a0e51e6c68f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dream-girl-crisaunt',
        title: "Dream Girl Crisaunt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdream-girl-crisaunt.mp3?alt=media&token=73432015-34ec-4b90-97fd-5ebc8c943502",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dream-girl-grioten-jelex',
        title: "Dream Girl Grioten Jelex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdream-girl-grioten-jelex.mp3?alt=media&token=d3c7f186-717b-4c06-9b2e-6a41be00e756",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dreamin-partynextdoor',
        title: "Dreamin Partynextdoor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdreamin-partynextdoor.mp3?alt=media&token=4a41e9ac-9928-4fee-9031-4fcdabc11db8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dress-2-eternxlkz',
        title: "Dress 2 Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdress-2-eternxlkz.mp3?alt=media&token=cd579d6c-5468-4315-81cd-71ca4135fd25",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dress-over-slowed-reverb-eternxlkz',
        title: "Dress Over Slowed Reverb Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdress-over-slowed-reverb-eternxlkz.mp3?alt=media&token=023c844d-1e97-4008-a96f-2a8eeecebe1d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'drink-n-dance-future-metro-boomin',
        title: "Drink N Dance Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdrink-n-dance-future-metro-boomin.mp3?alt=media&token=1cc9bef4-304e-48ff-836e-d78090dbf917",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'drip-or-drown-gunna',
        title: "Drip Or Drown Gunna",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdrip-or-drown-gunna.mp3?alt=media&token=a9679c28-b4e8-40bb-b2a3-660bea752e30",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'drug-damage-septembersrich',
        title: "Drug Damage Septembersrich",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdrug-damage-septembersrich.mp3?alt=media&token=9c69b97e-e1b8-437d-bae4-4552fc993710",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dumb-luck-404vincent',
        title: "Dumb Luck 404vincent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdumb-luck-404vincent.mp3?alt=media&token=c938aa5d-f56d-49d5-ba60-1e781a6a4df3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dungeon-hiroyuki-sawano',
        title: "Dungeon Hiroyuki Sawano",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdungeon-hiroyuki-sawano.mp3?alt=media&token=dd039579-c3a5-46cf-afc8-3ea447292b88",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'dust-drake',
        title: "Dust Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fdust-drake.mp3?alt=media&token=1c1473c1-5f04-4862-a912-3a7d08026eca",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'duvet-ba',
        title: "Duvet BôA",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fduvet-b%C3%B4a.mp3?alt=media&token=00a838a9-8151-408a-91db-30f7adfeae4f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'echo-the-boyz',
        title: "Echo The Boyz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fecho-the-boyz.mp3?alt=media&token=a274ea32-5639-42fb-8d91-f143db798dcd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'eclipse-vacra',
        title: "Eclipse Vacra",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feclipse-vacra.mp3?alt=media&token=553d1c6f-ea49-415c-9e2c-45621921b9a1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ecstacy-slowed-suicidal-idol',
        title: "Ecstacy Slowed Suicidal Idol",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fecstacy-slowed-suicidal-idol.mp3?alt=media&token=552349eb-d87f-4594-92db-07e1f2f33847",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'eeyuh-hr',
        title: "Eeyuh Hr",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feeyuh-hr.mp3?alt=media&token=40600bf5-3545-445d-8735-2d6944c3a516",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ego-ogryzek',
        title: "Ego Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fego-ogryzek.mp3?alt=media&token=7f1c0a81-896e-4d46-a9ae-a3ce33288a5f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ego-slowed-ogryzek',
        title: "Ego Slowed Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fego-slowed-ogryzek.mp3?alt=media&token=ff99fe06-002c-43f1-9f6d-6d85fa942871",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ego-sped-up-ogryzek',
        title: "Ego Sped Up Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fego-sped-up-ogryzek.mp3?alt=media&token=c15d1320-2744-48dd-92af-b9129aeef3d4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ego-super-slowed-ogryzek',
        title: "Ego Super Slowed Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fego-super-slowed-ogryzek.mp3?alt=media&token=d0524218-382a-4d32-b090-23c4349213e0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'egotistical-800pts-sped-up-hako',
        title: "Egotistical",
        artist: "800pts Sped Up Hako",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fegotistical-feat-800pts-sped-up-hako.mp3?alt=media&token=ff831cd9-e331-491a-a273-e5e1a06d3f0d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ela-joga-na-hora-mc-pogba-dj-guih-da-zo',
        title: "Ela Joga Na Hora Mc Pogba Dj Guih Da Zo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fela-joga-na-hora-mc-pogba-dj-guih-da-zo.mp3?alt=media&token=cd9aa4ab-d4c7-4ab9-b5df-99f772d63050",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ela-muda-ogryzek-stxrby-axelitohmn',
        title: "Ela Muda Ogryzek StxrbøY Axelitohmn",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fela-muda-ogryzek-stxrb%C3%B8y-axelitohmn.mp3?alt=media&token=8be86b47-0146-4826-a506-6b594d623092",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'element-pop-smoke',
        title: "Element Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Felement-pop-smoke.mp3?alt=media&token=695535ad-ea79-4bc2-8c5d-eef4096182cb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'eloy-super-slowed-nvxus',
        title: "Eloy Super Slowed Nvxus",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feloy-super-slowed-nvxus.mp3?alt=media&token=75cfc910-16b6-4624-8ede-3588cf7cdb8e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'embrace-it-ndotz',
        title: "Embrace It Ndotz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fembrace-it-ndotz.mp3?alt=media&token=a7af4d39-9b7a-4cff-a7db-8e52a8a244ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'embrace-pastel-ghost',
        title: "Embrace Pastel Ghost",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fembrace-pastel-ghost.mp3?alt=media&token=ad4af60e-02eb-4903-b121-557f5dcc6723",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'emo-boy-ayesha-erotica',
        title: "Emo Boy Ayesha Erotica",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Femo-boy-ayesha-erotica.mp3?alt=media&token=1d992093-f4c4-4385-8641-a535e5c87b9b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'empire-ogryzek',
        title: "Empire Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fempire-ogryzek.mp3?alt=media&token=6b147bb4-f32d-43ed-afd9-419ebac6c8a6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'emptiness-falxce',
        title: "Emptiness Falxce",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Femptiness-falxce.mp3?alt=media&token=8c4f4245-48d5-46e4-9f68-3aa8b6af5e7d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'emptiness-nvd',
        title: "Emptiness Nvd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Femptiness-nvd.mp3?alt=media&token=1501b3e6-9ae3-4d1a-b0fe-4230723601c0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'empty-dreams-cypariss',
        title: "Empty Dreams Cypariss",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fempty-dreams-cypariss.mp3?alt=media&token=d3da3f23-7ac6-4828-af98-31a7c397d415",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'end-of-beginning-djo',
        title: "End Of Beginning Djo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fend-of-beginning-djo.mp3?alt=media&token=60909852-7e25-4350-bd05-f504584884dc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'enough-eternxlkz',
        title: "Enough Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fenough-eternxlkz.mp3?alt=media&token=559bf901-b89e-46cf-8bb4-2a19f8756c36",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'epidemic-polo-g',
        title: "Epidemic Polo G",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fepidemic-polo-g.mp3?alt=media&token=fa1b65d2-7aef-48c6-a473-24414322cfab",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'escape-nemzzz',
        title: "Escape Nemzzz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fescape-nemzzz.mp3?alt=media&token=b3d05e04-9560-4e1c-8fcc-ce90af2eafa8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'espao-liminal-slowed-nxght-scythermane-mc-caja-kgj',
        title: "EspaçO Liminal Slowed Nxght Scythermane Mc Caja Kgj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fespa%C3%A7o-liminal-slowed-nxght-scythermane-mc-caja-kgj.mp3?alt=media&token=82738af7-5eb3-4d75-8545-8d73dda1d893",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'espresso-sabrina-carpenter',
        title: "Espresso Sabrina Carpenter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fespresso-sabrina-carpenter.mp3?alt=media&token=c58dcff2-4599-4362-ae97-0937f5339d14",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'esse-cara-sayfalse-scythermane-trxshbxy',
        title: "Esse Cara Sayfalse Scythermane Trxshbxy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fesse-cara-sayfalse-scythermane-trxshbxy.mp3?alt=media&token=c943e273-2268-4a8f-af85-6ed68f7b67d7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'estrella-inxky',
        title: "Estrella Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Festrella-inxky.mp3?alt=media&token=93877ca5-d65f-4315-a02e-d47273951d81",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'estrella-slowed-inxky',
        title: "Estrella Slowed Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Festrella-slowed-inxky.mp3?alt=media&token=785e4125-e653-45ad-9d96-019233715a56",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'estrella-super-slowed-inxky',
        title: "Estrella Super Slowed Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Festrella-super-slowed-inxky.mp3?alt=media&token=d5aeecbc-1478-4582-b152-7199ed669f51",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'estrella-ultra-slowed-inxky',
        title: "Estrella Ultra Slowed Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Festrella-ultra-slowed-inxky.mp3?alt=media&token=a5697b3a-9012-49ad-a6e3-af8e400559e1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'eu-fim-nueki',
        title: "Eu Fim Nueki",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feu-fim-nueki.mp3?alt=media&token=05dc5486-c38a-4f84-8066-3043493ea945",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'eu-sento-gabu-pxlwyse',
        title: "Eu Sento Gabu Pxlwyse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feu-sento-gabu-pxlwyse.mp3?alt=media&token=b24917e3-11c3-468a-922e-421be8001569",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'evergreen-richy-mitch-the-coal-miners',
        title: "Evergreen Richy Mitch The Coal Miners",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fevergreen-richy-mitch-the-coal-miners.mp3?alt=media&token=c6038217-05b5-4f90-898d-f7a1fb53d13a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'every-chance-i-get-lil-baby-lil-durk-dj-khaled',
        title: "Every Chance I Get",
        artist: "Lil Baby Lil Durk Dj Khaled",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fevery-chance-i-get-feat-lil-baby-lil-durk-dj-khaled.mp3?alt=media&token=69c470f6-85cd-4195-a199-2c80d3387d29",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'every-life-isabel-larosa',
        title: "Every Life Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fevery-life-isabel-larosa.mp3?alt=media&token=29e3cfad-6e7b-43b9-bbba-32a2a08ed86e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'everybody-wants-to-rule-the-world-tears-for-fears',
        title: "Everybody Wants To Rule The World Tears For Fears",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feverybody-wants-to-rule-the-world-tears-for-fears.mp3?alt=media&token=e711ac38-f584-427e-98fb-ae6c6a84e472",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'everything-is-romantic-orchestra-club-alina-kay',
        title: "Everything Is Romantic Orchestra Club Alina Kay",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feverything-is-romantic-orchestra-club-alina-kay.mp3?alt=media&token=010ca82b-e593-463a-ac9e-1f27f2adc0c9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'everything-is-romantic-slowed-rudo-made-it-cosko',
        title: "Everything Is Romantic Slowed Rudo Made It Cosko",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feverything-is-romantic-slowed-rudo-made-it-cosko.mp3?alt=media&token=92ea5857-b7bf-4987-8e8a-3c1ba908fe82",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'evil-j0rdan-playboi-carti',
        title: "Evil J0rdan Playboi Carti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fevil-j0rdan-playboi-carti.mp3?alt=media&token=b0379154-2f73-4a2f-b1bd-df42fcd0ea5d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'exes-tate-mcrae',
        title: "Exes Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fexes-tate-mcrae.mp3?alt=media&token=43dc3cab-a2ed-4d84-ab40-db22654274d1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'express-do-your-dance-dream-e-girls',
        title: "Express Do Your Dance Dream E Girls",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fexpress-do-your-dance-dream-e-girls.mp3?alt=media&token=8ca34437-cb38-41d9-b8b6-5ce588385160",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'eyes-dont-lie-isabel-larosa',
        title: "Eyes Dont Lie Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Feyes-dont-lie-isabel-larosa.mp3?alt=media&token=fe7f95f7-add2-40e7-89c1-b6d5613a6633",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ez-jvcki-wai',
        title: "Ez Jvcki Wai",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fez-jvcki-wai.mp3?alt=media&token=d39941ad-3b42-41a7-a55f-26e09a86da08",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'face-2-face-juice-wrld',
        title: "Face 2 Face Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fface-2-face-juice-wrld.mp3?alt=media&token=3fedd75d-b774-44f1-af19-f83e274e6912",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fainted-narvent',
        title: "Fainted Narvent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffainted-narvent.mp3?alt=media&token=0fdb98dd-1098-41ab-91c0-60bd0007d4d7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fair-trade-travis-scott-drake',
        title: "Fair Trade",
        artist: "Travis Scott Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffair-trade-feat-travis-scott-drake.mp3?alt=media&token=c78a7395-a23e-4cce-972d-2a0110227e49",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fairytale-freestyle-khantrast',
        title: "Fairytale Freestyle Khantrast",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffairytale-freestyle-khantrast.mp3?alt=media&token=7a348376-9dd3-45f5-897c-79afddf0c1eb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fall-apart-kali-uchis',
        title: "Fall Apart Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffall-apart-kali-uchis.mp3?alt=media&token=6611db49-bf60-4853-b21c-c981fdc7198c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fall-in-love-with-you-montell-fish',
        title: "Fall In Love With You Montell Fish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffall-in-love-with-you-montell-fish.mp3?alt=media&token=21804a42-1147-4d76-a889-71e7a3d8028c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fall-so-hard-mixed-optmst',
        title: "Fall So Hard Mixed Optmst",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffall-so-hard-mixed-optmst.mp3?alt=media&token=cd6cc77f-e6ef-4f3e-ae83-c55bedeea620",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'falling-down-bonus-track-lil-peep-xxxtentacion',
        title: "Falling Down Bonus Track Lil Peep Xxxtentacion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffalling-down-bonus-track-lil-peep-xxxtentacion.mp3?alt=media&token=b679b395-1797-4f36-9ed4-675d2c365b4b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'falling-for-u-peachy-mxmtoon',
        title: "Falling For U Peachy Mxmtoon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffalling-for-u-peachy-mxmtoon.mp3?alt=media&token=0781fbb9-1518-451e-a431-d71f7c7b481d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'falling-outta-love-slxrppy',
        title: "Falling Outta Love Slxrppy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffalling-outta-love-slxrppy.mp3?alt=media&token=3e1c013a-b34b-4ea8-973a-848a7b9ea7e9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fame-is-a-gun-addison-rae',
        title: "Fame Is A Gun Addison Rae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffame-is-a-gun-addison-rae.mp3?alt=media&token=9173dcf5-3696-4cb7-bae7-85c1efdce558",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'familia-yeat',
        title: "Familia Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffamilia-yeat.mp3?alt=media&token=02003e02-3e33-44a2-a47b-78cf24756bac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fancy-xlout-grioten-ethan-ross',
        title: "Fancy Xlout Grioten Ethan Ross",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffancy-xlout-grioten-ethan-ross.mp3?alt=media&token=9cf5681e-c3ca-42bd-b7e4-dea1ae3f4898",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fantasy-bazzi',
        title: "Fantasy Bazzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffantasy-bazzi.mp3?alt=media&token=bd18c666-ea43-4e49-9caa-739e1f9e7254",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fantasy-world-kid-sora-acoustic-version-miraie',
        title: "Fantasy World",
        artist: "Kid Sora Acoustic Version Miraie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffantasy-world-feat-kid-sora-acoustic-version-miraie.mp3?alt=media&token=79cfabe5-5580-4085-b0ce-93b7b92c90cd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fantasy-world-kid-sora-miraie',
        title: "Fantasy World",
        artist: "Kid Sora Miraie",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffantasy-world-feat-kid-sora-miraie.mp3?alt=media&token=71983b8e-107d-476f-8a31-20006710e042",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fast-motion-saweetie',
        title: "Fast Motion Saweetie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffast-motion-saweetie.mp3?alt=media&token=b2ebe480-3cce-4eeb-9b7f-2911a16e4bce",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'faster-n-harder-6arelyhuman-tara-yummy',
        title: "Faster N Harder 6arelyhuman Tara Yummy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffaster-n-harder-6arelyhuman-tara-yummy.mp3?alt=media&token=36dea607-cd34-4d07-a002-63d0ba09f3b2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'favorite-isabel-larosa',
        title: "Favorite Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffavorite-isabel-larosa.mp3?alt=media&token=c1f22d37-7da3-4fb1-90b8-b211f5628b5c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'favorite-song-pmbata',
        title: "Favorite Song Pmbata",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffavorite-song-pmbata.mp3?alt=media&token=0d665843-a3ac-4a92-9405-a39c26bce9b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'feel-like-god-mikeeysmind-miyokibeats-gazzzy',
        title: "Feel Like God Mikeeysmind Miyokibeats Gazzzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffeel-like-god-mikeeysmind-miyokibeats-gazzzy.mp3?alt=media&token=3d26a7af-d3dc-4249-b435-950c2d754616",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'feeling-mvsterious-nightviion',
        title: "Feeling Mvsterious Nightviion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffeeling-mvsterious-nightviion.mp3?alt=media&token=b8ab2001-6433-4d0f-a120-0d5f8f43e85f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fen-playboi-carti-travis-scott',
        title: "Fen",
        artist: "Playboi Carti Travis Scott",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffen-feat-playboi-carti-travis-scott.mp3?alt=media&token=bfbbaf7c-634e-41ee-aaed-250eb61c4565",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'festival-static-amour-lilbunnycart-fortye',
        title: "Festival",
        artist: "Static Amour Lilbunnycart Fortye",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffestival-feat-static-amour-lilbunnycart-fortye.mp3?alt=media&token=295189f4-d9d7-4bed-8566-5dc56b5db76c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fetty-tata-41-kyle-richh-jenn-carter',
        title: "Fetty",
        artist: "Tata 41 Kyle Richh Jenn Carter",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffetty-feat-tata-41-kyle-richh-jenn-carter.mp3?alt=media&token=06dae475-0e5d-4d3a-ad9f-d1899e291e55",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fighting-my-demons-ken-carson',
        title: "Fighting My Demons Ken Carson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffighting-my-demons-ken-carson.mp3?alt=media&token=a6fcbb28-2480-4cea-b675-350421c33f3a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'figurante-sayfalse-axodic',
        title: "Figurante Sayfalse Axodic",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffigurante-sayfalse-axodic.mp3?alt=media&token=9270d3e1-8ae5-4e92-9365-c3f9af771eac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'final-round-eternxlkz',
        title: "Final Round Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffinal-round-eternxlkz.mp3?alt=media&token=5cc41e20-8f67-4087-bdcb-e50fe066a8e1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'finesse-drake',
        title: "Finesse Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffinesse-drake.mp3?alt=media&token=8019249e-3306-4847-b3ce-a4d64e406e0e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'firework-katy-perry',
        title: "Firework Katy Perry",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffirework-katy-perry.mp3?alt=media&token=4275e2dd-618e-42a9-ae78-8c81958f4f20",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'first-time-lil-tjay',
        title: "First Time Lil Tjay",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffirst-time-lil-tjay.mp3?alt=media&token=6b32c1df-483f-4012-90b3-c2fc8200e983",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'flashing-lights-dwele-kanye-west',
        title: "Flashing Lights",
        artist: "Dwele Kanye West",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fflashing-lights-feat-dwele-kanye-west.mp3?alt=media&token=5dd39e5b-73c2-492f-9cec-8c28e306db79",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'flawless-2-mikeeysmind-prodbysky',
        title: "Flawless 2 Mikeeysmind Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fflawless-2-mikeeysmind-prodbysky.mp3?alt=media&token=94f8f90c-7131-4759-b968-db830a6d96e0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'flawlss-lil-uzi-vert-yeat',
        title: "FlawlëSs",
        artist: "Lil Uzi Vert Yeat",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fflawl%C3%ABss-feat-lil-uzi-vert-yeat.mp3?alt=media&token=527abef9-536a-48d1-88a7-379c4bcbddcc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'flex-up-lil-yachty-future-playboi-carti',
        title: "Flex Up Lil Yachty Future Playboi Carti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fflex-up-lil-yachty-future-playboi-carti.mp3?alt=media&token=40dde631-2c60-42ac-9684-9ce62b8654df",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'flowers-miley-cyrus',
        title: "Flowers Miley Cyrus",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fflowers-miley-cyrus.mp3?alt=media&token=7366b00b-6467-465f-b820-88ac98f5a190",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fluxxwave-8d-audio-clovis-reyes',
        title: "Fluxxwave 8d Audio Clovis Reyes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffluxxwave-8d-audio-clovis-reyes.mp3?alt=media&token=025f919c-f9d2-47b2-acbb-7ffe7cc6b41e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fluxxwave-clovis-reyes',
        title: "Fluxxwave Clovis Reyes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffluxxwave-clovis-reyes.mp3?alt=media&token=e39ad078-b058-4544-8201-a77ce6a83a97",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'for-real-world-miraie-kid-sora-yandere',
        title: "For Real World",
        artist: "Miraie Kid Sora Yandere",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffor-real-world-feat-miraie-kid-sora-yandere.mp3?alt=media&token=622da442-fc49-48fd-a8df-b5396e2cf936",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'for-the-first-time-mac-demarco',
        title: "For The First Time Mac Demarco",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffor-the-first-time-mac-demarco.mp3?alt=media&token=f720a800-8d59-42a8-a3ca-d9abcc63e2f2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'for-the-night-lil-baby-dababy-pop-smoke',
        title: "For The Night",
        artist: "Lil Baby Dababy Pop Smoke",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffor-the-night-feat-lil-baby-dababy-pop-smoke.mp3?alt=media&token=f0975fb5-4c0d-4dc4-aac5-1e151fa422fd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'for-you-kali-uchis',
        title: "For You Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffor-you-kali-uchis.mp3?alt=media&token=bea54ac2-7f9d-400c-b808-726943c90114",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'forever-ufo361',
        title: "Forever Ufo361",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fforever-ufo361.mp3?alt=media&token=54357730-f099-4dd1-8961-6f19df969d77",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fortnight-post-malone-blondish-remix-taylor-swift-blondish',
        title: "Fortnight",
        artist: "Post Malone Blondish Remix Taylor Swift Blondish",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffortnight-feat-post-malone-blondish-remix-taylor-swift-blondish.mp3?alt=media&token=aea05631-cebe-45e0-85d5-1d3c88f2e4bf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fortworth-drake-partynextdoor',
        title: "Fortworth Drake Partynextdoor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffortworth-drake-partynextdoor.mp3?alt=media&token=e9448d71-9deb-41e6-aeea-04fdab5ebb23",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fragment-slxughter',
        title: "Fragment Slxughter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffragment-slxughter.mp3?alt=media&token=f6b76c23-f6f8-4070-b08b-4fb5797606b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'freaked-out-fat-papi-prodshushy',
        title: "Freaked Out Fat Papi Prodshushy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffreaked-out-fat-papi-prodshushy.mp3?alt=media&token=0e902eab-db82-4330-8fbf-b8bc067f8efd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'freakin-out-dexter-and-the-moonrocks',
        title: "Freakin Out Dexter And The Moonrocks",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffreakin-out-dexter-and-the-moonrocks.mp3?alt=media&token=86c2ca84-f924-43ed-92ba-e4e93d36232a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'freaks-surf-curse',
        title: "Freaks Surf Curse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffreaks-surf-curse.mp3?alt=media&token=edfa4424-0ae1-41bf-8952-cec11ba83941",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'from-the-islands-kompa-pasin-jason-derulo-tomo',
        title: "From The Islands Kompa PasióN фрози Jason Derulo Tomo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffrom-the-islands-kompa-pasi%C3%B3n-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-jason-derulo-tomo.mp3?alt=media&token=0b03b123-0e71-4837-8f9d-3c2777196d22",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'from-the-start-good-kid',
        title: "From The Start Good Kid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffrom-the-start-good-kid.mp3?alt=media&token=6d28a5c8-2c3f-4eaf-9d20-749a72dfef24",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'from-the-start-laufey',
        title: "From The Start Laufey",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffrom-the-start-laufey.mp3?alt=media&token=42604b6f-bbf1-4244-b5b0-32503648b466",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ftcu-nicki-minaj',
        title: "Ftcu Nicki Minaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fftcu-nicki-minaj.mp3?alt=media&token=9287e582-b15e-4c5f-84c4-4182e9b155d3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fukumean-gunna',
        title: "Fukumean Gunna",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffukumean-gunna.mp3?alt=media&token=0ef259b1-27fc-49cb-a5ca-5cc72743234e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-de-beleza-slowed-nateki-scythermane-mc-mayah',
        title: "Funk De Beleza Slowed Nateki Scythermane Mc Mayah",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-de-beleza-slowed-nateki-scythermane-mc-mayah.mp3?alt=media&token=38ef4b46-9bde-4b42-b0c3-6b5d1b891dc8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-delicado-20-xxephyrr-seek',
        title: "Funk Delicado 20 Xxephyrr Seek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-delicado-20-xxephyrr-seek.mp3?alt=media&token=2b9d2ddc-6480-4edc-ab06-b67605631211",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-do-keygen-pxlwyse-orion',
        title: "Funk Do Keygen Pxlwyse Orion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-do-keygen-pxlwyse-orion.mp3?alt=media&token=f74d0d57-76fb-4e1b-ba65-31d78a7d9cfb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-mi-camino-sayfalse-junior-rce',
        title: "Funk Mi Camino Sayfalse Junior Rce",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-mi-camino-sayfalse-junior-rce.mp3?alt=media&token=a91cd8ff-4a70-444f-9407-775d222a083f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-mi-camino-super-slowed-sayfalse-junior-rce',
        title: "Funk Mi Camino Super Slowed Sayfalse Junior Rce",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-mi-camino-super-slowed-sayfalse-junior-rce.mp3?alt=media&token=41dee3d6-0e6c-4f56-b5f7-0ca2e3da9f81",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-oscuro-ultra-slowed-h6itam-icedmane-dysmane',
        title: "Funk Oscuro Ultra Slowed H6itam Icedmane Dysmane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-oscuro-ultra-slowed-h6itam-icedmane-dysmane.mp3?alt=media&token=50a8497d-7c71-409e-a49e-acf6f8c3d9f2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-risco-svlient-lexmane',
        title: "Funk Risco Svlient Lexmane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-risco-svlient-lexmane.mp3?alt=media&token=94194a0d-421d-44bb-9c7e-805f2062ad13",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'funk-universo-irokz',
        title: "Funk Universo Irokz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ffunk-universo-irokz.mp3?alt=media&token=418bbe7b-9885-4980-a2ba-962fe32ee750",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'fshion-britney-manson',
        title: "FλShion Britney Manson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ff%CE%BBshion-britney-manson.mp3?alt=media&token=890e2115-5902-4d6b-bac3-b6449662e081",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'g23-rich-amiri',
        title: "G23 Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fg23-rich-amiri.mp3?alt=media&token=2e76e883-b5a6-4fe2-82f2-c7d9f8762279",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gang-baby-nle-choppa',
        title: "Gang Baby Nle Choppa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgang-baby-nle-choppa.mp3?alt=media&token=bbd38c39-88db-46bc-9ed8-b7db434ee1a8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gano-slowed-vukeine',
        title: "Gano Slowed Vukeine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgano-slowed-vukeine.mp3?alt=media&token=8dd51e7a-9a48-47d2-b8b8-6da6050db9ad",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gatti-jackboys-pop-smoke-travis-scott',
        title: "Gatti Jackboys Pop Smoke Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgatti-jackboys-pop-smoke-travis-scott.mp3?alt=media&token=ded73af2-9e33-4286-bfa9-34ba4cc02f73",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gen-5-drake',
        title: "Gen 5 Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgen-5-drake.mp3?alt=media&token=e0872667-222d-4755-95c9-e3a7234f0135",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'get-back-pop-smoke',
        title: "Get Back Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fget-back-pop-smoke.mp3?alt=media&token=477bcce2-8095-449e-9118-a1a7806f4d3b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'get-that-sheluvsj-imis',
        title: "Get That Sheluvsj Imis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fget-that-sheluvsj-imis.mp3?alt=media&token=70b6d793-0671-457c-add4-b65cb40aa822",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'get-you-the-moon-snw-kina',
        title: "Get You The Moon",
        artist: "SnøW Kina",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fget-you-the-moon-feat-sn%C3%B8w-kina.mp3?alt=media&token=a11b91af-0fdc-4121-aa9a-9851dddf337e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gilded-lily-cults',
        title: "Gilded Lily Cults",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgilded-lily-cults.mp3?alt=media&token=8f903957-8318-4594-abaf-8237f6b39256",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'girl-of-my-dreams-guti',
        title: "Girl Of My Dreams Guti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgirl-of-my-dreams-guti.mp3?alt=media&token=27996810-0ff9-403f-a175-8d590f6041c0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'girls-want-girls-lil-baby-drake',
        title: "Girls Want Girls",
        artist: "Lil Baby Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgirls-want-girls-feat-lil-baby-drake.mp3?alt=media&token=fb80676f-8bac-4f43-9d3d-1738a285de95",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'give-it-to-me-full-vocal-mix-matt-sassari',
        title: "Give It To Me Full Vocal Mix Matt Sassari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgive-it-to-me-full-vocal-mix-matt-sassari.mp3?alt=media&token=d7f0093f-f55f-47c9-95c0-184d076028de",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'glow-mxzi',
        title: "Glow Mxzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fglow-mxzi.mp3?alt=media&token=f41f010b-4aee-4871-b9c3-69d236ccf0db",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gmfu-odetari-6arelyhuman',
        title: "Gmfu Odetari 6arelyhuman",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgmfu-odetari-6arelyhuman.mp3?alt=media&token=e88f3dbd-8633-47fe-b7f2-c72ea5330c9b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'go-7sirens-prodkaz-prodstummyyy',
        title: "Go 7sirens Prodkaz Prodstummyyy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgo-7sirens-prodkaz-prodstummyyy.mp3?alt=media&token=46e897a2-90be-4b1b-b8d0-b458e24e4753",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'go-crazy-mikeeysmind-dadanny',
        title: "Go Crazy Mikeeysmind Dadanny",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgo-crazy-mikeeysmind-dadanny.mp3?alt=media&token=1d8b6ddb-97b9-4b69-a69c-72da647ed256",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'go-hard-20-juice-wrld',
        title: "Go Hard 20 Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgo-hard-20-juice-wrld.mp3?alt=media&token=02ee52c5-3585-491f-a441-23df8730d333",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'go-slowed-7sirens-prodkaz-prodstummyyy',
        title: "Go Slowed 7sirens Prodkaz Prodstummyyy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgo-slowed-7sirens-prodkaz-prodstummyyy.mp3?alt=media&token=d3cc1b5a-6f27-4ca3-9936-5e8fa756a287",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'go-xtayalive-2-kanii-9lives',
        title: "Go Xtayalive 2 Kanii 9lives",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgo-xtayalive-2-kanii-9lives.mp3?alt=media&token=a6e3deda-5162-467d-901a-5f0f301baef5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gods-plan-drake',
        title: "Gods Plan Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgods-plan-drake.mp3?alt=media&token=eadb0776-dbd2-4ee6-88fb-2aef3d6863cd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gods-time-x-slowed-melly-mike',
        title: "Gods Time X Slowed Melly Mike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgods-time-x-slowed-melly-mike.mp3?alt=media&token=46eba387-4722-49b1-a0ec-d2df3390f8b1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'godzilla-juice-wrld-eminem',
        title: "Godzilla",
        artist: "Juice Wrld Eminem",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgodzilla-feat-juice-wrld-eminem.mp3?alt=media&token=33a33d2c-22b6-46bb-8b15-d1501d2750e9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gone-4-a-min-junesforever',
        title: "Gone 4 A Min Junesforever",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgone-4-a-min-junesforever.mp3?alt=media&token=3542766e-c63e-47c5-b0ad-e8fb8535b0c8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'good-looking-suki-waterhouse',
        title: "Good Looking Suki Waterhouse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgood-looking-suki-waterhouse.mp3?alt=media&token=259b8480-c458-432e-ac0f-22b7f5caae61",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'good-loyal-thots-odetari',
        title: "Good Loyal Thots Odetari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgood-loyal-thots-odetari.mp3?alt=media&token=33f2a1c2-2e7d-441b-85ea-8ee389d5f5f3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'good-morning-mixed-tatyana-jane',
        title: "Good Morning Mixed Tatyana Jane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgood-morning-mixed-tatyana-jane.mp3?alt=media&token=0fb3c9fd-378b-4b99-8c0a-405407160930",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'goosebumps-travis-scott',
        title: "Goosebumps Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgoosebumps-travis-scott.mp3?alt=media&token=053eee51-d6aa-458e-8ed0-6e294193106d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'got-it-on-me-pop-smoke',
        title: "Got It On Me Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgot-it-on-me-pop-smoke.mp3?alt=media&token=ab903e4a-68bd-4567-b925-209b5ca1b45b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'goth-sidewalks-and-skeletons',
        title: "Goth Sidewalks And Skeletons",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgoth-sidewalks-and-skeletons.mp3?alt=media&token=9b85e30b-a0f3-4a06-b46d-9d65ec7d7e2b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'government-hooker-bread-beatz',
        title: "Government Hooker Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgovernment-hooker-bread-beatz.mp3?alt=media&token=58d7560f-8cb8-4360-aa3c-d25dbe510e1d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'government-hooker-lady-gaga',
        title: "Government Hooker Lady Gaga",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgovernment-hooker-lady-gaga.mp3?alt=media&token=78b6411c-48e0-45fc-a6f7-cf38d26f4ff2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'government-hooker-phonk-sped-up-fast-lane-driftmane-tazzy',
        title: "Government Hooker Phonk Sped Up Fast Lane Driftmane Tazzy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgovernment-hooker-phonk-sped-up-fast-lane-driftmane-tazzy.mp3?alt=media&token=fd9e7708-7684-4c44-b1ca-5a2b14c139fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'government-hooker-slowed-bread-beatz',
        title: "Government Hooker Slowed Bread Beatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgovernment-hooker-slowed-bread-beatz.mp3?alt=media&token=b70c721c-6c02-4cff-965b-ff8b18d429f3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gracious-future-metro-boomin-ty-dolla-ign',
        title: "Gracious Future Metro Boomin Ty Dolla Ign",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgracious-future-metro-boomin-ty-dolla-ign.mp3?alt=media&token=b3be8197-2379-4e9e-864e-b71c10052a4f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'greedy-tate-mcrae',
        title: "Greedy Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgreedy-tate-mcrae.mp3?alt=media&token=33ee4099-1bb4-4dc7-8658-59fd68550db7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'greenlight-tate-mcrae',
        title: "Greenlight Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgreenlight-tate-mcrae.mp3?alt=media&token=91972b57-aeaf-475a-926c-a28303b08df1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'grove-cheryltje',
        title: "Grove Cheryltje",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgrove-cheryltje.mp3?alt=media&token=34748fe0-e6ee-48ea-b319-3169801218ea",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gta-2-rarin',
        title: "Gta 2 Rarin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgta-2-rarin.mp3?alt=media&token=93e4905f-7505-4465-9167-56e360489b89",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gta-4-loading-volute',
        title: "Gta 4 Loading Volute",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgta-4-loading-volute.mp3?alt=media&token=ee3c3100-ee80-4243-9e67-c27a426ab570",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gta-iv-frv',
        title: "Gta Iv Frv",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgta-iv-frv.mp3?alt=media&token=f51a9d58-e50d-4859-a505-e2710ddfbc16",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gta-iv-slowed-bianc0-stuck-in-98',
        title: "Gta Iv Slowed Bianc0 Stuck In 98",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgta-iv-slowed-bianc0-stuck-in-98.mp3?alt=media&token=9bfe61af-ab83-45e7-84f6-20066a448658",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gta-king-von',
        title: "Gta King Von",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgta-king-von.mp3?alt=media&token=88b155b9-7e1f-4cec-9efc-472cedd4cf2a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'guess-featuring-billie-eilish-charli-xcx-billie-eilish',
        title: "Guess Featuring Billie Eilish Charli Xcx Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fguess-featuring-billie-eilish-charli-xcx-billie-eilish.mp3?alt=media&token=47ffde14-6ca0-457e-b7bf-cad431a14448",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gutta-gutta-rich-amiri',
        title: "Gutta Gutta Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fgutta-gutta-rich-amiri.mp3?alt=media&token=c13432f7-d8be-47ec-b511-76c5398fe77a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'gt-busy-yeat',
        title: "GëT Busy Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fg%C3%ABt-busy-yeat.mp3?alt=media&token=3822ae5f-dada-4c38-bf0a-c3bc3677c11d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'habits-stay-high-tove-lo',
        title: "Habits Stay High Tove Lo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhabits-stay-high-tove-lo.mp3?alt=media&token=b86233c5-2ad0-4ee1-89c7-eb4dc10bebd8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hands-up-pixel-hood-6arelyhuman-kets4eki',
        title: "Hands Up",
        artist: "Pixel Hood 6arelyhuman Kets4eki",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhands-up-feat-pixel-hood-6arelyhuman-kets4eki.mp3?alt=media&token=71ff5613-25cd-4ad7-9765-37d9283a3a83",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hands-up-vanessa-doll-v9p',
        title: "Hands Up Vanessa Doll V9p",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhands-up-vanessa-doll-v9p.mp3?alt=media&token=20c1c501-34b3-4747-9059-1186ff0d86aa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hardcore-ken-carson',
        title: "Hardcore Ken Carson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhardcore-ken-carson.mp3?alt=media&token=d4e622d3-62e7-4131-bf78-13987b36b297",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hardy-boys-2-prodbysky',
        title: "Hardy Boys 2 Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhardy-boys-2-prodbysky.mp3?alt=media&token=1b337d59-8496-4752-8365-0759903e1e36",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hatchback-cochise',
        title: "Hatchback Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhatchback-cochise.mp3?alt=media&token=5981844a-d9e6-4b6a-8d12-71fb250414d1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hate-that-i-made-you-love-me-ariana-grande',
        title: "Hate That I Made You Love Me Ariana Grande",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhate-that-i-made-you-love-me-ariana-grande.mp3?alt=media&token=f937e22e-44a5-4eaf-9811-f4f7a402021b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hate-thxsomch',
        title: "Hate Thxsomch",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhate-thxsomch.mp3?alt=media&token=dd111306-9dda-4bf3-a1b4-1245853538e8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'haza-slowed-udiennx',
        title: "Haza Slowed Udiennx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhaza-slowed-udiennx.mp3?alt=media&token=194cba68-7f25-40c2-8d1e-19809fca9073",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hdmi-bones',
        title: "Hdmi Bones",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhdmi-bones.mp3?alt=media&token=1eb4b138-7a9c-400a-ab73-7e6441e1111b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'head-shot-gas-in-the-truck-ishowspeed',
        title: "Head Shot Gas In The Truck Ishowspeed",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhead-shot-gas-in-the-truck-ishowspeed.mp3?alt=media&token=e0f24df1-0e98-4cb6-8f20-82e72d329700",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headlock-1shot-jersey-club-1shot',
        title: "Headlock 1shot Jersey Club 1shot",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadlock-1shot-jersey-club-1shot.mp3?alt=media&token=b3c690d7-a5f1-4de4-9eab-143b16408e52",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headlock-imogen-heap',
        title: "Headlock Imogen Heap",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadlock-imogen-heap.mp3?alt=media&token=3d4aa9df-eafe-4d16-b23b-de5d0178705b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headlock-jersey-remix-mxtrk',
        title: "Headlock Jersey Remix Mxtrk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadlock-jersey-remix-mxtrk.mp3?alt=media&token=da921144-4ad4-4f7c-aa92-1f0589b7c331",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headlock-kxllswxtch',
        title: "Headlock Kxllswxtch",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadlock-kxllswxtch.mp3?alt=media&token=6aeae43f-a91e-48aa-896d-c9d6947bcd71",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headlock-trap-remix-trap-remix-guys',
        title: "Headlock Trap Remix Trap Remix Guys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadlock-trap-remix-trap-remix-guys.mp3?alt=media&token=18fb4251-bb30-4d0f-aa0a-067980535371",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headshot-luhduke',
        title: "Headshot Luhduke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadshot-luhduke.mp3?alt=media&token=22010cba-5371-454c-907d-da4c4d8def34",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'headshot-venace',
        title: "Headshot Venace",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheadshot-venace.mp3?alt=media&token=d97dc95c-7bf3-4d79-8e6d-9af3ca7e9102",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heart-racing-kanii-riovaz-nimstarr',
        title: "Heart Racing Kanii Riovaz Nimstarr",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheart-racing-kanii-riovaz-nimstarr.mp3?alt=media&token=294facf5-3f85-4d47-a6fc-c5aef575086f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heartbeat-childish-gambino',
        title: "Heartbeat Childish Gambino",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheartbeat-childish-gambino.mp3?alt=media&token=4edec017-dc75-4778-86eb-881fce92bd68",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heartbeat-isabel-larosa',
        title: "Heartbeat Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheartbeat-isabel-larosa.mp3?alt=media&token=7b06d0e2-5a45-48fd-828c-ec2e056b1bc2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heartburn-lijay-version-lijay-tenseoh',
        title: "Heartburn Lijay Version Lijay Tenseoh",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheartburn-lijay-version-lijay-tenseoh.mp3?alt=media&token=bab4dc2f-4168-4c80-a191-6288999a8b12",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heartless-kanye-west',
        title: "Heartless Kanye West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheartless-kanye-west.mp3?alt=media&token=0d379b43-b274-4a30-b53d-3016961d9a0f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heaven-is-a-home-kali-uchis',
        title: "Heaven Is A Home Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheaven-is-a-home-kali-uchis.mp3?alt=media&token=1dcc2fc8-bc63-40dc-8bf5-e9b0436da6ca",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heavenly-funk-ovg-mxzi',
        title: "Heavenly Funk Ovg Mxzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheavenly-funk-ovg-mxzi.mp3?alt=media&token=a95129f8-65a8-450e-9bb4-29925c5bb489",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'heavy-love-odetari',
        title: "Heavy Love Odetari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fheavy-love-odetari.mp3?alt=media&token=9058561b-ffb1-4aed-9d6a-aaff5b01cf1f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hellcats-srts-sexyy-red',
        title: "Hellcats Srts Sexyy Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhellcats-srts-sexyy-red.mp3?alt=media&token=999cc028-943f-438e-9ae8-9068f0c1eaea",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'her-jvke',
        title: "Her Jvke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fher-jvke.mp3?alt=media&token=b3c4ea94-bfb1-43f5-b385-1e2164e07b62",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hex-80purppp',
        title: "Hex 80purppp",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhex-80purppp.mp3?alt=media&token=6c4ebe29-67ba-4c42-b232-710d7d398fe1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hex-chant-kempachii',
        title: "Hex Chant Kempachii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhex-chant-kempachii.mp3?alt=media&token=d5cb7d81-64a0-424a-a497-675811cfc024",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hey-hi-hello-1nonly-lilbubblegum-ciscaux',
        title: "Hey Hi Hello",
        artist: "1nonly Lilbubblegum Ciscaux",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhey-hi-hello-feat-1nonly-lilbubblegum-ciscaux.mp3?alt=media&token=1c3d8f09-6e58-4ad8-a666-fe07dfa0dc70",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hey-listen-ovg-draco-lyra',
        title: "Hey Listen Ovg Draco Lyra",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhey-listen-ovg-draco-lyra.mp3?alt=media&token=31e8a589-37fd-4876-a75f-ec45066a89a1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'high-fives-drake',
        title: "High Fives Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhigh-fives-drake.mp3?alt=media&token=2bc5202e-b7d4-4db2-9cd4-7a7968a5ba0a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'highest-in-the-room-slowed-reverb-706hitmakers',
        title: "Highest In The Room Slowed Reverb 706hitmakers",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhighest-in-the-room-slowed-reverb-706hitmakers.mp3?alt=media&token=818aba9e-3d38-491e-8f96-0f79138d5cf1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'highest-in-the-room-slowed-scammacist',
        title: "Highest In The Room Slowed Scammacist",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhighest-in-the-room-slowed-scammacist.mp3?alt=media&token=32e0acf2-f0df-4d8b-86e1-250e93c35451",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'highest-in-the-room-travis-scott',
        title: "Highest In The Room Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhighest-in-the-room-travis-scott.mp3?alt=media&token=e79ed4aa-e1eb-435f-ad73-27ff3a4ff9d0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hoe-phase-drake',
        title: "Hoe Phase Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhoe-phase-drake.mp3?alt=media&token=9d3794a3-f971-49ba-bf0e-94491e30b437",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hollow-purple-ryutqc',
        title: "Hollow Purple Ryutqc",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhollow-purple-ryutqc.mp3?alt=media&token=49527868-7620-47be-9833-ceb526608309",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'honest-baby-keem',
        title: "Honest Baby Keem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhonest-baby-keem.mp3?alt=media&token=c3c3ee21-2dd1-483a-84ab-9b8b2ac180a7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hope-xxxtentacion',
        title: "Hope Xxxtentacion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhope-xxxtentacion.mp3?alt=media&token=42e9ca9a-4dd2-4dd6-9252-6a0301a79d5f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hot-to-go-chappell-roan',
        title: "Hot To Go Chappell Roan",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhot-to-go-chappell-roan.mp3?alt=media&token=21057a50-4fd4-43f1-803b-0f92ddb6039a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hotel-room-service-pitbull',
        title: "Hotel Room Service Pitbull",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhotel-room-service-pitbull.mp3?alt=media&token=8a7db394-1651-4aec-b4bc-8961810b2914",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hotline-bling-drake',
        title: "Hotline Bling Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhotline-bling-drake.mp3?alt=media&token=dd2821c0-c07b-4813-b6da-237b5dbe5247",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'houdini-dua-lipa',
        title: "Houdini Dua Lipa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhoudini-dua-lipa.mp3?alt=media&token=9b97728c-cf10-4a19-a018-b5b81ed7010c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'house-tour-sabrina-carpenter',
        title: "House Tour Sabrina Carpenter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhouse-tour-sabrina-carpenter.mp3?alt=media&token=b868d350-663f-414c-b5d9-0dd217db3d77",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'how-could-u-love-somebody-like-me-artemas',
        title: "How Could U Love Somebody Like Me Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhow-could-u-love-somebody-like-me-artemas.mp3?alt=media&token=2f1b2376-cd87-4464-8114-37e4bff17269",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'humble-kendrick-lamar',
        title: "Humble Kendrick Lamar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhumble-kendrick-lamar.mp3?alt=media&token=eebc5a3f-0c8c-495a-80aa-de283eb96602",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hunchos-rich-amiri',
        title: "Hunchos Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhunchos-rich-amiri.mp3?alt=media&token=6ad6e587-7313-4daa-a5df-53084a3b5cde",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hurrr-nor-thurrr-drake-sexyy-red',
        title: "Hurrr Nor Thurrr Drake Sexyy Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhurrr-nor-thurrr-drake-sexyy-red.mp3?alt=media&token=f528a2e8-5a5e-49a2-9e7e-986463c79f60",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hurts-me-yoko-gold-tory-lanez-trippie-redd',
        title: "Hurts Me",
        artist: "Yoko Gold Tory Lanez Trippie Redd",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhurts-me-feat-yoko-gold-tory-lanez-trippie-redd.mp3?alt=media&token=7b708c7c-c8df-4a70-b1b0-a1d3f8ba1e86",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hydroplane-cochise',
        title: "Hydroplane Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhydroplane-cochise.mp3?alt=media&token=1905b85e-2449-43eb-bd41-2080a17878b5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hyperjumpexe-repsaj',
        title: "Hyperjumpexe Repsaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhyperjumpexe-repsaj.mp3?alt=media&token=e52c09d9-4a00-4fe2-b757-236cbf83b822",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'hypnotic-data-odetari',
        title: "Hypnotic Data Odetari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fhypnotic-data-odetari.mp3?alt=media&token=7dbbe4d9-66b4-4187-a042-382cab6b12b7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-cant-do-this-slowed-reverb-k3nt4',
        title: "I Cant Do This Slowed Reverb K3nt4",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-cant-do-this-slowed-reverb-k3nt4.mp3?alt=media&token=905e4f68-3f5d-47d6-b860-1e3fe2e2961f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-cant-do-this-super-slowed-k3nt4',
        title: "I Cant Do This Super Slowed K3nt4",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-cant-do-this-super-slowed-k3nt4.mp3?alt=media&token=11038952-e1ee-4e5f-b53a-1a1ae7cbf7ac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-cant-handle-change-roar',
        title: "I Cant Handle Change Roar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-cant-handle-change-roar.mp3?alt=media&token=0bbac141-6076-43de-b558-02f265391237",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-do-this-404vincent',
        title: "I Do This 404vincent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-do-this-404vincent.mp3?alt=media&token=f1fba6b5-08b1-4af0-8c43-f97074c2aad4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-dont-wanna-do-this-anymore-xxxtentacion',
        title: "I Dont Wanna Do This Anymore Xxxtentacion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-dont-wanna-do-this-anymore-xxxtentacion.mp3?alt=media&token=a1bd9d93-f3d1-4682-892c-76db7b944dbc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-feel-it-bryansanon',
        title: "I Feel It Bryansanon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-feel-it-bryansanon.mp3?alt=media&token=218db174-06a4-4dbe-8248-b5ff0c6388c1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-feel-lost-aaron-hibell',
        title: "I Feel Lost Aaron Hibell",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-feel-lost-aaron-hibell.mp3?alt=media&token=652c5665-0143-4719-bf44-6c74b8fb605d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-get-it-moving-in-silence-lilaj-daleodavinci',
        title: "I Get It Moving In Silence Lilaj Daleodavinci",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-get-it-moving-in-silence-lilaj-daleodavinci.mp3?alt=media&token=476b29e3-6aa2-4d09-9dec-607eeb5b5e99",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-get-it-slowed-down-moving-in-silence-lilaj-daleodavinci',
        title: "I Get It Slowed Down Moving In Silence Lilaj Daleodavinci",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-get-it-slowed-down-moving-in-silence-lilaj-daleodavinci.mp3?alt=media&token=a1ae4de3-68b9-4845-8930-7b7dd17ab71f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-just-need-mariove',
        title: "I Just Need Mariove",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-just-need-mariove.mp3?alt=media&token=4cf19c53-92ef-456f-9c03-2e62a52dcb94",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-just-wanna-be-loved-slowed-kobzx2z-mikeeysmind',
        title: "I Just Wanna Be Loved Slowed Kobzx2z Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-just-wanna-be-loved-slowed-kobzx2z-mikeeysmind.mp3?alt=media&token=72f61917-4650-4be3-b874-b498c60a1658",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-just-wanna-leave-this-life-mariove',
        title: "I Just Wanna Leave This Life Mariove",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-just-wanna-leave-this-life-mariove.mp3?alt=media&token=2ad6c5de-07d3-487b-a200-11f26f2c97e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-know-kanii',
        title: "I Know Kanii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-know-kanii.mp3?alt=media&token=14580703-15cc-4b7d-9412-7ca9aa242542",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-know-love-the-kid-laroi-tate-mcrae',
        title: "I Know Love",
        artist: "The Kid Laroi Tate Mcrae",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-know-love-feat-the-kid-laroi-tate-mcrae.mp3?alt=media&token=32ef9aef-12f1-48e3-a0b8-91a6cc83b7ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-know-pr1svx-edit-kanii',
        title: "I Know Pr1svx Edit Kanii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-know-pr1svx-edit-kanii.mp3?alt=media&token=32848617-af7f-4c46-8764-1fb8389db7c3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-know-travis-scott',
        title: "I Know Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-know-travis-scott.mp3?alt=media&token=1ff3e7bf-cb86-4bf4-a54f-545052bc8cb6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-know-you-faye-webster',
        title: "I Know You Faye Webster",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-know-you-faye-webster.mp3?alt=media&token=e0860f6e-8e68-44a4-869b-c5fab0aa12bf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-like-the-way-you-kiss-me-artemas',
        title: "I Like The Way You Kiss Me Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-like-the-way-you-kiss-me-artemas.mp3?alt=media&token=2eba87ae-12c7-4987-8072-ce66e3cbafb7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-love-freaks-lijay',
        title: "I Love Freaks Lijay",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-love-freaks-lijay.mp3?alt=media&token=bfcab95c-85b4-481c-9a1c-d30e4b548cd1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-love-you-hoe-odetari-9lives',
        title: "I Love You Hoe Odetari 9lives",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-love-you-hoe-odetari-9lives.mp3?alt=media&token=8f4c934e-d768-4358-8e42-4f34833cc3a4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-love-you-so-jumpstyle-slowed-hussvrx',
        title: "I Love You So Jumpstyle Slowed Hussvrx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-love-you-so-jumpstyle-slowed-hussvrx.mp3?alt=media&token=6ddf8080-b524-4f14-b07f-7eb32c5ecc90",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-love-you-so-the-walters',
        title: "I Love You So The Walters",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-love-you-so-the-walters.mp3?alt=media&token=17b63f44-8ad4-4149-9a2a-075b92af4105",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-might-sexyy-red-summer-walker',
        title: "I Might Sexyy Red Summer Walker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-might-sexyy-red-summer-walker.mp3?alt=media&token=912dbf53-9416-4125-948b-a256ad928c78",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-miss-the-old-kanye-japiro-vip-gutter',
        title: "I Miss The Old Kanye Japiro Vip Gutter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-miss-the-old-kanye-japiro-vip-gutter.mp3?alt=media&token=526fa5e1-f656-4409-b737-ee73d12c4329",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-really-want-to-stay-at-your-house-rosa-walton-hallie-coggi',
        title: "I Really Want To Stay At Your House Rosa Walton Hallie Coggins",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-really-want-to-stay-at-your-house-rosa-walton-hallie-coggins.mp3?alt=media&token=d55c8aa9-075e-4ada-90f1-d80d53cd181b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-smoked-away-my-brain-im-god-x-demons-mashup-imogen-heap-cl',
        title: "I Smoked Away My Brain Im God X Demons Mashup",
        artist: "Imogen Heap Clams Casino Aap Rocky",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-smoked-away-my-brain-im-god-x-demons-mashup-feat-imogen-heap-clams-casino-aap-rocky.mp3?alt=media&token=5e541b97-f97d-4680-869a-8d4d93a33dc9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-wait-for-you-alex-g-offline',
        title: "I Wait For You Alex G Offline",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-wait-for-you-alex_g_offline.mp3?alt=media&token=9b04c017-be74-4ad3-a7c3-cb81979a26d3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-walk-this-earth-all-by-myself-ekkstacy',
        title: "I Walk This Earth All By Myself Ekkstacy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-walk-this-earth-all-by-myself-ekkstacy.mp3?alt=media&token=8bb2c63b-44b7-426d-a4dd-2d1a3bcc7df0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-wanna-be-your-girlfriend-girl-in-red',
        title: "I Wanna Be Your Girlfriend Girl In Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-wanna-be-your-girlfriend-girl-in-red.mp3?alt=media&token=f9d5d8d9-9bff-4032-834d-0ff3b76b6ea2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-wanna-be-yours-arctic-monkeys',
        title: "I Wanna Be Yours Arctic Monkeys",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-wanna-be-yours-arctic-monkeys.mp3?alt=media&token=e4e77e31-042b-4b73-a3e2-09ceb8494735",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'i-was-only-temporary-my-head-is-empty',
        title: "I Was Only Temporary My Head Is Empty",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fi-was-only-temporary-my-head-is-empty.mp3?alt=media&token=89882ddb-577d-4867-985e-820af77daf69",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'icewhore-lumi-athena',
        title: "Icewhore Lumi Athena",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ficewhore-lumi-athena.mp3?alt=media&token=cf7b1466-f52c-44b4-a154-63e266efa4c8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'iconic-by-mistake-le-sserafim-illit-katseye',
        title: "Iconic By Mistake Le Sserafim Illit Katseye",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ficonic-by-mistake-le-sserafim-illit-katseye.mp3?alt=media&token=e17feef6-9fc1-41d6-b6ec-d6878c4b183c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'id-rather-pretend-a-colors-show-bryant-barnes',
        title: "Id Rather Pretend A Colors Show Bryant Barnes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fid-rather-pretend-a-colors-show-bryant-barnes.mp3?alt=media&token=acd22dd2-2774-4228-b69c-0d320cf0eb89",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'idfc-blackbear',
        title: "Idfc Blackbear",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fidfc-blackbear.mp3?alt=media&token=6bd2a5f9-f73f-44a3-8a48-fe607aa70da7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'idfc-tarro-remix-blackbear',
        title: "Idfc Tarro Remix Blackbear",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fidfc-tarro-remix-blackbear.mp3?alt=media&token=1c3c0377-9aa3-407c-b307-87a81e3c773a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'idgaf-yeat-drake',
        title: "Idgaf",
        artist: "Yeat Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fidgaf-feat-yeat-drake.mp3?alt=media&token=e5ffe3fa-63d2-40e2-851f-a80fe222102b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'if-i-ever-fall-in-love-again-cover-shred-reverb',
        title: "If I Ever Fall In Love Again Cover Shred Reverb",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fif-i-ever-fall-in-love-again-cover-shred-reverb.mp3?alt=media&token=5fbc5f17-16a7-4726-9517-466d27c07704",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'if-u-think-im-pretty-artemas',
        title: "If U Think Im Pretty Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fif-u-think-im-pretty-artemas.mp3?alt=media&token=b5c61061-2d4f-49bf-b976-fc418b4ce034",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'if-we-being-ral-yeat',
        title: "If We Being RëAl Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fif-we-being-r%C3%ABal-yeat.mp3?alt=media&token=d912c496-1b81-4aeb-8cf5-d598b7a89948",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'if-you-care-akiaura-lonown-dj-pointless',
        title: "If You Care Akiaura Lonown Dj Pointless",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fif-you-care-akiaura-lonown-dj-pointless.mp3?alt=media&token=22ba7f9b-8444-44e0-892a-ac811774b8cb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ill-die-next-summer-no-joke-slowed-drxg-adxiction-rageix',
        title: "Ill Die Next Summer No Joke Slowed Drxg Adxiction Rageix",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fill-die-next-summer-no-joke-slowed-drxg-adxiction-rageix.mp3?alt=media&token=cfcf75b4-7179-4792-a8c5-1e31aca41779",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ill-do-it-heidi-montag',
        title: "Ill Do It Heidi Montag",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fill-do-it-heidi-montag.mp3?alt=media&token=4fecf8b3-2da5-497d-ab74-ccfe4ea351fe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ill-take-care-of-you-yebba-tyler-the-creator',
        title: "Ill Take Care Of You",
        artist: "Yebba Tyler The Creator",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fill-take-care-of-you-feat-yebba-tyler-the-creator.mp3?alt=media&token=fb8394ab-8b46-46df-bc48-ff7f8d7af408",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'illegal-sped-up-penelope-speed',
        title: "Illegal Sped Up Penelope Speed",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fillegal-sped-up-penelope-speed.mp3?alt=media&token=6c8ea0c7-f879-468d-ab9d-6998621e6a1d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'illusion-london-sessions-dua-lipa',
        title: "Illusion London Sessions Dua Lipa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fillusion-london-sessions-dua-lipa.mp3?alt=media&token=9340d6ff-c3ce-45aa-9518-f36934c64af1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'iluv-yeat',
        title: "Iluv Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Filuv-yeat.mp3?alt=media&token=75cb11d3-edc5-4458-aad8-1f71db5d20b2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ilysmih-kali-uchis',
        title: "Ilysmih Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Filysmih-kali-uchis.mp3?alt=media&token=fbe73414-2d2c-45a7-816d-55dfcedfa4d4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-an-ae-404vincent',
        title: "Im An Ae 404vincent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-an-ae-404vincent.mp3?alt=media&token=6cd191a0-8d10-4905-9a62-f276f497ecee",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-dat-na-future',
        title: "Im Dat Na Future",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-dat-na-future.mp3?alt=media&token=6053c77d-fd0e-4174-ab56-f98a96d748e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-god-clams-casino-imogen-heap',
        title: "Im God Clams Casino Imogen Heap",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-god-clams-casino-imogen-heap.mp3?alt=media&token=47046310-b3ba-4499-9403-af94ad8b01e1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-gone-rich-amiri',
        title: "Im Gone Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-gone-rich-amiri.mp3?alt=media&token=c0b21a8d-e954-4c0d-9be9-8c2e39695429",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-spent-drake-loe-shimmy',
        title: "Im Spent Drake Loe Shimmy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-spent-drake-loe-shimmy.mp3?alt=media&token=3689c9ec-d107-403d-b060-f4c7a1d1957e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-the-shit-sexyy-red',
        title: "Im The Shit Sexyy Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-the-shit-sexyy-red.mp3?alt=media&token=d4d18399-4963-4b57-943c-a919e8780a05",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-wit-it-rich-amiri-osamason',
        title: "Im Wit It Rich Amiri Osamason",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-wit-it-rich-amiri-osamason.mp3?alt=media&token=6c90c08b-c6ae-4ec6-8cd1-75e79b5acbe5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-yeat-yeat-bnyx',
        title: "Im Yeat Yeat Bnyx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-yeat-yeat-bnyx.mp3?alt=media&token=e244b7ad-8692-48ee-8355-792c00e06af7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-yours-isabel-larosa',
        title: "Im Yours Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-yours-isabel-larosa.mp3?alt=media&token=2ae44a46-6019-466b-8c31-fba671f3c494",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'im-yours-sped-up-isabel-larosa',
        title: "Im Yours Sped Up Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fim-yours-sped-up-isabel-larosa.mp3?alt=media&token=0c0ed59b-9cfd-43b2-8bac-71dd9188a7ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'imy-too-tikkit-nhelson',
        title: "Imy Too Tikkit Nhelson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fimy-too-tikkit-nhelson.mp3?alt=media&token=35e4e7c0-347f-49e1-bcc5-fd536bda4786",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'in-my-feelings-drake',
        title: "In My Feelings Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fin-my-feelings-drake.mp3?alt=media&token=8aabfc09-bf30-4804-883a-bfaf57d20111",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'in-this-darkness-clara-la-san',
        title: "In This Darkness Clara La San",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fin-this-darkness-clara-la-san.mp3?alt=media&token=f2da90e0-7c93-429e-9de1-3f1b6032a432",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'industry-baby-lil-nas-x-jack-harlow',
        title: "Industry Baby Lil Nas X Jack Harlow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Findustry-baby-lil-nas-x-jack-harlow.mp3?alt=media&token=67c97154-7bbe-4aec-96e8-7fa2e9dcc12f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'inside-out-duster',
        title: "Inside Out Duster",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finside-out-duster.mp3?alt=media&token=7e413818-fc3a-4cff-89a8-efb9fa736c1f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'insomnia-dj-breezo',
        title: "Insomnia Dj Breezo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finsomnia-dj-breezo.mp3?alt=media&token=4989194a-59d3-4c1a-a4ea-5ab1903e88d2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'insomnia-eternxlkz',
        title: "Insomnia Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finsomnia-eternxlkz.mp3?alt=media&token=82aa1ea4-c3bd-4f8d-9d74-4c3dcfa0280b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'insomnia-over-slowed-eternxlkz',
        title: "Insomnia Over Slowed Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finsomnia-over-slowed-eternxlkz.mp3?alt=media&token=2702c4e7-c0b9-4d47-adf1-c6af415d49fa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'insomnia-slowed-eternxlkz',
        title: "Insomnia Slowed Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finsomnia-slowed-eternxlkz.mp3?alt=media&token=260d1e0c-0322-419f-b5e2-fe39beea2387",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'insomnia-sped-up-eternxlkz',
        title: "Insomnia Sped Up Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finsomnia-sped-up-eternxlkz.mp3?alt=media&token=14fad023-68d5-4027-8054-5e59e89f2ee0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'insonamia-darker',
        title: "Insonamia Darker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Finsonamia-darker.mp3?alt=media&token=92631880-0943-4fcb-810c-c3feb47ee59f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'intro-end-of-the-world-x-pluto-projector-skyemane-sapphink',
        title: "Intro End Of The World X Pluto Projector Skyemane Sapphink",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fintro-end-of-the-world-x-pluto-projector-skyemane-sapphink.mp3?alt=media&token=0446aece-77c5-45b0-840e-1694c1eef959",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'iris-pastel-ghost',
        title: "Iris Pastel Ghost",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Firis-pastel-ghost.mp3?alt=media&token=9fddd1ef-decf-4ed9-a021-38f2d62f023f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'is-it-really-luv-name',
        title: "Is It Really Luv Name",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fis-it-really-luv-name.mp3?alt=media&token=93cb2010-5344-46cd-bd2b-2243fa38a9ca",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'islands-kompa-pasin-tomo',
        title: "Islands Kompa PasióN фрози Tomo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fislands-kompa-pasi%C3%B3n-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-tomo.mp3?alt=media&token=7fd90c8f-280d-4a36-a93c-547ca3fd452a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'its-called-freefall-rainbow-kitten-surprise',
        title: "Its Called Freefall Rainbow Kitten Surprise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fits-called-freefall-rainbow-kitten-surprise.mp3?alt=media&token=e6eff47a-34da-4db0-bdb3-0555897bc7a8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'its-just-us-kali-uchis',
        title: "Its Just Us Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fits-just-us-kali-uchis.mp3?alt=media&token=2d95bffa-3161-4cbd-ba51-db5925801193",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'its-not-so-bad-dybbukk-sabrina-gomes-dybbukk-covers',
        title: "Its Not So Bad Dybbukk Sabrina Gomes Dybbukk Covers",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fits-not-so-bad-dybbukk-sabrina-gomes-dybbukk-covers.mp3?alt=media&token=e53fce0b-2ca5-4df7-97b9-a0e718454d09",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'its-ok-im-ok-tate-mcrae',
        title: "Its Ok Im Ok Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fits-ok-im-ok-tate-mcrae.mp3?alt=media&token=2628eaee-39b1-4873-8e71-f2b00d6c0a80",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'janice-stfu-drake',
        title: "Janice Stfu Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjanice-stfu-drake.mp3?alt=media&token=e12bf628-efe0-4887-91a3-b2ee050cc150",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'japanese-romance-ufo361',
        title: "Japanese Romance Ufo361",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjapanese-romance-ufo361.mp3?alt=media&token=41f146bd-4074-447e-b823-d58bd6707952",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jealous-eyedress',
        title: "Jealous Eyedress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjealous-eyedress.mp3?alt=media&token=0af63d0c-5d3e-4087-b628-44918ca5ffda",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jealous-future-metro-boomin',
        title: "Jealous Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjealous-future-metro-boomin.mp3?alt=media&token=f3c76465-188b-4033-9972-d7ac63b2c574",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jerk-jnhygs-9lives',
        title: "Jerk Jnhygs 9lives",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjerk-jnhygs-9lives.mp3?alt=media&token=52a65dbf-1f48-49d1-8e42-a33027c7b214",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jessica-ze66y',
        title: "Jessica Ze66y",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjessica-ze66y.mp3?alt=media&token=6eef0cbe-5f50-47d0-b78f-bcf7080b5cc6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jessie-riserayss-lonown',
        title: "Jessie Riserayss Lonown",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjessie-riserayss-lonown.mp3?alt=media&token=6a40547f-c45f-4fcb-a47c-b256a17a0868",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'job-application-chase-icon',
        title: "Job Application Chase Icon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjob-application-chase-icon.mp3?alt=media&token=2d8be553-8de0-42c3-bb0c-3bc0f4889052",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jug-a-jug-mixed-any-act',
        title: "Jug A Jug Mixed Any Act",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjug-a-jug-mixed-any-act.mp3?alt=media&token=8e078c51-7116-4d93-9aa2-63df27d28a65",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'jumpman-tnt-x-guitar-remix-yungfuego',
        title: "Jumpman",
        artist: "Tnt X Guitar Remix Yungfuego",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjumpman-feat-tnt-x-guitar-remix-yungfuego.mp3?alt=media&token=e41ddebc-991d-4731-99df-cb1691607e27",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'just-dance-teefaygoo-evo',
        title: "Just Dance Teefaygoo Evo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjust-dance-teefaygoo-evo.mp3?alt=media&token=f282d027-f690-42d6-bf76-ec99979a26a2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'just-for-me-pinkpantheress',
        title: "Just For Me Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjust-for-me-pinkpantheress.mp3?alt=media&token=513a914d-49b7-4d64-91bf-81065104f7ff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'just-keep-watching-from-f1-the-movie-tate-mcrae',
        title: "Just Keep Watching From F1 The Movie Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjust-keep-watching-from-f1-the-movie-tate-mcrae.mp3?alt=media&token=02022e36-9512-4393-96cd-f1056a84dc93",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'just-wanna-rock-lil-uzi-vert',
        title: "Just Wanna Rock Lil Uzi Vert",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjust-wanna-rock-lil-uzi-vert.mp3?alt=media&token=0401cacb-6a77-4af8-8333-61a64166df4a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'just-want-u-to-feel-something-artemas',
        title: "Just Want U To Feel Something Artemas",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fjust-want-u-to-feel-something-artemas.mp3?alt=media&token=5c970525-581b-4be6-8750-de0225548d7d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'k-pop-bad-bunny-the-weeknd-travis-scott',
        title: "K Pop",
        artist: "Bad Bunny The Weeknd Travis Scott",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fk-pop-feat-bad-bunny-the-weeknd-travis-scott.mp3?alt=media&token=1ad462e4-8f3f-447d-be78-fd77a97dc1b2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'k-pop-travis-scott-bad-bunny-the-weeknd',
        title: "K Pop Travis Scott Bad Bunny The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fk-pop-travis-scott-bad-bunny-the-weeknd.mp3?alt=media&token=e08fe4a3-9c05-47b9-b2ac-1ff5019374c8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kacey-talk-youngboy-never-broke-again',
        title: "Kacey Talk Youngboy Never Broke Again",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkacey-talk-youngboy-never-broke-again.mp3?alt=media&token=0d854d83-cacc-46d7-b16c-79ec27a19f4d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kankoshi-whyslow',
        title: "Kankoshi фрози Whyslow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkankoshi-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-whyslow.mp3?alt=media&token=74c6f6db-50d5-4334-82f8-765dfeb488e2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kaya-qmiir-1mramor',
        title: "Kaya Qmiir 1mramor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkaya-qmiir-1mramor.mp3?alt=media&token=e3af05b4-64a3-44e3-8fd1-fa11f937dc0c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'keep-it-cool-internet-money-rich-amiri',
        title: "Keep It Cool Internet Money Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkeep-it-cool-internet-money-rich-amiri.mp3?alt=media&token=9fc5cc8a-9a2c-4d42-814a-e637e478664b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'keep-it-tucked-thxsomch',
        title: "Keep It Tucked Thxsomch",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkeep-it-tucked-thxsomch.mp3?alt=media&token=52b279bc-7714-4a7b-b340-956f21f5226a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'keep-pushin-yeat',
        title: "Keep Pushin Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkeep-pushin-yeat.mp3?alt=media&token=23242ef5-f960-41de-be6f-9503e54a0100",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'keep-up-odetari',
        title: "Keep Up Odetari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkeep-up-odetari.mp3?alt=media&token=ae5d8b98-0ff3-4e52-9640-259ef359b18e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kehlani-jordan-adetunji',
        title: "Kehlani Jordan Adetunji",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkehlani-jordan-adetunji.mp3?alt=media&token=2029fbfc-bc4d-4816-b72b-38fc55419176",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kerosene-crystal-castles',
        title: "Kerosene Crystal Castles",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkerosene-crystal-castles.mp3?alt=media&token=99d4cff7-00ee-495c-99eb-16e3215e665d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kevins-heart-j-cole',
        title: "Kevins Heart J Cole",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkevins-heart-j-cole.mp3?alt=media&token=2fd988d1-4084-4659-80d3-e836997794bc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kickback-mxlu',
        title: "Kickback Mxlu",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkickback-mxlu.mp3?alt=media&token=3f98a223-9688-40d8-aa96-b036c3606398",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'killswitch-lullaby-flawed-mangoes',
        title: "Killswitch Lullaby Flawed Mangoes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkillswitch-lullaby-flawed-mangoes.mp3?alt=media&token=cc6c79eb-29dd-42d7-96f1-77e709154b10",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kingston-faye-webster',
        title: "Kingston Faye Webster",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkingston-faye-webster.mp3?alt=media&token=d993ab12-4196-4028-b4b8-49ac463ef34d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kirkhusa-mixed-rhyw',
        title: "Kirkhusa Mixed Rhyw",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkirkhusa-mixed-rhyw.mp3?alt=media&token=ced7ec81-e6ad-4544-9b65-d31eebbb857a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'knicks-cochise',
        title: "Knicks Cochise",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fknicks-cochise.mp3?alt=media&token=0160dee0-cfd4-4e1f-9701-cce1b9fad986",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'knife-talk-21-savage-project-pat-drake',
        title: "Knife Talk",
        artist: "21 Savage Project Pat Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fknife-talk-feat-21-savage-project-pat-drake.mp3?alt=media&token=421ec3e9-1971-49f7-a598-5d7b0b1708fb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kompa-2-elysees-plah',
        title: "Kompa 2 фрози Elysees Plah",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkompa-2-%D1%84%D1%80%D0%BE%D0%B7%D0%B8-elysees-plah.mp3?alt=media&token=a8524992-952f-4dde-8d0b-39e6c3c13ac5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kompa-pasin',
        title: "Kompa PasióN фрози",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkompa-pasi%C3%B3n-%D1%84%D1%80%D0%BE%D0%B7%D0%B8.mp3?alt=media&token=db4fa41d-9dbe-4668-b200-c750895d0177",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kompa-rarin',
        title: "Kompa Rarin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkompa-rarin.mp3?alt=media&token=eaa71827-1a0f-4b8a-befa-eff69df8a12d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'krushdafight-n2uthehartlocker',
        title: "Krushdafight N2uthehartlocker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkrushdafight-n2uthehartlocker.mp3?alt=media&token=4870f07a-e5ab-4724-97ea-f7a1968a61c0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'kurayami-no-naka-dj-univxrsel',
        title: "Kurayami No Naka Dj Univxrsel",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fkurayami-no-naka-dj-univxrsel.mp3?alt=media&token=72624a57-3490-41be-bc23-48f62fa0fe13",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'la-msica-qmiir-akhmedov',
        title: "La MúSica Qmiir Akhmedov",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fla-m%C3%BAsica-qmiir-akhmedov.mp3?alt=media&token=0cc1194d-452d-4ef4-85cb-15e8e893f924",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'laa-mixed-danny-l-harle',
        title: "Laa Mixed Danny L Harle",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flaa-mixed-danny-l-harle.mp3?alt=media&token=281a5f6a-8d4c-4e29-80cf-7a24d53ad13b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lancey-or-lancey-lancey-foux',
        title: "Lancey Or Lancey Lancey Foux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flancey-or-lancey-lancey-foux.mp3?alt=media&token=a1f2d1b3-8733-4d41-967f-f5f11f2f07a2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'landed-in-brooklyn-khantrast',
        title: "Landed In Brooklyn Khantrast",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flanded-in-brooklyn-khantrast.mp3?alt=media&token=a237266c-32a5-4d64-a79a-2d5ac8f53cf4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lass-mich-los-ufo361',
        title: "Lass Mich Los Ufo361",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flass-mich-los-ufo361.mp3?alt=media&token=514ea24f-8960-4c2d-9597-61fa7ac5b1ba",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legacy-2-ogryzek',
        title: "Legacy 2 Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegacy-2-ogryzek.mp3?alt=media&token=1c21011f-f1de-4995-8726-401a1ca2ff2b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legacy-north-west-pixy-north-west',
        title: "Legacy",
        artist: "North West Pixy North West",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegacy-feat-north-west-pixy-north-west.mp3?alt=media&token=69b377bb-12cf-4015-b540-dd23ca0cea95",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legacy-on-me-jada-freeman',
        title: "Legacy On Me Jada Freeman",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegacy-on-me-jada-freeman.mp3?alt=media&token=a1a24160-d04d-4f42-a4f5-eb1d2cd2db2b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legacy-pixy',
        title: "Legacy Pixy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegacy-pixy.mp3?alt=media&token=9da967cc-a6da-4a0b-a761-cfdd05e6fdff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legacy-super-slowed-ogryzek',
        title: "Legacy Super Slowed Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegacy-super-slowed-ogryzek.mp3?alt=media&token=18f8750d-ae75-49ef-b449-f2e6939a393e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legendary-lovers-x-save-me-aurelia-dopuu-b-star',
        title: "Legendary Lovers X Save Me Aurelia Dopuu B Star",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegendary-lovers-x-save-me-aurelia-dopuu-b-star.mp3?alt=media&token=699112c6-4319-4c74-b1a6-1b2b5f094aaa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'legends-juice-wrld',
        title: "Legends Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flegends-juice-wrld.mp3?alt=media&token=50152115-ba57-40ef-80a7-88678526fe6c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'les-childish-gambino',
        title: "Les Childish Gambino",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fles-childish-gambino.mp3?alt=media&token=3045c9f1-2cac-44ca-ba4a-f6353fa6880d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'less-than-kanii',
        title: "Less Than Kanii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fless-than-kanii.mp3?alt=media&token=35e93dd9-82c7-4277-af74-02bc518c258f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-king-tonka-talk-yeat-king-kylie',
        title: "Let King Tonka Talk Yeat King Kylie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flet-king-tonka-talk-yeat-king-kylie.mp3?alt=media&token=3f256a81-719f-4f54-b179-3cd478809e81",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-me-know-i-wonder-why-freestyle-juice-wrld',
        title: "Let Me Know I Wonder Why Freestyle Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flet-me-know-i-wonder-why-freestyle-juice-wrld.mp3?alt=media&token=31c0ecaa-58c4-49fb-a575-68ba54cd7b61",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-me-see-ya-move-lumi-athena-cade-clair',
        title: "Let Me See Ya Move Lumi Athena Cade Clair",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flet-me-see-ya-move-lumi-athena-cade-clair.mp3?alt=media&token=24096f58-f4c7-48ea-afe7-a5874d06b102",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-u-go-lucidbeatz',
        title: "Let U Go Lucidbeatz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flet-u-go-lucidbeatz.mp3?alt=media&token=59b1080e-dab2-41c3-9715-6a1f63a2ca0c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'let-you-down-dawid-podsiado',
        title: "Let You Down Dawid PodsiadłO",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flet-you-down-dawid-podsiad%C5%82o.mp3?alt=media&token=fedcc348-cc3f-43ba-9483-80ded729ccd5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lets-link-bad-business-who-heem',
        title: "Lets Link Bad Business Who Heem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flets-link-bad-business-who-heem.mp3?alt=media&token=29422e21-2f4c-42d4-9eeb-cef06e29a9b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'level-tomorrow-x-together-sawanohiroyukinzk',
        title: "Level",
        artist: "Tomorrow X Together Sawanohiroyukinzk",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flevel-feat-tomorrow-x-together-sawanohiroyukinzk.mp3?alt=media&token=6b74e54b-657a-4197-92ed-2adbf6419420",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'level-up-ppcocaine',
        title: "Level Up Ppcocaine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flevel-up-ppcocaine.mp3?alt=media&token=30ffb18b-278c-4479-a6f7-8b799ff29eb5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'liebe-ufo361-nina-chuba',
        title: "Liebe Ufo361 Nina Chuba",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fliebe-ufo361-nina-chuba.mp3?alt=media&token=a08627f5-8836-4082-9cdb-af0a45962693",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'life-force-ptasinski-rj-pasin',
        title: "Life Force Ptasinski Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flife-force-ptasinski-rj-pasin.mp3?alt=media&token=230c1884-bed1-461b-bc8a-6b565972f469",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'life-force-slowed-reverb-ptasinski-rj-pasin',
        title: "Life Force Slowed Reverb Ptasinski Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flife-force-slowed-reverb-ptasinski-rj-pasin.mp3?alt=media&token=a37bd2b6-f873-4d9c-a656-732efc5639cd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lifestyle-young-thug-rich-homie-quan-rich-gang',
        title: "Lifestyle",
        artist: "Young Thug Rich Homie Quan Rich Gang",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flifestyle-feat-young-thug-rich-homie-quan-rich-gang.mp3?alt=media&token=b701e917-13df-44be-bf12-996ceca16c7d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-a-chink-bitch-g6-eric-reprid',
        title: "Like A Chink Bitch G6 Eric Reprid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-a-chink-bitch-g6-eric-reprid.mp3?alt=media&token=0ecc5374-359f-4b0c-9c42-8165f99c4d56",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-a-g6-far-east-movement-the-cataracs-dev',
        title: "Like A G6 Far East Movement The Cataracs Dev",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-a-g6-far-east-movement-the-cataracs-dev.mp3?alt=media&token=6b11082f-d557-4ed9-a163-5110d7aed2fe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-a-g6-redone-remix-far-east-movement-mohombi-the-catarac',
        title: "Like A G6 Redone Remix Far East Movement Mohombi The Cataracs Dev",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-a-g6-redone-remix-far-east-movement-mohombi-the-cataracs-dev.mp3?alt=media&token=7030c516-c9a6-4b68-aff3-373bae0f3515",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-i-do-tate-mcrae',
        title: "Like I Do Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-i-do-tate-mcrae.mp3?alt=media&token=1b0881f6-81b3-4d80-8ffb-7ee6ea911277",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-me-42-dugg-lil-baby-future',
        title: "Like Me",
        artist: "42 Dugg Lil Baby Future",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-me-feat-42-dugg-lil-baby-future.mp3?alt=media&token=e89dd66c-ae0a-41e9-8df3-6b6046fa698b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-no-other-hoodtrapjerk-ecentral',
        title: "Like No Other Hoodtrapjerk Ecentral",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-no-other-hoodtrapjerk-ecentral.mp3?alt=media&token=e0b41de0-7f65-40c1-bbf4-af6ec5a3d000",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'like-no-other-sicc',
        title: "Like No Other Sicc",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flike-no-other-sicc.mp3?alt=media&token=95f2b3db-4774-49d0-a315-ed610f472fff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lil-uzi-vert-what-you-saying-official-music-video',
        title: "Lil Uzi Vert What You Saying Official Music Video",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flil-uzi-vert-what-you-saying-official-music-video.mp3?alt=media&token=39e882a2-8a87-4949-b71f-823d481e79f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'limerence-x-bounce-out-mikeeysmind-unjaps',
        title: "Limerence X Bounce Out Mikeeysmind Unjaps",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flimerence-x-bounce-out-mikeeysmind-unjaps.mp3?alt=media&token=7e7a8d3c-37a2-4810-8cea-434af9dbe80b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'listen-sped-up-hako',
        title: "Listen Sped Up Hako",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flisten-sped-up-hako.mp3?alt=media&token=cb6839c6-5b8d-4455-b40a-7a98975e65a5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'listeria-ptasinski-rj-pasin',
        title: "Listeria Ptasinski Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flisteria-ptasinski-rj-pasin.mp3?alt=media&token=dd8ae34a-90cd-452e-a16c-0e07a5e87290",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lo-mein-lil-uzi-vert',
        title: "Lo Mein Lil Uzi Vert",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flo-mein-lil-uzi-vert.mp3?alt=media&token=fd0b310f-37c0-44a1-b98e-ceb34eed6644",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lobster-rj-pasin',
        title: "Lobster Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flobster-rj-pasin.mp3?alt=media&token=cf1d6cbf-fd5c-4461-9265-6060d2321c06",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'loco-ian',
        title: "Loco Ian",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Floco-ian.mp3?alt=media&token=ed153172-7ad7-4037-93e3-fce945560c6a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lollipop-static-major-lil-wayne',
        title: "Lollipop",
        artist: "Static Major Lil Wayne",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flollipop-feat-static-major-lil-wayne.mp3?alt=media&token=d58ca28b-9617-4d4a-bca3-abcdda821b72",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'look-dont-touch-odetari-cade-clair',
        title: "Look Dont Touch Odetari Cade Clair",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flook-dont-touch-odetari-cade-clair.mp3?alt=media&token=28d85686-b677-4473-a0cb-fb41e011b03f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'looking-out-for-you-joy-again',
        title: "Looking Out For You Joy Again",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flooking-out-for-you-joy-again.mp3?alt=media&token=8e0ebe52-dd79-417f-87a3-13e6069022ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lose-my-cool-kali-uchis',
        title: "Lose My Cool Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flose-my-cool-kali-uchis.mp3?alt=media&token=7958ed4f-8d76-4b86-9b4b-385c8e049791",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lost-astronaut-slowed-pinky-smash',
        title: "Lost Astronaut Slowed Pinky Smash",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flost-astronaut-slowed-pinky-smash.mp3?alt=media&token=bd09b91d-dd43-46aa-b667-6de5360cd46f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lost-in-the-fire-gesaffelstein-the-weeknd',
        title: "Lost In The Fire Gesaffelstein The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flost-in-the-fire-gesaffelstein-the-weeknd.mp3?alt=media&token=d689ea1f-5220-4c76-9bf3-b9fc883aa845",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lost-my-pieces-from-toradora-pablo-isidro',
        title: "Lost My Pieces From Toradora Pablo Isidro",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flost-my-pieces-from-toradora-pablo-isidro.mp3?alt=media&token=2dd5fc5a-85f6-4215-b7bd-85b2b6bbe7ca",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lou-deriva-hwungii-rvnge-nulled',
        title: "Lou Deriva Hwungii Rvnge Nulled",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flou-deriva-hwungii-rvnge-nulled.mp3?alt=media&token=07ea9a1c-43c4-450c-be6a-b068f903ac6d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-at-first-sight-1nonly-mkay',
        title: "Love At First Sight 1nonly Mkay",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flove-at-first-sight-1nonly-mkay.mp3?alt=media&token=1f7d975f-dfb3-4cdf-92ea-4c335c1493ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-for-you-loveli-lori-ovg',
        title: "Love For You Loveli Lori Ovg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flove-for-you-loveli-lori-ovg.mp3?alt=media&token=dcf2c411-4aa1-49dd-87e7-78ffd378b1e2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-getting-high-kobzx2z',
        title: "Love Getting High Kobzx2z",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flove-getting-high-kobzx2z.mp3?alt=media&token=88bf4e80-faca-48a9-bd0e-3a4b8ce37bf3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-letters-slevpy808-grioten',
        title: "Love Letters Slevpy808 Grioten",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flove-letters-slevpy808-grioten.mp3?alt=media&token=e1d1454b-2afc-41f1-afdb-b9c0197ae49c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'love-letters-to-maryjane-mirrar',
        title: "Love Letters To Maryjane Mirrar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flove-letters-to-maryjane-mirrar.mp3?alt=media&token=4b0e94ff-9cd3-4c79-ba34-65c33402b4b8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lovely-1nonly',
        title: "Lovely 1nonly",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flovely-1nonly.mp3?alt=media&token=2827cc9f-e109-42cf-96ff-281bca8e076b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lovely-bastards-zwe1hvndxr-yatashigang',
        title: "Lovely Bastards Zwe1hvndxr Yatashigang",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flovely-bastards-zwe1hvndxr-yatashigang.mp3?alt=media&token=71284e7e-eb78-41b4-aab0-2554b22710d0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lovers-rock-tv-girl',
        title: "Lovers Rock Tv Girl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flovers-rock-tv-girl.mp3?alt=media&token=1f44da3f-5dc6-4cc0-83f9-e10bd9cdd5b1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lovin-on-me-jack-harlow',
        title: "Lovin On Me Jack Harlow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flovin-on-me-jack-harlow.mp3?alt=media&token=cc093e99-bdca-4907-9125-e92b3e8ba43e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'low-nevermade-mikeeysmind',
        title: "Low Nevermade Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flow-nevermade-mikeeysmind.mp3?alt=media&token=49a1340b-d7e9-4fd0-9766-95f869ac4f64",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lucid-dreams-juice-wrld',
        title: "Lucid Dreams Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flucid-dreams-juice-wrld.mp3?alt=media&token=dcd6db24-59c2-46d8-a1fa-685ad4faf3c2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lucky-extended-mix-lucky-twice',
        title: "Lucky Extended Mix Lucky Twice",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flucky-extended-mix-lucky-twice.mp3?alt=media&token=085a8227-cc7f-47f1-a3f6-c610ed410f21",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lucky-lucky-twice',
        title: "Lucky Lucky Twice",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flucky-lucky-twice.mp3?alt=media&token=77cc6881-3955-4db1-82e7-900931165625",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'luna-bala-slowed-to-perfection-yb-wasgood-ariis',
        title: "Luna Bala Slowed To Perfection Yb Wasgood Ariis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fluna-bala-slowed-to-perfection-yb-wasgood-ariis.mp3?alt=media&token=fd37d956-faaa-4b0f-b275-8ef74829ddd4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'luna-bala-slowed-yb-wasgood-ariis',
        title: "Luna Bala Slowed Yb Wasgood Ariis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fluna-bala-slowed-yb-wasgood-ariis.mp3?alt=media&token=097ead52-5b46-4795-9ef0-d4ab12251a00",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'luna-la-nakama-yb-wasgood-ariis-sasha-wrist',
        title: "Luna La Nakama Yb Wasgood Ariis Sasha Wrist",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fluna-la-nakama-yb-wasgood-ariis-sasha-wrist.mp3?alt=media&token=345370e3-2265-4505-9cd4-62dc5239f29f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lush-life-zara-larsson',
        title: "Lush Life Zara Larsson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flush-life-zara-larsson.mp3?alt=media&token=e141b095-bd89-4603-bd0c-85e00087bdfb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lust-lil-skies',
        title: "Lust Lil Skies",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flust-lil-skies.mp3?alt=media&token=4697b255-1024-43fc-91e9-2f961469645e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'luv-bad-bitches-future-metro-boomin-brownstone',
        title: "Luv Bad Bitches Future Metro Boomin Brownstone",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fluv-bad-bitches-future-metro-boomin-brownstone.mp3?alt=media&token=790ca93b-2e02-4678-a183-ff0244093664",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lyfe-teefaygoo-prodbysky',
        title: "Lyfe Teefaygoo Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flyfe-teefaygoo-prodbysky.mp3?alt=media&token=6f86046d-1543-4f7c-a80d-6412ace17ad3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'lyfestyl-yeat-lil-wayne',
        title: "Lyfestylë Yeat Lil Wayne",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Flyfestyl%C3%AB-yeat-lil-wayne.mp3?alt=media&token=a87c63b1-7a38-4fd6-b9d4-2da875b9acae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'm-y-l-i-f-e-j-cole-21-savage-morray',
        title: "M Y L I F E J Cole 21 Savage Morray",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fm-y-l-i-f-e-j-cole-21-savage-morray.mp3?alt=media&token=efda85c3-aa49-488b-bc55-2c7a9d2dcd27",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mad-loveli-lori-qkreign',
        title: "Mad Loveli Lori Qkreign",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmad-loveli-lori-qkreign.mp3?alt=media&token=cbb4ba05-bece-485e-97e3-3c94fbaafa3d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'made-it-on-our-own-yeat-esdeekid',
        title: "Made It On Our Own Yeat Esdeekid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmade-it-on-our-own-yeat-esdeekid.mp3?alt=media&token=ad362a2e-04d3-456f-8fd1-4e788760465e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'made-it-this-far-ma-beats-bxco',
        title: "Made It This Far Ma Beats Bxco",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmade-it-this-far-ma-beats-bxco.mp3?alt=media&token=eeaceb30-db63-4e43-9cae-c26a5bd11323",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'magic-johnson-ian',
        title: "Magic Johnson Ian",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmagic-johnson-ian.mp3?alt=media&token=115de60b-7b1e-404e-89b7-183c8de40417",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'make-peace-schwvfty-ogryzek',
        title: "Make Peace Schwvfty Ogryzek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmake-peace-schwvfty-ogryzek.mp3?alt=media&token=06ad02ac-2c53-49d7-9cf0-1220d48587ab",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'make-you-mine-madison-beer',
        title: "Make You Mine Madison Beer",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmake-you-mine-madison-beer.mp3?alt=media&token=bd1a6a0b-d8fb-47d0-889c-0e08cbe78ba9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'malevolncia-imortal-mc-denny-scythermane-slaymacow-mc-mn',
        title: "MalevolêNcia Imortal",
        artist: "Mc Denny Scythermane Slaymacow Mc Mn",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmalevol%C3%AAncia-imortal-feat-mc-denny-scythermane-slaymacow-mc-mn.mp3?alt=media&token=c96cd8b0-9210-43a4-b9ff-bebfc351a0d0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'malvado-de-vapo-xccvdxz',
        title: "Malvado De Vapo Xccvdxz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmalvado-de-vapo-xccvdxz.mp3?alt=media&token=aa5b128d-9f15-4352-aa88-5df9608aee21",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mamas-boy-dominic-fike',
        title: "Mamas Boy Dominic Fike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmamas-boy-dominic-fike.mp3?alt=media&token=cbfb9743-1c12-415e-9c2a-de392852a1f8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mamushi-yuki-chiba-megan-thee-stallion',
        title: "Mamushi",
        artist: "Yuki Chiba Megan Thee Stallion",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmamushi-feat-yuki-chiba-megan-thee-stallion.mp3?alt=media&token=2968a716-f0d2-4864-ac16-28d21ab451e3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'manchild-sabrina-carpenter',
        title: "Manchild Sabrina Carpenter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmanchild-sabrina-carpenter.mp3?alt=media&token=b587fdbd-7a90-4c3e-b8ff-299cf3e9954e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'maniac-slow-nomi-xd',
        title: "Maniac Slow Nomi Xd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmaniac-slow-nomi-xd.mp3?alt=media&token=9b9ff7b0-0131-4745-8aa6-b075af3315e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mary-on-a-cross-eibell',
        title: "Mary On A Cross Eibell",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmary-on-a-cross-eibell.mp3?alt=media&token=236225cd-62d1-44d8-9064-b94f6b892493",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mazko-slowed-s4nri0',
        title: "Mazko Slowed S4nri0",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmazko-slowed-s4nri0.mp3?alt=media&token=25daca2f-07c3-4a07-86f4-a676f9996fb2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'me-tyfi',
        title: "Me Tyfi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fme-tyfi.mp3?alt=media&token=ff7a15dd-5b26-4628-8473-77bd5557384e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'means-i-care-tate-mcrae',
        title: "Means I Care Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmeans-i-care-tate-mcrae.mp3?alt=media&token=cbfd6997-c08d-499a-a36f-012e4e02ab33",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'meltdown-drake-travis-scott',
        title: "Meltdown",
        artist: "Drake Travis Scott",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmeltdown-feat-drake-travis-scott.mp3?alt=media&token=4f8ed690-c7ac-447f-984e-2c31cd317829",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'memories-leadwave',
        title: "Memories Leadwave",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmemories-leadwave.mp3?alt=media&token=531e2de9-0494-48dd-ae7e-a505e31c5d0f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'menace-slowed-reverb-visioner',
        title: "Menace Slowed Reverb Visioner",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmenace-slowed-reverb-visioner.mp3?alt=media&token=8890ae82-b54a-4a4e-9788-f5b179f4829b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mente-m-nakama-mc-staff',
        title: "Mente Má Nakama Mc Staff",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmente-m%C3%A1-nakama-mc-staff.mp3?alt=media&token=70ddd8e1-e520-475c-989d-556fa64b8e6b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'met-her-on-the-internet-kempachii',
        title: "Met Her On The Internet Kempachii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmet-her-on-the-internet-kempachii.mp3?alt=media&token=e5e9aaae-c752-4765-8d2d-d442768b745e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'metamorphosis-interworld',
        title: "Metamorphosis Interworld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmetamorphosis-interworld.mp3?alt=media&token=504935f1-cd5f-4621-8af7-508296fa6929",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'metamorphosis-slowed-reverb-interworld',
        title: "Metamorphosis Slowed Reverb Interworld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmetamorphosis-slowed-reverb-interworld.mp3?alt=media&token=0a6182ee-5ded-4887-9f76-3534e089949a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'metroman-funk-tokyophile',
        title: "Metroman Funk Tokyophile",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmetroman-funk-tokyophile.mp3?alt=media&token=661aec5b-2964-43ee-8623-925ea8313411",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mi-chico-jason-derulo-x-melody-version-dj-goja-jason-derulo-',
        title: "Mi Chico Jason Derulo X Melody Version Dj Goja Jason Derulo Melody",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmi-chico-jason-derulo-x-melody-version-dj-goja-jason-derulo-melody.mp3?alt=media&token=73f2b519-71a4-47e7-bd16-17c45a5096e1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mia-khalifa-ilovefriday',
        title: "Mia Khalifa Ilovefriday",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmia-khalifa-ilovefriday.mp3?alt=media&token=10b6f036-1f6a-4ddf-b512-7718310246dd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mida-hwungii-nfnx',
        title: "Mida Hwungii Nfnx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmida-hwungii-nfnx.mp3?alt=media&token=61b268b3-62b3-4750-8b3c-7da3a38e2f36",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'midnight-kobzx2z-red-luna',
        title: "Midnight Kobzx2z Red Luna",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmidnight-kobzx2z-red-luna.mp3?alt=media&token=85cf7b4d-f31d-468e-be33-e233651a6d8a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'midnight-playamane-nateki',
        title: "Midnight Playamane Nateki",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmidnight-playamane-nateki.mp3?alt=media&token=fbbdc61f-f383-426e-9e95-600271789f2e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'midnight-sun-girls-trip-zara-larsson-pinkpantheress',
        title: "Midnight Sun Girls Trip Zara Larsson Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmidnight-sun-girls-trip-zara-larsson-pinkpantheress.mp3?alt=media&token=4a699122-28a3-4f78-85d1-09862fe3aee8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mile-high-memories-future-metro-boomin',
        title: "Mile High Memories Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmile-high-memories-future-metro-boomin.mp3?alt=media&token=9e7f87cf-fe84-4268-a431-4235542e4344",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'million-dollar-baby-tommy-richman',
        title: "Million Dollar Baby Tommy Richman",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmillion-dollar-baby-tommy-richman.mp3?alt=media&token=8ddb1bdf-a908-4d1f-9138-5977729962a5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'millionaire-6arelyhuman-asteria-kets4eki',
        title: "Millionaire 6arelyhuman Asteria Kets4eki",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmillionaire-6arelyhuman-asteria-kets4eki.mp3?alt=media&token=ff0918a5-0fb9-4264-8f08-dc4f8c57213b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mine-1nonly',
        title: "Mine 1nonly",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmine-1nonly.mp3?alt=media&token=b4d2f39b-9182-43cc-b4c5-ab6f578b4e4a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mira-hwungii-0hex-txnji',
        title: "Mira Hwungii 0hex Txnji",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmira-hwungii-0hex-txnji.mp3?alt=media&token=b59fea1d-f38c-4e1f-9986-4ddbf0bcd0ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'misery-pupsies',
        title: "Misery Pupsies",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmisery-pupsies.mp3?alt=media&token=ad359cff-1b52-4d22-8ca6-7256ae7532c6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'miss-me-schnarker',
        title: "Miss Me Schnarker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmiss-me-schnarker.mp3?alt=media&token=47dbe30e-3af3-4cfa-85f5-fadd795e8d51",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'miss-me-slowed-fuegotre-taki420-lavmiri',
        title: "Miss Me Slowed Fuegotre Taki420 Lavmiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmiss-me-slowed-fuegotre-taki420-lavmiri.mp3?alt=media&token=5c772eab-ccfd-4ccf-ac98-d146f0ea09f0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'miss-me-slowed-reverb-schnarker',
        title: "Miss Me Slowed Reverb Schnarker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmiss-me-slowed-reverb-schnarker.mp3?alt=media&token=ed80567a-fea4-4f90-8dcd-09c8c79fb812",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'miss-possessive-tate-mcrae',
        title: "Miss Possessive Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmiss-possessive-tate-mcrae.mp3?alt=media&token=0e4b05f2-10c4-49d3-987e-35cb46dc7d3e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'missing-life-slowed-sounds-slowed-qkreign-gabriawll',
        title: "Missing Life",
        artist: "Slowed Sounds Slowed Qkreign Gabriawll",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmissing-life-feat-slowed-sounds-slowed-qkreign-gabriawll.mp3?alt=media&token=8b473cf6-4336-48a7-99e0-811aacc10ce6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'missing-life-slowed-qkreign-gabriawll',
        title: "Missing Life Slowed Qkreign Gabriawll",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmissing-life-slowed-qkreign-gabriawll.mp3?alt=media&token=3808f62c-a4e7-454f-be8d-97be4e03e34f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'missing-textures-slowed-down-nivek-fforhs',
        title: "Missing Textures Slowed Down Nivek Fforhs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmissing-textures-slowed-down-nivek-fforhs.mp3?alt=media&token=fcef1b0d-169b-49a4-a41f-7fdd7acd0541",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mist-cinematic-intro',
        title: "Mist Cinematic Intro",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmist-cinematic-intro.mp3?alt=media&token=816c23c6-0776-450a-b4ac-b5ef6a5a8e24",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mist-esdeekid-rico-ace',
        title: "Mist Esdeekid Rico Ace",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmist-esdeekid-rico-ace.mp3?alt=media&token=4460ed83-8044-4acc-9001-80f0d8278d68",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'molly-mikeeysmind',
        title: "Molly Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmolly-mikeeysmind.mp3?alt=media&token=bbe609de-5507-417d-aced-5b3e53fca1bb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'moment-vierre-cloud',
        title: "Moment Vierre Cloud",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmoment-vierre-cloud.mp3?alt=media&token=8aa7720b-5e0f-44e3-a0b6-e2f0b15f7652",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mommanem-tyler-the-creator',
        title: "Mommanem Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmommanem-tyler-the-creator.mp3?alt=media&token=6c3faf05-18d7-4bb3-944d-c5048b5852cd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mommas-love-morray',
        title: "Mommas Love Morray",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmommas-love-morray.mp3?alt=media&token=7063b89f-bd4f-4e96-b6f7-12e6d4cf4ee9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'money-lisa',
        title: "Money Lisa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmoney-lisa.mp3?alt=media&token=8d8911fb-5111-4197-b5e8-ed3678ec1034",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'monster-skillet',
        title: "Monster Skillet",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmonster-skillet.mp3?alt=media&token=99f7883a-211a-418d-9d57-8325809f1ae8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-alquimia-h6itam-n7san7os-mc-menor-do-alvorada',
        title: "Montagem Alquimia H6itam N7san7os Mc Menor Do Alvorada",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-alquimia-h6itam-n7san7os-mc-menor-do-alvorada.mp3?alt=media&token=df4df569-7aa1-4e49-bda0-5881c5cd222b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-bailo-mc-jhey-repsaj-atlxs-mxzi',
        title: "Montagem BailãO",
        artist: "Mc Jhey Repsaj Atlxs Mxzi",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-bail%C3%A3o-feat-mc-jhey-repsaj-atlxs-mxzi.mp3?alt=media&token=28eb15bb-9d4c-44b3-b895-6c4671c4616f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-bandido-jmilton-itamar-mc',
        title: "Montagem Bandido Jmilton Itamar Mc",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-bandido-jmilton-itamar-mc.mp3?alt=media&token=423225f4-19c8-4a3a-98b6-bec1a39ad767",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-bibi-game-lxngvx-slowboy-bibi-babydoll',
        title: "Montagem Bibi Game Lxngvx Slowboy Bibi Babydoll",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-bibi-game-lxngvx-slowboy-bibi-babydoll.mp3?alt=media&token=9c11ac43-62d1-4c5f-acdf-014422f117f8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-botnica-dj-fku',
        title: "Montagem BotâNica Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-bot%C3%A2nica-dj-fku.mp3?alt=media&token=9a7f81d8-26b0-412c-a1b3-6f94b751952f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-deprimido-repsaj-luc-wall',
        title: "Montagem Deprimido Repsaj Luc Wall",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-deprimido-repsaj-luc-wall.mp3?alt=media&token=725f0239-9261-47ab-9c42-203083096f40",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-direo-dj-fku-farofinat-beats-dj-samir',
        title: "Montagem DireçãO Dj Fku Farofinat Beats Dj Samir",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-dire%C3%A7%C3%A3o-dj-fku-farofinat-beats-dj-samir.mp3?alt=media&token=3687526f-1a1f-486c-9f91-5dab5b1e3a97",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-entregar-mxzi-dj-fku',
        title: "Montagem Entregar Mxzi Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-entregar-mxzi-dj-fku.mp3?alt=media&token=13641439-f3c0-4cf8-88e1-bcc66fc1e18d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-fama-nomi-xd-eekinomia-human-scums',
        title: "Montagem Fama Nomi Xd Eekinomia Human Scums",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-fama-nomi-xd-eekinomia-human-scums.mp3?alt=media&token=f322e6bd-a290-4251-9970-afdb17f5fc29",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-green-renitch-v1-edit-version-tsk4-fyex-dj-samir',
        title: "Montagem Green Renitch V1 Edit Version Tsk4 Fyex Dj Samir",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-green-renitch-v1-edit-version-tsk4-fyex-dj-samir.mp3?alt=media&token=e20aa382-9159-49f4-8d93-844f74e6e593",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-ladro-super-slowed-atlxs-mxzi-itamar-mc',
        title: "Montagem LadrãO Super Slowed Atlxs Mxzi Itamar Mc",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-ladr%C3%A3o-super-slowed-atlxs-mxzi-itamar-mc.mp3?alt=media&token=4098d477-16bb-4110-9ef6-1420c37d1211",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-miau-lenar',
        title: "Montagem Miau Lenar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-miau-lenar.mp3?alt=media&token=96a88c9c-30a7-4ba2-8052-56b8d14c1f2a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-moe-dj-fku',
        title: "Montagem Moe Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-moe-dj-fku.mp3?alt=media&token=a23e2ac5-c2b0-4390-806a-00a8df1a3765",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-moe-slowed-dj-fku',
        title: "Montagem Moe Slowed Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-moe-slowed-dj-fku.mp3?alt=media&token=8230837b-ff94-4e36-b7dc-7e66d0bffbf9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-moe-sped-up-dj-fku',
        title: "Montagem Moe Sped Up Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-moe-sped-up-dj-fku.mp3?alt=media&token=04d25b79-3269-4cee-856a-bcb842105491",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-moe-super-slowed-dj-fku',
        title: "Montagem Moe Super Slowed Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-moe-super-slowed-dj-fku.mp3?alt=media&token=b9d93efc-9727-4093-84ce-a0b20a355bec",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-moe-ultra-slowed-dj-fku',
        title: "Montagem Moe Ultra Slowed Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-moe-ultra-slowed-dj-fku.mp3?alt=media&token=e63c4c59-9832-418e-b3fb-cfe52c9263a2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-mysterious-game-slowed-lxngvx',
        title: "Montagem Mysterious Game Slowed Lxngvx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-mysterious-game-slowed-lxngvx.mp3?alt=media&token=11c45db4-8fbb-400b-8c6a-b642365204df",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-nuar-lxngvx-tessai',
        title: "Montagem Nuar Lxngvx Tessai",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-nuar-lxngvx-tessai.mp3?alt=media&token=ce479fc8-c623-451e-93ac-126759549838",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-pasion-mvsterious-gxxst',
        title: "Montagem Pasion Mvsterious Gxxst",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-pasion-mvsterious-gxxst.mp3?alt=media&token=a7a996bf-4605-4be3-b8de-1d101fc81c2f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-rugada-sayfalse-cape-jxndro',
        title: "Montagem Rugada Sayfalse Cape Jxndro",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-rugada-sayfalse-cape-jxndro.mp3?alt=media&token=9cc0d830-f6d7-40cd-9bef-1e1cc3928e3e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-rugada-sayfalse',
        title: "Montagem Rugada Sayfalse",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-rugada-sayfalse.mp3?alt=media&token=15bd02b3-ff37-4600-8ce0-e98487719f70",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-supersonic-khaos-jmilton-mc-jaj',
        title: "Montagem Supersonic Khaos Jmilton Mc Jajá",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-supersonic-khaos-jmilton-mc-jaj%C3%A1.mp3?alt=media&token=25fa5454-f2f1-44d5-8996-dee983f6672e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-tomada-mxzi',
        title: "Montagem Tomada Mxzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-tomada-mxzi.mp3?alt=media&token=20d3a9a6-8bd9-4a33-8011-6ee4a5befb13",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-tomada-super-slowed-mxzi',
        title: "Montagem Tomada Super Slowed Mxzi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-tomada-super-slowed-mxzi.mp3?alt=media&token=43c284c9-847b-4275-ac7d-9e7da6ec0b78",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-ultimato-dj-fku',
        title: "Montagem Ultimato Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-ultimato-dj-fku.mp3?alt=media&token=1833843b-7cfb-491f-82fb-f90b81dd597e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-vibrado-flame-runner',
        title: "Montagem VibradãO Flame Runner",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-vibrad%C3%A3o-flame-runner.mp3?alt=media&token=92e25d22-717e-49ca-88e7-48a288701efe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'montagem-xonada-mxzi-dj-samir-dj-javi26',
        title: "Montagem Xonada Mxzi Dj Samir Dj Javi26",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmontagem-xonada-mxzi-dj-samir-dj-javi26.mp3?alt=media&token=60c76a45-d51b-49a9-b973-5110410025e8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mony-so-big-yeat',
        title: "MonëY So Big Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmon%C3%ABy-so-big-yeat.mp3?alt=media&token=9ee65569-b203-4570-85c7-5d7dbf466461",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mood-swings-lil-tjay-pop-smoke',
        title: "Mood Swings",
        artist: "Lil Tjay Pop Smoke",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmood-swings-feat-lil-tjay-pop-smoke.mp3?alt=media&token=8792bcd1-721c-4fdf-88de-c27adec01982",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'moon-ultra-slowed-inxky',
        title: "Moon Ultra Slowed Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmoon-ultra-slowed-inxky.mp3?alt=media&token=0198590a-5d00-4c0b-940c-c8fc50e45c9b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mortals-laura-brehm-slowed-warriyo',
        title: "Mortals",
        artist: "Laura Brehm Slowed Warriyo",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmortals-feat-laura-brehm-slowed-warriyo.mp3?alt=media&token=a946af09-a335-4d17-acfb-836b10bf629f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mortals-slowed-warriyo-laura-brehm-slowed-sounds',
        title: "Mortals Slowed Warriyo Laura Brehm Slowed Sounds",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmortals-slowed-warriyo-laura-brehm-slowed-sounds.mp3?alt=media&token=ada4dac8-6ebb-495a-a16c-044a495c9088",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mor-yeat',
        title: "Morë Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmor%C3%AB-yeat.mp3?alt=media&token=6b6a967d-69a8-476a-91e9-3dbb855a94fb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mr-inbetweenit-yeat',
        title: "Mr Inbetweenit Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmr-inbetweenit-yeat.mp3?alt=media&token=052e4cda-3ae3-47ba-a7fc-79233eb4af69",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mr-jones-future-pop-smoke',
        title: "Mr Jones",
        artist: "Future Pop Smoke",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmr-jones-feat-future-pop-smoke.mp3?alt=media&token=70a2f431-4082-406c-ab44-735dcb788277",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mrs-magic-strawberry-guy',
        title: "Mrs Magic Strawberry Guy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmrs-magic-strawberry-guy.mp3?alt=media&token=865a7c28-ab44-4503-bea8-5cff54da94a8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mrsnowman-e-girls',
        title: "Mrsnowman E Girls",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmrsnowman-e-girls.mp3?alt=media&token=f5a899e5-e2ec-4d05-8e77-8c906d031572",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mtg-pista-toma-rxdxvil-dj-fku-john-bist',
        title: "Mtg Pista Toma Rxdxvil Dj Fku John Bist",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmtg-pista-toma-rxdxvil-dj-fku-john-bist.mp3?alt=media&token=711332d7-0ac9-4d34-a795-7b705b958951",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mtg-vingana-slowed-reverb-dj-fku',
        title: "Mtg VingançA Slowed Reverb Dj Fku",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmtg-vingan%C3%A7a-slowed-reverb-dj-fku.mp3?alt=media&token=4866f4f4-2457-4d95-9733-cd2aee703b93",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mundo-gta-lxn-luis-cataln',
        title: "Mundo Gta Lxn Luis CataláN",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmundo-gta-lxn-luis-catal%C3%A1n.mp3?alt=media&token=a17d87df-ba0e-405b-ac3c-527d3d11f001",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-eyes-pt-2-slowed-matthias-valentine',
        title: "My Eyes Pt 2 Slowed Matthias Valentine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-eyes-pt-2-slowed-matthias-valentine.mp3?alt=media&token=c3b781a1-e7d5-47fc-aa27-d172e2097622",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-eyes-travis-scott',
        title: "My Eyes Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-eyes-travis-scott.mp3?alt=media&token=6ec49c9f-7c07-4b28-b60d-d48dca911e19",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-face-imis-ibty',
        title: "My Face Imis Ibty",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-face-imis-ibty.mp3?alt=media&token=3cd3d22e-cbd6-490f-beed-3191f0a33fa7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-fault-slowed-melly-mike',
        title: "My Fault Slowed Melly Mike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-fault-slowed-melly-mike.mp3?alt=media&token=0cd42f40-5f27-4c6c-9564-48ba2dc4e545",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-girl-isabel-larosa',
        title: "My Girl Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-girl-isabel-larosa.mp3?alt=media&token=5461573f-58f2-492e-9c8a-a9c1f7a4904f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-jealousy-vivi-baby-ovg',
        title: "My Jealousy Vivi Baby Ovg",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-jealousy-vivi-baby-ovg.mp3?alt=media&token=025e324d-8a7c-4f45-871b-0ff8aab49563",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-kind-of-woman-mac-demarco',
        title: "My Kind Of Woman Mac Demarco",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-kind-of-woman-mac-demarco.mp3?alt=media&token=74159039-f174-4573-a056-00f3906bace3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-love-jess-glynne-route-94',
        title: "My Love",
        artist: "Jess Glynne Route 94",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-love-feat-jess-glynne-route-94.mp3?alt=media&token=22306b8d-1f4a-4c9d-860e-9300fbcd5bfe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-love-mine-all-mine-mitski',
        title: "My Love Mine All Mine Mitski",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-love-mine-all-mine-mitski.mp3?alt=media&token=751933b7-2a54-4bc4-a37c-94e3c173a965",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'my-type-saweetie',
        title: "My Type Saweetie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fmy-type-saweetie.mp3?alt=media&token=99e02a4a-bfe1-4007-a260-9f3af35da8cb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nada-de-nada-kvrxd-maxpvnk-dj-ritmo-divino',
        title: "Nada De Nada Kvrxd Maxpvnk Dj Ritmo Divino",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnada-de-nada-kvrxd-maxpvnk-dj-ritmo-divino.mp3?alt=media&token=835ed6ff-20f6-4f92-8d60-16d9be3dd107",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'naive-udiennx-hxvsage',
        title: "Naive Udiennx Hxvsage",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnaive-udiennx-hxvsage.mp3?alt=media&token=27ff1d62-b978-498b-bdbc-a550601ce448",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nani-sped-up-saweetie',
        title: "Nani Sped Up Saweetie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnani-sped-up-saweetie.mp3?alt=media&token=8afd74c1-2949-44e9-93a1-af48a72f3034",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nao-atira-ogryzek-penkramin-snysta',
        title: "Nao Atira Ogryzek Penkramin Snysta",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnao-atira-ogryzek-penkramin-snysta.mp3?alt=media&token=e540ecf0-72f3-489b-9e49-78fca80f4726",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nao-atira-slowed-ogryzek-penkramin-snysta',
        title: "Nao Atira Slowed Ogryzek Penkramin Snysta",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnao-atira-slowed-ogryzek-penkramin-snysta.mp3?alt=media&token=e8bde652-7d41-414b-ad49-ca40d8d0d2c3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nao-atira-super-slowed-ogryzek-penkramin-snysta',
        title: "Nao Atira Super Slowed Ogryzek Penkramin Snysta",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnao-atira-super-slowed-ogryzek-penkramin-snysta.mp3?alt=media&token=5e676922-c0f0-4a3f-ab60-d5e9de12c6bf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nasty-tinashe',
        title: "Nasty Tinashe",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnasty-tinashe.mp3?alt=media&token=3fc65076-9f93-4d50-b8f8-6ce751cc13d0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'national-treasures-drake',
        title: "National Treasures Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnational-treasures-drake.mp3?alt=media&token=d7749f8b-31b8-4e32-88f5-32ad4e9ad5d2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'neighbors-j-cole',
        title: "Neighbors J Cole",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fneighbors-j-cole.mp3?alt=media&token=b5f2b6f9-871d-4146-bdcb-0530d33a0b96",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nemzz-x-did-it-first-dawnpercs',
        title: "Nemzz X Did It First Dawnpercs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnemzz-x-did-it-first-dawnpercs.mp3?alt=media&token=485519e6-8986-4ca2-aca3-dbaecc30618a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'never-change-rj-pasin-ptasinski',
        title: "Never Change",
        artist: "Rj Pasin Ptasinski",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnever-change-feat-rj-pasin-ptasinski.mp3?alt=media&token=9cdea46e-dd98-443c-8bef-3a10e224a247",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'never-left-lil-tecca',
        title: "Never Left Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnever-left-lil-tecca.mp3?alt=media&token=7f6fdc0f-db9d-470c-8da9-c01981660d69",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'never-lose-me-flo-milli',
        title: "Never Lose Me Flo Milli",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnever-lose-me-flo-milli.mp3?alt=media&token=ef1ee268-9da8-4c3e-bc9e-daa53762b1c6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'new-bestie-drake',
        title: "New Bestie Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnew-bestie-drake.mp3?alt=media&token=7b3cf530-a5b9-42ed-862c-5cad28eb9bd5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'new-drop-don-toliver',
        title: "New Drop Don Toliver",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnew-drop-don-toliver.mp3?alt=media&token=9f760804-f9eb-4c5c-89e8-adf7665a520e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'new-drop-x-trance-skyemane-chxse-wave-sapphink',
        title: "New Drop X Trance Skyemane Chxse Wave Sapphink",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnew-drop-x-trance-skyemane-chxse-wave-sapphink.mp3?alt=media&token=2b374747-d79f-4f6a-8c35-4a8dbf88fb24",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'new-jeans-jersey-club-dxrkaii-jiandro',
        title: "New Jeans Jersey Club Dxrkaii Jiandro",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnew-jeans-jersey-club-dxrkaii-jiandro.mp3?alt=media&token=bf35f6b4-78cd-4c38-9572-40cebb3d0d3d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'new-jeans-jersey-club-slowed-velours',
        title: "New Jeans Jersey Club Slowed Velours",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnew-jeans-jersey-club-slowed-velours.mp3?alt=media&token=99f3d173-99f1-4e67-ab65-8dfd2ee06c49",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'new-trip-quavo-yeat-bnyx',
        title: "New Trip Quavo Yeat Bnyx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnew-trip-quavo-yeat-bnyx.mp3?alt=media&token=17e1f484-5bda-411c-8c89-5b33ef2b08a1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nias-in-paris-ja-z-kanye-west',
        title: "Nias In Paris Jaÿ Z Kanye West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnias-in-paris-ja%C3%BF-z-kanye-west.mp3?alt=media&token=877dfac2-84de-4985-9e9a-5cb0b62a2e6d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nights-like-this-future-metro-boomin',
        title: "Nights Like This Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnights-like-this-future-metro-boomin.mp3?alt=media&token=ef35c8f7-5a71-4c7e-b10d-60f38fb405b2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nights-like-this-the-kid-laroi',
        title: "Nights Like This The Kid Laroi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnights-like-this-the-kid-laroi.mp3?alt=media&token=e23a3eb7-264b-4b33-b78a-19b2c9928952",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-batido-slowed-zxkai-slxughter',
        title: "No BatidãO Slowed Zxkai Slxughter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-batid%C3%A3o-slowed-zxkai-slxughter.mp3?alt=media&token=f1c164a1-3502-4e11-b04a-95ad09e9ccaa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-batido-super-slowed-zxkai-slxughter',
        title: "No BatidãO Super Slowed Zxkai Slxughter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-batid%C3%A3o-super-slowed-zxkai-slxughter.mp3?alt=media&token=39dee60b-86e8-4498-98f9-7167afa553fb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-batido-ultra-slowed-zxkai-slxughter',
        title: "No BatidãO Ultra Slowed Zxkai Slxughter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-batid%C3%A3o-ultra-slowed-zxkai-slxughter.mp3?alt=media&token=53e9533c-1c0e-4a7f-8053-04b5fef09b3d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-broke-boys-disco-lines-tinashe',
        title: "No Broke Boys Disco Lines Tinashe",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-broke-boys-disco-lines-tinashe.mp3?alt=media&token=44bbec6c-fcee-43bb-953f-7e6d9728c999",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-cap-lil-tjay',
        title: "No Cap Lil Tjay",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-cap-lil-tjay.mp3?alt=media&token=3fc48b5d-cb30-4147-ade0-60a1d4d0c768",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-crumbs-radio-edit',
        title: "No Crumbs Radio Edit",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-crumbs-radio-edit.mp3?alt=media&token=0f8cba51-4cc0-4221-9447-80dfa60c7d5e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-fear-funk-slowed-kvrxd-andromeda',
        title: "No Fear Funk Slowed Kvrxd Andromeda",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-fear-funk-slowed-kvrxd-andromeda.mp3?alt=media&token=06df9864-08aa-4909-a25d-3e122fae0f6b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-hands-roscoe-dash-wale-waka-flocka-flame',
        title: "No Hands",
        artist: "Roscoe Dash Wale Waka Flocka Flame",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-hands-feat-roscoe-dash-wale-waka-flocka-flame.mp3?alt=media&token=7ed39767-f1d0-4a8c-9176-f3691caa29fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-im-not-in-love-tate-mcrae',
        title: "No Im Not In Love Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-im-not-in-love-tate-mcrae.mp3?alt=media&token=4e48b756-a605-41f5-b1c0-d5820c4da57f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-pole-slowed-reverb-skyemane-sapphink',
        title: "No Pole Slowed Reverb Skyemane Sapphink",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-pole-slowed-reverb-skyemane-sapphink.mp3?alt=media&token=3729407b-fff0-4f78-acb6-7145a5a60999",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-rest-kennethwayne',
        title: "No Rest Kennethwayne",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-rest-kennethwayne.mp3?alt=media&token=765af3ca-3b9c-4190-a2d0-8af799426dc7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-role-modelz-j-cole',
        title: "No Role Modelz J Cole",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-role-modelz-j-cole.mp3?alt=media&token=3b770d45-58d6-4ed2-8162-7e73139565ef",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-save-point-from-cyberpunk-2077-run-the-jewels',
        title: "No Save Point From Cyberpunk 2077 Run The Jewels",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-save-point-from-cyberpunk-2077-run-the-jewels.mp3?alt=media&token=df28e902-c136-41b6-b45e-024243adc7da",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-signal-sped-up-juggsi-kyra',
        title: "No Signal Sped Up Juggsi Kyra",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-signal-sped-up-juggsi-kyra.mp3?alt=media&token=3eb8add6-b6b4-4c52-a5b0-5e7a8e61f439",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'no-way-yot-club',
        title: "No Way Yot Club",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fno-way-yot-club.mp3?alt=media&token=c62cd99c-eb44-4614-8844-be544e330303",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nobody-knows-my-struggle-future-metro-boomin',
        title: "Nobody Knows My Struggle Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnobody-knows-my-struggle-future-metro-boomin.mp3?alt=media&token=7c9efefa-bfc7-44f4-9614-2ac8661476d4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'noche-eterna-flame-runner-rvnge',
        title: "Noche Eterna Flame Runner Rvnge",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnoche-eterna-flame-runner-rvnge.mp3?alt=media&token=996bc127-cadd-4b0d-9e4e-2210db731d57",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'noche-invita-qmiir-akhmedov',
        title: "Noche Invita Qmiir Akhmedov",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnoche-invita-qmiir-akhmedov.mp3?alt=media&token=400bc42c-9283-4c11-87ff-088c448a4b73",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'noice-udiennx',
        title: "Noice Udiennx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnoice-udiennx.mp3?alt=media&token=69bad4f9-e1ed-40b1-929f-b5a01fd93c21",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'noir-sho',
        title: "Noir Sho",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnoir-sho.mp3?alt=media&token=ff492157-2dd8-497a-a5dd-a0f52145785c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'noite-lenta-dj-samir-nulteex-dj-zarek',
        title: "Noite Lenta Dj Samir Nulteex Dj Zarek",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnoite-lenta-dj-samir-nulteex-dj-zarek.mp3?alt=media&token=b6a81614-9508-4e16-9055-4242743d2096",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'noite-preta-repsaj-zericxxn-avaru',
        title: "Noite Preta Repsaj Zericxxn Avaru",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnoite-preta-repsaj-zericxxn-avaru.mp3?alt=media&token=5d6e637b-1376-4cf5-af4c-281a256f9031",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nokia-drake',
        title: "Nokia Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnokia-drake.mp3?alt=media&token=098df9c1-86dc-48d1-80e2-357ebd40fac4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nonstop-drake',
        title: "Nonstop Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnonstop-drake.mp3?alt=media&token=9aeeaeb0-75de-411d-aebe-392741a8423c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nonstop-guitar-version-visioner',
        title: "Nonstop Guitar Version Visioner",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnonstop-guitar-version-visioner.mp3?alt=media&token=83fa83ea-ae6a-4ee9-950b-2adf6d6a5120",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nostalgia-tate-mcrae',
        title: "Nostalgia Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnostalgia-tate-mcrae.mp3?alt=media&token=b2c36a63-2165-43af-adb2-350b9f56383a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'not-again-rio-da-yung-og',
        title: "Not Again Rio Da Yung Og",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnot-again-rio-da-yung-og.mp3?alt=media&token=513659c2-24c3-41bd-805e-cad0698d89e8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'not-allowed-tv-girl',
        title: "Not Allowed Tv Girl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnot-allowed-tv-girl.mp3?alt=media&token=922921af-f524-447e-983b-783af7f69b67",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'not-like-us-kendrick-lamar',
        title: "Not Like Us Kendrick Lamar",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnot-like-us-kendrick-lamar.mp3?alt=media&token=900d2ae7-de5e-43f8-8d94-f78e68901f52",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'not-my-problem-laila',
        title: "Not My Problem Laila",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnot-my-problem-laila.mp3?alt=media&token=5edbaa41-d72c-4f43-a2d1-fa1b32088940",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nothing-chang-yeat',
        title: "Nothing Changë Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnothing-chang%C3%AB-yeat.mp3?alt=media&token=97829fbe-29b3-46a5-b67e-58534a259b45",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nothings-new-rio-romeo',
        title: "Nothings New Rio Romeo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnothings-new-rio-romeo.mp3?alt=media&token=5b4bfb69-9fd1-484a-983f-7bebbb7ae7fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'notion-the-rare-occasions',
        title: "Notion The Rare Occasions",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnotion-the-rare-occasions.mp3?alt=media&token=2d71ffcf-964a-4abf-b2a8-ddfff639448e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'now-or-never-tkandz-cxsper',
        title: "Now Or Never Tkandz Cxsper",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnow-or-never-tkandz-cxsper.mp3?alt=media&token=3e4909b7-7423-448a-8cfe-23386fd6ccac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'number-one-bankai-hazel-fernandes-shiro-sagisu',
        title: "Number One Bankai",
        artist: "Hazel Fernandes Shiro Sagisu",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnumber-one-bankai-feat-hazel-fernandes-shiro-sagisu.mp3?alt=media&token=e1e81e7d-9658-45d0-bf68-17c352956fad",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'numbers-vin-archive',
        title: "Numbers Vin Archive",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnumbers-vin-archive.mp3?alt=media&token=3cf0bdcf-0116-4915-8bd9-1b093f2e9198",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nun-id-change-yeat',
        title: "Nun Id Change Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnun-id-change-yeat.mp3?alt=media&token=6d4ccd63-c357-4265-bbd9-2db62ebb7319",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nun-less-mikeeysmind-dadanny',
        title: "Nun Less Mikeeysmind Dadanny",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnun-less-mikeeysmind-dadanny.mp3?alt=media&token=c95af8c3-9308-4ea0-a7e2-cb6aab2aac67",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nunca-muda-scythermane-nxght-mc-fabinho-da-osk',
        title: "Nunca Muda Scythermane Nxght Mc Fabinho Da Osk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnunca-muda-scythermane-nxght-mc-fabinho-da-osk.mp3?alt=media&token=2fa43256-d401-47ae-86d3-65f77ed0ac7f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nunca-muda-scythermane-nxght',
        title: "Nunca Muda Scythermane Nxght",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnunca-muda-scythermane-nxght.mp3?alt=media&token=6e114a93-341c-4e47-a164-aeb41210a415",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nunca-muda-slowed-scythermane-nxght-mc-fabinho-da-osk',
        title: "Nunca Muda Slowed Scythermane Nxght Mc Fabinho Da Osk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnunca-muda-slowed-scythermane-nxght-mc-fabinho-da-osk.mp3?alt=media&token=6a899635-62dc-482a-ac7e-0d74090ce5a1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nunca-muda-slowed-scythermane-nxght',
        title: "Nunca Muda Slowed Scythermane Nxght",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnunca-muda-slowed-scythermane-nxght.mp3?alt=media&token=82dd2929-f12b-4943-84ef-de59e3c99f2d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'nuts-rainy-bear-lil-peep',
        title: "Nuts",
        artist: "Rainy Bear Lil Peep",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fnuts-feat-rainy-bear-lil-peep.mp3?alt=media&token=8d64933b-8ec1-477f-b36b-276ad7dd50f0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'obsessed-zandros-limi',
        title: "Obsessed Zandros Limi",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fobsessed-zandros-limi.mp3?alt=media&token=973c583e-6529-40f0-856a-7b5f52a602fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'oculta-illxsion',
        title: "Oculta Illxsion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foculta-illxsion.mp3?alt=media&token=a2a5f04e-0a5b-4ede-bd04-4c8750e120f4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'off-the-leash-yvngxchris-tana-luisss',
        title: "Off The Leash",
        artist: "Yvngxchris Tana Luisss",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foff-the-leash-feat-yvngxchris-tana-luisss.mp3?alt=media&token=cd758a6f-1ccc-4356-b86f-43d86bdba609",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'often-kygo-remix-the-weeknd',
        title: "Often Kygo Remix The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foften-kygo-remix-the-weeknd.mp3?alt=media&token=1e939493-ea78-466d-94e6-5ab890008b82",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'oh-my-little-baby-boy-hardstyle-velours',
        title: "Oh My Little Baby Boy Hardstyle Velours",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foh-my-little-baby-boy-hardstyle-velours.mp3?alt=media&token=3cf6f9d1-bf1b-4415-a1db-d8a0f2a617cd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'oh-myy-rich-amiri',
        title: "Oh Myy Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foh-myy-rich-amiri.mp3?alt=media&token=8ed424a3-8666-40d2-94ba-ca98c70a6bd2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'okay-extended-mix-jt',
        title: "Okay Extended Mix Jt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fokay-extended-mix-jt.mp3?alt=media&token=99f66a5c-341e-4f33-bcc3-b5b6b6a04967",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'okay-jt',
        title: "Okay Jt",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fokay-jt.mp3?alt=media&token=3469f3fe-562b-4718-b7ce-c58c1a1f2386",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'okay-remix-jt-jeezy',
        title: "Okay Remix Jt Jeezy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fokay-remix-jt-jeezy.mp3?alt=media&token=d67b0d25-69ea-47c2-954b-f139c2b96962",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'older-sped-up-isabel-larosa',
        title: "Older Sped Up Isabel Larosa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Folder-sped-up-isabel-larosa.mp3?alt=media&token=c50695b3-0300-4275-8d7e-71cd69225339",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'olha-mensagem-kgj-sekimane-scythermane-nxght-dj-dylanfk',
        title: "Olha Mensagem",
        artist: "Kgj Sekimane Scythermane Nxght Dj Dylanfk",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Folha-mensagem-feat-kgj-sekimane-scythermane-nxght-dj-dylanfk.mp3?alt=media&token=a3aab5f8-d9da-410b-8224-c2504b70e34b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'on-dat-bxtch-lumi-athena-masonn-deforest',
        title: "On Dat Bxtch Lumi Athena Masonn Deforest",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fon-dat-bxtch-lumi-athena-masonn-deforest.mp3?alt=media&token=0e1b0e5c-bc13-42b9-9ed7-a1bd9cbac157",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'on-on-daniel-levi-cartoon-jja',
        title: "On On",
        artist: "Daniel Levi Cartoon JéJa",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fon-on-feat-daniel-levi-cartoon-j%C3%A9ja.mp3?alt=media&token=be658cad-e7da-4c81-8255-6172dccd28c4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'on-tha-lin-yeat',
        title: "On Tha Linë Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fon-tha-lin%C3%AB-yeat.mp3?alt=media&token=5158f232-0e76-4bd3-8361-9800e68f84fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'on-the-floor-pitbull-jennifer-lopez',
        title: "On The Floor",
        artist: "Pitbull Jennifer Lopez",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fon-the-floor-feat-pitbull-jennifer-lopez.mp3?alt=media&token=b7836e4a-2ef5-4ae5-a322-5501d43f901b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'one-big-family-future-metro-boomin',
        title: "One Big Family Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fone-big-family-future-metro-boomin.mp3?alt=media&token=7ac97386-8ab8-4564-93a5-fb5ae74612a8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'one-call-rich-amiri',
        title: "One Call Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fone-call-rich-amiri.mp3?alt=media&token=cdbb3563-8d39-40b4-b998-64d228e9f89f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'one-dance-wizkid-kyla-drake',
        title: "One Dance",
        artist: "Wizkid Kyla Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fone-dance-feat-wizkid-kyla-drake.mp3?alt=media&token=638bdfa8-401c-4297-8208-d00bb9e97bfc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'one-of-the-girls-the-weeknd-jennie-lily-rose-depp',
        title: "One Of The Girls The Weeknd Jennie Lily Rose Depp",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fone-of-the-girls-the-weeknd-jennie-lily-rose-depp.mp3?alt=media&token=1d795d41-154e-4db2-a7f3-d691eaab2ce9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'one-two-22francc',
        title: "One Two 22francc",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fone-two-22francc.mp3?alt=media&token=e65b3f58-f748-4268-a19f-c1edb79b616a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'onlyfans-bibi-babydoll-dsilvestre',
        title: "Onlyfans Bibi Babydoll Dsilvestre",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fonlyfans-bibi-babydoll-dsilvestre.mp3?alt=media&token=4eab2971-00e1-4942-94c6-8193a61f3420",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'open-24-7-lobani-howl',
        title: "Open 24 7 Lobani Howl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fopen-24-7-lobani-howl.mp3?alt=media&token=ae04dc31-e595-4021-9635-d7d1fbba6a93",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'or-nah-the-weeknd-wiz-khalifa-and-dj-mustard-remix-ty-dolla-',
        title: "Or Nah",
        artist: "The Weeknd Wiz Khalifa And Dj Mustard Remix Ty Dolla Ign",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2For-nah-feat-the-weeknd-wiz-khalifa-and-dj-mustard-remix-ty-dolla-ign.mp3?alt=media&token=c965f7d0-0f6d-4873-9606-b73f4f6a7233",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'otaku-hot-girl-megan-thee-stallion',
        title: "Otaku Hot Girl Megan Thee Stallion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fotaku-hot-girl-megan-thee-stallion.mp3?alt=media&token=c2063769-e60e-4501-8700-a890ff1fcefa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'our-time-lil-tecca',
        title: "Our Time Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Four-time-lil-tecca.mp3?alt=media&token=2196b8fa-1eac-47da-9f39-6d457eb6c53f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'out-of-my-hands-future-metro-boomin',
        title: "Out Of My Hands Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fout-of-my-hands-future-metro-boomin.mp3?alt=media&token=fd543d02-2d38-4a71-9134-c14895b13d89",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'out-of-my-league-fitz-and-the-tantrums',
        title: "Out Of My League Fitz And The Tantrums",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fout-of-my-league-fitz-and-the-tantrums.mp3?alt=media&token=d7212cda-54fb-4747-982e-d8a10e4aa4a3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'out-th-way-yeat',
        title: "Out Thë Way Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fout-th%C3%AB-way-yeat.mp3?alt=media&token=90c0c85f-758d-4f67-af49-49eef165e7ef",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'out-west-young-thug-jackboys-travis-scott',
        title: "Out West",
        artist: "Young Thug Jackboys Travis Scott",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fout-west-feat-young-thug-jackboys-travis-scott.mp3?alt=media&token=144eb17f-db21-4382-b220-2abc22d57a74",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'outside-tweaking-drake-stunna-sandy',
        title: "Outside Tweaking Drake Stunna Sandy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foutside-tweaking-drake-stunna-sandy.mp3?alt=media&token=b265bb7d-cfab-461e-8c77-488ee32f6667",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'outta-my-head-iceheart',
        title: "Outta My Head Iceheart",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foutta-my-head-iceheart.mp3?alt=media&token=1fe3e724-656b-4ca9-a98f-90597f5e42c4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'overload-future-metro-boomin',
        title: "Overload Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foverload-future-metro-boomin.mp3?alt=media&token=e6582615-87d4-470a-b51d-00b6d3e04571",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'overseas-ken-carson',
        title: "Overseas Ken Carson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Foverseas-ken-carson.mp3?alt=media&token=5978f6d0-cc18-460e-a076-d4a588e47fa6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'p-power-drake-gunna',
        title: "P Power",
        artist: "Drake Gunna",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fp-power-feat-drake-gunna.mp3?alt=media&token=40a09dca-5e45-44f0-a3ed-fd20fb6fa5bd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'paid-the-fine-lil-baby-ytb-trench-young-stoner-life-young-th',
        title: "Paid The Fine",
        artist: "Lil Baby Ytb Trench Young Stoner Life Young Thug Gunna",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpaid-the-fine-feat-lil-baby-ytb-trench-young-stoner-life-young-thug-gunna.mp3?alt=media&token=d4d0b636-31c3-46c7-8a7c-76f4df4efdba",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pain-pinkpantheress',
        title: "Pain Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpain-pinkpantheress.mp3?alt=media&token=43547481-5eca-4705-9e12-b0ed7b405c2a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'paint-the-town-red-doja-cat',
        title: "Paint The Town Red Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpaint-the-town-red-doja-cat.mp3?alt=media&token=13e254d3-8470-4001-9be1-c622042924f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'paranoid-bob-ty-dolla-ign',
        title: "Paranoid",
        artist: "Bob Ty Dolla Ign",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fparanoid-feat-bob-ty-dolla-ign.mp3?alt=media&token=bf430126-22cf-4913-8101-a27d342c8746",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'parking-lot-mustard-travis-scott',
        title: "Parking Lot Mustard Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fparking-lot-mustard-travis-scott.mp3?alt=media&token=784772bb-065d-48fb-b629-d49a86ce3ad6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'party-eric-reprid',
        title: "Party Eric Reprid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fparty-eric-reprid.mp3?alt=media&token=27a453cb-acc7-4fcd-aa0b-fd4e43930258",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'party-monster-the-weeknd',
        title: "Party Monster The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fparty-monster-the-weeknd.mp3?alt=media&token=2712610c-34af-40db-b4a1-577957c5e60c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'party-rock-anthem-lauren-bennett-goonrock-lmfao',
        title: "Party Rock Anthem",
        artist: "Lauren Bennett Goonrock Lmfao",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fparty-rock-anthem-feat-lauren-bennett-goonrock-lmfao.mp3?alt=media&token=485504e1-e84a-41fe-b8c1-65ba12598016",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pass-out-fixupboy',
        title: "Pass Out Fixupboy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpass-out-fixupboy.mp3?alt=media&token=2cc80271-f411-4399-b543-e18f583deef8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'passa-bala-sayfalse-fxrst',
        title: "Passa Bala Sayfalse Fxrst",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpassa-bala-sayfalse-fxrst.mp3?alt=media&token=4c2f5ee5-f2d3-4813-92b0-b3eb212754f9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'passionfruit-drake',
        title: "Passionfruit Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpassionfruit-drake.mp3?alt=media&token=06bc44f9-aaf3-4a1b-8ad4-c1d7c112484a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'passo-lento-h6itam-saeko-winter',
        title: "Passo Lento H6itam Saeko Winter",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpasso-lento-h6itam-saeko-winter.mp3?alt=media&token=e70aa5f0-11d4-4c2d-b978-9999749ec4a3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'payday-7even-stars',
        title: "Payday 7even Stars",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpayday-7even-stars.mp3?alt=media&token=21893593-1a34-47cc-bec8-7193a631a385",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'peaches-eggplants-latto-sexyy-red-young-nudy',
        title: "Peaches Eggplants",
        artist: "Latto Sexyy Red Young Nudy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpeaches-eggplants-feat-latto-sexyy-red-young-nudy.mp3?alt=media&token=4a43bcce-b61e-418b-8b74-04de42fbdfd3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'percolator-chris-lake-remix-mixed-green-velvet-chris-lake',
        title: "Percolator Chris Lake Remix Mixed Green Velvet Chris Lake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpercolator-chris-lake-remix-mixed-green-velvet-chris-lake.mp3?alt=media&token=7598873e-53d1-447c-9be9-7e2bc71175a5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'phantom-esdeekid-rico-ace',
        title: "Phantom Esdeekid Rico Ace",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fphantom-esdeekid-rico-ace.mp3?alt=media&token=1b757c32-17d5-4765-b991-0ebaa46be057",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'phantom-liberty-dawid-podsiado-pt-adamczyk',
        title: "Phantom Liberty Dawid PodsiadłO Pt Adamczyk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fphantom-liberty-dawid-podsiad%C5%82o-pt-adamczyk.mp3?alt=media&token=72c0cb73-1895-4691-af72-fdfcc88e4545",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'piano-sonata-no-14-moonlight-i-adagio-sostenuto-ludwig-van-b',
        title: "Piano Sonata No 14 Moonlight I Adagio Sostenuto Ludwig Van Beethoven",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpiano-sonata-no-14-moonlight-i-adagio-sostenuto-ludwig-van-beethoven.mp3?alt=media&token=d1b5b767-d7d2-44d3-a769-3fae305f1b79",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pink-lemonade-str8-reload-leostaytrill-mr-reload-it',
        title: "Pink Lemonade Str8 Reload Leostaytrill Mr Reload It",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpink-lemonade-str8-reload-leostaytrill-mr-reload-it.mp3?alt=media&token=e7253360-1a7a-4ce6-b9fe-a968ef46410b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pink-white-frank-ocean',
        title: "Pink White Frank Ocean",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpink-white-frank-ocean.mp3?alt=media&token=8d476f1e-34ab-454e-949b-3eab25d75a7a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pixy-legacy',
        title: "Pixy Legacy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpixy-legacy.mp3?alt=media&token=d77b3e20-6b33-4799-a1bd-be07ed1b6cdd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'play-date-melanie-martinez',
        title: "Play Date Melanie Martinez",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fplay-date-melanie-martinez.mp3?alt=media&token=31ef7229-23fe-41d5-8273-ae4543a91eb8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'plot-twist-drake',
        title: "Plot Twist Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fplot-twist-drake.mp3?alt=media&token=d27ddc8d-b19c-4557-a107-26027ad296bc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'poker-face-lady-gaga',
        title: "Poker Face Lady Gaga",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpoker-face-lady-gaga.mp3?alt=media&token=a9f3fcf4-53ca-40b6-a2bf-88946dea32e8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'police-slowed-reverb-dimeworld',
        title: "Police Slowed Reverb Dimeworld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpolice-slowed-reverb-dimeworld.mp3?alt=media&token=95862528-3000-4c04-9c01-05b8d8e5804c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ponpon-shit-namakopuri-us-cracks',
        title: "Ponpon Shit Namakopuri Us Cracks",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fponpon-shit-namakopuri-us-cracks.mp3?alt=media&token=308de91a-8c3c-4ca7-a82a-7e4ae3ede4cf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pop-like-this-pt-2-prodbycpkshawn',
        title: "Pop Like This Pt 2 Prodbycpkshawn",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpop-like-this-pt-2-prodbycpkshawn.mp3?alt=media&token=371f3091-52c7-412b-be03-6bfb488adca8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'poppin-yeat',
        title: "Poppin Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpoppin-yeat.mp3?alt=media&token=4bdb8d28-7eaf-44dc-9891-ff37193931af",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'popular-playboi-carti-the-weeknd-madonna',
        title: "Popular",
        artist: "Playboi Carti The Weeknd Madonna",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpopular-feat-playboi-carti-the-weeknd-madonna.mp3?alt=media&token=87d2ced8-a368-4f35-8b66-ef4de52f893d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'porsche-nxy0tar0',
        title: "Porsche Nxy0tar0",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fporsche-nxy0tar0.mp3?alt=media&token=db0f1d38-3e3c-43dc-92f7-f6094abe005b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pound-town-2-sexyy-red-nicki-minaj-tay-keith',
        title: "Pound Town 2 Sexyy Red Nicki Minaj Tay Keith",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpound-town-2-sexyy-red-nicki-minaj-tay-keith.mp3?alt=media&token=66ad33f6-6df8-45fe-87f8-884287580e02",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pound-town-sexyy-red-tay-keith',
        title: "Pound Town Sexyy Red Tay Keith",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpound-town-sexyy-red-tay-keith.mp3?alt=media&token=8e5ffc2a-9f5b-4a2e-a313-6adf5d297811",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'power-trip-yeat',
        title: "Power Trip Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpower-trip-yeat.mp3?alt=media&token=66e29566-9510-4c9d-a102-712d069a60fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pressure-saweetie',
        title: "Pressure Saweetie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpressure-saweetie.mp3?alt=media&token=cd8bcd61-ef64-4bc3-be1e-cbe6553037c8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'prince-of-egypt-mofe',
        title: "Prince Of Egypt Mofe",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fprince-of-egypt-mofe.mp3?alt=media&token=2439de66-92fe-4599-b6c3-23f673e1ca7d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'princess-diana-ice-spice-nicki-minaj',
        title: "Princess Diana Ice Spice Nicki Minaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fprincess-diana-ice-spice-nicki-minaj.mp3?alt=media&token=39f77b3b-7e76-47b4-8f9b-2ff57f04ac36",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'prioritizing-drake',
        title: "Prioritizing Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fprioritizing-drake.mp3?alt=media&token=690b98ab-4e46-49d5-b142-b0798e9f3893",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'prom-night-riovaz',
        title: "Prom Night Riovaz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fprom-night-riovaz.mp3?alt=media&token=59e3d828-69f2-465d-94ef-6fd53406034e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'psycho-ceo-yeat',
        title: "Psycho Ceo Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpsycho-ceo-yeat.mp3?alt=media&token=26b87bbb-6516-4b15-9b58-c46839b1fcf1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'psycho-dreams-kill-eva-encassator',
        title: "Psycho Dreams Kill Eva Encassator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpsycho-dreams-kill-eva-encassator.mp3?alt=media&token=a4f2a0a8-217a-48b1-a466-05d3fe3ae348",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'psychocain-yeat',
        title: "Psychocainë Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpsychocain%C3%AB-yeat.mp3?alt=media&token=9a74e973-5e50-4d6d-a9a8-74a6a7234750",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ptsd-pop-smoke',
        title: "Ptsd Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fptsd-pop-smoke.mp3?alt=media&token=6bb17c39-5c7e-47e3-a19e-ca99d5aa32a4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pubg-phonk-nomi-xd-blast3r',
        title: "Pubg Phonk Nomi Xd Blast3r",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpubg-phonk-nomi-xd-blast3r.mp3?alt=media&token=50cc3625-e544-411a-a90c-41c03c75e76e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pull-up-404vincent',
        title: "Pull Up 404vincent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpull-up-404vincent.mp3?alt=media&token=83422d06-0eec-4b0a-bdfe-7ff6ef6b406c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pump-sumn-static-amour-fortye',
        title: "Pump Sumn",
        artist: "Static Amour Fortye",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpump-sumn-feat-static-amour-fortye.mp3?alt=media&token=15baf698-5e9c-4118-940c-391a4273963a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'purple-brand-1hg-jay',
        title: "Purple Brand 1hg Jay",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpurple-brand-1hg-jay.mp3?alt=media&token=9e1347b1-b084-4e51-ac38-9473848479f4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'purple-lace-bra-tate-mcrae',
        title: "Purple Lace Bra Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpurple-lace-bra-tate-mcrae.mp3?alt=media&token=b62a4715-2b27-4e76-a1a1-decb3561a61b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'push-the-body-mixed-doctor-jeep',
        title: "Push The Body Mixed Doctor Jeep",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpush-the-body-mixed-doctor-jeep.mp3?alt=media&token=e61fb083-3663-4491-a2f5-a0b58d396233",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pussypodium-slowed-akiaura-lonown',
        title: "Pussypodium Slowed Akiaura Lonown",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpussypodium-slowed-akiaura-lonown.mp3?alt=media&token=2e380796-db70-4789-8562-a3d2eaf955fd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'pussypodium-slowed-velours',
        title: "Pussypodium Slowed Velours",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fpussypodium-slowed-velours.mp3?alt=media&token=19750a9a-ffff-4ffa-abe6-a7508b531afd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'quebra-tudo-scythermane-successxr-xenomxrph-kgj',
        title: "Quebra Tudo Scythermane Successxr Xenomxrph Kgj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fquebra-tudo-scythermane-successxr-xenomxrph-kgj.mp3?alt=media&token=ea33a250-62a8-44f6-ba64-a38b9c1919a3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'r0t-twxn-ll-clawz-507kaz-img',
        title: "R0t Twxn Ll Clawz 507kaz Img",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fr0t-twxn-ll-clawz-507kaz-img.mp3?alt=media&token=44f06889-7ab6-460f-a2ba-1ba32c3e5ef6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'raindance-dave-tems',
        title: "Raindance Dave Tems",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fraindance-dave-tems.mp3?alt=media&token=8f7821d9-7638-4623-9ada-c17a76d59139",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'raise-me-mariove',
        title: "Raise Me Mariove",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fraise-me-mariove.mp3?alt=media&token=bf7ece24-f177-40a8-a3f9-d06bb1b792ce",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'raise-me-sped-up-mariove',
        title: "Raise Me Sped Up Mariove",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fraise-me-sped-up-mariove.mp3?alt=media&token=8087a5f1-24e0-4d4f-be3c-841d48849047",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ran-to-atlanta-drake-future-molly-santana',
        title: "Ran To Atlanta Drake Future Molly Santana",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fran-to-atlanta-drake-future-molly-santana.mp3?alt=media&token=e3294441-f191-4b11-860c-a05692921eb3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ransom-lil-tecca',
        title: "Ransom Lil Tecca",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fransom-lil-tecca.mp3?alt=media&token=eb27ec90-7a58-4efa-bf1b-9d837c6d37ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'reality-show-miss-madeline-chase-icon',
        title: "Reality Show Miss Madeline Chase Icon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Freality-show-miss-madeline-chase-icon.mp3?alt=media&token=23e2acc2-6b6a-48a1-9078-8eb971d03581",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'realize-trxy',
        title: "Realize Trxy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frealize-trxy.mp3?alt=media&token=c280d06d-4322-4978-90fa-5b0fbf134dbc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'reawaker-felix-of-stray-kids-lisa-ft-felix-of-stray-kids',
        title: "Reawaker",
        artist: "Felix Of Stray Kids Lisa Ft. Felix Of Stray Kids",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Freawaker-feat-felix-of-stray-kids-lisa-feat-felix-of-stray-kids.mp3?alt=media&token=e382d7a1-1ae4-40c3-82e7-a6ecd6c84eda",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'red-cups-ufo361-paula-hartmann',
        title: "Red Cups Ufo361 Paula Hartmann",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fred-cups-ufo361-paula-hartmann.mp3?alt=media&token=18329b09-d0aa-4ca2-b205-98c6316c7ae4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'red-leather-future-metro-boomin-j-cole',
        title: "Red Leather Future Metro Boomin J Cole",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fred-leather-future-metro-boomin-j-cole.mp3?alt=media&token=2a344969-6969-49bd-9a86-bd9e1b307977",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'red-light-qkreign',
        title: "Red Light Qkreign",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fred-light-qkreign.mp3?alt=media&token=e07eae7a-120a-46c3-8317-909094987786",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'remote-control-pt-2-kanye-west',
        title: "Remote Control Pt 2 Kanye West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fremote-control-pt-2-kanye-west.mp3?alt=media&token=83da5129-bace-4864-a36b-631bf9987aef",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'reparations-kahdami',
        title: "Reparations Kahdami",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Freparations-kahdami.mp3?alt=media&token=b76e2de3-70c0-4c4b-bf26-bb479f1fafe9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'request-krage',
        title: "Request Krage",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frequest-krage.mp3?alt=media&token=18b9da53-f825-4dfa-8089-7405dc3de828",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'resistencia-mixed-manao-dagga',
        title: "Resistencia Mixed Manao Dagga",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fresistencia-mixed-manao-dagga.mp3?alt=media&token=7dd6afb7-cc1e-49ef-9951-b2425c8ebb9f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'resonance-g-a-b-s-o-n-n-mikeeysmind',
        title: "Resonance G A B S O N N Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fresonance-g-a-b-s-o-n-n-mikeeysmind.mp3?alt=media&token=c81077ca-9d1f-4c98-8975-17a982a429e2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'resonance-x-genesis-x-not-allowed-mikeeysmind',
        title: "Resonance X Genesis X Not Allowed Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fresonance-x-genesis-x-not-allowed-mikeeysmind.mp3?alt=media&token=59a22793-3dc0-45b2-ab90-7033af987a85",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'resonance-x-genesis-x-not-allowed-slowed-mikeeysmind',
        title: "Resonance X Genesis X Not Allowed Slowed Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fresonance-x-genesis-x-not-allowed-slowed-mikeeysmind.mp3?alt=media&token=f588c9f8-c44e-461b-902e-4eec7e6805ea",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'resonance-x-you-look-lonely-dxryl-noir',
        title: "Resonance X You Look Lonely Dxryl Noir",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fresonance-x-you-look-lonely-dxryl-noir.mp3?alt=media&token=c3bc1d41-10c2-4b17-80c0-0c3d301e83a3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'revenge-xxxtentacion',
        title: "Revenge Xxxtentacion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frevenge-xxxtentacion.mp3?alt=media&token=118e739c-4371-414b-ae9e-205dd458d88c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'revolving-door-tate-mcrae',
        title: "Revolving Door Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frevolving-door-tate-mcrae.mp3?alt=media&token=b58482ad-c1a6-433a-8772-8e67bac67121",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rich-baby-daddy-sexyy-red-sza-drake',
        title: "Rich Baby Daddy",
        artist: "Sexyy Red Sza Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frich-baby-daddy-feat-sexyy-red-sza-drake.mp3?alt=media&token=fa3ab2f3-dc5b-401a-8ca4-6fb8f7584dab",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rich-boy-payton',
        title: "Rich Boy Payton",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frich-boy-payton.mp3?alt=media&token=65939372-a294-4f84-9288-435f4f2bf632",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rick-owens-ufo361-ken-carson',
        title: "Rick Owens Ufo361 Ken Carson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frick-owens-ufo361-ken-carson.mp3?alt=media&token=b428ec25-c00e-433f-a417-ad1c7afcfe12",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'right-4-you-future-metro-boomin',
        title: "Right 4 You Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fright-4-you-future-metro-boomin.mp3?alt=media&token=2457be45-18be-4495-9433-e4dde4ffa0d7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ring-ring-ring-tyler-the-creator',
        title: "Ring Ring Ring Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fring-ring-ring-tyler-the-creator.mp3?alt=media&token=5edf3016-b26c-43ba-b7d4-60e117d21450",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'riot-set-it-off-yeat',
        title: "Riot Set It Off Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Friot-set-it-off-yeat.mp3?alt=media&token=ba621d61-464d-452e-9147-6e1096fffda6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rip-lucki',
        title: "Rip Lucki",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frip-lucki.mp3?alt=media&token=532f0f31-7557-4908-a8ef-84c6a5ba5602",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rip-playboi-carti',
        title: "Rip Playboi Carti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frip-playboi-carti.mp3?alt=media&token=1033bb8d-f757-4198-bb28-b00fdbaed871",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rip-roach-ki-mask-the-slump-god-xxxtentacion',
        title: "Rip Roach",
        artist: "Ki Mask The Slump God Xxxtentacion",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frip-roach-feat-ki-mask-the-slump-god-xxxtentacion.mp3?alt=media&token=90deb093-c8fd-4386-abbd-e09f57064d30",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rip-screw-travis-scott',
        title: "Rip Screw Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frip-screw-travis-scott.mp3?alt=media&token=2884c701-b9c5-42d6-812c-7ab7e5d036c3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rises-the-moon-liana-flores',
        title: "Rises The Moon Liana Flores",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frises-the-moon-liana-flores.mp3?alt=media&token=457bb735-294f-4646-9787-ee09b59dc003",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rise',
        title: "Rise进行曲 邵发",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frise%E8%BF%9B%E8%A1%8C%E6%9B%B2-%E9%82%B5%E5%8F%91.mp3?alt=media&token=ade75b46-e811-4137-a577-79fb51ae9930",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ritmo-de-verao-slowed-gxmz-sekimane-repsaj',
        title: "Ritmo De Verao Slowed Gxmz Sekimane Repsaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fritmo-de-verao-slowed-gxmz-sekimane-repsaj.mp3?alt=media&token=3b144230-f624-4b6d-9a95-8745997ac837",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'road-trips-drake',
        title: "Road Trips Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Froad-trips-drake.mp3?alt=media&token=3d96b41e-57a6-4111-95b9-0a5ccafc0199",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'roadtrip-dream-pmbata',
        title: "Roadtrip Dream Pmbata",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Froadtrip-dream-pmbata.mp3?alt=media&token=ea1601cb-eecb-4a86-947b-8d4809192f55",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'robbery-juice-wrld',
        title: "Robbery Juice Wrld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frobbery-juice-wrld.mp3?alt=media&token=e927a03f-ffe1-4ae4-b280-6f380dee97b1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rock-that-body-techno-mike',
        title: "Rock That Body Techno Mike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frock-that-body-techno-mike.mp3?alt=media&token=701cd45d-89e4-40dd-8f94-b9c2a0bd0a3c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rockstar-21-savage-post-malone',
        title: "Rockstar",
        artist: "21 Savage Post Malone",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frockstar-feat-21-savage-post-malone.mp3?alt=media&token=cec7e16b-39db-4af6-a887-2577d566cab6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rodeo-remix-lah-pat-flo-milli',
        title: "Rodeo Remix Lah Pat Flo Milli",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frodeo-remix-lah-pat-flo-milli.mp3?alt=media&token=28e55ff1-5541-4e6c-8fd6-a37806176dba",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'roi-instrumental-mckyyy',
        title: "Roi Instrumental Mckyyy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Froi-instrumental-mckyyy.mp3?alt=media&token=425f5ef6-223f-4892-8045-996b882fb8e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'roi-slowed-reverb-skyemane',
        title: "Roi Slowed Reverb Skyemane",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Froi-slowed-reverb-skyemane.mp3?alt=media&token=41fe8036-7856-4bad-bfc5-3d0b9e509368",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'romantic-lover-eyedress',
        title: "Romantic Lover Eyedress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fromantic-lover-eyedress.mp3?alt=media&token=e4a7b132-ca21-4e5c-a540-a0beac9a3c8e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'run-lay-bankz-valorant-music-odetari',
        title: "Run",
        artist: "Lay Bankz Valorant Music Odetari",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frun-feat-lay-bankz-valorant-music-odetari.mp3?alt=media&token=00e7ffc4-cc3d-4525-8c54-6041c9470a99",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'run-for-the-hills-tate-mcrae',
        title: "Run For The Hills Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frun-for-the-hills-tate-mcrae.mp3?alt=media&token=f92af728-d8cd-4c3a-a631-7e9c2c743687",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'run-thy-mouth-yeat',
        title: "Run ThëY Mouth Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frun-th%C3%ABy-mouth-yeat.mp3?alt=media&token=e90ba351-cedb-4a2b-a98d-d75eb9bb40c1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'rusty-intro-drake',
        title: "Rusty Intro Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Frusty-intro-drake.mp3?alt=media&token=fa0ccef8-d3f6-4493-89c3-17b9dba634ec",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sad-xxxtentacion',
        title: "Sad Xxxtentacion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsad-xxxtentacion.mp3?alt=media&token=39d8f0d5-6d5b-4274-8656-25a95c50e957",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sailor-song-gigi-perez',
        title: "Sailor Song Gigi Perez",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsailor-song-gigi-perez.mp3?alt=media&token=18704de7-f0f7-4b1c-bf78-3ef7352943de",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'same-old-me-rich-amiri',
        title: "Same Old Me Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsame-old-me-rich-amiri.mp3?alt=media&token=8a2baa5f-7000-4a77-8d47-54949fe435fe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sanrio-girl-slxrppy',
        title: "Sanrio Girl Slxrppy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsanrio-girl-slxrppy.mp3?alt=media&token=f5e2bd7a-7835-4ff1-89e2-a5561466c191",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'say-gang-void-mikeeysmind-storm00831-ech0',
        title: "Say Gang Void Mikeeysmind Storm00831 Ech0",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsay-gang-void-mikeeysmind-storm00831-ech0.mp3?alt=media&token=efdbc16d-fde4-4c66-8836-02e804ebf199",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'say-goodbye-monty-datta-snw-ufo361-lucidbeatz',
        title: "Say Goodbye",
        artist: "Monty Datta SnøW Ufo361 Lucidbeatz",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsay-goodbye-feat-monty-datta-sn%C3%B8w-ufo361-lucidbeatz.mp3?alt=media&token=cf0f3032-6e77-4151-9125-c02c5e2a61a7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'saya-interworld',
        title: "Saya Interworld",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsaya-interworld.mp3?alt=media&token=cfaf00c6-37d0-4afd-8aa7-2bd3b9c8ba7c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'scars-novulent',
        title: "Scars Novulent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fscars-novulent.mp3?alt=media&token=c989370d-e19e-4bc1-92f6-a3e57bd32312",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sdp-interlude-travis-scott',
        title: "Sdp Interlude Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsdp-interlude-travis-scott.mp3?alt=media&token=bf5b657b-1a15-40da-b685-fa18725cac2e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sdp-interlude-x-my-eyes-slowed-roeinon-covers-roeinon',
        title: "Sdp Interlude X My Eyes Slowed Roeinon Covers Roeinon",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsdp-interlude-x-my-eyes-slowed-roeinon-covers-roeinon.mp3?alt=media&token=fe233775-7c38-4b90-aad9-5724c4f173ee",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sdta0011-interior-car-bmw-s3-drive-medium-speed-191969',
        title: "Sdta0011 Interior Car Bmw S3 Drive Medium Speed 191969",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsdta0011-interior-car-bmw-s3-drive-medium-speed-191969.mp3?alt=media&token=df80a253-e0ef-454a-bb30-505a57d76787",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'see-you-again-kali-uchis-tyler-the-creator',
        title: "See You Again",
        artist: "Kali Uchis Tyler The Creator",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsee-you-again-feat-kali-uchis-tyler-the-creator.mp3?alt=media&token=abe4978c-69ac-41aa-aee3-eba29cecdbdb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'self-destruct-novulent',
        title: "Self Destruct Novulent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fself-destruct-novulent.mp3?alt=media&token=1f0dd4a2-26ca-442d-bd21-654888635be6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'self-love-spider-man-across-the-spider-verse-metro-boomin-co',
        title: "Self Love Spider Man Across The Spider Verse Metro Boomin Coi Leray",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fself-love-spider-man-across-the-spider-verse-metro-boomin-coi-leray.mp3?alt=media&token=1d61ff84-65f1-47a3-8007-f1acdc5774b5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sempero-qmiir',
        title: "Sempero Qmiir",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsempero-qmiir.mp3?alt=media&token=1a234646-14ed-4c8a-b8ac-bb33125afa60",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'senta-eternxlkz',
        title: "Senta Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsenta-eternxlkz.mp3?alt=media&token=a8ae3865-ae3a-479b-8538-68e3a15f4c27",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'senta-over-slowed-eternxlkz',
        title: "Senta Over Slowed Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsenta-over-slowed-eternxlkz.mp3?alt=media&token=f9f9f081-79f1-4ad8-b87c-ea4e27fdc679",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'senta-slowed-eternxlkz',
        title: "Senta Slowed Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsenta-slowed-eternxlkz.mp3?alt=media&token=4deb1dc5-f400-41dd-852c-b825a87eba5d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'senta-sped-up-eternxlkz',
        title: "Senta Sped Up Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsenta-sped-up-eternxlkz.mp3?alt=media&token=cdcfb480-82e0-4283-98f1-080c3eb9fa3e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'senta-super-slowed-eternxlkz',
        title: "Senta Super Slowed Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsenta-super-slowed-eternxlkz.mp3?alt=media&token=e2abc20d-b2bd-462a-ad60-c09603e1f4c7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sente-mais-eternxlkz',
        title: "Sente Mais Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsente-mais-eternxlkz.mp3?alt=media&token=fd29fba7-78a4-4331-9115-02887e160dac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sextape-deftones',
        title: "Sextape Deftones",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsextape-deftones.mp3?alt=media&token=7f762802-1abf-4cc9-ab7b-71ade7dfa7a7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shabang-drake',
        title: "Shabang Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshabang-drake.mp3?alt=media&token=bd7d4e8e-32f6-41db-89db-6affefc36c8a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shade-yeat',
        title: "Shade Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshade-yeat.mp3?alt=media&token=c3ffbf24-c206-4206-882a-b1220359dc1c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shake-it-to-the-max-fly-remix-moliy-silent-addy-skillibeng-s',
        title: "Shake It To The Max Fly Remix Moliy Silent Addy Skillibeng Shenseea",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshake-it-to-the-max-fly-remix-moliy-silent-addy-skillibeng-shenseea.mp3?alt=media&token=4e871be6-5ab2-48d7-8047-6a2e33059122",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shakira-egovert-1nonly',
        title: "Shakira",
        artist: "Egovert 1nonly",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshakira-feat-egovert-1nonly.mp3?alt=media&token=7a83243a-d8b8-4192-b64f-97ca7ea13b9a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'she-bad-khantrast',
        title: "She Bad Khantrast",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshe-bad-khantrast.mp3?alt=media&token=c658b249-74e6-44f7-800f-576e6e90a128",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'she-did-it-again-zara-larsson-tyla',
        title: "She Did It Again",
        artist: "Zara Larsson Tyla",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshe-did-it-again-feat-zara-larsson-tyla.mp3?alt=media&token=cc093fa5-870d-4233-8ef8-ba410f4cc912",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'she-got-much-back-dj-billy-e',
        title: "She Got Much Back Dj Billy E",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshe-got-much-back-dj-billy-e.mp3?alt=media&token=ba94c354-4f3e-4b18-a4f5-00066bb55eab",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'she-knows-juicy-j-ne-yo',
        title: "She Knows",
        artist: "Juicy J Ne Yo",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshe-knows-feat-juicy-j-ne-yo.mp3?alt=media&token=ea674834-b085-4a60-b344-245fa9020d2c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'show-me-how-men-i-trust',
        title: "Show Me How Men I Trust",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshow-me-how-men-i-trust.mp3?alt=media&token=968a167d-9137-467e-af13-9a04b2d01302",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'show-me-love-tyla-wizthemc-bees-honey',
        title: "Show Me Love",
        artist: "Tyla Wizthemc Bees Honey",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshow-me-love-feat-tyla-wizthemc-bees-honey.mp3?alt=media&token=544b82f0-4eb0-4349-bb0c-7bcbe9266813",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'show-of-hands-future-metro-boomin-aap-rocky',
        title: "Show Of Hands Future Metro Boomin Aap Rocky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshow-of-hands-future-metro-boomin-aap-rocky.mp3?alt=media&token=634acc5b-4fa5-411a-a96c-544cd68e43fe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shut-up-my-moms-calling-hotel-ugly',
        title: "Shut Up My Moms Calling Hotel Ugly",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshut-up-my-moms-calling-hotel-ugly.mp3?alt=media&token=cbf79601-ca82-47af-a5d5-7e2b96edcd2f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'shutcho-the-joy-doja-cat',
        title: "Shutcho",
        artist: "The Joy Doja Cat",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fshutcho-feat-the-joy-doja-cat.mp3?alt=media&token=5698845f-e729-4e4d-aa47-f3e4a9baa842",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sick-tired-3-ilytommy',
        title: "Sick Tired 3 Ilytommy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsick-tired-3-ilytommy.mp3?alt=media&token=9aa61a66-050b-43f3-b8d8-0c2f050c367e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sicko-mode-travis-scott',
        title: "Sicko Mode Travis Scott",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsicko-mode-travis-scott.mp3?alt=media&token=3d03a903-0c2d-4ae9-8ec0-01e77dceeca4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sigma-boy-betsy-maria-iankovskaia',
        title: "Sigma Boy сигма бой Betsy Maria Iankovskaia",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsigma-boy-%D1%81%D0%B8%D0%B3%D0%BC%D0%B0-%D0%B1%D0%BE%D0%B9-betsy-maria-iankovskaia.mp3?alt=media&token=294a72cd-ab36-4a13-b6ae-9c617eb034fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'signs-tate-mcrae',
        title: "Signs Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsigns-tate-mcrae.mp3?alt=media&token=3295f143-f285-4f53-96c5-26b7d7f1daf7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'silk-lingerie-kali-uchis',
        title: "Silk Lingerie Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsilk-lingerie-kali-uchis.mp3?alt=media&token=f28e62ad-7dc4-4e2c-b587-f31d8d7b81bb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'silly-party-super-slowed-inxky',
        title: "Silly Party Super Slowed Inxky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsilly-party-super-slowed-inxky.mp3?alt=media&token=1beb2d85-c77d-4b38-98a9-3a2a7a1b7d5b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'simpsonwave-you-look-lonely-mikeeysmind-frankjavcee',
        title: "Simpsonwave You Look Lonely Mikeeysmind Frankjavcee",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsimpsonwave-you-look-lonely-mikeeysmind-frankjavcee.mp3?alt=media&token=42769f5e-c997-4635-9c0c-83e0c747c55f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sins-let-me-in-kanii',
        title: "Sins Let Me In Kanii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsins-let-me-in-kanii.mp3?alt=media&token=41b92172-b4a7-4d64-ab4d-11921ea4944b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sit-down-svlient',
        title: "Sit Down Svlient",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsit-down-svlient.mp3?alt=media&token=bd76d59f-ecaa-4319-8c46-d64c14e44655",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'skadad-lobani-howl',
        title: "Skadad Lobani Howl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fskadad-lobani-howl.mp3?alt=media&token=b7ec10fc-0c44-49d1-adb6-be2ae3304a7c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'skins-ultra-slowed-reverb-krezus-surreal-dvd',
        title: "Skins Ultra Slowed Reverb Krezus Surreal Dvd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fskins-ultra-slowed-reverb-krezus-surreal_dvd.mp3?alt=media&token=6117af63-01e7-4a0b-b425-46ccbfd437f5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sky-playboi-carti',
        title: "Sky Playboi Carti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsky-playboi-carti.mp3?alt=media&token=5224dc25-4496-4153-b127-97ed09efac4a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slap-the-city-drake-qendresa',
        title: "Slap The City Drake Qendresa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslap-the-city-drake-qendresa.mp3?alt=media&token=e5b358d5-66dc-4077-9fe4-738ca86957f3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slava-funk-filip-lackovic-mvsterious-hxmr-yngastrobeatz',
        title: "Slava Funk",
        artist: "Filip Lackovic Mvsterious Hxmr Yngastrobeatz",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslava-funk-feat-filip-lackovic-mvsterious-hxmr-yngastrobeatz.mp3?alt=media&token=1b34d33e-90a4-43c2-9644-d2d131fa08b7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slay-enough-eternxlkz',
        title: "Slay Enough Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslay-enough-eternxlkz.mp3?alt=media&token=9a513f64-7f4a-44eb-81e4-fe1693bf4026",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slay-eternxlkz',
        title: "Slay Eternxlkz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslay-eternxlkz.mp3?alt=media&token=cb7cae2b-f99e-45de-abbf-15f2da97f3f5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slime-you-out-sza-drake',
        title: "Slime You Out",
        artist: "Sza Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslime-you-out-feat-sza-drake.mp3?alt=media&token=caf1ac31-e26e-443d-bb77-ca6f138040ac",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slut-me-out-2-sped-up-nle-choppa',
        title: "Slut Me Out 2 Sped Up Nle Choppa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslut-me-out-2-sped-up-nle-choppa.mp3?alt=media&token=5ecb0a93-46e8-4bd7-ac57-b0d4c752150d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slut-me-out-sexyy-red-nle-choppa',
        title: "Slut Me Out",
        artist: "Sexyy Red Nle Choppa",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslut-me-out-feat-sexyy-red-nle-choppa.mp3?alt=media&token=f5f70e05-9b56-4952-a26f-4b2049ed0072",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slut-me-out-nle-choppa',
        title: "Slut Me Out Nle Choppa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslut-me-out-nle-choppa.mp3?alt=media&token=dfd853f9-10e3-480f-9c32-986250a834c5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'slut-ppcocaine',
        title: "Slut Ppcocaine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fslut-ppcocaine.mp3?alt=media&token=3b927641-07e3-4bc6-899f-d75acb3ba7b4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'smezir-2-slowed-ilyhiryu',
        title: "Smezir 2 Slowed Ilyhiryu",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsmezir_2-slowed-ilyhiryu.mp3?alt=media&token=18c67eb1-aebc-445f-887d-61eb6e28ca22",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'smoke-it-off-lumi-athena-jnhygs',
        title: "Smoke It Off Lumi Athena Jnhygs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsmoke-it-off-lumi-athena-jnhygs.mp3?alt=media&token=2fb2ee6e-889e-44f3-9466-3f014fe0270e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'snooze-sza',
        title: "Snooze Sza",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsnooze-sza.mp3?alt=media&token=15a42e1f-393d-4ce2-b7d3-1d1d39833346",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stay-the-kid-laroi-justin-bieber',
        title: "Stay The Kid Laroi Justin Bieber",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstay-the-kid-laroi-justin-bieber.mp3?alt=media&token=fb994e81-f474-4a9f-afe3-5fea8a43e899",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stay-with-me-1nonly',
        title: "Stay With Me 1nonly",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstay-with-me-1nonly.mp3?alt=media&token=cef0b0b9-df92-4423-83b1-8f95b4fd66ba",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'step-back-1nonly-sxmpra',
        title: "Step Back 1nonly Sxmpra",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstep-back-1nonly-sxmpra.mp3?alt=media&token=ec9b10bc-d543-4809-819c-b98823005837",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stereo-love-edward-maya-vika-jigulina',
        title: "Stereo Love Edward Maya Vika Jigulina",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstereo-love-edward-maya-vika-jigulina.mp3?alt=media&token=0250ddaa-b4bb-4b9e-a811-7a9d09acab6d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stereo-love-ultra-slowed-luke-muzzic',
        title: "Stereo Love Ultra Slowed Luke Muzzic",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstereo-love-ultra-slowed-luke-muzzic.mp3?alt=media&token=ff3296d3-7f8a-4f17-b7c6-fc2ddc181246",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stick-talk-future',
        title: "Stick Talk Future",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstick-talk-future.mp3?alt=media&token=c7d7cc4e-dff0-49fe-a421-1bf3ce6beae8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sticky-drake',
        title: "Sticky Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsticky-drake.mp3?alt=media&token=75236279-acdd-4a1f-922d-f52c10244906",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stir-fry-migos',
        title: "Stir Fry Migos",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstir-fry-migos.mp3?alt=media&token=615963ff-44ed-43aa-b0c5-ea832c9964a2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stop-playing-with-me-tyler-the-creator',
        title: "Stop Playing With Me Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstop-playing-with-me-tyler-the-creator.mp3?alt=media&token=cc8613c8-2e0a-4ecb-9514-b7f9d44a7795",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stormi-daniels-rich-amiri',
        title: "Stormi Daniels Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstormi-daniels-rich-amiri.mp3?alt=media&token=a0204bf9-1c9d-4ca1-b96b-137516e8a713",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'strangers-kenya-grace',
        title: "Strangers Kenya Grace",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstrangers-kenya-grace.mp3?alt=media&token=76e7abd0-eeb5-49ef-bedc-fb7e0d1feabc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'strawberry-cheesecake-miryoumadeit',
        title: "Strawberry Cheesecake Miryoumadeit",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstrawberry-cheesecake-miryoumadeit.mp3?alt=media&token=4dd70dca-5568-40b7-b7be-df8dff500d5e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stray-lunarr',
        title: "Stray Lunarr",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstray-lunarr.mp3?alt=media&token=6d63759c-3df6-4140-af95-6e7ad9db157e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'straywav-slowed-undown',
        title: "Straywav Slowed Undown",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstraywav-slowed-undown.mp3?alt=media&token=3e664808-d26d-4830-adab-b4c16c3a7d10",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'streets-made-me-a-king-future-metro-boomin',
        title: "Streets Made Me A King Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstreets-made-me-a-king-future-metro-boomin.mp3?alt=media&token=5aabdfaf-fb36-4971-806a-3617e34bd257",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stronger-kanye-west',
        title: "Stronger Kanye West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstronger-kanye-west.mp3?alt=media&token=cc2da3ad-888d-427b-acb4-c7ef17960aa5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'struct-tiktok-version-udiennx',
        title: "Struct Tiktok Version Udiennx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstruct-tiktok-version-udiennx.mp3?alt=media&token=5b58e370-dae2-4594-b1c5-ea1c2871c7e4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'stuck-drake',
        title: "Stuck Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fstuck-drake.mp3?alt=media&token=b4e2d2a6-c4a3-4433-8701-54ba53ad5064",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sucka-free-tyler-the-creator',
        title: "Sucka Free Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsucka-free-tyler-the-creator.mp3?alt=media&token=2a208ce4-9b9c-4fcd-9685-850f19a19031",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'suffocation-sped-up-noturgf',
        title: "Suffocation Sped Up Noturgf",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsuffocation-sped-up-noturgf.mp3?alt=media&token=13316744-6d37-4a90-943c-761b98f5fbbd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sugar-honey-love-kali-uchis',
        title: "Sugar Honey Love Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsugar-honey-love-kali-uchis.mp3?alt=media&token=51748579-0b6e-4284-a9b8-e262271c97aa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sugar-on-my-tongue-tyler-the-creator',
        title: "Sugar On My Tongue Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsugar-on-my-tongue-tyler-the-creator.mp3?alt=media&token=fb7d4022-8b11-4093-a744-2aa1c98354e5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'suki-eric-reprid',
        title: "Suki Eric Reprid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsuki-eric-reprid.mp3?alt=media&token=68aeb23e-8d4e-4f78-a552-0be555cc405d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'summer-bummer-lights-on-rhyrhy',
        title: "Summer Bummer Lights On Rhyrhy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsummer-bummer-lights-on-rhyrhy.mp3?alt=media&token=d149f29c-81d2-4211-9e3e-7e8a9c6df647",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'summer-nights-myla-kobzx2z',
        title: "Summer Nights Myla Kobzx2z",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsummer-nights-myla-kobzx2z.mp3?alt=media&token=41236ae2-6149-46e2-bd6c-06a7993d6384",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sun-down-im-up-lil-yawh-cryjng',
        title: "Sun Down Im Up Lil Yawh Cryjng",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsun-down-im-up-lil-yawh-cryjng.mp3?alt=media&token=cdb01116-5994-4c10-9ed6-83b2a87512d8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sunroof-nicky-youre-dazy',
        title: "Sunroof Nicky Youre Dazy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsunroof-nicky-youre-dazy.mp3?alt=media&token=e85791e5-0301-43a6-97ee-02d09b33d2ff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sunshine-rain-kali-uchis',
        title: "Sunshine Rain Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsunshine-rain-kali-uchis.mp3?alt=media&token=2bb0f693-dd6b-47d1-bc80-9dd11aa7d423",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'super-freaky-girl-nicki-minaj',
        title: "Super Freaky Girl Nicki Minaj",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsuper-freaky-girl-nicki-minaj.mp3?alt=media&token=1dc6b6c0-d0a0-4683-8355-db8028c4ccc5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'supdo',
        title: "SupїDo фрози",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsup%D1%97do-%D1%84%D1%80%D0%BE%D0%B7%D0%B8.mp3?alt=media&token=67de383b-1fde-4f2c-bad0-90ea066ccf6f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'sweater-weather-the-neighbourhood',
        title: "Sweater Weather The Neighbourhood",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fsweater-weather-the-neighbourhood.mp3?alt=media&token=8a849d46-20d1-4847-ab02-57d5ecce05f5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'so-paulo-the-weeknd-anitta',
        title: "SãO Paulo The Weeknd Anitta",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fs%C3%A3o-paulo-the-weeknd-anitta.mp3?alt=media&token=39d1497b-8b1d-4665-acc4-45ff82666d3a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'takeover-mikeeysmind-prodbysky-sanikwave',
        title: "Takeover Mikeeysmind Prodbysky Sanikwave",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftakeover-mikeeysmind-prodbysky-sanikwave.mp3?alt=media&token=938ce27c-214b-4201-82e7-154f8b38e80f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'takeover-slowed-mikeeysmind-prodbysky-sanikwave',
        title: "Takeover Slowed Mikeeysmind Prodbysky Sanikwave",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftakeover-slowed-mikeeysmind-prodbysky-sanikwave.mp3?alt=media&token=7b3b8122-263e-4bb2-9dd8-4eb71ad2b0ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'talk-a-lot-404vincent',
        title: "Talk A Lot 404vincent",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftalk-a-lot-404vincent.mp3?alt=media&token=8ab832f6-58bc-4857-8fe0-5d166b48e9d5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'talk-yeat',
        title: "Talk Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftalk-yeat.mp3?alt=media&token=768622d9-4337-4bd2-ae76-5ad163abdbe8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tap-in-saweetie',
        title: "Tap In Saweetie",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftap-in-saweetie.mp3?alt=media&token=e2aaf8fa-62aa-4edc-95aa-7b1fd97b2de6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'taste-offset-tyga',
        title: "Taste",
        artist: "Offset Tyga",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftaste-feat-offset-tyga.mp3?alt=media&token=d22c428f-97e0-401e-b93f-1d32c8cb9ca5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tate-mcrae-its-ok-im-ok-official-video',
        title: "Tate Mcrae Its Ok Im Ok Official Video",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftate-mcrae-its-ok-im-ok-official-video.mp3?alt=media&token=b8537277-4bad-4f72-8e64-8f37135c08ee",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'teach-you-how-to-luh-me-yg-ty-dolla-ign',
        title: "Teach You How To Luh Me Yg Ty Dolla Ign",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fteach-you-how-to-luh-me-yg-ty-dolla-ign.mp3?alt=media&token=50a1f84a-f9c1-47ae-b9a3-8cd9bd5ca026",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'team-ceo-yeat',
        title: "Team Ceo Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fteam-ceo-yeat.mp3?alt=media&token=3bfd5cbb-5566-4fbc-839f-b526a4c74643",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'team-rocket-3-lonelyrari',
        title: "Team Rocket 3 Lonelyrari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fteam-rocket-3-lonelyrari.mp3?alt=media&token=79f233d4-350b-4e07-bfd6-2b413ed23405",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tek-it-cafun',
        title: "Tek It Cafuné",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftek-it-cafun%C3%A9.mp3?alt=media&token=3586a144-b32a-4e49-b1fe-378ce6ff4140",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tek-it-sped-up-cafun',
        title: "Tek It Sped Up Cafuné",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftek-it-sped-up-cafun%C3%A9.mp3?alt=media&token=ad386d14-075e-4605-ad1e-007a911a31c6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'telekinesis-sza-future-travis-scott',
        title: "Telekinesis",
        artist: "Sza Future Travis Scott",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftelekinesis-feat-sza-future-travis-scott.mp3?alt=media&token=c671603d-3b0e-41b9-a097-caf38ad39da6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'telepata-kali-uchis',
        title: "TelepatíA Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftelepat%C3%ADa-kali-uchis.mp3?alt=media&token=a51a8c4b-8c88-4106-ad64-565896534df5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'telephones-vacations',
        title: "Telephones Vacations",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftelephones-vacations.mp3?alt=media&token=77556e0f-9f7a-478b-839f-af6e27aeb26f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'telescope-slowed-twxn-ll-clawz-507kaz',
        title: "Telescope Slowed Twxn Ll Clawz 507kaz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftelescope-slowed-twxn-ll-clawz-507kaz.mp3?alt=media&token=c53e011b-9417-4e75-9b08-08d15f9d427d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-me-what-it-is-tyler-the-creator',
        title: "Tell Me What It Is Tyler The Creator",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-me-what-it-is-tyler-the-creator.mp3?alt=media&token=62c07668-828f-4d8c-967a-21bdef7de4d5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-me-why-ufo361',
        title: "Tell Me Why Ufo361",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-me-why-ufo361.mp3?alt=media&token=94740c8f-7150-450a-a413-336bff93b7a9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-me-you-love-me-slowed-reverb-mysterious-k3nt4',
        title: "Tell Me You Love Me Slowed Reverb",
        artist: "Mysterious K3nt4",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-me-you-love-me-slowed-reverb-feat-mysterious-k3nt4.mp3?alt=media&token=359c13d5-e936-4daa-af3d-206925c36a4e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-me-ze66y',
        title: "Tell Me Ze66y",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-me-ze66y.mp3?alt=media&token=0b860c3d-5e3d-4f1f-a12e-a28d9cfac178",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-m-yeat',
        title: "Tell Më Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-m%C3%AB-yeat.mp3?alt=media&token=f273a362-686a-45d4-abfa-1402125f719e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-the-vision-kanye-west-pusha-t-pop-smoke',
        title: "Tell The Vision",
        artist: "Kanye West Pusha T Pop Smoke",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-the-vision-feat-kanye-west-pusha-t-pop-smoke.mp3?alt=media&token=3c628068-8fe8-49b3-b4a3-087878f1d7c8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tell-ur-girlfriend-lay-bankz',
        title: "Tell Ur Girlfriend Lay Bankz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftell-ur-girlfriend-lay-bankz.mp3?alt=media&token=ee240a0a-791c-4d73-b1fa-2dad016dff42",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'territorial-kali-uchis',
        title: "Territorial Kali Uchis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fterritorial-kali-uchis.mp3?alt=media&token=13c31280-d69a-4ebe-91ee-e157fd50edf9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'test-recognise-flume-re-work-seekae',
        title: "Test Recognise Flume Re Work Seekae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftest-recognise-flume-re-work-seekae.mp3?alt=media&token=fd7457d9-d3ff-4605-92b6-12a5c1e92f61",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'that-go-t-shyne-young-stoner-life-young-thug-meek-mill',
        title: "That Go",
        artist: "T Shyne Young Stoner Life Young Thug Meek Mill",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthat-go-feat-t-shyne-young-stoner-life-young-thug-meek-mill.mp3?alt=media&token=7e340723-0e84-4553-a659-03f72eba5187",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'thats-it-rich-amiri',
        title: "Thats It Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthats-it-rich-amiri.mp3?alt=media&token=b7402444-902f-4274-acbf-437c3fe77490",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-beach-instrumental-slowed-reverb-mxpheebz',
        title: "The Beach Instrumental Slowed Reverb Mxpheebz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-beach-instrumental-slowed-reverb-mxpheebz.mp3?alt=media&token=24e0d9ec-7269-4025-ace0-c4fecda72af2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-bell-yeat',
        title: "The Bell Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-bell-yeat.mp3?alt=media&token=6912e7fa-68a3-4881-b003-4960b2443b4c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-best-life-za-dakota',
        title: "The Best Life Za Dakota",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-best-life-za-dakota.mp3?alt=media&token=4eb4b101-575f-417f-b73a-b034e5313987",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-color-violet-tory-lanez',
        title: "The Color Violet Tory Lanez",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-color-violet-tory-lanez.mp3?alt=media&token=6a6c929b-3b02-4f08-92ce-a575b3da0d1d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-end-llow',
        title: "The End Llow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-end-llow.mp3?alt=media&token=57e080af-ca55-4e0e-ace4-df3d3f393339",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-jungle-book-hd-revo',
        title: "The Jungle Book Hd Revo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-jungle-book-hd-revo.mp3?alt=media&token=46481707-2fe9-4f67-a490-f9002b04a61a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-lost-soul-down-slowed-reverb-nbsplv',
        title: "The Lost Soul Down Slowed Reverb Nbsplv",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-lost-soul-down-slowed-reverb-nbsplv.mp3?alt=media&token=d51348e3-7afd-42cf-b741-59359be04e11",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-lost-soul-down-slowed-version-monkid-lowx-leah-julia',
        title: "The Lost Soul Down Slowed Version Monkid Lowx Leah Julia",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-lost-soul-down-slowed-version-monkid-lowx-leah-julia.mp3?alt=media&token=dc7cc62d-7209-4f77-ada6-50217af100d9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-lost-soul-down-x-lost-soul-nbsplv',
        title: "The Lost Soul Down X Lost Soul Nbsplv",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-lost-soul-down-x-lost-soul-nbsplv.mp3?alt=media&token=17c610c3-53c8-4ec7-8e2d-27ebb431398a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-paradox-shatters-rachel-sandy',
        title: "The Paradox Shatters Rachel Sandy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-paradox-shatters-rachel-sandy.mp3?alt=media&token=0300d8e3-9e07-46e1-aae5-485b9a8c22ab",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-party-the-after-party-the-weeknd',
        title: "The Party The After Party The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-party-the-after-party-the-weeknd.mp3?alt=media&token=b564efcd-3e6b-40e2-9a3d-b5107b7cd27a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-perfect-girl-mareux',
        title: "The Perfect Girl Mareux",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-perfect-girl-mareux.mp3?alt=media&token=a505f67c-4ea6-46bb-b51f-deabda226af6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-real-slim-shady-eminem',
        title: "The Real Slim Shady Eminem",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-real-slim-shady-eminem.mp3?alt=media&token=c06c4178-77e0-41e9-ad86-0450254cdc15",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-rebel-path-pt-adamczyk',
        title: "The Rebel Path Pt Adamczyk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-rebel-path-pt-adamczyk.mp3?alt=media&token=241e55b1-8139-4c1b-9f54-cfead7894e1f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-shoe-fits-drake',
        title: "The Shoe Fits Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-shoe-fits-drake.mp3?alt=media&token=02ba780d-a1e7-4b74-b24f-b1d0a206cd8f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-things-we-lost-in-the-fire-lobani-howl',
        title: "The Things We Lost In The Fire Lobani Howl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-things-we-lost-in-the-fire-lobani-howl.mp3?alt=media&token=3ebe105f-ba1c-4d5f-89b9-829bf2c93c48",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-way-life-goes-oh-wonder-lil-uzi-vert',
        title: "The Way Life Goes",
        artist: "Oh Wonder Lil Uzi Vert",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-way-life-goes-feat-oh-wonder-lil-uzi-vert.mp3?alt=media&token=52e353f6-2b07-421a-8591-63f21f4d6ddc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'the-woo-50-cent-roddy-ricch-pop-smoke',
        title: "The Woo",
        artist: "50 Cent Roddy Ricch Pop Smoke",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthe-woo-feat-50-cent-roddy-ricch-pop-smoke.mp3?alt=media&token=a38899e3-da9a-4af0-8f26-4622b6bc3440",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'thick-of-it-trippie-redd-ksi',
        title: "Thick Of It",
        artist: "Trippie Redd Ksi",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthick-of-it-feat-trippie-redd-ksi.mp3?alt=media&token=c5b6c04b-8eb1-4908-b4dc-e7d78f06e036",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'this-is-for-my-girl-xanseii',
        title: "This Is For My Girl Xanseii",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthis-is-for-my-girl-xanseii.mp3?alt=media&token=0befc2e2-341e-4aec-865d-054065b785f0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'this-sunday-future-metro-boomin',
        title: "This Sunday Future Metro Boomin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthis-sunday-future-metro-boomin.mp3?alt=media&token=4909fcc4-243a-458d-8ab8-7a21db93ebb6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'thootie-ice-spice-tokischa',
        title: "Thootie Ice Spice Tokischa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthootie-ice-spice-tokischa.mp3?alt=media&token=11583c39-7fc4-43f2-b6f7-fae5a9fd7008",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'those-eyes-new-west',
        title: "Those Eyes New West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthose-eyes-new-west.mp3?alt=media&token=f75ebc1b-cdf6-4e5b-8a04-da985ca30656",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'those-eyes-sped-up-new-west',
        title: "Those Eyes Sped Up New West",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthose-eyes-sped-up-new-west.mp3?alt=media&token=bf55127b-9a10-4406-8c20-74c674829f5f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'thrift-shop-wanz-macklemore-ryan-lewis',
        title: "Thrift Shop",
        artist: "Wanz Macklemore Ryan Lewis",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthrift-shop-feat-wanz-macklemore-ryan-lewis.mp3?alt=media&token=693868a7-727a-4c14-8766-047822548ba3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'throw-itwant-her-slvmbrs-dj-soulchild-ac',
        title: "Throw Itwant Her Slvmbrs Dj Soulchild Ac",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthrow-itwant-her-slvmbrs-dj-soulchild-ac.mp3?alt=media&token=b156c47b-76e2-4f28-bae1-d8090ddc3c4b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'thunder-imagine-dragons',
        title: "Thunder Imagine Dragons",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthunder-imagine-dragons.mp3?alt=media&token=20086442-7ea2-4fc3-a7a4-6f2950e971bb",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'thunder-qmiir-rvnge-nulled',
        title: "Thunder Qmiir Rvnge Nulled",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fthunder-qmiir-rvnge-nulled.mp3?alt=media&token=03485974-083a-43ba-8c9a-513121f228dd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tik-tok-kesha',
        title: "Tik Tok Kesha",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftik-tok-kesha.mp3?alt=media&token=0dc47795-efd6-423a-8033-731c7d51fe21",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'timeless-playboi-carti-remix-the-weeknd-doechii',
        title: "Timeless",
        artist: "Playboi Carti Remix The Weeknd Doechii",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftimeless-feat-playboi-carti-remix-the-weeknd-doechii.mp3?alt=media&token=9e26b67f-7dc2-49fc-aaac-e805a6b27bf0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'timeless-slowed-reverb-skyemane-sapphink',
        title: "Timeless Slowed Reverb Skyemane Sapphink",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftimeless-slowed-reverb-skyemane-sapphink.mp3?alt=media&token=8d71a5e7-6fc5-4bd1-a21c-1f6709d89418",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'timeless-the-weeknd-playboi-carti',
        title: "Timeless The Weeknd Playboi Carti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftimeless-the-weeknd-playboi-carti.mp3?alt=media&token=e2dee4d3-6825-4466-8d98-6e9ac864788a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tip-toe-hybs',
        title: "Tip Toe Hybs",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftip-toe-hybs.mp3?alt=media&token=819156e7-1090-4d48-9c59-7af7087967e6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tipsy-bonus-track-miss-luxury',
        title: "Tipsy Bonus Track Miss Luxury",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftipsy-bonus-track-miss-luxury.mp3?alt=media&token=ed69d342-5baf-4ebf-8ebd-c1f80ba2de3e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tit-for-tat-tate-mcrae',
        title: "Tit For Tat Tate Mcrae",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftit-for-tat-tate-mcrae.mp3?alt=media&token=0a9ff831-9a5c-4caf-a0f8-9f137f292f7e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'to-the-stars-kobzx2z-mikeeysmind',
        title: "To The Stars Kobzx2z Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fto-the-stars-kobzx2z-mikeeysmind.mp3?alt=media&token=56a7067a-eb52-4fd7-97fd-9b9062d9341d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tongue-maribou-state-holly-walker',
        title: "Tongue Maribou State Holly Walker",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftongue-maribou-state-holly-walker.mp3?alt=media&token=d09f8f9f-03ea-4af4-8491-d04e009579c6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tonka-worldv',
        title: "Tonka Worldv",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftonka-worldv.mp3?alt=media&token=f481226e-f7ea-4e2d-af6d-c1e28b16ed4a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'too-good-rihanna-drake',
        title: "Too Good",
        artist: "Rihanna Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftoo-good-feat-rihanna-drake.mp3?alt=media&token=ba358381-e77d-4846-81db-2978e76ee30b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'too-late-shankz',
        title: "Too Late Shankz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftoo-late-shankz.mp3?alt=media&token=d9e16cb5-8d01-45bb-ba98-92d364c00525",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'too-many-nights-don-toliver-metro-boomin-future',
        title: "Too Many Nights",
        artist: "Don Toliver Metro Boomin Future",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftoo-many-nights-feat-don-toliver-metro-boomin-future.mp3?alt=media&token=d8d56d10-7362-4437-99c0-f8feeab792fc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'took-her-to-the-o-king-von',
        title: "Took Her To The O King Von",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftook-her-to-the-o-king-von.mp3?alt=media&token=4587f453-4481-4275-b125-3d420e8a23d5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'toosie-slide-drake',
        title: "Toosie Slide Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftoosie-slide-drake.mp3?alt=media&token=66e434f7-570b-4584-ad55-e6780800b2ae",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tore-up-don-toliver',
        title: "Tore Up Don Toliver",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftore-up-don-toliver.mp3?alt=media&token=a2b2c6fa-a3d9-4ec7-9627-42e8f65996e6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'touch-rich-amiri',
        title: "Touché Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftouch%C3%A9-rich-amiri.mp3?alt=media&token=cdca3557-893c-4d53-9bc7-b6211f119abd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'towers-mariove',
        title: "Towers Mariove",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftowers-mariove.mp3?alt=media&token=6741855e-f249-470f-9cc0-c7e31ca3f599",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'training-season-dua-lipa',
        title: "Training Season Dua Lipa",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftraining-season-dua-lipa.mp3?alt=media&token=4246804b-07db-4c9a-a6bb-003bb02a4e04",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trap-anthem-mc-virgins-yun-head',
        title: "Trap Anthem Mc Virgins Yun Head",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrap-anthem-mc-virgins-yun-head.mp3?alt=media&token=c27bddbc-9421-49e0-b66a-5b02b26d8aaf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trap-queen-fetty-wap',
        title: "Trap Queen Fetty Wap",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrap-queen-fetty-wap.mp3?alt=media&token=08b5804b-4085-4330-a659-5789ed46b752",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trauma-usedbefore-phonkdope',
        title: "Trauma Usedbefore Phonkdope",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrauma-usedbefore-phonkdope.mp3?alt=media&token=2de8bf74-451f-443c-a5ae-c10ea19ace4e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trepidation-ii-nightcore-zmajor',
        title: "Trepidation Ii Nightcore Zmajor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrepidation-ii-nightcore-zmajor.mp3?alt=media&token=856466c0-30ae-436a-8131-e2ef26ebf368",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trepidation-ii-slowed-zmajor',
        title: "Trepidation Ii Slowed Zmajor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrepidation-ii-slowed-zmajor.mp3?alt=media&token=80ccf4a5-4316-47f9-965c-8884389c4911",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trepidation-ii-super-slowed-zmajor',
        title: "Trepidation Ii Super Slowed Zmajor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrepidation-ii-super-slowed-zmajor.mp3?alt=media&token=10bb2d99-a0dd-49bc-93c3-37a82fbb0abc",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trepidation-ii-ultra-slowed-zmajor',
        title: "Trepidation Ii Ultra Slowed Zmajor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrepidation-ii-ultra-slowed-zmajor.mp3?alt=media&token=1ec0acef-637b-47d2-a195-bcb71934061a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trepidation-ii-zmajor',
        title: "Trepidation Ii Zmajor",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrepidation-ii-zmajor.mp3?alt=media&token=cc66e4af-1f51-4fa9-961f-744191ec26d4",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'trick-41-kyle-richh',
        title: "Trick 41 Kyle Richh",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftrick-41-kyle-richh.mp3?alt=media&token=47700669-5120-4b32-9aac-910624954954",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tsu-drake',
        title: "Tsu Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftsu-drake.mp3?alt=media&token=6ba09bd9-574d-4ba6-9f02-f7409abf396d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tumblr-girls-kobzx2z-mikeeysmind',
        title: "Tumblr Girls Kobzx2z Mikeeysmind",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftumblr-girls-kobzx2z-mikeeysmind.mp3?alt=media&token=5130fd67-904e-4c1b-82bc-0725eeb48807",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'turn-it-up-pinkpantheress',
        title: "Turn It Up Pinkpantheress",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fturn-it-up-pinkpantheress.mp3?alt=media&token=11a6bfaf-d0a4-430f-9b21-496c026d8728",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tv-off-lefty-gunplay-kendrick-lamar',
        title: "Tv Off",
        artist: "Lefty Gunplay Kendrick Lamar",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftv-off-feat-lefty-gunplay-kendrick-lamar.mp3?alt=media&token=249dc5aa-6e6e-4a7c-bedf-e074afa2938f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tweaker-gelo',
        title: "Tweaker Gelo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftweaker-gelo.mp3?alt=media&token=833c7d83-6643-4c65-8053-80d83aa92500",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'two-different-worlds-koruse-mzmff',
        title: "Two Different Worlds Koruse Mzmff",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftwo-different-worlds-koruse-mzmff.mp3?alt=media&token=72dda5fc-9678-472c-a6cb-149c6f43f90e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'type-shit-future-metro-boomin-travis-scott-playboi-carti',
        title: "Type Shit Future Metro Boomin Travis Scott Playboi Carti",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ftype-shit-future-metro-boomin-travis-scott-playboi-carti.mp3?alt=media&token=661b74a9-f247-452c-8d92-c4e43ee05f53",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tte-mich-ufo361-levin-liam',
        title: "TöTe Mich Ufo361 Levin Liam",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Ft%C3%B6te-mich-ufo361-levin-liam.mp3?alt=media&token=ed9863a0-52b8-4a22-8e5f-5a56a79ee871",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-are-my-high-dj-snake-future',
        title: "U Are My High Dj Snake Future",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fu-are-my-high-dj-snake-future.mp3?alt=media&token=6b8ef6a4-bb75-41bd-ad64-41fe9da78bef",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-like-rich-amiri',
        title: "U Like Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fu-like-rich-amiri.mp3?alt=media&token=562d83bc-374d-49db-bc1b-c9f77f6ca191",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-should-know-yeat',
        title: "U Should Know Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fu-should-know-yeat.mp3?alt=media&token=1b4b1c46-b962-48e3-bd28-204c217719fd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-want-that-rich-amiri',
        title: "U Want That Rich Amiri",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fu-want-that-rich-amiri.mp3?alt=media&token=c081b9c3-b559-4a08-a392-173d5290404a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'u-werent-here-i-really-miss-you-a-girl-is-a-gun-osmanis',
        title: "U Werent Here I Really Miss You A Girl Is A Gun Osmanis",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fu-werent-here-i-really-miss-you-a-girl-is-a-gun-osmanis.mp3?alt=media&token=c52aba57-17ba-40e7-94e8-99b3bea6410c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'under-your-spell-slowed-reverb-13aurora-sapphink',
        title: "Under Your Spell Slowed Reverb 13aurora Sapphink",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Funder-your-spell-slowed-reverb-13aurora-sapphink.mp3?alt=media&token=3529428b-5fd6-4917-bbb1-1efaf4ffd47e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'under-your-spell-snow-strippers',
        title: "Under Your Spell Snow Strippers",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Funder-your-spell-snow-strippers.mp3?alt=media&token=c5cdeea7-0e32-4ad8-9d43-79e545b0be22",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'under-your-spell-sped-up-13aurora-sapphink',
        title: "Under Your Spell Sped Up 13aurora Sapphink",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Funder-your-spell-sped-up-13aurora-sapphink.mp3?alt=media&token=702c9c01-7b43-4208-8a51-622207169939",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'unforgettable-swae-lee-french-montana',
        title: "Unforgettable",
        artist: "Swae Lee French Montana",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Funforgettable-feat-swae-lee-french-montana.mp3?alt=media&token=49c85e61-3fb1-479c-8400-1aa47f15e9c3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'unholy-sped-up-90degrees-pacey',
        title: "Unholy Sped Up 90degrees Pacey",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Funholy-sped-up-90degrees-pacey.mp3?alt=media&token=4349d9eb-9fed-48b3-befe-6a5f89000480",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'up-aria-math-yoilya-neastiel',
        title: "Up Aria Math Yoilya Neastiel",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fup-aria-math-yoilya-neastiel.mp3?alt=media&token=add0bffc-68a1-4caf-93b1-f5e4d794f79b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'up-down-do-this-all-day-bob-t-pain',
        title: "Up Down Do This All Day",
        artist: "Bob T Pain",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fup-down-do-this-all-day-feat-bob-t-pain.mp3?alt=media&token=3ea721a6-e5a8-4f4d-ae1c-bb458dae55fe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'up-x-aria-math-nocktickvel',
        title: "Up X Aria Math Nocktickvel",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fup-x-aria-math-nocktickvel.mp3?alt=media&token=90c50a44-edc5-4c0c-b3a6-6ba621f5b476",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'uptown-inaseh-sachihiro',
        title: "Uptown",
        artist: "Inaseh Sachihiro幸福",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fuptown-feat-inaseh-sachihiro%E5%B9%B8%E7%A6%8F.mp3?alt=media&token=bb165326-5538-4e10-aee3-979862c2d751",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'v-12-lil-dew',
        title: "V 12 Lil Dew",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fv-12-lil-dew.mp3?alt=media&token=d657f121-9681-4dc7-ab3c-5af632d54153",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'v-marcin-przybylowicz',
        title: "V Marcin Przybylowicz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fv-marcin-przybylowicz.mp3?alt=media&token=7a1160ee-6a8c-4c07-bf56-161c39d2ce82",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'valentino-rev',
        title: "Valentino Rev",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvalentino-rev.mp3?alt=media&token=65439b5b-e9c6-414c-b514-408581edc520",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'valoween-shleem-pink-mxlu',
        title: "Valoween",
        artist: "Shleem Pink Mxlu",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvaloween-feat-shleem-pink-mxlu.mp3?alt=media&token=0bc849b4-42e1-4c19-9dbe-cda22d003eaa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vampire-olivia-rodrigo',
        title: "Vampire Olivia Rodrigo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvampire-olivia-rodrigo.mp3?alt=media&token=94e38a9f-9f58-40f0-afd4-5d12f8aa17b1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'veki-veki-launch13-slowed-djzrx-motty-rodricci-mc-novin',
        title: "Veki Veki",
        artist: "Launch13 Slowed Djzrx Motty Rodricci Mc Novin",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fveki-veki-feat-launch13-slowed-djzrx-motty-rodricci-mc-novin.mp3?alt=media&token=79cbaf8b-b605-4633-8c13-a8dde3cd1555",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'velvetal-slowed-phonkha-trevlx',
        title: "Velvetal Slowed Phonkha TrevøLx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvelvetal-slowed-phonkha-trev%C3%B8lx.mp3?alt=media&token=1a93679a-1291-4870-a9be-f4ec3966b9de",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vem-balanar-dj-samir-fyex-habazane-elnyx',
        title: "Vem BalançAr Dj Samir Fyex Habazane Elnyx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvem-balan%C3%A7ar-dj-samir-fyex-habazane-elnyx.mp3?alt=media&token=dca0156e-a00e-4dc5-8c6e-ab26ec5212db",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vem-balanar-slowed-dj-samir-fyex-habazane-elnyx',
        title: "Vem BalançAr Slowed Dj Samir Fyex Habazane Elnyx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvem-balan%C3%A7ar-slowed-dj-samir-fyex-habazane-elnyx.mp3?alt=media&token=d1957729-2c4b-430d-ac78-c3c6afd650b7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vem-balanar-sped-up-dj-samir-fyex-habazane-elnyx',
        title: "Vem BalançAr Sped Up Dj Samir Fyex Habazane Elnyx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvem-balan%C3%A7ar-sped-up-dj-samir-fyex-habazane-elnyx.mp3?alt=media&token=2a34895e-e832-453a-afc0-47fa8e46c7d3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vem-balanar-super-slowed-dj-samir-fyex-habazane-elnyx',
        title: "Vem BalançAr Super Slowed Dj Samir Fyex Habazane Elnyx",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvem-balan%C3%A7ar-super-slowed-dj-samir-fyex-habazane-elnyx.mp3?alt=media&token=95442489-3b07-4705-807b-8097792bae98",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vem-lenta-sayfalse-eluvo-kphk',
        title: "Vem Lenta Sayfalse Eluvo Kphk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvem-lenta-sayfalse-eluvo-kphk.mp3?alt=media&token=30ed2582-d810-454a-83eb-47260ae65f8a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vision-slowed-hucci',
        title: "Vision Slowed Hucci",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvision-slowed-hucci.mp3?alt=media&token=c5053c4f-1dab-4c95-911d-e0f1007f3e1a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'voce-na-mira-album-ver-hwungii-0hex-dj-vgk1',
        title: "Voce Na Mira Album Ver Hwungii 0hex Dj Vgk1",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvoce-na-mira-album-ver-hwungii-0hex-dj-vgk1.mp3?alt=media&token=cce7edd4-fcba-4e1c-b0d4-0f070da1fcd2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'voce-na-mira-album-ver-slowed-hwungii-0hex-dj-vgk1',
        title: "Voce Na Mira Album Ver Slowed Hwungii 0hex Dj Vgk1",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvoce-na-mira-album-ver-slowed-hwungii-0hex-dj-vgk1.mp3?alt=media&token=de4badf9-b661-4021-b4a8-c7a55a216e37",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'voce-na-mira-slowed-hwungii-dj-vgk1',
        title: "Voce Na Mira Slowed Hwungii Dj Vgk1",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvoce-na-mira-slowed-hwungii-dj-vgk1.mp3?alt=media&token=f769f1d5-7ea8-4c79-b20a-14c31e6817ff",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'voc-na-mira-2-hwungii-dj-vgk1',
        title: "Você Na Mira 2 Hwungii Dj Vgk1",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvoc%C3%AA-na-mira-2-hwungii-dj-vgk1.mp3?alt=media&token=37431ac8-ab70-442c-af73-9b616be1f50e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'void-super-slowed-isq',
        title: "Void Super Slowed Isq",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvoid-super-slowed-isq.mp3?alt=media&token=4229c9c1-70be-4c10-80e8-da428f846d54",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'volkswagen-funk-super-slowed-nvrxmarv-lxstury-justforgetme',
        title: "Volkswagen Funk Super Slowed Nvrxmarv Lxstury Justforgetme",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvolkswagen-funk-super-slowed-nvrxmarv-lxstury-justforgetme.mp3?alt=media&token=d00a1c4d-a26a-4dd3-8d7a-ece004ff0977",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vou-dancar-repsaj-kunoex',
        title: "Vou Dancar Repsaj Kunoex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvou-dancar-repsaj-kunoex.mp3?alt=media&token=4fb286a4-90c2-404b-8d74-6bc4b92ffdd3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vou-dancar-slowed-repsaj-kunoex',
        title: "Vou Dancar Slowed Repsaj Kunoex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvou-dancar-slowed-repsaj-kunoex.mp3?alt=media&token=0f533f84-346b-480b-a576-b38ed07ba9f6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vou-dancar-super-slowed-repsaj-kunoex',
        title: "Vou Dancar Super Slowed Repsaj Kunoex",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvou-dancar-super-slowed-repsaj-kunoex.mp3?alt=media&token=08190c27-9864-4c52-8b29-bdb42a6695aa",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vvv-hes-back-mikeeysmind-sanikwave',
        title: "Vvv Hes Back Mikeeysmind Sanikwave",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvvv-hes-back-mikeeysmind-sanikwave.mp3?alt=media&token=e9bd7220-ed0a-4dee-af06-43212fe97d43",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'vvv-mikeeysmind-sanikwave',
        title: "Vvv Mikeeysmind Sanikwave",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fvvv-mikeeysmind-sanikwave.mp3?alt=media&token=556b2cc9-5f13-45d5-bc76-751c85d17309",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wait-a-minute-willow',
        title: "Wait A Minute Willow",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwait-a-minute-willow.mp3?alt=media&token=30e4083e-e37c-4f7a-bde2-a68c14ca63a1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'want-u-noevdv',
        title: "Want U Noevdv",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwant-u-noevdv.mp3?alt=media&token=4e09435f-a56c-4e26-b21c-fb73f1fe89d7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'warum-ist-es-so-schwer-ufo361',
        title: "Warum Ist Es So Schwer Ufo361",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwarum-ist-es-so-schwer-ufo361.mp3?alt=media&token=95ccb205-92b5-41de-a514-931274ea65a0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'waste-kxllswxtch',
        title: "Waste Kxllswxtch",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwaste-kxllswxtch.mp3?alt=media&token=c91bedaa-20d7-427e-9eb9-1565c0243487",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'waste-sped-up-version-kxllswxtch',
        title: "Waste Sped Up Version Kxllswxtch",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwaste-sped-up-version-kxllswxtch.mp3?alt=media&token=e200b216-00e3-4233-9981-fa3d524964fd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wasted-summers-juju3',
        title: "Wasted Summers Juju3",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwasted-summers-juju3.mp3?alt=media&token=7df59bc7-be27-4bb6-8763-036d15ca6079",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wat-u-want-2-mikeeysmind-prodbysky',
        title: "Wat U Want 2 Mikeeysmind Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwat-u-want-2-mikeeysmind-prodbysky.mp3?alt=media&token=c136cab9-243a-4070-a8f7-a6490785d680",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wat-u-want-2-slowed-reverb-mikeeysmind-prodbysky',
        title: "Wat U Want 2 Slowed Reverb Mikeeysmind Prodbysky",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwat-u-want-2-slowed-reverb-mikeeysmind-prodbysky.mp3?alt=media&token=bbcdc1f0-27b8-4631-aa13-4189faaaf1c1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'watch-this-plugg-dyan-dxddy',
        title: "Watch This Plugg Dyan Dxddy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwatch-this-plugg-dyan-dxddy.mp3?alt=media&token=180380de-4c43-48d1-a3f9-6704f0debfc1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'watch-yo-mouth-vibe-yung-baller',
        title: "Watch Yo Mouth",
        artist: "Vibe Yung Baller",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwatch-yo-mouth-feat-vibe-yung-baller.mp3?alt=media&token=0696911a-6f46-4c8c-84bd-17de3e69616b",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'watching-me-dimeworld-sheepy',
        title: "Watching Me Dimeworld Sheepy",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwatching-me-dimeworld-sheepy.mp3?alt=media&token=924e3f92-09d7-4d79-83e1-2f40c8f1a0c9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'way-2-sexy-future-young-thug-drake',
        title: "Way 2 Sexy",
        artist: "Future Young Thug Drake",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fway-2-sexy-feat-future-young-thug-drake.mp3?alt=media&token=0309cb49-da78-419a-9f88-dc10862aa2a9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'we-fell-in-love-in-october-girl-in-red',
        title: "We Fell In Love In October Girl In Red",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwe-fell-in-love-in-october-girl-in-red.mp3?alt=media&token=b8c246f7-bbb3-4011-882d-7bcff1113b24",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'we-fell-in-love-in-october-x-on-one-tonight-studiojenna',
        title: "We Fell In Love In October X On One Tonight Studiojenna",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwe-fell-in-love-in-october-x-on-one-tonight-studiojenna.mp3?alt=media&token=cd36e40f-8c41-45b2-a6ac-d214a32177ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'we-r-who-we-r-glitter-on-my-eyes-pk',
        title: "We R Who We R Glitter On My Eyes Pk",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwe-r-who-we-r-glitter-on-my-eyes-pk.mp3?alt=media&token=e004d4d3-5236-4e60-8527-37af81ec135d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'we-still-dont-trust-you-future-metro-boomin-the-weeknd',
        title: "We Still Dont Trust You Future Metro Boomin The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwe-still-dont-trust-you-future-metro-boomin-the-weeknd.mp3?alt=media&token=bebfa18c-8d56-41a0-8147-65ec0e01ac14",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'welcome-and-goodbye-dream-ivory',
        title: "Welcome And Goodbye Dream Ivory",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwelcome-and-goodbye-dream-ivory.mp3?alt=media&token=8a89e967-2fa9-49dd-807c-8b598c6fd4c8",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wet-dreams-odetari-nimstarr',
        title: "Wet Dreams Odetari Nimstarr",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwet-dreams-odetari-nimstarr.mp3?alt=media&token=fedf5dce-f575-445b-965a-7ac21a0a9fc9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'what-did-i-miss-drake',
        title: "What Did I Miss Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhat-did-i-miss-drake.mp3?alt=media&token=ff5b3fc4-a347-4bfd-a974-2061e3b6e3a5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'what-you-know-bout-love-pop-smoke',
        title: "What You Know Bout Love Pop Smoke",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhat-you-know-bout-love-pop-smoke.mp3?alt=media&token=59a2fb11-1393-4129-9e9a-1ad596d36b70",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'what-you-saying-lil-uzi-vert',
        title: "What You Saying Lil Uzi Vert",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhat-you-saying-lil-uzi-vert.mp3?alt=media&token=c9f0e2ed-2b50-46de-a3b2-83ce457f5631",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'what-you-want-1nonly',
        title: "What You Want 1nonly",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhat-you-want-1nonly.mp3?alt=media&token=eb6cf237-a982-4898-a775-15e4e642dc0c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'whats-bitting-you-mixed-vladimir-dubyshkin',
        title: "Whats Bitting You Mixed Vladimir Dubyshkin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhats-bitting-you-mixed-vladimir-dubyshkin.mp3?alt=media&token=312f2705-af8a-437e-9d7d-207f2a56e5dd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'where-have-you-been-hoodtrap-mylancore-kryd',
        title: "Where Have You Been Hoodtrap Mylancore Kryd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhere-have-you-been-hoodtrap-mylancore-kryd.mp3?alt=media&token=cb3c6d0a-0da3-4fcb-a51b-cc1c8fef1ff6",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'where-have-you-been-rihanna',
        title: "Where Have You Been Rihanna",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhere-have-you-been-rihanna.mp3?alt=media&token=f986742e-b775-4a75-8091-401f1173fc60",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'where-have-you-been-x-no-pole-vellycarl',
        title: "Where Have You Been X No Pole Vellycarl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhere-have-you-been-x-no-pole-vellycarl.mp3?alt=media&token=aab39a9d-2271-4b5a-978b-11cb039e4726",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'which-one-drake-central-cee',
        title: "Which One Drake Central Cee",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhich-one-drake-central-cee.mp3?alt=media&token=3300da21-f9df-4681-88ca-f02eb3f4d17d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'whisper-my-name-drake',
        title: "Whisper My Name Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhisper-my-name-drake.mp3?alt=media&token=70d0270d-d15d-41cd-89e8-487af2dd1ab0",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'white-bone-drake',
        title: "White Bone Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhite-bone-drake.mp3?alt=media&token=fdb53bf0-77ee-4864-8266-b7cccc8bdd61",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'white-tee-lil-tracy-lil-peep',
        title: "White Tee",
        artist: "Lil Tracy Lil Peep",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwhite-tee-feat-lil-tracy-lil-peep.mp3?alt=media&token=d56bcb9a-ec9a-495c-b8cd-8d5fd503d8bf",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'who-gon-slide-1nonly-shakewell',
        title: "Who Gon Slide 1nonly Shakewell",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwho-gon-slide-1nonly-shakewell.mp3?alt=media&token=e70aab8b-d752-4130-989d-4149a0034b0a",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wicked-future',
        title: "Wicked Future",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwicked-future.mp3?alt=media&token=1702f353-41c3-4c17-afaf-3a811a04dbb3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wicked-games-the-weeknd',
        title: "Wicked Games The Weeknd",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwicked-games-the-weeknd.mp3?alt=media&token=f839aa9d-65a2-485e-bfd4-e6ff7ab3526e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wildflower-billie-eilish',
        title: "Wildflower Billie Eilish",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwildflower-billie-eilish.mp3?alt=media&token=1537d185-b39c-48a4-91ef-5d0802730192",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wilson-rj-pasin',
        title: "Wilson Rj Pasin",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwilson-rj-pasin.mp3?alt=media&token=057d6cb4-2e36-4cbc-87b6-718fc9c94d71",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wine-dine-fournine',
        title: "Wine Dine Fournine",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwine-dine-fournine.mp3?alt=media&token=3b994971-e46b-4067-8226-6fdaeca1dea7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wish-ish-dakid',
        title: "Wish Ish Dakid",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwish-ish-dakid.mp3?alt=media&token=66a48af0-a61b-480d-bb7a-6b79e9629236",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wnba-drake',
        title: "Wnba Drake",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwnba-drake.mp3?alt=media&token=ef23e815-d99c-49b2-a077-0356ee904c87",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'woah-lil-baby',
        title: "Woah Lil Baby",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwoah-lil-baby.mp3?alt=media&token=1a2bc7c5-12af-4d74-bca9-3955a5e67ed1",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wok-993s-oqn',
        title: "Wok",
        artist: "993s Oqn",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwok-feat-993s-oqn.mp3?alt=media&token=5694f188-9770-4424-be6b-75383d186e85",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'woman-doja-cat',
        title: "Woman Doja Cat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwoman-doja-cat.mp3?alt=media&token=174449b1-7049-471e-b02b-168b899cbb97",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'work-from-home-ty-dolla-ign-fifth-harmony',
        title: "Work From Home",
        artist: "Ty Dolla Ign Fifth Harmony",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwork-from-home-feat-ty-dolla-ign-fifth-harmony.mp3?alt=media&token=42226c45-2686-4bea-81b0-677c30fc1cb2",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'world-alone-lobani-howl',
        title: "World Alone Lobani Howl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fworld-alone-lobani-howl.mp3?alt=media&token=1d382341-ee0b-47e4-9536-f43fa929f510",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'world-is-spinning-dmad',
        title: "World Is Spinning Dmad",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fworld-is-spinning-dmad.mp3?alt=media&token=76c75840-a502-4e0b-9beb-9b73e9797b87",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'worry-slowed-lonown-riserayss',
        title: "Worry Slowed Lonown Riserayss",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fworry-slowed-lonown-riserayss.mp3?alt=media&token=624731cd-1192-4765-98e2-08dc9a89aaf5",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'worry-ultra-slowed-lonown-riserayss',
        title: "Worry Ultra Slowed Lonown Riserayss",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fworry-ultra-slowed-lonown-riserayss.mp3?alt=media&token=0237bb23-d413-4e1c-b800-69b312effbfe",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'worst-person-anyone-has-ever-know-lobani-howl',
        title: "Worst Person Anyone Has Ever Know Lobani Howl",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fworst-person-anyone-has-ever-know-lobani-howl.mp3?alt=media&token=8b114b3e-63bc-4254-a87e-c6ba25ecf87f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wtf-u-mean-freddie-dredd-haarper',
        title: "Wtf U Mean",
        artist: "Freddie Dredd Haarper",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fwtf-u-mean-feat-freddie-dredd-haarper.mp3?alt=media&token=259db743-23ae-46c1-8ffd-00fede2aa36c",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'x-slide-ultra-slowed-2ke-808iuli',
        title: "X Slide Ultra Slowed 2ke 808iuli",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fx-slide-ultra-slowed-2ke-808iuli.mp3?alt=media&token=91eb5cfa-3a51-4dc3-9b02-f32a1b450451",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'xo-rj-pasin-sophie-powers',
        title: "Xo Rj Pasin Sophie Powers",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fxo-rj-pasin-sophie-powers.mp3?alt=media&token=b936246e-7530-45b1-bb74-88401c67a60e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'xtayalive-jnhygs-9lives',
        title: "Xtayalive Jnhygs 9lives",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fxtayalive-jnhygs-9lives.mp3?alt=media&token=d1f465ce-8989-4e3d-845a-3111a7835fe7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ya-ya-yeat',
        title: "Ya Ya Yeat",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fya-ya-yeat.mp3?alt=media&token=8f260bd1-b125-46a8-a04c-7c1374701e2e",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yale-ken-carson',
        title: "Yale Ken Carson",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyale-ken-carson.mp3?alt=media&token=35427d5f-ae13-4c21-b674-1305d1269b52",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yam-yeat-sharkboy',
        title: "Yam",
        artist: "Yeat Sharkboy",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyam-feat-yeat-sharkboy.mp3?alt=media&token=db2669de-9f5a-4196-9b3c-9aeaae5636ed",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yes-you-can-jerk-drill-rmx-kosfinger-beats',
        title: "Yes You Can Jerk Drill Rmx Kosfinger Beats",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyes-you-can-jerk-drill-rmx-kosfinger-beats.mp3?alt=media&token=933d93fb-10a9-4065-b3a0-67ae75bd8078",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'ykwim-yot-club',
        title: "Ykwim Yot Club",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fykwim-yot-club.mp3?alt=media&token=f985a78a-de43-47f4-a3be-cc1ea6e3ff18",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yo-bunny-prodbycpkshawn-ugly-andz',
        title: "Yo Bunny Prodbycpkshawn Ugly Andz",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyo-bunny-prodbycpkshawn-ugly-andz.mp3?alt=media&token=e9ed9cdf-ec31-44c1-853b-45b0d5910930",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'you-broke-my-heart-kobzx2z-myla',
        title: "You Broke My Heart Kobzx2z Myla",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyou-broke-my-heart-kobzx2z-myla.mp3?alt=media&token=2a1362fe-1032-4ade-816b-50ce0174ef18",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'you-seem-pretty-sad-for-a-girl-so-in-love-olivia-rodrigo',
        title: "You Seem Pretty Sad For A Girl So In Love Olivia Rodrigo",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyou-seem-pretty-sad-for-a-girl-so-in-love-olivia-rodrigo.mp3?alt=media&token=dc4258d9-781a-4ca8-bf83-6096ebd42dd3",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'young-black-rich-melly-mike',
        title: "Young Black Rich Melly Mike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyoung-black-rich-melly-mike.mp3?alt=media&token=5569a11d-d16a-458f-820f-88882634c707",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'young-black-rich-slowed-melly-mike',
        title: "Young Black Rich Slowed Melly Mike",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyoung-black-rich-slowed-melly-mike.mp3?alt=media&token=71c4d918-9b12-4003-8c74-c3a3ffa27782",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'your-idol-saja-boys-andrew-choi-neckwav-danny-chung-kevin-wo',
        title: "Your Idol Saja Boys Andrew Choi Neckwav Danny Chung Kevin Woo Samuil Lee Kpop Demon Hunters Cast",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyour-idol-saja-boys-andrew-choi-neckwav-danny-chung-kevin-woo-samuil-lee-kpop-demon-hunters-cast.mp3?alt=media&token=12fbd4c4-dea8-42b2-99ab-6bdf23f6c953",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'youre-not-brave-worldv',
        title: "Youre Not Brave Worldv",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyoure-not-brave-worldv.mp3?alt=media&token=cb889512-e5d3-4606-88cf-98eeabea5f67",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'youre-too-slow-odetari',
        title: "Youre Too Slow Odetari",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyoure-too-slow-odetari.mp3?alt=media&token=a026c86a-3ac6-4ac8-9310-9415756d7e45",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'yung-bratz-xxxtentacion',
        title: "Yung Bratz Xxxtentacion",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fyung-bratz-xxxtentacion.mp3?alt=media&token=684b0958-b50e-4553-beaf-26ea7d1e7fd7",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'zeze-travis-scott-offset-kodak-black',
        title: "Zeze",
        artist: "Travis Scott Offset Kodak Black",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fzeze-feat-travis-scott-offset-kodak-black.mp3?alt=media&token=dc4a6489-11b3-4c08-876d-60c343a9e7f9",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'zoo-york-fivio-foreign-pop-smoke-lil-tjay',
        title: "Zoo York",
        artist: "Fivio Foreign Pop Smoke Lil Tjay",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fzoo-york-feat-fivio-foreign-pop-smoke-lil-tjay.mp3?alt=media&token=4e180e73-1a04-4afd-b17a-ecb21f09f7fd",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'zyre-slowed-zynyx-krezus',
        title: "Zyre Slowed Zynyx Krezus",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fzyre-slowed-zynyx-krezus.mp3?alt=media&token=3fa7d099-db57-45b3-88c9-f3eb7a94ef1d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'tk-0n-ttn-hiroyuki-sawano',
        title: "əTˈæK 0n TάɪTn Hiroyuki Sawano",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F%C9%99t%CB%88%C3%A6k-0n-t%CE%AC%C9%AAtn-hiroyuki-sawano.mp3?alt=media&token=ecb1a637-a8c9-4c84-9a7a-14157d878f59",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'wipo-uniqe-nkeeei-artem-shilovets',
        title: "гламур",
        artist: "Wipo Uniqe Nkeeei Artem Shilovets",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F%D0%B3%D0%BB%D0%B0%D0%BC%D1%83%D1%80-feat-wipo-uniqe-nkeeei-artem-shilovets.mp3?alt=media&token=d8ea0e3f-b41c-4032-b4cc-f5b6a7b6730f",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'katya-lel',
        title: "мой мармеладный я не права Katya Lel",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F%D0%BC%D0%BE%D0%B9-%D0%BC%D0%B0%D1%80%D0%BC%D0%B5%D0%BB%D0%B0%D0%B4%D0%BD%D1%8B%D0%B9-%D1%8F-%D0%BD%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B0-katya-lel.mp3?alt=media&token=554d7aa6-abd2-4faa-8ff5-fa70b924ac17",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'mark-bernes',
        title: "темная ночь Mark Bernes",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F%D1%82%D0%B5%D0%BC%D0%BD%D0%B0%D1%8F-%D0%BD%D0%BE%D1%87%D1%8C-mark-bernes.mp3?alt=media&token=3d1dffca-52fb-406b-a5d4-ea191189403d",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    },
    {
        id: 'erika-lundmoen',
        title: "яд Erika Lundmoen",
        artist: "Unknown Artist",
        duration: "0:00",
        src: "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2F%D1%8F%D0%B4-erika-lundmoen.mp3?alt=media&token=a07b5c94-5cd6-4bdd-b93d-825127d39a01",
        art: "/images/blank_cover.svg",
        bpm: 120, energy: 0.7, inmixPoint: 10, outmixPoint: 10,
        tags: ["untagged"]
    }
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
