import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
        const q = collection(db, 'feature_requests');
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            requestsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No feature requests yet. Be the first to submit one!</p>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const dateStr = data.createdAt ? formatDate(data.createdAt.toDate()) : 'Recently';

            html += `
                <div class="request-card">
                    <div class="request-header">
                        <h4 class="request-title">${escapeHTML(data.title)}</h4>
                        ${renderStatus(data.status)}
                    </div>
                    <p style="margin: 0; line-height: 1.5; color: var(--text-color);">${escapeHTML(data.description).replace(/\n/g, '<br>')}</p>
                    <div class="request-meta">
                        Submitted by ${escapeHTML(data.userEmail ? data.userEmail.split('@')[0] : 'Anonymous')} on ${dateStr}
                    </div>
                </div>
            `;
        });

        requestsList.innerHTML = html;

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
