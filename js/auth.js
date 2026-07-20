// js/auth.js
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { app, auth, db } from "./firebase.js";

import { escapeHTML } from './utils.js';

// Re-export instances for scripts that import from auth.js
export { app, auth, db };



onAuthStateChanged(auth, async (user) => {
    const authLink = document.getElementById('auth-link');
    const membershipStatusContainer = document.getElementById('membership-status-container');

    if (user) {
        // User is signed in
        const cacheKey = `profile_${user.uid}`;
        const cachedProfile = sessionStorage.getItem(cacheKey);
        let userData = null;

        if (cachedProfile) {
            userData = JSON.parse(cachedProfile);
        } else {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    userData = userDoc.data();
                    sessionStorage.setItem(cacheKey, JSON.stringify(userData));
                }
            } catch (error) {
                console.error("Manager info: Error fetching user profile during auth state change:", error);
            }
        }

        if (userData) {
            const destination = userData.isAdmin ? 'admin.html' : 'account.html';

            if (authLink) {
                authLink.href = destination;
                authLink.textContent = "My Account";
            }

            if (membershipStatusContainer) {
                membershipStatusContainer.innerHTML = `<span class="membership-status ${escapeHTML(userData.membershipLevel)}">${escapeHTML(userData.membershipLevel)}</span>`;
            }

            const currentPath = window.location.pathname;
            if (currentPath.includes('sign%20in%20beta.html') || currentPath.includes('sign in beta.html')) {
                window.location.replace(destination);
                return;
            }
        }
    } else {
        // User is signed out
        if (authLink) {
            authLink.href = 'sign in beta.html';
            authLink.textContent = "Sign In / Sign Up";
        }

        if (membershipStatusContainer) {
            membershipStatusContainer.innerHTML = '';
        }

        const currentPath = window.location.pathname;
        if (currentPath.includes('account.html') || currentPath.includes('admin.html')) {
            window.location.replace('sign in beta.html');
            return;
        }
    }
});

if (document.getElementById('auth-form')) {
    const form = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleLink = document.getElementById('toggle-form');
    const usernameGroup = document.getElementById('username-group');
    const messageEl = document.getElementById('message');

    let isSignUp = false;

    const updateFormView = () => {
        formTitle.textContent = isSignUp ? 'Sign Up' : 'Sign In';
        usernameGroup.style.display = isSignUp ? 'block' : 'none';
        document.getElementById('username').required = isSignUp;
        submitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
        toggleLink.textContent = isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up";
        messageEl.textContent = '';
    };

    toggleLink.addEventListener('click', e => {
        e.preventDefault();
        isSignUp = !isSignUp;
        updateFormView();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value.trim();

        messageEl.textContent = '';
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            if (isSignUp) {
                if (!username || !email || !password) {
                    showMessage("All fields are required.");
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    username: username || "User",
                    email: email, // FIX: Use the local variable directly instead of the credential object
                    signupDate: serverTimestamp(),
                    isBanned: false,
                    isAdmin: false, 
                    membershipLevel: 'free'
                });
                sessionStorage.setItem('newUser', 'true');
                window.location.replace('account.html');
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

                if (userDoc.exists() && !userDoc.data().isBanned) {
                    const destination = userDoc.data().isAdmin ? 'admin.html' : 'account.html';
                    window.location.replace(destination);
                } else {
                    await signOut(auth);
                    showMessage("This account is suspended or does not exist.");
                }
            }
        } catch (error) {
            console.error(`${isSignUp ? 'Signup' : 'Signin'} Error - Manager info:`, error.message);
            showMessage(getFirebaseErrorMessage(error));
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    function showMessage(msg) { messageEl.textContent = msg; }
    updateFormView();
}

export function getFirebaseErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}
