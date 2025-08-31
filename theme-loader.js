// theme-loader.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const applyTheme = (userData) => {
    const theme = userData?.theme || 'dark'; // Default to dark if not set
    const accentColor = userData?.accentColor || 'blue'; // Default to blue
    
    document.body.dataset.theme = theme;
    document.body.dataset.accent = accentColor;
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                applyTheme(userDoc.data());
            } else {
                applyTheme(null); // Apply default theme if user doc not found
            }
        } catch (error) {
            console.error("Error loading theme:", error);
            applyTheme(null); // Apply default theme on error
        }
    } else {
        // Not logged in, apply default theme
        applyTheme(null);
    }
});