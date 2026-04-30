import { jest } from '@jest/globals';

// Set up globals
global.document = {
    getElementById: jest.fn().mockReturnValue({
        innerHTML: '',
        textContent: '',
        addEventListener: jest.fn(),
        style: {}
    }),
    querySelector: jest.fn().mockReturnValue({
        innerHTML: '',
        textContent: '',
        addEventListener: jest.fn(),
        style: {}
    }),
    addEventListener: jest.fn()
};

global.window = {
    addEventListener: jest.fn()
};

global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};
