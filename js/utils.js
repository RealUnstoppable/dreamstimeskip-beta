export async function fetchCollectionData(db, getDocs, collection, collectionName, isMapWithId = true) {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map(d => isMapWithId ? { id: d.id, ...d.data() } : d.data());
    } catch (error) {
        console.error(`Error fetching ${collectionName} - Manager info:`, error.message);
        return [];
    }
}

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

export function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
