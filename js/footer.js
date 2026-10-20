// js/footer.js

// Automatically initialize the newsletter logic on any page that loads this footer (browser only)
if (typeof window !== 'undefined' && (typeof process === 'undefined' || process.env?.NODE_ENV !== 'test')) {
    import('./newsletter.js').catch(() => {});
    import('../dist/components/PrivacyConsentManager.js').then((m) => {
        if (m && typeof m.initPrivacyConsentManager === 'function') {
            m.initPrivacyConsentManager();
        }
    }).catch(() => {});
}

export function loadFooter() {
    const footerHTML = `
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h5>Navigate</h5>
                    <ul>
                        <li><a href="index.html#bento">Overview</a></li>
                        <li><a href="unstoppable.html">Unstoppable</a></li>
                        <li><a href="dreamstimeskip.html">Dreams TimeSkip</a></li>
                        <li><a href="medixly.html">Medixly</a></li>
                        <li><a href="blobgame.html">Squishly (Beta)</a></li>
                    </ul>
                    <h5 style="margin-top: 15px;">Betas</h5>
                    <ul>
                        <li><a href="blobgame.html">Squishly</a></li>
                        <li><a href="tracker.html">ezManage beta</a></li>
                        <li><a href="#" style="color: gray; cursor: default;">App Download (Soon)</a></li>
                        <li><a href="#" style="color: gray; cursor: default;">beta.realunstoppable.store</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h5>Connect</h5>
                    <ul>
                        <li><a href="https://www.youtube.com/@Unstoppab1e">YouTube</a></li>
                        <li><a href="https://www.tiktok.com/@harmonytunesofficial">TikTok</a></li>
                        <li><a href="https://x.com/harmonytun16586?s=21">Twitter / X</a></li>
                        <li><a href="https://discord.gg/6zdH5De3ab">Discord</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h5>Company</h5>
                    <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="shop.html">Shop</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                        <li><a href="terms.html">Terms of Service</a></li>
                        <li><button type="button" id="footer-privacy-choices" class="footer-privacy-choices-btn" style="background:none;border:none;color:inherit;font:inherit;cursor:pointer;padding:0;text-align:left;">Your Privacy Choices / Do Not Sell or Share My Personal Information</button></li>
                    </ul>
                </div>
                <div class="footer-column footer-newsletter">
                    <h5>Stay in the Loop</h5>
                    <p>Sign up for news, announcements, and exclusive beta access.</p>
                    <form class="signup-form">
                        <input type="email" placeholder="your.email@example.com" required title="Email for newsletter" aria-label="Email for newsletter">
                        <input type="tel" placeholder="Your phone number" title="Phone number for updates" aria-label="Phone number for updates">
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2026 Unstoppable LLC. All Rights Reserved.</p>
                <p>Designed in collaboration with Unstoppable Design, LLC.</p>
            </div>
        </div>
    `;

    const footer = document.querySelector('.main-footer');
    if (footer) {
        footer.innerHTML = footerHTML;
        if (typeof footer.querySelector === 'function') {
            const privacyBtn = footer.querySelector('#footer-privacy-choices');
            if (privacyBtn) {
                privacyBtn.addEventListener('click', () => {
                    if (typeof window !== 'undefined' && typeof window.openPrivacyChoices === 'function') {
                        window.openPrivacyChoices();
                    }
                });
            }
        }
    }
}

// Auto-initialize when DOM is loaded or ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadFooter());
    } else {
        loadFooter();
    }
}

if (typeof window !== 'undefined') {
    window.loadFooter = loadFooter;
}