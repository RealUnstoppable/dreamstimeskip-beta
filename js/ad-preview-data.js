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
];

export function getTrackById(id) {
    return AD_TRACKS.find(t => t.id === id || String(t.trackNumber) === String(id)) || AD_TRACKS[0];
}
