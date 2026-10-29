import {
  OnboardingState,
  OnboardingStepNumber,
  UserRole,
  AcquisitionSource,
  PlatformUsage,
  GenrePreference,
  SfxIntensity,
  OnboardingPreferences
} from '../lib/onboarding-types.js';

export interface StepConfig {
  step: OnboardingStepNumber;
  title: string;
  subtitle: string;
  badge: string;
  canSkip: boolean;
}

export const ONBOARDING_STEPS_CONFIG: Record<OnboardingStepNumber, StepConfig> = {
  1: {
    step: 1,
    title: 'Welcome to Medixly',
    subtitle: 'Create an account to start listening and personalize your sound experience.',
    badge: 'Step 1 of 5 • Account',
    canSkip: false
  },
  2: {
    step: 2,
    title: 'Who Are You?',
    subtitle: 'Choose your primary identity to customize your sound packs, tools, and discovery.',
    badge: 'Step 2 of 5 • Role & Intent',
    canSkip: true
  },
  3: {
    step: 3,
    title: 'How Did You Find Us?',
    subtitle: 'Help us learn what brought you into the Unstoppable Ecosystem.',
    badge: 'Step 3 of 5 • Acquisition',
    canSkip: true
  },
  4: {
    step: 4,
    title: 'Where Do You Hang Out?',
    subtitle: 'Select the social platforms where you create, listen, or share (multi-select).',
    badge: 'Step 4 of 5 • Social Platforms',
    canSkip: true
  },
  5: {
    step: 5,
    title: 'Tailor Your Sound',
    subtitle: 'Fine-tune your genres, sound effect needs, and aesthetic vibes to seed recommendations.',
    badge: 'Step 5 of 5 • Sound Profile',
    canSkip: true
  }
};

export class OnboardingStateMachine {
  private state: OnboardingState;
  private listeners: Array<(state: OnboardingState) => void> = [];

  constructor(initialState?: Partial<OnboardingState>) {
    this.state = {
      currentStep: 1,
      account: {
        username: '',
        email: '',
        phone: '',
        dob: '',
        pfpUrl: ''
      },
      role: null,
      acquisitionSource: null,
      platforms: [],
      genres: [],
      sfxNeeds: 'moderate',
      favoriteArtists: [],
      isSubmitting: false,
      errorMessage: null,
      isGuestTrial: false,
      completed: false,
      ...initialState
    };
  }

  public getState(): Readonly<OnboardingState> {
    return { ...this.state };
  }

  public subscribe(listener: (state: OnboardingState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const frozenState = this.getState();
    this.listeners.forEach(l => l(frozenState));
  }

  public setStep(step: OnboardingStepNumber): void {
    if (step >= 1 && step <= 5) {
      this.state.currentStep = step;
      this.state.errorMessage = null;
      this.notify();
    }
  }

  public nextStep(): boolean {
    if (this.state.currentStep < 5) {
      this.setStep((this.state.currentStep + 1) as OnboardingStepNumber);
      return true;
    }
    return false;
  }

  public prevStep(): boolean {
    if (this.state.currentStep > 1) {
      this.setStep((this.state.currentStep - 1) as OnboardingStepNumber);
      return true;
    }
    return false;
  }

  public setAccount(data: Partial<OnboardingState['account']>): void {
    this.state.account = { ...this.state.account, ...data };
    this.notify();
  }

  public setRole(role: UserRole): void {
    this.state.role = role;
    this.notify();
  }

  public setAcquisitionSource(source: AcquisitionSource): void {
    this.state.acquisitionSource = source;
    this.notify();
  }

  public togglePlatform(platform: PlatformUsage): void {
    const exists = this.state.platforms.includes(platform);
    if (exists) {
      this.state.platforms = this.state.platforms.filter(p => p !== platform);
    } else {
      this.state.platforms = [...this.state.platforms, platform];
    }
    this.notify();
  }

  public toggleGenre(genre: GenrePreference): void {
    const exists = this.state.genres.includes(genre);
    if (exists) {
      this.state.genres = this.state.genres.filter(g => g !== genre);
    } else {
      this.state.genres = [...this.state.genres, genre];
    }
    this.notify();
  }

  public setSfxNeeds(sfx: SfxIntensity): void {
    this.state.sfxNeeds = sfx;
    this.notify();
  }

  public toggleArtistOrVibe(item: string): void {
    const trimmed = item.trim();
    if (!trimmed) return;
    const exists = this.state.favoriteArtists.includes(trimmed);
    if (exists) {
      this.state.favoriteArtists = this.state.favoriteArtists.filter(a => a !== trimmed);
    } else {
      this.state.favoriteArtists = [...this.state.favoriteArtists, trimmed];
    }
    this.notify();
  }

  public setSubmitting(isSubmitting: boolean): void {
    this.state.isSubmitting = isSubmitting;
    this.notify();
  }

  public setError(error: string | null): void {
    this.state.errorMessage = error;
    this.notify();
  }

  public setGuestTrial(isGuest: boolean): void {
    this.state.isGuestTrial = isGuest;
    this.notify();
  }

  public complete(): OnboardingPreferences {
    this.state.completed = true;
    this.notify();
    return this.exportPreferences();
  }

  public exportPreferences(): OnboardingPreferences {
    return {
      role: this.state.role || 'listener',
      acquisitionSource: this.state.acquisitionSource || 'other',
      platforms: this.state.platforms.length > 0 ? this.state.platforms : ['tiktok'],
      genres: this.state.genres.length > 0 ? this.state.genres : ['hiphop', 'pop'],
      sfxNeeds: this.state.sfxNeeds || 'moderate',
      favoriteArtists: this.state.favoriteArtists,
      completed: true,
      updatedAt: Date.now()
    };
  }

  public validateStep(step: OnboardingStepNumber): { valid: boolean; error?: string } {
    if (step === 1) {
      const { username, email, phone, dob } = this.state.account;
      if (!username || !username.trim()) return { valid: false, error: 'Username is required.' };
      if (!email || !email.trim() || !email.includes('@')) return { valid: false, error: 'Valid email is required.' };
      if (!phone || !phone.trim()) return { valid: false, error: 'Phone number is required.' };
      if (!dob || !dob.trim()) return { valid: false, error: 'Date of birth is required.' };
      return { valid: true };
    }
    // Steps 2-5 are preference steps and can be skipped or proceed with defaults
    return { valid: true };
  }
}
