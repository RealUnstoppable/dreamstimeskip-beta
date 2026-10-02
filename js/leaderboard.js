import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const COLLECTION_NAME = 'blobgame_leaderboard';

// Hardcoded bots to give players a target
const BOTS = [
    { username: 'BlobMaster', score: 3500 },
    { username: 'Unstoppable', score: 1850 },
    { username: 'NinjaPro', score: 920 },
    { username: 'Noob123', score: 110 }
];

function mergeAndSortScores(scores) {
    BOTS.forEach(bot => scores.push(bot));
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 10);
}

export async function saveScore(score) {
    const username = getLocalUsername();
    if (!username) return; // Don't save if no username

    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            username: username,
            score: score,
            uid: auth?.currentUser?.uid || 'anonymous',
            timestamp: Date.now()
        });
    } catch (e) {
        console.error("Manager info: Error saving score to leaderboard ", e);
    }
}

export async function getTopScores() {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        let scores = [];
        querySnapshot.forEach((doc) => {
            scores.push(doc.data());
        });
        
        return mergeAndSortScores(scores);
    } catch (e) {
        console.error("Manager info: Error fetching leaderboard, falling back to bots ", e);
        // Fallback to just bots if offline or permission denied (e.g. strict rules)
        let scores = [];
        return mergeAndSortScores(scores);
    }
}

export function getLocalUsername() {
    return localStorage.getItem('blobgame_username');
}

export function setLocalUsername(username) {
    if (username && username.trim().length > 0) {
        localStorage.setItem('blobgame_username', username.trim());
        return true;
    }
    return false;
}
