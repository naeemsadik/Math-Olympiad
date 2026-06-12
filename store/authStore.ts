"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AbilityLevel, User, Tier, InstitutionType } from "@/types";

const mockStudent: User = {
  id: "u1",
  name: "Alex Mercer",
  email: "alex.mercer@uiu.ac.bd",
  role: "STUDENT",
  tier: "Advanced",
  institute: "UIU",
  department: "CSE",
  xp: 1242,
  streak: 42,
  level: "Grandmaster",
  institutionType: "University",
  classYear: "3rd Year",
  whatsapp: "",
  placementDone: true,
};

const mockAdmin: User = {
  id: "a1",
  name: "Faculty Admin",
  email: "admin@uiu.ac.bd",
  role: "ADMIN",
  tier: "Advanced",
  institute: "UIU",
  department: "CSE",
  xp: 0,
  streak: 0,
  level: "Admin",
  placementDone: true,
};

export const ADMIN_EMAIL = "admin@uiu.ac.bd";
export const ADMIN_PASSWORD = "UIUAdmin2024";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAsStudent: (
    email: string,
    name?: string,
    tier?: Tier,
    institute?: string,
    institutionType?: InstitutionType,
    classYear?: string,
    whatsapp?: string,
    dob?: string,
    placementDone?: boolean,
    diagnosticAbilityLevel?: AbilityLevel,
    diagnosticScore?: number,
    diagnosticCompletedAt?: string,
    diagnosticAttemptId?: string
  ) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginAsStudent: (
        email: string,
        name?: string,
        tier?: Tier,
        institute?: string,
        institutionType?: InstitutionType,
        classYear?: string,
        whatsapp?: string,
        dob?: string,
        placementDone?: boolean,
        diagnosticAbilityLevel?: AbilityLevel,
        diagnosticScore?: number,
        diagnosticCompletedAt?: string,
        diagnosticAttemptId?: string
      ) =>
        set({
          user: {
            ...mockStudent,
            email,
            name: name ?? email.split("@")[0],
            tier: tier ?? "Beginner",
            institute: institute ?? "",
            institutionType: institutionType ?? "School",
            classYear: classYear ?? "",
            whatsapp: whatsapp ?? "",
            dob: dob ?? "",
            placementDone: placementDone ?? false,
            diagnosticAbilityLevel,
            diagnosticScore,
            diagnosticCompletedAt,
            diagnosticAttemptId,
          },
          isAuthenticated: true,
        }),
      loginAsAdmin: () => set({ user: { ...mockAdmin, placementDone: true }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data: Partial<User>) =>
        set((s) => (s.user ? { user: { ...s.user, ...data } } : {})),
    }),
    {
      name: "uiu-auth",
      version: 4,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Partial<AuthState & { user: Partial<User> | null }>;
        if (version < 2 && state.user) {
          state.user.tier = state.user.tier ?? "Beginner";
          state.user.institute = state.user.institute ?? "UIU";
        }
        if (version < 3 && state.user) {
          // Existing users are treated as already placed — don't force them through placement
          state.user.placementDone = state.user.placementDone ?? true;
          state.user.institutionType = state.user.institutionType ?? "University";
          state.user.classYear = state.user.classYear ?? "";
          state.user.whatsapp = state.user.whatsapp ?? "";
        }
        if (version < 4 && state.user) {
          state.user.diagnosticAbilityLevel = state.user.diagnosticAbilityLevel ?? undefined;
          state.user.diagnosticScore = state.user.diagnosticScore ?? undefined;
          state.user.diagnosticCompletedAt = state.user.diagnosticCompletedAt ?? undefined;
          state.user.diagnosticAttemptId = state.user.diagnosticAttemptId ?? undefined;
        }
        return state as AuthState;
      },
    }
  )
);
