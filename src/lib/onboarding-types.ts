/**
 * Onboarding Type Definitions for the Unstoppable Ecosystem (Medixly)
 */

export type UserRole = 'listener' | 'creator' | 'artist' | 'explorer';

export type AcquisitionSource =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'friend'
  | 'search'
  | 'discord'
  | 'other';

export type PlatformUsage =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'twitch'
  | 'twitter';

export type GenrePreference =
  | 'hiphop'
  | 'lofi'
  | 'electronic'
  | 'pop'
  | 'cinematic'
  | 'ambient'
  | 'rock'
  | 'rb'
  | 'country'
  | 'indie';

export type SfxIntensity = 'light' | 'moderate' | 'heavy';

export interface OnboardingPreferences {
  role: UserRole;
  acquisitionSource: AcquisitionSource;
  platforms: PlatformUsage[];
  genres: GenrePreference[];
  sfxNeeds: SfxIntensity;
  favoriteArtists: string[];
  completed: boolean;
  updatedAt?: number | string;
}

export interface UserAccountData {
  username: string;
  email: string;
  phone: string;
  dob: string;
  pfpUrl?: string;
  password?: string;
}

export type OnboardingStepNumber = 1 | 2 | 3 | 4 | 5;

export interface OnboardingState {
  currentStep: OnboardingStepNumber;
  account: UserAccountData;
  role: UserRole | null;
  acquisitionSource: AcquisitionSource | null;
  platforms: PlatformUsage[];
  genres: GenrePreference[];
  sfxNeeds: SfxIntensity;
  favoriteArtists: string[];
  isSubmitting: boolean;
  errorMessage: string | null;
  isGuestTrial: boolean;
  completed: boolean;
}
