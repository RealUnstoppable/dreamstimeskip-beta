import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const downloadDir = '/Users/catalinandrian/Downloads/Songs';
const configFile = path.join(process.env.HOME, '.config/configstore/firebase-tools.json');
const bucket = 'dts-hub-website.firebasestorage.app';

function getAccessToken() {
    const cfg = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return cfg.tokens.access_token;
}

async function uploadResumable(fn, token) {
    const filePath = path.join(downloadDir, fn);
    const stats = fs.statSync(filePath);
    const downloadToken = crypto.randomUUID();

    // 1. Initiate session with metadata included
    const initRes = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=resumable&name=${encodeURIComponent('music/' + fn)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Type': 'audio/mpeg',
            'X-Upload-Content-Length': stats.size.toString()
        },
        body: JSON.stringify({
            metadata: {
                firebaseStorageDownloadTokens: downloadToken
            }
        })
    });

    const uploadUrl = initRes.headers.get('Location');
    if (!uploadUrl) {
        const text = await initRes.text();
        throw new Error(`Failed to initiate upload session (${initRes.status}): ${text}`);
    }

    // 2. Stream data to resumable endpoint
    const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Length': stats.size.toString(),
            'Content-Type': 'audio/mpeg'
        },
        duplex: 'half',
        body: fs.createReadStream(filePath)
    });

    if (!putRes.ok) {
        const text = await putRes.text();
        throw new Error(`Upload PUT failed (${putRes.status}): ${text}`);
    }

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent('music/' + fn)}?alt=media&token=${downloadToken}`;
    return {
        filename: fn,
        token: downloadToken,
        url: publicUrl,
        size: stats.size
    };
}

async function main() {
    let token = getAccessToken();

    const allDownloads = fs.readdirSync(downloadDir).filter(f => f.endsWith('.mp3'));
    const fbItems = JSON.parse(fs.readFileSync('/tmp/firebase_music_items.json', 'utf8'));
    const fbNames = new Set(fbItems.map(i => path.basename(i.name)));

    const toUpload = allDownloads.filter(f => !fbNames.has(f));
    if (!toUpload.includes('krushdafight-n2uthehartlocker.mp3')) {
        toUpload.push('krushdafight-n2uthehartlocker.mp3');
    }

    const resultsFile = 'scratch/uploaded_songs.json';
    let results = {};
    if (fs.existsSync(resultsFile)) {
        try {
            results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        } catch (_) {}
    }

    const pending = toUpload.filter(fn => !results[fn]);
    console.log(`Total target files: ${toUpload.length}. Already recorded: ${Object.keys(results).length}. Pending: ${pending.length}.`);

    let count = Object.keys(results).length;
    for (const fn of pending) {
        let attempts = 0;
        let success = false;
        while (attempts < 3 && !success) {
            attempts++;
            try {
                const uploaded = await uploadResumable(fn, token);
                results[fn] = uploaded;
                count++;
                console.log(`[${count}/${toUpload.length}] Successfully uploaded ${fn} (${(uploaded.size / 1024 / 1024).toFixed(2)} MB)`);
                fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2), 'utf8');
                success = true;
            } catch (err) {
                console.error(`Attempt ${attempts} failed for ${fn}:`, err.message);
                if (err.message.includes('401')) {
                    // refresh token
                    token = getAccessToken();
                }
                if (attempts < 3) {
                    await new Promise(r => setTimeout(r, 2000));
                }
            }
        }
    }

    console.log(`All uploads complete! Total uploaded in map: ${Object.keys(results).length}`);
}

main().catch(err => {
    console.error('Fatal upload error:', err);
    process.exit(1);
});
