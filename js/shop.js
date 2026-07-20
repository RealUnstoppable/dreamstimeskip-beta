// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML } from './utils.js';
import { products, productMap } from './products-data.js';

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
        const ratingInfo = cachedRatings[product.id] || { avg: 0, count: 0 };
        const ratingDisplay = ratingInfo.count > 0 ? `${ratingInfo.avg.toFixed(1)} ★ (${ratingInfo.count})` : 'No reviews';

        const stats = productStatsMap.get(product.id) || { averageRating: 0, reviewCount: 0 };
        const displayRating = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'No reviews';
        const starsHtml = stats.averageRating > 0 ? generateStarsHtml(stats.averageRating) : '';

        // Fetch rating
        let ratingHtml = '';
        try {
            const { average, count } = await getProductAverageRating(product.id);
            if (count > 0) {
                ratingHtml = `
                    <div class="product-rating-summary" data-id="${product.id}" aria-label="View Reviews">
                        <span class="star-rating">★</span>
                        <span>${average} (${count} reviews)</span>
                    </div>
                `;
            } else {
                 ratingHtml = `
                    <div class="product-rating-summary" data-id="${product.id}" aria-label="Write a Review">
                        <span style="color: var(--text-secondary); font-size: 0.8rem;">No reviews yet</span>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Failed to load rating for", product.id, e);
        }

        return `
            <div class="product-card">
                <button class="wishlist-btn ${activeClass}" data-id="${product.id}" aria-label="Toggle Wishlist">
                    ${heartIcon}
                </button>
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image" data-id="${product.id}" loading="lazy" style="cursor: pointer;">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating-summary">${ratingDisplay}</div>
                    <p>${product.description}</p>
                    <div class="product-stars-container">
                        ${stats.averageRating > 0 ? `<span class="star-rating">${starsHtml}</span>` : ''}
                        <span class="rating-count">(${displayRating}${stats.reviewCount > 0 ? ` - ${stats.reviewCount} reviews` : ''})</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <div style="display: flex; gap: 10px;">
                            <button class="view-reviews-btn" style="background-color: #4b5563; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background-color 0.2s;" data-id="${product.id}">Reviews</button>
                            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                    <button class="reviews-btn" data-id="${product.id}">Read Reviews</button>
                </div>
            </div>
        `;
    }).join('');

    // Fetch and update ratings asynchronously without blocking UI render
    updateAllProductRatings();
}

async function updateAllProductRatings() {
    for (const product of products) {
        updateProductRatingDisplay(product.id);
    }
}

async function updateProductRatingDisplay(productId) {
    const ratingEl = document.getElementById(`rating-${productId}`);
    if (ratingEl) {
        const ratingInfo = await getAverageRating(productId);
        ratingEl.innerHTML = `<span class="star-display">★</span> ${ratingInfo.average} (${ratingInfo.count} reviews)`;
    }
}

async function loadProductStats() {
    try {
        const statsSnapshot = await getDocs(collection(db, 'product_stats'));
        statsSnapshot.forEach(doc => {
            productStatsMap.set(doc.id, doc.data());
        });
        renderProducts();
    } catch (error) {
        console.error("Error loading product stats - Manager info:", error);
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
                            <input type="number" value="${quantity}" min="1" data-id="${productId}" class="item-quantity-input" aria-label="Quantity for ${product.name}">
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

// --- WISHLIST LOGIC ---
export async function toggleWishlist(productId) {
    if (!currentUser) {
        alert("Please sign in to use the wishlist.");
        return;
    }

    if (wishlist.has(productId)) {
        wishlist.delete(productId);
    } else {
        wishlist.add(productId);
    }

    renderProducts(); // Re-render to update the heart icon

    try {
        await saveWishlist();
    } catch (error) {
        console.error('Failed to update wishlist - Manager info:', error.message);
    }
}

// --- CART LOGIC ---
export function toggleWishlist(productId) {
    if (wishlist.has(productId)) {
        wishlist.delete(productId);
    } else {
        wishlist.add(productId);
    }

    // Update UI
    const wishlistBtns = document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`);
    wishlistBtns.forEach(btn => {
        if (wishlist.has(productId)) {
            btn.classList.add('active');
            btn.textContent = '❤️';
        } else {
            btn.classList.remove('active');
            btn.textContent = '🤍';
        }
    });

    saveWishlist();
}

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

export async function toggleWishlist(productId) {
    if (!currentUser) {
        window.location.href = 'sign in beta.html';
        return;
    }

    if (wishlist.has(productId)) {
        wishlist.delete(productId);
    } else {
        wishlist.add(productId);
    }

    renderProducts();

    // Dispatch a custom event so account.html can listen to updates if needed
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist } }));

    try {
        await saveWishlist();
    } catch (error) {
        console.error('Failed to update wishlist - Manager info:', error.message);
    }
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
                console.error("Error saving wishlist to Firestore - Manager info:", error.message);
                reject(error);
            }
        }, 500);
    });
}

async function saveCart() {
    updateCartSummary(); // Update UI immediately for responsiveness

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
                    console.error("Error saving cart to Firestore - Manager info:", error.message);
                }
            } else {
                // Save cart to localStorage for logged-out users
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

// --- REVIEW LOGIC ---
async function fetchProductReviews(productId) {
    if (!reviewsListContainer) return;
    try {
        const reviewsRef = collection(db, 'product_reviews');
        const q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        let sum = 0;
        let count = 0;
        let html = '';

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            sum += data.rating;
            count++;

            const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Just now';
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${escapeHTML(data.username)}</span>
                        <span class="review-date">${dateStr}</span>
                    </div>
                    <div class="review-rating star-rating">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</div>
                    <div class="review-comment">${escapeHTML(data.comment)}</div>
                </div>
            `;
        });

        if (count === 0) {
            html = '<p class="empty-reviews-message">No reviews yet. Be the first to review!</p>';
        }

        reviewsListContainer.innerHTML = html;

        const avg = count > 0 ? sum / count : 0;
        if (avgRatingValue) avgRatingValue.textContent = avg.toFixed(1);
        if (totalReviewsCount) totalReviewsCount.textContent = `${count} review${count !== 1 ? 's' : ''}`;

        cachedRatings[productId] = { avg, count };
        renderProducts();

    } catch (error) {
        console.error("Manager info: [Error fetching reviews:]", error);
        reviewsListContainer.innerHTML = '<p class="error-message">Failed to load reviews.</p>';
    }
}

async function handleViewReviews(productId) {
    currentReviewProductId = productId;
    if (reviewModal) reviewModal.style.display = 'flex';
    if (reviewsListContainer) reviewsListContainer.innerHTML = '<p>Loading reviews...</p>';

    if (currentUser) {
        if (writeReviewSection) writeReviewSection.style.display = 'block';
        if (loginToReviewMsg) loginToReviewMsg.style.display = 'none';
    } else {
        if (writeReviewSection) writeReviewSection.style.display = 'none';
        if (loginToReviewMsg) loginToReviewMsg.style.display = 'block';
    }

    await fetchProductReviews(productId);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Product grid listeners
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-to-cart-btn');
            const wishlistBtn = e.target.closest('.wishlist-btn');
            const productClickable = e.target.closest('.product-image') || e.target.closest('.product-title') || e.target.closest('.product-rating-summary');

            if (addBtn) {
                const productId = addBtn.dataset.id;
                handleAddToCart(productId);
            } else if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
                const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
                const productId = btn.dataset.id;
                toggleWishlist(productId);
            } else if (e.target.classList.contains('view-reviews-btn') || e.target.classList.contains('reviews-btn')) {
                const productId = e.target.dataset.id;
                if (e.target.classList.contains('view-reviews-btn')) {
                    handleViewReviews(productId);
                } else {
                    openReviewsModal(productId);
                }
            }
        });
    }

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

    if (closeReviewBtn && reviewModal) {
        closeReviewBtn.addEventListener('click', () => reviewModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.style.display = 'none';
            }
        });
    }

    if (writeReviewForm) {
        writeReviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser || !currentReviewProductId) return;

            const rating = parseInt(document.getElementById('review-rating').value, 10);
            const comment = document.getElementById('review-comment').value;
            const messageEl = document.getElementById('review-message');
            const submitBtn = document.getElementById('submit-review-btn');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                // Fetch username
                const cacheKey = `profile_${currentUser.uid}`;
                const cachedProfile = sessionStorage.getItem(cacheKey);
                let username = "User";
                if (cachedProfile) {
                    username = JSON.parse(cachedProfile).username;
                } else {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) username = userDoc.data().username || "User";
                }

                const reviewId = `${currentReviewProductId}_${currentUser.uid}`;
                const reviewRef = doc(db, 'product_reviews', reviewId);

                await setDoc(reviewRef, {
                    productId: currentReviewProductId,
                    userId: currentUser.uid,
                    username: username,
                    rating: rating,
                    comment: comment,
                    createdAt: serverTimestamp()
                });

                writeReviewForm.reset();
                messageEl.textContent = 'Review submitted successfully!';
                messageEl.style.color = 'var(--accent-green)';

                // Refresh reviews
                await fetchProductReviews(currentReviewProductId);

            } catch (error) {
                console.error("Manager info: [Error submitting review:]", error);
                messageEl.textContent = 'Failed to submit review.';
                messageEl.style.color = 'var(--accent-red)';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            }
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

// --- REVIEW LOGIC ---
async function openReviewsModal(productId) {
    if (!reviewsModal) return;

    currentReviewProductId = productId;
    const product = productMap.get(productId);
    document.getElementById('reviews-modal-title').textContent = `Reviews for ${product.name}`;

    reviewsModal.style.display = 'block';
    reviewsList.innerHTML = '<div style="text-align: center; padding: 20px;">Loading reviews...</div>';

    if (currentUser) {
        reviewFormContainer.style.display = 'block';
        reviewLoginPrompt.style.display = 'none';
    } else {
        reviewFormContainer.style.display = 'none';
        reviewLoginPrompt.style.display = 'block';
    }

    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="empty-cart-message">No reviews yet. Be the first to review!</p>';
    } else {
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <strong>${escapeHTML(review.userEmail.split('@')[0])}</strong>
                    <span class="review-date">${review.createdAtDate}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p class="review-text">${escapeHTML(review.reviewText)}</p>
            </div>
        `).join('');
    }
}

// Make accessible to testing via window
window.openReviewsModal = openReviewsModal;


async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!currentUser || !currentReviewProductId) return;

    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('review-text').value;

    if (!ratingInput || !reviewText.trim()) {
        reviewStatusMessage.textContent = 'Please provide both a rating and a review.';
        reviewStatusMessage.style.color = 'red';
        return;
    }

    const rating = parseInt(ratingInput.value, 10);
    submitReviewBtn.disabled = true;
    submitReviewBtn.textContent = 'Submitting...';
    reviewStatusMessage.textContent = '';

    try {
        const result = await submitReview(currentReviewProductId, currentUser.uid, currentUser.email, rating, reviewText.trim());

        if (result.success) {
            reviewStatusMessage.textContent = 'Review submitted successfully!';
            reviewStatusMessage.style.color = 'green';
            reviewForm.reset();
            // Refresh reviews list
            await openReviewsModal(currentReviewProductId);
            // Refresh specific product rating without full re-render
            updateProductRatingDisplay(currentReviewProductId);
        } else {
            reviewStatusMessage.textContent = result.error || 'Failed to submit review.';
            reviewStatusMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Manager info: [Submit review error:]', error);
        reviewStatusMessage.textContent = 'An error occurred. Please try again.';
        reviewStatusMessage.style.color = 'red';
    } finally {
        submitReviewBtn.disabled = false;
        submitReviewBtn.textContent = 'Submit Review';
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
                console.error("Error loading wishlist - Manager info:", error.message);
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
    });// --- REVIEWS LOGIC ---
const reviewsModal = document.getElementById('reviews-modal');
const closeReviewsBtn = document.getElementById('close-reviews-btn');
const reviewsListContainer = document.getElementById('reviews-list-container');
const reviewSubmitForm = document.getElementById('review-submit-form');
const reviewProductIdInput = document.getElementById('review-product-id');
const reviewAuthMessage = document.getElementById('review-auth-message');

async function openReviewsModal(productId) {
    if (!reviewsModal) return;
    reviewProductIdInput.value = productId;
    reviewsListContainer.innerHTML = '<p>Loading reviews...</p>';
    reviewsModal.style.display = 'block';

    if (!currentUser) {
        reviewSubmitForm.querySelector('button[type="submit"]').style.display = 'none';
        reviewAuthMessage.style.display = 'block';
    } else {
        reviewSubmitForm.querySelector('button[type="submit"]').style.display = 'block';
        reviewAuthMessage.style.display = 'none';
    }

    try {
        const q = query(collection(db, 'product_reviews'), where('productId', '==', productId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            reviewsListContainer.innerHTML = '<p>No reviews yet. Be the first!</p>';
            return;
        }

        reviewsListContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Just now';
            reviewsListContainer.innerHTML += `
                <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong>${escapeHTML(data.authorName || 'Anonymous')}</strong>
                        <span style="color: #fbbf24;">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.9em; color: var(--text-secondary);">${escapeHTML(data.text)}</p>
                    <small style="color: #666;">${date}</small>
                </div>
            `;
        });
    } catch (error) {
        console.error("Manager info: Error loading reviews", error);
        reviewsListContainer.innerHTML = '<p>Error loading reviews.</p>';
    }
}

if (reviewSubmitForm) {
    reviewSubmitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const productId = reviewProductIdInput.value;
        const rating = parseInt(document.getElementById('review-rating').value, 10);
        const text = document.getElementById('review-text').value;
        const submitBtn = reviewSubmitForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            await addDoc(collection(db, 'product_reviews'), {
                productId,
                userId: currentUser.uid,
                authorName: (currentUser.email ? currentUser.email.split("@")[0] : "Anonymous"), // Safe fallback
                rating,
                text,
                createdAt: new Date().toISOString()
            });
            reviewSubmitForm.reset();
            await openReviewsModal(productId); // Reload reviews
            await renderProducts(); // Refresh stats on grid
        } catch (error) {
            console.error("Manager info: Error submitting review", error);
            alert('Error submitting review.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}

if (closeReviewsBtn) {
    closeReviewsBtn.addEventListener('click', () => reviewsModal.style.display = 'none');
}
window.addEventListener('click', (e) => {
    if (e.target === reviewsModal) reviewsModal.style.display = 'none';
});

// Add event delegation for the new "Reviews" button
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-reviews-btn')) {
                const productId = e.target.dataset.id;
                openReviewsModal(productId);
            }
        });
    }
});
