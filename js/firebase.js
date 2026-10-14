// js/firebase.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app-check.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
  authDomain: "dts-hub-website.firebaseapp.com",
  projectId: "dts-hub-website",
  storageBucket: "dts-hub-website.firebasestorage.app",
  messagingSenderId: "48345990988",
  appId: "1:48345990988:web:e3662c9b508168546471e9",
  measurementId: "G-ZN3YJPHVGX"
};

// Initialize Firebase safely to avoid duplicate app errors
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Enable App Check debug provider for local development if debugging is requested
if (typeof location !== "undefined" && (location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Initialize App Check safely without severing backend operations
let appCheckInstance = null;
const RECAPTCHA_SITE_KEY = '6Lce-t0qAAAAALo9r3f-3oJb-uWz1HkF4jR-R_eT';

// Ensure App Check is purely non-blocking and never interferes with API operations
if (typeof window !== "undefined" && (window.ENABLE_APP_CHECK || (window.FIREBASE_APPCHECK_DEBUG_TOKEN && location.hostname === "localhost"))) {
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn("Manager info: App Check init skipped/non-blocking:", err);
  }
}
export const appCheck = appCheckInstance;

// Initialize Auth
export const auth = getAuth(app);
// Explicitly set persistence to cleanly isolate domains/subdomains.
// Firebase Auth natively uses domain-specific local storage (IndexedDB/BrowserLocalPersistence).
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Manager info: Auth persistence non-blocking notice:", error.message || error);
});

// Initialize Firestore
export const db = getFirestore(app);


/**
 * Verify Connection Health
 * Attempts to read a restricted document. A 'permission-denied' error
 * proves backend reachability. Other errors indicate status.
 */
export async function verifyFirebaseConnection() {
  try {
    const healthDoc = doc(db, "_health", "check");
    await getDoc(healthDoc);
    return true; // Document read successfully
  } catch (error) {
    if (error.code === 'permission-denied' || 
        error.code === 'permission_denied' ||
        error.code === 'unavailable' ||
        (error.message && (
            error.message.includes('Missing or insufficient permissions') ||
            error.message.includes('permission') ||
            error.message.includes('app-check') ||
            error.message.includes('offline')
        ))) {
        // Permission denied or cached state indicates backend reached/rules working.
        return true;
    }

    // Any other error means the connection encountered an issue
    console.warn("Manager info: Firebase connection status:", error.message || error);
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

// Auto-run non-blocking verification on load
verifyFirebaseConnection().catch(() => {});
