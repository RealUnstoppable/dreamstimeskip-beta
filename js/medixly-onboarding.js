import { auth, db } from './auth.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
    
    // Watch for them deleting the overlay via DevTools without authenticating
    if (antiBypassInterval) clearInterval(antiBypassInterval);
    antiBypassInterval = setInterval(() => {
        if (!auth.currentUser && !document.getElementById('medixly-onboarding')) {
            let isGuest = false;
            try {
                isGuest = sessionStorage.getItem('medixly_guest_trial') === 'true';
            } catch (_) {}
            if (!isGuest) {
                window.location.replace('index.html');
            }
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

// Master Onboarding State Machine Data
const onboardingState = {
    currentStep: 1,
    role: 'listener',
    acquisitionSource: 'tiktok',
    platforms: ['tiktok'],
    genres: ['hiphop', 'pop'],
    sfxNeeds: 'moderate',
    favoriteArtists: ['Lil Baby', 'Drake'],
    userUid: null,
    isGuest: false
};

// Helper to persist user preferences to Firestore & localStorage
async function savePreferencesToBackend(preferences) {
    // 1. Cache locally for instant UI personalization
    try {
        localStorage.setItem('medixly_user_preferences', JSON.stringify({
            ...preferences,
            completed: true,
            updatedAt: Date.now()
        }));
    } catch (_) {}

    // 2. Persist to Firestore if user is authenticated
    const targetUid = onboardingState.userUid || auth.currentUser?.uid;
    if (targetUid) {
        try {
            await setDoc(doc(db, "users", targetUid), {
                role: preferences.role,
                acquisitionSource: preferences.acquisitionSource,
                platforms: preferences.platforms,
                genres: preferences.genres,
                sfxNeeds: preferences.sfxNeeds,
                favoriteArtists: preferences.favoriteArtists,
                onboardingCompleted: true,
                onboardingCompletedAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.warn("Manager info: Firestore preferences sync notice:", err);
        }
    }

    // 3. Dispatch global event so Medixly recommendations and dashboard update immediately
    window.dispatchEvent(new CustomEvent('medixly:preferences-updated', {
        detail: preferences
    }));
}

export function createOnboardingUI(startStep = 1) {
    ensureWaveBackground();

    const existingModal = document.getElementById('medixly-onboarding');
    if (existingModal) existingModal.remove();

    onboardingState.currentStep = startStep;
    if (auth.currentUser) {
        onboardingState.userUid = auth.currentUser.uid;
    }

    const overlay = document.createElement('div');
    overlay.className = 'medixly-onboarding-overlay';
    overlay.id = 'medixly-onboarding';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'ob-step-title');
    
    overlay.innerHTML = `
        <div class="medixly-onboarding-card">
            <!-- Progress Tracker -->
            <div class="onboarding-progress-wrapper">
                <div class="onboarding-progress-header">
                    <span class="onboarding-step-counter" id="ob-step-counter">Step 1 of 5 • Account</span>
                    <span id="ob-step-pct">20%</span>
                </div>
                <div class="onboarding-progress-track">
                    <div class="onboarding-progress-fill" id="ob-progress-fill" style="width: 20%;"></div>
                </div>
                <div class="onboarding-step-dots" id="ob-step-dots">
                    <div class="onboarding-step-dot active" data-step="1"></div>
                    <div class="onboarding-step-dot" data-step="2"></div>
                    <div class="onboarding-step-dot" data-step="3"></div>
                    <div class="onboarding-step-dot" data-step="4"></div>
                    <div class="onboarding-step-dot" data-step="5"></div>
                </div>
            </div>

            <!-- Header & Branding -->
            <div class="onboarding-header">
                <div class="onboarding-logo-wrapper">
                    <img src="/images/medixly-logo.png" alt="Medixly" class="onboarding-brand-logo">
                </div>
                <h2 id="ob-step-title" class="onboarding-step-title">Welcome to Medixly</h2>
                <p id="ob-step-subtitle" class="onboarding-subtitle">Create an account to start listening and personalize your sound experience.</p>
            </div>
            
            <!-- STEP 1: Core Credentials & Account Creation -->
            <div class="onboarding-step-panel active" id="ob-step-panel-1">
                <button type="button" class="onboarding-oauth-btn ob-google-btn" id="ob-google-btn">
                    <svg class="onboarding-oauth-icon" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                    </svg>
                    <span>Continue with Google</span>
                </button>

                <div class="onboarding-divider">
                    <span>or sign up with email</span>
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
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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

                    <div class="onboarding-form-row">
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
                    </div>
                    
                    <div class="onboarding-form-group">
                        <label for="ob-password">Password</label>
                        <div class="onboarding-input-box">
                            <svg class="onboarding-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input type="password" id="ob-password" required placeholder="••••••••" autocomplete="new-password">
                            <button type="button" class="onboarding-pw-toggle" id="ob-pw-toggle" aria-label="Toggle password visibility">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
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

            <!-- STEP 2: Role & Intent ("Who are you?") -->
            <div class="onboarding-step-panel" id="ob-step-panel-2">
                <div class="onboarding-roles-grid">
                    <!-- Listener -->
                    <button type="button" class="onboarding-role-card selected" data-role="listener" role="radio" aria-checked="true">
                        <div class="onboarding-role-card-header">
                            <div class="onboarding-role-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                </svg>
                            </div>
                            <span class="onboarding-role-badge">Music Lover</span>
                        </div>
                        <h4 class="onboarding-role-title">Listener</h4>
                        <p class="onboarding-role-desc">Discover trending tracks, stream high-fidelity audio, and curate custom playlists.</p>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <!-- Content Creator -->
                    <button type="button" class="onboarding-role-card" data-role="creator" role="radio" aria-checked="false">
                        <div class="onboarding-role-card-header">
                            <div class="onboarding-role-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                    <line x1="7" y1="2" x2="7" y2="22"></line>
                                    <line x1="17" y1="2" x2="17" y2="22"></line>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <line x1="2" y1="7" x2="7" y2="7"></line>
                                    <line x1="2" y1="17" x2="7" y2="17"></line>
                                    <line x1="17" y1="17" x2="22" y2="17"></line>
                                    <line x1="17" y1="7" x2="22" y2="7"></line>
                                </svg>
                            </div>
                            <span class="onboarding-role-badge">TikTok & Reels</span>
                        </div>
                        <h4 class="onboarding-role-title">Video Editor / Content Creator</h4>
                        <p class="onboarding-role-desc">Source copyright-cleared trending audio, punchy beat drops, and SFX for videos.</p>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <!-- Artist / Producer -->
                    <button type="button" class="onboarding-role-card" data-role="artist" role="radio" aria-checked="false">
                        <div class="onboarding-role-card-header">
                            <div class="onboarding-role-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 18V5l12-2v13"></path>
                                    <circle cx="6" cy="18" r="3"></circle>
                                    <circle cx="18" cy="16" r="3"></circle>
                                </svg>
                            </div>
                            <span class="onboarding-role-badge">Production</span>
                        </div>
                        <h4 class="onboarding-role-title">Artist / Producer</h4>
                        <p class="onboarding-role-desc">Upload original beats, track song plays, and connect with listeners across Medixly.</p>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <!-- Casual Explorer -->
                    <button type="button" class="onboarding-role-card" data-role="explorer" role="radio" aria-checked="false">
                        <div class="onboarding-role-card-header">
                            <div class="onboarding-role-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                                </svg>
                            </div>
                            <span class="onboarding-role-badge">Eclectic</span>
                        </div>
                        <h4 class="onboarding-role-title">Casual Explorer</h4>
                        <p class="onboarding-role-desc">Browse eclectic sounds, viral soundbites, and unexpected musical vibes.</p>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>
                </div>

                <div class="onboarding-nav-actions">
                    <div class="onboarding-buttons-row">
                        <button type="button" class="onboarding-back-btn" data-back-to="1">← Back</button>
                        <button type="button" class="onboarding-btn" id="ob-next-2">Continue</button>
                    </div>
                    <div class="onboarding-secondary-row">
                        <button type="button" class="onboarding-skip-btn" data-skip-to="3">Skip for now</button>
                    </div>
                </div>
            </div>

            <!-- STEP 3: Acquisition Insights ("How did you find us?") -->
            <div class="onboarding-step-panel" id="ob-step-panel-3">
                <div class="onboarding-acquisition-grid">
                    <button type="button" class="onboarding-source-card selected" data-source="tiktok">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98v8.66c-.05 2.15-.92 4.29-2.52 5.75-1.92 1.8-4.66 2.66-7.3 2.2-2.86-.48-5.34-2.48-6.32-5.18-.98-2.65-.54-5.74 1.17-8 1.7-2.28 4.54-3.48 7.39-3.07v4.14c-1.3-.23-2.68.17-3.64 1.05-.98.88-1.46 2.2-1.28 3.5.17 1.25.99 2.34 2.16 2.84 1.2.53 2.62.43 3.73-.24.84-.5 1.39-1.39 1.48-2.37.04-1.47.02-2.95.02-4.42V.02h2.46z"/>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">TikTok</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <button type="button" class="onboarding-source-card" data-source="instagram">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">Instagram</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <button type="button" class="onboarding-source-card" data-source="youtube">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">YouTube</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <button type="button" class="onboarding-source-card" data-source="friend">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">Friend / Word of Mouth</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <button type="button" class="onboarding-source-card" data-source="search">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">Search Engine</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <button type="button" class="onboarding-source-card" data-source="discord">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">Discord</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>

                    <button type="button" class="onboarding-source-card" data-source="other">
                        <div class="onboarding-source-icon-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                        </div>
                        <span class="onboarding-source-label">Other Channel</span>
                        <div class="onboarding-check-indicator">✓</div>
                    </button>
                </div>

                <div class="onboarding-nav-actions">
                    <div class="onboarding-buttons-row">
                        <button type="button" class="onboarding-back-btn" data-back-to="2">← Back</button>
                        <button type="button" class="onboarding-btn" id="ob-next-3">Continue</button>
                    </div>
                    <div class="onboarding-secondary-row">
                        <button type="button" class="onboarding-skip-btn" data-skip-to="4">Skip for now</button>
                    </div>
                </div>
            </div>

            <!-- STEP 4: Platform Usage ("Where do you hang out?") -->
            <div class="onboarding-step-panel" id="ob-step-panel-4">
                <div class="onboarding-platforms-list">
                    <button type="button" class="onboarding-platform-pill selected" data-platform="tiktok">
                        <div class="onboarding-platform-left">
                            <div class="onboarding-platform-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98v8.66c-.05 2.15-.92 4.29-2.52 5.75-1.92 1.8-4.66 2.66-7.3 2.2-2.86-.48-5.34-2.48-6.32-5.18-.98-2.65-.54-5.74 1.17-8 1.7-2.28 4.54-3.48 7.39-3.07v4.14c-1.3-.23-2.68.17-3.64 1.05-.98.88-1.46 2.2-1.28 3.5.17 1.25.99 2.34 2.16 2.84 1.2.53 2.62.43 3.73-.24.84-.5 1.39-1.39 1.48-2.37.04-1.47.02-2.95.02-4.42V.02h2.46z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="onboarding-platform-name">TikTok</div>
                                <div class="onboarding-platform-sub">Trending audios & short videos</div>
                            </div>
                        </div>
                        <div class="onboarding-platform-toggle">✓</div>
                    </button>

                    <button type="button" class="onboarding-platform-pill" data-platform="instagram">
                        <div class="onboarding-platform-left">
                            <div class="onboarding-platform-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </div>
                            <div>
                                <div class="onboarding-platform-name">Instagram</div>
                                <div class="onboarding-platform-sub">Reels, stories, & aesthetic clips</div>
                            </div>
                        </div>
                        <div class="onboarding-platform-toggle">✓</div>
                    </button>

                    <button type="button" class="onboarding-platform-pill" data-platform="youtube">
                        <div class="onboarding-platform-left">
                            <div class="onboarding-platform-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="onboarding-platform-name">YouTube / Shorts</div>
                                <div class="onboarding-platform-sub">Long-form edits, beats, & Shorts</div>
                            </div>
                        </div>
                        <div class="onboarding-platform-toggle">✓</div>
                    </button>

                    <button type="button" class="onboarding-platform-pill" data-platform="twitch">
                        <div class="onboarding-platform-left">
                            <div class="onboarding-platform-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.149 0l-1.612 4.119v16.8h5.999v3.081h3.093l3.076-3.081h4.606l6.689-6.689v-14.23h-21.85zm19.79 13.161l-3.601 3.601h-5.143l-3.086 3.086v-3.086h-4.63v-14.686h16.46v11.085zm-9.771-6.697h2.057v6.171h-2.057v-6.171zm5.143 0h2.057v6.171h-2.057v-6.171z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="onboarding-platform-name">Twitch</div>
                                <div class="onboarding-platform-sub">Live streaming & background gaming audio</div>
                            </div>
                        </div>
                        <div class="onboarding-platform-toggle">✓</div>
                    </button>

                    <button type="button" class="onboarding-platform-pill" data-platform="twitter">
                        <div class="onboarding-platform-left">
                            <div class="onboarding-platform-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="onboarding-platform-name">Twitter / X</div>
                                <div class="onboarding-platform-sub">Music commentary, community, & links</div>
                            </div>
                        </div>
                        <div class="onboarding-platform-toggle">✓</div>
                    </button>
                </div>

                <div class="onboarding-nav-actions">
                    <div class="onboarding-buttons-row">
                        <button type="button" class="onboarding-back-btn" data-back-to="3">← Back</button>
                        <button type="button" class="onboarding-btn" id="ob-next-4">Continue</button>
                    </div>
                    <div class="onboarding-secondary-row">
                        <button type="button" class="onboarding-skip-btn" data-skip-to="5">Skip for now</button>
                    </div>
                </div>
            </div>

            <!-- STEP 5: Content & Sound Preferences ("Tailor your sound") -->
            <div class="onboarding-step-panel" id="ob-step-panel-5">
                <!-- Genre Selection -->
                <div class="onboarding-sound-section">
                    <div class="onboarding-sound-label">
                        <span>Preferred Genres</span>
                        <span class="onboarding-sound-hint">Select multiple</span>
                    </div>
                    <div class="onboarding-genres-grid">
                        <button type="button" class="onboarding-genre-pill selected" data-genre="hiphop">Hip-Hop / Rap</button>
                        <button type="button" class="onboarding-genre-pill selected" data-genre="pop">Pop</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="lofi">Lofi / Chill</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="electronic">Electronic / Dance</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="cinematic">Cinematic / Epic</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="ambient">Ambient</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="rock">Rock / Alt</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="rb">R&B / Soul</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="country">Country</button>
                        <button type="button" class="onboarding-genre-pill" data-genre="indie">Indie / Folk</button>
                    </div>
                </div>

                <!-- Sound Effects Needs -->
                <div class="onboarding-sound-section">
                    <div class="onboarding-sound-label">
                        <span>Sound Effects (SFX) Needs</span>
                        <span class="onboarding-sound-hint">For edits & mixes</span>
                    </div>
                    <div class="onboarding-sfx-slider" role="radiogroup" aria-label="Sound effects intensity">
                        <button type="button" class="onboarding-sfx-segment" data-sfx="light" role="radio" aria-checked="false">
                            <span class="onboarding-sfx-title">Light</span>
                            <span class="onboarding-sfx-sub">Clean beats, minimal SFX</span>
                        </button>
                        <button type="button" class="onboarding-sfx-segment active" data-sfx="moderate" role="radio" aria-checked="true">
                            <span class="onboarding-sfx-title">Moderate</span>
                            <span class="onboarding-sfx-sub">Subtle risers & beat drops</span>
                        </button>
                        <button type="button" class="onboarding-sfx-segment" data-sfx="heavy" role="radio" aria-checked="false">
                            <span class="onboarding-sfx-title">Heavy</span>
                            <span class="onboarding-sfx-sub">Full cinematic drops & transitions</span>
                        </button>
                    </div>
                </div>

                <!-- Artist / Vibe Chips -->
                <div class="onboarding-sound-section">
                    <div class="onboarding-sound-label">
                        <span>Trending Artists & Vibe Seeds</span>
                        <span class="onboarding-sound-hint">Quick seed</span>
                    </div>
                    <div class="onboarding-chips-wrap">
                        <button type="button" class="onboarding-chip selected" data-chip="Lil Baby">Lil Baby</button>
                        <button type="button" class="onboarding-chip selected" data-chip="Drake">Drake</button>
                        <button type="button" class="onboarding-chip" data-chip="The Weeknd">The Weeknd</button>
                        <button type="button" class="onboarding-chip" data-chip="Kendrick Lamar">Kendrick Lamar</button>
                        <button type="button" class="onboarding-chip" data-chip="Post Malone">Post Malone</button>
                        <button type="button" class="onboarding-chip" data-chip="Ariana Grande">Ariana Grande</button>
                        <button type="button" class="onboarding-chip" data-chip="SZA">SZA</button>
                        <button type="button" class="onboarding-chip" data-chip="Billie Eilish">Billie Eilish</button>
                        <button type="button" class="onboarding-chip" data-chip="Late Night Drive">Late Night Drive</button>
                        <button type="button" class="onboarding-chip" data-chip="High Energy Gym">High Energy Gym</button>
                        <button type="button" class="onboarding-chip" data-chip="Deep Focus Coding">Deep Focus Coding</button>
                        <button type="button" class="onboarding-chip" data-chip="Chill Lo-Fi Study">Chill Lo-Fi Study</button>
                    </div>
                </div>

                <div class="onboarding-nav-actions">
                    <div class="onboarding-buttons-row">
                        <button type="button" class="onboarding-back-btn" data-back-to="4">← Back</button>
                        <button type="button" class="onboarding-btn" id="ob-finish-btn">
                            <span>Complete & Launch</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12l5 5L20 7"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="onboarding-secondary-row">
                        <button type="button" class="onboarding-skip-btn" id="ob-skip-final">Skip for now</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Step configuration metadata
    const stepMeta = {
        1: { title: "Welcome to Medixly", subtitle: "Create an account to start listening and personalize your sound experience.", name: "Account", pct: "20%" },
        2: { title: "Who Are You?", subtitle: "Choose your primary identity to customize your sound packs, tools, and discovery.", name: "Role & Intent", pct: "40%" },
        3: { title: "How Did You Find Us?", subtitle: "Help us learn what brought you into the Unstoppable Ecosystem.", name: "Acquisition", pct: "60%" },
        4: { title: "Where Do You Hang Out?", subtitle: "Select the social platforms where you create, listen, or share (multi-select).", name: "Social Platforms", pct: "80%" },
        5: { title: "Tailor Your Sound", subtitle: "Fine-tune your genres, sound effect needs, and aesthetic vibes to seed recommendations.", name: "Sound Profile", pct: "100%" }
    };

    function navigateToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > 5) return;
        onboardingState.currentStep = stepNumber;

        // Hide all step panels, show active
        for (let i = 1; i <= 5; i++) {
            const panel = document.getElementById(`ob-step-panel-${i}`);
            if (panel) {
                if (i === stepNumber) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            }
        }

        // Update titles & tracker
        const meta = stepMeta[stepNumber];
        const titleEl = document.getElementById('ob-step-title');
        const subEl = document.getElementById('ob-step-subtitle');
        const counterEl = document.getElementById('ob-step-counter');
        const pctEl = document.getElementById('ob-step-pct');
        const fillEl = document.getElementById('ob-progress-fill');

        if (titleEl) titleEl.textContent = meta.title;
        if (subEl) subEl.textContent = meta.subtitle;
        if (counterEl) counterEl.textContent = `Step ${stepNumber} of 5 • ${meta.name}`;
        if (pctEl) pctEl.textContent = meta.pct;
        if (fillEl) fillEl.style.width = meta.pct;

        // Update dots
        const dots = overlay.querySelectorAll('.onboarding-step-dot');
        dots.forEach((dot, idx) => {
            const step = idx + 1;
            dot.classList.remove('active', 'completed');
            if (step === stepNumber) {
                dot.classList.add('active');
            } else if (step < stepNumber) {
                dot.classList.add('completed');
            }
        });
    }

    // Set initial step
    navigateToStep(startStep);

    // Micro-interaction handlers for STEP 1
    const form = document.getElementById('medixly-onboarding-form');
    const pfpInput = document.getElementById('ob-pfp');
    const pfpPreview = document.getElementById('ob-pfp-preview');
    const errorDiv = document.getElementById('ob-error');
    const submitBtn = document.getElementById('ob-submit');
    const tryFirstBtn = document.getElementById('ob-try-first');
    const googleBtn = document.getElementById('ob-google-btn');
    const pwToggleBtn = document.getElementById('ob-pw-toggle');
    const pwInput = document.getElementById('ob-password');

    if (pwToggleBtn && pwInput) {
        pwToggleBtn.addEventListener('click', () => {
            const isPassword = pwInput.getAttribute('type') === 'password';
            pwInput.setAttribute('type', isPassword ? 'text' : 'password');
            pwToggleBtn.style.color = isPassword ? '#bb86fc' : '';
        });
    }

    // Try It Out First
    if (tryFirstBtn) {
        tryFirstBtn.addEventListener('click', () => {
            try {
                sessionStorage.setItem('medixly_guest_trial', 'true');
            } catch (_) {}
            onboardingState.isGuest = true;
            // Smoothly advance guest to role profiling!
            navigateToStep(2);
        });
    }

    // Google Sign In
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                googleBtn.disabled = true;
                googleBtn.innerHTML = `<span>Connecting to Google...</span>`;
                const provider = new GoogleAuthProvider();
                const cred = await signInWithPopup(auth, provider);
                const user = cred.user;
                onboardingState.userUid = user.uid;

                // Sync base doc if not present
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        username: user.displayName || user.email?.split('@')[0] || "User",
                        email: user.email,
                        phone: user.phoneNumber || "",
                        createdAt: new Date().toISOString(),
                        signupDate: serverTimestamp(),
                        isBanned: false,
                        isAdmin: false,
                        membershipLevel: 'free',
                        pointsBalance: 0,
                        loyaltyPoints: 0,
                        checkInStreak: 0,
                        ordersCount: 0,
                        totalSpent: 0
                    }, { merge: true });
                }

                // Smoothly proceed to Step 2
                navigateToStep(2);
            } catch (err) {
                console.error("Manager info: Google Auth failed", err);
                if (errorDiv) errorDiv.textContent = err.message || "Failed to sign in with Google.";
                googleBtn.disabled = false;
                googleBtn.innerHTML = `
                    <svg class="onboarding-oauth-icon" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                    </svg>
                    <span>Continue with Google</span>
                `;
            }
        });
    }

    let selectedPfpBase64 = null;
    if (pfpInput) {
        pfpInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1024 * 1024) {
                    alert("File too large. Please select an image under 1MB.");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    selectedPfpBase64 = ev.target.result;
                    if (pfpPreview) pfpPreview.innerHTML = `<img src="${selectedPfpBase64}" alt="Profile Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Step 1 Form Submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('ob-username').value.trim();
            const email = document.getElementById('ob-email').value.trim();
            const phone = document.getElementById('ob-phone').value.trim();
            const dob = document.getElementById('ob-dob').value;
            const password = document.getElementById('ob-password').value;
            
            if (!username || !email || !phone || !dob || !password) {
                if (errorDiv) errorDiv.textContent = "Please fill in all fields.";
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Creating Account...</span>`;
            if (errorDiv) errorDiv.textContent = "";
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                onboardingState.userUid = user.uid;
                
                // Set basic profile
                await updateProfile(user, {
                    displayName: username
                });
                
                // Default user doc in Firestore (matches phone collection tests & schemas)
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
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Continue to Profiling</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                `;

                // Advance to Step 2
                navigateToStep(2);
                
            } catch (err) {
                console.error("Manager info: ", err);
                if (errorDiv) errorDiv.textContent = err.message;
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

    // Step 2: Role selection
    const roleCards = overlay.querySelectorAll('.onboarding-role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('selected');
            card.setAttribute('aria-checked', 'true');
            onboardingState.role = card.getAttribute('data-role');
        });
    });

    const next2Btn = document.getElementById('ob-next-2');
    if (next2Btn) next2Btn.addEventListener('click', () => navigateToStep(3));

    // Step 3: Acquisition source selection
    const sourceCards = overlay.querySelectorAll('.onboarding-source-card');
    sourceCards.forEach(card => {
        card.addEventListener('click', () => {
            sourceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            onboardingState.acquisitionSource = card.getAttribute('data-source');
        });
    });

    const next3Btn = document.getElementById('ob-next-3');
    if (next3Btn) next3Btn.addEventListener('click', () => navigateToStep(4));

    // Step 4: Social platforms multi-select
    const platformPills = overlay.querySelectorAll('.onboarding-platform-pill');
    platformPills.forEach(pill => {
        pill.addEventListener('click', () => {
            pill.classList.toggle('selected');
            const platform = pill.getAttribute('data-platform');
            if (pill.classList.contains('selected')) {
                if (!onboardingState.platforms.includes(platform)) {
                    onboardingState.platforms.push(platform);
                }
            } else {
                onboardingState.platforms = onboardingState.platforms.filter(p => p !== platform);
            }
        });
    });

    const next4Btn = document.getElementById('ob-next-4');
    if (next4Btn) next4Btn.addEventListener('click', () => navigateToStep(5));

    // Step 5: Sound & Content Preferences
    const genrePills = overlay.querySelectorAll('.onboarding-genre-pill');
    genrePills.forEach(pill => {
        pill.addEventListener('click', () => {
            pill.classList.toggle('selected');
            const genre = pill.getAttribute('data-genre');
            if (pill.classList.contains('selected')) {
                if (!onboardingState.genres.includes(genre)) {
                    onboardingState.genres.push(genre);
                }
            } else {
                onboardingState.genres = onboardingState.genres.filter(g => g !== genre);
            }
        });
    });

    const sfxSegments = overlay.querySelectorAll('.onboarding-sfx-segment');
    sfxSegments.forEach(seg => {
        seg.addEventListener('click', () => {
            sfxSegments.forEach(s => {
                s.classList.remove('active');
                s.setAttribute('aria-checked', 'false');
            });
            seg.classList.add('active');
            seg.setAttribute('aria-checked', 'true');
            onboardingState.sfxNeeds = seg.getAttribute('data-sfx');
        });
    });

    const chipBtns = overlay.querySelectorAll('.onboarding-chip');
    chipBtns.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
            const val = chip.getAttribute('data-chip');
            if (chip.classList.contains('selected')) {
                if (!onboardingState.favoriteArtists.includes(val)) {
                    onboardingState.favoriteArtists.push(val);
                }
            } else {
                onboardingState.favoriteArtists = onboardingState.favoriteArtists.filter(a => a !== val);
            }
        });
    });

    // Back buttons
    const backBtns = overlay.querySelectorAll('.onboarding-back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = parseInt(btn.getAttribute('data-back-to'), 10);
            navigateToStep(target);
        });
    });

    // Skip buttons
    const skipBtns = overlay.querySelectorAll('.onboarding-skip-btn');
    skipBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const skipTo = btn.getAttribute('data-skip-to');
            if (skipTo) {
                navigateToStep(parseInt(skipTo, 10));
            } else {
                await finishOnboarding();
            }
        });
    });

    // Finish / Complete button
    const finishBtn = document.getElementById('ob-finish-btn');
    if (finishBtn) finishBtn.addEventListener('click', finishOnboarding);

    async function finishOnboarding() {
        if (finishBtn) {
            finishBtn.disabled = true;
            finishBtn.innerHTML = `<span>Personalizing Your Sound...</span>`;
            finishBtn.style.background = "#50fa7b";
            finishBtn.style.color = "#000";
        }

        const finalPreferences = {
            role: onboardingState.role || 'listener',
            acquisitionSource: onboardingState.acquisitionSource || 'other',
            platforms: onboardingState.platforms.length > 0 ? onboardingState.platforms : ['tiktok'],
            genres: onboardingState.genres.length > 0 ? onboardingState.genres : ['hiphop', 'pop'],
            sfxNeeds: onboardingState.sfxNeeds || 'moderate',
            favoriteArtists: onboardingState.favoriteArtists
        };

        await savePreferencesToBackend(finalPreferences);

        liftAntiBypass();

        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
            }, 350);
        }, 800);
    }

    // Keyboard accessibility: Enter to advance, Esc to close/skip
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            if (onboardingState.currentStep > 1) {
                finishOnboarding();
            } else {
                // If on Step 1, guest trial
                try {
                    sessionStorage.setItem('medixly_guest_trial', 'true');
                } catch (_) {}
                liftAntiBypass();
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) overlay.remove();
                }, 350);
            }
        }
    };
    window.addEventListener('keydown', handleKeydown, { once: true });
}

// Expose global helper so user can re-open their sound preferences anytime from the UI
if (typeof window !== 'undefined') {
    window.openMedixlyOnboarding = (startStep = 2) => {
        createOnboardingUI(startStep);
    };
}

// Check auth state on load
let hasCheckedAuth = false;
onAuthStateChanged(auth, async (user) => {
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
            createOnboardingUI(1);
            enforceAntiBypass();
        } else {
            // User is signed in. Check if they have completed profiling.
            onboardingState.userUid = user.uid;
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    if (!data.onboardingCompleted) {
                        // User has an account but hasn't profiled their sound taste yet!
                        createOnboardingUI(2);
                        return;
                    }
                }
            } catch (_) {}
            liftAntiBypass();
        }
    } else {
        if (user) {
            const ob = document.getElementById('medixly-onboarding');
            if (ob && onboardingState.currentStep === 1) {
                // Advance to Step 2 for profiling
                createOnboardingUI(2);
            }
            liftAntiBypass();
        }
    }
});
