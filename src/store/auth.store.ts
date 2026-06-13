import { create } from "zustand";
import type { AppRole } from "@/config/roles";
import type { UserProfile } from "@/types/profile";

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  nameAr?: string;
  role: AppRole;
  isVerified: boolean;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  redirectTo: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (v: boolean) => void;
  setRedirectTo: (path: string | null) => void;
  clearSession: () => void;
  signOutLocal: () => void;
  updateProfileLocal: (partial: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  redirectTo: null,

  setUser: (user) => {
    // When the authenticated user changes (account switch), immediately drop any
    // profile still held from the previous account. Otherwise client components
    // would render the old account's name/role during the gap before the new
    // profile is fetched. The current user's profile is set right after via
    // setProfile(). Same-user updates (role sync, token refresh) keep the profile.
    const prevProfile = get().profile;
    const profile =
      user && prevProfile && prevProfile.id !== user.id ? null : prevProfile;
    set({ user, profile, isAuthenticated: user !== null, isLoading: false });
  },

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  setRedirectTo: (redirectTo) => set({ redirectTo }),

  clearSession: () =>
    set({ user: null, profile: null, isAuthenticated: false, isLoading: false }),

  signOutLocal: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      redirectTo: null,
    }),

  updateProfileLocal: (partial) => {
    const current = get().profile;
    if (!current) return;
    set({ profile: { ...current, ...partial } });
  },
}));
