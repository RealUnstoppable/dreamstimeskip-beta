import { auth, db } from './auth.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Load CSS if not already present
if (!document.querySelector('link[href*="onboarding.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/onboarding.css';
    document.head.appendChild(link);
}

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

// Ensure animated background waves are active
function ensureWaveBackground() {
    if (document.querySelector('.page-wave-bg')) return;
    const waveContainer = document.createElement('div');
    waveContainer.className = 'music-wave-bg page-wave-bg';
    waveContainer.setAttribute('aria-hidden', 'true');
    waveContainer.innerHTML = `
        <div class="music-glow-orb orb-primary"></div>
        <div class="music-glow-orb orb-secondary"></div>
        <svg class="music-waves-svg" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ff1744" stop-opacity="0.35"/>
                    <stop offset="50%" stop-color="#9b51e0" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#00d2ff" stop-opacity="0.35"/>
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.3"/>
                    <stop offset="50%" stop-color="#ec4899" stop-opacity="0.22"/>
                    <stop offset="100%" stop-color="#9b51e0" stop-opacity="0.3"/>
                </linearGradient>
                <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#9b51e0" stop-opacity="0.22"/>
                    <stop offset="50%" stop-color="#00f2fe" stop-opacity="0.18"/>
                    <stop offset="100%" stop-color="#ff2d87" stop-opacity="0.28"/>
                </linearGradient>
            </defs>
            <path class="wave-layer wave-1" d="M0,150 C300,280, 450,20, 750,160 C1050,300, 1100,60, 1200,130 L1200,300 L0,300 Z" fill="url(#waveGrad1)"></path>
            <path class="wave-layer wave-2" d="M0,120 C220,30, 460,250, 780,110 C980,10, 1100,210, 1200,170 L1200,300 L0,300 Z" fill="url(#waveGrad2)"></path>
            <path class="wave-layer wave-3" d="M0,190 C280,90, 520,270, 840,140 C1040,70, 1140,210, 1200,180 L1200,300 L0,300 Z" fill="url(#waveGrad3)"></path>
        </svg>
    `;
    document.body.prepend(waveContainer);
}

function createOnboardingUI() {
    ensureWaveBackground();

    const overlay = document.createElement('div');
    overlay.className = 'medixly-onboarding-overlay';
    overlay.id = 'medixly-onboarding';
    
    overlay.innerHTML = `
        <div class="medixly-onboarding-card">
            <div class="onboarding-header">
                <span class="onboarding-badge">WELCOME TO</span>
                <div class="onboarding-logo-wrapper">
                    <img src="/images/medixly-logo.png" alt="Medixly" class="onboarding-brand-logo">
                </div>
                <h2 class="sr-only">Welcome to Medixly</h2>
                <p class="onboarding-subtitle">Create an account to start listening to your favorite tracks.</p>
            </div>
            
            <form id="medixly-onboarding-form">
                <div class="onboarding-pfp-select">
                    <div class="onboarding-pfp-preview" id="ob-pfp-preview" title="Profile picture preview">
                        <svg class="onboarding-pfp-default-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="onboarding-pfp-info">
                        <label for="ob-pfp" class="onboarding-upload-label">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <span>Upload Profile Picture</span>
                        </label>
                        <span class="onboarding-upload-hint">Optional • Max 1MB</span>
                        <input type="file" id="ob-pfp" accept="image/*" style="display: none;">
                    </div>
                </div>
                
                <div class="onboarding-form-group">
                    <label for="ob-username">Username</label>
                    <div class="onboarding-input-box">
                        <svg class="onboarding-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" id="ob-username" required placeholder="cool_dj_99" autocomplete="username">
                    </div>
                </div>
                
                <div class="onboarding-form-group">
                    <label for="ob-email">Email</label>
                    <div class="onboarding-input-box">
                        <svg class="onboarding-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <input type="email" id="ob-email" required placeholder="you@example.com" autocomplete="email">
                    </div>
                </div>
                
                <div class="onboarding-form-group">
                    <label for="ob-phone">Phone Number</label>
                    <div class="onboarding-input-box">
                        <svg class="onboarding-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <input type="tel" id="ob-phone" required placeholder="(555) 123-4567" autocomplete="tel">
                    </div>
                </div>
                
                <div class="onboarding-form-group">
                    <label for="ob-dob">Date of Birth</label>
                    <div class="onboarding-input-box">
                        <svg class="onboarding-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <input type="date" id="ob-dob" required>
                    </div>
                </div>
                
                <div class="onboarding-form-group">
                    <label for="ob-password">Password</label>
                    <div class="onboarding-input-box">
                        <svg class="onboarding-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input type="password" id="ob-password" required placeholder="••••••••" autocomplete="new-password">
                    </div>
                </div>
                
                <button type="submit" class="onboarding-btn" id="ob-submit">
                    <span>Create Account</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
                <div class="onboarding-error" id="ob-error"></div>
            </form>
            <div class="onboarding-footer">
                <div class="onboarding-signin-row">
                    Already have an account? <a href="/sign in beta.html?redirect=medixly.html" class="onboarding-signin-link">Sign in</a>
                </div>
                <div class="onboarding-try-row">
                    <button type="button" id="ob-try-first" class="onboarding-try-btn">try it out first</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const form = document.getElementById('medixly-onboarding-form');
    const pfpInput = document.getElementById('ob-pfp');
    const pfpPreview = document.getElementById('ob-pfp-preview');
    const errorDiv = document.getElementById('ob-error');
    const submitBtn = document.getElementById('ob-submit');
    const tryFirstBtn = document.getElementById('ob-try-first');
    
    if (tryFirstBtn) {
        tryFirstBtn.addEventListener('click', () => {
            try {
                sessionStorage.setItem('medixly_guest_trial', 'true');
            } catch (_) {}
            liftAntiBypass();
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
            }, 350);
        });
    }
    
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
                pfpPreview.innerHTML = `<img src="${selectedPfpBase64}" alt="Profile Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('ob-username').value.trim();
        const email = document.getElementById('ob-email').value.trim();
        const phone = document.getElementById('ob-phone').value.trim();
        const dob = document.getElementById('ob-dob').value;
        const password = document.getElementById('ob-password').value;
        
        if (!username || !email || !phone || !dob || !password) {
            errorDiv.textContent = "Please fill in all fields.";
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Creating Account...</span>`;
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
                phone: phone,
                dob: dob,
                pfpUrl: selectedPfpBase64 || "",
                createdAt: new Date().toISOString(),
                signupDate: serverTimestamp(),
                isBanned: false,
                isAdmin: false,
                membershipLevel: 'free',
                pointsBalance: 0,
                loyaltyPoints: 0,
                checkInStreak: 0,
                ordersCount: 0,
                totalSpent: 0,
                subscription: {
                    status: 'inactive',
                    plan: 'free'
                }
            });
            
            // Wait a moment then dismiss the overlay
            submitBtn.innerHTML = `<span>Welcome to Medixly!</span>`;
            submitBtn.style.background = "#50fa7b";
            submitBtn.style.color = "#000";
            submitBtn.style.boxShadow = "0 6px 20px rgba(80, 250, 123, 0.45)";
            liftAntiBypass();
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 400);
            }, 1000);
            
        } catch (err) {
            console.error("Manager info: ", err);
            errorDiv.textContent = err.message;
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Create Account</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            `;
        }
    });
}

// Check auth state once on load
let hasCheckedAuth = false;
onAuthStateChanged(auth, (user) => {
    if (!hasCheckedAuth) {
        hasCheckedAuth = true;
        if (!user) {
            let isGuestTrial = false;
            try {
                isGuestTrial = sessionStorage.getItem('medixly_guest_trial') === 'true';
            } catch (_) {}

            if (isGuestTrial) {
                liftAntiBypass();
                return;
            }
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
