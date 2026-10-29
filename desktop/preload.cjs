const { contextBridge, ipcRenderer } = require('electron');

/**
 * Medixly Desktop IPC Bridge
 * Exposes a strictly typed, memory-leak-safe API to the web renderer.
 */
contextBridge.exposeInMainWorld('medixlyDesktop', {
  isDesktop: true,
  platform: process.platform,

  /**
   * Broadcast current track details to macOS (Control Center, Now Playing, Menu Bar Tray, TouchBar)
   * @param {Object} track - { title: string, artist: string, art: string, isPlaying: boolean, duration: number }
   */
  sendTrackUpdate: (track) => {
    if (track && typeof track === 'object') {
      ipcRenderer.send('medixly:track-update', {
        title: String(track.title || 'Unknown Title'),
        artist: String(track.artist || 'Unknown Artist'),
        art: track.art ? String(track.art) : '',
        isPlaying: Boolean(track.isPlaying),
        duration: Number(track.duration || 0),
        currentTime: Number(track.currentTime || 0)
      });
    }
  },

  /**
   * Sync playback state (playing vs paused)
   * @param {Object} state - { isPlaying: boolean }
   */
  sendPlaybackState: (state) => {
    if (state && typeof state.isPlaying === 'boolean') {
      ipcRenderer.send('medixly:playback-state', { isPlaying: state.isPlaying });
    }
  },

  /**
   * Register a listener for hardware media keys (Play/Pause, Next, Prev) & Menu Bar Tray clicks.
   * Returns a clean unsubscribe function to guarantee ZERO memory leaks.
   * @param {Function} callback - ({ command: 'play-pause' | 'next' | 'prev' | 'stop' }) => void
   * @returns {Function} cleanup callback
   */
  onMediaCommand: (callback) => {
    if (typeof callback !== 'function') return () => {};

    const subscription = (event, payload) => {
      callback(payload);
    };

    ipcRenderer.on('medixly:media-command', subscription);

    // Return unsubscriber
    return () => {
      ipcRenderer.removeListener('medixly:media-command', subscription);
    };
  },

  /**
   * Open Stripe checkout or external links in user's default browser (Safari, Chrome, etc.)
   * @param {string} url
   */
  openExternal: (url) => {
    if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
      return ipcRenderer.invoke('medixly:open-external', url);
    }
    return Promise.reject(new Error('Invalid URL protocol. Only http(s) allowed.'));
  },

  /**
   * Window controls (for custom Mac titlebar buttons if desired)
   */
  windowMinimize: () => ipcRenderer.send('medixly:window-minimize'),
  windowMaximize: () => ipcRenderer.send('medixly:window-maximize'),
  windowClose: () => ipcRenderer.send('medixly:window-close'),

  /**
   * Get application metadata
   */
  getAppInfo: () => ipcRenderer.invoke('medixly:get-app-info')
});
