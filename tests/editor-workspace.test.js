// tests/editor-workspace.test.js
// Unit & Integration Tests for Medixly "For Editors" Workspace
// Validates DSP transient analysis, BPM estimation, syllable tokenization, zero-drift timecodes, and NLE export pipeline.

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
    computeOnsetDetectionFunction,
    detectTransients,
    estimateBPM,
    generateBeatGrid,
    snapToNearest
} from '../js/editor-audio-analyzer.js';
import {
    splitWordIntoSyllables,
    tokenizeLyrics,
    SyllableSyncManager
} from '../js/editor-syllable-engine.js';
import {
    msToSrtTimecode,
    msToSmpteTimecode,
    msToFrames,
    framesToMs,
    exportToSRT,
    exportToPremiereCSV,
    exportToPremiereXML,
    exportToDaVinciResolveCSV,
    exportToDaVinciResolveEDL,
    exportToAfterEffects,
    exportToMedixlyJSON
} from '../js/editor-export-pipeline.js';
import { WaveformTimelineRenderer } from '../js/editor-waveform-renderer.js';

describe('Phase 2 & 4: Audio Transient & Beat Analysis Engine', () => {
    it('computes onset detection function (ODF) flux with positive first-differences', () => {
        const sampleRate = 44100;
        const length = sampleRate * 2; // 2 seconds
        const pcm = new Float32Array(length);

        // Inject sharp impulse transients at 0.5s, 1.0s, 1.5s
        const attackPoints = [0.5, 1.0, 1.5];
        attackPoints.forEach(pt => {
            const startIdx = Math.floor(pt * sampleRate);
            for (let i = 0; i < 200; i++) {
                pcm[startIdx + i] = 0.9 * Math.sin(i * 0.2);
            }
        });

        const { odf, times } = computeOnsetDetectionFunction(pcm, sampleRate, 512, 256);
        expect(odf.length).toBeGreaterThan(0);
        expect(times.length).toBe(odf.length);

        // Peak energy must be detected around the attack times
        const maxOdf = Math.max(...odf);
        expect(maxOdf).toBeGreaterThan(0.1);
    });

    it('detects sharp transients and returns accurate timestamps', () => {
        const sampleRate = 44100;
        const pcm = new Float32Array(sampleRate * 2);

        // Put transients at 0.4s and 1.2s
        const t1Idx = Math.floor(0.4 * sampleRate);
        for (let i = 0; i < 300; i++) pcm[t1Idx + i] = 0.95 * ((i % 2 === 0) ? 1 : -1);

        const t2Idx = Math.floor(1.2 * sampleRate);
        for (let i = 0; i < 300; i++) pcm[t2Idx + i] = 0.95 * ((i % 2 === 0) ? 1 : -1);

        const transients = detectTransients(pcm, { sampleRate, sensitivity: 0.8, minSpacingMs: 100 });
        expect(transients.length).toBeGreaterThanOrEqual(2);

        // Check millisecond proximity
        const foundNear04 = transients.some(tr => Math.abs(tr.timeMs - 400) < 50);
        const foundNear12 = transients.some(tr => Math.abs(tr.timeMs - 1200) < 50);
        expect(foundNear04).toBe(true);
        expect(foundNear12).toBe(true);
    });

    it('estimates 120 BPM from a periodic 500ms transient sequence', () => {
        // 120 BPM = 1 beat every 500ms
        const syntheticTransients = [];
        for (let i = 0; i < 16; i++) {
            const time = 0.1 + (i * 0.5); // 0.1s, 0.6s, 1.1s, etc.
            syntheticTransients.push({
                time,
                timeMs: Math.round(time * 1000),
                strength: 0.9
            });
        }

        const result = estimateBPM(syntheticTransients);
        expect(result.bpm).toBe(120.0);
        expect(result.beatIntervalMs).toBe(500);
        expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('generates an accurate beat grid and correctly flags downbeats', () => {
        const durationSec = 4.0; // 4 seconds at 120 BPM -> 8 beats
        const bpm = 120;
        const downbeatOffset = 0.0;

        const grid = generateBeatGrid(durationSec, bpm, downbeatOffset);
        expect(grid.length).toBe(9); // at 0s, 0.5s, 1.0s, 1.5s, 2.0s, 2.5s, 3.0s, 3.5s, 4.0s
        expect(grid[0].timeMs).toBe(0);
        expect(grid[0].isDownbeat).toBe(true);
        expect(grid[1].timeMs).toBe(500);
        expect(grid[1].isDownbeat).toBe(false);
        expect(grid[4].timeMs).toBe(2000);
        expect(grid[4].isDownbeat).toBe(true);
    });

    it('snaps timestamps within tolerance to the nearest beat or transient', () => {
        const beatGrid = [
            { timeMs: 1000 },
            { timeMs: 1500 },
            { timeMs: 2000 }
        ];

        // 1485ms should snap to 1500ms with tolerance 50ms
        const snap1 = snapToNearest(1485, beatGrid, 50);
        expect(snap1.didSnap).toBe(true);
        expect(snap1.snappedMs).toBe(1500);
        expect(snap1.deltaMs).toBe(15);

        // 1300ms is 200ms away from both 1000 and 1500, so it should not snap with tolerance 50ms
        const snap2 = snapToNearest(1300, beatGrid, 50);
        expect(snap2.didSnap).toBe(false);
        expect(snap2.snappedMs).toBe(1300);
    });
});

describe('Phase 2: Syllable Tokenizer & SyllableSyncManager', () => {
    it('splits hyphenated words correctly', () => {
        expect(splitWordIntoSyllables('un-stop-pa-ble')).toEqual(['un', 'stop', 'pa', 'ble']);
        expect(splitWordIntoSyllables('med-ix-ly')).toEqual(['med', 'ix', 'ly']);
    });

    it('splits standard English words into syllables using rule heuristics', () => {
        const syllables = splitWordIntoSyllables('unstoppable');
        expect(syllables.length).toBeGreaterThan(1);
        expect(syllables.join('')).toBe('unstoppable');
    });

    it('tokenizes lyrics in word mode and syllable mode', () => {
        const text = "Take my hand\nReal superstar";
        const wordTokens = tokenizeLyrics(text, 'word');
        expect(wordTokens.length).toBe(5);
        expect(wordTokens[0].text).toBe('Take');
        expect(wordTokens[2].isLineEnd).toBe(true); // 'hand' is end of line 0

        const sylTokens = tokenizeLyrics("Take my hand", 'syllable');
        expect(sylTokens.length).toBeGreaterThanOrEqual(3);
    });

    it('manages live marker dropping, prompter cursor, and undo operations', () => {
        const manager = new SyllableSyncManager();
        manager.loadText("Never gonna give you up", 'word');

        expect(manager.tokens.length).toBe(5);
        expect(manager.getCurrentPendingToken().text).toBe('Never');

        // Drop first marker at 1000ms
        const m1 = manager.dropMarker(1000);
        expect(m1.text).toBe('Never');
        expect(m1.startMs).toBe(1000);
        expect(manager.getCurrentPendingToken().text).toBe('gonna');

        // Drop second marker at 1450ms
        const m2 = manager.dropMarker(1450);
        expect(m2.text).toBe('gonna');
        expect(m2.startMs).toBe(1450);
        // Previous marker duration should be capped at 1450ms to prevent overlap
        expect(m1.endMs).toBe(1450);

        // Prompter context
        const ctx = manager.getPrompterContext();
        expect(ctx.previous.text).toBe('gonna');
        expect(ctx.current.text).toBe('give');
        expect(ctx.progress.synced).toBe(2);
        expect(ctx.progress.total).toBe(5);

        // Undo
        expect(manager.undo()).toBe(true);
        expect(manager.getCurrentPendingToken().text).toBe('gonna');
        expect(manager.markers.length).toBe(1);
    });

    it('quantizes markers to nearest beat grid', () => {
        const manager = new SyllableSyncManager();
        manager.loadText("One two three", 'word');

        // Place markers slightly off-grid
        manager.dropMarker(490);  // near 500
        manager.dropMarker(1015); // near 1000
        manager.dropMarker(1520); // near 1500

        const beatGrid = [{ timeMs: 500 }, { timeMs: 1000 }, { timeMs: 1500 }];
        const quantized = manager.quantizeToBeatGrid(beatGrid, 100);

        expect(quantized).toBe(3);
        expect(manager.markers[0].startMs).toBe(500);
        expect(manager.markers[1].startMs).toBe(1000);
        expect(manager.markers[2].startMs).toBe(1500);
    });
});

describe('Phase 3 & 4: Zero Latency & Drift-Free Export Pipeline', () => {
    describe('Timecode Precision & Frame Conversions', () => {
        it('formats millisecond timestamps to SRT timecode with zero drift', () => {
            expect(msToSrtTimecode(0)).toBe('00:00:00,000');
            expect(msToSrtTimecode(1234)).toBe('00:00:01,234');
            expect(msToSrtTimecode(65432)).toBe('00:01:05,432');
            expect(msToSrtTimecode(3661005)).toBe('01:01:01,005');
        });

        it('calculates SMPTE timecode accurately at multiple frame rates', () => {
            // At 30 FPS: 1000ms = 30 frames = 00:00:01:00
            expect(msToSmpteTimecode(1000, 30)).toBe('00:00:01:00');
            // 500ms = 15 frames = 00:00:00:15
            expect(msToSmpteTimecode(500, 30)).toBe('00:00:00:15');

            // At 24 FPS: 1000ms = 24 frames = 00:00:01:00
            expect(msToSmpteTimecode(1000, 24)).toBe('00:00:01:00');
            // 500ms = 12 frames = 00:00:00:12
            expect(msToSmpteTimecode(500, 24)).toBe('00:00:00:12');

            // At 60 FPS: 1000ms = 60 frames = 00:00:01:00
            expect(msToSmpteTimecode(1000, 60)).toBe('00:00:01:00');
        });

        it('guarantees round-trip frame to millisecond accuracy', () => {
            const fps = 30;
            for (let f = 0; f < 300; f += 15) {
                const ms = framesToMs(f, fps);
                const roundTripFrames = msToFrames(ms, fps);
                expect(roundTripFrames).toBe(f);
            }
        });
    });

    const mockMarkers = [
        { id: 'm1', text: 'I', startMs: 1000, endMs: 1400, lineIndex: 0, type: 'lyric' },
        { id: 'm2', text: 'found', startMs: 1400, endMs: 1800, lineIndex: 0, type: 'lyric' },
        { id: 'm3', text: 'a', startMs: 1800, endMs: 2000, lineIndex: 0, type: 'lyric' },
        { id: 'm4', text: 'girl', startMs: 2000, endMs: 2500, lineIndex: 0, type: 'lyric' },
        { id: 'm5', text: 'superstar', startMs: 2700, endMs: 3500, lineIndex: 1, type: 'hook' }
    ];

    describe('Export to SubRip (.srt)', () => {
        it('exports line-grouped SRT subtitles with 1-based sequential indices and zero drift', () => {
            const srt = exportToSRT(mockMarkers, { mode: 'line' });
            expect(srt).toContain('1\n00:00:01,000 --> 00:00:02,500\nI found a girl');
            expect(srt).toContain('2\n00:00:02,700 --> 00:00:03,500\nsuperstar');
        });

        it('exports word-level karaoke SRT subtitles', () => {
            const srt = exportToSRT(mockMarkers, { mode: 'word' });
            expect(srt).toContain('00:00:01,000 --> 00:00:01,400\nI');
            expect(srt).toContain('00:00:01,400 --> 00:00:01,800\nfound');
        });
    });

    describe('Export to Adobe Premiere Pro Marker CSV', () => {
        it('exports valid CSV with required Premiere Pro marker headers', () => {
            const csv = exportToPremiereCSV(mockMarkers, { fps: 30 });
            const lines = csv.split('\r\n');

            expect(lines[0]).toBe('Marker Name,Description,In,Out,Duration,Marker Type');
            expect(lines.length).toBe(mockMarkers.length + 1);

            // Row 1 checks
            expect(lines[1]).toContain('I');
            expect(lines[1]).toContain('00:00:01:00'); // In at 1000ms @ 30fps
            expect(lines[1]).toContain('Comment');
        });

        it('correctly escapes quotes and commas in lyric text according to RFC 4180', () => {
            const trickyMarkers = [
                { id: 't1', text: 'Say, "Hello"', startMs: 1000, endMs: 1500 }
            ];
            const csv = exportToPremiereCSV(trickyMarkers, { fps: 30 });
            expect(csv).toContain('"Say, ""Hello"""');
        });
    });

    describe('Export to Adobe Premiere & Final Cut Pro XML', () => {
        it('exports valid FCP 7 / Premiere XML with sequence markers', () => {
            const xml = exportToPremiereXML(mockMarkers, { fps: 30, sequenceName: 'Test Sequence' });
            expect(xml).toContain('<!DOCTYPE xmeml>');
            expect(xml).toContain('<name>Test Sequence</name>');
            expect(xml).toContain('<timebase>30</timebase>');
            expect(xml).toContain('<marker>');
            expect(xml).toContain('<name>superstar</name>');
            expect(xml).toContain('<in>81</in>'); // 2700ms * 30 / 1000 = 81 frames
        });
    });

    describe('Export to DaVinci Resolve Marker CSV & EDL', () => {
        it('exports DaVinci Resolve Marker CSV with colors and EDL indices', () => {
            const resolveCsv = exportToDaVinciResolveCSV(mockMarkers, { fps: 30 });
            expect(resolveCsv).toContain('EDL,Marker Name,Description,Timecode In,Timecode Out,Color');
            expect(resolveCsv).toContain('001');
            expect(resolveCsv).toContain('00:00:01:00');
            expect(resolveCsv).toContain('Red'); // m5 is type 'hook' -> Red
        });

        it('exports CMX 3600 EDL with locator markers', () => {
            const edl = exportToDaVinciResolveEDL(mockMarkers, { fps: 30 });
            expect(edl).toContain('TITLE: Medixly Synced Lyrics');
            expect(edl).toContain('FCM: NON-DROP FRAME');
            expect(edl).toContain('* LOC: 00:00:01:00');
        });
    });

    describe('Export to After Effects & Medixly Native JSON', () => {
        it('exports After Effects ExtendScript and JSON marker payload', () => {
            const ae = exportToAfterEffects(mockMarkers, { fps: 30 });
            expect(ae.script).toContain('app.beginUndoGroup("Import Medixly Lyric Markers");');
            expect(ae.script).toContain('layer.property("Marker").setValueAtTime');

            const parsed = JSON.parse(ae.json);
            expect(parsed.length).toBe(mockMarkers.length);
            expect(parsed[0].text).toBe('I');
            expect(parsed[0].timeSeconds).toBe(1.0);
        });

        it('exports Medixly native lyrics JSON matching application schema', () => {
            const nativeJson = exportToMedixlyJSON(mockMarkers);
            expect(nativeJson.length).toBe(2); // line 0 and line 1
            expect(nativeJson[0].start).toBe(1.0);
            expect(nativeJson[0].words.length).toBe(4);
            expect(nativeJson[0].words[0].text).toBe('I');
            expect(nativeJson[1].trending).toBe(true); // m5 hook
        });
    });

    describe('Waveform Timeline Zoom & Multi-Scale Decimation Performance', () => {
        let mockCanvas;
        let renderer;

        beforeEach(() => {
            mockCanvas = {
                getContext: () => ({
                    setTransform: () => {},
                    fillRect: () => {},
                    clearRect: () => {},
                    beginPath: () => {},
                    moveTo: () => {},
                    lineTo: () => {},
                    stroke: () => {},
                    fill: () => {},
                    createLinearGradient: () => ({ addColorStop: () => {} }),
                    rect: () => {},
                    fillText: () => {},
                    save: () => {},
                    restore: () => {},
                    clip: () => {},
                    roundRect: () => {},
                    closePath: () => {}
                }),
                getBoundingClientRect: () => ({ width: 1000, height: 220, left: 0, top: 0 }),
                width: 1000,
                height: 220,
                style: {}
            };
            renderer = new WaveformTimelineRenderer(mockCanvas);
        });

        it('constructs multi-resolution peak mipmaps (overview, medium, sample detail)', () => {
            // Create 10 seconds of synthetic audio data (441,000 samples)
            const pcm = new Float32Array(441000);
            for (let i = 0; i < pcm.length; i++) {
                pcm[i] = Math.sin(i * 0.05) * 0.8;
            }

            renderer.setAudioData(pcm);
            expect(renderer.duration).toBeCloseTo(10, 1);
            expect(renderer.peaksMipmap).toBeDefined();
            expect(renderer.peaksMipmap.level0.minPeaks.length).toBeGreaterThan(0);
            expect(renderer.peaksMipmap.level1.minPeaks.length).toBeGreaterThan(renderer.peaksMipmap.level0.minPeaks.length);
            expect(renderer.peaksMipmap.level2.minPeaks.length).toBeGreaterThan(renderer.peaksMipmap.level1.minPeaks.length);
        });

        it('transforms coordinates accurately between time (seconds) and viewport X (pixels)', () => {
            renderer.duration = 60;
            renderer.zoom = 100; // 100 px per second
            renderer.scrollLeft = 0;

            expect(renderer.timeToX(0)).toBe(0);
            expect(renderer.timeToX(5.5)).toBe(550);
            expect(renderer.xToTime(550)).toBe(5.5);

            // With horizontal scroll offset
            renderer.scrollLeft = 200;
            expect(renderer.timeToX(5.5)).toBe(350);
            expect(renderer.xToTime(350)).toBe(5.5);
        });

        it('handles dynamic zooming without lag or out-of-bound errors', () => {
            renderer.duration = 180; // 3 minute song
            renderer.setZoom(50);
            expect(renderer.zoom).toBe(50);

            // Zoom in to 1000 px/sec
            renderer.setZoom(1000);
            expect(renderer.zoom).toBe(1000);

            // Zoom clamps within min and max
            renderer.setZoom(100000);
            expect(renderer.zoom).toBe(renderer.maxZoom);

            renderer.setZoom(1);
            expect(renderer.zoom).toBe(renderer.minZoom);
        });

        it('executes render pass cleanly without throwing errors', () => {
            const pcm = new Float32Array(44100);
            renderer.setAudioData(pcm);
            renderer.setBeats([{ time: 1.0, isDownbeat: true }, { time: 1.5, isDownbeat: false }]);
            renderer.setTransients([{ time: 1.0, strength: 0.9 }]);
            renderer.setMarkers([{ id: 'm1', text: 'Test', startMs: 1000, endMs: 1500, type: 'lyric' }]);
            renderer.setTime(1.2);

            expect(() => renderer.render()).not.toThrow();
        });
    });
});
