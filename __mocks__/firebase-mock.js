module.exports = {
  initializeApp: jest.fn(() => ({})),
  getAuth: jest.fn(() => ({})),
  getFirestore: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  GoogleAuthProvider: class {},
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
};
