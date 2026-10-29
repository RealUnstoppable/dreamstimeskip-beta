import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const downloadDir = '/Users/catalinandrian/Downloads/Songs';
const configFile = path.join(process.env.HOME, '.config/configstore/firebase-tools.json');
const bucket = 'dts-hub-website.firebasestorage.app';

function getAccessToken() {
    try {
        const cfg = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        return cfg.tokens.access_token;
    } catch (_) {
        execSync('npx firebase projects:list', { stdio: 'ignore' });
        const cfg = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        return cfg.tokens.access_token;
    }
}


async function uploadFile(filename, token) {
    const filePath = path.join(downloadDir, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const downloadToken = crypto.randomUUID();

    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent('music/' + filename)}`;

    const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'audio/mpeg'
        },
        body: fileBuffer
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed for ${filename}: ${res.status} ${text}`);
    }

    // Set download token metadata
    const metaUrl = `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${encodeURIComponent('music/' + filename)}`;
    const patchRes = await fetch(metaUrl, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            metadata: {
                firebaseStorageDownloadTokens: downloadToken
            }
        })
    });

    if (!patchRes.ok) {
        const text = await patchRes.text();
        console.warn(`Failed to set metadata token for ${filename}: ${text}`);
    }

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent('music/' + filename)}?alt=media&token=${downloadToken}`;
    return {
        filename,
        token: downloadToken,
        url: publicUrl,
        size: fileBuffer.length
    };
}

async function main() {
    let token = getAccessToken();

    // Read list of missing files
    const allDownloads = fs.readdirSync(downloadDir).filter(f => f.endsWith('.mp3'));
    const fbItems = JSON.parse(fs.readFileSync('/tmp/firebase_music_items.json', 'utf8'));
    const fbNames = new Set(fbItems.map(i => path.basename(i.name)));

    const toUpload = allDownloads.filter(f => !fbNames.has(f));
    // Also include krushdafight to update with full 4.2MB version
    if (!toUpload.includes('krushdafight-n2uthehartlocker.mp3')) {
        toUpload.push('krushdafight-n2uthehartlocker.mp3');
    }

    console.log(`Starting upload of ${toUpload.length} files to Firebase Storage...`);

    const results = {};
    const batchSize = 3;
    let completed = 0;

    for (let i = 0; i < toUpload.length; i += batchSize) {
        const batch = toUpload.slice(i, i + batchSize);
        await Promise.all(batch.map(async (fn) => {
            try {
                const res = await uploadFile(fn, token);
                if (res) {
                    results[fn] = res;
                    completed++;
                    console.log(`[${completed}/${toUpload.length}] Uploaded ${fn} (${(res.size / 1024 / 1024).toFixed(2)} MB)`);
                }
            } catch (err) {
                console.error(`Error uploading ${fn}:`, err.message);
            }
        }));

        // Periodically save progress
        if (!fs.existsSync('scratch')) {
            fs.mkdirSync('scratch', { recursive: true });
        }
        fs.writeFileSync('scratch/uploaded_songs.json', JSON.stringify(results, null, 2), 'utf8');
    }

    console.log(`Finished! Successfully uploaded ${completed}/${toUpload.length} files.`);
}

main().catch(err => {
    console.error('Fatal upload error:', err);
    process.exit(1);
});
