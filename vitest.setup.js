import { vi } from 'vitest';

vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendEmailVerification: vi.fn(),
}));

vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  runTransaction: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('./auth.js', () => ({
  auth: {},
  db: {}
}));
