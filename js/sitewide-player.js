// js/sitewide-player.js
// Sitewide music engine and Lexi floating mini-playerhead

import { librarySongs, getSongById } from './song-data.js?v=1790377272083';

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
        const isHarmonyPage = this.isHarmonyTunesPage;

        let orbWrapper = document.querySelector('.siri-orb-wrapper');
        let orb = document.getElementById('siri-orb');

        if (!orbWrapper || !orb) {
            if (isHarmonyPage) return; // Skip injecting sitewide orb on HarmonyTunes to prevent duplicated animation
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
        } else {
            orb.classList.add('sitewide-lexi-orb');
            if (!orb.hasAttribute('role')) orb.setAttribute('role', 'button');
            if (!orb.hasAttribute('tabindex')) orb.setAttribute('tabindex', '0');
        }

        this.renderCollapsedOrb(orb);

        if (!isHarmonyPage) {
            // Full interactive physics & click handling for sitewide Lexi Orb
            let isDragging = false;
            let startX = 0, startY = 0;
            let hoverCenterX = 0, hoverCenterY = 0;
            let isHovering = false;
            let hasDragged = false;
            let dragStartTime = 0;

            // Physics variables for smooth fluid LERP
            let currentAngle = 0;
            let targetAngle = 0;
            let currentStretch = 0;
            let targetStretch = 0;
            let isErratic = false;
            let erraticTimeout;
            const SNAP_DISTANCE = 300;

            const baseShadow = `inset 0 0 10px 2px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.1), inset -2px -2px 5px rgba(0,0,0,0.2), 0 0 15px rgba(59, 130, 246, 0.4)`;
            const baseTransition = 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            orb.style.transition = `${baseTransition}, box-shadow 0.3s ease`;

            const physicsLoop = () => {
                if (orb.classList.contains('expanded')) {
                    targetStretch = 0;
                }

                const actualTargetStretch = isErratic ? 0 : targetStretch;
                currentStretch += (actualTargetStretch - currentStretch) * 0.15;

                if (currentStretch > 0.01) {
                    let diff = targetAngle - currentAngle;
                    while (diff > Math.PI) diff -= 2 * Math.PI;
                    while (diff < -Math.PI) diff += 2 * Math.PI;
                    currentAngle += diff * 0.25;

                    orb.style.transform = `rotate(${currentAngle}rad) translateX(${currentStretch * 100}px) scaleX(${1 + currentStretch}) scaleY(${1 - currentStretch * 0.3}) rotate(${-currentAngle}rad)`;
                } else {
                    currentAngle = currentAngle % (2 * Math.PI);
                    targetAngle = currentAngle;
                    if (!orb.classList.contains('expanded')) {
                        orb.style.transform = '';
                    }
                }

                requestAnimationFrame(physicsLoop);
            };
            requestAnimationFrame(physicsLoop);

            const updateTarget = (dx, dy, isHover) => {
                if (orb.classList.contains('expanded')) {
                    targetStretch = 0;
                    return;
                }
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 1) {
                    targetStretch = 0;
                    return;
                }

                const rawAngle = Math.atan2(dy, dx);
                let angleDiff = rawAngle - targetAngle;

                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                if (Math.abs(angleDiff) > 0.5) {
                    isErratic = true;
                    clearTimeout(erraticTimeout);
                    erraticTimeout = setTimeout(() => { isErratic = false; }, 200);
                }

                targetAngle += angleDiff;

                if (isHover) {
                    targetStretch = Math.min(distance / 300, 0.15);
                } else {
                    let nDist = Math.min(distance / SNAP_DISTANCE, 1);
                    let resistanceDist = 1 - Math.pow(1 - nDist, 2);
                    targetStretch = resistanceDist * 2.5;
                }
            };

            orb.addEventListener('mouseenter', () => {
                if (isDragging || orb.classList.contains('expanded')) return;
                const rect = orb.getBoundingClientRect();
                hoverCenterX = rect.left + rect.width / 2;
                hoverCenterY = rect.top + rect.height / 2;
                isHovering = true;
            });

            orb.addEventListener('mousemove', (e) => {
                if (isDragging || !isHovering || orb.classList.contains('expanded')) return;
                let dx = e.clientX - hoverCenterX;
                let dy = e.clientY - hoverCenterY;
                updateTarget(dx, dy, true);
            });

            orb.addEventListener('mouseleave', () => {
                isHovering = false;
                if (isDragging || orb.classList.contains('expanded')) return;
                targetStretch = 0;
            });

            const handleDragStart = (clientX, clientY, e) => {
                if (orb.classList.contains('expanded')) return;
                if (e && e.target && e.target.closest('button, a')) return;

                isDragging = true;
                hasDragged = false;
                dragStartTime = Date.now();
                const rect = orb.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
                orb.style.transition = `${baseTransition}, box-shadow 0.1s ease`;
            };

            orb.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY, e));
            orb.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY, e);
            }, { passive: true });

            const handleDragMove = (clientX, clientY) => {
                if (!isDragging || orb.classList.contains('expanded')) return;

                const dx = clientX - startX;
                const dy = clientY - startY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 5 && Date.now() - dragStartTime > 150) hasDragged = true;

                const tension = Math.min(distance / SNAP_DISTANCE, 1);

                if (distance > SNAP_DISTANCE) {
                    isDragging = false;
                    targetStretch = 0;
                    orb.style.transition = `${baseTransition}, box-shadow 0.5s ease`;
                    orb.style.boxShadow = baseShadow;
                    return;
                }

                updateTarget(dx, dy, false);

                if (tension > 0.8) {
                    orb.style.boxShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 ${40 + tension * 60}px rgba(255, 50, 50, 0.9)`;
                } else if (tension > 0.4) {
                    orb.style.boxShadow = `inset 0 0 60px 10px rgba(0,0,0,0.2), inset 10px 10px 30px rgba(255,255,255,0.1), inset -10px -10px 30px rgba(0,0,0,0.2), 0 0 ${40 + tension * 40}px rgba(255, 200, 50, 0.8)`;
                } else {
                    orb.style.boxShadow = baseShadow;
                }
            };

            document.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
                e.preventDefault();
            }, { passive: false });

            const handleDragEnd = () => {
                if (isDragging) {
                    isDragging = false;
                    targetStretch = 0;
                    orb.style.transition = `${baseTransition}, box-shadow 0.5s ease`;
                    orb.style.boxShadow = baseShadow;
                }
            };

            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchend', handleDragEnd);

            // Click handling: expand or collapse pill
            let tapCount = 0;
            let tapTimeout;

            orb.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.preventDefault();
                    hasDragged = false;
                    return;
                }

                if (orb.classList.contains('expanded')) {
                    // If user clicked the outer pill or padding, collapse
                    if (e.target === orb || e.target.classList.contains('lexi-expanded-panel')) {
                        this.collapseLexi(orb);
                    }
                    return;
                }

                // Expand into pill!
                this.expandLexi(orb);

                // Tap particle Easter egg
                tapCount++;
                clearTimeout(tapTimeout);
                tapTimeout = setTimeout(() => {
                    tapCount = 0;
                    orb.style.setProperty('--charge-opacity', '0');
                }, 1000);
                this.triggerTapParticles(orb, tapCount);
            });

            orb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (!orb.classList.contains('expanded')) {
                        e.preventDefault();
                        this.expandLexi(orb);
                    } else if (e.target === orb) {
                        e.preventDefault();
                        this.collapseLexi(orb);
                    }
                }
            });

            // Close on clicking outside
            document.addEventListener('click', (e) => {
                if (orb && orb.classList.contains('expanded') && !orb.contains(e.target)) {
                    this.collapseLexi(orb);
                }
            });
        }

        // Listen for global cart updates
        window.addEventListener('cartUpdated', () => this.updateLexiUI());
        window.addEventListener('storage', (e) => {
            if (e.key === 'cartItemCount' || e.key === 'localCart') {
                this.updateLexiUI();
            }
        });

        // Global update function for external scripts
        window.updateLexiCartCount = (count) => {
            const badge = document.getElementById('lexi-cart-badge');
            if (badge) {
                badge.textContent = count;
                badge.classList.toggle('hidden', count <= 0);
            }
            const pillCount = document.getElementById('lexi-pill-cart-count');
            if (pillCount) {
                pillCount.textContent = count;
                pillCount.style.display = count > 0 ? 'inline-block' : 'none';
            }
        };

        this.updateLexiUI();

        // On HarmonyTunes, animate the orb flying into the mixer button then remove it
        if (isHarmonyPage) {
            const targetBtn = document.getElementById('mixer-btn');
            const targetBlob = targetBtn?.querySelector('.lexi-mixxer-blob');
            if (targetBlob) {
                targetBlob.style.transform = 'scale(0)';
                targetBlob.style.opacity = '0';
                targetBlob.style.transition = 'none';
            }

            // Force center positioning for the spawn
            orbWrapper.style.left = '50%';
            orbWrapper.style.transform = 'translateX(-50%)';
            orbWrapper.style.bottom = '50%';

            setTimeout(() => {
                if (targetBtn && orbWrapper) {
                    const targetRect = targetBtn.getBoundingClientRect();
                    const orbRect = orb.getBoundingClientRect();

                    let dx = 0;
                    let dy = 0;
                    if (targetRect.width > 0 && targetRect.height > 0) {
                        dx = targetRect.left - orbRect.left + (targetRect.width / 2 - orbRect.width / 2);
                        dy = targetRect.top - orbRect.top + (targetRect.height / 2 - orbRect.height / 2);
                    } else {
                        // Fallback on mobile if mixer button is in overflow menu
                        dx = (window.innerWidth / 2) - (orbRect.left + orbRect.width / 2);
                        dy = (window.innerHeight - 40) - (orbRect.top + orbRect.height / 2);
                    }

                    orbWrapper.style.transition = 'transform 1s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.8s ease-in 0.2s';
                    orbWrapper.style.transform = `translateX(-50%) translate(${dx}px, ${dy}px) scale(0.35)`;
                    orbWrapper.style.opacity = '0';

                    setTimeout(() => {
                        orbWrapper.remove();
                        // Pulse the mixer button to show Lexi landed
                        if (targetBtn) {
                            targetBtn.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            targetBtn.style.transform = 'scale(1.25)';
                            setTimeout(() => { targetBtn.style.transform = ''; }, 250);
                        }
                        // Trigger explosive landing pop animation on the small Lexi blob!
                        if (targetBlob) {
                            targetBlob.style.transform = '';
                            targetBlob.style.opacity = '';
                            targetBlob.style.transition = '';
                            targetBlob.classList.add('landing-animate');
                            setTimeout(() => {
                                targetBlob.classList.remove('landing-animate');
                            }, 1000);
                        }
                        const glow = document.querySelector('.player-glow-overlay');
                        if (glow) glow.classList.add('animate');
                    }, 1000);
                } else {
                    if (targetBlob) {
                        targetBlob.style.transform = '';
                        targetBlob.style.opacity = '';
                        targetBlob.style.transition = '';
                    }
                    orbWrapper.remove();
                }
            }, 1200);

            // Safety fallback: ensure blob is never left hidden under any condition
            setTimeout(() => {
                if (targetBlob && (targetBlob.style.opacity === '0' || targetBlob.style.transform === 'scale(0)')) {
                    targetBlob.style.transform = '';
                    targetBlob.style.opacity = '';
                    targetBlob.style.transition = '';
                }
            }, 3000);
        }
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
        if (!orb) return;
        orb.classList.remove('closing');
        orb.classList.add('expanded');
        orb.classList.add('lexi-player-expanded');
        orb.style.transform = '';

        const song = this.getCurrentSong();
        const isPlaying = this.state.isPlaying;

        orb.classList.remove('idle-mode');
        orb.innerHTML = `
            <div class="lexi-expanded-panel">
                <!-- Mini Playerhead Component -->
                <div class="lexi-playerhead">
                    <img src="${song.art}" alt="${song.title}" class="lexi-player-art ${isPlaying ? 'spinning' : ''}">
                    <div class="lexi-song-info" title="Go to HarmonyTunes" onclick="window.location.href='harmonytunes.html'">
                        <div class="lexi-song-title">${song.title}</div>
                        <div class="lexi-song-artist">${song.artist}</div>
                    </div>
                    <div class="lexi-player-controls">
                        <button id="lexi-play-pause-btn" class="lexi-ctrl-btn" aria-label="${isPlaying ? 'Pause' : 'Play'}">
                            ${isPlaying ? ICONS.pause : ICONS.play}
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
        orb.style.transform = '';
        
        // Wait for orb width/height transition to finish before swapping to disc
        setTimeout(() => {
            orb.classList.remove('closing');
            this.renderCollapsedOrb(orb);
            this.updateLexiUI();
        }, 350);
    }

    triggerTapParticles(orb, count) {
        if (!orb) return;
        const rect = orb.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const particleColors = ['#9333EA', '#2563EB', '#EC4899', '#3B82F6', '#8B5CF6'];

        if (count > 10) {
            const numParticles = 100;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('orb-particle');
                const angle = (i / numParticles) * Math.PI * 2 + (Math.random() * 0.1);
                const distance = 300 + Math.random() * 300; 
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
                particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
                const size = 6 + Math.random() * 8;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                const duration = 1.5 + Math.random() * 0.5;
                particle.style.animationDuration = `${duration}s`;
                fragment.appendChild(particle);
                setTimeout(() => particle.remove(), duration * 1000);
            }
            document.body.appendChild(fragment);
        } else {
            let numParticles = count === 5 ? 50 : 8 + Math.floor(Math.random() * 6);
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('orb-particle');
                const angle = Math.random() * Math.PI * 2;
                const distance = 120 + Math.random() * 200; 
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
                particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
                const size = 4 + Math.random() * 6;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                const duration = 0.8 + Math.random() * 0.5;
                particle.style.animationDuration = `${duration}s`;
                fragment.appendChild(particle);
                setTimeout(() => particle.remove(), duration * 1000);
            }
            document.body.appendChild(fragment);
        }
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
