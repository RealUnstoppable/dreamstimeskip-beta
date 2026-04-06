// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
  authDomain: "dts-hub-website.firebaseapp.com",
  projectId: "dts-hub-website",
  storageBucket: "dts-hub-website.firebasestorage.app",
  messagingSenderId: "48345990988",
  appId: "1:48345990988:web:e3662c9b508168546471e9",
  measurementId: "G-ZN3YJPHVGX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();

// Your deployed Firebase Function Base URL
// 🔴 IMPORTANT: Replace this with your actual Cloud Functions URL once deployed
const FUNCTION_BASE_URL = "https://us-central1-dts-hub-website.cloudfunctions.net";

// 🔹 STRIPE: Process Checkout
export async function processCheckout(planName) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in or create an account to upgrade.");
        window.location.href = 'sign in beta.html';
        return;
    }

    try {
        const res = await fetch(`${FUNCTION_BASE_URL}/createCheckoutSession`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                plan: planName
            })
        });

        const data = await res.json();
        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
            console.error("Stripe Error:", data);
            alert("Error connecting to payment provider.");
        }
    } catch (err) {
        console.error(err);
        alert("Checkout error. Please try again later.");
    }
}

// 🔹 STRIPE: Cancel Subscription
export async function cancelSubscription(customerId) {
    if (!customerId) return;

    const confirmCancel = confirm("Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing cycle.");
    if (!confirmCancel) return;

    try {
        await fetch(`${FUNCTION_BASE_URL}/cancelSubscription`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: customerId })
        });
        alert("Subscription successfully canceled.");
        window.location.reload();
    } catch (err) {
        console.error(err);
        alert("Failed to cancel subscription.");
    }
}