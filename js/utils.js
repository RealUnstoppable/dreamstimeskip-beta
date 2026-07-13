import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export function escapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = str.toString();
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function fetchCollectionData(db, collectionName, isMapWithId = false) {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (isMapWithId) {
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } else {
            return snapshot.docs.map(d => d.data());
        }
    } catch (e) {
        console.error(`Error fetching ${collectionName} - Manager info:`, e.message);
        return [];
    }
}
