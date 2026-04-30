import { test } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html><body>
    <div id="view-home"></div>
    <div id="view-playlist"></div>
    <button id="back-to-home"></button>
    <div id="container-jump-back-in"></div>
    <div id="container-recommended"></div>
    <div id="container-tiktoks"></div>
    <div id="container-playlists"></div>
    <div id="song-list-body"></div>
    <div id="playlist-title"></div>
    <div id="playlist-desc"></div>
    <div id="playlist-play-btn"></div>
    <audio id="audio-player"></audio>
    <div id="play-pause-btn"><div class="play-icon"></div><div class="pause-icon"></div></div>
    <div id="prev-btn"></div>
    <div id="next-btn"></div>
    <div id="shuffle-btn"></div>
    <div id="repeat-btn"></div>
    <div class="progress-bar"></div>
    <div class="progress"></div>
    <div class="current-time"></div>
    <div class="total-time"></div>
    <div class="volume-slider"></div>
    <div id="player-song-title"></div>
    <div id="player-song-artist"></div>
    <div id="player-album-art"></div>
    <div id="player-like-btn"></div>
    <div id="greeting"></div>
</body></html>`, { url: "http://localhost" });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', {
    value: dom.window.navigator,
    writable: true,
    configurable: true
});

const { formatTime, createSongCard } = await import('./harmonytunes.js');

test('formatTime correctly formats normal values', () => {
    assert.strictEqual(formatTime(65), '1:05');
    assert.strictEqual(formatTime(125), '2:05');
    assert.strictEqual(formatTime(10), '0:10');
});

test('formatTime handles edge cases', () => {
    assert.strictEqual(formatTime(0), '0:00');
    assert.strictEqual(formatTime(NaN), '0:00');
});

test('createSongCard generates correct HTML based on song properties', () => {
    const mockSong = {
        id: 'test-id',
        art: '/images/test.jpg',
        title: 'Test Title',
        artist: 'Test Artist'
    };

    const expectedHTML = `
        <div class="music-card" data-song-id="test-id" onclick="playSongById('test-id')">
            <div class="card-img-wrapper">
                <img src="/images/test.jpg" alt="Test Title">
                <button class="card-play-btn">▶</button>
            </div>
            <div class="card-title">Test Title</div>
            <div class="card-desc">Test Artist</div>
        </div>
    `;

    assert.strictEqual(createSongCard(mockSong), expectedHTML);
});
