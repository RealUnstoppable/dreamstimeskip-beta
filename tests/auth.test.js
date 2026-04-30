import { getFirebaseErrorMessage } from '../js/auth.js';

describe('getFirebaseErrorMessage', () => {
    test('returns correct message for auth/invalid-email', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/invalid-email' })).toBe('Please enter a valid email address.');
    });
    test('returns correct message for auth/user-not-found', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/user-not-found' })).toBe('Invalid email or password.');
    });
    test('returns correct message for auth/wrong-password', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/wrong-password' })).toBe('Invalid email or password.');
    });
    test('returns correct message for auth/invalid-credential', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/invalid-credential' })).toBe('Invalid email or password.');
    });
    test('returns correct message for auth/email-already-in-use', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/email-already-in-use' })).toBe('An account with this email already exists.');
    });
    test('returns correct message for auth/weak-password', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/weak-password' })).toBe('Password should be at least 6 characters.');
    });
    test('returns fallback message for unknown error codes', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/unknown-error' })).toBe('An unexpected error occurred. Please try again.');
    });
});
