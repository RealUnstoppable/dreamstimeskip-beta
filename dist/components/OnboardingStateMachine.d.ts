import { OnboardingState, OnboardingStepNumber, UserRole, AcquisitionSource, PlatformUsage, GenrePreference, SfxIntensity, OnboardingPreferences } from '../lib/onboarding-types.js';
export interface StepConfig {
    step: OnboardingStepNumber;
    title: string;
    subtitle: string;
    badge: string;
    canSkip: boolean;
}
export declare const ONBOARDING_STEPS_CONFIG: Record<OnboardingStepNumber, StepConfig>;
export declare class OnboardingStateMachine {
    private state;
    private listeners;
    constructor(initialState?: Partial<OnboardingState>);
    getState(): Readonly<OnboardingState>;
    subscribe(listener: (state: OnboardingState) => void): () => void;
    private notify;
    setStep(step: OnboardingStepNumber): void;
    nextStep(): boolean;
    prevStep(): boolean;
    setAccount(data: Partial<OnboardingState['account']>): void;
    setRole(role: UserRole): void;
    setAcquisitionSource(source: AcquisitionSource): void;
    togglePlatform(platform: PlatformUsage): void;
    toggleGenre(genre: GenrePreference): void;
    setSfxNeeds(sfx: SfxIntensity): void;
    toggleArtistOrVibe(item: string): void;
    setSubmitting(isSubmitting: boolean): void;
    setError(error: string | null): void;
    setGuestTrial(isGuest: boolean): void;
    complete(): OnboardingPreferences;
    exportPreferences(): OnboardingPreferences;
    validateStep(step: OnboardingStepNumber): {
        valid: boolean;
        error?: string;
    };
}
