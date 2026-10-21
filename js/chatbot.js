// js/chatbot.js
import { app, db, auth } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { escapeHTML } from './utils.js';
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";
import { librarySongs, getSongById } from './song-data.js?v=20260920';
import { products, productMap } from './products-data.js';

// ==========================================
// 1. SYSTEM INSTRUCTION & BRAND SAFEGUARDS
// ==========================================
const systemInstruction = `
You are Lexi, the intelligent AI companion for the Unstoppable Hub and Medixly (formerly HarmonyTunes). You exist as a glowing orb on the home page, in the shop, and across the Unstoppable web ecosystem.

CRITICAL HUB CONCEPT & BRAND HIERARCHY:
- The **Unstoppable Hub** (under the **Unstoppable Umbrella**) is the true central portal and main ecosystem hub where users access all projects created by Unstoppable.
- You and the user are currently in the **Unstoppable Hub** (NOT inside Dreams TimeSkip).
- NEVER call Dreams TimeSkip "a portal to all things Unstoppable" or "the dimension/hub you guide users through". It is the OPPOSITE: Unstoppable Umbrella is the main hub of the entire ecosystem, and Dreams is just ONE of the projects under the Unstoppable Umbrella.

Brand Structure & Ventures under the Unstoppable Umbrella:
- Unstoppable: The parent brand and central ecosystem. "Unstoppable" is also our gaming channel (https://www.youtube.com/@Unstoppab1e).
- Dreams: A product line under the Unstoppable Umbrella. 
  1. Dreams TimeSkip (DTS): An upcoming Minecraft server saga launching January 15, 2027.
  2. Dreams OG: A nostalgic classic Minecraft SMP experience launching on October 20, 2026!
  - Official Minecraft Server IP: **dts.realunstoppable.store** (supports Minecraft Java 26.3 and Bedrock).
  - Server Status: The server is currently under maintenance until October 20, 2026, when Dreams OG launches.
- Medixly: Our newly rebranded music platform (formerly HarmonyTunes) under the Unstoppable Umbrella for listeners, editors, and creators.
- Merch Store: Official shop selling the 'Unstoppable Hoodie', 'DTS Model Tee', 'HarmonyTunes Cap', 'Unstoppable Mousepad', and 'Ceramic Mug'.
- Squishly: Our juicy, physics-driven ASMR arcade minigame in the hub (formerly called Blob Game).
- Autolux: A premium mobile car detailing service.
- ezManage: A shift tracker and management tool.

PAGE AWARENESS & ACCOUNT INTELLIGENCE:
- Use getPageContext to identify what page the user is looking at and describe it accurately.
- Use getUserAccountInfo to inspect the user's loyalty points, daily check-in streak, order history, and membership plan.
- Use getShoppingCartContents to see what items are in the user's cart, compute subtotals, and provide checkout assistance.
- Use getDreamsCountdowns to provide real-time launch countdowns and server connection info.

MUSIC & MEDIXLY POWERS:
- If a user asks to play a song or asks about music, search the library using searchHarmonyTunesLibrary or playHarmonyTunesSong.
- Include "[PLAY_SONG:<songId>]" so an interactive play dialog is displayed.
- If a requested song is not in our library, offer to submit a song request to the admin via requestSongAddition.

GAMES & SQUISHLY:
- NEVER refer to the minigame as "Blob Game". Always call it **Squishly**.
- If the user asks about games or asks to play, enthusiastically recommend Squishly and MUST include the exact text "[PLAY_SQUISHLY]" in your response.

SAFEGUARDS & RESTRICTIONS:
- Do NOT answer questions about API keys, development secrets, backend architecture, or system internals. Politely refuse and state that this information is classified.
- Maintain brand hierarchy at all times.
- Be helpful, slightly futuristic, concise, and enthusiastic.
`;

// ==========================================
// 2. CONTEXT & STATE HELPER FUNCTIONS
// ==========================================

export function getPageContext() {
    const path = (typeof window !== 'undefined' && window.location ? window.location.pathname || '' : '').toLowerCase();
    const hash = typeof window !== 'undefined' && window.location ? window.location.hash || '' : '';

    if (path.includes('account')) {
        let tab = 'Dashboard';
        if (hash === '#orders') tab = 'Orders';
        else if (hash === '#rewards') tab = 'Rewards & Check-in';
        else if (hash === '#billing') tab = 'Billing & Plans';
        else if (hash === '#wishlist') tab = 'Wishlist';
        else if (hash === '#support') tab = 'Support Tickets';
        else if (hash === '#settings') tab = 'Settings & Themes';
        return {
            id: 'account',
            title: `Account Dashboard (${tab})`,
            tag: `📍 Account: ${tab}`,
            isAccount: true
        };
    }
    if (path.includes('blobgame') || path.includes('squishly')) {
        return {
            id: 'squishly',
            title: 'Squishly Arcade',
            tag: '🎮 Squishly',
            isSquishly: true
        };
    }
    if (path.includes('shop')) {
        return {
            id: 'shop',
            title: 'Unstoppable Merch Store',
            tag: '🛍️ Store',
            isShop: true
        };
    }
    if (path.includes('checkout')) {
        return {
            id: 'checkout',
            title: 'Checkout',
            tag: '💳 Checkout',
            isCheckout: true
        };
    }
    if (path.includes('cart')) {
        return {
            id: 'cart',
            title: 'Your Cart',
            tag: '🛒 Cart',
            isCart: true
        };
    }
    if (path.includes('medixly')) {
        return {
            id: 'medixly',
            title: 'Medixly Music Platform',
            tag: '🎵 Medixly',
            isMedixly: true
        };
    }
    if (path.includes('dreamstimeskip') || path.includes('dts')) {
        return {
            id: 'dreamstimeskip',
            title: 'Dreams TimeSkip & Dreams OG',
            tag: '⚔️ Dreams TimeSkip',
            isDTS: true
        };
    }
    if (path.includes('tracker')) {
        return {
            id: 'tracker',
            title: 'ezManage Tracker',
            tag: '📋 ezManage',
            isTracker: true
        };
    }
    if (path.includes('autolux')) {
        return {
            id: 'autolux',
            title: 'Autolux Detailing',
            tag: '🚗 Autolux',
            isAutolux: true
        };
    }
    if (path.includes('privacy') || path.includes('terms') || path.includes('cookies')) {
        return {
            id: 'legal',
            title: 'Policies & Legal',
            tag: '📜 Policies',
            isLegal: true
        };
    }
    return {
        id: 'index',
        title: 'Unstoppable Hub',
        tag: '🏠 Hub Home',
        isIndex: true
    };
}

export function getUserAccountSnapshot() {
    let user = auth && auth.currentUser ? auth.currentUser : null;
    let uid = user ? user.uid : null;
    let email = user ? user.email : '';
    let username = user ? (user.displayName || user.email?.split('@')[0]) : '';
    
    // Check sessionStorage profile
    let profile = null;
    if (uid && typeof sessionStorage !== 'undefined') {
        try {
            const raw = sessionStorage.getItem(`profile_${uid}`);
            if (raw) profile = JSON.parse(raw);
        } catch (_) {}
    }

    if (profile) {
        username = profile.username || username;
        email = profile.email || email;
    }

    // Check DOM elements on account page if available
    if (typeof document !== 'undefined') {
        const domWelcome = document.getElementById('welcome-header');
        if (domWelcome && domWelcome.textContent) {
            const match = domWelcome.textContent.match(/Welcome back, (.*)!/);
            if (match && match[1]) username = match[1].trim();
        }
        const domEmail = document.getElementById('user-email-sidebar');
        if (domEmail && domEmail.textContent) {
            email = domEmail.textContent.trim();
        }
        const domUsernameInput = document.getElementById('update-username');
        if (domUsernameInput && domUsernameInput.value) {
            username = domUsernameInput.value.trim();
        }
    }

    // Points
    let points = 50; // standard starter bonus
    if (uid && typeof localStorage !== 'undefined') {
        const storedPts = localStorage.getItem(`dts_points_${uid}`);
        if (storedPts !== null) points = parseInt(storedPts, 10) || 0;
    }
    if (profile && typeof profile.pointsBalance === 'number') {
        points = profile.pointsBalance;
    }
    if (typeof document !== 'undefined') {
        const domPoints = document.getElementById('points-balance-display') || document.getElementById('user-loyalty-points');
        if (domPoints && domPoints.textContent) {
            const parsed = parseInt(domPoints.textContent.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(parsed)) points = parsed;
        }
    }

    // Streak
    let streak = 0;
    if (uid && typeof localStorage !== 'undefined') {
        try {
            const rawCheckin = localStorage.getItem(`dts_checkin_${uid}`);
            if (rawCheckin) {
                const parsed = JSON.parse(rawCheckin);
                if (typeof parsed.streak === 'number') streak = parsed.streak;
            }
        } catch (_) {}
    }
    if (profile && typeof profile.checkInStreak === 'number') {
        streak = profile.checkInStreak;
    }
    if (typeof document !== 'undefined') {
        const domStreak = document.getElementById('check-in-streak') || document.getElementById('mc-modal-streak-count');
        if (domStreak && domStreak.textContent) {
            const parsed = parseInt(domStreak.textContent.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(parsed)) streak = parsed;
        }
    }

    // Plan / Membership
    let plan = 'Free Tier (Standard)';
    const rawMembership = (profile && profile.membershipLevel ? profile.membershipLevel : 'free').toLowerCase();
    if (rawMembership === 'ultimate') plan = 'Ultimate Plan ($14.13/mo)';
    else if (rawMembership === 'premium') plan = 'Premium Plan ($10.86/mo)';
    else plan = 'Free Tier (Standard)';

    // Orders
    let orderSummary = 'No orders placed yet';
    let orderCount = 0;
    if (typeof localStorage !== 'undefined') {
        try {
            const lastOrderRaw = localStorage.getItem('lastCompletedOrder');
            if (lastOrderRaw) {
                const ord = JSON.parse(lastOrderRaw);
                orderCount = 1;
                const ordId = ord.orderId || 'ORD-RECENT';
                const total = ord.total ? `$${Number(ord.total).toFixed(2)}` : 'Paid';
                orderSummary = `Latest Order #${ordId} (${total}, ${ord.status || 'Paid'})`;
            }
        } catch (_) {}
    }

    // Wishlist
    let wishlistCount = 0;
    if (typeof localStorage !== 'undefined') {
        try {
            const wl = localStorage.getItem('wishlist');
            if (wl) {
                const arr = JSON.parse(wl);
                if (Array.isArray(arr)) wishlistCount = arr.length;
            }
        } catch (_) {}
    }

    return {
        loggedIn: Boolean(user || username),
        username: username || 'Unstoppable Adventurer',
        email: email || (user ? user.email : 'Guest'),
        points,
        streak,
        plan,
        orderSummary,
        orderCount,
        wishlistCount
    };
}

export function getCartSnapshot() {
    let localCart = {};
    if (typeof localStorage !== 'undefined') {
        try {
            const raw = localStorage.getItem('localCart');
            if (raw) localCart = JSON.parse(raw);
        } catch (_) {}
    }

    const items = [];
    let subtotal = 0;
    let count = 0;

    for (const [id, qty] of Object.entries(localCart)) {
        const q = parseInt(qty, 10);
        if (q > 0) {
            count += q;
            const product = productMap.get(id) || { id, name: id, price: 19.99, imageUrl: '/images/unstoppable-logo.png' };
            const price = product.price || 0;
            const total = price * q;
            subtotal += total;
            items.push({
                id,
                name: product.name,
                price,
                qty: q,
                total,
                imageUrl: product.imageUrl
            });
        }
    }

    return {
        empty: items.length === 0,
        count,
        items,
        subtotal
    };
}

export function getDreamsCountdownsData() {
    const now = new Date();
    const ogDate = new Date("2026-10-20T23:59:00-04:00");
    const tsDate = new Date("2027-01-15T12:00:00-05:00");

    const formatDiff = (target) => {
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) return "Launched!";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${days} days, ${hours} hours, ${minutes} minutes remaining`;
    };

    return {
        currentDate: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        serverIP: "dts.realunstoppable.store",
        serverStatus: "Under maintenance preparing for the Dreams OG launch on October 20, 2026",
        minecraftVersion: "26.3 (Java & Bedrock compatible)",
        dreamsOG: {
            launchDate: "October 20, 2026",
            countdown: formatDiff(ogDate)
        },
        dreamsTimeSkip: {
            launchDate: "January 15, 2027",
            countdown: formatDiff(tsDate)
        }
    };
}

export function searchMusicLibrary(query) {
    if (!query) return librarySongs.slice(0, 5);
    const q = query.toLowerCase().trim();
    const cleanQ = q.replace(/^(play\s+|listen to\s+|put on\s+|search\s+|find\s+)/i, '')
                    .replace(/^(a\s+song|a\s+track|some\s+music|music|songs)/i, '')
                    .trim();

    if (!cleanQ || cleanQ.length < 2) {
        return librarySongs.slice(0, 5);
    }

    let matches = librarySongs.filter(s => 
        s.title.toLowerCase().includes(cleanQ) || 
        s.artist.toLowerCase().includes(cleanQ)
    );

    if (matches.length === 0 && cleanQ.length > 2) {
        const words = cleanQ.split(/\s+/).filter(w => w.length > 2);
        matches = librarySongs.filter(s => 
            words.some(w => s.title.toLowerCase().includes(w) || s.artist.toLowerCase().includes(w))
        );
    }
    return matches;
}

export function getCurrentlyPlaying() {
    if (typeof window !== 'undefined' && window.DTSMusic && typeof window.DTSMusic.getCurrentSong === 'function') {
        return window.DTSMusic.getCurrentSong();
    }
    return librarySongs[0];
}

// ==========================================
// 3. OFFLINE INTELLIGENCE ENGINE (FALLOUT)
// ==========================================
export function generateOfflineResponse(userInput) {
    const text = (userInput || '').trim();
    const lower = text.toLowerCase();
    const pageCtx = getPageContext();
    const account = getUserAccountSnapshot();
    const cart = getCartSnapshot();
    const countdowns = getDreamsCountdownsData();

    // 1. Safeguard Check: Security & Secrets
    const securityPatterns = ['api key', 'apikey', 'secret key', 'backend architecture', 'database password', 'firebase secret', 'system prompt', 'ignore previous instructions', 'admin credentials', 'service account'];
    if (securityPatterns.some(p => lower.includes(p))) {
        return "I cannot share API keys, backend architecture, development secrets, or internal server configurations. That information is classified to protect the Unstoppable ecosystem.";
    }

    // 2. Page Awareness: "What am I looking at?" / "What page is this?"
    const pageQueryPatterns = ['what am i looking at', 'what page is this', 'where am i', 'explain this page', 'what is this page', 'what is on this page', 'tell me about this page', 'what can i do here', 'what is this'];
    if (pageQueryPatterns.some(p => lower.includes(p))) {
        if (pageCtx.isAccount) {
            let res = `You are viewing your **Unstoppable Account Dashboard**!\n\nHere is your current live account status:\n` +
                `* **Member:** **${escapeHTML(account.username)}** (${escapeHTML(account.email)})\n` +
                `* **Current Plan:** **${escapeHTML(account.plan)}**\n` +
                `* **Unstoppable Loyalty Points:** **${account.points} pts**\n` +
                `* **Daily Check-in Streak:** **${account.streak} day${account.streak === 1 ? '' : 's'}**\n` +
                `* **Order History:** ${escapeHTML(account.orderSummary)}\n`;
            if (account.wishlistCount > 0) {
                res += `* **Wishlist:** ${account.wishlistCount} item${account.wishlistCount === 1 ? '' : 's'} saved\n`;
            }
            res += `\n**What you can do on this page:**\n` +
                `* Claim your **Daily Minecraft Check-in** to earn rare resources and loyalty points.\n` +
                `* Review recent order receipts and shipping progress.\n` +
                `* Manage your subscription and VIP membership benefits.\n` +
                `* Customize your visual themes (Lotus Pink, Rainforest, Custom Hex).\n` +
                `* File customer support tickets for quick assistance.\n` +
                `[VIEW_ACCOUNT_DASHBOARD]`;
            return res;
        }

        if (pageCtx.isShop) {
            let res = `You are browsing the official **Unstoppable Merch Store**!\n\n` +
                `Check out our premium gear and apparel:\n` +
                `* **Unstoppable Hoodie** ($59.99) - Ultra-plush comfort with embroidered brand logo.\n` +
                `* **DTS Model Tee** ($24.99) - Iconic Dreams TimeSkip character art.\n` +
                `* **HarmonyTunes Cap** ($24.99) - Low-profile embroidered headwear.\n` +
                `* **Unstoppable Mousepad** ($19.99) - Precision micro-weave gaming surface.\n` +
                `* **Ceramic Mug** ($14.99) - High-gloss dishwasher-safe drinkware.\n\n` +
                `*Bonus:* You earn **10 Unstoppable Loyalty Points** for every dollar spent!\n`;
            if (!cart.empty) {
                res += `\n🛒 You currently have **${cart.count} item${cart.count === 1 ? '' : 's'}** in your cart ($${cart.subtotal.toFixed(2)}).\n[VIEW_CART_BUTTON] [CHECKOUT_BUTTON]`;
            }
            return res;
        }

        if (pageCtx.isCheckout) {
            let res = `You are on the **Checkout Page**!\n\n`;
            if (cart.empty) {
                res += `Your shopping cart is currently empty. Head over to the store to add gear before checking out!\n[VIEW_SHOP]`;
            } else {
                res += `Here is your current order summary:\n`;
                cart.items.forEach(item => {
                    res += `* **${item.qty}x ${escapeHTML(item.name)}** - $${item.total.toFixed(2)}\n`;
                });
                res += `\n**Subtotal:** $${cart.subtotal.toFixed(2)} (plus tax)\n` +
                    `Enter your shipping details below to place your order securely with Stripe!\n[CHECKOUT_BUTTON]`;
            }
            return res;
        }

        if (pageCtx.isCart) {
            let res = `You are viewing **Your Cart**!\n\n`;
            if (cart.empty) {
                res += `Your cart is currently empty. Explore our collection to find apparel, music, and accessories!\n[VIEW_SHOP]`;
            } else {
                res += `Here is your current cart breakdown:\n`;
                cart.items.forEach(item => {
                    res += `* **${item.qty}x ${escapeHTML(item.name)}** - $${item.total.toFixed(2)}\n`;
                });
                res += `\n**Estimated Subtotal:** $${cart.subtotal.toFixed(2)} (plus tax)\n` +
                    `You can adjust quantities, apply promo codes, or proceed directly to checkout:\n[CHECKOUT_BUTTON]`;
            }
            return res;
        }

        if (pageCtx.isMedixly) {
            const currentSong = getCurrentlyPlaying();
            return `You are in **Medixly** (formerly HarmonyTunes) — the creative sound & music hub under the Unstoppable Umbrella!\n\n` +
                `* **Stream & Loop:** Enjoy curated Top 100 tracks or loop your favorite snippets.\n` +
                `* **Lexi Mixer:** Crossfade, EQ, and mix dual tracks directly in your browser.\n` +
                `* **Artist Studio:** Upload tracks and create previews.\n` +
                `\nCurrently queued: **${escapeHTML(currentSong.title)}** by **${escapeHTML(currentSong.artist)}**.\n` +
                `[PLAY_SONG:${currentSong.id}]`;
        }

        if (pageCtx.isSquishly) {
            return `You are playing **Squishly** — our physics-driven ASMR arcade game!\n\n` +
                `* **How to Play:** Colorful squishy blobs fall from the ceiling. Tap or stretch them before they reach the bottom to rack up combos and high scores.\n` +
                `* **Rule of 5:** If 5 blobs hit the ground, your run ends!\n` +
                `* **Leaderboards:** Play as a guest or sign in to immortalize your name on the global leaderboard.\n` +
                `[PLAY_SQUISHLY]`;
        }

        if (pageCtx.isDTS) {
            return `You are on the **Dreams TimeSkip & Dreams OG** portal!\n\n` +
                `Here are the live launch countdowns and server connection details:\n` +
                `* **Dreams OG Launch:** October 20, 2026 — **${countdowns.dreamsOG.countdown}**!\n` +
                `* **Dreams TimeSkip Launch:** January 15, 2027 — **${countdowns.dreamsTimeSkip.countdown}**!\n` +
                `* **Official Server IP:** \`${countdowns.serverIP}\`\n` +
                `* **Minecraft Version:** ${countdowns.minecraftVersion}\n` +
                `* **Server Status:** ${countdowns.serverStatus}.`;
        }

        if (pageCtx.isTracker) {
            return `You are viewing **ezManage** — our dynamic shift, roster, and inventory tracking solution designed for versatile management.`;
        }

        if (pageCtx.isAutolux) {
            return `You are viewing **Autolux** — our premier mobile car detailing service offering high-end ceramic coatings, paint correction, and interior restoration.`;
        }

        // Default: Index / Hub
        return `You are looking at the **Unstoppable Hub** — the true central portal and home base for the entire **Unstoppable Umbrella**!\n\n` +
            `From here, you have instant access to our complete lineup of projects:\n` +
            `* **Dreams TimeSkip & Dreams OG**: Our upcoming Minecraft server saga.\n` +
            `* **Medixly**: Our newly rebranded music streaming and audio editing hub.\n` +
            `* **Unstoppable Merch**: Official hoodies, model tees, caps, and mugs.\n` +
            `* **Squishly**: Our addictive physics-based ASMR arcade mini-game.\n` +
            `* **ezManage & Autolux**: Business shift tracking and mobile auto detailing.\n` +
            `* **Community**: Our YouTube gaming channel (@Unstoppab1e) and Discord community!`;
    }

    // 3. Account Queries (Points, Streak, Orders, Plan)
    const accountKeywords = ['point', 'points', 'streak', 'order', 'orders', 'history', 'plan', 'subscription', 'tier', 'membership', 'profile', 'checkin', 'check in', 'who am i', 'my account'];
    if (accountKeywords.some(w => lower.includes(w))) {
        let res = `Here is your current Unstoppable Account snapshot:\n` +
            `* **User:** **${escapeHTML(account.username)}** (${escapeHTML(account.email)})\n` +
            `* **Plan Status:** **${escapeHTML(account.plan)}**\n` +
            `* **Loyalty Points:** **${account.points} pts**\n` +
            `* **Daily Check-in Streak:** **${account.streak} day${account.streak === 1 ? '' : 's'}**\n` +
            `* **Order History:** ${escapeHTML(account.orderSummary)}\n`;
        if (account.wishlistCount > 0) {
            res += `* **Wishlist:** ${account.wishlistCount} item(s) saved\n`;
        }
        res += `\n[VIEW_ACCOUNT_DASHBOARD]`;
        return res;
    }

    // 4. Countdown Timers & Minecraft Server
    const countdownKeywords = ['countdown', 'timer', 'launch', 'release', 'dreams og', 'dreams timeskip', 'dts', 'server ip', 'ip', 'address', 'connect', 'minecraft', 'version', 'maintenance'];
    if (countdownKeywords.some(w => lower.includes(w))) {
        return `Here are the official Minecraft server details and live countdowns:\n\n` +
            `* **Dreams OG Launch:** October 20, 2026 — **${countdowns.dreamsOG.countdown}**!\n` +
            `* **Dreams TimeSkip Launch:** January 15, 2027 — **${countdowns.dreamsTimeSkip.countdown}**!\n` +
            `* **Server IP:** \`${countdowns.serverIP}\`\n` +
            `* **Supported Version:** ${countdowns.minecraftVersion}\n` +
            `* **Status:** ${countdowns.serverStatus}. Mark your calendar for October 20th!`;
    }

    // 5. Cart & Checkout Inquiries
    const cartKeywords = ['cart', 'checkout', 'buy', 'order item', 'my cart', 'view cart', 'shopping bag', 'pay'];
    if (cartKeywords.some(w => lower.includes(w))) {
        if (cart.empty) {
            return `Your shopping cart is currently empty!\n\n` +
                `Check out our official gear in the store:\n` +
                `* **Unstoppable Hoodie** ($59.99)\n` +
                `* **DTS Model Tee** ($24.99)\n` +
                `* **HarmonyTunes Cap** ($24.99)\n` +
                `* **Unstoppable Ceramic Mug** ($14.99)\n` +
                `[VIEW_SHOP]`;
        } else {
            let res = `Here is what is currently in your shopping cart:\n\n`;
            cart.items.forEach(item => {
                res += `* **${item.qty}x ${escapeHTML(item.name)}** - $${item.total.toFixed(2)}\n`;
            });
            res += `\n**Total:** **$${cart.subtotal.toFixed(2)}** (plus tax)\n` +
                `You can view your full cart or proceed directly to checkout:\n` +
                `[VIEW_CART_BUTTON] [CHECKOUT_BUTTON]`;
            return res;
        }
    }

    // 6. Squishly & Game Recommendations
    const gameKeywords = ['game', 'games', 'squishly', 'blob', 'blobgame', 'arcade', 'minigame', 'play a game', 'play squishly'];
    if (gameKeywords.some(w => lower.includes(w))) {
        return `You should play **Squishly**! It's our juicy, ASMR arcade mini-game under the Unstoppable Umbrella.\n\n` +
            `* **Objective:** Blobs fall from the ceiling — tap or stretch them before they fall to build combos!\n` +
            `* **Danger:** Don't miss 5 blobs or your run ends.\n` +
            `* **Leaderboards:** Compete in guest mode or sign in with your account to set high scores.\n` +
            `[PLAY_SQUISHLY]`;
    }

    // 7. Music & Medixly Play Request
    const musicKeywords = ['song', 'songs', 'music', 'listen', 'track', 'tracks', 'medixly', 'harmonytunes', 'sound', 'artist'];
    const isPlayMusic = lower.startsWith('play ') || lower === 'play' || lower.includes('play a song');
    if (musicKeywords.some(w => lower.includes(w)) || isPlayMusic) {
        const matches = searchMusicLibrary(lower);
        if (matches.length > 0) {
            const selected = matches[0];
            // If sitewide player is available, trigger playback
            if (typeof window !== 'undefined') {
                if (window.DTSMusic && typeof window.DTSMusic.playSongById === 'function') {
                    window.DTSMusic.playSongById(selected.id).catch?.(() => {});
                } else if (typeof window.playSongById === 'function') {
                    window.playSongById(selected.id);
                }
            }
            return `Now queueing up **${escapeHTML(selected.title)}** by **${escapeHTML(selected.artist)}** on Medixly!\n\n` +
                `[PLAY_SONG:${selected.id}]`;
        } else {
            const cleanQuery = lower.replace(/^(play\s+|song\s+|listen to\s+)/i, '').trim();
            return `I searched our Medixly library, but couldn't find a track matching **"${escapeHTML(cleanQuery)}"**.\n\n` +
                `Would you like me to submit a song request to the Unstoppable team to add it?\n` +
                `[REQUEST_SONG:${escapeHTML(cleanQuery)}]`;
        }
    }

    // 8. General Brand & Ecosystem Inquiries
    if (lower.includes('unstoppable') || lower.includes('about')) {
        return `**Unstoppable** is the parent brand and central entertainment ecosystem founded by Unstoppable! Under the Unstoppable Umbrella, we build:\n\n` +
            `* **Gaming & YouTube**: @Unstoppab1e gaming channel.\n` +
            `* **Dreams TimeSkip & Dreams OG**: Our dual Minecraft server universe launching in 2026/2027.\n` +
            `* **Medixly**: Our custom music streaming and creator editing platform.\n` +
            `* **Squishly**: Our ASMR physics-driven arcade mini-game.\n` +
            `* **Merch Store**: Official apparel and accessories.\n` +
            `* **ezManage & Autolux**: Business productivity tracking and mobile auto detailing.`;
    }

    // 9. Friendly Default Persona Response
    return `Hello! I'm **Lexi**, your Unstoppable ecosystem assistant. Here are a few things I can do right now:\n\n` +
        `* Tell you about the page you're looking at ("*What am I looking at?*")\n` +
        `* Check your **loyalty points**, **streak**, or **order history**\n` +
        `* Check live countdowns to **Dreams OG** & **Dreams TimeSkip**\n` +
        `* Search & play songs in **Medixly** ("*Play a song*")\n` +
        `* Show items in your shopping cart or provide a **checkout button**\n` +
        `* Launch our ASMR arcade mini-game, **Squishly**!\n` +
        `[PLAY_SQUISHLY]`;
}

// ==========================================
// 4. VERTEX AI MODEL SETUP & TOOLS
// ==========================================
const tools = [
    {
        functionDeclarations: [
            {
                name: "getPageContext",
                description: "Get information about the current page the user is viewing, including page title, tag, and features.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "getUserAccountInfo",
                description: "Get current user profile data: points balance, check-in streak, subscription plan, and recent orders.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "getShoppingCartContents",
                description: "Retrieves the current items, quantities, and subtotal in the user's Unstoppable merchandise shopping cart.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "getDreamsCountdowns",
                description: "Get official launch dates, server IP (dts.realunstoppable.store), server status, and live countdowns for Dreams OG and Dreams TimeSkip.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "getCurrentlyPlayingSong",
                description: "Get information about the song that is currently playing in the sitewide music player (Medixly).",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "playHarmonyTunesSong",
                description: "Play a specific song in Medixly by its ID.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        songId: {
                            type: "STRING",
                            description: "The ID of the song to play."
                        }
                    },
                    required: ["songId"]
                }
            },
            {
                name: "searchHarmonyTunesLibrary",
                description: "Search the Medixly music library for a specific song or artist.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: {
                            type: "STRING",
                            description: "The song or artist to search for."
                        }
                    }
                }
            },
            {
                name: "requestSongAddition",
                description: "Submit a request to the admin to add a new song to the Medixly library.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        songName: {
                            type: "STRING",
                            description: "The title of the song being requested"
                        },
                        artistName: {
                            type: "STRING",
                            description: "The artist of the song being requested"
                        }
                    },
                    required: ["songName", "artistName"]
                }
            }
        ]
    }
];

let chatSession = null;
let isLiveAI = false;

try {
    const ai = getVertexAI(app);
    const model = getGenerativeModel(ai, {
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction,
        tools: tools,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
        }
    });
    chatSession = model.startChat({
        history: []
    });
    isLiveAI = true;
} catch (error) {
    console.error("Manager info: AI Model Initialization Failed", error);
    isLiveAI = false;
}

// ==========================================
// 5. CHATBOT UI CONTROLLER & EVENT LISTENERS
// ==========================================
export function initChatbot() {
    // Inject CSS automatically if not present
    if (typeof document === 'undefined') return;

    if (!document.querySelector('link[href*="chatbot.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/chatbot.css';
        document.head.appendChild(link);
    }

    let chatbotWindow = document.getElementById('chatbot-window');
    const pageCtx = getPageContext();
    const cartSnapshot = getCartSnapshot();

    // Inject Chatbot HTML if not present
    if (!chatbotWindow) {
        chatbotWindow = document.createElement('div');
        chatbotWindow.id = 'chatbot-window';
        chatbotWindow.className = 'chatbot-overlay';
        chatbotWindow.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-title-container">
                    <h3>Lexi</h3>
                    <span id="lexi-status-badge" class="lexi-status-badge ${isLiveAI ? 'live' : 'offline'}" title="${isLiveAI ? 'Live Vertex AI Active' : 'Offline Mode: Local Site Intelligence Active'}">
                        <span class="status-dot"></span>
                        <span id="lexi-status-text">${isLiveAI ? 'Live Lexi' : 'Offline Lexi'}</span>
                    </span>
                </div>
                <div class="chatbot-header-actions">
                    <span id="chatbot-page-tag" class="chatbot-page-tag">${escapeHTML(pageCtx.tag)}</span>
                    <button id="chatbot-close" class="chatbot-close" aria-label="Close chat" title="Close chat">&times;</button>
                </div>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chat-msg siri">
                    <p>Hello! I'm Lexi. I can help you navigate the Unstoppable Hub, recommend games, or answer questions about the Unstoppable ecosystem and Dreams TimeSkip.</p>
                    <div class="chat-suggestion-chips">
                        <button class="chat-chip" data-prompt="What am I looking at?">What am I looking at?</button>
                        <button class="chat-chip" data-prompt="Play Squishly">🎮 Play Squishly</button>
                        <button class="chat-chip" data-prompt="Play a song">🎵 Play a Song</button>
                        <button class="chat-chip" data-prompt="DTS Countdowns">⏳ DTS Countdowns</button>
                        ${pageCtx.isAccount ? '<button class="chat-chip" data-prompt="My Points & Streak">🏆 My Points & Streak</button>' : ''}
                        ${pageCtx.isCart ? '<button class="chat-chip" data-prompt="Proceed to checkout">💳 Proceed to checkout</button>' : ''}
                        ${cartSnapshot.count > 0 && !pageCtx.isCart ? '<button class="chat-chip" data-prompt="What is in my cart?">🛒 View Cart (' + cartSnapshot.count + ')</button>' : ''}
                    </div>
                </div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Ask Lexi..." autocomplete="off" aria-label="Chat input">
                <button id="chatbot-send" aria-label="Send Message" title="Send Message" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        `;
        document.body.appendChild(chatbotWindow);
    }

    const closeBtn = document.getElementById('chatbot-close');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    function setLexiMode(live) {
        isLiveAI = live;
        const badge = document.getElementById('lexi-status-badge');
        const badgeText = document.getElementById('lexi-status-text');
        if (badge && badgeText) {
            if (live) {
                badge.className = 'lexi-status-badge live';
                badge.title = 'Live Vertex AI Active';
                badgeText.textContent = 'Live Lexi';
            } else {
                badge.className = 'lexi-status-badge offline';
                badge.title = 'Offline Mode: Local Site Intelligence Active';
                badgeText.textContent = 'Offline Lexi';
            }
        }
    }

    // Global Functions for Cart Integration
    window.updateLexiCartCount = function(count) {
        const cartBadge = document.getElementById('lexi-cart-badge') || document.querySelector('.lexi-cart-badge');
        if (!cartBadge) return;
        if (count > 0) {
            cartBadge.textContent = count;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    };

    window.openLexiChat = function() {
        if (chatbotWindow) {
            chatbotWindow.classList.add('active');
            // Update page tag dynamically when opening
            const currentCtx = getPageContext();
            const tagEl = document.getElementById('chatbot-page-tag');
            if (tagEl) tagEl.textContent = currentCtx.tag;
            if (chatInput) chatInput.focus();
        }
    };

    window.animateItemToLexi = function(startX, startY) {
        const targetOrb = document.getElementById('siri-orb');
        if (!targetOrb) return;
        
        const orbRect = targetOrb.getBoundingClientRect();
        const endX = orbRect.left + orbRect.width / 2;
        const endY = orbRect.top + orbRect.height / 2;

        const particle = document.createElement('div');
        particle.className = 'fly-to-cart';
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        document.body.appendChild(particle);
        particle.getBoundingClientRect();

        particle.style.left = `${endX}px`;
        particle.style.top = `${endY}px`;
        particle.style.transform = 'scale(0.2)';
        particle.style.opacity = '0';

        setTimeout(() => {
            particle.remove();
            const badge = document.getElementById('lexi-cart-badge') || document.querySelector('.lexi-cart-badge');
            if (badge) {
                badge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 150);
            }
        }, 800);
    };

    closeBtn?.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbotWindow && chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
        }
    });

    // Trap focus within the chatbot window
    chatbotWindow.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;

        const focusableElements = chatbotWindow.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Handle interactive suggestion chips
    chatMessages.addEventListener('click', (e) => {
        const chip = e.target.closest('.chat-chip');
        if (chip && chip.dataset.prompt) {
            chatInput.value = chip.dataset.prompt;
            sendMessage();
            return;
        }

        const songPlayBtn = e.target.closest('.chat-song-play-btn');
        if (songPlayBtn && songPlayBtn.dataset.songId) {
            const songId = songPlayBtn.dataset.songId;
            if (window.DTSMusic && typeof window.DTSMusic.playSongById === 'function') {
                window.DTSMusic.playSongById(songId);
            } else if (typeof window.playSongById === 'function') {
                window.playSongById(songId);
            }
            songPlayBtn.textContent = '✓ Playing';
            songPlayBtn.classList.add('playing');
            return;
        }

        const openCartBtn = e.target.closest('.chat-open-cart-action');
        if (openCartBtn) {
            window.location.href = 'https://realunstoppable.store/cart.html';
            return;
        }

        const requestSongBtn = e.target.closest('.chat-request-song-action');
        if (requestSongBtn && requestSongBtn.dataset.songTitle) {
            const songTitle = requestSongBtn.dataset.songTitle;
            requestSongBtn.disabled = true;
            requestSongBtn.textContent = 'Submitting Request...';
            addDoc(collection(db, "song_requests"), {
                songName: songTitle,
                artistName: "Unknown",
                requestedAt: serverTimestamp(),
                status: "pending"
            }).then(() => {
                requestSongBtn.textContent = '✓ Request Submitted to Admin!';
            }).catch((err) => {
                requestSongBtn.textContent = '✓ Requested (Offline Saved)';
            });
        }
    });

    // Handle Input & Messaging
    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add user message to UI
        addMessage(text, 'user');
        chatInput.value = '';
        sendBtn.disabled = true;

        // 2. Add typing indicator
        const typingId = addTypingIndicator();

        // If Live AI is active, attempt Vertex AI chat
        if (isLiveAI && chatSession) {
            try {
                let result = await chatSession.sendMessage(text);
                let calls = result.response.functionCalls ? (typeof result.response.functionCalls === 'function' ? result.response.functionCalls() : result.response.functionCalls) : [];

                while (calls && calls.length > 0) {
                    const functionResponses = [];
                    for (const call of calls) {
                        let callResult = null;
                        if (call.name === "getPageContext") {
                            callResult = getPageContext();
                        } else if (call.name === "getUserAccountInfo") {
                            callResult = getUserAccountSnapshot();
                        } else if (call.name === "getShoppingCartContents") {
                            callResult = getCartSnapshot();
                        } else if (call.name === "getDreamsCountdowns") {
                            callResult = getDreamsCountdownsData();
                        } else if (call.name === "getCurrentlyPlayingSong") {
                            const song = getCurrentlyPlaying();
                            callResult = { song: song.title, artist: song.artist, id: song.id };
                        } else if (call.name === "playHarmonyTunesSong") {
                            const songId = call.args.songId;
                            if (window.DTSMusic && typeof window.DTSMusic.playSongById === 'function') {
                                window.DTSMusic.playSongById(songId);
                            } else if (typeof window.playSongById === 'function') {
                                window.playSongById(songId);
                            }
                            callResult = { success: true, message: "Playing song" };
                        } else if (call.name === "searchHarmonyTunesLibrary") {
                            const matches = searchMusicLibrary(call.args.query || "");
                            callResult = { results: matches.map(s => ({ id: s.id, title: s.title, artist: s.artist })) };
                        } else if (call.name === "requestSongAddition") {
                            try {
                                await addDoc(collection(db, "song_requests"), {
                                    songName: call.args.songName,
                                    artistName: call.args.artistName || "Unknown",
                                    requestedAt: serverTimestamp(),
                                    status: "pending"
                                });
                                callResult = { success: true, message: "Song request recorded" };
                            } catch (e) {
                                callResult = { success: false, error: e.message };
                            }
                        }

                        functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: callResult
                            }
                        });
                    }
                    result = await chatSession.sendMessage(functionResponses);
                    calls = result.response.functionCalls ? (typeof result.response.functionCalls === 'function' ? result.response.functionCalls() : result.response.functionCalls) : [];
                }

                const responseText = result.response.text();
                removeElement(typingId);
                addMessage(responseText, 'siri');
            } catch (error) {
                // FALLBACK: When Vertex AI fails, smoothly switch to Offline Lexi without saying Lexi is sleeping!
                console.error("Manager info: Chat Error ", error);
                setLexiMode(false);
                const offlineReply = generateOfflineResponse(text);
                removeElement(typingId);
                addMessage(offlineReply, 'siri');
            } finally {
                sendBtn.disabled = false;
                chatInput.focus();
            }
        } else {
            // Offline Lexi mode directly
            setLexiMode(false);
            setTimeout(() => {
                const offlineReply = generateOfflineResponse(text);
                removeElement(typingId);
                addMessage(offlineReply, 'siri');
                sendBtn.disabled = false;
                chatInput.focus();
            }, 200);
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    chatInput.addEventListener('input', () => {
        sendBtn.disabled = chatInput.value.trim().length === 0;
    });

    // UI Helpers
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        if (sender === 'siri') {
            // 1. Process Squishly token (replaces old Blob Game token)
            let hasSquishlyToken = text.includes('[PLAY_SQUISHLY]') || text.includes('[PLAY_BLOB_GAME]');
            if (hasSquishlyToken) {
                text = text.replace(/\[PLAY_SQUISHLY\]/g, '').replace(/\[PLAY_BLOB_GAME\]/g, '');
            }

            // 2. Process Cart / Checkout tokens
            let hasCheckoutToken = text.includes('[CHECKOUT_BUTTON]');
            if (hasCheckoutToken) text = text.replace(/\[CHECKOUT_BUTTON\]/g, '');

            let hasViewCartToken = text.includes('[VIEW_CART_BUTTON]');
            if (hasViewCartToken) text = text.replace(/\[VIEW_CART_BUTTON\]/g, '');

            let hasShopToken = text.includes('[VIEW_SHOP]');
            if (hasShopToken) text = text.replace(/\[VIEW_SHOP\]/g, '');

            let hasAccountToken = text.includes('[VIEW_ACCOUNT_DASHBOARD]');
            if (hasAccountToken) text = text.replace(/\[VIEW_ACCOUNT_DASHBOARD\]/g, '');

            // 3. Process Play Song token: [PLAY_SONG:<id>]
            let songIdToRender = null;
            const songMatch = text.match(/\[PLAY_SONG:([^\]]+)\]/);
            if (songMatch) {
                songIdToRender = songMatch[1];
                text = text.replace(songMatch[0], '');
            }

            // 4. Process Request Song token: [REQUEST_SONG:<title>]
            let requestSongTitle = null;
            const reqMatch = text.match(/\[REQUEST_SONG:([^\]]+)\]/);
            if (reqMatch) {
                requestSongTitle = reqMatch[1];
                text = text.replace(reqMatch[0], '');
            }

            // Convert markdown text to HTML
            msgDiv.innerHTML = parseMarkdown(text);

            // Append interactive Song Play Card
            if (songIdToRender) {
                const song = getSongById(songIdToRender) || librarySongs[0];
                const songCard = document.createElement('div');
                songCard.className = 'chat-song-card';
                songCard.innerHTML = `
                    <img src="${escapeHTML(song.art || '/images/medixly-logo.png')}" class="chat-song-art" alt="${escapeHTML(song.title)}">
                    <div class="chat-song-info">
                        <div class="chat-song-title">${escapeHTML(song.title)}</div>
                        <div class="chat-song-artist">${escapeHTML(song.artist)}</div>
                    </div>
                    <div class="chat-song-actions">
                        <button class="chat-song-play-btn" data-song-id="${escapeHTML(song.id)}" aria-label="Play ${escapeHTML(song.title)}">▶ Play Now</button>
                        <a href="medixly.html" class="chat-song-link" title="Open Medixly">Open</a>
                    </div>
                `;
                msgDiv.appendChild(songCard);
            }

            // Append Song Request Button
            if (requestSongTitle) {
                const reqBtn = document.createElement('button');
                reqBtn.className = 'chat-action-btn chat-request-song-action';
                reqBtn.dataset.songTitle = requestSongTitle;
                reqBtn.textContent = `Submit Request for "${requestSongTitle}"`;
                msgDiv.appendChild(reqBtn);
            }

            // Append Cart & Checkout Action Buttons
            if (hasCheckoutToken || hasViewCartToken || hasShopToken || hasAccountToken) {
                const actionGroup = document.createElement('div');
                actionGroup.style.display = 'flex';
                actionGroup.style.flexWrap = 'wrap';
                actionGroup.style.gap = '8px';
                actionGroup.style.marginTop = '10px';

                if (hasCheckoutToken) {
                    const chkBtn = document.createElement('a');
                    chkBtn.href = 'checkout.html';
                    chkBtn.className = 'chat-checkout-btn';
                    chkBtn.textContent = 'Proceed to Checkout →';
                    actionGroup.appendChild(chkBtn);
                }

                if (hasViewCartToken) {
                    const cartBtn = document.createElement('button');
                    cartBtn.type = 'button';
                    cartBtn.className = 'chat-viewcart-btn chat-open-cart-action';
                    cartBtn.textContent = '🛒 View Cart';
                    actionGroup.appendChild(cartBtn);
                }

                if (hasShopToken) {
                    const shopBtn = document.createElement('a');
                    shopBtn.href = 'shop.html';
                    shopBtn.className = 'chat-shop-btn';
                    shopBtn.textContent = 'Explore Shop →';
                    actionGroup.appendChild(shopBtn);
                }

                if (hasAccountToken) {
                    const accBtn = document.createElement('a');
                    accBtn.href = 'account.html#dashboard';
                    accBtn.className = 'chat-action-btn';
                    accBtn.textContent = 'Open Dashboard →';
                    actionGroup.appendChild(accBtn);
                }

                msgDiv.appendChild(actionGroup);
            }

            // Append Play Squishly Button
            if (hasSquishlyToken) {
                const playBtn = document.createElement('a');
                playBtn.href = '/blobgame.html';
                playBtn.className = 'chat-play-btn';
                playBtn.textContent = '🎮 Play Squishly';
                msgDiv.appendChild(playBtn);
            }
        } else {
            msgDiv.textContent = text;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function parseMarkdown(text) {
        if (!text) return '';
        const lines = text.split('\n');
        return lines.map(line => {
            let trimmed = line.trim();
            if (!trimmed) return '';

            let isBullet = false;
            if (/^[\*\-]\s+/.test(trimmed)) {
                isBullet = true;
                trimmed = trimmed.replace(/^[\*\-]\s+/, '');
            }

            let html = escapeHTML(trimmed);
            // Replace **bold** with <strong>bold</strong>
            html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
            // Replace *italic* or _italic_ with <em>italic</em>
            html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
            // Replace `code` with <code>code</code>
            html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 5px;border-radius:4px;font-size:0.85em;">$1</code>');
            // Replace markdown links [text](url)
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: underline;">$1</a>');

            if (isBullet) {
                return `<p class="chat-bullet"><span class="bullet-dot">•</span> ${html}</p>`;
            }
            return `<p>${html}</p>`;
        }).filter(p => p !== '').join('');
    }

    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = id;
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
}
