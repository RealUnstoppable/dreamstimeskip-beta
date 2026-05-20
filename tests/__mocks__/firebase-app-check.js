import { jest } from '@jest/globals';
export const initializeAppCheck = jest.fn();
export class ReCaptchaV3Provider {
  constructor(siteKey) {
    this.siteKey = siteKey;
  }
}
