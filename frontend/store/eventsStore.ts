import { create } from "zustand";
import { persist } from "zustand/middleware";
import { events as initialEvents, internalEvents as initialInternal, liveExams as initialLiveExams } from "@/lib/mock/events";
import type { Event, LiveExam } from "@/types";

export interface InternalEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  type: string;
  typeColor: string;
}

interface EventsState {
  events: Event[];
  internalEvents: InternalEvent[];
  liveExams: LiveExam[];
  addEvent: (ev: Event) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  addInternal: (ev: InternalEvent) => void;
  updateInternal: (id: string, data: Partial<InternalEvent>) => void;
  removeInternal: (id: string) => void;
  addLiveExam: (exam: LiveExam) => void;
  updateLiveExam: (id: string, data: Partial<LiveExam>) => void;
  removeLiveExam: (id: string) => void;
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: initialEvents,
      internalEvents: initialInternal,
      liveExams: initialLiveExams,
      addEvent: (ev) => set((s) => ({ events: [ev, ...s.events] })),
      updateEvent: (id, data) =>
        set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
      removeEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      addInternal: (ev) => set((s) => ({ internalEvents: [ev, ...s.internalEvents] })),
      updateInternal: (id, data) =>
        set((s) => ({
          internalEvents: s.internalEvents.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      removeInternal: (id) =>
        set((s) => ({ internalEvents: s.internalEvents.filter((e) => e.id !== id) })),
      addLiveExam: (exam) => set((s) => ({ liveExams: [exam, ...s.liveExams] })),
      updateLiveExam: (id, data) =>
        set((s) => ({
          liveExams: s.liveExams.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      removeLiveExam: (id) =>
        set((s) => ({ liveExams: s.liveExams.filter((e) => e.id !== id) })),
    }),
    { name: "uiu-events" }
  )
);
