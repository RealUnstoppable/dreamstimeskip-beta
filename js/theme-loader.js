// js/theme-loader.js
import { auth, db, getCachedUserProfile } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getCachedUserProfile } from './auth.js';

(function() {
    const localTheme = localStorage.getItem('userTheme');
    const localAccent = localStorage.getItem('userAccent');
    if (localTheme) document.body.dataset.theme = localTheme;
    if (localAccent) document.body.dataset.accent = localAccent;
})();

const applyTheme = (theme, accentColor) => {
    document.body.dataset.theme = theme || 'dark';
    document.body.dataset.accent = accentColor || 'blue';

    // Persist theme for non-logged-in users
    if (!auth.currentUser) {
        localStorage.setItem('userTheme', document.body.dataset.theme);
        localStorage.setItem('userAccent', document.body.dataset.accent);
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userData = await getCachedUserProfile({uid: user.uid});
            if (userData) {
                applyTheme(userData.theme, userData.accentColor);
            } else {
                applyTheme('dark', 'blue');
            }
        } catch (error) {
            console.error("Error loading theme from Firestore:", error.message);
            applyTheme('dark', 'blue');
        }
    } else {
        // Load theme from localStorage for guests
        const localTheme = localStorage.getItem('userTheme');
        const localAccent = localStorage.getItem('userAccent');
        applyTheme(localTheme, localAccent);
    }
});

// Expose a function to be called from the account page for instant theme updates
window.updateTheme = applyTheme;