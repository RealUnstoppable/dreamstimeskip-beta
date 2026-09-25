import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

let adsInitialized = false;

export async function initAds() {
    if (adsInitialized) return;
    
    // Check auth state
    onAuthStateChanged(auth, async (user) => {
        let isAdFree = false;
        
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const level = (data.membershipLevel || '').toLowerCase();
                    if (level === 'premium' || level === 'ultimate') {
                        isAdFree = true;
                    }
                }
            } catch (err) {
                console.error('Error checking membership for ads:', err);
            }
        }
        
        if (isAdFree) {
            console.log('User has Ad-Free experience.');
            // Remove any ad containers
            document.querySelectorAll('.ad-banner-container').forEach(el => el.remove());
        } else {
            injectAdSense();
        }
    });
}

function injectAdSense() {
    if (adsInitialized) return;
    adsInitialized = true;
    
    // Inject core AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4254213062632381';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Find all ad containers and initialize them
    const adContainers = document.querySelectorAll('.ad-banner-container');
    
    adContainers.forEach(container => {
        const adSlot = container.getAttribute('data-ad-slot');
        if (!adSlot) return;
        
        container.innerHTML = `
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-4254213062632381"
                 data-ad-slot="${adSlot}"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;
        
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error", err);
        }
    });
}

// Auto-init on page load
document.addEventListener('DOMContentLoaded', () => {
    // Start auth check for ads
    initAds();
});
