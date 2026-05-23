import { jest } from '@jest/globals';
export const initializeAppCheck = jest.fn();
export const ReCaptchaV3Provider = jest.fn();
export class ReCaptchaEnterpriseProvider {
    constructor(key) { this.key = key; }
}
