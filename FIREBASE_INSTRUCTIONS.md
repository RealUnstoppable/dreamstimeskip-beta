# Firebase Setup Instructions

To ensure Firebase functions correctly across `www.realunstoppable.store` and its subdomains (`ezmanage`, `autolux`), please verify the following settings in your Firebase Console:

## 1. Authorized Domains for Authentication
- Go to **Authentication** > **Settings** > **Authorized domains**.
- Ensure `realunstoppable.store` (and its subdomains if required separately) are added to the list of authorized domains.
- Also ensure `dts-hub-website.firebaseapp.com` remains authorized.

## 2. App Check & reCAPTCHA v3
- Go to **App Check**.
- If App Check is enforced, ensure you have registered your web app with a valid **reCAPTCHA v3** or **reCAPTCHA Enterprise** site key.
- Replace the placeholder `"YOUR_RECAPTCHA_V3_SITE_KEY"` in `js/auth.js` with your actual reCAPTCHA site key.

## 3. Subdomain Auth Sharing
- By default, Firebase Auth uses `localStorage` bound to the specific origin (e.g., `ezmanage.realunstoppable.store`).
- If you need authentication state to persist seamlessly across subdomains, you must implement a custom token exchange mechanism or use an overarching domain for Auth flows, as Firebase Web SDK does not natively share Auth state across different subdomains without cross-origin iframe setups or Custom Auth implementation.
