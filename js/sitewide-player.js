// js/sitewide-player.js
// Sitewide music engine and Lexi floating mini-playerhead

import { librarySongs, getSongById } from './song-data.js?v=20260920';

const STORAGE_KEY = 'dts_music_state';

// High-quality SVGs for Lexi and playerhead
export const ICONS = {
    cart: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="lexi-glyph-icon"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
    chat: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="lexi-glyph-icon"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
    play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
    next: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>`
};

class SitewideMusicEngine {
    constructor() {
        this.isHarmonyTunesPage = window.location.pathname.includes('harmonytunes.html');
        this.audio = null;
        this.state = this.loadState();
        this.listeners = new Set();
        this.inactivityTimeout = null;

        if (!this.isHarmonyTunesPage) {
            this.initBackgroundAudio();
        }

        this.initLexiOrb();
        this.attachGlobalLinkHandlers();
    }

    loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    songId: parsed.songId || librarySongs[0].id,
                    isPlaying: !!parsed.isPlaying,
                    currentTime: typeof parsed.currentTime === 'number' ? parsed.currentTime : 0,
                    queue: Array.isArray(parsed.queue) && parsed.queue.length ? parsed.queue : librarySongs.map(s => s.id),
                    queueIndex: typeof parsed.queueIndex === 'number' ? parsed.queueIndex : 0,
                    timestamp: parsed.timestamp || Date.now(),
                    volume: typeof parsed.volume === 'number' ? parsed.volume : 0.8,
                    shuffle: !!parsed.shuffle,
                    repeatMode: typeof parsed.repeatMode === 'number' ? parsed.repeatMode : 0,
                    isMixerMode: !!parsed.isMixerMode
                };
            }
        } catch (_) {}

        return {
            songId: librarySongs[0].id,
            isPlaying: false,
            currentTime: 0,
            queue: librarySongs.map(s => s.id),
            queueIndex: 0,
            timestamp: Date.now(),
            volume: 0.8,
            shuffle: false,
            repeatMode: 0,
            isMixerMode: false
        };
    }

    saveState(updates = {}) {
        this.state = { ...this.state, ...updates, timestamp: Date.now() };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (_) {}
        this.notifyListeners();
    }

    getCurrentSong() {
        return getSongById(this.state.songId) || librarySongs[0];
    }

    notifyListeners() {
        this.updateLexiUI();
        this.listeners.forEach(fn => {
            try { fn(this.state); } catch (err) { console.error(err); }
        });
    }

    onStateChange(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    initBackgroundAudio() {
        if (this.isHarmonyTunesPage) return;

        const song = this.getCurrentSong();
        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.src = song.src;
        this.audio.volume = this.state.volume;

        // Calculate elapsed seconds since navigation started
        const elapsed = Math.max(0, (Date.now() - this.state.timestamp) / 1000);

        if (this.state.isPlaying && elapsed < 20) {
            const targetTime = this.state.currentTime + elapsed;
            this.audio.addEventListener('loadedmetadata', () => {
                if (targetTime < this.audio.duration) {
                    this.audio.currentTime = targetTime;
                }
            }, { once: true });

            // Autoplay after user interaction in previous page
            this.audio.play().then(() => {
                this.saveState({ isPlaying: true });
            }).catch(() => {
                // Browser prevented unmuted autoplay without new gesture on this document
                // Lexi will show play state and resume on first click
                const resumeOnInteract = () => {
                    if (this.state.isPlaying && this.audio.paused) {
                        this.audio.play().catch(() => {});
                    }
                    document.removeEventListener('click', resumeOnInteract);
                    document.removeEventListener('keydown', resumeOnInteract);
                };
                document.addEventListener('click', resumeOnInteract, { once: true });
                document.addEventListener('keydown', resumeOnInteract, { once: true });
            });
        }

        // Time updates
        let lastThrottle = 0;
        this.audio.addEventListener('timeupdate', () => {
            const now = Date.now();
            if (now - lastThrottle > 1000) {
                lastThrottle = now;
                this.saveState({ currentTime: this.audio.currentTime });
            }
            this.updateProgressBar();
        });

        // Auto advance to next song when finished
        this.audio.addEventListener('ended', () => {
            this.next();
        });

        // Unload sync
        window.addEventListener('beforeunload', () => {
            if (this.audio) {
                this.saveState({
                    currentTime: this.audio.currentTime,
                    isPlaying: !this.audio.paused
                });
            }
        });

        // Cross-tab / cross-window storage sync
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                const newState = this.loadState();
                this.state = newState;
                if (!this.isHarmonyTunesPage && this.audio) {
                    const activeSong = this.getCurrentSong();
                    if (this.audio.src !== location.origin + activeSong.src && !this.audio.src.endsWith(activeSong.src)) {
                        this.audio.src = activeSong.src;
                        this.audio.currentTime = newState.currentTime;
                    }
                    if (newState.isPlaying && this.audio.paused) {
                        this.audio.play().catch(() => {});
                    } else if (!newState.isPlaying && !this.audio.paused) {
                        this.audio.pause();
                    }
                }
                this.notifyListeners();
            }
        });
    }

    play() {
        if (this.isHarmonyTunesPage) {
            if (window.playSong) window.playSong(this.state.songId);
            return;
        }
        if (!this.audio) this.initBackgroundAudio();
        const song = this.getCurrentSong();
        if (!this.audio.src || (!this.audio.src.endsWith(song.src) && this.audio.src !== song.src)) {
            this.audio.src = song.src;
            this.audio.currentTime = this.state.currentTime || 0;
        }
        this.audio.play().then(() => {
            this.saveState({ isPlaying: true });
        }).catch(err => console.warn("Audio play prevented:", err));
    }

    pause() {
        if (this.isHarmonyTunesPage) {
            if (window.activeAudio) window.activeAudio.pause();
            this.saveState({ isPlaying: false });
            return;
        }
        if (this.audio) {
            this.audio.pause();
            this.saveState({ isPlaying: false, currentTime: this.audio.currentTime });
        }
    }

    togglePlay() {
        if (this.isHarmonyTunesPage) {
            const playPauseBtn = document.getElementById('play-pause-btn');
            if (playPauseBtn) {
                playPauseBtn.click();
            } else {
                this.state.isPlaying ? this.pause() : this.play();
            }
            return;
        }
        if (this.audio && !this.audio.paused) {
            this.pause();
        } else {
            this.play();
        }
    }

    next() {
        let newIdx = this.state.queueIndex + 1;
        if (newIdx >= this.state.queue.length) newIdx = 0;
        const nextSongId = this.state.queue[newIdx] || librarySongs[0].id;

        this.saveState({
            songId: nextSongId,
            queueIndex: newIdx,
            currentTime: 0,
            isPlaying: true
        });

        if (this.isHarmonyTunesPage) {
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) nextBtn.click();
            return;
        }

        const song = getSongById(nextSongId);
        if (song && this.audio) {
            this.audio.src = song.src;
            this.audio.currentTime = 0;
            this.audio.play().catch(() => {});
        }
    }

    prev() {
        let newIdx = this.state.queueIndex - 1;
        if (newIdx < 0) newIdx = this.state.queue.length - 1;
        const prevSongId = this.state.queue[newIdx] || librarySongs[0].id;

        this.saveState({
            songId: prevSongId,
            queueIndex: newIdx,
            currentTime: 0,
            isPlaying: true
        });

        if (this.isHarmonyTunesPage) {
            const prevBtn = document.getElementById('prev-btn');
            if (prevBtn) prevBtn.click();
            return;
        }

        const song = getSongById(prevSongId);
        if (song && this.audio) {
            this.audio.src = song.src;
            this.audio.currentTime = 0;
            this.audio.play().catch(() => {});
        }
    }

    // Attach click handlers to internal site navigation links to guarantee zero-gap transitions
    attachGlobalLinkHandlers() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;
            const url = new URL(link.href, window.location.href);

            // Internal same-origin page navigation
            if (url.origin === window.location.origin && url.pathname.endsWith('.html')) {
                if (this.audio && !this.audio.paused) {
                    this.saveState({
                        currentTime: this.audio.currentTime,
                        isPlaying: true,
                        timestamp: Date.now()
                    });
                }
            }
        });
    }

    // Initialize or bind to Lexi Orb
    initLexiOrb() {
        // On HarmonyTunes page, don't overlay a second orb since it has full playerhead at bottom
        if (this.isHarmonyTunesPage) return;

        let orbWrapper = document.querySelector('.siri-orb-wrapper');
        let orb = document.getElementById('siri-orb');

        if (!orbWrapper || !orb) {
            // Create sitewide Lexi Orb
            orbWrapper = document.createElement('div');
            orbWrapper.className = 'siri-orb-wrapper sitewide-lexi-wrapper';
            orbWrapper.innerHTML = `
                <div id="siri-orb" class="sitewide-lexi-orb" role="button" tabindex="0" aria-label="Lexi Assistant & Player">
                    <span class="orb-text"></span>
                </div>
            `;
            document.body.appendChild(orbWrapper);
            orb = document.getElementById('siri-orb');
        }

        this.renderCollapsedOrb(orb);

        // Bind click/tap on Lexi Orb
        orb.addEventListener('click', (e) => {
            // If click was inside child button, let child handler execute
            if (e.target.closest('#lexi-play-pause-btn') || 
                e.target.closest('#lexi-next-btn') || 
                e.target.closest('#lexi-view-cart') || 
                e.target.closest('#lexi-ask') ||
                e.target.closest('.lexi-song-info')) {
                return;
            }

            if (!orb.classList.contains('expanded')) {
                this.expandLexi(orb);
            } else {
                this.collapseLexi(orb);
            }
        });

        orb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target === orb) {
                    e.preventDefault();
                    orb.click();
                }
            }
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (orb && orb.classList.contains('expanded') && !orb.contains(e.target)) {
                this.collapseLexi(orb);
            }
        });

        // Listen for global cart updates
        window.addEventListener('cartUpdated', () => this.updateLexiUI());
        window.addEventListener('storage', (e) => {
            if (e.key === 'cartItemCount' || e.key === 'localCart') {
                this.updateLexiUI();
            }
        });

        this.updateLexiUI();
    }

    renderCollapsedOrb(orb) {
        if (!orb) return;
        const isPlaying = this.state.isPlaying;
        const song = this.getCurrentSong();
        let count = 0;
        try {
            count = parseInt(localStorage.getItem('cartItemCount') || '0', 10);
        } catch (_) {}

        orb.innerHTML = `
            <span class="orb-text"></span>
            <div class="lexi-orb-disc ${isPlaying ? 'spinning' : 'paused'}">
                <img src="${song.art}" alt="Now Playing" class="lexi-orb-disc-art">
                <div class="lexi-orb-disc-grooves"></div>
            </div>
            <div class="lexi-soundwave-badge" style="display: ${isPlaying ? 'flex' : 'none'};">
                <span></span><span></span><span></span>
            </div>
            <div id="lexi-cart-badge" class="lexi-cart-badge ${count > 0 ? '' : 'hidden'}">${count}</div>
        `;
    }

    expandLexi(orb) {
        orb.classList.remove('closing');
        orb.classList.add('expanded');
        orb.classList.add('lexi-player-expanded');

        const song = this.getCurrentSong();
        const isPlaying = this.state.isPlaying;

        // If nothing is playing, the song feature disappears! Only Cart and Chat.
        if (!isPlaying) {
            orb.classList.add('idle-mode');
            orb.innerHTML = `
                <div class="lexi-expanded-panel">
                    <!-- Action Glyphs: Ask Lexi & View Cart -->
                    <div class="lexi-actions-row">
                        <button id="lexi-ask" class="lexi-action-pill" aria-label="Ask Lexi">
                            ${ICONS.chat}
                            <span>Ask Lexi</span>
                        </button>
                        <button id="lexi-view-cart" class="lexi-action-pill" aria-label="View Cart">
                            ${ICONS.cart}
                            <span>View Cart</span>
                            <span id="lexi-pill-cart-count" class="lexi-pill-count"></span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            orb.classList.remove('idle-mode');
            orb.innerHTML = `
                <div class="lexi-expanded-panel">
                    <!-- Mini Playerhead Component -->
                    <div class="lexi-playerhead">
                        <img src="${song.art}" alt="${song.title}" class="lexi-player-art spinning">
                        <div class="lexi-song-info" title="Go to HarmonyTunes" onclick="window.location.href='harmonytunes.html'">
                            <div class="lexi-song-title">${song.title}</div>
                            <div class="lexi-song-artist">${song.artist}</div>
                        </div>
                        <div class="lexi-player-controls">
                            <button id="lexi-play-pause-btn" class="lexi-ctrl-btn" aria-label="Pause">
                                ${ICONS.pause}
                            </button>
                            <button id="lexi-next-btn" class="lexi-ctrl-btn" aria-label="Next Track">
                                ${ICONS.next}
                            </button>
                        </div>
                    </div>

                    <!-- Action Glyphs / Buttons -->
                    <div class="lexi-actions-row">
                        <button id="lexi-ask" class="lexi-action-pill" aria-label="Ask Lexi">
                            ${ICONS.chat}
                            <span>Ask Lexi</span>
                        </button>
                        <button id="lexi-view-cart" class="lexi-action-pill" aria-label="View Cart">
                            ${ICONS.cart}
                            <span>View Cart</span>
                            <span id="lexi-pill-cart-count" class="lexi-pill-count"></span>
                        </button>
                    </div>
                </div>
            `;
        }

        // Update pill cart count
        try {
            const count = parseInt(localStorage.getItem('cartItemCount') || '0', 10);
            const badge = orb.querySelector('#lexi-pill-cart-count');
            if (badge && count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline-block';
            }
        } catch (_) {}

        // Wire play/pause if present
        const playBtn = orb.querySelector('#lexi-play-pause-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
                playBtn.innerHTML = this.state.isPlaying ? ICONS.pause : ICONS.play;
                const art = orb.querySelector('.lexi-player-art');
                if (art) art.classList.toggle('spinning', this.state.isPlaying);
            });
        }

        // Wire next if present
        const nextBtn = orb.querySelector('#lexi-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
                const newSong = this.getCurrentSong();
                const title = orb.querySelector('.lexi-song-title');
                const artist = orb.querySelector('.lexi-song-artist');
                const art = orb.querySelector('.lexi-player-art');
                if (title) title.textContent = newSong.title;
                if (artist) artist.textContent = newSong.artist;
                if (art) art.src = newSong.art;
            });
        }

        // Wire Ask Lexi
        const askBtn = orb.querySelector('#lexi-ask');
        if (askBtn) {
            askBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collapseLexi(orb);
                if (typeof window.openLexiChat === 'function') {
                    window.openLexiChat();
                    return;
                }
                const chatWindow = document.getElementById('chatbot-window');
                if (chatWindow) {
                    chatWindow.classList.add('active');
                } else {
                    if (!document.getElementById('chatbot-style')) {
                        const link = document.createElement('link');
                        link.id = 'chatbot-style';
                        link.rel = 'stylesheet';
                        link.href = 'css/chatbot.css';
                        document.head.appendChild(link);
                    }
                    import('./chatbot.js').then(() => {
                        if (typeof window.openLexiChat === 'function') {
                            window.openLexiChat();
                        } else {
                            const cw = document.getElementById('chatbot-window');
                            if (cw) {
                                cw.classList.add('active');
                                const input = document.getElementById('chatbot-input');
                                if (input) input.focus();
                            }
                        }
                    }).catch(err => {
                        console.error('Failed to load chatbot:', err);
                        window.location.href = 'index.html#chat';
                    });
                }
            });
        }

        // Wire View Cart
        const cartBtn = orb.querySelector('#lexi-view-cart');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collapseLexi(orb);
                const cartModal = document.getElementById('cart-modal');
                if (cartModal) {
                    cartModal.style.display = 'block';
                } else {
                    window.location.href = 'shop.html';
                }
            });
        }

        // Auto collapse after inactivity
        clearTimeout(this.inactivityTimeout);
        this.inactivityTimeout = setTimeout(() => {
            this.collapseLexi(orb);
        }, 10000);
    }

    collapseLexi(orb) {
        if (!orb || !orb.classList.contains('expanded')) return;
        clearTimeout(this.inactivityTimeout);

        // Trigger smooth closing transition
        orb.classList.add('closing');
        orb.classList.remove('lexi-player-expanded');
        orb.classList.remove('expanded');
        orb.classList.remove('idle-mode');
        
        // Wait for orb width/height transition to finish before swapping to disc
        setTimeout(() => {
            orb.classList.remove('closing');
            this.renderCollapsedOrb(orb);
            this.updateLexiUI();
        }, 350);
    }

    updateLexiUI() {
        const orb = document.getElementById('siri-orb');
        if (!orb) return;

        const isPlaying = this.state.isPlaying;
        const song = this.getCurrentSong();
        orb.classList.toggle('has-music', isPlaying);

        const disc = orb.querySelector('.lexi-orb-disc');
        if (disc) {
            disc.classList.toggle('spinning', isPlaying);
            disc.classList.toggle('paused', !isPlaying);
            const discArt = disc.querySelector('.lexi-orb-disc-art');
            if (discArt && song) discArt.src = song.art;
        }

        const badge = orb.querySelector('.lexi-soundwave-badge');
        if (badge) {
            badge.style.display = isPlaying ? 'flex' : 'none';
        }

        // Update cart badge
        let count = 0;
        try {
            count = parseInt(localStorage.getItem('cartItemCount') || '0', 10);
        } catch (_) {}
        const cartBadge = orb.querySelector('#lexi-cart-badge');
        if (cartBadge) {
            cartBadge.textContent = count;
            cartBadge.classList.toggle('hidden', count <= 0);
        }

        // If expanded, update controls
        if (orb.classList.contains('expanded')) {
            const playBtn = orb.querySelector('#lexi-play-pause-btn');
            if (playBtn) playBtn.innerHTML = isPlaying ? ICONS.pause : ICONS.play;

            const art = orb.querySelector('.lexi-player-art');
            if (art) art.classList.toggle('spinning', isPlaying);

            const pillCount = orb.querySelector('#lexi-pill-cart-count');
            if (pillCount) {
                pillCount.textContent = count;
                pillCount.style.display = count > 0 ? 'inline-block' : 'none';
            }
        }
    }

    updateProgressBar() {
        // Optional subtle progress indicator inside Lexi
    }
}

// Global Singleton
export const sitewidePlayer = new SitewideMusicEngine();
window.DTSMusic = sitewidePlayer;

// Global helper to update cart count in Lexi across all pages
window.updateLexiCartCount = function(count) {
    try {
        localStorage.setItem('cartItemCount', String(count));
    } catch (_) {}

    const badge = document.getElementById('lexi-cart-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    const pillCount = document.getElementById('lexi-pill-cart-count');
    if (pillCount) {
        if (count > 0) {
            pillCount.textContent = count;
            pillCount.style.display = 'inline-block';
        } else {
            pillCount.style.display = 'none';
        }
    }
};
