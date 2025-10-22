// auth.js - Centralized Firebase Initialization and Auth Logic

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
    authDomain: "dts-hub-website.firebaseapp.com",
    projectId: "dts-hub-website",
    storageBucket: "dts-hub-website.appspot.com",
    messagingSenderId: "48345990988",
    appId: "1:48345990988:web:e3662c9b508168546471e9",
    measurementId: "G-ZN3YJPHVGX"
};

// Initialize Firebase and export the instances for other scripts to use
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);