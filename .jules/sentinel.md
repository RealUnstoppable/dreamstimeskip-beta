## 2024-05-30 - Client-Side Order Processing Fix
**Vulnerability:** Found client-side writing directly to sensitive `orders` and `loyalty_transactions` collections (`addDoc` and `setDoc` in `js/checkout.js`).
**Learning:** This exposes the application to severe financial risk and data tampering as users can manipulate their total amounts and arbitrary loyalty points through the browser console.
**Prevention:** Always delegate direct database writes involving financial or point-based transactions to secure, authenticated backend Cloud Functions (e.g., `processOrderTransaction`).
