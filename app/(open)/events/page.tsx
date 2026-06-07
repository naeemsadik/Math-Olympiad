"use client";

import { useEventsStore } from "@/store/eventsStore";
import { MapPin, Calendar, ExternalLink, MessageSquare, BookOpen, Zap } from "lucide-react";

const typeColors: Record<string, string> = {
  IMO: "#d97706",
  BdMO: "#059669",
  AMC: "#d97706",
  INTERNAL: "#0891b2",
};

const typeBg: Record<string, string> = {
  IMO: "rgba(217, 119, 6,0.1)",
  BdMO: "rgba(5,150,105,0.1)",
  AMC: "rgba(217,119,6,0.1)",
  INTERNAL: "rgba(8,145,178,0.1)",
};

const internalTypeColors: Record<string, string> = {
  "MOCK SESSION": "#d97706",
  "DISCUSSION CLASS": "#0891b2",
  CHALLENGE: "#d97706",
};

const internalTypeBg: Record<string, string> = {
  "MOCK SESSION": "rgba(217, 119, 6,0.1)",
  "DISCUSSION CLASS": "rgba(8,145,178,0.1)",
  CHALLENGE: "rgba(217,119,6,0.1)",
};

export default function EventsPage() {
  const { events, internalEvents } = useEventsStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Events &amp; Competitions</h1>
        <p className="text-slate-500 text-sm mt-1">
          Compete at the highest level. Track upcoming olympiads and internal UIU events.
        </p>
      </div>

      {/* Hero banner */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          boxShadow: "0 8px 32px rgba(217,119,6,0.25)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#d97706]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#d97706]/10 rounded-full blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-white/70 font-medium mb-4">
            <Zap size={11} className="text-yellow-300" />
            Upcoming Competitions
          </div>
          <h2 className="font-heading text-4xl font-extrabold text-white leading-tight">
            Compete at the
            <br />
            <span className="text-amber-100">Highest Level.</span>
          </h2>
          <p className="text-white/60 text-sm mt-3 max-w-lg">
            Join international math competitions and internal UIU mock tests. Navigate the
            coordinate planes of excellence.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Olympiads */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-slate-900 text-xl">Upcoming Olympiads</h2>
          {events.map((event) => {
            const color = typeColors[event.type] ?? "#d97706";
            const bg = typeBg[event.type] ?? "rgba(217, 119, 6,0.1)";
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-5 space-y-3 transition-all hover:-translate-y-0.5"
                style={{
                  border: "1px solid rgba(15,23,42,0.07)",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(15,23,42,0.09), 0 0 0 1px ${color}25`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${color}25`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(15,23,42,0.07)";
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                      style={{ backgroundColor: bg, color }}
                    >
                      {event.type} — INTERNATIONAL
                    </span>
                    <h3 className="font-heading font-bold text-slate-900 mt-2">{event.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{event.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-slate-300" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-slate-300" /> {event.location}
                  </span>
                  {event.officialLink && (
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={11} className="text-slate-300" /> {new URL(event.officialLink).hostname}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1.5 gradient-orange text-white text-xs font-semibold px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-sm shadow-amber-500/20"
                  >
                    Register for Mock
                  </button>
                  <button className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium px-4 py-2 rounded-xl hover:bg-slate-200 transition-all">
                    <BookOpen size={11} /> View Syllabus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-slate-900 text-xl">Internal UIU Events</h2>
          <div
            className="bg-white rounded-2xl p-5 space-y-2"
            style={{
              border: "1px solid rgba(15,23,42,0.07)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
            }}
          >
            {internalEvents.map((ev) => {
              const color = internalTypeColors[ev.type] ?? "#d97706";
              const bg = internalTypeBg[ev.type] ?? "rgba(217, 119, 6,0.1)";
              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#d97706]/20 hover:bg-[#d97706]/[0.025] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md"
                        style={{ backgroundColor: bg, color }}
                      >
                        {ev.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900 font-semibold">{ev.title}</p>
                    <p className="text-xs text-slate-400">{ev.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500 font-medium">{ev.date}</p>
                    <p className="text-xs text-slate-400">{ev.time}</p>
                  </div>
                </div>
              );
            })}

            <button className="w-full flex items-center justify-center gap-2 bg-[#5865f2]/8 border border-[#5865f2]/20 text-[#5865f2] text-sm font-semibold py-3 rounded-xl hover:bg-[#5865f2]/12 transition-all mt-1">
              <MessageSquare size={14} /> Join Community Discord
            </button>
          </div>

          {/* Resource Library */}
          <div
            className="bg-white rounded-2xl p-5 relative overflow-hidden"
            style={{
              border: "1px solid rgba(15,23,42,0.07)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d97706]/5 rounded-full blur-2xl" />
            <div className="relative">
              <h3 className="font-heading font-bold text-slate-900 mb-1">Resource Library</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Master Euclidean geometry and Combinatorics. Curated books and practice problems.</p>
              <button className="mt-3 text-xs font-semibold text-[#d97706] hover:text-[#b45309] transition-colors flex items-center gap-1">
                Explore Assets →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
