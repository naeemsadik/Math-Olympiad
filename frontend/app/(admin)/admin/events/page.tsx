"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import {
  Plus, Trash2, Pencil, X, Check, Search, Calendar,
  MapPin, ExternalLink, Shield, Clock, Radio,
} from "lucide-react";

const statusColors: Record<string, string> = {
  upcoming: "#d97706",
  open: "#10b981",
  scheduled: "#0891b2",
  live: "#ef4444",
  closed: "#475569",
  completed: "#475569",
  ended: "#475569",
  cancelled: "#475569",
};

interface OlympiadEvent {
  id: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  registrationUrl: string;
  status: "upcoming" | "open" | "closed" | "completed";
  level: string;
  isFeatured: boolean;
  tags: string[];
}

interface InternalSession {
  id: string;
  title: string;
  topic: string;
  speaker: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  capacity: number;
  registered: number;
}

interface LiveExamRow {
  id: string;
  title: string;
  description: string;
  testId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
  capacity: number;
  startsAt: string;
  endsAt: string;
  timeLimitSeconds: number;
  tier: string;
}

type Tab = "olympiad" | "internal" | "live-exam";

const blankOlympiad = (): Partial<OlympiadEvent> => ({
  title: "", description: "", venue: "", city: "", country: "",
  startDate: "", endDate: "", registrationDeadline: "", registrationUrl: "",
  status: "upcoming", level: "Beginner", isFeatured: false, tags: [],
});

const blankInternal = (): Partial<InternalSession> => ({
  title: "", topic: "", speaker: "", scheduledAt: "", durationMinutes: 60,
  meetingUrl: "", status: "scheduled", capacity: 50,
});

const blankLive = (): Partial<LiveExamRow> => ({
  title: "", description: "", testId: "", scheduledAt: "",
  durationMinutes: 60, status: "scheduled", capacity: 100,
  timeLimitSeconds: 60,
});

export default function AdminEventsPage() {
  const [tab, setTab] = useState<Tab>("olympiad");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [olympiad, setOlympiad] = useState<OlympiadEvent[]>([]);
  const [internal, setInternal] = useState<InternalSession[]>([]);
  const [live, setLive] = useState<LiveExamRow[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [olForm, setOlForm] = useState<Partial<OlympiadEvent>>(blankOlympiad());
  const [inForm, setInForm] = useState<Partial<InternalSession>>(blankInternal());
  const [leForm, setLeForm] = useState<Partial<LiveExamRow>>(blankLive());

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ol, ints, liv] = await Promise.all([
        api.admin.events.olympiad.list(),
        api.admin.events.internal.list(),
        api.admin.events.live.list(),
      ]);
      const unwrap = <T,>(r: unknown): T[] => Array.isArray(r) ? r as T[] : ((r as { data?: T[] })?.data ?? []) as T[];
      setOlympiad(unwrap<OlympiadEvent>(ol));
      setInternal(unwrap<InternalSession>(ints));
      setLive(unwrap<LiveExamRow>(liv));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load events.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const openCreate = (kind: Tab) => {
    setEditId(null);
    if (kind === "olympiad") setOlForm(blankOlympiad());
    else if (kind === "internal") setInForm(blankInternal());
    else setLeForm(blankLive());
    setTab(kind);
    setShowForm(true);
  };

  const openEditOlympiad = (e: OlympiadEvent) => {
    setOlForm({ ...blankOlympiad(), ...e });
    setEditId(e.id);
    setTab("olympiad");
    setShowForm(true);
  };
  const openEditInternal = (e: InternalSession) => {
    setInForm({ ...blankInternal(), ...e });
    setEditId(e.id);
    setTab("internal");
    setShowForm(true);
  };
  const openEditLive = (e: LiveExamRow) => {
    setLeForm({ ...blankLive(), ...e });
    setEditId(e.id);
    setTab("live-exam");
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (tab === "olympiad") {
        if (editId) await api.admin.events.olympiad.update(editId, olForm as unknown as Record<string, unknown>);
        else await api.admin.events.olympiad.create(olForm as unknown as Record<string, unknown>);
      } else if (tab === "internal") {
        if (editId) await api.admin.events.internal.update(editId, inForm as unknown as Record<string, unknown>);
        else await api.admin.events.internal.create(inForm as unknown as Record<string, unknown>);
      } else {
        if (editId) await api.admin.events.live.update(editId, leForm as unknown as Record<string, unknown>);
        else await api.admin.events.live.create(leForm as unknown as Record<string, unknown>);
      }
      await load();
      setShowForm(false);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to save event.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      if (tab === "olympiad") await api.admin.events.olympiad.remove(deleteId);
      else if (tab === "internal") await api.admin.events.internal.remove(deleteId);
      else await api.admin.events.live.remove(deleteId);
      await load();
      setDeleteId(null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to delete event.";
      setError(msg);
    }
  };

  const newLabel = tab === "olympiad" ? "New Event" : tab === "internal" ? "New Session" : "New Live Exam";
  const onCreate = () => openCreate(tab);

  const filteredOl = olympiad.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  const filteredIn = internal.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  const filteredLe = live.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Shield size={24} className="text-[#d97706]" /> Events Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create, edit and manage olympiad events, internal sessions, and live exams.</p>
        </div>
        <button onClick={onCreate}
          className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
          <Plus size={16} /> {newLabel}
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {([["olympiad", "Olympiad Events"], ["internal", "Internal Sessions"], ["live-exam", "Live Exams"]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setShowForm(false); setDeleteId(null); }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${tab === t ? "gradient-orange text-white" : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-52 transition-all" />
        </div>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">
              {editId ? "Edit" : "New"} {tab === "olympiad" ? "Olympiad Event" : tab === "internal" ? "Internal Session" : "Live Exam"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          {tab === "olympiad" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title *</label>
                  <input value={olForm.title ?? ""} onChange={(e) => setOlForm({ ...olForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Status *</label>
                  <select value={olForm.status ?? "upcoming"} onChange={(e) => setOlForm({ ...olForm, status: e.target.value as OlympiadEvent["status"] })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {["upcoming", "open", "closed", "completed"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
                <textarea value={olForm.description ?? ""} onChange={(e) => setOlForm({ ...olForm, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Venue</label>
                  <input value={olForm.venue ?? ""} onChange={(e) => setOlForm({ ...olForm, venue: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">City</label>
                  <input value={olForm.city ?? ""} onChange={(e) => setOlForm({ ...olForm, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Country</label>
                  <input value={olForm.country ?? ""} onChange={(e) => setOlForm({ ...olForm, country: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Start Date *</label>
                  <input type="date" value={olForm.startDate?.split("T")[0] ?? ""} onChange={(e) => setOlForm({ ...olForm, startDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">End Date</label>
                  <input type="date" value={olForm.endDate?.split("T")[0] ?? ""} onChange={(e) => setOlForm({ ...olForm, endDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Registration Deadline</label>
                  <input type="date" value={olForm.registrationDeadline?.split("T")[0] ?? ""} onChange={(e) => setOlForm({ ...olForm, registrationDeadline: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Registration URL</label>
                  <input value={olForm.registrationUrl ?? ""} onChange={(e) => setOlForm({ ...olForm, registrationUrl: e.target.value })} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Level</label>
                  <select value={olForm.level ?? "Beginner"} onChange={(e) => setOlForm({ ...olForm, level: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {["Beginner", "Intermediate", "Advanced", "Elite"].map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "internal" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title *</label>
                  <input value={inForm.title ?? ""} onChange={(e) => setInForm({ ...inForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Topic *</label>
                  <input value={inForm.topic ?? ""} onChange={(e) => setInForm({ ...inForm, topic: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Speaker *</label>
                  <input value={inForm.speaker ?? ""} onChange={(e) => setInForm({ ...inForm, speaker: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Status *</label>
                  <select value={inForm.status ?? "scheduled"} onChange={(e) => setInForm({ ...inForm, status: e.target.value as InternalSession["status"] })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {["scheduled", "live", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Scheduled At *</label>
                  <input type="datetime-local" value={inForm.scheduledAt?.slice(0, 16) ?? ""} onChange={(e) => setInForm({ ...inForm, scheduledAt: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 [color-scheme:light]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Duration (min) *</label>
                  <input type="number" min={10} value={inForm.durationMinutes ?? 60} onChange={(e) => setInForm({ ...inForm, durationMinutes: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Capacity</label>
                  <input type="number" min={0} value={inForm.capacity ?? 0} onChange={(e) => setInForm({ ...inForm, capacity: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Meeting URL</label>
                <input value={inForm.meetingUrl ?? ""} onChange={(e) => setInForm({ ...inForm, meetingUrl: e.target.value })} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
              </div>
            </div>
          )}

          {tab === "live-exam" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title *</label>
                  <input value={leForm.title ?? ""} onChange={(e) => setLeForm({ ...leForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Status *</label>
                  <select value={leForm.status ?? "scheduled"} onChange={(e) => setLeForm({ ...leForm, status: e.target.value as LiveExamRow["status"] })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {["scheduled", "live", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
                <textarea value={leForm.description ?? ""} onChange={(e) => setLeForm({ ...leForm, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Scheduled At *</label>
                  <input type="datetime-local" value={leForm.scheduledAt?.slice(0, 16) ?? ""} onChange={(e) => setLeForm({ ...leForm, scheduledAt: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 [color-scheme:light]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Duration (min) *</label>
                  <input type="number" min={10} value={leForm.durationMinutes ?? 60} onChange={(e) => setLeForm({ ...leForm, durationMinutes: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Capacity</label>
                  <input type="number" min={0} value={leForm.capacity ?? 0} onChange={(e) => setLeForm({ ...leForm, capacity: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Test ID (optional)</label>
                  <input type="number" min={1} value={leForm.testId ?? ""} onChange={(e) => setLeForm({ ...leForm, testId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Time Limit (s)</label>
                  <input type="number" min={60} value={leForm.timeLimitSeconds ?? 60} onChange={(e) => setLeForm({ ...leForm, timeLimitSeconds: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50">
              <Check size={15} /> {saving ? "Saving…" : editId ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Are you sure you want to <span className="text-red-400 font-semibold">delete</span> this event?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {tab === "olympiad" && (
        <div className="space-y-3">
          {loading ? <p className="text-center text-slate-400 text-sm py-10">Loading…</p> : filteredOl.length === 0 ? <p className="text-center text-slate-400 text-sm py-10">No olympiad events found.</p> : filteredOl.map((ev) => {
            const color = statusColors[ev.status] ?? "#d97706";
            return (
              <div key={ev.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase" style={{ backgroundColor: `${color}20`, color }}>{ev.status}</span>
                    {ev.level && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{ev.level}</span>}
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{ev.title}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {ev.startDate && <span className="flex items-center gap-1.5"><Calendar size={11} /> {new Date(ev.startDate).toLocaleDateString()}</span>}
                    {ev.venue && <span className="flex items-center gap-1.5"><MapPin size={11} /> {[ev.venue, ev.city, ev.country].filter(Boolean).join(", ")}</span>}
                    {ev.registrationUrl && <a href={ev.registrationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#d97706]"><ExternalLink size={11} /> Register</a>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditOlympiad(ev)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => { setDeleteId(ev.id); setTab("olympiad"); }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {!loading && <p className="text-xs text-slate-400 text-center">{filteredOl.length} of {olympiad.length} events</p>}
        </div>
      )}

      {tab === "internal" && (
        <div className="space-y-3">
          {loading ? <p className="text-center text-slate-400 text-sm py-10">Loading…</p> : filteredIn.length === 0 ? <p className="text-center text-slate-400 text-sm py-10">No internal sessions found.</p> : filteredIn.map((ev) => {
            const color = statusColors[ev.status] ?? "#d97706";
            return (
              <div key={ev.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}25`, color }}>{ev.status}</span>
                    <span className="text-xs text-slate-400">{ev.topic}</span>
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{ev.title}</p>
                  <p className="text-xs text-slate-500">Speaker: {ev.speaker}</p>
                  <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
                    {ev.scheduledAt && <span className="flex items-center gap-1.5"><Calendar size={11} /> {new Date(ev.scheduledAt).toLocaleString()}</span>}
                    <span className="flex items-center gap-1.5"><Clock size={11} /> {ev.durationMinutes} min</span>
                    <span>Capacity: {ev.registered}/{ev.capacity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditInternal(ev)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => { setDeleteId(ev.id); setTab("internal"); }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {!loading && <p className="text-xs text-slate-400 text-center">{filteredIn.length} of {internal.length} sessions</p>}
        </div>
      )}

      {tab === "live-exam" && (
        <div className="space-y-3">
          {loading ? <p className="text-center text-slate-400 text-sm py-10">Loading…</p> : filteredLe.length === 0 ? <p className="text-center text-slate-400 text-sm py-10">No live exams found.</p> : filteredLe.map((ex) => {
            const color = statusColors[ex.status] ?? "#d97706";
            return (
              <div key={ex.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: `${color}20`, color }}>
                      <Radio size={10} /> {ex.status}
                    </span>
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{ex.title}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{ex.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {ex.scheduledAt && <span className="flex items-center gap-1.5"><Calendar size={11} /> {new Date(ex.scheduledAt).toLocaleString()}</span>}
                    <span className="flex items-center gap-1.5"><Clock size={11} /> {ex.durationMinutes} min</span>
                    {ex.testId && <span>Test #{ex.testId}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditLive(ex)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => { setDeleteId(ex.id); setTab("live-exam"); }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {!loading && <p className="text-xs text-slate-400 text-center">{filteredLe.length} of {live.length} live exams</p>}
        </div>
      )}
    </div>
  );
}