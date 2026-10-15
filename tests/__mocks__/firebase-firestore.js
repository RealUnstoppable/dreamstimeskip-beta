import { jest } from '@jest/globals';

export const doc = jest.fn((...args) => ({ id: args[2] || 'mock-id' }));
export const getDoc = jest.fn();
export const setDoc = jest.fn();
export const getFirestore = jest.fn(() => ({}));
export const collection = jest.fn();
export const getDocs = jest.fn();

export const serverTimestamp = jest.fn(() => 'MOCK_SERVER_TIMESTAMP');
export const addDoc = jest.fn();
export const updateDoc = jest.fn();
export const arrayUnion = jest.fn((...args) => args);
export const arrayRemove = jest.fn((...args) => args);
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const deleteDoc = jest.fn();
export const Timestamp = {
    now: jest.fn(() => ({ toDate: () => new Date() })),
    fromDate: jest.fn((d) => ({ toDate: () => d }))
};

