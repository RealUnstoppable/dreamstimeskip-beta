// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML } from './utils.js';

// --- PRODUCT DATA (Could be moved to Firestore later) ---
export const products = [
    {
        id: 'unstoppable-hoodie',
        name: 'Unstoppable Hoodie',
        price: 59.99,
        description: 'Premium black hoodie with the Unstoppable logo. Built for comfort and style.',
        imageUrl: '/images/UnstoppableHoodieModel300x300.png'
    },
    {
        id: 'dts-model-tee',
        name: 'DTS Model Tee',
        price: 24.99,
        description: 'Iconic tee featuring the official Dreams TimeSkip character art.',
        imageUrl: '/images/dreams-lobby.jpg'
    },
    {
        id: 'harmonytunes-shirt',
        name: 'HarmonyTunes Cap',
        price: 24.99,
        description: 'Dark cap with the HarmonyTunes logo. Perfect for music lovers.',
        imageUrl: '/images/harmony-tunes-card.jpg'
    },
    {
        id: 'unstoppable-mousepad',
        name: 'Unstoppable Mousepad',
        price: 19.99,
        description: 'High-performance mousepad for gaming precision.',
        imageUrl: '/images/MugAllBrands300x300.png'
    }
];

// ⚡ Bolt: Pre-computed Map for O(1) product lookups, avoiding O(N^2) nested loops when rendering carts
export const productMap = new Map(products.map(p => [p.id, p]));

// --- STATE MANAGEMENT ---
export let cart = {}; // { productId: quantity, ... }
export let wishlist = new Set(); // { productId, ... }
let currentUser = null;
let currentReviewProductId = null;
let productStatsMap = new Map();

// --- DOM ELEMENTS ---
const productGrid = document.getElementById('product-grid');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartItemCountEl = document.getElementById('cart-item-count');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const navCtaContainer = document.getElementById('nav-cta-container');

// Review Elements
const reviewsModal = document.getElementById('reviews-modal');
const closeReviewsBtn = document.getElementById('close-reviews-btn');
const reviewSubmissionSection = document.getElementById('review-submission-section');
const loginPromptSection = document.getElementById('login-prompt-section');
const reviewForm = document.getElementById('review-form');
const starInputs = document.querySelectorAll('.star-input');
const reviewText = document.getElementById('review-text');
const reviewsListContainer = document.getElementById('reviews-list-container');
const submitReviewBtn = document.getElementById('submit-review-btn');
const reviewNotification = document.getElementById('review-notification');

let currentRating = 0;

// --- RENDER FUNCTIONS ---
function generateStarsHtml(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(product => {
        const isWishlisted = wishlist.has(product.id);
        const heartIcon = isWishlisted ? '❤️' : '🤍';
        const activeClass = isWishlisted ? 'active' : '';

        const stats = productStatsMap.get(product.id) || { averageRating: 0, reviewCount: 0 };
        const displayRating = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'No reviews';
        const starsHtml = stats.averageRating > 0 ? generateStarsHtml(stats.averageRating) : '';

        return `
            <div class="product-card">
                <button class="wishlist-btn ${activeClass}" data-id="${product.id}" aria-label="Toggle Wishlist">
                    ${heartIcon}
                </button>
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-stars-container">
                        ${stats.averageRating > 0 ? `<span class="star-rating">${starsHtml}</span>` : ''}
                        <span class="rating-count">(${displayRating}${stats.reviewCount > 0 ? ` - ${stats.reviewCount} reviews` : ''})</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                    <button class="reviews-btn" data-id="${product.id}">Read Reviews</button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadProductStats() {
    try {
        const statsSnapshot = await getDocs(collection(db, 'product_stats'));
        statsSnapshot.forEach(doc => {
            productStatsMap.set(doc.id, doc.data());
        });
        renderProducts();
    } catch (error) {
        console.error("Error loading product stats:", error);
    }
}

function renderCart() {
    if (!cartItemsContainer || !checkoutBtn) return;
    if (Object.keys(cart).length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = Object.entries(cart).map(([productId, quantity]) => {
                // ⚡ Bolt: O(1) lookup replaces O(N) products.find()
                const product = productMap.get(productId);
                if (!product) return ''; // Should not happen
                return `
                    <div class="cart-item">
                        <img src="${product.imageUrl}" alt="${product.name}" class="cart-item-img" loading="lazy">
                        <div class="cart-item-info">
                            <h4>${product.name}</h4>
                            <p>$${product.price.toFixed(2)}</p>
                        </div>
                        <div class="cart-item-actions">
                            <input type="number" value="${quantity}" min="1" data-id="${productId}" class="item-quantity-input">
                            <button class="remove-item-btn" data-id="${productId}" aria-label="Remove item">&#128465;</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
    updateCartSummary();
}

function updateCartSummary() {
    const { itemCount, totalPrice } = calculateCartSummary(cart, products);

    if (cartItemCountEl) cartItemCountEl.textContent = itemCount;
    if (cartTotalPriceEl) cartTotalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- CART LOGIC ---
export async function handleAddToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    try {
        await saveCart();
        renderCart();
    } catch (error) {
        console.error('Failed to add to cart - Manager info:', error.message);
    }
}

export async function handleUpdateQuantity(productId, quantity) {
    if (quantity <= 0) {
        await handleRemoveFromCart(productId);
    } else {
        cart[productId] = parseInt(quantity, 10);
        await saveCart();
        renderCart();
    }
}

async function handleRemoveFromCart(productId) {
    delete cart[productId];
    await saveCart();
    renderCart();
}

// --- FIREBASE & LOCALSTORAGE INTEGRATION ---
let saveCartTimeout = null;
let saveWishlistTimeout = null;
let pendingResolves = [];

async function saveWishlist() {
    if (!currentUser) return;

    return new Promise((resolve, reject) => {
        if (saveWishlistTimeout) clearTimeout(saveWishlistTimeout);

        saveWishlistTimeout = setTimeout(async () => {
            try {
                const userWishlistRef = doc(db, 'wishlists', currentUser.uid);
                await setDoc(userWishlistRef, { items: Array.from(wishlist) });
                resolve();
            } catch (error) {
                console.error("Error saving wishlist to Firestore:", error);
                reject(error);
            }
        }, 500);
    });
}

async function saveCart() {
    updateCartSummary(); // Update UI immediately for responsiveness

    // Clear existing timeout if there is one
    // Debounce the Firestore write
    if (saveCartTimeout) {
        clearTimeout(saveCartTimeout);
    }

    // Always update local cache immediately
    if (!currentUser) {
        localStorage.setItem('localCart', JSON.stringify(cart));
    } else {
        // Debounce Firestore writes for authenticated users
        saveCartTimeout = setTimeout(async () => {
    saveCartTimeout = setTimeout(async () => {
        if (currentUser) {
            try {
                const userCartRef = doc(db, 'carts', currentUser.uid);
                await setDoc(userCartRef, { items: cart });
            } catch (error) {
                console.error("Error saving cart to Firestore:", error);
            }
        }, 500); // 500ms debounce
        } else {
            // Save cart to localStorage for logged-out users
            localStorage.setItem('localCart', JSON.stringify(cart));
        }
    }, 500); // Wait 500ms before committing to backend
    if (saveCartTimeout) {
        clearTimeout(saveCartTimeout);
    }

    return new Promise((resolve) => {
        pendingResolves.push(resolve);
        saveCartTimeout = setTimeout(async () => {
            if (currentUser) {
                try {
                    const userCartRef = doc(db, 'carts', currentUser.uid);
                    await setDoc(userCartRef, { items: cart });
                } catch (error) {
                    console.error("Error saving cart to Firestore:", error);
                }
            } else {
                // **MODIFIED**: Save cart to localStorage for logged-out users
                localStorage.setItem('localCart', JSON.stringify(cart));
            }
            // Resolve all promises that were waiting for this debounce cycle
            const resolves = pendingResolves;
            pendingResolves = [];
            resolves.forEach(r => r());
        }, 500); // 500ms debounce
    });
}

// --- AUTHENTICATION & UI UPDATES ---
function updateUserNav(user) {
    if (!navCtaContainer) return;
    if (user) {
        navCtaContainer.innerHTML = `<a href="account.html" class="cta-button nav-cta">My Account</a>`;
    } else {
        navCtaContainer.innerHTML = `<a href="sign in beta.html" class="cta-button nav-cta">Sign In</a>`;
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Product grid listeners
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.dataset.id;
                handleAddToCart(productId);
            }
        });
    }
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.id;
            handleAddToCart(productId);
        } else if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
            const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
            const productId = btn.dataset.id;
            toggleWishlist(productId);
        } else if (e.target.classList.contains('reviews-btn')) {
            const productId = e.target.dataset.id;
            openReviewsModal(productId);
        }
    });

    // Review Modal Listeners
    if (closeReviewsBtn && reviewsModal) {
        closeReviewsBtn.addEventListener('click', () => reviewsModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === reviewsModal) {
                reviewsModal.style.display = 'none';
            }
        });
    }

    // Star Rating Logic
    starInputs.forEach(star => {
        star.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.dataset.value);
            starInputs.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.value) <= currentRating);
                s.setAttribute('aria-checked', parseInt(s.dataset.value) <= currentRating ? 'true' : 'false');
            });
        });

        // Keyboard accessibility for stars
        star.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                star.click();
            }
        });
    });

    // Review Form Submit
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // Cart modal listeners
    if (cartButton && cartModal && closeCartBtn) {
        cartButton.addEventListener('click', () => cartModal.style.display = 'block');
        closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Cart item action listeners
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const productId = e.target.dataset.id;
                handleRemoveFromCart(productId);
            }
        });
        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-quantity-input')) {
                const productId = e.target.dataset.id;
                const quantity = parseInt(e.target.value, 10);
                handleUpdateQuantity(productId, quantity);
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Updated to point to the new checkout.html page
            window.location.href = 'checkout.html';
        });
    }
}


// --- REVIEW FUNCTIONS ---
async function openReviewsModal(productId) {
    currentReviewProductId = productId;
    const product = productMap.get(productId);

    document.getElementById('reviews-modal-title').textContent = `Reviews for ${product.name}`;
    reviewsListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">Loading reviews...</p>';

    // Reset Form
    currentRating = 0;
    starInputs.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
    });
    reviewText.value = '';
    reviewNotification.innerHTML = '';

    // Toggle Auth Sections
    if (currentUser) {
        reviewSubmissionSection.style.display = 'block';
        loginPromptSection.style.display = 'none';
    } else {
        reviewSubmissionSection.style.display = 'none';
        loginPromptSection.style.display = 'block';
    }

    // Load Stats and Reviews
    const stats = productStatsMap.get(productId) || { averageRating: 0, reviewCount: 0 };
    document.getElementById('modal-average-rating').textContent = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0';
    document.getElementById('modal-stars-display').innerHTML = stats.averageRating > 0 ? generateStarsHtml(stats.averageRating) : '★★★★★';
    document.getElementById('modal-review-count').textContent = `${stats.reviewCount} review${stats.reviewCount !== 1 ? 's' : ''}`;

    reviewsModal.style.display = 'block';
    await loadReviews(productId);
}

async function loadReviews(productId) {
    try {
        const q = query(collection(db, "reviews"), where("productId", "==", productId), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            reviewsListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">No reviews yet. Be the first!</p>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const review = doc.data();
            const date = review.createdAt ? review.createdAt.toDate().toLocaleDateString() : 'Just now';
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${escapeHTML(review.authorName || 'Anonymous')}</span>
                        <span class="review-date">${date}</span>
                    </div>
                    <div class="review-stars">${generateStarsHtml(review.rating)}</div>
                    <p class="review-content">${escapeHTML(review.text)}</p>
                </div>
            `;
        });
        reviewsListContainer.innerHTML = html;

    } catch (error) {
        console.error("Error loading reviews - Manager info:", error.message);
        reviewsListContainer.innerHTML = '<p style="color: var(--accent-red); text-align: center;">Error loading reviews.</p>';
    }
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!currentUser || !currentReviewProductId) return;

    if (currentRating === 0) {
        reviewNotification.innerHTML = '<span style="color: var(--accent-red);">Please select a star rating.</span>';
        return;
    }

    const text = reviewText.value.trim();
    if (!text) return;

    const originalText = submitReviewBtn.textContent;
    submitReviewBtn.disabled = true;
    submitReviewBtn.textContent = 'Submitting...';

    try {
        const cacheKey = `profile_${currentUser.uid}`;
        const cachedProfile = sessionStorage.getItem(cacheKey);
        let authorName = currentUser.displayName || 'Anonymous';

        if (cachedProfile) {
            const userData = JSON.parse(cachedProfile);
            if (userData.username) authorName = userData.username;
        } else {
             const userDoc = await getDoc(doc(db, "users", currentUser.uid));
             if (userDoc.exists() && userDoc.data().username) {
                 authorName = userDoc.data().username;
             }
        }

        await addDoc(collection(db, "reviews"), {
            productId: currentReviewProductId,
            userId: currentUser.uid,
            authorName: authorName,
            rating: currentRating,
            text: text,
            createdAt: serverTimestamp()
        });

        // Optimistic UI Update for stats
        const currentStats = productStatsMap.get(currentReviewProductId) || { averageRating: 0, reviewCount: 0 };
        const newTotal = (currentStats.averageRating * currentStats.reviewCount) + currentRating;
        const newCount = currentStats.reviewCount + 1;
        productStatsMap.set(currentReviewProductId, {
            averageRating: newTotal / newCount,
            reviewCount: newCount
        });

        reviewText.value = '';
        currentRating = 0;
        starInputs.forEach(s => {
            s.classList.remove('active');
            s.setAttribute('aria-checked', 'false');
        });

        reviewNotification.innerHTML = '<span style="color: var(--accent-green);">Review submitted successfully!</span>';
        setTimeout(() => reviewNotification.innerHTML = '', 3000);

        renderProducts(); // Update stars on grid
        await openReviewsModal(currentReviewProductId); // Refresh modal

    } catch (error) {
        console.error("Error submitting review - Manager info:", error.message);
        reviewNotification.innerHTML = '<span style="color: var(--accent-red);">Failed to submit review.</span>';
    } finally {
        submitReviewBtn.disabled = false;
        submitReviewBtn.textContent = originalText;
    }
}

// --- INITIALIZATION ---
loadProductStats();
setupEventListeners();

// **MODIFIED**: Reworked auth state change to handle local cart
onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        const localCartData = localStorage.getItem('localCart');
        const localCart = localCartData ? JSON.parse(localCartData) : {};

        if (user) {
            // User is signed in

            // Load Wishlist
            try {
                const userWishlistRef = doc(db, 'wishlists', user.uid);
                const wishlistSnap = await getDoc(userWishlistRef);
                if (wishlistSnap.exists() && wishlistSnap.data().items) {
                    wishlist = new Set(wishlistSnap.data().items);
                } else {
                    wishlist = new Set();
                }
            } catch (error) {
                console.error("Error loading wishlist:", error);
            }

            const userCartRef = doc(db, 'carts', user.uid);
            const docSnap = await getDoc(userCartRef);
            const firestoreCart = docSnap.exists() ? docSnap.data().items : {};

            // Merge local and firestore carts
            const mergedCart = { ...firestoreCart };
            let hasLocalItems = false;
            for (const [productId, quantity] of Object.entries(localCart)) {
                mergedCart[productId] = (mergedCart[productId] || 0) + quantity;
                hasLocalItems = true;
            }
            
            cart = mergedCart;
            // Only trigger backend write if we actually merged local items into it
            if (hasLocalItems) {
                await saveCart();
                localStorage.removeItem('localCart'); // Clear local cart after merging
            }
        } else {
            // User is signed out, load from localStorage
            cart = localCart;
        }

        updateUserNav(user);
        renderCart(); // Render the final cart state
    });