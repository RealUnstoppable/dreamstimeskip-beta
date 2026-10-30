// js/theme-loader.js
import { auth, db, getCachedUserProfile } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const PRESET_ACCENTS = {
    blue: '#2563EB',
    indigo: '#4F46E5',
    purple: '#9333EA',
    pink: '#EC4899',
    green: '#16A34A',
    emerald: '#10B981',
    orange: '#F97316',
    red: '#EF4444',
    cyan: '#06B6D4'
};

function resolveAccentHex(accent) {
    if (!accent) return '#16A34A';
    if (accent.startsWith('#')) return accent;
    return PRESET_ACCENTS[accent.toLowerCase()] || '#16A34A';
}

function hexToRgba(hex, alpha = 1) {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
        clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

(function() {
    const localTheme = localStorage.getItem('userTheme');
    const localAccent = localStorage.getItem('userAccent') || 'green';
    if (localTheme) {
        let t = localTheme;
        if (t === 'dark') t = 'black';
        if (t === 'light') t = 'white';
        if (document.body) document.body.dataset.theme = t;
        document.documentElement.dataset.theme = t;
    }
    const hex = resolveAccentHex(localAccent);
    document.documentElement.style.setProperty('--accent-color', hex);
    document.documentElement.style.setProperty('--theme-accent', hex);
    document.documentElement.style.setProperty('--theme-accent-glow', hexToRgba(hex, 0.45));
    document.documentElement.style.setProperty('--theme-accent-subtle', hexToRgba(hex, 0.15));
    if (document.body) {
        if (localAccent.startsWith('#')) {
            document.documentElement.style.setProperty('--accent-color', localAccent);
        } else {
            document.body.dataset.accent = localAccent;
        }
    }
})();

export const applyTheme = (theme, accentColor) => {
    let t = theme || 'black';
    if (t === 'dark') t = 'black';
    if (t === 'light') t = 'white';
    if (document.body) document.body.dataset.theme = t;
    document.documentElement.dataset.theme = t;
    
    const hex = resolveAccentHex(accentColor);
    document.documentElement.style.setProperty('--accent-color', hex);
    document.documentElement.style.setProperty('--theme-accent', hex);
    document.documentElement.style.setProperty('--theme-accent-glow', hexToRgba(hex, 0.45));
    document.documentElement.style.setProperty('--theme-accent-subtle', hexToRgba(hex, 0.15));

    if (document.body) {
        if (accentColor && accentColor.startsWith('#')) {
            document.body.removeAttribute('data-accent');
        } else {
            document.body.dataset.accent = accentColor || 'green';
        }
    }

    // Persist theme for guests
    if (!auth.currentUser) {
        localStorage.setItem('userTheme', t);
        localStorage.setItem('userAccent', accentColor || 'green');
    }

    // Broadcast theme update event to entire UI
    window.dispatchEvent(new CustomEvent('medixly:theme-changed', {
        detail: { theme: t, accent: accentColor || 'green', hex }
    }));
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userData = await getCachedUserProfile({uid: user.uid});
            if (userData) {
                applyTheme(userData.theme, userData.accentColor);
            } else {
                applyTheme('black', 'green');
            }
        } catch (error) {
            console.error("Manager info: Error loading theme from Firestore:", error.message);
            applyTheme('black', 'green');
        }
    } else {
        // Load theme from localStorage for guests
        const localTheme = localStorage.getItem('userTheme');
        const localAccent = localStorage.getItem('userAccent');
        applyTheme(localTheme, localAccent);
    }
});

// Expose globally
window.updateTheme = applyTheme;
window.MedixlyThemeProvider = {
    applyTheme,
    resolveAccentHex,
    presets: PRESET_ACCENTS
};
