import { db } from './auth.js';
import { collection, doc, onSnapshot, updateDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { mapCollectionData } from './utils.js';

const NOTIFICATIONS_COLLECTION = 'notifications';

export function subscribeToNotifications(userId, callback) {
    if (!userId) throw new Error('User ID is required');

    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(10)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = mapCollectionData(snapshot, true);
        callback(notifications);
    }, (error) => {
        console.error('Error fetching notifications - Manager info: [' + error.message + ']');
        callback([]);
    });
}

export async function markAsRead(notificationId) {
    if (!notificationId) return;

    try {
        const ref = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
        await updateDoc(ref, { isRead: true });
        return { success: true };
    } catch (error) {
        console.error('Error marking notification as read - Manager info: [' + error.message + ']');
        throw error;
    }
}
