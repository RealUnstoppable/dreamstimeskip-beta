import { db } from './auth.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Use event delegation to catch submissions from dynamically loaded footers
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
                alert("You've successfully subscribed to the newsletter!");
                emailInput.value = ''; // Clear the input
            } catch (error) {
                console.error("Error submitting email:", error);
                alert("There was an error subscribing. Please try again later.");
            }
        }
    }
});