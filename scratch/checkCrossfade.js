    let preloadedNextSongObj = null;

    function checkCrossfade() {
        if (!isMixerMode) return;
        if (activeAudio.getAttribute('data-no-crossfade') === 'true') return;
        
        const remaining = activeAudio.duration - activeAudio.currentTime;

        if (remaining > 0 && remaining <= 45 && !isListening && !isCrossfading) {
            isListening = true;
            mixerBtn.classList.add('analyzing');
            if(fsMixerBtn) fsMixerBtn.classList.add('analyzing');
            const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.add('analyzing');
            
            let nextIndex = currentSongIndex + 1;
            
            if (typeof window.__pullFromUserQueue === 'function' && userQueue.length > 0) {
                // If user queued something, we skip beat matching algorithm.
            } else if (repeatMode === 2) {
                nextIndex = currentSongIndex;
            } else {
                if (currentSongIndex + 1 >= currentQueue.length && repeatMode !== 1) {
                    if (typeof backgroundMixxerAI === 'function') {
                        backgroundMixxerAI(); // Analyzes and adds the next song
                    }
                }
                
                if (repeatMode !== 2 && currentQueue.length > 1) {
                    const currentMetadata = librarySongsMap.get(currentQueue[currentSongIndex].id);
                    if (currentMetadata) {
                        let bestMatchIndex = currentSongIndex + 1;
                        if (bestMatchIndex >= currentQueue.length) bestMatchIndex = 0;
                        
                        let smallestBpmDiff = Infinity;
                        for (let i = 0; i < currentQueue.length; i++) {
                            if (i === currentSongIndex) continue;
                            const candidate = librarySongsMap.get(currentQueue[i].id);
                            if (candidate) {
                                const diff = Math.abs((candidate.bpm || 120) - currentMetadata.bpm);
                                if (diff < smallestBpmDiff) {
                                    smallestBpmDiff = diff;
                                    bestMatchIndex = i;
                                }
                            }
                        }
                        
                        if (bestMatchIndex !== (currentSongIndex + 1) % currentQueue.length && !isShuffle) {
                            const temp = currentQueue[(currentSongIndex + 1) % currentQueue.length];
                            currentQueue[(currentSongIndex + 1) % currentQueue.length] = currentQueue[bestMatchIndex];
                            currentQueue[bestMatchIndex] = temp;
                        }
                    }
                }
                
                nextIndex = currentSongIndex + 1;
                if (nextIndex >= currentQueue.length) {
                    if (repeatMode === 1) nextIndex = 0;
                }
            }

            // PRELOAD: At 45 seconds, we assign the next song to the idle deck and perform silence block analysis
            if (nextIndex < currentQueue.length) {
                preloadedNextSongObj = currentQueue[nextIndex];
            } else if (repeatMode === 1) {
                preloadedNextSongObj = currentQueue[0];
            } else {
                preloadedNextSongObj = null;
            }

            if (preloadedNextSongObj) {
                nextAudio.src = preloadedNextSongObj.src;
                const songMetadata = librarySongsMap.get(preloadedNextSongObj.id);
                
                nextAudio.addEventListener('loadedmetadata', () => {
                    // Use the audio engine's offline block analyzer to find exact non-silent onset
                    mixEngine.trimSilence(nextAudio).then(({ startOffset }) => {
                        const inmixPoint = songMetadata?.inmixPoint || startOffset || 15;
                        nextAudio.currentTime = inmixPoint;
                    });
                }, { once: true });
            }
        }

        if (remaining > 0 && remaining <= crossfadeDuration && !isCrossfading) {
            isListening = false;
            mixerBtn.classList.remove('analyzing');
            if(fsMixerBtn) fsMixerBtn.classList.remove('analyzing');
            const mobMixerBtn = document.getElementById('mob-mixer-btn'); if(mobMixerBtn) mobMixerBtn.classList.remove('analyzing');
            
            isCrossfading = true;
            mixerBtn.classList.add('pulsing'); if(fsMixerBtn) fsMixerBtn.classList.add('pulsing');
            if(mobMixerBtn) mobMixerBtn.classList.add('pulsing');
            
            let nextIndex = currentSongIndex + 1;
            
            if (typeof window.__pullFromUserQueue === 'function' && userQueue.length > 0) {
                const nextUserSong = window.__pullFromUserQueue();
                if(nextUserSong) {
                    currentQueue.splice(currentSongIndex + 1, 0, nextUserSong);
                    preloadedNextSongObj = nextUserSong;
                    nextAudio.src = nextUserSong.src;
                    const meta = librarySongsMap.get(nextUserSong.id);
                    nextAudio.currentTime = meta?.inmixPoint || 15;
                }
            } else if (repeatMode === 2) {
                nextIndex = currentSongIndex;
            } else if (nextIndex >= currentQueue.length) {
                if (repeatMode === 1) nextIndex = 0;
                else {
                    if (typeof backgroundMixxerAI === 'function') backgroundMixxerAI();
                    if (currentSongIndex + 1 < currentQueue.length) {
                        nextIndex = currentSongIndex + 1;
                        preloadedNextSongObj = currentQueue[nextIndex];
                        nextAudio.src = preloadedNextSongObj.src;
                    } else {
                        isCrossfading = false;
                        mixerBtn.classList.remove('pulsing');
                        if(fsMixerBtn) fsMixerBtn.classList.remove('pulsing');
                        if(mobMixerBtn) mobMixerBtn.classList.remove('pulsing');
                        activeAudio.setAttribute('data-no-crossfade', 'true');
                        return; 
                    }
                }
            }
            
            // HISTORY FIX: Ensure the outgoing song is recorded in history before updating index!
            __recordHistory();
            
            const prevIndex = currentSongIndex;
            currentSongIndex = nextIndex;
            
            const prevAudio = activeAudio;
            activeAudio = nextAudio;
            nextAudio = prevAudio;
            
            const song = currentQueue[currentSongIndex];
            const songMetadata = librarySongsMap.get(song.id);
            
            // Failsafe: if the song isn't the preloaded one (e.g. user queue inserted), load it
            if (!activeAudio.src || !activeAudio.src.endsWith(song.src)) {
                activeAudio.src = song.src;
                activeAudio.currentTime = songMetadata?.inmixPoint || 15;
            }
            
            playerTitle.textContent = song.title; checkMarquee(); checkMarquee();
            playerArtist.textContent = song.artist;
            playerArt.src = song.art;
            document.documentElement.style.setProperty('--lyrics-color', songColors[song.id] || '#2d1445');
            
            const isFav = userFavoritesIds.has(song.id);
            playerLikeBtn.textContent = isFav ? '♥' : '♡'; if(fsLikeBtn) { fsLikeBtn.innerHTML = isFav ? '&#x2665;&#xFE0E;' : '&#x2661;&#xFE0E;'; fsLikeBtn.classList.toggle('active', isFav); }
            playerLikeBtn.classList.toggle('active', isFav);

            renderLyrics(song.id);
            if(viewPlaylist.style.display !== 'none') {
                updateSongTableActiveState();
            }

            const fromDeck = prevAudio === audioPlayer1 ? 'A' : 'B';
            const toDeck = activeAudio === audioPlayer1 ? 'A' : 'B';

            activeAudio.volume = 1;
            // Instantly play the preloaded & buffered audio (fixes pausing/stuttering)
            activeAudio.play().catch(e => console.error("Manager info:", e));

            // AutoMix: Beat Matching & Time Stretching
            let prevBpm = librarySongsMap.get(currentQueue[prevIndex]?.id)?.bpm || 120;
            let nextBpm = songMetadata?.bpm || 120;
            
            let isBeatMatched = mixEngine.applyBeatMatch(activeAudio, prevBpm, nextBpm);

            mixEngine.crossfade(fromDeck, toDeck, crossfadeDuration, {
                equalPower: true,
                onComplete: () => {
                    if (isBeatMatched) {
                        mixEngine.driftPlaybackRateToNormal(activeAudio);
                    }

                    prevAudio.pause();
                    prevAudio.currentTime = 0;
                    isCrossfading = false;
                    mixerBtn.classList.remove('pulsing');
                    if(fsMixerBtn) fsMixerBtn.classList.remove('pulsing');
                    if(mobMixerBtn) mobMixerBtn.classList.remove('pulsing');
                }
            });
        }
    }
