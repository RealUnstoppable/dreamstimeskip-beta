/**
 * Privacy Consent Manager Component
 * Provides Consent Banner & "Your Privacy Choices / Do Not Sell or Share My Personal Information" Modal
 */
export interface ConsentChoices {
    essential: true;
    analytics: boolean;
    advertising: boolean;
    commercialSharing: boolean;
}
export declare class PrivacyConsentManager {
    private container;
    private modal;
    private banner;
    private gpcActive;
    constructor();
    init(): void;
    private injectStyles;
    private createDomElements;
    private bindEvents;
    showBanner(): void;
    hideBanner(): void;
    openModal(): void;
    closeModal(): void;
    private saveConsent;
}
export declare function initPrivacyConsentManager(): PrivacyConsentManager;
