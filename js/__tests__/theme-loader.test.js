import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Setup mocks first
jest.mock('../auth.js', () => ({
  auth: {
    currentUser: null
  },
  db: {}
}));

import { auth } from '../auth.js';

describe('theme-loader', () => {
    let originalConsoleError;
    let authCallback;

    beforeAll(async () => {
        // Load the module once to register the callback
        await import('../theme-loader.js');
        const calls = onAuthStateChanged.mock.calls;
        if (calls.length > 0) {
             authCallback = calls[0][1];
        } else {
             throw new Error("onAuthStateChanged was not called");
        }
    });

    beforeEach(() => {
        // Clear DOM
        document.body.dataset.theme = '';
        document.body.dataset.accent = '';
        localStorage.clear();
        jest.clearAllMocks();

        originalConsoleError = console.error;
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    it('should apply fallback theme when user document does not exist', async () => {
        getDoc.mockResolvedValue({
            exists: () => false,
            data: () => null
        });

        const mockUser = { uid: 'user123' };
        auth.currentUser = mockUser;

        await authCallback(mockUser);

        expect(document.body.dataset.theme).toBe('dark');
        expect(document.body.dataset.accent).toBe('blue');
    });

    it('should apply fallback theme when getDoc throws an error', async () => {
        getDoc.mockRejectedValue(new Error('Firestore error'));

        const mockUser = { uid: 'user123' };
        auth.currentUser = mockUser;

        await authCallback(mockUser);

        expect(document.body.dataset.theme).toBe('dark');
        expect(document.body.dataset.accent).toBe('blue');
        expect(console.error).toHaveBeenCalled();
    });

    it('should apply user theme when user document exists', async () => {
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ theme: 'light', accentColor: 'red' })
        });

        const mockUser = { uid: 'user123' };
        auth.currentUser = mockUser;

        await authCallback(mockUser);

        expect(document.body.dataset.theme).toBe('light');
        expect(document.body.dataset.accent).toBe('red');
    });

    it('should apply local storage theme for guests', async () => {
        localStorage.setItem('userTheme', 'retro');
        localStorage.setItem('userAccent', 'green');

        auth.currentUser = null;

        await authCallback(null);

        expect(document.body.dataset.theme).toBe('retro');
        expect(document.body.dataset.accent).toBe('green');
    });
});
