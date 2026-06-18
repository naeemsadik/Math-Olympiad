import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockNotices, type Notice } from "@/lib/mock/notices";

interface NoticesState {
  notices: Notice[];
  setNotices: (notices: Notice[]) => void;
  addNotice: (notice: Notice) => void;
  updateNotice: (id: string, data: Partial<Notice>) => void;
  removeNotice: (id: string) => void;
}

const mockIds = new Set(mockNotices.map((n) => n.id));

export const useNoticesStore = create<NoticesState>()(
  persist(
    (set) => ({
      notices: mockNotices,
      setNotices: (notices) => set({ notices }),
      addNotice: (notice) => set((s) => ({ notices: [notice, ...s.notices] })),
      updateNotice: (id, data) =>
        set((s) => ({ notices: s.notices.map((n) => (n.id === id ? { ...n, ...data } : n)) })),
      removeNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),
    }),
    {
      name: "uiu-notices",
      version: 2,
      migrate: (persisted: unknown) => {
        const old = persisted as { notices?: Notice[] } | undefined;
        // v2: drop cached mock data so we always rehydrate from API.
        const customNotices = (old?.notices ?? []).filter((n) => !mockIds.has(n.id));
        return { notices: [...customNotices, ...mockNotices] };
      },
    }
  )
);
