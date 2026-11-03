/**
 * js/editor-syllable-engine.js
 * Beat-by-Beat Syllable & Lyric Engine for Medixly Editors Workspace.
 * Handles syllable tokenization, live synchronization state, and marker orchestration.
 */

/**
 * Common English syllable breaking patterns and rules.
 * Handles prefixes, suffixes, diphthongs, and consonant clusters.
 */
const PREFIXES = /^(un|re|in|im|dis|mis|pre|non|post|sub|trans|anti|auto|semi|over|under)/i;
const SUFFIXES = /(tion|sion|ment|ness|less|ful|able|ible|ing|ed|ly|est|er|ous|ive|ity|ize|ise)$/i;

/**
 * Splits an English word into syllables using heuristics.
 * If word contains explicit hyphens (e.g. "un-stop-pa-ble"), uses those hyphens.
 * 
 * @param {string} word
 * @returns {string[]}
 */
export function splitWordIntoSyllables(word) {
    const trimmed = String(word || '').trim();
    if (!trimmed) return [];

    // If already hyphenated by the user
    if (trimmed.includes('-')) {
        const parts = trimmed.split('-').map(s => s.trim()).filter(Boolean);
        if (parts.length > 0) return parts;
    }

    // Strip surrounding punctuation for syllable counting
    const clean = trimmed.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    if (clean.length <= 3) return [trimmed];

    // Check for common prefix detachment
    let prefix = '';
    let core = clean;
    const prefixMatch = core.match(PREFIXES);
    if (prefixMatch && core.length - prefixMatch[0].length >= 3) {
        prefix = prefixMatch[0];
        core = core.slice(prefix.length);
    }

    // Check for common suffix detachment
    let suffix = '';
    const suffixMatch = core.match(SUFFIXES);
    if (suffixMatch && core.length - suffixMatch[0].length >= 3) {
        suffix = suffixMatch[0];
        core = core.slice(0, core.length - suffix.length);
    }

    // Find vowel-consonant clusters in the remaining core
    // Vowels regex (including 'y')
    const vowelRegex = /[aeiouy]+/gi;
    const syllables = [];
    let match;
    const vowelIndices = [];

    while ((match = vowelRegex.exec(core)) !== null) {
        vowelIndices.push({ start: match.index, end: match.index + match[0].length });
    }

    if (vowelIndices.length <= 1) {
        // Monosyllabic core
        const result = [];
        if (prefix) result.push(prefix);
        result.push(core + (suffix ? suffix : ''));
        // Re-attach punctuation if any
        return result.length > 1 ? result : [trimmed];
    }

    // Split between vowel groups based on intermediate consonants
    let lastSplit = 0;
    for (let i = 0; i < vowelIndices.length - 1; i++) {
        const v1End = vowelIndices[i].end;
        const v2Start = vowelIndices[i + 1].start;
        const consonantCount = v2Start - v1End;

        let splitAt = v1End;
        if (consonantCount >= 2) {
            // Split between consonants (e.g. "hap-py", "doc-tor")
            splitAt = v1End + Math.floor(consonantCount / 2);
        } else if (consonantCount === 1) {
            // Usually split before the consonant (e.g. "mu-sic")
            splitAt = v1End;
        }

        syllables.push(core.slice(lastSplit, splitAt));
        lastSplit = splitAt;
    }
    syllables.push(core.slice(lastSplit));

    const finalParts = [];
    if (prefix) finalParts.push(prefix);
    for (const part of syllables) {
        if (part) finalParts.push(part);
    }
    if (suffix) {
        if (finalParts.length > 0) {
            finalParts[finalParts.length - 1] = finalParts[finalParts.length - 1] + suffix;
        } else {
            finalParts.push(suffix);
        }
    }

    // Preserve initial / trailing punctuation from the original word
    const leadingPunct = trimmed.match(/^[^a-zA-Z0-9]+/)?.[0] || '';
    const trailingPunct = trimmed.match(/[^a-zA-Z0-9]+$/)?.[0] || '';
    if (finalParts.length > 0) {
        finalParts[0] = leadingPunct + finalParts[0];
        finalParts[finalParts.length - 1] = finalParts[finalParts.length - 1] + trailingPunct;
    }

    return finalParts.length > 0 ? finalParts : [trimmed];
}

/**
 * Tokenizes raw lyrics text (lines) into a flat list of sync units (words or syllables).
 * 
 * @param {string} text - Raw lyric text with line breaks
 * @param {'word'|'syllable'} [mode='word'] - Splitting mode
 * @returns {Array<{ id: string, text: string, word: string, lineIndex: number, wordIndex: number, syllableIndex: number, isWordEnd: boolean, isLineEnd: boolean }>}
 */
export function tokenizeLyrics(text, mode = 'word') {
    if (!text || typeof text !== 'string') return [];

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const tokens = [];
    let globalIndex = 0;

    lines.forEach((line, lineIndex) => {
        const words = line.split(/\s+/).filter(Boolean);
        words.forEach((word, wordIndex) => {
            const isLineEndWord = (wordIndex === words.length - 1);

            if (mode === 'syllable') {
                const syllables = splitWordIntoSyllables(word);
                syllables.forEach((syl, sylIndex) => {
                    const isWordEnd = (sylIndex === syllables.length - 1);
                    tokens.push({
                        id: `token-${globalIndex++}`,
                        text: syl,
                        word: word,
                        lineIndex,
                        wordIndex,
                        syllableIndex: sylIndex,
                        isWordEnd,
                        isLineEnd: isLineEndWord && isWordEnd
                    });
                });
            } else {
                tokens.push({
                    id: `token-${globalIndex++}`,
                    text: word,
                    word: word,
                    lineIndex,
                    wordIndex,
                    syllableIndex: 0,
                    isWordEnd: true,
                    isLineEnd: isLineEndWord
                });
            }
        });
    });

    return tokens;
}

/**
 * Manages the state of synchronized markers and live stamping.
 */
export class SyllableSyncManager {
    constructor(options = {}) {
        this.mode = options.mode || 'word'; // 'word' | 'syllable'
        this.tokens = [];
        this.markers = []; // Synced markers [{ id, text, startMs, endMs, lineIndex, ... }]
        this.pendingTokenIndex = 0;
        this.history = []; // Undo stack
        this.defaultDurationMs = options.defaultDurationMs || 350;
    }

    /**
     * Loads and parses raw lyric text into tokens.
     * @param {string} text
     * @param {'word'|'syllable'} [mode]
     */
    loadText(text, mode = this.mode) {
        this.mode = mode;
        this.tokens = tokenizeLyrics(text, mode);
        this.markers = [];
        this.pendingTokenIndex = 0;
        this.history = [];
    }

    /**
     * Imports pre-existing Medixly lyrics data structure (e.g. from lyrics-data.js).
     * @param {Array<{ start: number, end: number, words: Array<{ text: string, start: number }> }>} lyricsArray
     */
    loadFromMedixlyLyrics(lyricsArray) {
        if (!Array.isArray(lyricsArray)) return;
        this.markers = [];
        this.tokens = [];
        let globalIndex = 0;

        lyricsArray.forEach((lineObj, lineIndex) => {
            const words = lineObj.words || [];
            words.forEach((w, wordIndex) => {
                const startMs = Math.round(w.start * 1000);
                // Determine endMs: either next word start or line end
                let endMs = startMs + this.defaultDurationMs;
                if (wordIndex < words.length - 1 && words[wordIndex + 1]?.start) {
                    endMs = Math.round(words[wordIndex + 1].start * 1000);
                } else if (lineObj.end) {
                    endMs = Math.round(lineObj.end * 1000);
                }

                const marker = {
                    id: `marker-${globalIndex++}`,
                    text: w.text,
                    word: w.text,
                    startMs,
                    endMs: Math.max(startMs + 50, endMs),
                    lineIndex,
                    wordIndex,
                    syllableIndex: 0,
                    isWordEnd: true,
                    isLineEnd: (wordIndex === words.length - 1),
                    type: lineObj.trending ? 'hook' : 'lyric'
                };
                this.markers.push(marker);

                this.tokens.push({
                    id: `token-${marker.id}`,
                    text: w.text,
                    word: w.text,
                    lineIndex,
                    wordIndex,
                    syllableIndex: 0,
                    isWordEnd: true,
                    isLineEnd: marker.isLineEnd
                });
            });
        });

        this.markers.sort((a, b) => a.startMs - b.startMs);
        this.pendingTokenIndex = this.tokens.length; // all marked
    }

    /**
     * Returns the currently active/pending token that will be stamped on next trigger.
     * @returns {object|null}
     */
    getCurrentPendingToken() {
        if (this.pendingTokenIndex < this.tokens.length) {
            return this.tokens[this.pendingTokenIndex];
        }
        return null;
    }

    /**
     * Returns preview window of tokens around the pending token:
     * { previous: token|null, current: token|null, next: token|null }
     */
    getPrompterContext() {
        return {
            previous: this.pendingTokenIndex > 0 ? this.tokens[this.pendingTokenIndex - 1] : null,
            current: this.getCurrentPendingToken(),
            next: (this.pendingTokenIndex + 1 < this.tokens.length) ? this.tokens[this.pendingTokenIndex + 1] : null,
            progress: {
                synced: this.pendingTokenIndex,
                total: this.tokens.length,
                percent: this.tokens.length > 0 ? Math.round((this.pendingTokenIndex / this.tokens.length) * 100) : 0
            }
        };
    }

    /**
     * Drops a marker at the given millisecond timestamp.
     * Automatically sets previous marker's endMs to avoid unwanted overlaps.
     * 
     * @param {number} timeMs - Timestamp in milliseconds
     * @param {object} [options]
     * @param {string} [options.overrideText]
     * @param {string} [options.type='lyric']
     * @returns {object} The created marker
     */
    dropMarker(timeMs, options = {}) {
        const roundedTime = Math.max(0, Math.round(timeMs));
        const pendingToken = this.getCurrentPendingToken();
        const text = options.overrideText || (pendingToken ? pendingToken.text : `Marker ${this.markers.length + 1}`);
        const tokenLineIndex = pendingToken ? pendingToken.lineIndex : 0;
        const tokenWordIndex = pendingToken ? pendingToken.wordIndex : 0;
        const isWordEnd = pendingToken ? pendingToken.isWordEnd : true;
        const isLineEnd = pendingToken ? pendingToken.isLineEnd : false;

        // Check if there is an immediately preceding marker to cap its duration
        const lastMarker = this.markers[this.markers.length - 1];
        let prevEndMs = null;
        if (lastMarker && lastMarker.startMs < roundedTime) {
            prevEndMs = lastMarker.endMs;
            // Cap duration to the new marker's start time if it was extending past
            if (lastMarker.endMs > roundedTime || (roundedTime - lastMarker.startMs < 2000)) {
                lastMarker.endMs = roundedTime;
            }
        }

        const markerId = `m-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newMarker = {
            id: markerId,
            text,
            word: pendingToken ? pendingToken.word : text,
            startMs: roundedTime,
            endMs: roundedTime + this.defaultDurationMs,
            lineIndex: tokenLineIndex,
            wordIndex: tokenWordIndex,
            isWordEnd,
            isLineEnd,
            type: options.type || (pendingToken ? 'lyric' : 'beat')
        };

        this.markers.push(newMarker);
        this.markers.sort((a, b) => a.startMs - b.startMs);

        // Record history entry for undo
        this.history.push({
            action: 'add',
            markerId,
            lastMarkerId: lastMarker?.id,
            prevEndMs,
            tokenIndexBefore: this.pendingTokenIndex
        });

        if (pendingToken) {
            this.pendingTokenIndex++;
        }

        return newMarker;
    }

    /**
     * Undoes the last dropped marker and restores the sync token cursor.
     * @returns {boolean}
     */
    undo() {
        if (this.history.length === 0) return false;
        const entry = this.history.pop();

        if (entry.action === 'add') {
            const idx = this.markers.findIndex(m => m.id === entry.markerId);
            if (idx !== -1) {
                this.markers.splice(idx, 1);
            }
            if (entry.lastMarkerId && entry.prevEndMs !== null) {
                const prev = this.markers.find(m => m.id === entry.lastMarkerId);
                if (prev) {
                    prev.endMs = entry.prevEndMs;
                }
            }
            this.pendingTokenIndex = entry.tokenIndexBefore;
            return true;
        }

        return false;
    }

    /**
     * Skips the current pending token without creating a marker.
     */
    skipToken() {
        if (this.pendingTokenIndex < this.tokens.length) {
            this.history.push({
                action: 'skip',
                tokenIndexBefore: this.pendingTokenIndex
            });
            this.pendingTokenIndex++;
            return true;
        }
        return false;
    }

    /**
     * Resets the synchronization prompter back to the beginning.
     */
    resetSync() {
        this.pendingTokenIndex = 0;
        this.markers = [];
        this.history = [];
    }

    /**
     * Updates an existing marker's properties.
     * @param {string} markerId
     * @param {object} updates
     */
    updateMarker(markerId, updates) {
        const marker = this.markers.find(m => m.id === markerId);
        if (!marker) return false;

        if (typeof updates.startMs === 'number') marker.startMs = Math.max(0, Math.round(updates.startMs));
        if (typeof updates.endMs === 'number') marker.endMs = Math.max(marker.startMs + 20, Math.round(updates.endMs));
        if (typeof updates.text === 'string') marker.text = updates.text;
        if (typeof updates.type === 'string') marker.type = updates.type;

        this.markers.sort((a, b) => a.startMs - b.startMs);
        return true;
    }

    /**
     * Removes a marker by ID.
     * @param {string} markerId
     */
    deleteMarker(markerId) {
        const idx = this.markers.findIndex(m => m.id === markerId);
        if (idx !== -1) {
            this.markers.splice(idx, 1);
            return true;
        }
        return false;
    }

    /**
     * Shifts a marker by delta milliseconds.
     * @param {string} markerId
     * @param {number} deltaMs
     */
    nudgeMarker(markerId, deltaMs) {
        const marker = this.markers.find(m => m.id === markerId);
        if (!marker) return false;

        const duration = marker.endMs - marker.startMs;
        const newStart = Math.max(0, marker.startMs + deltaMs);
        marker.startMs = newStart;
        marker.endMs = newStart + duration;

        this.markers.sort((a, b) => a.startMs - b.startMs);
        return true;
    }

    /**
     * Quantizes all markers to the nearest beat in the beat grid.
     * @param {Array<{ timeMs: number }>} beatGrid
     * @param {number} [maxDistanceMs=150]
     */
    quantizeToBeatGrid(beatGrid, maxDistanceMs = 150) {
        if (!beatGrid || beatGrid.length === 0) return 0;
        let quantizedCount = 0;

        for (const marker of this.markers) {
            let closest = null;
            let minDiff = Infinity;
            for (const b of beatGrid) {
                const diff = Math.abs(b.timeMs - marker.startMs);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = b;
                }
            }
            if (closest && minDiff <= maxDistanceMs) {
                const duration = marker.endMs - marker.startMs;
                marker.startMs = closest.timeMs;
                marker.endMs = closest.timeMs + duration;
                quantizedCount++;
            }
        }

        this.markers.sort((a, b) => a.startMs - b.startMs);
        return quantizedCount;
    }

    /**
     * Returns an active marker at a given timecode (for timeline highlighting).
     * @param {number} timeMs
     * @returns {object|null}
     */
    getMarkerAtTime(timeMs) {
        return this.markers.find(m => timeMs >= m.startMs && timeMs <= m.endMs) || null;
    }
}
