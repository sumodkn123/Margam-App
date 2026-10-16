// MARGAM — Authentication & Onboarding State Service
// Manages authenticated session, user registration registry, and onboarding completion status.
// Guarantees that returning users who have already signed up bypass the onboarding wizard.

export interface AuthUser {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
  isOnboardingComplete: boolean;
  registeredAt: string;
}

// Initial registered mock accounts (pre-seeded with current active users)
const INITIAL_REGISTERED_USERS: AuthUser[] = [
  {
    id: 'user_sumod_01',
    name: 'Sumod',
    phoneNumber: '+91 98470 12345',
    email: 'sumod.connect@margam.app',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isOnboardingComplete: true,
    registeredAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'user_demo_default',
    name: 'Sumod',
    phoneNumber: '+91 98765 43210',
    email: 'sumod.dev@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isOnboardingComplete: true,
    registeredAt: '2025-01-20T00:00:00.000Z',
  },
];

class AuthService {
  private registeredUsers: Map<string, AuthUser> = new Map();
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  constructor() {
    // Seed initial users by id, clean phone, and lowercased email
    INITIAL_REGISTERED_USERS.forEach((u) => {
      this.registerInternal(u);
    });
  }

  private normalizeKey(val?: string): string {
    if (!val) return '';
    // Normalize phone numbers (strip spaces, dashes) or lowercase emails
    return val.trim().toLowerCase().replace(/[\s-]/g, '');
  }

  private registerInternal(user: AuthUser) {
    this.registeredUsers.set(user.id, user);
    if (user.phoneNumber) {
      this.registeredUsers.set(this.normalizeKey(user.phoneNumber), user);
      // Also normalize without country code if starts with +91
      const raw = user.phoneNumber.replace(/[\s-]/g, '');
      if (raw.startsWith('+91')) {
        this.registeredUsers.set(raw.slice(3), user);
      }
    }
    if (user.email) {
      this.registeredUsers.set(this.normalizeKey(user.email), user);
    }
  }

  public subscribe(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentUser);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  /**
   * Check if a given phone number or email is already registered in Margam
   */
  public isRegistered(identifier: string): boolean {
    const key = this.normalizeKey(identifier);
    if (this.registeredUsers.has(key)) return true;
    // Check without country code
    if (key.startsWith('+91')) {
      return this.registeredUsers.has(key.slice(3));
    }
    return false;
  }

  /**
   * Check if the user associated with this identifier has already completed onboarding
   */
  public hasCompletedOnboarding(identifier: string): boolean {
    const key = this.normalizeKey(identifier);
    let user = this.registeredUsers.get(key);
    if (!user && key.startsWith('+91')) {
      user = this.registeredUsers.get(key.slice(3));
    }
    return Boolean(user?.isOnboardingComplete);
  }

  /**
   * Sign In an existing user
   */
  public signIn(identifier: string): { success: boolean; user: AuthUser; isNewUser: boolean } {
    const key = this.normalizeKey(identifier);
    let user = this.registeredUsers.get(key);
    if (!user && key.startsWith('+91')) {
      user = this.registeredUsers.get(key.slice(3));
    }

    if (!user) {
      // If user does not exist in registry, create returning session with onboarding=true
      // so sign-in flow never gets trapped in onboarding
      user = {
        id: `user_${Date.now()}`,
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Member',
        phoneNumber: identifier.includes('@') ? undefined : identifier,
        email: identifier.includes('@') ? identifier : undefined,
        isOnboardingComplete: true,
        registeredAt: new Date().toISOString(),
      };
      this.registerInternal(user);
    }

    this.currentUser = user;
    this.notify();
    return { success: true, user, isNewUser: false };
  }

  /**
   * Start sign-up for a new user
   */
  public signUp(identifier: string): { success: boolean; user: AuthUser; isAlreadyRegistered: boolean } {
    const isReg = this.isRegistered(identifier);
    if (isReg) {
      const existing = this.signIn(identifier);
      return { success: true, user: existing.user, isAlreadyRegistered: true };
    }

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: 'New Member',
      phoneNumber: identifier.includes('@') ? undefined : identifier,
      email: identifier.includes('@') ? identifier : undefined,
      isOnboardingComplete: false,
      registeredAt: new Date().toISOString(),
    };

    this.registerInternal(newUser);
    this.currentUser = newUser;
    this.notify();
    return { success: true, user: newUser, isAlreadyRegistered: false };
  }

  /**
   * Mark onboarding as complete for a user after finishing the wizard
   */
  public completeOnboarding(identifier?: string, profileData?: any): void {
    let target = this.currentUser;
    if (identifier) {
      const key = this.normalizeKey(identifier);
      target = this.registeredUsers.get(key) || this.currentUser;
    }

    if (target) {
      target.isOnboardingComplete = true;
      if (profileData?.firstName) {
        target.name = profileData.firstName;
      }
      this.registerInternal(target);
      this.currentUser = target;
      this.notify();
    } else {
      const freshUser: AuthUser = {
        id: `usr_${Date.now()}`,
        name: profileData?.firstName || 'Sumod',
        phoneNumber: identifier?.includes('@') ? undefined : identifier,
        email: identifier?.includes('@') ? identifier : undefined,
        isOnboardingComplete: true,
        registeredAt: new Date().toISOString(),
      };
      this.registerInternal(freshUser);
      this.currentUser = freshUser;
      this.notify();
    }
  }

  /**
   * Sign out current user
   */
  public signOut(): void {
    this.currentUser = null;
    this.notify();
  }

  /**
   * Get currently logged-in user
   */
  public getCurrentUser(): AuthUser | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  /**
   * Check if session is currently active
   */
  public isAuthenticated(): boolean {
    return Boolean(this.currentUser && this.currentUser.isOnboardingComplete);
  }
}

export const authService = new AuthService();
