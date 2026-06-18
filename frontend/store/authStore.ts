"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/types";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  institutionType: "School" | "College" | "University" | "Graduate";
  classYear?: string;
  institute: string;
  university?: string;
  department?: string;
  dob?: string;
  whatsapp?: string;
  gender?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Mutating actions
  login: (email: string, password: string, role?: "admin" | "student" | "faculty") => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User>;
  updateProfile: (patch: Partial<User>) => Promise<User>;

  // Local helpers (used when API is not configured, e.g. pure-mock dev)
  loginAsStudent: (email: string, name?: string) => void;
  loginAsAdmin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password, role) => {
        const res = await api.auth.login({ email, password, role });
        set({ user: res.user, token: res.token, isAuthenticated: true });
        return res.user;
      },

      register: async (payload) => {
        const res = await api.auth.register(payload);
        set({ user: res.user, token: res.token, isAuthenticated: true });
        return res.user;
      },

      logout: async () => {
        // Always clear locally, even if the network call fails.
        set({ user: null, token: null, isAuthenticated: false });
        if (api.enabled) {
          try {
            await api.auth.logout();
          } catch (err) {
            if (!(err instanceof ApiError) || err.status !== 401) {
              // 401 means token was already invalid — that's fine. Re-throw anything else.
              throw err;
            }
          }
        }
      },

      fetchMe: async () => {
        const user = await api.auth.me();
        set({ user, isAuthenticated: true });
        return user;
      },

      updateProfile: async (patch) => {
        const user = await api.auth.updateProfile(patch);
        set({ user });
        return user;
      },

      // Mock-mode fallbacks (no API configured). These are kept so that
      // running the frontend with NEXT_PUBLIC_API_URL unset still works.
      loginAsStudent: (email, name) => {
        set({
          user: {
            id: "u1",
            name: name ?? email.split("@")[0],
            email,
            role: "STUDENT",
            tier: "Beginner",
            institute: "UIU",
            xp: 0,
            streak: 0,
            level: "Newcomer",
            placementDone: false,
          },
          token: "mock-token",
          isAuthenticated: true,
        });
      },

      loginAsAdmin: () => {
        set({
          user: {
            id: "a1",
            name: "Faculty Admin",
            email: "admin@uiu.ac.bd",
            role: "ADMIN",
            tier: "Advanced",
            institute: "UIU",
            xp: 0,
            streak: 0,
            level: "Admin",
            placementDone: true,
          },
          token: "mock-token",
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "uiu-auth",
      version: 5,
      migrate: (persisted: unknown, version: number) => {
        const state = (persisted ?? {}) as Partial<AuthState> & { user?: Partial<User> | null };

        // v4 → v5: introduce `token`. If migrating from an older version
        // and there's a user, we keep them but force a re-login (clear token).
        if (version < 5) {
          return {
            user: (state.user as User) ?? null,
            token: null,
            isAuthenticated: false,
          };
        }

        return state as AuthState;
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Re-export for legacy callers. The frontend no longer relies on these constants
// (admin is now created via the UserSeeder), but the export is kept so imports
// don't break until consumers are migrated.
export const ADMIN_EMAIL = "admin@uiu.ac.bd";
export const ADMIN_PASSWORD = "UIUAdmin2024";

// Helper for consumers: read the current token synchronously (e.g. for non-React code).
export function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}
