import { getFirebaseErrorMessage } from './auth.js';

describe('getFirebaseErrorMessage', () => {
    it('returns correct message for auth/invalid-email', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/invalid-email' })).toBe('Please enter a valid email address.');
    });

    it('returns correct message for auth/user-not-found', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/user-not-found' })).toBe('Invalid email or password.');
    });

    it('returns correct message for auth/wrong-password', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/wrong-password' })).toBe('Invalid email or password.');
    });

    it('returns correct message for auth/invalid-credential', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/invalid-credential' })).toBe('Invalid email or password.');
    });

    it('returns correct message for auth/email-already-in-use', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/email-already-in-use' })).toBe('An account with this email already exists.');
    });

    it('returns correct message for auth/weak-password', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/weak-password' })).toBe('Password should be at least 6 characters.');
    });

    it('returns default message for unknown errors', () => {
        expect(getFirebaseErrorMessage({ code: 'auth/unknown-error' })).toBe('An unexpected error occurred. Please try again.');
        expect(getFirebaseErrorMessage({})).toBe('An unexpected error occurred. Please try again.');
    });
});
