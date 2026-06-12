import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockUsers, type AdminUser } from "@/lib/mock/users";

interface UsersState {
  users: AdminUser[];
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
      version: 5,
      migrate: (persisted: unknown) => {
        // Keep real signup users (not in mock), refresh all mock data
        const old = persisted as { users?: AdminUser[] } | undefined;
        const signupUsers = (old?.users ?? []).filter((u) => !mockIds.has(u.id));
        return { users: [...signupUsers, ...mockUsers] };
      },
    }
  )
);
