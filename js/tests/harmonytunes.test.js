/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('loadSong bounds checking', () => {
    beforeEach(() => {
        // Mock elements that harmonytunes.js interacts with
        document.body.innerHTML = `
            <audio id="audio-player"></audio>
            <div id="player-song-title"></div>
            <div id="player-song-artist"></div>
            <img id="player-album-art" />
            <button id="player-like-btn"></button>
            <div id="view-playlist" style="display: none;"></div>
            <div id="playlist-title"></div>
            <button id="back-to-home"></button>
            <div id="container-jump-back-in"></div>
            <div id="container-recommended"></div>
            <div id="song-list-body"></div>
            <button id="play-pause-btn"></button>
            <button id="next-btn"></button>
            <button id="prev-btn"></button>
            <div id="progress"></div>
            <div id="current-time"></div>
            <div id="total-time"></div>
            <div id="progress-bar"></div>
            <button id="shuffle-btn"></button>
            <button id="repeat-btn"><span class="repeat-indicator"></span></button>
            <input id="volume-slider" type="range" />
            <div id="greeting"></div>
            <button id="view-home"></button>
            <div id="play-icon"></div>
            <div id="pause-icon"></div>
        `;

        window.auth = {};
        window.db = {};
        window.onAuthStateChanged = () => {};

        const scriptContent = fs.readFileSync(path.resolve(__dirname, '../harmonytunes.js'), 'utf-8');

        let modifiedScript = scriptContent
            .replace(/import { auth, db } from '\.\/auth\.js';/g, '')
            .replace(/import { onAuthStateChanged } from "https:\/\/www\.gstatic\.com\/firebasejs\/9\.15\.0\/firebase-auth\.js";/g, '')
            .replace(/import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https:\/\/www\.gstatic\.com\/firebasejs\/9\.15\.0\/firebase-firestore\.js";/g, 'const doc = () => {}; const getDoc = () => ({ exists: () => false }); const setDoc = () => {}; const updateDoc = () => {}; const arrayUnion = () => {}; const arrayRemove = () => {};');

        modifiedScript = modifiedScript.replace(/let currentQueue = \[\];/, 'window.testGetCurrentQueue = () => currentQueue; window.testSetCurrentQueue = (q) => { currentQueue = q; }; let currentQueue = [];');
        modifiedScript = modifiedScript.replace(/function loadSong\(index\)\s*{/, 'window.testLoadSong = function loadSong(index) {');

        eval(modifiedScript);

        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    test('should load song when index is valid (0 to length - 1)', () => {
        const testQueue = [
            { id: '1', title: 'Song 1', artist: 'Artist 1', src: 'song1.mp3', art: 'art1.jpg' },
            { id: '2', title: 'Song 2', artist: 'Artist 2', src: 'song2.mp3', art: 'art2.jpg' },
            { id: '3', title: 'Song 3', artist: 'Artist 3', src: 'song3.mp3', art: 'art3.jpg' }
        ];
        window.testSetCurrentQueue(testQueue);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.duration = 100;

        window.testLoadSong(0);
        expect(audioPlayer.src).toContain('song1.mp3');
        expect(document.getElementById('player-song-title').textContent).toBe('Song 1');
    });

    test('should early return and not modify state when index is negative', () => {
        const testQueue = [{ id: '1', title: 'Song 1', artist: 'Artist 1', src: 'song1.mp3', art: 'art1.jpg' }];
        window.testSetCurrentQueue(testQueue);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = 'http://localhost/initial.mp3';
        document.getElementById('player-song-title').textContent = 'Initial Title';

        window.testLoadSong(-1);

        expect(audioPlayer.src).toBe('http://localhost/initial.mp3');
        expect(document.getElementById('player-song-title').textContent).toBe('Initial Title');
    });

    test('should early return and not modify state when index is equal to queue length', () => {
        const testQueue = [{ id: '1', title: 'Song 1', artist: 'Artist 1', src: 'song1.mp3', art: 'art1.jpg' }];
        window.testSetCurrentQueue(testQueue);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = 'http://localhost/initial.mp3';

        window.testLoadSong(1);

        expect(audioPlayer.src).toBe('http://localhost/initial.mp3');
    });

    test('should early return and not modify state when index is greater than queue length', () => {
        const testQueue = [{ id: '1', title: 'Song 1', artist: 'Artist 1', src: 'song1.mp3', art: 'art1.jpg' }];
        window.testSetCurrentQueue(testQueue);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = 'http://localhost/initial.mp3';

        window.testLoadSong(5);

        expect(audioPlayer.src).toBe('http://localhost/initial.mp3');
    });

    test('should handle empty queue correctly', () => {
        window.testSetCurrentQueue([]);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = 'http://localhost/initial.mp3';

        window.testLoadSong(0);
        expect(audioPlayer.src).toBe('http://localhost/initial.mp3');
    });
});
