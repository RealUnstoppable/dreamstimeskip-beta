// js/theme-loader.js
import { auth, db, getCachedUserProfile } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

(function() {
    const localTheme = localStorage.getItem('userTheme');
    const localAccent = localStorage.getItem('userAccent');
    if (localTheme) {
        let t = localTheme;
        if (t === 'dark') t = 'black';
        if (t === 'light') t = 'white';
        document.body.dataset.theme = t;
    }
    if (localAccent) {
        if (localAccent.startsWith('#')) {
            document.documentElement.style.setProperty('--accent-color', localAccent);
        } else {
            document.body.dataset.accent = localAccent;
        }
    }
})();

const applyTheme = (theme, accentColor) => {
    let t = theme || 'black';
    if (t === 'dark') t = 'black';
    if (t === 'light') t = 'white';
    document.body.dataset.theme = t;
    
    if (accentColor && accentColor.startsWith('#')) {
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.body.removeAttribute('data-accent');
    } else {
        document.body.dataset.accent = accentColor || 'blue';
        document.documentElement.style.removeProperty('--accent-color');
    }

    // Persist theme for non-logged-in users
    if (!auth.currentUser) {
        localStorage.setItem('userTheme', document.body.dataset.theme);
        localStorage.setItem('userAccent', accentColor || 'blue');
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userData = await getCachedUserProfile({uid: user.uid});
            if (userData) {
                applyTheme(userData.theme, userData.accentColor);
            } else {
                applyTheme('black', 'blue');
            }
        } catch (error) {
            console.error("Manager info: Error loading theme from Firestore:", error.message);
            applyTheme('black', 'blue');
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
