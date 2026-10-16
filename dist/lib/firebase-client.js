import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
export const firebaseConfig = {
    apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
    authDomain: "dts-hub-website.firebaseapp.com",
    projectId: "dts-hub-website",
    storageBucket: "dts-hub-website.firebasestorage.app",
    messagingSenderId: "48345990988",
    appId: "1:48345990988:web:e3662c9b508168546471e9",
    measurementId: "G-ZN3YJPHVGX"
};
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
