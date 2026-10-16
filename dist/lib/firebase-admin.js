import admin from 'firebase-admin';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
if (!admin.apps.length) {
    admin.initializeApp();
}
export const adminApp = admin.apps[0];
export const adminDb = getFirestore();
export { admin, getFirestore, FieldValue, Timestamp };
export default adminDb;
