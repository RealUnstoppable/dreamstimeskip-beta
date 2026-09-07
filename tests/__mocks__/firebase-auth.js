import { jest } from '@jest/globals';
export const onAuthStateChanged = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const getAuth = jest.fn();
export const sendEmailVerification = jest.fn();
export const setPersistence = jest.fn().mockResolvedValue();
export const browserLocalPersistence = 'browserLocalPersistence';
