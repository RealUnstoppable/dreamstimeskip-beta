import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
export async function fetchCollectionData(db, getDocs, collection, collectionName, isMapWithId = true) {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map(d => isMapWithId ? { id: d.id, ...d.data() } : d.data());
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error.message);
        return [];
    }
}

export function escapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function mapCollectionData(querySnapshot, isMapWithId = true) {
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return isMapWithId ? { id: doc.id, ...data } : data;
    });
}

export function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export async function getCachedUserProfile(user) {
    if (!user) return null;
    const cacheKey = `profile_${user.uid}`;
    const cachedProfile = sessionStorage.getItem(cacheKey);

    if (cachedProfile) {
        return JSON.parse(cachedProfile);
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            sessionStorage.setItem(cacheKey, JSON.stringify(userData));
            return userData;
        }
    } catch (error) {
        console.error("Manager info: Error fetching user profile:", error);
    }
    return null;
}
