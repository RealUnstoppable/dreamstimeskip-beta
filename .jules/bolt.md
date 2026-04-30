Refactored un-awaited Firestore updates in stripeWebhook to use WriteBatch, ensuring all updates are completed before the function finishes.
