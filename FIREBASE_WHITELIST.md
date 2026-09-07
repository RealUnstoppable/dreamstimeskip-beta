# Firebase Whitelisting Instructions

To ensure the restored Firebase connection functions properly, especially for subdomains and security layers (App Check), please configure the following settings in your Firebase Console.

## 1. Authentication Authorized Domains
For authentication to work correctly across `www.realunstoppable.store` and subdomains (like `ezmanage` and `autolux`), the domains must be explicitly authorized.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`dts-hub-website`).
3. In the left sidebar, navigate to **Authentication** > **Settings** > **Authorized domains**.
4. Ensure the following domains are listed:
   - `localhost`
   - `realunstoppable.store`
   - `www.realunstoppable.store`
   - `ezmanage.realunstoppable.store` (if applicable)
   - `autolux.realunstoppable.store` (if applicable)

## 2. App Check (reCAPTCHA v3/Enterprise)
If you have App Check enforced to prevent illegitimate traffic, make sure your domain is registered with reCAPTCHA and App Check.

1. Go to your Google Cloud Console / reCAPTCHA Enterprise dashboard.
2. Ensure your domain (`realunstoppable.store`) is added to the list of verified domains for the site key used in initialization: `6Lce-t0qAAAAALo9r3f-3oJb-uWz1HkF4jR-R_eT`.
3. In the Firebase Console, go to **App Check** > **Apps**.
4. Verify that the web app is registered with the correct reCAPTCHA provider and the key is valid.

## 3. Firestore Rules
The new Health Check ping depends on reading `_health/check`. A `permission-denied` error indicates that the backend is successfully reachable (which the frontend catches as a success). Ensure your `firestore.rules` block access to this route so it safely returns `permission-denied` to unauthenticated pings:

```javascript
match /_health/{document=**} {
  allow read: if false;
}
```