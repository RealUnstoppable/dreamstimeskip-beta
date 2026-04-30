import { auth } from './auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { getDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// We need to carefully mock the imports to control their behavior.
jest.mock('./auth.js', () => ({
  auth: { currentUser: null },
  db: {}
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
  onAuthStateChanged: jest.fn()
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
  doc: jest.fn(),
  getDoc: jest.fn()
}));

describe('theme-loader.js', () => {
  let authStateCallback;

  beforeEach(() => {
    // Clear DOM and LocalStorage before each test
    // Setting dataset keys to empty string makes them exist but empty.
    // To completely clear them, we can delete the properties from dataset.
    delete document.body.dataset.theme;
    delete document.body.dataset.accent;
    localStorage.clear();
    jest.clearAllMocks();

    // Capture the callback passed to onAuthStateChanged
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      authStateCallback = callback;
    });
  });

  const loadThemeLoader = async () => {
    // To test the IIFE, we must isolate modules so it runs on each import.
    await jest.isolateModulesAsync(async () => {
        await import('./theme-loader.js');
    });
  };

  describe('IIFE (Initial Load)', () => {
    it('should not set dataset if localStorage is empty', async () => {
      await loadThemeLoader();
      expect(document.body.dataset.theme).toBeUndefined();
      expect(document.body.dataset.accent).toBeUndefined();
    });

    it('should set dataset from localStorage if present', async () => {
      localStorage.setItem('userTheme', 'light');
      localStorage.setItem('userAccent', 'green');
      await loadThemeLoader();
      expect(document.body.dataset.theme).toBe('light');
      expect(document.body.dataset.accent).toBe('green');
    });
  });

  describe('window.updateTheme', () => {
    beforeEach(async () => {
      await loadThemeLoader();
    });

    it('should update dataset and localStorage when user is not logged in', () => {
      auth.currentUser = null;
      window.updateTheme('light', 'green');

      expect(document.body.dataset.theme).toBe('light');
      expect(document.body.dataset.accent).toBe('green');
      expect(localStorage.getItem('userTheme')).toBe('light');
      expect(localStorage.getItem('userAccent')).toBe('green');
    });

    it('should fall back to dark and blue if no arguments provided', () => {
      auth.currentUser = null;
      window.updateTheme();

      expect(document.body.dataset.theme).toBe('dark');
      expect(document.body.dataset.accent).toBe('blue');
      expect(localStorage.getItem('userTheme')).toBe('dark');
      expect(localStorage.getItem('userAccent')).toBe('blue');
    });

    it('should update dataset but skip localStorage when user is logged in', () => {
      auth.currentUser = { uid: '123' };
      window.updateTheme('light', 'green');

      expect(document.body.dataset.theme).toBe('light');
      expect(document.body.dataset.accent).toBe('green');
      // LocalStorage should remain empty
      expect(localStorage.getItem('userTheme')).toBeNull();
      expect(localStorage.getItem('userAccent')).toBeNull();
    });
  });

  describe('onAuthStateChanged callback', () => {
    beforeEach(async () => {
      await loadThemeLoader();
    });

    it('should apply theme from localStorage when user is not logged in', async () => {
      localStorage.setItem('userTheme', 'dark');
      localStorage.setItem('userAccent', 'red');

      // trigger callback with no user
      await authStateCallback(null);

      expect(document.body.dataset.theme).toBe('dark');
      expect(document.body.dataset.accent).toBe('red');
    });

    it('should fetch theme from Firestore when user is logged in and document exists', async () => {
      const mockUser = { uid: '123' };

      // Mock Firestore response
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ theme: 'light', accentColor: 'purple' })
      });

      await authStateCallback(mockUser);

      expect(getDoc).toHaveBeenCalled();
      expect(document.body.dataset.theme).toBe('light');
      expect(document.body.dataset.accent).toBe('purple');
    });

    it('should fall back to dark/blue when user is logged in but document does not exist', async () => {
      const mockUser = { uid: '123' };

      getDoc.mockResolvedValueOnce({
        exists: () => false
      });

      await authStateCallback(mockUser);

      expect(document.body.dataset.theme).toBe('dark');
      expect(document.body.dataset.accent).toBe('blue');
    });

    it('should fall back to dark/blue when Firestore fetch fails', async () => {
      const mockUser = { uid: '123' };

      getDoc.mockRejectedValueOnce(new Error('Network error'));

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await authStateCallback(mockUser);

      expect(consoleSpy).toHaveBeenCalledWith("Error loading theme from Firestore:", expect.any(Error));
      expect(document.body.dataset.theme).toBe('dark');
      expect(document.body.dataset.accent).toBe('blue');

      consoleSpy.mockRestore();
    });
  });
});
