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

  setUser: (user) =>
    set({ user, isAuthenticated: user !== null, isLoading: false }),

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
