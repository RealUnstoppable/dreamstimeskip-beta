/**
 * Minecraft Link & Uniqueness Verification Service
 * Ensures each Minecraft username (Java/Bedrock IGN) is uniquely linked to one account sitewide.
 */
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./firebase.js";

export const MC_LINKS_COLLECTION = "minecraft_links";

export const MC_ALREADY_LINKED_MESSAGE =
    "This Minecraft username is already linked to a different account. If you think this is a mistake, contact us.";

export const MC_ALREADY_LINKED_HTML =
    'This Minecraft username is already linked to a different account. If you think this is a mistake, <a href="/support.html" style="text-decoration: underline; color: inherit; font-weight: bold;">contact us</a>.';

/**
 * Normalizes a Minecraft username (case-insensitive key)
 * @param {string} ign
 * @returns {string}
 */
export function normalizeMinecraftUsername(ign) {
    return (ign || '').trim().toLowerCase();
}

/**
 * Checks whether a Minecraft username is available to be linked by a given user UID.
 * Checks both Firestore minecraft_links registry and the Cloud Function check endpoint.
 *
 * @param {string} ign - The Minecraft username to verify
 * @param {string|null} currentUid - The Firebase Auth UID of the current user (if logged in)
 * @param {object} [options]
 * @param {object} [options.dbInstance] - Optional Firestore instance override (defaults to db)
 * @returns {Promise<{ available: boolean, linkedToOther: boolean, message?: string, htmlMessage?: string }>}
 */
export async function checkMinecraftAvailability(ign, currentUid = null, options = {}) {
    const trimmed = (ign || '').trim();
    if (!trimmed) {
        return { available: true, linkedToOther: false };
    }

    const normalizedKey = normalizeMinecraftUsername(trimmed);
    const firestoreDb = options.dbInstance || db;

    // 1. Direct Firestore check on /minecraft_links/{normalizedKey}
    if (firestoreDb && typeof getDoc === 'function' && typeof doc === 'function') {
        try {
            const linkRef = doc(firestoreDb, MC_LINKS_COLLECTION, normalizedKey);
            const linkSnap = await getDoc(linkRef);
            if (linkSnap && (typeof linkSnap.exists === 'function' ? linkSnap.exists() : linkSnap.exists)) {
                const data = (typeof linkSnap.data === 'function' ? linkSnap.data() : linkSnap.data) || {};
                const ownerUid = data.uid || null;
                if (ownerUid && ownerUid !== currentUid) {
                    return {
                        available: false,
                        linkedToOther: true,
                        ownerUid,
                        message: MC_ALREADY_LINKED_MESSAGE,
                        htmlMessage: MC_ALREADY_LINKED_HTML
                    };
                }
            }
        } catch (dbErr) {
            console.warn('Notice: Direct Firestore minecraft_links check warning:', dbErr?.message || dbErr);
        }
    }

    // 2. Cloud Function backend check (queries users & dts_waitlist & minecraft_links via admin SDK)
    try {
        const endpoint = 'https://us-central1-dts-hub-website.cloudfunctions.net/checkMinecraftLink';
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 3500) : null;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: trimmed,
                currentUid: currentUid || null
            }),
            signal: controller ? controller.signal : undefined
        });

        if (timer) clearTimeout(timer);

        if (response.ok) {
            const result = await response.json();
            if (result && (result.available === false || result.linkedToOther === true)) {
                return {
                    available: false,
                    linkedToOther: true,
                    ownerUid: result.ownerUid || null,
                    message: MC_ALREADY_LINKED_MESSAGE,
                    htmlMessage: MC_ALREADY_LINKED_HTML
                };
            }
        }
    } catch (netErr) {
        // Fallback gracefully if network/offline or local test environment
    }

    return {
        available: true,
        linkedToOther: false
    };
}

/**
 * Claims / links a Minecraft username to a user profile in Firestore
 * @param {object} firestoreDb - Firestore instance
 * @param {string} uid - User UID
 * @param {string} ign - Minecraft IGN
 * @param {object} [options]
 * @param {string} [options.oldIgn] - Previously linked IGN (if changing)
 * @param {string} [options.email] - User email
 * @returns {Promise<boolean>}
 */
export async function claimMinecraftLink(firestoreDb, uid, ign, options = {}) {
    if (!uid) return false;
    const dbInst = firestoreDb || db;
    const trimmed = (ign || '').trim();
    const newKey = normalizeMinecraftUsername(trimmed);

    // If changing username, unbind the old key
    const oldIgn = options.oldIgn ? options.oldIgn.trim() : null;
    const oldKey = oldIgn ? normalizeMinecraftUsername(oldIgn) : null;

    if (oldKey && oldKey !== newKey && typeof deleteDoc === 'function') {
        try {
            await deleteDoc(doc(dbInst, MC_LINKS_COLLECTION, oldKey));
        } catch (delErr) {
            console.warn('Notice: Could not delete prior minecraft_link:', delErr?.message || delErr);
        }
    }

    // If new IGN is empty, we just unlinked
    if (!newKey) return true;

    try {
        const payload = {
            uid,
            minecraftUsername: trimmed,
            normalizedIgn: newKey,
            email: options.email || '',
            updatedAt: typeof serverTimestamp === 'function' ? serverTimestamp() : new Date().toISOString()
        };
        await setDoc(doc(dbInst, MC_LINKS_COLLECTION, newKey), payload, { merge: true });
        return true;
    } catch (saveErr) {
        console.warn('Notice: claimMinecraftLink error:', saveErr?.message || saveErr);
        return false;
    }
}

/**
 * Releases / unlinks a Minecraft username from an account
 * @param {object} firestoreDb
 * @param {string} ign
 * @returns {Promise<boolean>}
 */
export async function releaseMinecraftLink(firestoreDb, ign) {
    const key = normalizeMinecraftUsername(ign);
    if (!key) return true;
    const dbInst = firestoreDb || db;
    try {
        await deleteDoc(doc(dbInst, MC_LINKS_COLLECTION, key));
        return true;
    } catch (err) {
        console.warn('Notice: releaseMinecraftLink error:', err?.message || err);
        return false;
    }
}
