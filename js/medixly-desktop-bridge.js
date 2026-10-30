/**
 * Medixly Desktop Integration Bridge
 * Connects the web player to macOS native capabilities (Media keys, Control Center, Menu bar, TouchBar)
 */

class MedixlyDesktopBridge {
  constructor() {
    this.isDesktop = typeof window !== 'undefined' && Boolean(window.medixlyDesktop);
    this.cleanupListeners = [];
    this.appInfo = null;
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

    // Fetch and bind application version
    if (typeof window.medixlyDesktop.getAppInfo === 'function') {
      window.medixlyDesktop.getAppInfo().then(info => {
        this.appInfo = info;
        this.updateVersionUI(info);
      }).catch(err => {
        console.warn('[Medixly Desktop] Failed to fetch app metadata:', err);
      });
    }

    // Listen for live update notifications from main process
    if (typeof window.medixlyDesktop.onUpdateStatus === 'function') {
      const unsubUpdate = window.medixlyDesktop.onUpdateStatus((status) => {
        this.handleUpdateStatus(status);
      });
      if (typeof unsubUpdate === 'function') {
        this.cleanupListeners.push(unsubUpdate);
      }
    }

    // Wire DOM check-for-update triggers if present
    this.bindDOMUpdateTriggers();
  }

  bindDOMUpdateTriggers() {
    if (typeof document === 'undefined') return;

    const bindTriggers = () => {
      const updateBtn = document.getElementById('medixly-check-update-btn');
      if (updateBtn && !updateBtn.dataset.bound) {
        updateBtn.dataset.bound = 'true';
        updateBtn.addEventListener('click', () => {
          this.checkForUpdates(true);
        });
      }

      const desktopBadgeBtn = document.getElementById('desktop-badge-update-btn');
      if (desktopBadgeBtn && !desktopBadgeBtn.dataset.bound) {
        desktopBadgeBtn.dataset.bound = 'true';
        desktopBadgeBtn.addEventListener('click', () => {
          this.checkForUpdates(true);
        });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindTriggers);
    } else {
      bindTriggers();
    }
  }

  updateVersionUI(info) {
    if (!info || !info.version) return;
    const versionStr = `v${info.version}`;

    const versionTags = document.querySelectorAll('#medixly-app-version-tag, #desktop-badge-text, [data-desktop-version]');
    versionTags.forEach(el => {
      el.textContent = versionStr;
    });

    const desktopBadge = document.getElementById('desktop-version-badge');
    if (desktopBadge) {
      desktopBadge.style.display = 'inline-flex';
    }

    const versionBox = document.getElementById('medixly-app-version-box');
    if (versionBox) {
      versionBox.classList.remove('hidden');
    }
  }

  handleUpdateStatus(status) {
    if (!status) return;

    const statusEl = document.getElementById('medixly-update-status');
    const msgEl = document.getElementById('medixly-update-message');
    const badgeText = document.getElementById('desktop-badge-text');
    const desktopBadge = document.getElementById('desktop-version-badge');

    if (status.updateAvailable) {
      if (statusEl) {
        statusEl.textContent = `Update Available (v${status.latestVersion})`;
        statusEl.className = 'medixly-update-status has-update';
      }
      if (msgEl) {
        msgEl.textContent = status.message;
        msgEl.className = 'medixly-update-message has-update';
        msgEl.classList.remove('hidden');
      }
      if (badgeText) {
        badgeText.textContent = `Update: v${status.latestVersion}`;
      }
      if (desktopBadge) {
        desktopBadge.classList.add('has-update');
      }
    } else {
      if (statusEl) {
        statusEl.textContent = `Up to date (v${status.currentVersion})`;
        statusEl.className = 'medixly-update-status up-to-date';
      }
      if (msgEl) {
        msgEl.textContent = status.message;
        msgEl.className = 'medixly-update-message up-to-date';
        msgEl.classList.remove('hidden');
      }
      if (desktopBadge) {
        desktopBadge.classList.remove('has-update');
      }
    }
  }

  async checkForUpdates(interactive = true) {
    if (!this.isDesktop || !window.medixlyDesktop || !window.medixlyDesktop.checkForUpdates) {
      return null;
    }

    const updateBtn = document.getElementById('medixly-check-update-btn');
    const origText = updateBtn ? updateBtn.innerHTML : '';
    if (updateBtn) {
      updateBtn.disabled = true;
      updateBtn.innerHTML = '<span>Checking...</span>';
    }

    try {
      const result = await window.medixlyDesktop.checkForUpdates({ interactive });
      this.handleUpdateStatus(result);
      return result;
    } catch (err) {
      console.warn('[Medixly Desktop] Check for updates failed:', err);
    } finally {
      if (updateBtn) {
        updateBtn.disabled = false;
        updateBtn.innerHTML = origText;
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
