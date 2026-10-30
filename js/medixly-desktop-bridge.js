/**
 * Medixly Desktop Integration Bridge
 * Connects the web player to macOS native capabilities (Media keys, Control Center, Menu bar, TouchBar)
 */

class MedixlyDesktopBridge {
  constructor() {
    this.isDesktop = typeof window !== 'undefined' && Boolean(window.medixlyDesktop);
    this.cleanupListeners = [];
    this.init();
  }

  init() {
    if (!this.isDesktop) {
      return;
    }

    console.log('[Medixly Desktop] Native desktop bridge initialized.');
    document.body.classList.add('is-desktop-mac');

    // Subscribe to native media hardware keys & tray actions
    const unsubscribe = window.medixlyDesktop.onMediaCommand(({ command }) => {
      this.handleNativeCommand(command);
    });

    if (typeof unsubscribe === 'function') {
      this.cleanupListeners.push(unsubscribe);
    }

    // Intercept native desktop navigation attempts to external site views
    if (typeof window.medixlyDesktop.onNavigationIntercepted === 'function') {
      const unsubNav = window.medixlyDesktop.onNavigationIntercepted(({ path }) => {
        this.handleNavigationIntercepted(path);
      });
      if (typeof unsubNav === 'function') {
        this.cleanupListeners.push(unsubNav);
      }
    }
  }

  handleNavigationIntercepted(blockedPath) {
    console.log('[Medixly Desktop] Blocked external navigation:', blockedPath);
    const cleanName = (blockedPath || 'Section')
      .replace(/\.html$/i, '')
      .replace(/^\//, '')
      .replace(/-/g, ' ');
    const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    if (typeof window.showDesktopUnavailableToast === 'function') {
      window.showDesktopUnavailableToast(formattedTitle);
    }
    if (typeof window.routeSafelyToMedixlyApp === 'function') {
      window.routeSafelyToMedixlyApp();
    }
  }

  handleNativeCommand(command) {
    console.log('[Medixly Desktop] Native command received:', command);

    switch (command) {
      case 'play-pause': {
        const playBtn = document.getElementById('play-btn') || document.getElementById('fs-play-btn');
        if (playBtn) {
          playBtn.click();
        } else if (typeof window.togglePlayPause === 'function') {
          window.togglePlayPause();
        }
        break;
      }
      case 'next': {
        const nextBtn = document.getElementById('next-btn') || document.getElementById('fs-next-btn');
        if (nextBtn) {
          nextBtn.click();
        } else if (typeof window.nextSong === 'function') {
          window.nextSong();
        }
        break;
      }
      case 'prev': {
        const prevBtn = document.getElementById('prev-btn') || document.getElementById('fs-prev-btn');
        if (prevBtn) {
          prevBtn.click();
        } else if (typeof window.prevSong === 'function') {
          window.prevSong();
        }
        break;
      }
      case 'stop': {
        if (typeof window.pauseSong === 'function') {
          window.pauseSong();
        }
        break;
      }
      default:
        break;
    }
  }

  /**
   * Broadcast current track to macOS
   */
  updateTrack(song, isPlaying = false, duration = 0) {
    if (!this.isDesktop || !song) return;

    // Resolve artwork to absolute URL for macOS Now Playing & Control Center
    let resolvedArt = song.art || '';
    if (resolvedArt && !resolvedArt.startsWith('http://') && !resolvedArt.startsWith('https://')) {
      resolvedArt = `${window.location.origin}/${resolvedArt.replace(/^\//, '')}`;
    }

    window.medixlyDesktop.sendTrackUpdate({
      title: song.title || 'Unknown Title',
      artist: song.artist || 'Unknown Artist',
      art: resolvedArt,
      isPlaying: Boolean(isPlaying),
      duration: duration || 0
    });
  }

  /**
   * Broadcast play/pause state
   */
  updatePlaybackState(isPlaying) {
    if (!this.isDesktop) return;

    window.medixlyDesktop.sendPlaybackState({
      isPlaying: Boolean(isPlaying)
    });
  }

  /**
   * Safe external link opener for Stripe checkout or external auth
   */
  openExternal(url) {
    if (this.isDesktop && window.medixlyDesktop.openExternal) {
      return window.medixlyDesktop.openExternal(url);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  destroy() {
    this.cleanupListeners.forEach(cleanup => {
      try { cleanup(); } catch (_) {}
    });
    this.cleanupListeners = [];
  }
}

export const desktopBridge = new MedixlyDesktopBridge();
if (typeof window !== 'undefined') {
  window.medixlyDesktopBridge = desktopBridge;
}
