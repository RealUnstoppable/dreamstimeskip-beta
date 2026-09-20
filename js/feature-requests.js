import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc, query, orderBy, getDocs, getDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { escapeHTML, formatDate } from './utils.js';

const requestForm = document.getElementById('feature-request-form');
const loginPrompt = document.getElementById('login-prompt');
const requestsList = document.getElementById('requests-list');
const submitBtn = document.getElementById('submit-request-btn');
const formMessage = document.getElementById('form-message');

let currentUser = null;

function renderStatus(status) {
    let displayStatus = 'Pending';
    let statusClass = 'status-pending';

    if (status === 'in_progress') {
        displayStatus = 'In Progress';
        statusClass = 'status-in_progress';
    } else if (status === 'completed') {
        displayStatus = 'Completed';
        statusClass = 'status-completed';
    }

    return `<span class="request-status ${statusClass}">${displayStatus}</span>`;
}

async function fetchAndRenderRequests() {
    if (!requestsList) return;

    try {
        const q = query(collection(db, 'feature_requests'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            requestsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No feature requests yet. Be the first to submit one!</p>';
            return;
        }

        let requestsData = [];
        snapshot.forEach(doc => {
            requestsData.push({ id: doc.id, ...doc.data() });
        });

        // Sort requests locally: by upvotes descending, then by createdAt descending
        requestsData.sort((a, b) => {
            const upvotesA = a.upvotes || 0;
            const upvotesB = b.upvotes || 0;
            if (upvotesB !== upvotesA) {
                return upvotesB - upvotesA;
            }
            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
        });

        // Determine upvoted status if user is logged in
        let userUpvotes = new Set();
        if (currentUser) {
             const upvotePromises = requestsData.map(async (reqData) => {
                 try {
                     const upvoteRef = doc(db, 'feature_requests', reqData.id, 'upvotes', currentUser.uid);
                     const upvoteSnap = await getDoc(upvoteRef);
                     if (upvoteSnap.exists()) {
                         return reqData.id;
                     }
                 } catch (e) {
                     // ignore if can't read
                 }
                 return null;
             });

             const results = await Promise.all(upvotePromises);
             results.forEach(id => {
                 if (id) userUpvotes.add(id);
             });
        }

        let html = '';
        for (const data of requestsData) {
            const dateStr = data.createdAt ? formatDate(data.createdAt.toDate()) : 'Recently';
            const upvotes = data.upvotes || 0;
            const hasUpvoted = userUpvotes.has(data.id);
            const upvoteClass = hasUpvoted ? 'upvoted' : '';
            const upvoteText = hasUpvoted ? 'Upvoted' : 'Upvote';
            const disableUpvote = !currentUser ? 'disabled title="Sign in to upvote"' : '';

            html += `
                <div class="request-card">
                    <div class="request-header" style="align-items: flex-start;">
                        <div style="flex: 1; padding-right: 15px;">
                            <h4 class="request-title">${escapeHTML(data.title)}</h4>
                            <div class="request-meta" style="margin-top: 5px;">
                                Submitted by ${escapeHTML(data.userEmail ? data.userEmail.split('@')[0] : 'Anonymous')} on ${dateStr}
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                            ${renderStatus(data.status)}
                            <button class="upvote-btn ${upvoteClass}" data-id="${escapeHTML(data.id)}" ${disableUpvote} style="display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color); cursor: pointer; color: var(--text-color); font-weight: 600; font-size: 0.9rem;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${hasUpvoted ? 'filled' : ''}"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                                <span class="upvote-count">${upvotes}</span>
                            </button>
                        </div>
                    </div>
                    <p style="margin: 10px 0 0 0; line-height: 1.5; color: var(--text-color);">${escapeHTML(data.description).replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }

        requestsList.innerHTML = html;

        // Attach event listeners to upvote buttons
        document.querySelectorAll('.upvote-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (!currentUser) return;

                const button = e.currentTarget;
                if (button.disabled) return;

                const requestId = button.getAttribute('data-id');
                const countSpan = button.querySelector('.upvote-count');
                const svg = button.querySelector('svg');
                let count = parseInt(countSpan.textContent, 10);
                const isCurrentlyUpvoted = button.classList.contains('upvoted');

                // Optimistic UI Update
                button.disabled = true;
                if (isCurrentlyUpvoted) {
                    button.classList.remove('upvoted');
                    svg.classList.remove('filled');
                    countSpan.textContent = count - 1;
                } else {
                    button.classList.add('upvoted');
                    svg.classList.add('filled');
                    countSpan.textContent = count + 1;
                }

                try {
                    const token = await currentUser.getIdToken();
                    const response = await fetch('https://us-central1-dts-hub-website.cloudfunctions.net/toggleFeatureUpvote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ requestId })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to toggle upvote');
                    }
                } catch (err) {
                    console.error("Manager info: Upvote error:", err);
                    // Revert optimistic update
                    if (isCurrentlyUpvoted) {
                        button.classList.add('upvoted');
                        svg.classList.add('filled');
                        countSpan.textContent = count;
                    } else {
                        button.classList.remove('upvoted');
                        svg.classList.remove('filled');
                        countSpan.textContent = count;
                    }
                } finally {
                    button.disabled = false;
                }
            });
        });

    } catch (error) {
        if (error.code !== "permission-denied" && !error.message.includes("Missing or insufficient permissions")) { console.error("Error fetching feature requests:", error); }
        requestsList.innerHTML = '<p style="text-align: center; color: var(--accent-red);">Failed to load feature requests. Please try again later.</p>';
    }
}

// Check auth state
onAuthStateChanged(auth, (user) => {
    currentUser = user;

    if (user) {
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (requestForm) requestForm.style.display = 'block';
    } else {
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (requestForm) requestForm.style.display = 'none';
    }

    fetchAndRenderRequests();
});

// Handle form submission
if (requestForm) {
    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) return;

        const titleInput = document.getElementById('request-title');
        const descriptionInput = document.getElementById('request-description');

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!title || !description) {
            formMessage.textContent = 'Please fill out all fields.';
            formMessage.style.color = 'var(--accent-red)';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        formMessage.textContent = '';

        try {
            await addDoc(collection(db, 'feature_requests'), {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                title: title,
                description: description,
                status: 'pending',
                createdAt: serverTimestamp(),
                upvotes: 0
            });

            titleInput.value = '';
            descriptionInput.value = '';

            formMessage.textContent = 'Feature request submitted successfully!';
            formMessage.style.color = 'var(--accent-green)';

            // Refresh list
            await fetchAndRenderRequests();

            setTimeout(() => {
                formMessage.textContent = '';
            }, 3000);

        } catch (error) {
            console.error("Error submitting feature request:", error);
            formMessage.textContent = 'Failed to submit request. Please try again.';
            formMessage.style.color = 'var(--accent-red)';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        }
    });
}
