export const ONBOARDING_STEPS_CONFIG = {
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
    state;
    listeners = [];
    constructor(initialState) {
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
    getState() {
        return { ...this.state };
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    notify() {
        const frozenState = this.getState();
        this.listeners.forEach(l => l(frozenState));
    }
    setStep(step) {
        if (step >= 1 && step <= 5) {
            this.state.currentStep = step;
            this.state.errorMessage = null;
            this.notify();
        }
    }
    nextStep() {
        if (this.state.currentStep < 5) {
            this.setStep((this.state.currentStep + 1));
            return true;
        }
        return false;
    }
    prevStep() {
        if (this.state.currentStep > 1) {
            this.setStep((this.state.currentStep - 1));
            return true;
        }
        return false;
    }
    setAccount(data) {
        this.state.account = { ...this.state.account, ...data };
        this.notify();
    }
    setRole(role) {
        this.state.role = role;
        this.notify();
    }
    setAcquisitionSource(source) {
        this.state.acquisitionSource = source;
        this.notify();
    }
    togglePlatform(platform) {
        const exists = this.state.platforms.includes(platform);
        if (exists) {
            this.state.platforms = this.state.platforms.filter(p => p !== platform);
        }
        else {
            this.state.platforms = [...this.state.platforms, platform];
        }
        this.notify();
    }
    toggleGenre(genre) {
        const exists = this.state.genres.includes(genre);
        if (exists) {
            this.state.genres = this.state.genres.filter(g => g !== genre);
        }
        else {
            this.state.genres = [...this.state.genres, genre];
        }
        this.notify();
    }
    setSfxNeeds(sfx) {
        this.state.sfxNeeds = sfx;
        this.notify();
    }
    toggleArtistOrVibe(item) {
        const trimmed = item.trim();
        if (!trimmed)
            return;
        const exists = this.state.favoriteArtists.includes(trimmed);
        if (exists) {
            this.state.favoriteArtists = this.state.favoriteArtists.filter(a => a !== trimmed);
        }
        else {
            this.state.favoriteArtists = [...this.state.favoriteArtists, trimmed];
        }
        this.notify();
    }
    setSubmitting(isSubmitting) {
        this.state.isSubmitting = isSubmitting;
        this.notify();
    }
    setError(error) {
        this.state.errorMessage = error;
        this.notify();
    }
    setGuestTrial(isGuest) {
        this.state.isGuestTrial = isGuest;
        this.notify();
    }
    complete() {
        this.state.completed = true;
        this.notify();
        return this.exportPreferences();
    }
    exportPreferences() {
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
    validateStep(step) {
        if (step === 1) {
            const { username, email, phone, dob } = this.state.account;
            if (!username || !username.trim())
                return { valid: false, error: 'Username is required.' };
            if (!email || !email.trim() || !email.includes('@'))
                return { valid: false, error: 'Valid email is required.' };
            if (!phone || !phone.trim())
                return { valid: false, error: 'Phone number is required.' };
            if (!dob || !dob.trim())
                return { valid: false, error: 'Date of birth is required.' };
            return { valid: true };
        }
        // Steps 2-5 are preference steps and can be skipped or proceed with defaults
        return { valid: true };
    }
}
