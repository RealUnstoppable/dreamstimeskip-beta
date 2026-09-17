const fs = require('fs');
let content = fs.readFileSync('js/account.js', 'utf8');

// We want to add a state check to avoid re-rendering.
// Add a global variable to store state.
const newVars = `
// DOM Elements
const profileDetails = document.getElementById('profile-details');
const ordersList = document.getElementById('orders-list');

// State tracking
let currentOrdersCache = null;
let currentProfileCache = null;`;

content = content.replace(`
// DOM Elements
const profileDetails = document.getElementById('profile-details');
const ordersList = document.getElementById('orders-list');`, newVars);

// Now for renderProfile:
const renderProfileStr = `async function renderProfile(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        let userDoc = await getDoc(userRef);

        let userData;
        if (!userDoc.exists()) {
            userData = {
                email: user.email,
                username: user.email.split('@')[0],
                membershipLevel: 'free',
                isAdmin: false,
                isBanned: false,
                signupDate: new Date()
            };
            await setDoc(userRef, userData, { merge: true });
        } else {
            userData = userDoc.data();
        }

        const profileHTML = \`
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <strong>Username:</strong> <span>\${escapeHTML(userData.username || 'User')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <strong>Email:</strong> <span>\${escapeHTML(userData.email || user.email)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <strong>Membership:</strong> <span class="membership-status \${escapeHTML(userData.membershipLevel)}">\${escapeHTML(userData.membershipLevel).toUpperCase()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <strong>Joined:</strong> <span>\${formatDate(userData.signupDate)}</span>
            </div>
        \`;

        if (currentProfileCache !== profileHTML) {
            profileDetails.innerHTML = profileHTML;
            currentProfileCache = profileHTML;
        }

    } catch (error) {
        console.error("Manager info: Error rendering profile:", error);
        profileDetails.innerHTML = \`<p style="color: var(--accent-red);">Failed to load profile. Please try again later.</p>\`;
    }
}`;

content = content.replace(/async function renderProfile\(user\) \{[\s\S]*?\}\n\}\n/m, renderProfileStr + "\n");


fs.writeFileSync('js/account.js', content);
