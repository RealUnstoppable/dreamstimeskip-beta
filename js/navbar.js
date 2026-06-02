import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export function loadNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo">un<span></span></a>
        <ul class="nav-links">
            
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dreamstimeskip.html">Dreams TimeSkip</a></li>
            <li><a href="harmonytunes.html">HarmonyTunes</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="memberships.html">Memberships</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="portfolio.html">About Me</a></li>
            <li><a href="uds.html">UDS</a></li>
            <li><a href="sign in beta.html" id="auth-link">Sign In / Sign Up</a></li>
        </ul>
        <button class="hamburger" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
    </nav>`;

    const header = document.querySelector('.main-header');
    if (header) {
        header.innerHTML = headerHTML;
        attachNavEvents();
        updateAuthLink(); // Check login status immediately after loading
    }
}

function attachNavEvents() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const cacheKey = `profile_${user.uid}`;
                const cachedProfile = sessionStorage.getItem(cacheKey);
                let userData = null;

                if (cachedProfile) {
                    userData = JSON.parse(cachedProfile);
                } else {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        userData = userDoc.data();
                        sessionStorage.setItem(cacheKey, JSON.stringify(userData));
                    }
                }

                const destination = userData && userData.isAdmin ? 'admin.html' : 'account.html';
                authLink.href = destination;
                authLink.textContent = "My Account";
            } catch (e) {
                console.error("Nav Error", e);
            }
        } else {
            authLink.href = 'sign in beta.html';
            authLink.textContent = "Sign In / Sign Up";
        }
    });
}