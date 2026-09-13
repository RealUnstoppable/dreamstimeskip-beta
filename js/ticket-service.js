import { db, auth } from './auth.js';
import { mapCollectionData } from './utils.js';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const TICKETS_COLLECTION = 'support_tickets';

function sortTicketsByDateDesc(tickets) {
    return tickets.sort((a, b) => {
         const timeA = a.createdAt?.toMillis() || 0;
         const timeB = b.createdAt?.toMillis() || 0;
         return timeB - timeA;
    });
}

/**
 * Creates a new support ticket
 * @param {string} userId - ID of the user creating the ticket
 * @param {string} userEmail - Email of the user creating the ticket
 * @param {string} subject - Subject of the ticket
 * @param {string} message - Content of the ticket
 */
export async function createTicket(userId, userEmail, subject, message) {
    if (!userId || !userEmail || !subject || !message) {
        throw new Error('All fields are required to create a ticket.');
    }

    try {
        const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
            userId,
            userEmail,
            subject,
            message,
            status: 'open',
            createdAt: serverTimestamp(),
            adminReply: null
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating ticket - Manager info: [' + error.message + ']');
        throw error;
    }
}


/**
 * Retrieves all tickets for a specific user
 * @param {string} userId - ID of the user
 */
export async function getUserTickets(userId) {
    if (!userId) throw new Error('User ID is required');

    try {
        const q = query(
            collection(db, TICKETS_COLLECTION),
            where("userId", "==", userId)
            // Note: orderBy requires a composite index if used with where.
            // If the index doesn't exist, this might fail, so we fetch and sort client-side.
        );
        const snap = await getDocs(q);
        const tickets = mapCollectionData(snap, true);

        return sortTicketsByDateDesc(tickets);
    } catch (error) {
        console.error('Error fetching user tickets - Manager info: [' + error.message + ']');
        throw error;
    }
}

/**
 * Retrieves all tickets in the system (Admin only)
 */
export async function getAllTickets() {
    try {
        const snap = await getDocs(collection(db, TICKETS_COLLECTION));
        const tickets = mapCollectionData(snap, true);

        return sortTicketsByDateDesc(tickets);
    } catch (error) {
        console.error('Error fetching all tickets - Manager info: [' + error.message + ']');
        throw error;
    }
}

/**
 * Submits an admin reply to a ticket and updates its status
 * @param {string} ticketId - ID of the ticket to reply to
 * @param {string} adminReply - Content of the admin reply
 * @param {string} status - New status of the ticket (e.g., 'answered', 'closed')
 */
export async function replyToTicket(ticketId, adminReply, status = 'answered') {
    if (!ticketId || !adminReply) {
        throw new Error('Ticket ID and reply content are required.');
    }

    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");
        const idToken = await user.getIdToken();
        const response = await fetch('https://us-central1-dts-hub-website.cloudfunctions.net/adminAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                action: 'update',
                collection: TICKETS_COLLECTION,
                docId: ticketId,
                data: {
                    adminReply,
                    status,
                    updatedAt: 'SERVER_TIMESTAMP'
                }
            })
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Admin action failed");
        }
        return { success: true };
    } catch (error) {
        console.error('Error replying to ticket - Manager info: [' + error.message + ']');
        throw error;
    }
}
