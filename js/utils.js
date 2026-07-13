export function mapCollectionData(querySnapshot, mapWithId = false) {
    if (!querySnapshot || !querySnapshot.docs) return [];
    return querySnapshot.docs.map(d => mapWithId ? { id: d.id, ...d.data() } : d.data());
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
