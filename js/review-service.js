import { db, auth } from './auth.js';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const REVIEWS_COLLECTION = 'reviews';

/**
 * Adds a new review for a product.
 * @param {string} productId
 * @param {number} rating (1-5)
 * @param {string} comment
 * @returns {Promise<string>} The new review ID
 */
export async function addReview(productId, rating, comment) {
    if (!auth.currentUser) {
        throw new Error("You must be logged in to leave a review.");
    }

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    // Try to get username from profile, otherwise fallback to "Anonymous"
    let username = "Anonymous";
    try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().username) {
            username = userDoc.data().username;
        } else if (auth.currentUser.displayName) {
             username = auth.currentUser.displayName;
        }
    } catch (e) {
        console.warn("Could not fetch user profile for review name fallback", e);
    }

    try {
        const reviewRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            productId,
            userId: auth.currentUser.uid,
            username,
            rating: parseInt(rating, 10),
            comment,
            createdAt: serverTimestamp()
        });
        return reviewRef.id;
    } catch (error) {
        console.error("Error adding review - Manager info:", error.message);
        throw error;
    }
}

/**
 * Gets all reviews for a specific product, ordered by date.
 * @param {string} productId
 * @returns {Promise<Array>} Array of review objects
 */
export async function getReviews(productId) {
    try {
        const reviewsQuery = query(
            collection(db, REVIEWS_COLLECTION),
            where("productId", "==", productId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(reviewsQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // convert timestamp to date string if it exists (might be null immediately after local write)
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
    } catch (error) {
        console.error("Error fetching reviews - Manager info:", error.message);
        throw error;
    }
}

/**
 * Calculates the average rating for a product based on its reviews.
 * In a production environment with many reviews, this should be a cloud function that updates an aggregate document.
 * @param {string} productId
 * @returns {Promise<{average: number, count: number}>}
 */
export async function getProductAverageRating(productId) {
    try {
        const reviews = await getReviews(productId);
        if (reviews.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / reviews.length;

        return {
            average: parseFloat(average.toFixed(1)), // round to 1 decimal place
            count: reviews.length
        };
    } catch (error) {
        console.error("Error calculating average rating - Manager info:", error.message);
        throw error;
    }
}