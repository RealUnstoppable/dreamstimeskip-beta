export function initCookieConsent() {
    // If user already responded to cookies, don't show the banner
    if (localStorage.getItem('cookiesAccepted')) {
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to improve your experience, analyze traffic, and serve personalized ads. By using our site, you agree to our <a href="privacy.html">Privacy Policy</a>.</p>
            <div class="cookie-buttons">
                <button id="accept-cookies" class="cookie-btn primary">Accept</button>
                <button id="decline-cookies" class="cookie-btn secondary">Decline</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);

    document.getElementById('accept-cookies').addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        closeBanner(banner);
    });

    document.getElementById('decline-cookies').addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        closeBanner(banner);
    });
}

function closeBanner(banner) {
    banner.classList.add('hidden');
    setTimeout(() => {
        if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    }, 300);
}
