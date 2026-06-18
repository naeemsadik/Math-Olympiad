"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUsers, type AdminUser } from "@/lib/mock/users";

interface UsersState {
  users: AdminUser[];
  hydrated: boolean;
  setUsers: (users: AdminUser[]) => void;
  setHydrated: (hydrated: boolean) => void;
  addUser: (user: AdminUser) => void;
  removeUser: (id: string) => void;
  updateUser: (id: string, data: Partial<AdminUser>) => void;
  resetDiagnostic: (id: string) => void;
}

const mockIds = new Set(mockUsers.map((u) => u.id));

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: mockUsers,
      hydrated: false,
      setUsers: (users) => set({ users, hydrated: true }),
      setHydrated: (hydrated) => set({ hydrated }),
      addUser: (user) => set((s) => ({ users: [user, ...s.users] })),
      removeUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
      updateUser: (id, data) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) })),
      resetDiagnostic: (id) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  placementDone: false,
                  diagnosticAbilityLevel: undefined,
                  diagnosticScore: undefined,
                  diagnosticCompletedAt: undefined,
                  diagnosticAttemptId: undefined,
                }
              : u
          ),
        })),
    }),
    {
      name: "uiu-users",
      version: 6,
      partialize: (state) => ({ users: state.users }),
      migrate: (persisted: unknown) => {
        // v6: clear stale mock-only data so the admin list always hydrates from API.
        const old = persisted as { users?: AdminUser[] } | undefined;
        const signupUsers = (old?.users ?? []).filter((u) => !mockIds.has(u.id));
        return { users: [...signupUsers, ...mockUsers] };
      },
    }
  )
);
