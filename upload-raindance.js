import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from "fs";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "dummy",
    authDomain: "dts-hub-website.firebaseapp.com",
    projectId: "dts-hub-website",
    storageBucket: "dts-hub-website.firebasestorage.app",
    messagingSenderId: "dummy",
    appId: "dummy"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function upload() {
    try {
        const fileBuffer = fs.readFileSync("/tmp/newsong.mp3");
        const storageRef = ref(storage, "music/raindance-santan-dave.mp3");
        
        console.log("Uploading...");
        await uploadBytes(storageRef, fileBuffer, { contentType: 'audio/mpeg' });
        const url = await getDownloadURL(storageRef);
        console.log("Uploaded URL:", url);
        fs.writeFileSync("/tmp/raindance_url.txt", url);
        process.exit(0);
    } catch (err) {
        console.error("Upload failed", err);
        process.exit(1);
    }
}
upload();
