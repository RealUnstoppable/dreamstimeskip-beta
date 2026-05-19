import { jest } from '@jest/globals';
import { updateDoc, setDoc, arrayUnion, arrayRemove, doc } from './__mocks__/firebase-firestore.js';

document.body.innerHTML = `
    <div class="nav-pill" id="nav-home"></div>
    <div class="nav-pill" id="nav-favorites"></div>
    <div class="nav-pill" id="nav-playlists"></div>
    <div id="view-home"></div>
    <div id="view-playlist" style="display:none;"></div>
    <div id="playlist-title"></div>
    <div id="playlist-desc"></div>
    <button id="playlist-play-btn"></button>
    <div id="container-jump-back-in"></div>
    <div id="container-recommended"></div>
    <div id="container-tiktoks"></div>
    <div id="container-playlists"></div>
    <table class="song-list"><tbody id="song-list-body"></tbody></table>
    <audio id="audio-player"></audio>
    <button id="play-pause-btn"><span class="play-icon"></span><span class="pause-icon"></span></button>
    <button id="prev-btn"></button>
    <button id="next-btn"></button>
    <button id="shuffle-btn"></button>
    <button id="repeat-btn"></button>
    <div class="progress-bar"><div class="progress"></div></div>
    <div class="current-time"></div>
    <div class="total-time"></div>
    <input type="range" class="volume-slider">
    <div id="player-song-title"></div>
    <div id="player-song-artist"></div>
    <div id="player-album-art"></div>
    <button id="player-like-btn"></button>
    <button id="back-to-home"></button>
    <div id="greeting"></div>
`;

window.alert = jest.fn();

import '../js/harmonytunes.js';

describe('toggleFavorite unit tests', () => {
    beforeAll(() => {
        // Trigger DOMContentLoaded so harmonytunes initializes
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        window.alert.mockClear();
    });

    it('alerts when not logged in', async () => {
        window.__setCurrentUser(null);
        await window.toggleFavorite('deorc-decuple');
        expect(window.alert).toHaveBeenCalledWith("Please sign in to save favorites.");
    });

    it('adds a song to favorites when logged in and song is not in favorites', async () => {
        window.__setCurrentUser({ uid: 'user123' });
        window.__setUserFavorites([]);
        window.__setCurrentQueue([{id: 'deorc-decuple'}]);
        window.__setCurrentSongIndex(0);

        doc.mockReturnValue('mockDocRef');

        await window.toggleFavorite('deorc-decuple');

        expect(updateDoc).toHaveBeenCalledWith('mockDocRef', { musicFavorites: arrayUnion('deorc-decuple') });
        expect(window.__getUserFavorites()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'deorc-decuple' })
            ])
        );
    });

    it('removes a song from favorites when logged in and song is already in favorites', async () => {
        window.__setCurrentUser({ uid: 'user123' });
        window.__setUserFavorites([{ id: 'deorc-decuple', title: 'Deorc Decuple' }]);
        window.__setCurrentQueue([{id: 'deorc-decuple'}]);
        window.__setCurrentSongIndex(0);

        doc.mockReturnValue('mockDocRef');

        await window.toggleFavorite('deorc-decuple');

        expect(updateDoc).toHaveBeenCalledWith('mockDocRef', { musicFavorites: arrayRemove('deorc-decuple') });
        expect(window.__getUserFavorites()).toEqual([]);
    });

    it('creates a user document if it does not exist (not-found error)', async () => {
        window.__setCurrentUser({ uid: 'user123' });
        window.__setUserFavorites([]);
        window.__setCurrentQueue([{id: 'deorc-decuple'}]);
        window.__setCurrentSongIndex(0);

        doc.mockReturnValue('mockDocRef');
        updateDoc.mockRejectedValue({ code: 'not-found' });

        await window.toggleFavorite('deorc-decuple');

        expect(setDoc).toHaveBeenCalledWith('mockDocRef', { musicFavorites: ['deorc-decuple'] }, { merge: true });
        expect(window.__getUserFavorites()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'deorc-decuple' })
            ])
        );
    });
});
