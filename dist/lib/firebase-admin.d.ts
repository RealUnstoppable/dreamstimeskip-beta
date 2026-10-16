import admin from 'firebase-admin';
import { getFirestore, FieldValue, Timestamp, type Firestore } from 'firebase-admin/firestore';
export declare const adminApp: admin.app.App;
export declare const adminDb: Firestore;
export { admin, getFirestore, FieldValue, Timestamp };
export default adminDb;
