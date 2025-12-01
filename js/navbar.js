export function loadNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo">un<span></span></a>
        <ul class="nav-links">
            <li><a href="index.html#bento">Overview</a></li>
            <li><a href="index.html#unstoppable">Unstoppable</a></li>
            <li><a href="index.html#dts">Dreams TimeSkip</a></li>
            <li><a href="harmonytunes.html">HarmonyTunes</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="memberships.html">Memberships</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="sign in beta.html" id="auth-link">Sign In / Sign Up</a></li>
        </ul>
        <button class="hamburger" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
    </nav>`;

    document.querySelector('.main-header').innerHTML = headerHTML;
    
    // Re-attach Auth Listener logic here so it updates the link
    // Re-attach Hamburger logic here
    attachNavEvents();
}

function attachNavEvents() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}