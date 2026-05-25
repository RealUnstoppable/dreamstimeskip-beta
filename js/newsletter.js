import { db } from './auth.js';

// Check if we are in a testing environment that doesn't support https imports
const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

if (isTest) {
    // If in testing, we use a global mock setup in tests
    initNewsletter(global.firestoreMock || { doc: () => {}, setDoc: () => {}, serverTimestamp: () => {} });
} else {
    import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js").then(fs => {
        initNewsletter(fs);
    });
}

function initNewsletter(firestoreModule) {
    const { doc, setDoc, serverTimestamp } = firestoreModule;

    // Use event delegation to catch submissions from dynamically loaded footers
    if (typeof document !== 'undefined') {
        document.addEventListener('submit', async (e) => {
            // Check if the submitted element has the .signup-form class
            if (e.target && e.target.matches('.signup-form')) {
                e.preventDefault();

                const form = e.target;
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput.value.trim();

                if (email) {
                    try {
                        await setDoc(doc(db, "newsletterSubscribers", email), {
                            email: email,
                            subscribedAt: serverTimestamp()
                        });

                        // Show a success message
                        window.alert("You've successfully subscribed to the newsletter!");
                        emailInput.value = ''; // Clear the input
                    } catch (error) {
                        console.error("Error submitting email:", error);
                        window.alert("There was an error subscribing. Please try again later.");
                    }
                }
            }
        });
    }
}
