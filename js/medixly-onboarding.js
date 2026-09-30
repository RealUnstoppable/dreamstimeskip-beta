import { auth, db } from './auth.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Load CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/css/onboarding.css';
document.head.appendChild(link);


// Anti-Bypass System
let antiBypassInterval;

function enforceAntiBypass() {
    const layout = document.querySelector('.spotify-layout');
    if (layout) layout.style.display = 'none';
    
    // Watch for them deleting the overlay via DevTools
    if (antiBypassInterval) clearInterval(antiBypassInterval);
    antiBypassInterval = setInterval(() => {
        if (!auth.currentUser && !document.getElementById('medixly-onboarding')) {
            // They deleted the overlay without logging in!
            window.location.replace('index.html');
        }
    }, 500);
}

function liftAntiBypass() {
    const layout = document.querySelector('.spotify-layout');
    if (layout) layout.style.display = '';
    if (antiBypassInterval) clearInterval(antiBypassInterval);
}

function createOnboardingUI() {
    const overlay = document.createElement('div');
    overlay.className = 'medixly-onboarding-overlay';
    overlay.id = 'medixly-onboarding';
    
    overlay.innerHTML = `
        <div class="medixly-onboarding-card">
            <h2>Welcome to Medixly</h2>
            <p>Create an account to start listening to your favorite tracks.</p>
            
            <form id="medixly-onboarding-form">
                <div class="onboarding-pfp-select">
                    <div class="onboarding-pfp-preview" id="ob-pfp-preview">
                        👤
                    </div>
                    <div style="text-align: left;">
                        <label for="ob-pfp" style="font-size: 12px; color: #ccc; cursor: pointer; text-decoration: underline;">Upload Profile Picture (Optional)</label>
                        <input type="file" id="ob-pfp" accept="image/*" style="display: none;">
                    </div>
                </div>
                
                <div class="onboarding-form-group">
                    <label>Username</label>
                    <input type="text" id="ob-username" required placeholder="cool_dj_99">
                </div>
                
                <div class="onboarding-form-group">
                    <label>Email</label>
                    <input type="email" id="ob-email" required placeholder="you@example.com">
                </div>
                
                <div class="onboarding-form-group">
                    <label>Date of Birth</label>
                    <input type="date" id="ob-dob" required>
                </div>
                
                <div class="onboarding-form-group">
                    <label>Password</label>
                    <input type="password" id="ob-password" required placeholder="••••••••">
                </div>
                
                <button type="submit" class="onboarding-btn" id="ob-submit">Create Account</button>
                <div class="onboarding-error" id="ob-error"></div>
            </form>
            <div style="margin-top: 15px; font-size: 13px; color: #aaa;">
                Already have an account? <a href="/sign in beta.html?redirect=harmonytunes.html" style="color: #bb86fc;">Sign in</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const form = document.getElementById('medixly-onboarding-form');
    const pfpInput = document.getElementById('ob-pfp');
    const pfpPreview = document.getElementById('ob-pfp-preview');
    const errorDiv = document.getElementById('ob-error');
    const submitBtn = document.getElementById('ob-submit');
    
    let selectedPfpBase64 = null;
    
    pfpInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check size < 1MB to avoid bloated firestore docs if they upload a massive image
            if (file.size > 1024 * 1024) {
                alert("File too large. Please select an image under 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                selectedPfpBase64 = ev.target.result;
                pfpPreview.innerHTML = `<img src="${selectedPfpBase64}">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('ob-username').value.trim();
        const email = document.getElementById('ob-email').value.trim();
        const dob = document.getElementById('ob-dob').value;
        const password = document.getElementById('ob-password').value;
        
        if (!username || !email || !dob || !password) {
            errorDiv.textContent = "Please fill in all fields.";
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating Account...";
        errorDiv.textContent = "";
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Set basic profile
            await updateProfile(user, {
                displayName: username
            });
            
            // Default user doc in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                dob: dob,
                pfpUrl: selectedPfpBase64 || "",
                createdAt: new Date().toISOString()
            });
            
            // Wait a moment then dismiss the overlay
            submitBtn.textContent = "Welcome to Medixly!";
            submitBtn.style.background = "#50fa7b";
            liftAntiBypass();
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 400);
            }, 1000);
            
        } catch (err) {
            console.error(err);
            errorDiv.textContent = err.message;
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Account";
        }
    });
}

// Check auth state once on load
let hasCheckedAuth = false;
onAuthStateChanged(auth, (user) => {
    if (!hasCheckedAuth) {
        hasCheckedAuth = true;
        if (!user) {
            createOnboardingUI();
            enforceAntiBypass();
        }
    } else {
        // If they sign in/out later, we can optionally show/hide it
        if (user) {
            const ob = document.getElementById('medixly-onboarding');
            if (ob) ob.remove();
            liftAntiBypass();
        }
    }
});
