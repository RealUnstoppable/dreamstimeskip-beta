import { auth, db } from './auth.js';
import { escapeHTML } from './utils.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { collection, addDoc, getDocs, doc, deleteDoc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const COMMENTS_COLLECTION = 'blog_comments';
let currentUser = null;

// Initialize comments section based on the current post ID
export function initBlogComments() {
    const commentsSection = document.getElementById('comments-section');
    if (!commentsSection) return;

    const postId = commentsSection.dataset.postId;
    if (!postId) {
        console.error("Manager info: Missing data-post-id on comments section");
        return;
    }

    renderCommentsUI(commentsSection, postId);

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateCommentFormUI(commentsSection);
        // Load comments inside auth state change to ensure user context is available for delete buttons
        loadComments(postId);
    });
}

function renderCommentsUI(container, postId) {
    container.innerHTML = `
        <h3 style="margin-bottom: 20px;">Comments</h3>
        <div id="comment-form-container" style="margin-bottom: 30px;">
            <p id="comment-auth-message" style="color: var(--text-secondary); margin-bottom: 10px;">Please <a href="/sign in beta.html" style="color: var(--accent-blue);">sign in</a> to leave a comment.</p>
            <form id="comment-form" style="display: none; flex-direction: column; gap: 10px;">
                <textarea id="comment-input" rows="4" placeholder="Share your thoughts..." required style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--secondary-bg); color: var(--text-color); resize: vertical;"></textarea>
                <button type="submit" id="submit-comment-btn" class="cta-button" style="align-self: flex-start;">Post Comment</button>
            </form>
            <div id="comment-notification" style="display: none; margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
        </div>
        <div id="comments-list" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="text-align: center; color: var(--text-secondary);">Loading comments...</div>
        </div>
    `;

    const form = document.getElementById('comment-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('comment-input').value.trim();
        if (content) {
            await addComment(postId, content);
        }
    });
}

function updateCommentFormUI(container) {
    const authMessage = document.getElementById('comment-auth-message');
    const form = document.getElementById('comment-form');

    if (currentUser) {
        authMessage.style.display = 'none';
        form.style.display = 'flex';
    } else {
        authMessage.style.display = 'block';
        form.style.display = 'none';
    }
}

async function getCachedUsername(uid) {
    try {
        const cacheKey = \`profile_\${uid}\`;
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            const userData = JSON.parse(cachedData);
            return userData.username;
        }
        return "User"; // Fallback if not in cache (could fetch from DB if needed)
    } catch (e) {
        console.error("Manager info: Error getting username", e);
        return "User";
    }
}

async function addComment(postId, content) {
    if (!currentUser) return;

    const submitBtn = document.getElementById('submit-comment-btn');
    const input = document.getElementById('comment-input');
    const notificationEl = document.getElementById('comment-notification');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
        const username = await getCachedUsername(currentUser.uid);

        await addDoc(collection(db, COMMENTS_COLLECTION), {
            postId: postId,
            userId: currentUser.uid,
            username: username,
            content: content,
            createdAt: serverTimestamp()
        });

        input.value = '';
        showNotification(notificationEl, 'Comment posted successfully!', 'success');

        // Reload comments
        await loadComments(postId);
    } catch (error) {
        console.error('Manager info: Error posting comment:', error);
        showNotification(notificationEl, 'Failed to post comment. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
    }
}

async function loadComments(postId) {
    const listContainer = document.getElementById('comments-list');
    if (!listContainer) return;

    try {
        const q = query(
            collection(db, COMMENTS_COLLECTION),
            where("postId", "==", postId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listContainer.innerHTML = '<div style="color: var(--text-secondary); font-style: italic;">No comments yet. Be the first to share your thoughts!</div>';
            return;
        }

        let html = '';
        querySnapshot.forEach((docSnap) => {
            const comment = docSnap.data();
            const dateStr = comment.createdAt ? new Date(comment.createdAt.toMillis()).toLocaleDateString() : 'Just now';

            // Allow deletion if the current user is the author (admin delete would require extra logic or just be done via console for now)
            const canDelete = currentUser && currentUser.uid === comment.userId;
            const deleteBtnHtml = canDelete ? \`<button class="delete-comment-btn" data-id="\${docSnap.id}" aria-label="Delete comment" style="background: none; border: none; color: var(--accent-red); cursor: pointer; font-size: 0.9em; text-decoration: underline; margin-left: auto;">Delete</button>\` : '';

            html += \`
                <div class="comment-item" style="padding: 15px; border-radius: 8px; background: var(--primary-card-color); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-weight: 600;">\${escapeHTML(comment.username || 'User')}</span>
                        <span style="font-size: 0.85em; color: var(--text-secondary);">\${dateStr}</span>
                    </div>
                    <p style="margin: 0; line-height: 1.5;">\${escapeHTML(comment.content)}</p>
                    \${deleteBtnHtml}
                </div>
            \`;
        });

        listContainer.innerHTML = html;

        // Attach delete listeners
        listContainer.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const commentId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this comment?')) {
                    try {
                        e.target.disabled = true;
                        e.target.textContent = 'Deleting...';
                        await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
                        await loadComments(postId); // Refresh
                    } catch (err) {
                        console.error('Manager info: Error deleting comment', err);
                        alert('Failed to delete comment.');
                        e.target.disabled = false;
                        e.target.textContent = 'Delete';
                    }
                }
            });
        });

    } catch (error) {
        console.error('Manager info: Error loading comments:', error);
        listContainer.innerHTML = '<div style="color: var(--accent-red);">Failed to load comments.</div>';
    }
}



function showNotification(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.style.display = 'block';
    element.style.backgroundColor = type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)';
    element.style.color = type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)';
    element.style.border = \`1px solid \${type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)'}\`;

    setTimeout(() => { element.style.display = 'none'; }, 5000);
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initBlogComments);
