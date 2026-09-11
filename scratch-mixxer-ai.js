    // --- BACKGROUND MIXXER AI ---
    async function backgroundMixxerAI() {
        if (!activeAudio || !currentQueue[currentSongIndex]) return;
        
        // If we have plenty of songs queued, or user manually queued songs, do nothing
        if (currentQueue.length - currentSongIndex > 3 || userQueue.length > 0) return;
        
        const currentSong = currentQueue[currentSongIndex];
        const currentBpm = currentSong.bpm || 120;
        
        // Find songs in the library that match the BPM roughly, aren't recently played, and aren't already in queue
        const historyIds = new Set(historyQueue.map(s => s.id));
        const queueIds = new Set(currentQueue.map(s => s.id));
        
        const candidates = librarySongs.filter(song => {
            if (historyIds.has(song.id) || queueIds.has(song.id)) return false;
            const bpmDiff = Math.abs((song.bpm || 120) - currentBpm);
            return bpmDiff < 15; // Within 15 BPM
        });
        
        if (candidates.length > 0) {
            // Pick a random compatible song
            const nextSuggested = candidates[Math.floor(Math.random() * candidates.length)];
            currentQueue.push(nextSuggested);
            console.log("Mixxer AI: Seamlessly injected", nextSuggested.title, "to match", currentSong.title);
            if(queuePanel && queuePanel.classList.contains('open')) renderQueue();
        } else {
            // Fallback: just add a random unplayed song
            const fallback = librarySongs.find(s => !historyIds.has(s.id) && !queueIds.has(s.id));
            if (fallback) {
                currentQueue.push(fallback);
                if(queuePanel && queuePanel.classList.contains('open')) renderQueue();
            }
        }
    }
