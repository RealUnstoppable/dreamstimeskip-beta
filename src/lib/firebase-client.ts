import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
  authDomain: "dts-hub-website.firebaseapp.com",
  projectId: "dts-hub-website",
  storageBucket: "dts-hub-website.firebasestorage.app",
  messagingSenderId: "48345990988",
  appId: "1:48345990988:web:e3662c9b508168546471e9",
  measurementId: "G-ZN3YJPHVGX"
};

export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
