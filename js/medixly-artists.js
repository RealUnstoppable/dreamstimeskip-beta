import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc, getDocs, doc, updateDoc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { app } from "./firebase.js";

const storage = getStorage(app);
let currentUser = null;

const newUploadBtn = document.getElementById('new-upload-btn');
const uploadSection = document.getElementById('upload-section');
const publishBtn = document.getElementById('publish-btn');
const artistLibrary = document.getElementById('artist-library');
const audioPreview = document.getElementById('audio-preview');
const fileInput = document.getElementById('track-file');
const lyricsContainer = document.getElementById('lyrics-container');
const addLyricBtn = document.getElementById('add-lyric-btn');

let audioBlobUrl = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loadArtistLibrary();
    } else {
        artistLibrary.innerHTML = "<p>Please <a href='sign in beta.html'>sign in</a> to view your library.</p>";
        newUploadBtn.style.display = 'none';
    }
});

newUploadBtn.addEventListener('click', () => {
    uploadSection.style.display = uploadSection.style.display === 'none' ? 'block' : 'none';
});


const artInput = document.getElementById('track-art');

fileInput.addEventListener('change', (e) => {
    const display = document.getElementById('file-name-display');
    if (e.target.files.length > 0) {
        if (display) display.innerHTML = `<span style="color:#fff">${e.target.files[0].name}</span>`;
        if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
        audioBlobUrl = URL.createObjectURL(e.target.files[0]);
        audioPreview.src = audioBlobUrl;
        audioPreview.style.display = 'block';
    } else {
        if (display) display.innerHTML = '<span>Browse</span> or drop audio file';
    }
});

artInput.addEventListener('change', (e) => {
    const display = document.getElementById('art-name-display');
    if (e.target.files.length > 0) {
        if (display) display.innerHTML = `<span style="color:#fff">${e.target.files[0].name}</span>`;
    } else {
        if (display) display.innerHTML = '<span>Browse</span> or drop image';
    }
});

function createLyricLine(time = 0, text = "") {
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.innerHTML = `
        <input type="number" step="0.1" class="lyric-time search-style-input" placeholder="0.0" value="${time}">
        <input type="text" class="lyric-text search-style-input" placeholder="Lyric text" value="${text}">
        <button class="sync-btn" title="Sync to Audio">Sync</button>
        <button class="remove-btn" title="Remove Line">&times;</button>
    `;
    
    div.querySelector('.sync-btn').addEventListener('click', () => {
        div.querySelector('.lyric-time').value = audioPreview.currentTime.toFixed(1);
    });
    
    div.querySelector('.remove-btn').addEventListener('click', () => {
        div.remove();
    });
    
    lyricsContainer.appendChild(div);
}

addLyricBtn.addEventListener('click', () => createLyricLine());

// Start with one empty line
createLyricLine();

publishBtn.addEventListener('click', async () => {
    const title = document.getElementById('track-title').value.trim();
    const credits = document.getElementById('track-credits').value.trim();
    const file = document.getElementById('track-file').files[0];
    const artFile = document.getElementById('track-art').files[0];

    if (!title || !file) {
        alert("Title and Audio File are required.");
        return;
    }

    publishBtn.textContent = "Uploading (Please wait)...";
    publishBtn.disabled = true;

    try {
        // Upload audio
        const audioRef = ref(storage, `artist_tracks/${currentUser.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(audioRef, file);
        const audioUrl = await getDownloadURL(audioRef);

        let artUrl = "/images/medixly-logo.png"; // default
        if (artFile) {
            const artRef = ref(storage, `artist_tracks/${currentUser.uid}/${Date.now()}_${artFile.name}`);
            await uploadBytes(artRef, artFile);
            artUrl = await getDownloadURL(artRef);
        }

        // Gather lyrics
        const lyrics = [];
        document.querySelectorAll('.lyric-line').forEach(line => {
            const time = parseFloat(line.querySelector('.lyric-time').value) || 0;
            const text = line.querySelector('.lyric-text').value.trim();
            if (text) {
                lyrics.push({ time, text });
            }
        });
        
        // Sort lyrics by time
        lyrics.sort((a, b) => a.time - b.time);

        const trackData = {
            artistId: currentUser.uid,
            artistName: currentUser.displayName || "Unknown Artist",
            title,
            credits,
            audioUrl,
            artUrl,
            lyrics,
            isHidden: false,
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "artist_tracks"), trackData);
        alert("Track uploaded successfully!");
        
        // Reset form
        document.getElementById('track-title').value = '';
        document.getElementById('track-credits').value = '';
        document.getElementById('track-file').value = '';
        document.getElementById('track-art').value = '';
        lyricsContainer.innerHTML = '';
        createLyricLine();
        audioPreview.style.display = 'none';
        audioPreview.src = '';
        uploadSection.style.display = 'none';
        
        loadArtistLibrary();
    } catch (e) {
        console.error(e);
        alert("Upload failed. Make sure Firebase Storage is enabled and rules allow writes.");
    } finally {
        publishBtn.textContent = "Process & Publish";
        publishBtn.disabled = false;
    }
});

async function loadArtistLibrary() {
    artistLibrary.innerHTML = "<p>Loading tracks...</p>";
    try {
        const q = query(collection(db, "artist_tracks"), where("artistId", "==", currentUser.uid));
        const snap = await getDocs(q);
        if (snap.empty) {
            artistLibrary.innerHTML = "<p style='color: #aaa;'>No tracks uploaded yet.</p>";
            return;
        }

        artistLibrary.innerHTML = "";
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const div = document.createElement('div');
            div.className = 'library-item';
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${data.artUrl || '/images/medixly-logo.png'}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
                    <div>
                        <h4 style="margin: 0;">${data.title}</h4>
                        <div style="font-size: 0.8rem; color: #aaa;">${data.credits || 'No credits'}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${data.isHidden ? '<span class="hidden-badge">Hidden</span>' : ''}
                    <button class="btn-primary toggle-hide-btn" data-id="${docSnap.id}" data-hidden="${!!data.isHidden}" style="background: #444; padding: 6px 12px;">
                        ${data.isHidden ? 'Show' : 'Hide'}
                    </button>
                </div>
            `;
            artistLibrary.appendChild(div);
        });

        document.querySelectorAll('.toggle-hide-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const isHidden = e.target.dataset.hidden === 'true';
                try {
                    await updateDoc(doc(db, "artist_tracks", id), { isHidden: !isHidden });
                    loadArtistLibrary();
                } catch (err) {
                    alert("Failed to update visibility.");
                }
            });
        });
    } catch (e) {
        console.error(e);
        artistLibrary.innerHTML = "<p style='color: red;'>Failed to load library.</p>";
    }
}
