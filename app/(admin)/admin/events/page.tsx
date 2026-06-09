"use client";

import { useState } from "react";
import { useEventsStore, type InternalEvent } from "@/store/eventsStore";
import type { Event, OlympiadType, LiveExam, Tier } from "@/types";
import {
  Plus, Trash2, Pencil, X, Check, Search, Calendar,
  MapPin, ExternalLink, Shield, Clock, Radio,
} from "lucide-react";

const typeColors: Record<string, string> = {
  IMO: "#d97706", BdMO: "#10b981", AMC: "#f59e0b", INTERNAL: "#0891b2",
};
const internalTypeColors: Record<string, string> = {
  "MOCK SESSION": "#d97706", "DISCUSSION CLASS": "#0891b2", CHALLENGE: "#f59e0b",
};
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };
const olympiadTypes: OlympiadType[] = ["IMO", "BdMO", "AMC", "INTERNAL"];
const internalTypes = ["MOCK SESSION", "DISCUSSION CLASS", "CHALLENGE"];
const internalColorOptions = ["violet", "blue", "gold", "green", "red"];
const tiers: Tier[] = ["Beginner", "Intermediate", "Advanced"];
const topicList = ["algebra", "combinatorics", "number-theory", "geometry", "inequalities", "mathematical-logic"];

type Tab = "olympiad" | "internal" | "live-exam";

const blankEvent = (): Omit<Event, "id"> => ({
  title: "", type: "BdMO", date: "", location: "", description: "",
  isInternal: false, officialLink: "", registrationLink: "",
});

const blankInternal = (): Omit<InternalEvent, "id"> => ({
  title: "", subtitle: "", date: "", time: "", type: "MOCK SESSION", typeColor: "violet",
});

const blankLiveExam = (): Omit<LiveExam, "id" | "createdAt"> => ({
  title: "", description: "", tier: "Intermediate", scheduledAt: "",
  duration: 60, topicId: "number-theory", testId: "", questionCount: 10,
  status: "upcoming",
});

export default function AdminEventsPage() {
  const {
    events, internalEvents, liveExams,
    addEvent, updateEvent, removeEvent,
    addInternal, updateInternal, removeInternal,
    addLiveExam, updateLiveExam, removeLiveExam,
  } = useEventsStore();

  const [tab, setTab] = useState<Tab>("olympiad");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [evForm, setEvForm] = useState(blankEvent());
  const [intForm, setIntForm] = useState(blankInternal());
  const [leForm, setLeForm] = useState(blankLiveExam());

  const openCreateOlympiad = () => { setEvForm(blankEvent()); setEditId(null); setShowForm(true); setTab("olympiad"); };
  const openCreateInternal = () => { setIntForm(blankInternal()); setEditId(null); setShowForm(true); setTab("internal"); };
  const openCreateLiveExam = () => { setLeForm(blankLiveExam()); setEditId(null); setShowForm(true); setTab("live-exam"); };

  const openEditOlympiad = (e: Event) => {
    setEvForm({ title: e.title, type: e.type, date: e.date, location: e.location, description: e.description, isInternal: e.isInternal, officialLink: e.officialLink, registrationLink: e.registrationLink });
    setEditId(e.id); setShowForm(true); setTab("olympiad");
  };
  const openEditInternal = (e: InternalEvent) => {
    setIntForm({ title: e.title, subtitle: e.subtitle, date: e.date, time: e.time, type: e.type, typeColor: e.typeColor });
    setEditId(e.id); setShowForm(true); setTab("internal");
  };
  const openEditLiveExam = (e: LiveExam) => {
    const localDt = new Date(e.scheduledAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    const localStr = `${localDt.getFullYear()}-${pad(localDt.getMonth() + 1)}-${pad(localDt.getDate())}T${pad(localDt.getHours())}:${pad(localDt.getMinutes())}`;
    setLeForm({ title: e.title, description: e.description, tier: e.tier, scheduledAt: localStr, duration: e.duration, topicId: e.topicId, testId: e.testId ?? "", questionCount: e.questionCount, status: e.status });
    setEditId(e.id); setShowForm(true); setTab("live-exam");
  };

  const saveOlympiad = () => {
    if (!evForm.title.trim()) return;
    if (editId) { updateEvent(editId, evForm); }
    else { addEvent({ id: `ev-${Date.now()}`, ...evForm }); }
    setShowForm(false);
  };
  const saveInternal = () => {
    if (!intForm.title.trim()) return;
    if (editId) { updateInternal(editId, intForm); }
    else { addInternal({ id: `int-${Date.now()}`, ...intForm }); }
    setShowForm(false);
  };
  const saveLiveExam = () => {
    if (!leForm.title.trim() || !leForm.scheduledAt) return;
    const isoAt = new Date(leForm.scheduledAt).toISOString();
    const payload = { ...leForm, scheduledAt: isoAt, createdAt: new Date().toISOString() };
    if (editId) { updateLiveExam(editId, payload); }
    else { addLiveExam({ id: `le-${Date.now()}`, ...payload }); }
    setShowForm(false);
  };

  const doDelete = () => {
    if (!deleteId) return;
    if (tab === "olympiad") removeEvent(deleteId);
    else if (tab === "internal") removeInternal(deleteId);
    else removeLiveExam(deleteId);
    setDeleteId(null);
  };

  const filteredEvents = events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  const filteredInternal = internalEvents.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  const filteredLiveExams = liveExams.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  const newLabel = tab === "olympiad" ? "New Event" : tab === "internal" ? "New Session" : "New Live Exam";
  const onCreate = tab === "olympiad" ? openCreateOlympiad : tab === "internal" ? openCreateInternal : openCreateLiveExam;

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {([["olympiad", "Olympiad Events"], ["internal", "Internal Sessions"], ["live-exam", "Live Exams"]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setShowForm(false); }}
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

      {/* Create / Edit Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">
              {editId ? "Edit" : "New"} {tab === "olympiad" ? "Olympiad Event" : tab === "internal" ? "Internal Session" : "Live Exam"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          {tab === "olympiad" && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title *</label>
                  <input value={evForm.title} onChange={(e) => setEvForm({ ...evForm, title: e.target.value })}
                    placeholder="e.g. International Mathematical Olympiad"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Type</label>
                  <select value={evForm.type} onChange={(e) => setEvForm({ ...evForm, type: e.target.value as OlympiadType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {olympiadTypes.map((t) => <option key={t} value={t} >{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Date</label>
                  <input value={evForm.date} onChange={(e) => setEvForm({ ...evForm, date: e.target.value })}
                    placeholder="e.g. July 11-22, 2024"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Location</label>
                  <input value={evForm.location} onChange={(e) => setEvForm({ ...evForm, location: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
                <textarea value={evForm.description} onChange={(e) => setEvForm({ ...evForm, description: e.target.value })}
                  rows={2} placeholder="Brief description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Official Link</label>
                  <input value={evForm.officialLink ?? ""} onChange={(e) => setEvForm({ ...evForm, officialLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Registration Link</label>
                  <input value={evForm.registrationLink ?? ""} onChange={(e) => setEvForm({ ...evForm, registrationLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
              </div>
            </>
          )}

          {tab === "internal" && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title *</label>
                  <input value={intForm.title} onChange={(e) => setIntForm({ ...intForm, title: e.target.value })}
                    placeholder="e.g. UIU Grand Mock 05"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Subtitle</label>
                  <input value={intForm.subtitle} onChange={(e) => setIntForm({ ...intForm, subtitle: e.target.value })}
                    placeholder="e.g. Topic: Combinatorics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Date</label>
                  <input value={intForm.date} onChange={(e) => setIntForm({ ...intForm, date: e.target.value })}
                    placeholder="e.g. Sat, 21 Oct"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Time</label>
                  <input value={intForm.time} onChange={(e) => setIntForm({ ...intForm, time: e.target.value })}
                    placeholder="e.g. 3:00 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Type</label>
                  <select value={intForm.type} onChange={(e) => setIntForm({ ...intForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {internalTypes.map((t) => <option key={t} value={t} >{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Color</label>
                  <select value={intForm.typeColor} onChange={(e) => setIntForm({ ...intForm, typeColor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {internalColorOptions.map((c) => <option key={c} value={c} >{c}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {tab === "live-exam" && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title *</label>
                  <input value={leForm.title} onChange={(e) => setLeForm({ ...leForm, title: e.target.value })}
                    placeholder="e.g. Monthly Olympiad — May"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Tier</label>
                  <select value={leForm.tier} onChange={(e) => setLeForm({ ...leForm, tier: e.target.value as Tier })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {tiers.map((t) => <option key={t} value={t} >{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
                <textarea value={leForm.description} onChange={(e) => setLeForm({ ...leForm, description: e.target.value })}
                  rows={2} placeholder="Brief description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Scheduled At *</label>
                  <input type="datetime-local" value={leForm.scheduledAt} onChange={(e) => setLeForm({ ...leForm, scheduledAt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all [color-scheme:light]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Duration (min)</label>
                  <input type="number" min={10} value={leForm.duration} onChange={(e) => setLeForm({ ...leForm, duration: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Questions</label>
                  <input type="number" min={1} value={leForm.questionCount} onChange={(e) => setLeForm({ ...leForm, questionCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Topic</label>
                  <select value={leForm.topicId} onChange={(e) => setLeForm({ ...leForm, topicId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {topicList.map((t) => <option key={t} value={t} >{t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Status</label>
                  <select value={leForm.status} onChange={(e) => setLeForm({ ...leForm, status: e.target.value as LiveExam["status"] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                    {(["upcoming", "live", "ended"] as LiveExam["status"][]).map((s) => <option key={s} value={s} >{s}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button
              onClick={tab === "olympiad" ? saveOlympiad : tab === "internal" ? saveInternal : saveLiveExam}
              disabled={tab === "olympiad" ? !evForm.title.trim() : tab === "internal" ? !intForm.title.trim() : (!leForm.title.trim() || !leForm.scheduledAt)}
              className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
              <Check size={15} /> {editId ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Are you sure you want to <span className="text-red-400 font-semibold">delete</span> this event?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Olympiad Events List */}
      {tab === "olympiad" && (
        <div className="space-y-3">
          {filteredEvents.map((ev) => {
            const color = typeColors[ev.type] ?? "#d97706";
            return (
              <div key={ev.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase"
                      style={{ backgroundColor: `${color}20`, color }}>{ev.type}</span>
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{ev.title}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar size={11} /> {ev.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={11} /> {ev.location}</span>
                    {ev.officialLink && (
                      <span className="flex items-center gap-1.5"><ExternalLink size={11} /> {ev.officialLink}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditOlympiad(ev)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => { setDeleteId(ev.id); setTab("olympiad"); }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {filteredEvents.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No olympiad events found.</p>}
          <p className="text-xs text-slate-400 text-center">{filteredEvents.length} of {events.length} events</p>
        </div>
      )}

      {/* Internal Sessions List */}
      {tab === "internal" && (
        <div className="space-y-3">
          {filteredInternal.map((ev) => {
            const color = internalTypeColors[ev.type] ?? "#d97706";
            return (
              <div key={ev.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${color}25`, color }}>{ev.type}</span>
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{ev.title}</p>
                  <p className="text-xs text-slate-400">{ev.subtitle}</p>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar size={11} /> {ev.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} /> {ev.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditInternal(ev)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => { setDeleteId(ev.id); setTab("internal"); }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {filteredInternal.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No internal sessions found.</p>}
          <p className="text-xs text-slate-400 text-center">{filteredInternal.length} of {internalEvents.length} sessions</p>
        </div>
      )}

      {/* Live Exams List */}
      {tab === "live-exam" && (
        <div className="space-y-3">
          {filteredLiveExams.map((ex) => {
            const tc = tierColors[ex.tier];
            const statusColor = ex.status === "live" ? "#10b981" : ex.status === "upcoming" ? "#d97706" : "#475569";
            const dt = new Date(ex.scheduledAt);
            return (
              <div key={ex.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: `${tc}18`, color: tc }}>
                      <Radio size={10} /> {ex.tier}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${statusColor}18`, color: statusColor }}>
                      {ex.status}
                    </span>
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{ex.title}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{ex.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar size={11} /> {dt.toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} /> {ex.duration} min</span>
                    <span>{ex.questionCount} questions · {ex.topicId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditLiveExam(ex)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => { setDeleteId(ex.id); setTab("live-exam"); }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {filteredLiveExams.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No live exams found.</p>}
          <p className="text-xs text-slate-400 text-center">{filteredLiveExams.length} of {liveExams.length} live exams</p>
        </div>
      )}
    </div>
  );
}
