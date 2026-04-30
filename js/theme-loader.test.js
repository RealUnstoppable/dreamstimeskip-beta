// Setup mocks before importing
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

import { auth, db } from './auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

describe('theme-loader.js', () => {
    let originalLocalStorage;
    let authStateCallback;

    beforeEach(() => {
        // Mock localStorage
        originalLocalStorage = window.localStorage;
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        // Reset document body
        document.body.dataset.theme = '';
        document.body.dataset.accent = '';

        // Mock console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Reset mocks
        jest.clearAllMocks();
        jest.resetModules();

        // Ensure getDoc default is to not exist so it doesn't leak
        const { getDoc } = require('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js');
        getDoc.mockResolvedValue({ exists: () => false });

        // Capture the auth state callback
        onAuthStateChanged.mockImplementation((_, callback) => {
            authStateCallback = callback;
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
        jest.restoreAllMocks();
    });

    // Helper to load the module
    const loadModule = async () => {
        authStateCallback = undefined;

        jest.isolateModules(() => {
            // Need to require the mocks inside isolateModules so they are picked up by the isolated module
            const { onAuthStateChanged } = require('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js');
            onAuthStateChanged.mockImplementation((_, callback) => {
                authStateCallback = callback;
            });
            require('./theme-loader.js');
        });

        // Give time for any async initialization if any
        await new Promise(process.nextTick);

        // Ensure the callback was registered
        if (!authStateCallback) {
            throw new Error("authStateCallback was not registered by onAuthStateChanged");
        }
    };

    it('should set fallback theme when user is authenticated but has no Firestore profile', async () => {
        await loadModule();

        // Mock an authenticated user
        const mockUser = { uid: 'user123' };
        auth.currentUser = mockUser;

        // Ensure we are mocking the method on the correct instance inside isolateModules
        const { doc: isolatedDoc, getDoc: isolatedGetDoc } = require('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js');

        isolatedDoc.mockReturnValue('mockDocRef');
        isolatedGetDoc.mockResolvedValue({ exists: () => false });

        // Trigger auth state change
        await authStateCallback(mockUser);

        // Verify fallback theme was applied
        expect(document.body.dataset.theme).toBe('dark');
        expect(document.body.dataset.accent).toBe('blue');
    });

    it('should set user theme when authenticated and profile exists', async () => {
        // Clear global mock first just in case
        getDoc.mockReset();
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ theme: 'light', accentColor: 'red' })
        });

        await loadModule();

        const mockUser = { uid: 'user123' };
        auth.currentUser = mockUser;

        const { doc: isolatedDoc, getDoc: isolatedGetDoc } = require('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js');

        isolatedDoc.mockReturnValue('mockDocRef');
        isolatedGetDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ theme: 'light', accentColor: 'red' })
        });

        await authStateCallback(mockUser);

        // Await the microtasks just in case getDoc takes an extra tick
        await new Promise(process.nextTick);

        expect(document.body.dataset.theme).toBe('light');
        expect(document.body.dataset.accent).toBe('red');
    });

    it('should set fallback theme when Firestore throws an error', async () => {
        await loadModule();

        const mockUser = { uid: 'user123' };
        auth.currentUser = mockUser;

        const { doc: isolatedDoc, getDoc: isolatedGetDoc } = require('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js');
        isolatedDoc.mockReturnValue('mockDocRef');
        isolatedGetDoc.mockRejectedValue(new Error('Firestore error'));

        await authStateCallback(mockUser);

        expect(console.error).toHaveBeenCalled();
        expect(document.body.dataset.theme).toBe('dark');
        expect(document.body.dataset.accent).toBe('blue');
    });

    it('should set theme from localStorage for unauthenticated users', async () => {
        // Set up localStorage mock to return values
        window.localStorage.getItem.mockImplementation(key => {
            if (key === 'userTheme') return 'customTheme';
            if (key === 'userAccent') return 'customAccent';
            return null;
        });

        await loadModule();

        auth.currentUser = null;

        await authStateCallback(null);

        expect(document.body.dataset.theme).toBe('customTheme');
        expect(document.body.dataset.accent).toBe('customAccent');
    });

    it('should set fallback values and persist to localStorage when no theme is found and user is unauthenticated', async () => {
        window.localStorage.getItem.mockReturnValue(null);

        await loadModule();

        auth.currentUser = null;

        await authStateCallback(null);

        expect(document.body.dataset.theme).toBe('dark');
        expect(document.body.dataset.accent).toBe('blue');
        expect(window.localStorage.setItem).toHaveBeenCalledWith('userTheme', 'dark');
        expect(window.localStorage.setItem).toHaveBeenCalledWith('userAccent', 'blue');
    });

    it('should apply initial theme from localStorage on load', async () => {
        window.localStorage.getItem.mockImplementation(key => {
            if (key === 'userTheme') return 'initTheme';
            if (key === 'userAccent') return 'initAccent';
            return null;
        });

        await loadModule();

        expect(document.body.dataset.theme).toBe('initTheme');
        expect(document.body.dataset.accent).toBe('initAccent');
    });
});
