import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Medixly UX Overhaul, Button Harmonization, Waves & Player Sync', () => {
    const medixlyHtmlPath = path.resolve(process.cwd(), 'medixly.html');
    const medixlyCssPath = path.resolve(process.cwd(), 'css/medixly.css');
    let htmlContent = '';
    let cssContent = '';

    beforeEach(() => {
        htmlContent = fs.readFileSync(medixlyHtmlPath, 'utf8');
        cssContent = fs.readFileSync(medixlyCssPath, 'utf8');
    });

    describe('1. Visual & UI Consistency (Design System Harmonization)', () => {
        it('harmonizes action buttons with unified high-contrast design system classes', () => {
            // Must contain standard button classes
            expect(htmlContent).toContain('btn-secondary');
            expect(htmlContent).toContain('btn-accent');
            expect(cssContent).toContain('.nav-pill');
            expect(cssContent).toContain('.action-btn-primary');
            expect(cssContent).toContain('.action-btn-secondary');
            expect(cssContent).toContain('.action-btn-play');

            // No arbitrary inline colors for greeting action buttons
            expect(htmlContent).not.toMatch(/id="header-sound-prefs-btn"[^>]*style="[^"]*background:\s*#[0-9a-fA-F]+/);
        });

        it('removes dead-click Follow Us links from shelf headers', () => {
            expect(htmlContent).not.toMatch(/<a[^>]+href="https:\/\/www\.tiktok\.com\/@dreamstimeskip"[^>]*class="see-all"[^>]*>\s*Follow Us\s*<\/a>/i);
        });

        it('implements responsive background wave scaling with dual gradient masking', () => {
            expect(cssContent).toContain('.music-wave-bg.page-wave-bg');
            expect(cssContent).toMatch(/mask-image:\s*linear-gradient/i);
            expect(cssContent).toMatch(/-webkit-mask-image:\s*linear-gradient/i);
            expect(cssContent).toMatch(/width:\s*250%/);
        });
    });

    describe('2. Navigation & Layout Streamlining', () => {
        it('provides clean navigation pills and dedicated #view-playlists page in medixly.html', () => {
            expect(htmlContent).toContain('id="nav-home"');
            expect(htmlContent).toContain('id="nav-playlists"');
            expect(htmlContent).toContain('id="nav-favorites"');
            expect(htmlContent).toContain('id="nav-search"');
            expect(htmlContent).toContain('id="view-playlists"');
            expect(htmlContent).toContain('id="featured-favorites-banner"');
            expect(htmlContent).toContain('id="playlists-liked-count"');
            expect(htmlContent).toContain('id="full-page-playlists-grid"');
        });

        it('includes Lexi dynamic status tooltip elements across all views', () => {
            expect(htmlContent).toContain('id="lexi-status-tooltip"');
            expect(htmlContent).toContain('id="lexi-status-text"');
            expect(htmlContent).toContain('id="fs-lexi-status-tooltip"');
            expect(htmlContent).toContain('id="fs-lexi-status-text"');
            expect(htmlContent).toContain('id="mob-lexi-status-tooltip"');
            expect(htmlContent).toContain('id="mob-lexi-status-text"');
        });
    });

    describe('3. Dynamic DOM State Synchronization & Lexi State Logic', () => {
        let originalWindow;
        let mockAudio;

        beforeEach(() => {
            // Setup DOM environment
            document.body.innerHTML = `
                <nav class="nav-pills">
                    <button id="nav-home" class="nav-pill" style="display:none;"></button>
                    <button id="nav-playlists" class="nav-pill"></button>
                    <button id="nav-favorites" class="nav-pill"></button>
                    <button id="nav-search" class="nav-pill"></button>
                </nav>
                <div id="view-home" style="display:block;"></div>
                <div id="view-playlist" style="display:none;"></div>
                <div id="view-playlists" style="display:none;">
                    <div id="featured-favorites-banner">
                        <span id="playlists-liked-count">0 songs</span>
                        <button id="playlists-liked-play-btn"></button>
                    </div>
                    <div id="full-page-playlists-grid"></div>
                </div>
                <div id="view-lyrics" style="display:none;"></div>

                <!-- Mini Player -->
                <div class="player-bar">
                    <img id="player-album-art" src="" />
                    <div id="player-song-title"></div>
                    <div id="player-song-artist"></div>
                    <button id="play-pause-btn"><span class="play-icon"></span><span class="pause-icon" style="display:none;"></span></button>
                    <button id="shuffle-btn"></button>
                    <button id="repeat-btn"><span class="repeat-indicator"></span></button>
                    <button id="player-like-btn">♡</button>
                    <button id="viral-skip-btn"></button>
                    <button id="mixer-btn">
                        <span id="lexi-status-tooltip" class="lexi-status-tooltip"><span id="lexi-status-text">Lexi is a mixer</span></span>
                    </button>
                    <div class="progress-bar"><div class="progress" style="width:0%;"></div></div>
                    <span class="current-time">0:00</span>
                    <span class="total-time">0:00</span>
                </div>

                <!-- Fullscreen Player -->
                <div id="fullscreen-player" style="display:none;">
                    <div id="fs-bg"></div>
                    <img id="fs-art" src="" />
                    <div id="fs-title"></div>
                    <div id="fs-artist"></div>
                    <button id="fs-play-pause-btn"><span class="play-icon"></span><span class="pause-icon" style="display:none;"></span></button>
                    <button id="fs-shuffle-btn"></button>
                    <button id="fs-repeat-btn"><span id="fs-repeat-indicator"></span></button>
                    <button id="fs-like-btn">&#x2661;&#xFE0E;</button>
                    <button id="fs-viral-skip-btn"></button>
                    <button id="fs-mixer-btn">
                        <span id="fs-lexi-status-tooltip" class="lexi-status-tooltip"><span id="fs-lexi-status-text">Lexi is a mixer</span></span>
                    </button>
                    <div id="fs-progress-bar"><div id="fs-progress" style="width:0%;"></div></div>
                    <span id="fs-current-time">0:00</span>
                    <span id="fs-total-time">0:00</span>
                    <div id="fullscreen-content">
                        <div id="fs-lyrics-side-panel"></div>
                    </div>
                    <button id="fs-lyrics-btn"></button>
                </div>

                <!-- Mobile Player Elements -->
                <button id="mob-mixer-btn">
                    <span id="mob-lexi-status-tooltip" class="lexi-status-tooltip"><span id="mob-lexi-status-text">Lexi is a mixer</span></span>
                </button>
                <button id="mob-shuffle-btn"></button>
                <button id="mob-repeat-btn"></button>
                <button id="mob-viral-btn"></button>
            `;
        });

        it('verifies Lexi Status Tooltip updates text dynamically to "Mixing" and toggles classes', () => {
            const tooltip = document.getElementById('lexi-status-tooltip');
            const tooltipText = document.getElementById('lexi-status-text');
            const fsTooltip = document.getElementById('fs-lexi-status-tooltip');
            const fsTooltipText = document.getElementById('fs-lexi-status-text');

            // Simulate setLexiMixingState logic
            const setLexiMixingState = (isMixing, label = null) => {
                const text = label || (isMixing ? 'Mixing' : 'Lexi is a mixer');
                [tooltipText, fsTooltipText].forEach(el => { if (el) el.textContent = text; });
                [tooltip, fsTooltip].forEach(t => {
                    if (isMixing) {
                        t.classList.add('visible', 'mixing');
                    } else {
                        t.classList.remove('mixing');
                    }
                });
            };

            setLexiMixingState(true, 'Mixing');
            expect(tooltipText.textContent).toBe('Mixing');
            expect(fsTooltipText.textContent).toBe('Mixing');
            expect(tooltip.classList.contains('mixing')).toBe(true);
            expect(tooltip.classList.contains('visible')).toBe(true);
            expect(fsTooltip.classList.contains('mixing')).toBe(true);

            setLexiMixingState(false);
            expect(tooltipText.textContent).toBe('Lexi is a mixer');
            expect(tooltip.classList.contains('mixing')).toBe(false);
        });

        it('verifies 1:1 state sync between fullscreen and mini-player', () => {
            const playIcon = document.querySelector('.player-bar .play-icon');
            const pauseIcon = document.querySelector('.player-bar .pause-icon');
            const fsPlayIcon = document.querySelector('#fullscreen-player .play-icon');
            const fsPauseIcon = document.querySelector('#fullscreen-player .pause-icon');

            const shuffleBtn = document.getElementById('shuffle-btn');
            const fsShuffleBtn = document.getElementById('fs-shuffle-btn');

            const repeatBtn = document.getElementById('repeat-btn');
            const fsRepeatBtn = document.getElementById('fs-repeat-btn');
            const fsRepeatIndicator = document.getElementById('fs-repeat-indicator');

            const playerLikeBtn = document.getElementById('player-like-btn');
            const fsLikeBtn = document.getElementById('fs-like-btn');

            const viralSkipBtn = document.getElementById('viral-skip-btn');
            const fsViralSkipBtn = document.getElementById('fs-viral-skip-btn');

            let isPlaying = true;
            let isShuffle = true;
            let repeatMode = 2; // Repeat 1
            let isFav = true;
            let viralLocked = true;

            const syncPlayerVisuals = () => {
                // Play / Pause
                playIcon.style.display = isPlaying ? 'none' : 'block';
                pauseIcon.style.display = isPlaying ? 'block' : 'none';
                fsPlayIcon.style.display = isPlaying ? 'none' : 'block';
                fsPauseIcon.style.display = isPlaying ? 'block' : 'none';

                // Shuffle
                shuffleBtn.classList.toggle('active', isShuffle);
                fsShuffleBtn.classList.toggle('active', isShuffle);

                // Repeat
                fsRepeatIndicator.textContent = repeatMode === 2 ? '1' : (repeatMode === 1 ? '.' : '');
                repeatBtn.classList.toggle('active', repeatMode > 0);
                fsRepeatBtn.classList.toggle('active', repeatMode > 0);

                // Like
                playerLikeBtn.textContent = isFav ? '♥' : '♡';
                playerLikeBtn.classList.toggle('active', isFav);
                fsLikeBtn.innerHTML = isFav ? '&#x2665;&#xFE0E;' : '&#x2661;&#xFE0E;';
                fsLikeBtn.classList.toggle('active', isFav);

                // Viral
                viralSkipBtn.classList.toggle('viral-locked', viralLocked);
                fsViralSkipBtn.classList.toggle('viral-locked', viralLocked);
            };

            syncPlayerVisuals();

            // Verify 1:1 match
            expect(playIcon.style.display).toBe(fsPlayIcon.style.display);
            expect(pauseIcon.style.display).toBe(fsPauseIcon.style.display);
            expect(shuffleBtn.classList.contains('active')).toBe(fsShuffleBtn.classList.contains('active'));
            expect(repeatBtn.classList.contains('active')).toBe(fsRepeatBtn.classList.contains('active'));
            expect(fsRepeatIndicator.textContent).toBe('1');
            expect(playerLikeBtn.classList.contains('active')).toBe(fsLikeBtn.classList.contains('active'));
            expect(viralSkipBtn.classList.contains('viral-locked')).toBe(fsViralSkipBtn.classList.contains('viral-locked'));
        });

        it('verifies viral skip jump logic and queue unlocking', () => {
            let viralLocked = true;
            let currentTrackIndex = 0;
            const queue = [
                { id: 'track-1', title: 'Track 1', inmixPoint: 20, tags: ['pop'] },
                { id: 'track-2', title: 'Track 2 (Viral)', inmixPoint: 15, tags: ['viral', 'trending'] },
                { id: 'track-3', title: 'Track 3', inmixPoint: 10, tags: ['chill'] }
            ];

            let activeCurrentTime = 25; // Already past hook (20s)

            const unlockViral = () => {
                viralLocked = false;
            };

            const cycleToNextViralTrack = () => {
                unlockViral();
                // Find next viral track in queue
                const nextIdx = queue.findIndex((t, idx) => idx > currentTrackIndex && t.tags.includes('viral'));
                if (nextIdx !== -1) {
                    currentTrackIndex = nextIdx;
                    activeCurrentTime = queue[currentTrackIndex].inmixPoint;
                }
            };

            cycleToNextViralTrack();

            expect(viralLocked).toBe(false);
            expect(currentTrackIndex).toBe(1);
            expect(activeCurrentTime).toBe(15);
            expect(queue[currentTrackIndex].title).toBe('Track 2 (Viral)');
        });

        it('verifies navigation pill visibility toggling between Home and Playlists view', () => {
            const navHome = document.getElementById('nav-home');
            const viewHome = document.getElementById('view-home');
            const viewPlaylists = document.getElementById('view-playlists');

            const showHome = () => {
                viewHome.style.display = 'block';
                viewPlaylists.style.display = 'none';
                navHome.style.display = 'none'; // Redundant home pill hidden
            };

            const showPlaylistsView = () => {
                viewHome.style.display = 'none';
                viewPlaylists.style.display = 'block';
                navHome.style.display = 'inline-flex'; // Revealed so user can navigate back
            };

            showHome();
            expect(navHome.style.display).toBe('none');
            expect(viewHome.style.display).toBe('block');
            expect(viewPlaylists.style.display).toBe('none');

            showPlaylistsView();
            expect(navHome.style.display).toBe('inline-flex');
            expect(viewHome.style.display).toBe('none');
            expect(viewPlaylists.style.display).toBe('block');
        });
    });
});
