// Set up minimal DOM before requiring the script
document.body.innerHTML = `
    <div id="view-home"></div>
    <div id="view-playlist"></div>
    <div id="container-jump-back-in"></div>
    <div id="container-recommended"></div>
    <div id="container-tiktoks"></div>
    <div id="container-playlists"></div>
    <div id="song-list-body"></div>
    <div id="playlist-title"></div>
    <div id="playlist-desc"></div>
    <button id="playlist-play-btn"></button>
    <button id="back-to-home"></button>
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
    <img id="player-album-art">
    <button id="player-like-btn"></button>
    <div id="greeting"></div>
`;

// Try requiring the script
require('../js/harmonytunes.js');

// Dispatch DOMContentLoaded so the script actually runs its init block
const event = new Event('DOMContentLoaded');
document.dispatchEvent(event);

describe('loadPlaylistView error handling', () => {
  beforeEach(() => {
    // Reset the UI before each test
    document.getElementById('playlist-title').textContent = '';
    document.getElementById('playlist-desc').textContent = '';
    document.getElementById('song-list-body').innerHTML = '';
  });

  it('should handle null/undefined type by defaulting to Main Library', () => {
    window.loadPlaylistView(null);
    expect(document.getElementById('playlist-title').textContent).toBe('All Available Tracks');
  });

  it('should gracefully handle empty or missing favorites', () => {
    window.loadPlaylistView('favorites');
    expect(document.getElementById('playlist-title').textContent).toBe('Liked Songs');
    expect(document.getElementById('song-list-body').innerHTML).toContain('No songs found.');
  });

  it('should display error state if data fetching throws an error', () => {
    const descEl = document.getElementById('playlist-desc');
    const originalDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');

    // Mock textContent to throw error
    Object.defineProperty(descEl, 'textContent', {
        get() { return ''; },
        set(value) { throw new Error('Simulated data fetching error'); },
        configurable: true
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    window.loadPlaylistView('main');

    expect(document.getElementById('playlist-title').textContent).toBe('Error');
    expect(document.getElementById('song-list-body').innerHTML).toContain('Failed to load playlist.');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();

    // Restore the property
    if (originalDescriptor) {
        Object.defineProperty(Node.prototype, 'textContent', originalDescriptor);
    } else {
        delete descEl.textContent;
    }
  });
});
