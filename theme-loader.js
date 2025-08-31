// theme-loader.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const applyTheme = (userData) => {
    const theme = userData?.theme || 'dark';
    const accentColor = userData?.accentColor || 'blue';
    
    document.body.dataset.theme = theme;
    document.body.dataset.accent = accentColor;

    // Apply custom theme for Ultimate members
    if (userData?.membershipLevel === 'ultimate' && userData?.customTheme) {
        for (const [elementId, colorValue] of Object.entries(userData.customTheme)) {
            const cssVar = document.getElementById(elementId)?.dataset.var;
            if (cssVar) {
                document.body.style.setProperty(cssVar, colorValue);
            }
        }
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            applyTheme(userDoc.exists() ? userDoc.data() : null);
        } catch (error) {
            console.error("Error loading theme:", error);
            applyTheme(null);
        }
    } else {
        applyTheme(null);
    }
});