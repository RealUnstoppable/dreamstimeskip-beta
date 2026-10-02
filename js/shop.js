// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML, fetchCollectionData, getCachedUserProfile } from './utils.js';
import { generateProductCardHtml } from './ui-utils.js';
import { products, productMap } from './products-data.js';
import { getAverageRating } from './review-service.js';

// --- STATE MANAGEMENT ---
export let cart = {}; // { productId: quantity, ... }
export let wishlist = new Set(); // { productId, ... }
let currentUser = null;
let currentReviewProductId = null;
let productStatsMap = new Map();
const reviewsCache = new Map();

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
const productSearchInput = document.getElementById('product-search');

let currentRating = 0;

// Q&A Elements
const tabReviews = document.getElementById('tab-reviews');
const tabQa = document.getElementById('tab-qa');
const reviewsTabContent = document.getElementById('reviews-tab-content');
const qaTabContent = document.getElementById('qa-tab-content');
const askQuestionSection = document.getElementById('ask-question-section');
const qaLoginPrompt = document.getElementById('qa-login-prompt');
const askQuestionForm = document.getElementById('ask-question-form');
const qaListContainer = document.getElementById('qa-list-container');
const questionText = document.getElementById('question-text');
const questionNotification = document.getElementById('question-notification');


// --- RENDER FUNCTIONS ---
function generateStarsHtml(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

function renderProducts(searchQuery = '') {
    if (!productGrid) return;
    const query = searchQuery.toLowerCase();

    productGrid.innerHTML = products.filter(product => {
        if (!query) return true;
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        return nameMatch || descMatch;
    }).map(product => {
        const isWishlisted = wishlist.has(product.id);
        const stats = productStatsMap.get(product.id) || { averageRating: 0, reviewCount: 0 };
        return generateProductCardHtml(product, 'shop', 1, isWishlisted, stats, generateStarsHtml);
    }).join('');

    // ⚡ Bolt: No longer fetching all reviews. renderProducts already uses productStatsMap.
}

async function updateAllProductRatings() {
    // ⚡ Bolt: Removed massive clientside aggregation that loaded the entire reviews collection.
    // Relies on pre-computed product_stats loaded via loadProductStats() on init instead.
}

async function updateProductRatingDisplay(productId, precalculatedRatingInfo = null) {
    const ratingEl = document.getElementById(`rating-${productId}`);
    if (ratingEl) {
        let ratingInfo = precalculatedRatingInfo;
        if (!ratingInfo) {
            ratingInfo = await getAverageRating(productId);
        }
        ratingEl.innerHTML = `<span class="star-display">★</span> ${ratingInfo.average} (${ratingInfo.count} reviews)`;
    }
}

export async function loadProductStats() {
    try {
        const stats = await fetchCollectionData(db, getDocs, collection, 'product_stats', true);
        stats.forEach(s => productStatsMap.set(s.id, s));
    } catch (error) {
        console.error("Manager info: Error loading product stats ", error);
    } finally {
        renderProducts();
    }
}

function renderCart() {
    if (!cartItemsContainer || !checkoutBtn) return;
    if (Object.keys(cart).length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        if (checkoutBtn) { checkoutBtn.disabled = true; checkoutBtn.title = 'Your cart is empty'; }
    } else {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = Object.entries(cart).map(([productId, quantity]) => {
                // ⚡ Bolt: O(1) lookup replaces O(N) products.find()
                const product = productMap.get(productId);
                if (!product) return ''; // Should not happen
                return generateProductCardHtml(product, 'cart', quantity);
            }).join('');
        }
        if (checkoutBtn) { checkoutBtn.disabled = false; checkoutBtn.removeAttribute('title'); }
    }
    updateCartSummary();
}

function updateCartSummary() {
    const { itemCount, totalPrice } = calculateCartSummary(cart, products);

    if (cartItemCountEl) cartItemCountEl.textContent = itemCount;
    if (cartTotalPriceEl) cartTotalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
    
    // Sync to localStorage
    try {
        localStorage.setItem('cartItemCount', itemCount.toString());
        localStorage.setItem('localCart', JSON.stringify(cart));
    } catch (_) { /* ignore local storage error */ }

    // Update Lexi cart badge if window.updateLexiCartCount exists
    if (window.updateLexiCartCount) {
        window.updateLexiCartCount(itemCount);
    }

    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart, itemCount, totalPrice } }));
}

// --- CART LOGIC ---
export async function handleAddToCart(productId, event) {
    if (event) {
        const btn = event.currentTarget || event.target;
        const card = btn.closest('.product-card');
        if (card) {
            const img = card.querySelector('.product-image');
            if (img) {
                const flyImg = document.createElement('img');
                flyImg.src = img.src;
                flyImg.className = 'flying-item';
                
                const imgRect = img.getBoundingClientRect();
                flyImg.style.top = imgRect.top + 'px';
                flyImg.style.left = imgRect.left + 'px';
                flyImg.style.width = imgRect.width + 'px';
                flyImg.style.height = imgRect.height + 'px';
                
                document.body.appendChild(flyImg);
                
                // Trigger reflow
                flyImg.getBoundingClientRect();
                
                const targetOrb = document.getElementById('siri-orb') || document.getElementById('cart-button');
                if (targetOrb) {
                    const cartRect = targetOrb.getBoundingClientRect();
                    flyImg.style.top = (cartRect.top + 10) + 'px';
                    flyImg.style.left = (cartRect.left + 10) + 'px';
                    flyImg.style.width = '40px';
                    flyImg.style.height = '40px';
                    flyImg.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (flyImg.parentNode) {
                            flyImg.parentNode.removeChild(flyImg);
                        }
                        targetOrb.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        targetOrb.style.transform = 'scale(1.25)';
                        setTimeout(() => {
                            targetOrb.style.transform = '';
                        }, 200);
                    }, 800);
                }
            }
        }
    }

    cart[productId] = (cart[productId] || 0) + 1;
    try {
        await saveCart();
        renderCart();
    } catch (error) {
        console.error('Manager info: Failed to add to cart:', error.message);
    }
}

export async function handleUpdateQuantity(productId, quantity) {
    if (!productMap.has(productId)) {
        console.error(`Manager info: Product not found: ${productId}`);
        return;
    }

    try {
        if (quantity <= 0) {
            await handleRemoveFromCart(productId);
        } else {
            cart[productId] = parseInt(quantity, 10);
            await saveCart();
            renderCart();
        }
    } catch (error) {
        console.error('Manager info: Failed to update quantity ', error);
    }
}

async function handleRemoveFromCart(productId) {
    delete cart[productId];
    await saveCart();
    renderCart();
}

export async function toggleWishlist(productId) {
    if (!currentUser && !auth.currentUser) {
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
        console.error('Manager info: Failed to update wishlist:', error.message);
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
                const userWishlistRef = doc(db, 'wishlists', activeUser.uid);
                await setDoc(userWishlistRef, { items: Array.from(wishlist) });
                resolve();
            } catch (error) {
                console.error("Manager info: Error saving wishlist to Firestore:", error.message);
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
            if (currentUser || auth.currentUser) {
                try {
                    const userCartRef = doc(db, 'carts', activeUser.uid);
                    await setDoc(userCartRef, { items: cart });
                } catch (error) {
                    console.error("Manager info: Error saving cart to Firestore:", error.message);
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
        let reviews = [];
        if (reviewsCache.has(productId + '_product_reviews')) {
            reviews = reviewsCache.get(productId + '_product_reviews');
        } else {
            const reviewsRef = collection(db, 'product_reviews');
            const q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(docSnap => {
                reviews.push(docSnap.data());
            });
            reviewsCache.set(productId + '_product_reviews', reviews);
        }

        let sum = 0;
        let count = 0;
        let html = '';

        reviews.forEach((data) => {
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

        renderProducts();

    } catch (error) {
        console.error("Manager info: Error fetching reviews:", error);
        reviewsListContainer.innerHTML = '<p class="error-message">Failed to load reviews.</p>';
    }
}

async function handleViewReviews(productId) {
    currentReviewProductId = productId;
    const reviewModal = document.getElementById('reviewModal');
    if (reviewModal) reviewModal.style.display = 'flex';
    if (reviewsListContainer) reviewsListContainer.innerHTML = '<p>Loading reviews...</p>';

    if (currentUser || auth.currentUser) {
        const writeReviewSection = document.getElementById('writeReviewSection');
        if (writeReviewSection) writeReviewSection.style.display = 'block';
        const loginToReviewMsg = document.getElementById('loginToReviewMsg');
        if (loginToReviewMsg) loginToReviewMsg.style.display = 'none';
    } else {
        const writeReviewSection = document.getElementById('writeReviewSection');
        if (writeReviewSection) writeReviewSection.style.display = 'none';
        const loginToReviewMsg = document.getElementById('loginToReviewMsg');
        if (loginToReviewMsg) loginToReviewMsg.style.display = 'block';
    }

    await fetchProductReviews(productId);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {

    // ⚡ Bolt: Debounce search input to prevent unnecessary re-renders during typing
    if (productSearchInput) {
        let searchTimeout;
        productSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderProducts(e.target.value);
            }, 300);
        });
    }

    // Product grid listeners
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-to-cart-btn');
            const productClickable = e.target.closest('.product-image') || e.target.closest('.product-title') || e.target.closest('.product-rating-summary');

            if (addBtn) {
                const productId = addBtn.dataset.id;
                handleAddToCart(productId, e);
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

    // Product search input
    const productSearchInput = document.getElementById('product-search');
    if (productSearchInput) {
        let productSearchTimeout;
        productSearchInput.addEventListener('input', (e) => {
            clearTimeout(productSearchTimeout);
            productSearchTimeout = setTimeout(() => {
                renderProducts(e.target.value);
            }, 300); // ⚡ Bolt: Debounce product search to reduce unnecessary DOM re-renders
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
        if (reviewText) {
            reviewText.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const counterEl = document.getElementById('reviewCharCount');
                if (counterEl) {
                    counterEl.textContent = `${count} / 300`;
                    counterEl.style.color = count >= 290 ? 'var(--accent-red)' : 'var(--text-secondary)';
                }
            });
            // Initialize counter
            const initialCount = reviewText.value.length;
            const counterEl = document.getElementById('reviewCharCount');
            if (counterEl) {
                counterEl.textContent = `${initialCount} / 300`;
                counterEl.style.color = initialCount >= 290 ? 'var(--accent-red)' : 'var(--text-secondary)';
            }
        }
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // Q&A Tabs
    if (tabReviews && tabQa) {
        tabReviews.addEventListener('click', () => {
            tabReviews.classList.add('active');
            tabQa.classList.remove('active');
            if(reviewsTabContent) reviewsTabContent.style.display = 'block';
            if(qaTabContent) qaTabContent.style.display = 'none';
        });

        tabQa.addEventListener('click', async () => {
            tabQa.classList.add('active');
            tabReviews.classList.remove('active');
            if(reviewsTabContent) reviewsTabContent.style.display = 'none';
            if(qaTabContent) qaTabContent.style.display = 'block';
            await loadProductQuestions(currentReviewProductId);
        });
    }

    if (askQuestionForm) {
        askQuestionForm.addEventListener('submit', handleAskQuestion);
    }

    if (qaListContainer) {
        qaListContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('reply-qa-btn')) {
                const questionId = e.target.dataset.id;
                const form = document.getElementById(`answer-form-${questionId}`);
                if (form) {
                    form.style.display = form.style.display === 'none' ? 'block' : 'none';
                }
            }
            if (e.target.classList.contains('submit-answer-btn')) {
                const questionId = e.target.dataset.id;
                await handleAnswerSubmit(questionId);
            }
        });
    }


    // Cart modal listeners
    if (cartModal) {
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });
        }
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

    const closeReviewBtn = document.getElementById('closeReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    if (closeReviewBtn && reviewModal) {
        closeReviewBtn.addEventListener('click', () => reviewModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.style.display = 'none';
            }
        });


    }





    // Trap focus for cart and review modals
    document.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        // Handle Escape globally for modals
        if (e.key === 'Escape') {
            if (cartModal && cartModal.style.display !== 'none') {
                cartModal.style.display = 'none';
            }
            if (reviewModal && reviewModal.style.display !== 'none') {
                reviewModal.style.display = 'none';
            }
            return;
        }

        if (!isTabPressed) return;

        let activeModal = null;
        if (cartModal && cartModal.style.display !== 'none') {
            activeModal = cartModal;
        } else if (reviewModal && reviewModal.style.display !== 'none') {
            activeModal = reviewModal;
        }

        if (activeModal) {
            // Query dynamically to handle state changes
            const focusableElements = activeModal.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="number"], select, [tabindex]:not([tabindex="-1"])');
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
        }
    });

    const writeReviewForm = document.getElementById('writeReviewForm');
    if (writeReviewForm) {
        writeReviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const activeUser = currentUser || auth.currentUser;
    if (!activeUser || !currentReviewProductId) return;

            const rating = parseInt(document.getElementById('review-rating').value, 10);
            const comment = document.getElementById('review-comment').value;
            const messageEl = document.getElementById('review-message');
            const submitBtn = document.getElementById('submit-review-btn');

            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                // Fetch username
                const userData = await getCachedUserProfile({uid: activeUser.uid});
                let username = userData ? (userData.username || "User") : "User";

                const reviewId = `${currentReviewProductId}_${activeUser.uid}`;
                const reviewRef = doc(db, 'product_reviews', reviewId);

                await setDoc(reviewRef, {
                    productId: currentReviewProductId,
                    userId: activeUser.uid,
                    username: username,
                    rating: rating,
                    comment: comment,
                    createdAt: serverTimestamp()
                });

                writeReviewForm.reset();
                messageEl.textContent = 'Review submitted successfully!';
                messageEl.style.color = 'var(--accent-green)';

                // ⚡ Bolt: Invalidate cache for this product
                reviewsCache.delete(currentReviewProductId + '_product_reviews');

                // Refresh reviews
                await fetchProductReviews(currentReviewProductId);

            } catch (error) {
                console.error("Manager info: Error submitting review:", error);
                messageEl.textContent = 'Failed to submit review.';
                messageEl.style.color = 'var(--accent-red)';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}


// --- REVIEW FUNCTIONS ---
async function openReviewsModal(productId) {
    currentReviewProductId = productId;
    const product = productMap.get(productId);

    document.getElementById('reviews-modal-title').textContent = `Reviews for ${product.name}`;
    reviewsListContainer.innerHTML = '<p class="review-message loading">Loading reviews...</p>';

    // Reset Form
    currentRating = 0;
    starInputs.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
    });
    reviewText.value = '';
    reviewNotification.innerHTML = '';

    // Toggle Auth Sections
    if (currentUser || auth.currentUser) {
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


    // Reset tabs
    if (tabReviews && tabQa) {
        tabReviews.classList.add('active');
        tabQa.classList.remove('active');
        if (reviewsTabContent) reviewsTabContent.style.display = 'block';
        if (qaTabContent) qaTabContent.style.display = 'none';
    }

    // Toggle Q&A auth
    if (currentUser || auth.currentUser) {
        if (askQuestionSection) askQuestionSection.style.display = 'block';
        if (qaLoginPrompt) qaLoginPrompt.style.display = 'none';
    } else {
        if (askQuestionSection) askQuestionSection.style.display = 'none';
        if (qaLoginPrompt) qaLoginPrompt.style.display = 'block';
    }

    reviewsModal.style.display = 'block';

    await loadReviews(productId);
}

async function loadReviews(productId) {
    try {
        let reviews = [];
        if (reviewsCache.has(productId)) {
            reviews = reviewsCache.get(productId);
        } else {
            const q = query(collection(db, "reviews"), where("productId", "==", productId), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            snapshot.forEach(doc => {
                reviews.push(doc.data());
            });
            reviewsCache.set(productId, reviews);
        }

        if (reviews.length === 0) {
            reviewsListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">No reviews yet. Be the first!</p>';
            return;
        }

        let html = '';
        reviews.forEach(review => {
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
        console.error("Manager info: Error loading reviews:", error.message);
        reviewsListContainer.innerHTML = '<p style="color: var(--accent-red); text-align: center;">Error loading reviews.</p>';
    }
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    const activeUser = currentUser || auth.currentUser;
    if (!activeUser || !currentReviewProductId) return;

    if (currentRating === 0) {
        reviewNotification.innerHTML = '<span class="review-message error">Please select a star rating.</span>';
        return;
    }

    const text = reviewText.value.trim();
    if (!text) return;

    const originalText = submitReviewBtn.textContent;
    submitReviewBtn.disabled = true;
    submitReviewBtn.textContent = 'Submitting...';

    try {
        let authorName = activeUser.displayName || 'Anonymous';
        const userData = await getCachedUserProfile({uid: activeUser.uid});
        if (userData && userData.username) authorName = userData.username;

        await addDoc(collection(db, "reviews"), {
            productId: currentReviewProductId,
            userId: activeUser.uid,
            authorName: authorName,
            rating: currentRating,
            text: text,
            createdAt: serverTimestamp()
        });

        // Award 25 loyalty points for reviewing a product (optimistic UI update only)
        // Actual points are awarded via the onReviewCreated Cloud Function
        try {
            const cacheKey = `profile_${activeUser.uid}`;
            const cachedStr = sessionStorage.getItem(cacheKey);
            if (cachedStr) {
                const uData = JSON.parse(cachedStr);
                uData.pointsBalance = (uData.pointsBalance || 0) + 25;
                uData.loyaltyPoints = (uData.loyaltyPoints || 0) + 25;
                sessionStorage.setItem(cacheKey, JSON.stringify(uData));
            }
        } catch (ptsErr) {
<<<<<<< HEAD
            console.warn("Manager info: Points award warning for review:", ptsErr);
=======
            console.warn("Points cache update warning for review:", ptsErr);
>>>>>>> origin/main
        }

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

        reviewNotification.innerHTML = '<span class="review-message success">Review submitted successfully!</span>';
        setTimeout(() => reviewNotification.innerHTML = '', 3000);

        // ⚡ Bolt: Invalidate cache for this product so the new review is fetched
        reviewsCache.delete(currentReviewProductId);

        renderProducts(); // Update stars on grid
        await openReviewsModal(currentReviewProductId); // Refresh modal

    } catch (error) {
        console.error("Manager info: Error submitting review:", error.message);
        reviewNotification.innerHTML = '<span style="color: var(--accent-red);">Failed to submit review.</span>';
    } finally {
        submitReviewBtn.disabled = false;
    }
}

// --- INITIALIZATION ---
// Render products immediately from local array
renderProducts();
setupEventListeners();
loadProductStats();

// Initial localCart load
try {
    const localCartData = localStorage.getItem('localCart');
    if (localCartData) {
        cart = JSON.parse(localCartData);
        renderCart();
    }
} catch (_) { /* ignore local storage error */ }

// Auth and Cart state synchronization
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    let localCart = {};
    try {
        const localCartData = localStorage.getItem('localCart');
        if (localCartData) localCart = JSON.parse(localCartData);
    } catch (_) { /* ignore local storage error */ }

    if (user) {
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
            console.error("Manager info: Error loading wishlist:", error);
        }

        try {
            const userCartRef = doc(db, 'carts', user.uid);
            const docSnap = await getDoc(userCartRef);
            const firestoreCart = docSnap.exists() ? docSnap.data().items : {};

            const mergedCart = { ...firestoreCart };
            let hasLocalItems = false;
            for (const [productId, quantity] of Object.entries(localCart)) {
                mergedCart[productId] = (mergedCart[productId] || 0) + quantity;
                hasLocalItems = true;
            }

            cart = mergedCart;
            if (hasLocalItems) {
                await saveCart();
                localStorage.removeItem('localCart');
            }
        } catch (error) {
            console.error("Manager info: Error loading cart from firestore:", error);
            cart = localCart;
        }
    } else {
        cart = localCart;
    }

    updateUserNav(user);
    renderCart();
    renderProducts();
});


async function loadProductQuestions(productId) {
    if (!qaListContainer) return;
    qaListContainer.innerHTML = '<p class="review-message loading">Loading questions...</p>';

    try {
        const q = query(collection(db, "product_questions"), where("productId", "==", productId), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            qaListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">No questions yet. Be the first to ask!</p>';
            return;
        }

        let html = '';
        const questionsData = [];

        snapshot.forEach(doc => {
            questionsData.push({ id: doc.id, ...doc.data() });
        });

        let isAdmin = false;
        const activeUser = currentUser || auth.currentUser;
        if (activeUser) {
            const userData = await getCachedUserProfile({uid: activeUser.uid});
            if (userData && userData.isAdmin) isAdmin = true;
        }

        for (const question of questionsData) {
            const date = question.createdAt ? question.createdAt.toDate().toLocaleDateString() : 'Just now';

            // Fetch answers
            const ansQ = query(collection(db, "product_questions", question.id, "answers"), orderBy("createdAt", "asc"));
            const ansSnapshot = await getDocs(ansQ);

            let answersHtml = '';
            ansSnapshot.forEach(ansDoc => {
                const ans = ansDoc.data();
                const ansDate = ans.createdAt ? ans.createdAt.toDate().toLocaleDateString() : 'Just now';
                const adminBadge = ans.isAdmin ? '<span class="admin-badge">Admin</span>' : '';

                // Manually implement a basic escape function specifically for rendering here to avoid referencing undefined utils
                const sanitize = (str) => {
                    if (!str) return '';
                    return String(str).replace(/[&<>"']/g, function(m) {
                        return {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#039;'
                        }[m];
                    });
                };

                answersHtml += `
                    <div class="qa-answer">
                        <div class="qa-header">
                            <span class="qa-author">${sanitize(ans.username)} ${adminBadge}</span>
                            <span class="qa-date">${ansDate}</span>
                        </div>
                        <p class="qa-text">${sanitize(ans.answer)}</p>
                    </div>
                `;
            });

            let replyFormHtml = '';
            if (isAdmin) {
                replyFormHtml = `
                    <button class="reply-qa-btn btn-checkout" style="width: auto; padding: 5px 10px; font-size: 0.8rem; margin-top: 10px;" data-id="${question.id}">Reply</button>
                    <div id="answer-form-${question.id}" class="qa-answer-form" style="display: none; margin-top: 10px;">
                        <textarea id="answer-text-${question.id}" placeholder="Type your answer..." required title="Answer text" aria-label="Answer text" style="width: 100%; min-height: 60px;"></textarea>
                        <button class="submit-answer-btn btn-checkout" style="width: auto; padding: 5px 10px; font-size: 0.8rem; margin-top: 5px;" data-id="${question.id}">Submit Answer</button>
                    </div>
                `;
            }

            const sanitize = (str) => {
                if (!str) return '';
                return String(str).replace(/[&<>"']/g, function(m) {
                    return {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#039;'
                    }[m];
                });
            };

            html += `
                <div class="qa-item review-item">
                    <div class="qa-question">
                        <div class="qa-header review-header">
                            <span class="qa-author review-author">Q: ${sanitize(question.username)}</span>
                            <span class="qa-date review-date">${date}</span>
                        </div>
                        <p class="qa-text review-content" style="font-weight: 500; color: var(--text-primary);">${sanitize(question.question)}</p>
                    </div>
                    <div class="qa-answers-list" style="margin-left: 20px; margin-top: 15px; border-left: 2px solid var(--border-color); padding-left: 15px;">
                        ${answersHtml}
                        ${replyFormHtml}
                    </div>
                </div>
            `;
        }

        qaListContainer.innerHTML = html;

    } catch (error) {
        console.error("Manager info: Error loading questions: [" + error.message + "]");
        // Gracefully handle missing index/permissions during local tests
        if (error.message.includes("requires an index") || error.message.includes("permissions")) {
            qaListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">No questions yet. Be the first to ask!</p>';
            return;
        }
        qaListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No questions yet. Be the first to ask!</p>';
    }
}

async function handleAskQuestion(e) {
    e.preventDefault();
    const activeUser = currentUser || auth.currentUser;
    if (!activeUser || !currentReviewProductId) return;

    const text = questionText.value.trim();
    if (!text) return;

    const btn = document.getElementById('submit-question-btn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    try {
        let authorName = activeUser.displayName || 'Anonymous';
        const userData = await getCachedUserProfile({uid: activeUser.uid});
        if (userData && userData.username) authorName = userData.username;

        await addDoc(collection(db, "product_questions"), {
            productId: currentReviewProductId,
            userId: activeUser.uid,
            username: authorName,
            question: text,
            createdAt: serverTimestamp()
        });

        questionText.value = '';
        questionNotification.innerHTML = '<span class="review-message success">Question submitted!</span>';
        setTimeout(() => questionNotification.innerHTML = '', 3000);

        await loadProductQuestions(currentReviewProductId);

    } catch (error) {
        console.error("Manager info: Error submitting question: [" + error.message + "]");
        questionNotification.innerHTML = '<span class="review-message error">Failed to submit question.</span>';
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

async function handleAnswerSubmit(questionId) {
    const activeUser = currentUser || auth.currentUser;
    if (!activeUser) return;

    const textInput = document.getElementById(`answer-text-${questionId}`);
    const text = textInput ? textInput.value.trim() : '';
    if (!text) return;

    // Find the specific button to disable it
    const submitBtn = document.querySelector(`.submit-answer-btn[data-id="${questionId}"]`);
    let originalText = 'Submit Answer';
    if(submitBtn) {
        originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }

    try {
        let authorName = activeUser.displayName || 'Anonymous';
        let isAdmin = false;
        const userData = await getCachedUserProfile({uid: activeUser.uid});
        if (userData) {
            if (userData.username) authorName = userData.username;
            if (userData.isAdmin) isAdmin = true;
        }

        await addDoc(collection(db, "product_questions", questionId, "answers"), {
            userId: activeUser.uid,
            username: authorName,
            answer: text,
            isAdmin: isAdmin,
            createdAt: serverTimestamp()
        });

        await loadProductQuestions(currentReviewProductId);

    } catch (error) {
        console.error("Manager info: Error submitting answer: [" + error.message + "]");
        alert("Failed to submit answer.");
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}
