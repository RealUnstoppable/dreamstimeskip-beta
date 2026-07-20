// js/firebase.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app-check.js";
import { getVertexAI } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
  authDomain: "realunstoppable.store",
  projectId: "dts-hub-website",
  storageBucket: "dts-hub-website.firebasestorage.app",
  messagingSenderId: "48345990988",
  appId: "1:48345990988:web:e3662c9b508168546471e9",
  measurementId: "G-ZN3YJPHVGX"
};

// Initialize Firebase safely to avoid duplicate app errors
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check (Commented out to prevent ReCAPTCHA errors until a valid key is provided)
// export const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('6Lce-t0qAAAAALo9r3f-3oJb-uWz1HkF4jR-R_eT'), // Replace with actual reCAPTCHA v3 site key
//   isTokenAutoRefreshEnabled: true
// });

// Initialize Auth
export const auth = getAuth(app);
// Explicitly set persistence to cleanly isolate domains/subdomains.
// Firebase Auth natively uses domain-specific local storage (IndexedDB/BrowserLocalPersistence).
// Sharing auth state between subdomains cannot be done automatically without centralized login logic
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Manager info: [Auth persistence setup failed:]", error);
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize AI Logic
export const ai = getVertexAI(app);

/**
 * Verify Connection Health
 * Attempts to read a restricted document. A 'permission-denied' error
 * proves backend reachability. Other errors indicate true failure.
 */
export async function verifyFirebaseConnection() {
  try {
    const healthDoc = doc(db, "_health", "check");
    await getDoc(healthDoc);
    return true; // Document read successfully
  } catch (error) {
    if (error.code === 'permission-denied' || (error.message && error.message.includes('Missing or insufficient permissions'))) {
        // Permission denied means we reached the server but security rules blocked it.
        // This is a SUCCESSFUL backend connection health check.
        console.log("Firebase connection healthy (backend reached, request blocked by rules).");
        return true;
    }

    // Any other error means the connection failed
    console.error("Manager info: [Firebase connection dead:]", error);
    console.error("Manager info: [Code:]", error.code, "Message:", error.message);

    // Display error banner
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #ef4444;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 9999;
        font-family: sans-serif;
        font-weight: bold;
    `;
    banner.textContent = "Unable to reach Firebase backend services. Some features may not work.";

    // Only append once body exists
    if(document.body) {
        document.body.prepend(banner);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.body.prepend(banner));
    }

    return false;
  }
}

/**
 * Shared Utility to fetch a collection's data
 * @param {string} collectionName
 * @param {boolean} includeId - If true, adds document id to data
 */
export async function fetchCollectionData(collectionName, includeId = false) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => includeId ? { id: doc.id, ...doc.data() } : doc.data());
    } catch (e) {
        console.error(`Manager info: Error fetching collection ${collectionName}`, e);
        return [];
    }
}

// Auto-run verification on load
verifyFirebaseConnection();
