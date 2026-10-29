// js/ad-preview-data.js
// Structured timing, word-level transcripts, and choreography cues for all 5 Ad files

export const AD_TRACKS = [
    {
        id: 'ad-preview-1',
        trackNumber: 1,
        title: 'Ad 1: Skip to Good Part (Laugh)',
        subtitle: 'Dual Talking Blobs • Voice Command & AI Response',
        src: '/music/ads/ad-preview-1.mp3',
        duration: 9.56,
        choreography: [
            {
                start: 0.0,
                end: 2.8,
                speaker: 'user', // Pink User Blob
                text: 'Hey Lexi, skip to the good part.',
                words: [
                    { word: 'Hey', start: 0.0, end: 0.5 },
                    { word: 'Lexi,', start: 0.5, end: 1.1 },
                    { word: 'skip', start: 1.35, end: 1.8 },
                    { word: 'to', start: 1.8, end: 2.0 },
                    { word: 'the', start: 2.0, end: 2.2 },
                    { word: 'good', start: 2.2, end: 2.5 },
                    { word: 'part.', start: 2.5, end: 2.8 }
                ]
            },
            {
                start: 2.8,
                end: 3.2,
                speaker: 'transition',
                text: '...',
                words: []
            },
            {
                start: 3.2,
                end: 9.56,
                speaker: 'lexi', // Lexi AI Orb
                text: '[Laughs] I got you, twin. I\'m gonna cue up global hits on Medixly. Let\'s go!',
                words: [
                    { word: '[Laughs]', start: 3.2, end: 4.0 },
                    { word: 'I', start: 4.0, end: 4.3 },
                    { word: 'got', start: 4.3, end: 4.55 },
                    { word: 'you,', start: 4.55, end: 4.8 },
                    { word: 'twin.', start: 4.8, end: 5.4 },
                    { word: 'I\'m', start: 5.65, end: 5.95 },
                    { word: 'gonna', start: 5.95, end: 6.25 },
                    { word: 'cue', start: 6.25, end: 6.55 },
                    { word: 'up', start: 6.55, end: 6.8 },
                    { word: 'global', start: 6.8, end: 7.25 },
                    { word: 'hits', start: 7.25, end: 7.65 },
                    { word: 'on', start: 7.65, end: 7.9 },
                    { word: 'Medixly.', start: 7.9, end: 8.65 },
                    { word: 'Let\'s', start: 8.75, end: 9.1 },
                    { word: 'go!', start: 9.1, end: 9.56 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-2',
        trackNumber: 2,
        title: 'Ad 2: Skip to Good Part (Fast Cut)',
        subtitle: 'Dual Talking Blobs • Direct Command & Fast Slide',
        src: '/music/ads/ad-preview-2.mp3',
        duration: 7.89,
        choreography: [
            {
                start: 0.0,
                end: 2.5,
                speaker: 'user', // Pink User Blob
                text: 'Hey Lexi, skip to the good part.',
                words: [
                    { word: 'Hey', start: 0.0, end: 0.45 },
                    { word: 'Lexi,', start: 0.45, end: 0.95 },
                    { word: 'skip', start: 1.35, end: 1.7 },
                    { word: 'to', start: 1.7, end: 1.9 },
                    { word: 'the', start: 1.9, end: 2.1 },
                    { word: 'good', start: 2.1, end: 2.35 },
                    { word: 'part.', start: 2.35, end: 2.5 }
                ]
            },
            {
                start: 2.5,
                end: 3.1,
                speaker: 'transition',
                text: '...',
                words: []
            },
            {
                start: 3.1,
                end: 7.89,
                speaker: 'lexi', // Lexi AI Orb
                text: 'I got you, twin. I\'m gonna cue up global hits on Medixly. Let\'s go!',
                words: [
                    { word: 'I', start: 3.1, end: 3.35 },
                    { word: 'got', start: 3.35, end: 3.6 },
                    { word: 'you,', start: 3.6, end: 3.85 },
                    { word: 'twin.', start: 3.85, end: 4.4 },
                    { word: 'I\'m', start: 4.6, end: 4.9 },
                    { word: 'gonna', start: 4.9, end: 5.2 },
                    { word: 'cue', start: 5.2, end: 5.5 },
                    { word: 'up', start: 5.5, end: 5.75 },
                    { word: 'global', start: 5.75, end: 6.2 },
                    { word: 'hits', start: 6.2, end: 6.55 },
                    { word: 'on', start: 6.55, end: 6.8 },
                    { word: 'Medixly.', start: 6.8, end: 7.3 },
                    { word: 'Let\'s', start: 7.3, end: 7.55 },
                    { word: 'go!', start: 7.55, end: 7.89 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-3',
        trackNumber: 3,
        title: 'Ad 3: Dale! Miami Trending & 99¢ Drop',
        subtitle: 'High Energy Pitch • User Narration + Lexi Fire + 99¢ Countdown',
        src: '/music/ads/ad-preview-3.mp3',
        duration: 40.59,
        choreography: [
            {
                start: 0.0,
                end: 1.5,
                speaker: 'user',
                text: 'Dale!',
                words: [
                    { word: 'Dale!', start: 0.0, end: 1.2 }
                ]
            },
            {
                start: 1.5,
                end: 8.0,
                speaker: 'user',
                text: 'Tired of digging through dead links and boring playlists just to find that main character soundtrack for your edit?',
                words: [
                    { word: 'Tired', start: 1.55, end: 2.0 },
                    { word: 'of', start: 2.0, end: 2.15 },
                    { word: 'digging', start: 2.15, end: 2.6 },
                    { word: 'through', start: 2.6, end: 2.9 },
                    { word: 'dead', start: 2.9, end: 3.3 },
                    { word: 'links', start: 3.3, end: 3.7 },
                    { word: 'and', start: 3.7, end: 3.9 },
                    { word: 'boring', start: 3.9, end: 4.4 },
                    { word: 'playlists', start: 4.4, end: 5.1 },
                    { word: 'just', start: 5.1, end: 5.4 },
                    { word: 'to', start: 5.4, end: 5.6 },
                    { word: 'find', start: 5.6, end: 6.0 },
                    { word: 'that', start: 6.0, end: 6.2 },
                    { word: 'main', start: 6.2, end: 6.55 },
                    { word: 'character', start: 6.55, end: 7.1 },
                    { word: 'soundtrack', start: 7.1, end: 7.6 },
                    { word: 'for', start: 7.6, end: 7.75 },
                    { word: 'your', start: 7.75, end: 7.9 },
                    { word: 'edit?', start: 7.9, end: 8.0 }
                ]
            },
            {
                start: 8.0,
                end: 14.5,
                speaker: 'user',
                text: 'What if you could pull up all the hottest trending tracks, hot like Miami, all in one place?',
                words: [
                    { word: 'What', start: 8.1, end: 8.4 },
                    { word: 'if', start: 8.4, end: 8.6 },
                    { word: 'you', start: 8.6, end: 8.8 },
                    { word: 'could', start: 8.8, end: 9.1 },
                    { word: 'pull', start: 9.1, end: 9.4 },
                    { word: 'up', start: 9.4, end: 9.6 },
                    { word: 'all', start: 9.6, end: 9.9 },
                    { word: 'the', start: 9.9, end: 10.1 },
                    { word: 'hottest', start: 10.1, end: 10.6 },
                    { word: 'trending', start: 10.6, end: 11.0 },
                    { word: 'tracks,', start: 11.0, end: 11.4 },
                    { word: 'hot', start: 11.5, end: 11.8 },
                    { word: 'like', start: 11.8, end: 12.1 },
                    { word: 'Miami,', start: 12.1, end: 12.8 },
                    { word: 'all', start: 13.0, end: 13.3 },
                    { word: 'in', start: 13.3, end: 13.5 },
                    { word: 'one', start: 13.5, end: 13.8 },
                    { word: 'place?', start: 13.8, end: 14.3 }
                ]
            },
            {
                start: 14.5,
                end: 17.5,
                speaker: 'user',
                text: 'Now, with Medixly, you can!',
                words: [
                    { word: 'Now,', start: 14.65, end: 15.2 },
                    { word: 'with', start: 15.2, end: 15.5 },
                    { word: 'Medixly,', start: 15.5, end: 16.4 },
                    { word: 'you', start: 16.5, end: 16.8 },
                    { word: 'can!', start: 16.8, end: 17.4 }
                ]
            },
            {
                start: 17.5,
                end: 20.2,
                speaker: 'user',
                text: 'Hey Lexi, play some fire.',
                words: [
                    { word: 'Hey', start: 17.9, end: 18.25 },
                    { word: 'Lexi,', start: 18.25, end: 18.7 },
                    { word: 'play', start: 19.0, end: 19.35 },
                    { word: 'some', start: 19.35, end: 19.6 },
                    { word: 'fire.', start: 19.6, end: 20.1 }
                ]
            },
            {
                start: 20.2,
                end: 24.2,
                speaker: 'lexi',
                text: 'Cueing up global hits on Medixly. Let\'s go!',
                words: [
                    { word: 'Cueing', start: 20.5, end: 21.0 },
                    { word: 'up', start: 21.0, end: 21.25 },
                    { word: 'global', start: 21.25, end: 21.75 },
                    { word: 'hits', start: 21.75, end: 22.15 },
                    { word: 'on', start: 22.15, end: 22.4 },
                    { word: 'Medixly.', start: 22.4, end: 23.0 },
                    { word: 'Let\'s', start: 23.15, end: 23.5 },
                    { word: 'go!', start: 23.5, end: 24.0 }
                ]
            },
            {
                start: 24.2,
                end: 28.5,
                speaker: 'both',
                text: 'We\'re dropping prices starting at just 99¢ today!',
                words: [
                    { word: 'We\'re', start: 24.3, end: 24.65 },
                    { word: 'dropping', start: 24.65, end: 25.15 },
                    { word: 'prices', start: 25.15, end: 25.7 },
                    { word: 'starting', start: 25.7, end: 26.2 },
                    { word: 'at', start: 26.2, end: 26.4 },
                    { word: 'just', start: 26.4, end: 26.8 },
                    { word: '99¢', start: 26.8, end: 27.5 },
                    { word: 'today!', start: 27.5, end: 28.2 }
                ]
            },
            {
                start: 28.5,
                end: 32.0,
                speaker: 'both',
                text: 'But watch out, it goes up a dollar every single day.',
                words: [
                    { word: 'But', start: 28.5, end: 28.7 },
                    { word: 'watch', start: 28.7, end: 29.0 },
                    { word: 'out,', start: 29.0, end: 29.35 },
                    { word: 'it', start: 29.35, end: 29.55 },
                    { word: 'goes', start: 29.55, end: 29.9 },
                    { word: 'up', start: 29.9, end: 30.15 },
                    { word: 'a', start: 30.15, end: 30.25 },
                    { word: 'dollar', start: 30.25, end: 30.7 },
                    { word: 'every', start: 30.7, end: 31.05 },
                    { word: 'single', start: 31.05, end: 31.45 },
                    { word: 'day.', start: 31.45, end: 31.9 }
                ]
            },
            {
                start: 32.0,
                end: 34.0,
                speaker: 'both',
                text: 'Lock it in before time runs out.',
                words: [
                    { word: 'Lock', start: 32.0, end: 32.35 },
                    { word: 'it', start: 32.35, end: 32.55 },
                    { word: 'in', start: 32.55, end: 32.8 },
                    { word: 'before', start: 32.8, end: 33.2 },
                    { word: 'time', start: 33.2, end: 33.55 },
                    { word: 'runs', start: 33.55, end: 33.85 },
                    { word: 'out.', start: 33.85, end: 34.0 }
                ]
            },
            {
                start: 34.0,
                end: 38.0,
                speaker: 'both',
                text: 'Head to realunstoppable.store/medixly right now.',
                words: [
                    { word: 'Head', start: 34.1, end: 34.45 },
                    { word: 'to', start: 34.45, end: 34.65 },
                    { word: 'realunstoppable.store/medixly', start: 34.65, end: 36.9 },
                    { word: 'right', start: 37.0, end: 37.35 },
                    { word: 'now.', start: 37.35, end: 37.8 }
                ]
            },
            {
                start: 38.0,
                end: 40.59,
                speaker: 'both',
                text: 'Sound, elevated. Dale!',
                words: [
                    { word: 'Sound,', start: 38.2, end: 38.75 },
                    { word: 'elevated.', start: 38.75, end: 39.5 },
                    { word: 'Dale!', start: 39.6, end: 40.59 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-4',
        trackNumber: 4,
        title: 'Ad 4: Oh & We Also Have This',
        subtitle: 'Dual Talking Blobs • Teaser Transition & AI Activation',
        src: '/music/ads/ad-preview-4.mp3',
        duration: 9.95,
        choreography: [
            {
                start: 0.0,
                end: 2.5,
                speaker: 'user',
                text: 'Oh, and we also have this.',
                words: [
                    { word: 'Oh,', start: 0.0, end: 0.4 },
                    { word: 'and', start: 0.4, end: 0.7 },
                    { word: 'we', start: 0.7, end: 1.0 },
                    { word: 'also', start: 1.0, end: 1.5 },
                    { word: 'have', start: 1.5, end: 1.8 },
                    { word: 'this.', start: 1.8, end: 2.2 }
                ]
            },
            {
                start: 2.5,
                end: 5.1,
                speaker: 'user',
                text: 'Hey Lexi, skip to the good part.',
                words: [
                    { word: 'Hey', start: 2.55, end: 2.95 },
                    { word: 'Lexi,', start: 2.95, end: 3.4 },
                    { word: 'skip', start: 3.6, end: 4.0 },
                    { word: 'to', start: 4.0, end: 4.2 },
                    { word: 'the', start: 4.2, end: 4.4 },
                    { word: 'good', start: 4.4, end: 4.65 },
                    { word: 'part.', start: 4.65, end: 5.0 }
                ]
            },
            {
                start: 5.1,
                end: 5.6,
                speaker: 'transition',
                text: '...',
                words: []
            },
            {
                start: 5.6,
                end: 9.95,
                speaker: 'lexi',
                text: 'I got you, twin. I\'m gonna cue up global hits on Medixly. Let\'s go!',
                words: [
                    { word: 'I', start: 5.6, end: 5.85 },
                    { word: 'got', start: 5.85, end: 6.1 },
                    { word: 'you,', start: 6.1, end: 6.35 },
                    { word: 'twin.', start: 6.35, end: 7.0 },
                    { word: 'I\'m', start: 7.1, end: 7.4 },
                    { word: 'gonna', start: 7.4, end: 7.7 },
                    { word: 'cue', start: 7.7, end: 8.0 },
                    { word: 'up', start: 8.0, end: 8.25 },
                    { word: 'global', start: 8.25, end: 8.7 },
                    { word: 'hits', start: 8.7, end: 9.05 },
                    { word: 'on', start: 9.05, end: 9.25 },
                    { word: 'Medixly.', start: 9.25, end: 9.7 },
                    { word: 'Let\'s', start: 9.7, end: 9.85 },
                    { word: 'go!', start: 9.85, end: 9.95 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-5',
        trackNumber: 5,
        title: 'Ad 5: Creator Vision & 99¢ Movement',
        subtitle: 'Epic Storytelling Pitch • Origin, Team Behind The Scenes & CTA',
        src: '/music/ads/ad-preview-5.mp3',
        duration: 54.36,
        choreography: [
            {
                start: 0.0,
                end: 5.0,
                speaker: 'user',
                text: 'Since the dawn of time, creators have had one obsession:',
                words: [
                    { word: 'Since', start: 0.0, end: 0.5 },
                    { word: 'the', start: 0.5, end: 0.75 },
                    { word: 'dawn', start: 0.75, end: 1.2 },
                    { word: 'of', start: 1.2, end: 1.4 },
                    { word: 'time,', start: 1.4, end: 1.9 },
                    { word: 'creators', start: 2.1, end: 2.8 },
                    { word: 'have', start: 2.8, end: 3.1 },
                    { word: 'had', start: 3.1, end: 3.4 },
                    { word: 'one', start: 3.4, end: 3.8 },
                    { word: 'obsession:', start: 3.8, end: 4.8 }
                ]
            },
            {
                start: 5.0,
                end: 14.5,
                speaker: 'user',
                text: 'We wanted to build a place where video editors could find any song they wanted, exactly when they needed it, without hitting a wall.',
                words: [
                    { word: 'We', start: 5.0, end: 5.3 },
                    { word: 'wanted', start: 5.3, end: 5.8 },
                    { word: 'to', start: 5.8, end: 6.0 },
                    { word: 'build', start: 6.0, end: 6.5 },
                    { word: 'a', start: 6.5, end: 6.65 },
                    { word: 'place', start: 6.65, end: 7.1 },
                    { word: 'where', start: 7.1, end: 7.4 },
                    { word: 'video', start: 7.4, end: 7.8 },
                    { word: 'editors', start: 7.8, end: 8.4 },
                    { word: 'could', start: 8.4, end: 8.7 },
                    { word: 'find', start: 8.7, end: 9.1 },
                    { word: 'any', start: 9.1, end: 9.4 },
                    { word: 'song', start: 9.4, end: 9.8 },
                    { word: 'they', start: 9.8, end: 10.0 },
                    { word: 'wanted,', start: 10.0, end: 10.6 },
                    { word: 'exactly', start: 10.7, end: 11.3 },
                    { word: 'when', start: 11.3, end: 11.6 },
                    { word: 'they', start: 11.6, end: 11.8 },
                    { word: 'needed', start: 11.8, end: 12.3 },
                    { word: 'it,', start: 12.3, end: 12.6 },
                    { word: 'without', start: 12.8, end: 13.3 },
                    { word: 'hitting', start: 13.3, end: 13.7 },
                    { word: 'a', start: 13.7, end: 13.85 },
                    { word: 'wall.', start: 13.85, end: 14.3 }
                ]
            },
            {
                start: 14.5,
                end: 18.0,
                speaker: 'both',
                text: 'But building a universe like that? It takes a massive team.',
                words: [
                    { word: 'But', start: 14.6, end: 14.9 },
                    { word: 'building', start: 14.9, end: 15.4 },
                    { word: 'a', start: 15.4, end: 15.55 },
                    { word: 'universe', start: 15.55, end: 16.2 },
                    { word: 'like', start: 16.2, end: 16.5 },
                    { word: 'that?', start: 16.5, end: 17.0 },
                    { word: 'It', start: 17.1, end: 17.3 },
                    { word: 'takes', start: 17.3, end: 17.6 },
                    { word: 'a', start: 17.6, end: 17.75 },
                    { word: 'massive', start: 17.75, end: 18.3 },
                    { word: 'team.', start: 18.3, end: 18.8 }
                ]
            },
            {
                start: 18.0,
                end: 29.0,
                speaker: 'lexi',
                text: 'It takes real people behind the scenes, updating live lyrics, tracking trending charts, and hunting down the absolute best music on earth before anyone else.',
                words: [
                    { word: 'It', start: 18.8, end: 19.0 },
                    { word: 'takes', start: 19.0, end: 19.3 },
                    { word: 'real', start: 19.3, end: 19.7 },
                    { word: 'people', start: 19.7, end: 20.2 },
                    { word: 'behind', start: 20.2, end: 20.7 },
                    { word: 'the', start: 20.7, end: 20.9 },
                    { word: 'scenes,', start: 20.9, end: 21.6 },
                    { word: 'updating', start: 21.8, end: 22.5 },
                    { word: 'live', start: 22.5, end: 22.9 },
                    { word: 'lyrics,', start: 22.9, end: 23.6 },
                    { word: 'tracking', start: 23.8, end: 24.4 },
                    { word: 'trending', start: 24.4, end: 24.9 },
                    { word: 'charts,', start: 24.9, end: 25.6 },
                    { word: 'and', start: 25.8, end: 26.0 },
                    { word: 'hunting', start: 26.0, end: 26.5 },
                    { word: 'down', start: 26.5, end: 26.8 },
                    { word: 'the', start: 26.8, end: 27.0 },
                    { word: 'absolute', start: 27.0, end: 27.6 },
                    { word: 'best', start: 27.6, end: 28.0 },
                    { word: 'music', start: 28.0, end: 28.4 },
                    { word: 'on', start: 28.4, end: 28.6 },
                    { word: 'earth', start: 28.6, end: 29.0 },
                    { word: 'before', start: 29.0, end: 29.5 },
                    { word: 'anyone', start: 29.5, end: 30.0 },
                    { word: 'else.', start: 30.0, end: 30.5 }
                ]
            },
            {
                start: 29.0,
                end: 35.5,
                speaker: 'user',
                text: 'It is not easy work. But we want to build a home where you can find anything you want.',
                words: [
                    { word: 'It', start: 30.8, end: 31.0 },
                    { word: 'is', start: 31.0, end: 31.2 },
                    { word: 'not', start: 31.2, end: 31.5 },
                    { word: 'easy', start: 31.5, end: 31.9 },
                    { word: 'work.', start: 31.9, end: 32.5 },
                    { word: 'But', start: 32.7, end: 33.0 },
                    { word: 'we', start: 33.0, end: 33.2 },
                    { word: 'want', start: 33.2, end: 33.5 },
                    { word: 'to', start: 33.5, end: 33.7 },
                    { word: 'build', start: 33.7, end: 34.1 },
                    { word: 'a', start: 34.1, end: 34.25 },
                    { word: 'home', start: 34.25, end: 34.7 },
                    { word: 'where', start: 34.7, end: 35.0 },
                    { word: 'you', start: 35.0, end: 35.2 },
                    { word: 'can', start: 35.2, end: 35.5 },
                    { word: 'find', start: 35.5, end: 35.8 },
                    { word: 'anything', start: 35.8, end: 36.3 },
                    { word: 'you', start: 36.3, end: 36.5 },
                    { word: 'want.', start: 36.5, end: 37.0 }
                ]
            },
            {
                start: 35.5,
                end: 47.5,
                speaker: 'both',
                text: 'Today, you can support that vision. Grab your Medixly membership for just 99¢, and directly fuel the creators, researchers, and coders keeping your edits unmatched.',
                words: [
                    { word: 'Today,', start: 37.2, end: 37.8 },
                    { word: 'you', start: 37.8, end: 38.0 },
                    { word: 'can', start: 38.0, end: 38.3 },
                    { word: 'support', start: 38.3, end: 38.8 },
                    { word: 'that', start: 38.8, end: 39.1 },
                    { word: 'vision.', start: 39.1, end: 39.7 },
                    { word: 'Grab', start: 39.9, end: 40.3 },
                    { word: 'your', start: 40.3, end: 40.55 },
                    { word: 'Medixly', start: 40.55, end: 41.2 },
                    { word: 'membership', start: 41.2, end: 41.9 },
                    { word: 'for', start: 41.9, end: 42.1 },
                    { word: 'just', start: 42.1, end: 42.5 },
                    { word: '99¢,', start: 42.5, end: 43.3 },
                    { word: 'and', start: 43.5, end: 43.7 },
                    { word: 'directly', start: 43.7, end: 44.3 },
                    { word: 'fuel', start: 44.3, end: 44.7 },
                    { word: 'the', start: 44.7, end: 44.9 },
                    { word: 'creators,', start: 44.9, end: 45.6 },
                    { word: 'researchers,', start: 45.6, end: 46.4 },
                    { word: 'and', start: 46.4, end: 46.6 },
                    { word: 'coders', start: 46.6, end: 47.1 },
                    { word: 'keeping', start: 47.1, end: 47.5 },
                    { word: 'your', start: 47.5, end: 47.7 },
                    { word: 'edits', start: 47.7, end: 48.1 },
                    { word: 'unmatched.', start: 48.1, end: 48.8 }
                ]
            },
            {
                start: 47.5,
                end: 54.36,
                speaker: 'both',
                text: 'Join the movement. Head to realunstoppable.store/medixly right now. Sound elevated.',
                words: [
                    { word: 'Join', start: 49.0, end: 49.4 },
                    { word: 'the', start: 49.4, end: 49.6 },
                    { word: 'movement.', start: 49.6, end: 50.3 },
                    { word: 'Head', start: 50.5, end: 50.9 },
                    { word: 'to', start: 50.9, end: 51.1 },
                    { word: 'realunstoppable.store/medixly', start: 51.1, end: 53.2 },
                    { word: 'right', start: 53.3, end: 53.6 },
                    { word: 'now.', start: 53.6, end: 54.0 },
                    { word: 'Sound', start: 54.0, end: 54.2 },
                    { word: 'elevated.', start: 54.2, end: 54.36 }
                ]
            }
        ]
    }
,
    {
        id: 'ad-preview-6',
        trackNumber: 6,
        title: "Ad 6:  Escalating Drop & Wildest Deal",
        subtitle: "Urgency Pricing \u2022  Launch Price Going Up Daily \u2022 Lock In Now",
        src: '/music/ads/ad-preview-6.mp3',
        duration: 47.65,
        choreography: [
            {
                start: 0.0,
                end: 2.4,
                speaker: 'user',
                text: "Attention music lovers!",
                words: [
                    { word: "Attention", start: 0.0, end: 0.8 },
                    { word: "music", start: 0.8, end: 1.6 },
                    { word: "lovers!", start: 1.6, end: 2.4 }
                ]
            },
            {
                start: 2.4,
                end: 9.8,
                speaker: 'user',
                text: "What if I told you that you could unlock the ultimate streaming experience on Medixly for literally ?",
                words: [
                    { word: "What", start: 2.4, end: 2.81 },
                    { word: "if", start: 2.81, end: 3.22 },
                    { word: "I", start: 3.22, end: 3.63 },
                    { word: "told", start: 3.63, end: 4.04 },
                    { word: "you", start: 4.04, end: 4.46 },
                    { word: "that", start: 4.46, end: 4.87 },
                    { word: "you", start: 4.87, end: 5.28 },
                    { word: "could", start: 5.28, end: 5.69 },
                    { word: "unlock", start: 5.69, end: 6.1 },
                    { word: "the", start: 6.1, end: 6.51 },
                    { word: "ultimate", start: 6.51, end: 6.92 },
                    { word: "streaming", start: 6.92, end: 7.33 },
                    { word: "experience", start: 7.33, end: 7.74 },
                    { word: "on", start: 7.74, end: 8.16 },
                    { word: "Medixly", start: 8.16, end: 8.57 },
                    { word: "for", start: 8.57, end: 8.98 },
                    { word: "literally", start: 8.98, end: 9.39 },
                    { word: "?", start: 9.39, end: 9.8 }
                ]
            },
            {
                start: 9.8,
                end: 18.3,
                speaker: 'lexi',
                text: "Starting today we are launching our wildest drop yet: we're slashing Medixly membership prices down to just one single dollar.",
                words: [
                    { word: "Starting", start: 9.8, end: 10.23 },
                    { word: "today", start: 10.23, end: 10.65 },
                    { word: "we", start: 10.65, end: 11.08 },
                    { word: "are", start: 11.08, end: 11.5 },
                    { word: "launching", start: 11.5, end: 11.93 },
                    { word: "our", start: 11.93, end: 12.35 },
                    { word: "wildest", start: 12.35, end: 12.78 },
                    { word: "drop", start: 12.78, end: 13.2 },
                    { word: "yet:", start: 13.2, end: 13.62 },
                    { word: "we're", start: 13.62, end: 14.05 },
                    { word: "slashing", start: 14.05, end: 14.48 },
                    { word: "Medixly", start: 14.48, end: 14.9 },
                    { word: "membership", start: 14.9, end: 15.32 },
                    { word: "prices", start: 15.32, end: 15.75 },
                    { word: "down", start: 15.75, end: 16.18 },
                    { word: "to", start: 16.18, end: 16.6 },
                    { word: "just", start: 16.6, end: 17.02 },
                    { word: "one", start: 17.02, end: 17.45 },
                    { word: "single", start: 17.45, end: 17.88 },
                    { word: "dollar.", start: 17.88, end: 18.3 }
                ]
            },
            {
                start: 18.3,
                end: 24.0,
                speaker: 'both',
                text: "But here is the catch: every single day the price goes up by one dollar.",
                words: [
                    { word: "But", start: 18.3, end: 18.68 },
                    { word: "here", start: 18.68, end: 19.06 },
                    { word: "is", start: 19.06, end: 19.44 },
                    { word: "the", start: 19.44, end: 19.82 },
                    { word: "catch:", start: 19.82, end: 20.2 },
                    { word: "every", start: 20.2, end: 20.58 },
                    { word: "single", start: 20.58, end: 20.96 },
                    { word: "day", start: 20.96, end: 21.34 },
                    { word: "the", start: 21.34, end: 21.72 },
                    { word: "price", start: 21.72, end: 22.1 },
                    { word: "goes", start: 22.1, end: 22.48 },
                    { word: "up", start: 22.48, end: 22.86 },
                    { word: "by", start: 22.86, end: 23.24 },
                    { word: "one", start: 23.24, end: 23.62 },
                    { word: "dollar.", start: 23.62, end: 24.0 }
                ]
            },
            {
                start: 24.0,
                end: 34.0,
                speaker: 'lexi',
                text: "Once it hits the top, that window is slammed shut forever. You can lock in either our monthly or yearly plan right now at rock-bottom value before time runs out this week.",
                words: [
                    { word: "Once", start: 24.0, end: 24.31 },
                    { word: "it", start: 24.31, end: 24.62 },
                    { word: "hits", start: 24.62, end: 24.94 },
                    { word: "the", start: 24.94, end: 25.25 },
                    { word: "top,", start: 25.25, end: 25.56 },
                    { word: "that", start: 25.56, end: 25.88 },
                    { word: "window", start: 25.88, end: 26.19 },
                    { word: "is", start: 26.19, end: 26.5 },
                    { word: "slammed", start: 26.5, end: 26.81 },
                    { word: "shut", start: 26.81, end: 27.12 },
                    { word: "forever.", start: 27.12, end: 27.44 },
                    { word: "You", start: 27.44, end: 27.75 },
                    { word: "can", start: 27.75, end: 28.06 },
                    { word: "lock", start: 28.06, end: 28.38 },
                    { word: "in", start: 28.38, end: 28.69 },
                    { word: "either", start: 28.69, end: 29.0 },
                    { word: "our", start: 29.0, end: 29.31 },
                    { word: "monthly", start: 29.31, end: 29.62 },
                    { word: "or", start: 29.62, end: 29.94 },
                    { word: "yearly", start: 29.94, end: 30.25 },
                    { word: "plan", start: 30.25, end: 30.56 },
                    { word: "right", start: 30.56, end: 30.88 },
                    { word: "now", start: 30.88, end: 31.19 },
                    { word: "at", start: 31.19, end: 31.5 },
                    { word: "rock-bottom", start: 31.5, end: 31.81 },
                    { word: "value", start: 31.81, end: 32.12 },
                    { word: "before", start: 32.12, end: 32.44 },
                    { word: "time", start: 32.44, end: 32.75 },
                    { word: "runs", start: 32.75, end: 33.06 },
                    { word: "out", start: 33.06, end: 33.38 },
                    { word: "this", start: 33.38, end: 33.69 },
                    { word: "week.", start: 33.69, end: 34.0 }
                ]
            },
            {
                start: 34.0,
                end: 43.5,
                speaker: 'user',
                text: "Don't wait until you're paying full price. Head over to Real Unstoppable right now, grab your pass and stream without limits.",
                words: [
                    { word: "Don't", start: 34.0, end: 34.45 },
                    { word: "wait", start: 34.45, end: 34.9 },
                    { word: "until", start: 34.9, end: 35.36 },
                    { word: "you're", start: 35.36, end: 35.81 },
                    { word: "paying", start: 35.81, end: 36.26 },
                    { word: "full", start: 36.26, end: 36.71 },
                    { word: "price.", start: 36.71, end: 37.17 },
                    { word: "Head", start: 37.17, end: 37.62 },
                    { word: "over", start: 37.62, end: 38.07 },
                    { word: "to", start: 38.07, end: 38.52 },
                    { word: "Real", start: 38.52, end: 38.98 },
                    { word: "Unstoppable", start: 38.98, end: 39.43 },
                    { word: "right", start: 39.43, end: 39.88 },
                    { word: "now,", start: 39.88, end: 40.33 },
                    { word: "grab", start: 40.33, end: 40.79 },
                    { word: "your", start: 40.79, end: 41.24 },
                    { word: "pass", start: 41.24, end: 41.69 },
                    { word: "and", start: 41.69, end: 42.14 },
                    { word: "stream", start: 42.14, end: 42.6 },
                    { word: "without", start: 42.6, end: 43.05 },
                    { word: "limits.", start: 43.05, end: 43.5 }
                ]
            },
            {
                start: 43.5,
                end: 47.65,
                speaker: 'both',
                text: "Medixly, sound elevated. Act fast!",
                words: [
                    { word: "Medixly,", start: 43.5, end: 44.33 },
                    { word: "sound", start: 44.33, end: 45.16 },
                    { word: "elevated.", start: 45.16, end: 45.99 },
                    { word: "Act", start: 45.99, end: 46.82 },
                    { word: "fast!", start: 46.82, end: 47.65 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-7',
        trackNumber: 7,
        title: "Ad 7: Total Audio Control & 99\u00a2 Editor Pass",
        subtitle: "Viral Charts & Synced Lyrics \u2022 Copyright-Free Power for Editors",
        src: '/music/ads/ad-preview-7.mp3',
        duration: 34.59,
        choreography: [
            {
                start: 0.0,
                end: 7.0,
                speaker: 'user',
                text: "Tired of spending hours searching through copyright claims and dead links just to find that one perfect sound for your edit?",
                words: [
                    { word: "Tired", start: 0.0, end: 0.33 },
                    { word: "of", start: 0.33, end: 0.67 },
                    { word: "spending", start: 0.67, end: 1.0 },
                    { word: "hours", start: 1.0, end: 1.33 },
                    { word: "searching", start: 1.33, end: 1.67 },
                    { word: "through", start: 1.67, end: 2.0 },
                    { word: "copyright", start: 2.0, end: 2.33 },
                    { word: "claims", start: 2.33, end: 2.67 },
                    { word: "and", start: 2.67, end: 3.0 },
                    { word: "dead", start: 3.0, end: 3.33 },
                    { word: "links", start: 3.33, end: 3.67 },
                    { word: "just", start: 3.67, end: 4.0 },
                    { word: "to", start: 4.0, end: 4.33 },
                    { word: "find", start: 4.33, end: 4.67 },
                    { word: "that", start: 4.67, end: 5.0 },
                    { word: "one", start: 5.0, end: 5.33 },
                    { word: "perfect", start: 5.33, end: 5.67 },
                    { word: "sound", start: 5.67, end: 6.0 },
                    { word: "for", start: 6.0, end: 6.33 },
                    { word: "your", start: 6.33, end: 6.67 },
                    { word: "edit?", start: 6.67, end: 7.0 }
                ]
            },
            {
                start: 7.0,
                end: 14.0,
                speaker: 'user',
                text: "What if you could find all the trendiest songs, synced lyrics, and custom audio tools all in one place?",
                words: [
                    { word: "What", start: 7.0, end: 7.37 },
                    { word: "if", start: 7.37, end: 7.74 },
                    { word: "you", start: 7.74, end: 8.11 },
                    { word: "could", start: 8.11, end: 8.47 },
                    { word: "find", start: 8.47, end: 8.84 },
                    { word: "all", start: 8.84, end: 9.21 },
                    { word: "the", start: 9.21, end: 9.58 },
                    { word: "trendiest", start: 9.58, end: 9.95 },
                    { word: "songs,", start: 9.95, end: 10.32 },
                    { word: "synced", start: 10.32, end: 10.68 },
                    { word: "lyrics,", start: 10.68, end: 11.05 },
                    { word: "and", start: 11.05, end: 11.42 },
                    { word: "custom", start: 11.42, end: 11.79 },
                    { word: "audio", start: 11.79, end: 12.16 },
                    { word: "tools", start: 12.16, end: 12.53 },
                    { word: "all", start: 12.53, end: 12.89 },
                    { word: "in", start: 12.89, end: 13.26 },
                    { word: "one", start: 13.26, end: 13.63 },
                    { word: "place?", start: 13.63, end: 14.0 }
                ]
            },
            {
                start: 14.0,
                end: 17.0,
                speaker: 'lexi',
                text: "Now, with Medixly, you can!",
                words: [
                    { word: "Now,", start: 14.0, end: 14.6 },
                    { word: "with", start: 14.6, end: 15.2 },
                    { word: "Medixly,", start: 15.2, end: 15.8 },
                    { word: "you", start: 15.8, end: 16.4 },
                    { word: "can!", start: 16.4, end: 17.0 }
                ]
            },
            {
                start: 17.0,
                end: 23.0,
                speaker: 'lexi',
                text: "We are scaling up, tracking the biggest viral charts, and giving you total audio control.",
                words: [
                    { word: "We", start: 17.0, end: 17.4 },
                    { word: "are", start: 17.4, end: 17.8 },
                    { word: "scaling", start: 17.8, end: 18.2 },
                    { word: "up,", start: 18.2, end: 18.6 },
                    { word: "tracking", start: 18.6, end: 19.0 },
                    { word: "the", start: 19.0, end: 19.4 },
                    { word: "biggest", start: 19.4, end: 19.8 },
                    { word: "viral", start: 19.8, end: 20.2 },
                    { word: "charts,", start: 20.2, end: 20.6 },
                    { word: "and", start: 20.6, end: 21.0 },
                    { word: "giving", start: 21.0, end: 21.4 },
                    { word: "you", start: 21.4, end: 21.8 },
                    { word: "total", start: 21.8, end: 22.2 },
                    { word: "audio", start: 22.2, end: 22.6 },
                    { word: "control.", start: 22.6, end: 23.0 }
                ]
            },
            {
                start: 23.0,
                end: 28.0,
                speaker: 'both',
                text: "And for a limited time today, you can lock in your membership for just 99\u00a2.",
                words: [
                    { word: "And", start: 23.0, end: 23.33 },
                    { word: "for", start: 23.33, end: 23.67 },
                    { word: "a", start: 23.67, end: 24.0 },
                    { word: "limited", start: 24.0, end: 24.33 },
                    { word: "time", start: 24.33, end: 24.67 },
                    { word: "today,", start: 24.67, end: 25.0 },
                    { word: "you", start: 25.0, end: 25.33 },
                    { word: "can", start: 25.33, end: 25.67 },
                    { word: "lock", start: 25.67, end: 26.0 },
                    { word: "in", start: 26.0, end: 26.33 },
                    { word: "your", start: 26.33, end: 26.67 },
                    { word: "membership", start: 26.67, end: 27.0 },
                    { word: "for", start: 27.0, end: 27.33 },
                    { word: "just", start: 27.33, end: 27.67 },
                    { word: "99\u00a2.", start: 27.67, end: 28.0 }
                ]
            },
            {
                start: 28.0,
                end: 34.59,
                speaker: 'both',
                text: "Stop searching, start creating. Grab your pass at realunstoppable.store/medixly today!",
                words: [
                    { word: "Stop", start: 28.0, end: 28.66 },
                    { word: "searching,", start: 28.66, end: 29.32 },
                    { word: "start", start: 29.32, end: 29.98 },
                    { word: "creating.", start: 29.98, end: 30.64 },
                    { word: "Grab", start: 30.64, end: 31.3 },
                    { word: "your", start: 31.3, end: 31.95 },
                    { word: "pass", start: 31.95, end: 32.61 },
                    { word: "at", start: 32.61, end: 33.27 },
                    { word: "realunstoppable.store/medixly", start: 33.27, end: 33.93 },
                    { word: "today!", start: 33.93, end: 34.59 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-8',
        trackNumber: 8,
        title: "Ad 8: Workflow Voice Cue (Hey Lexi, Play Some Fire)",
        subtitle: "In-Workflow AI Assistant \u2022 Instant Funk Cue \u2022 99\u00a2 Limited Pass",
        src: '/music/ads/ad-preview-8.mp3',
        duration: 22.91,
        choreography: [
            {
                start: 0.0,
                end: 2.8,
                speaker: 'user',
                text: "Stop searching, start creating!",
                words: [
                    { word: "Stop", start: 0.0, end: 0.7 },
                    { word: "searching,", start: 0.7, end: 1.4 },
                    { word: "start", start: 1.4, end: 2.1 },
                    { word: "creating!", start: 2.1, end: 2.8 }
                ]
            },
            {
                start: 2.8,
                end: 6.4,
                speaker: 'user',
                text: "In fact, right in the middle of your workflow, just say:",
                words: [
                    { word: "In", start: 2.8, end: 3.13 },
                    { word: "fact,", start: 3.13, end: 3.45 },
                    { word: "right", start: 3.45, end: 3.78 },
                    { word: "in", start: 3.78, end: 4.11 },
                    { word: "the", start: 4.11, end: 4.44 },
                    { word: "middle", start: 4.44, end: 4.76 },
                    { word: "of", start: 4.76, end: 5.09 },
                    { word: "your", start: 5.09, end: 5.42 },
                    { word: "workflow,", start: 5.42, end: 5.75 },
                    { word: "just", start: 5.75, end: 6.07 },
                    { word: "say:", start: 6.07, end: 6.4 }
                ]
            },
            {
                start: 6.4,
                end: 8.8,
                speaker: 'user',
                text: "Hey Lexi, play some fire.",
                words: [
                    { word: "Hey", start: 6.4, end: 6.88 },
                    { word: "Lexi,", start: 6.88, end: 7.36 },
                    { word: "play", start: 7.36, end: 7.84 },
                    { word: "some", start: 7.84, end: 8.32 },
                    { word: "fire.", start: 8.32, end: 8.8 }
                ]
            },
            {
                start: 8.8,
                end: 13.2,
                speaker: 'lexi',
                text: "Playing trending funk mix on Medixly, enjoy your session!",
                words: [
                    { word: "Playing", start: 8.8, end: 9.29 },
                    { word: "trending", start: 9.29, end: 9.78 },
                    { word: "funk", start: 9.78, end: 10.27 },
                    { word: "mix", start: 10.27, end: 10.76 },
                    { word: "on", start: 10.76, end: 11.24 },
                    { word: "Medixly,", start: 11.24, end: 11.73 },
                    { word: "enjoy", start: 11.73, end: 12.22 },
                    { word: "your", start: 12.22, end: 12.71 },
                    { word: "session!", start: 12.71, end: 13.2 }
                ]
            },
            {
                start: 13.2,
                end: 18.0,
                speaker: 'both',
                text: "That's total audio control built by editors, for editors.",
                words: [
                    { word: "That's", start: 13.2, end: 13.73 },
                    { word: "total", start: 13.73, end: 14.27 },
                    { word: "audio", start: 14.27, end: 14.8 },
                    { word: "control", start: 14.8, end: 15.33 },
                    { word: "built", start: 15.33, end: 15.87 },
                    { word: "by", start: 15.87, end: 16.4 },
                    { word: "editors,", start: 16.4, end: 16.93 },
                    { word: "for", start: 16.93, end: 17.47 },
                    { word: "editors.", start: 17.47, end: 18.0 }
                ]
            },
            {
                start: 18.0,
                end: 22.91,
                speaker: 'both',
                text: "And for a limited time today, you can lock in your membership for just 99\u00a2.",
                words: [
                    { word: "And", start: 18.0, end: 18.33 },
                    { word: "for", start: 18.33, end: 18.65 },
                    { word: "a", start: 18.65, end: 18.98 },
                    { word: "limited", start: 18.98, end: 19.31 },
                    { word: "time", start: 19.31, end: 19.64 },
                    { word: "today,", start: 19.64, end: 19.96 },
                    { word: "you", start: 19.96, end: 20.29 },
                    { word: "can", start: 20.29, end: 20.62 },
                    { word: "lock", start: 20.62, end: 20.95 },
                    { word: "in", start: 20.95, end: 21.27 },
                    { word: "your", start: 21.27, end: 21.6 },
                    { word: "membership", start: 21.6, end: 21.93 },
                    { word: "for", start: 21.93, end: 22.26 },
                    { word: "just", start: 22.26, end: 22.58 },
                    { word: "99\u00a2.", start: 22.58, end: 22.91 }
                ]
            }
        ]
    },
    {
        id: 'ad-preview-9',
        trackNumber: 9,
        title: "Ad 9: Uninterrupted Vibe (Zero Ads & Hi-Fi)",
        subtitle: "Medixly Premium Pitch \u2022 Crystal Clear High Fidelity \u2022 Uninterrupted Flow",
        src: '/music/ads/ad-preview-9.mp3',
        duration: 31.71,
        choreography: [
            {
                start: 0.0,
                end: 2.5,
                speaker: 'user',
                text: "Tired of the ads? I get it.",
                words: [
                    { word: "Tired", start: 0.0, end: 0.36 },
                    { word: "of", start: 0.36, end: 0.71 },
                    { word: "the", start: 0.71, end: 1.07 },
                    { word: "ads?", start: 1.07, end: 1.43 },
                    { word: "I", start: 1.43, end: 1.79 },
                    { word: "get", start: 1.79, end: 2.14 },
                    { word: "it.", start: 2.14, end: 2.5 }
                ]
            },
            {
                start: 2.5,
                end: 10.2,
                speaker: 'user',
                text: "You are completely lost in the music, the vibe is absolutely perfect, and then boom, another interruption.",
                words: [
                    { word: "You", start: 2.5, end: 2.95 },
                    { word: "are", start: 2.95, end: 3.41 },
                    { word: "completely", start: 3.41, end: 3.86 },
                    { word: "lost", start: 3.86, end: 4.31 },
                    { word: "in", start: 4.31, end: 4.76 },
                    { word: "the", start: 4.76, end: 5.22 },
                    { word: "music,", start: 5.22, end: 5.67 },
                    { word: "the", start: 5.67, end: 6.12 },
                    { word: "vibe", start: 6.12, end: 6.58 },
                    { word: "is", start: 6.58, end: 7.03 },
                    { word: "absolutely", start: 7.03, end: 7.48 },
                    { word: "perfect,", start: 7.48, end: 7.94 },
                    { word: "and", start: 7.94, end: 8.39 },
                    { word: "then", start: 8.39, end: 8.84 },
                    { word: "boom,", start: 8.84, end: 9.29 },
                    { word: "another", start: 9.29, end: 9.75 },
                    { word: "interruption.", start: 9.75, end: 10.2 }
                ]
            },
            {
                start: 10.2,
                end: 14.8,
                speaker: 'lexi',
                text: "It really does not have to be this way.",
                words: [
                    { word: "It", start: 10.2, end: 10.71 },
                    { word: "really", start: 10.71, end: 11.22 },
                    { word: "does", start: 11.22, end: 11.73 },
                    { word: "not", start: 11.73, end: 12.24 },
                    { word: "have", start: 12.24, end: 12.76 },
                    { word: "to", start: 12.76, end: 13.27 },
                    { word: "be", start: 13.27, end: 13.78 },
                    { word: "this", start: 13.78, end: 14.29 },
                    { word: "way.", start: 14.29, end: 14.8 }
                ]
            },
            {
                start: 14.8,
                end: 22.5,
                speaker: 'lexi',
                text: "With Medixly Premium, you get zero ads, unlimited skips, and crystal clear high-fidelity audio. Just you and the music you love, completely uninterrupted.",
                words: [
                    { word: "With", start: 14.8, end: 15.13 },
                    { word: "Medixly", start: 15.13, end: 15.47 },
                    { word: "Premium,", start: 15.47, end: 15.8 },
                    { word: "you", start: 15.8, end: 16.14 },
                    { word: "get", start: 16.14, end: 16.47 },
                    { word: "zero", start: 16.47, end: 16.81 },
                    { word: "ads,", start: 16.81, end: 17.14 },
                    { word: "unlimited", start: 17.14, end: 17.48 },
                    { word: "skips,", start: 17.48, end: 17.81 },
                    { word: "and", start: 17.81, end: 18.15 },
                    { word: "crystal", start: 18.15, end: 18.48 },
                    { word: "clear", start: 18.48, end: 18.82 },
                    { word: "high-fidelity", start: 18.82, end: 19.15 },
                    { word: "audio.", start: 19.15, end: 19.49 },
                    { word: "Just", start: 19.49, end: 19.82 },
                    { word: "you", start: 19.82, end: 20.16 },
                    { word: "and", start: 20.16, end: 20.49 },
                    { word: "the", start: 20.49, end: 20.83 },
                    { word: "music", start: 20.83, end: 21.16 },
                    { word: "you", start: 21.16, end: 21.5 },
                    { word: "love,", start: 21.5, end: 21.83 },
                    { word: "completely", start: 21.83, end: 22.17 },
                    { word: "uninterrupted.", start: 22.17, end: 22.5 }
                ]
            },
            {
                start: 22.5,
                end: 28.0,
                speaker: 'both',
                text: "Click the banner right now to upgrade to Premium.",
                words: [
                    { word: "Click", start: 22.5, end: 23.11 },
                    { word: "the", start: 23.11, end: 23.72 },
                    { word: "banner", start: 23.72, end: 24.33 },
                    { word: "right", start: 24.33, end: 24.94 },
                    { word: "now", start: 24.94, end: 25.56 },
                    { word: "to", start: 25.56, end: 26.17 },
                    { word: "upgrade", start: 26.17, end: 26.78 },
                    { word: "to", start: 26.78, end: 27.39 },
                    { word: "Premium.", start: 27.39, end: 28.0 }
                ]
            },
            {
                start: 28.0,
                end: 31.71,
                speaker: 'both',
                text: "Let us get back to the music.",
                words: [
                    { word: "Let", start: 28.0, end: 28.53 },
                    { word: "us", start: 28.53, end: 29.06 },
                    { word: "get", start: 29.06, end: 29.59 },
                    { word: "back", start: 29.59, end: 30.12 },
                    { word: "to", start: 30.12, end: 30.65 },
                    { word: "the", start: 30.65, end: 31.18 },
                    { word: "music.", start: 31.18, end: 31.71 }
                ]
            }
        ]
    }
];

export const MASTER_SHOWCASE_TRACK = {
    id: 'ad-preview-showcase',
    trackNumber: 0,
    title: 'Full Feature Showcase (Master 57s Ad)',
    subtitle: 'Choreographed Timeline • Solo-Speaker Stage • Auto Backgrounds & Synced Lyrics',
    src: '/music/ads/ad-preview-showcase.mp3',
    duration: 57.0,
    isMasterShowcase: true,
    choreography: [
        // Phase 1: Hook & AI Queueing (0:00 – 0:06)
        // Background: Starts on Purple DTS Grid (0:00-0:01), then Pink Creator Aura / Medixly Waves (0:01-0:06)
        {
            start: 0.0,
            end: 1.0,
            speaker: 'user',
            background: 'dts-purple-grid',
            featureBadge: '✨ Voice Command: AI Queueing',
            text: 'Now, with Medixly, you can!',
            words: [
                { word: 'Now,', start: 0.1, end: 0.7 },
                { word: 'with', start: 0.7, end: 0.95 }
            ]
        },
        {
            start: 1.0,
            end: 6.0,
            speaker: 'user',
            background: 'pink',
            featureBadge: '✨ Voice Command: AI Queueing',
            text: 'Now, with Medixly, you can! Hey Lexi, play some fire.',
            words: [
                { word: 'Medixly,', start: 1.0, end: 1.8 },
                { word: 'you', start: 1.85, end: 2.1 },
                { word: 'can!', start: 2.1, end: 2.7 },
                { word: 'Hey', start: 3.2, end: 3.55 },
                { word: 'Lexi,', start: 3.55, end: 4.1 },
                { word: 'play', start: 4.4, end: 4.8 },
                { word: 'some', start: 4.8, end: 5.1 },
                { word: 'fire.', start: 5.1, end: 5.8 }
            ]
        },
        // Phase 2: Lexi Response (0:06 – 0:09)
        // Background: Crossfades immediately to Lexi Intelligence Blue
        // Stage: Pink Blob slides out left; Blue Lexi Blob slides in from right to center stage
        {
            start: 6.0,
            end: 9.6,
            speaker: 'lexi',
            background: 'lexi-blue',
            statusLabel: '🎛️ Lexi Mixer: Active',
            featureBadge: '🎛️ Lexi Mixer: Active',
            text: "Queueing up global hits on Medixly. Let's go.",
            words: [
                { word: 'Queueing', start: 6.15, end: 6.7 },
                { word: 'up', start: 6.7, end: 6.95 },
                { word: 'global', start: 6.95, end: 7.45 },
                { word: 'hits', start: 7.45, end: 7.85 },
                { word: 'on', start: 7.85, end: 8.1 },
                { word: 'Medixly.', start: 8.1, end: 8.7 },
                { word: "Let's", start: 8.85, end: 9.2 },
                { word: 'go.', start: 9.2, end: 9.6 }
            ]
        },
        // Phase 3: Beat Drop & Blob Visualizer Showcase 1 (0:10 – 0:16)
        // Background: Switches to Dreams TimeSkip Purple Grid
        // Stage (9.6 - 14.2): Medixly Reactive Visualizer Blob dead-center bouncing heavily to bass!
        {
            start: 9.6,
            end: 14.2,
            speaker: 'visualizer',
            blobStyle: 'neon-purple',
            background: 'dts-purple-grid',
            featureBadge: '🎵 Beat-Reactive Visualizer: 124 BPM Sub-Bass',
            text: '♫ [Beat Drop: 124 BPM Sub-Bass Visualizer] ♫',
            words: [
                { word: '♫', start: 9.6, end: 10.5 },
                { word: '[Bass', start: 10.5, end: 11.5 },
                { word: 'Drop', start: 11.5, end: 12.5 },
                { word: 'Visualizer]', start: 12.5, end: 13.5 },
                { word: '♫', start: 13.5, end: 14.2 }
            ]
        },
        // Transition (0:14 – 0:16): Morph back to solo Pink User Blob with caption
        {
            start: 14.2,
            end: 16.8,
            speaker: 'user',
            background: 'dts-purple-grid',
            featureBadge: '✨ Medixly Voice Control',
            text: 'Oh, and we also have this...',
            words: [
                { word: 'Oh,', start: 14.3, end: 14.7 },
                { word: 'and', start: 14.7, end: 14.95 },
                { word: 'we', start: 14.95, end: 15.2 },
                { word: 'also', start: 15.2, end: 15.6 },
                { word: 'have', start: 15.6, end: 15.9 },
                { word: 'this...', start: 15.9, end: 16.6 }
            ]
        },
        // Phase 4: "Viral Skip" Feature Demo (0:17 – 0:21)
        // Stage (0:17 – 0:19): Solo Pink User Blob centered on Medixly Signature Waves
        {
            start: 16.8,
            end: 19.2,
            speaker: 'user',
            background: 'waves',
            featureBadge: '⚡ Viral Skip: Jump to Peak Drop',
            text: 'Hey Lexi, skip to the good part.',
            words: [
                { word: 'Hey', start: 16.9, end: 17.25 },
                { word: 'Lexi,', start: 17.25, end: 17.7 },
                { word: 'skip', start: 17.9, end: 18.25 },
                { word: 'to', start: 18.25, end: 18.45 },
                { word: 'the', start: 18.45, end: 18.65 },
                { word: 'good', start: 18.65, end: 18.9 },
                { word: 'part.', start: 18.9, end: 19.2 }
            ]
        },
        // Stage (0:19 – 0:21): Pink slides left, Blue Lexi slides in on Lexi Blue
        {
            start: 19.2,
            end: 21.8,
            speaker: 'lexi',
            background: 'lexi-blue',
            statusLabel: '🎛️ Lexi Mixer: Active',
            featureBadge: '⚡ Viral Skip: Instant Crossfade',
            text: "I got you twin, let's go.",
            words: [
                { word: 'I', start: 19.35, end: 19.6 },
                { word: 'got', start: 19.6, end: 19.85 },
                { word: 'you,', start: 19.85, end: 20.1 },
                { word: 'twin.', start: 20.1, end: 20.65 },
                { word: "Let's", start: 20.8, end: 21.15 },
                { word: 'go.', start: 21.15, end: 21.6 }
            ]
        },
        // Phase 5: Main Miami Track Drop & Synced Lyrics Showcase (0:22 – 0:28)
        // Background: Purple DTS Grid + Medixly Waves Hybrid pulsing to the beat
        // Stage: Active Audio-Reactive Blob centered pulsing to Pitbull Miami vocal drop
        {
            start: 21.8,
            end: 28.8,
            speaker: 'visualizer',
            blobStyle: 'miami-cyan',
            background: 'dts-waves-hybrid',
            featureBadge: '🌊 Synced Lyrics & Waveform Engine',
            text: "Ey, I love Miami! What happens in Miami never happened (Let's do it!). Dale!",
            words: [
                { word: 'Ey,', start: 22.0, end: 22.45 },
                { word: 'I', start: 22.45, end: 22.8 },
                { word: 'love', start: 22.8, end: 23.25 },
                { word: 'Miami!', start: 23.25, end: 24.2 },
                { word: 'What', start: 24.35, end: 24.75 },
                { word: 'happens', start: 24.75, end: 25.25 },
                { word: 'in', start: 25.25, end: 25.55 },
                { word: 'Miami,', start: 25.55, end: 26.15 },
                { word: 'never', start: 26.15, end: 26.65 },
                { word: 'happened', start: 26.65, end: 27.15 },
                { word: "(Let's", start: 27.15, end: 27.55 },
                { word: 'do it!)', start: 27.55, end: 27.95 },
                { word: 'Dale!', start: 28.0, end: 28.75 }
            ]
        },
        // Phase 6: Promotional Pitch (0:29 – 0:43)
        // Background: Dark Minimalist Studio with subtle flowing Pink Waves
        // Stage: Solo Pink Narrator Blob centered on stage
        {
            start: 28.8,
            end: 43.8,
            speaker: 'user',
            background: 'dark-pink-waves',
            featureBadge: '🏷️ $0.99 Daily Price Drop • Sound Elevated',
            text: "We're dropping prices starting at just 99 cents today! But watch out, it goes up a dollar every single day. Lock it in before time runs out. Head to realunstoppable.store/medixly right now. Sound, elevated.",
            words: [
                { word: "We're", start: 28.9, end: 29.25 },
                { word: 'dropping', start: 29.25, end: 29.75 },
                { word: 'prices', start: 29.75, end: 30.3 },
                { word: 'starting', start: 30.3, end: 30.8 },
                { word: 'at', start: 30.8, end: 31.0 },
                { word: 'just', start: 31.0, end: 31.4 },
                { word: '99¢', start: 31.4, end: 32.1 },
                { word: 'today!', start: 32.1, end: 32.8 },
                { word: 'But', start: 32.9, end: 33.1 },
                { word: 'watch', start: 33.1, end: 33.4 },
                { word: 'out,', start: 33.4, end: 33.75 },
                { word: 'it', start: 33.75, end: 33.95 },
                { word: 'goes', start: 33.95, end: 34.3 },
                { word: 'up', start: 34.3, end: 34.55 },
                { word: 'a', start: 34.55, end: 34.65 },
                { word: 'dollar', start: 34.65, end: 35.1 },
                { word: 'every', start: 35.1, end: 35.45 },
                { word: 'single', start: 35.45, end: 35.85 },
                { word: 'day.', start: 35.85, end: 36.3 },
                { word: 'Lock', start: 36.4, end: 36.75 },
                { word: 'it', start: 36.75, end: 36.95 },
                { word: 'in', start: 36.95, end: 37.2 },
                { word: 'before', start: 37.2, end: 37.6 },
                { word: 'time', start: 37.6, end: 37.95 },
                { word: 'runs', start: 37.95, end: 38.25 },
                { word: 'out.', start: 38.25, end: 38.5 },
                { word: 'Head', start: 38.6, end: 38.95 },
                { word: 'to', start: 38.95, end: 39.15 },
                { word: 'realunstoppable.store/medixly', start: 39.15, end: 41.4 },
                { word: 'right', start: 41.4, end: 41.75 },
                { word: 'now.', start: 41.75, end: 42.2 },
                { word: 'Sound,', start: 42.4, end: 42.95 },
                { word: 'elevated.', start: 42.95, end: 43.7 }
            ]
        },
        // Phase 7: Outro & Full Editor Showcase (0:44 – 0:57)
        // Background: Cycles through Purple DTS Grid (43.8 – 50.0) and Medixly Waves (50.0 – 57.0)
        // Stage: Active blob pulsing to music outro with clean branding
        {
            start: 43.8,
            end: 50.0,
            speaker: 'visualizer',
            blobStyle: 'neon-purple',
            background: 'dts-purple-grid',
            featureBadge: '🚀 realunstoppable.store/medixly',
            text: '♫ [Outro Beat • Dreams TimeSkip Purple Grid] ♫',
            words: [
                { word: '♫', start: 43.8, end: 45.0 },
                { word: 'realunstoppable.store/medixly', start: 45.0, end: 48.5 },
                { word: '♫', start: 48.5, end: 50.0 }
            ]
        },
        {
            start: 50.0,
            end: 57.0,
            speaker: 'visualizer',
            blobStyle: 'waves-cyan',
            background: 'waves',
            featureBadge: '🚀 realunstoppable.store/medixly',
            text: '♫ [Sound, Elevated • RealUnstoppable Store] ♫',
            words: [
                { word: '♫', start: 50.0, end: 52.0 },
                { word: 'Sound,', start: 52.0, end: 53.5 },
                { word: 'Elevated.', start: 53.5, end: 55.5 },
                { word: '♫', start: 55.5, end: 57.0 }
            ]
        }
    ]
};

export const SHOWCASE_TRACK = MASTER_SHOWCASE_TRACK;

export function getTrackById(id) {
    if (id === 'showcase' || id === 'ad-preview-showcase' || id === 'master' || id === 'full-showcase' || id === 0 || id === '0') {
        return MASTER_SHOWCASE_TRACK;
    }
    return AD_TRACKS.find(t => t.id === id || String(t.trackNumber) === String(id)) || AD_TRACKS[0];
}
