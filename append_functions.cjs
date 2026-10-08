const fs = require('fs');
const file = 'functions/index.js';
let content = fs.readFileSync(file, 'utf8');

const additionalCode = `

// --- SONG PROCESSING BACKEND FUNCTION ---
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const os = require("os");
const path = require("path");
const fetch = require("node-fetch"); // node 20 has native fetch, but let's be safe if it's node 16, wait node 20 native fetch is global.

exports.processUploadedSong = onDocumentCreated("artist_tracks/{trackId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    if (!data.audioUrl) return;

    const trackId = event.params.trackId;
    console.log(\`Processing audio for track: \${trackId}\`);

    const tempFilePath = path.join(os.tmpdir(), \`\${trackId}.tmp\`);

    try {
        // 1. Download the file
        const response = await fetch(data.audioUrl);
        if (!response.ok) throw new Error(\`Failed to fetch audio: \${response.statusText}\`);
        
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(tempFilePath, Buffer.from(buffer));

        // 2. Process with ffmpeg to find inmixPoint
        // We use silencedetect filter: -af silencedetect=noise=-50dB:d=0.1
        const startOffset = await new Promise((resolve, reject) => {
            let detectedOffset = 0;
            ffmpeg(tempFilePath)
                .audioFilters('silencedetect=noise=-40dB:d=0.1')
                .format('null')
                .on('stderr', (line) => {
                    // ffmpeg outputs silencedetect results to stderr
                    const match = line.match(/silence_end: ([0-9.]+)/);
                    if (match && detectedOffset === 0) {
                        detectedOffset = parseFloat(match[1]);
                    }
                })
                .on('end', () => {
                    resolve(detectedOffset);
                })
                .on('error', (err) => {
                    console.error(\`FFmpeg error for \${trackId}:\`, err);
                    resolve(0); // fallback
                })
                .save('pipe:1'); // output to null
        });

        console.log(\`Detected inmixPoint for \${trackId}: \${startOffset}\`);

        // 3. Update the Firestore document
        await snap.ref.update({
            inmixPoint: startOffset || 0,
            processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(\`Successfully processed and updated \${trackId}\`);
    } catch (err) {
        console.error(\`Error processing track \${trackId}:\`, err);
    } finally {
        // Cleanup temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
});
`;

fs.appendFileSync(file, additionalCode);
console.log("Appended processUploadedSong to functions/index.js");
