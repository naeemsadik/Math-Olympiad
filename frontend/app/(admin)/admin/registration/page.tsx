"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList, Search, CheckCircle2, XCircle, Clock, Eye,
  Users, Calendar, Filter, Download, Plus, Pencil, Trash2,
  MapPin, X, LayoutGrid,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

type Status = "pending" | "confirmed" | "waitlist" | "cancelled" | "attended";
type EventStatus = "draft" | "open" | "closed" | "completed" | "cancelled";
type Tab = "registrations" | "events";

interface Registration {
  id: string;
  eventId: string;
  user: { id: string; name: string; email: string; institute?: string } | null;
  status: Status;
  paymentStatus?: string;
  notes?: string;
  registeredAt: string;
}

interface RegEvent {
  id: string;
  title: string;
  description?: string;
  venue?: string;
  startAt?: string;
  endAt?: string;
  registrationDeadline?: string;
  capacity: number;
  fee: number;
  currency?: string;
  status: EventStatus;
  requiresApproval: boolean;
  coverImage?: string;
  category?: string;
  registered: number;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  Competition: "#d97706",
  Training: "#b45309",
  Workshop: "#8b5cf6",
  Seminar: "#0891b2",
  "Mock Exam": "#059669",
};

const statusColor: Record<Status, { text: string; bg: string; border: string; label: string }> = {
  pending:   { text: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  label: "Pending"   },
  confirmed: { text: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  label: "Confirmed" },
  waitlist:  { text: "#0891b2", bg: "rgba(8,145,178,0.12)",   border: "rgba(8,145,178,0.25)",   label: "Waitlist"  },
  attended:  { text: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)", label: "Attended"  },
  cancelled: { text: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   label: "Cancelled" },
};

const eventStatusStyle: Record<EventStatus, { text: string; bg: string; border: string; label: string }> = {
  draft:     { text: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.25)", label: "Draft"     },
  open:      { text: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  label: "Open"      },
  closed:    { text: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   label: "Closed"    },
  completed: { text: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", label: "Completed" },
  cancelled: { text: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.25)", label: "Cancelled" },
};

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === "confirmed") return <CheckCircle2 size={13} />;
  if (status === "cancelled") return <XCircle size={13} />;
  if (status === "attended") return <CheckCircle2 size={13} />;
  return <Clock size={13} />;
};

const emptyEvent = (): Partial<RegEvent> => ({
  title: "",
  description: "",
  venue: "",
  startAt: "",
  endAt: "",
  registrationDeadline: "",
  capacity: 50,
  fee: 0,
  currency: "BDT",
  status: "draft",
  requiresApproval: false,
  category: "Competition",
});

function eventToBackendPayload(form: Partial<RegEvent>): Record<string, unknown> {
  return {
    title: form.title,
    description: form.description ?? null,
    venue: form.venue ?? null,
    start_at: form.startAt || null,
    end_at: form.endAt || null,
    registration_deadline: form.registrationDeadline || null,
    capacity: form.capacity ?? 0,
    fee: form.fee ?? 0,
    currency: form.currency ?? "BDT",
    status: form.status ?? "draft",
    requires_approval: form.requiresApproval ?? false,
    category: form.category ?? null,
  };
}

function backendEventToRow(e: { id: string; title: string; description?: string; venue?: string; startAt?: string; endAt?: string; registrationDeadline?: string; capacity: number; fee: number; currency?: string; status: EventStatus; requiresApproval: boolean; category?: string; registered: number }): RegEvent {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    venue: e.venue,
    startAt: e.startAt,
    endAt: e.endAt,
    registrationDeadline: e.registrationDeadline,
    capacity: e.capacity,
    fee: e.fee,
    currency: e.currency,
    status: e.status,
    requiresApproval: e.requiresApproval,
    category: e.category,
    registered: e.registered,
  };
}

export default function AdminRegistrationPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<RegEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("registrations");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterEvent, setFilterEvent] = useState("All");
  const [detail, setDetail] = useState<Registration | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingEvent, setEditingEvent] = useState<RegEvent | null>(null);
  const [form, setForm] = useState<Partial<RegEvent>>(emptyEvent());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [registrationsForEvent, setRegistrationsForEvent] = useState<Record<string, Registration[]>>({});

  const loadEvents = async () => {
    try {
      const res = await api.admin.registrationEvents.list();
      const list = Array.isArray(res) ? res : (res as { data?: RegEvent[] })?.data ?? [];
      setEvents((list as unknown as RegEvent[]).map(backendEventToRow));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load events.");
    }
  };

  const loadRegistrationsForEvent = async (eventId: string) => {
    try {
      const res = await api.admin.registrationEvents.listRegistrations(eventId);
      const list = Array.isArray(res) ? res : (res as { data?: Registration[] })?.data ?? [];
      setRegistrationsForEvent((prev) => ({ ...prev, [eventId]: list as unknown as Registration[] }));
    } catch (e) {
      // non-fatal
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadEvents()]).finally(() => setLoading(false));
  }, []);

  // Build a flat list of registrations across all events.
  useEffect(() => {
    if (events.length === 0) {
      setRegistrations([]);
      return;
    }
    const loadAll = async () => {
      const all: Registration[] = [];
      for (const ev of events) {
        try {
          const res = await api.admin.registrationEvents.listRegistrations(ev.id);
          const list = Array.isArray(res) ? res : (res as { data?: Registration[] })?.data ?? [];
          const regs = (list as unknown as Registration[]).map((r) => ({ ...r, eventId: ev.id }));
          all.push(...regs);
          setRegistrationsForEvent((prev) => ({ ...prev, [ev.id]: regs }));
        } catch {
          // ignore
        }
      }
      setRegistrations(all);
    };
    void loadAll();
  }, [events.length]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return registrations.filter((r) => {
      const matchSearch = !q || (r.user?.name?.toLowerCase().includes(q) ?? false) || (r.user?.email?.toLowerCase().includes(q) ?? false);
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      const matchEvent = filterEvent === "All" || r.eventId === filterEvent;
      return matchSearch && matchStatus && matchEvent;
    });
  }, [registrations, search, filterStatus, filterEvent]);

  const regStats = useMemo(() => ({
    total:    registrations.length,
    pending:  registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "confirmed").length,
    rejected: registrations.filter((r) => r.status === "cancelled").length,
  }), [registrations]);

  const updateStatus = async (id: string, status: Status) => {
    const reg = registrations.find((r) => r.id === id);
    if (!reg) return;
    try {
      await api.admin.registrationEvents.updateRegistration(reg.eventId, id, { status });
      setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      if (detail?.id === id) setDetail((d) => d ? { ...d, status } : null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to update registration.");
    }
  };

  const openCreate = () => { setForm(emptyEvent()); setEditingEvent(null); setModalMode("create"); };
  const openEdit = (ev: RegEvent) => {
    setForm({
      ...ev,
      startAt: ev.startAt?.slice(0, 16) ?? "",
      endAt: ev.endAt?.slice(0, 16) ?? "",
      registrationDeadline: ev.registrationDeadline?.slice(0, 16) ?? "",
    });
    setEditingEvent(ev);
    setModalMode("edit");
  };

  const saveEvent = async () => {
    if (!form.title || !form.startAt) return;
    setSaving(true);
    try {
      const payload = eventToBackendPayload(form);
      if (modalMode === "create") {
        const created = await api.admin.registrationEvents.create(payload) as { id: string };
        await loadEvents();
        if (created?.id) await loadRegistrationsForEvent(created.id);
      } else if (editingEvent) {
        await api.admin.registrationEvents.update(editingEvent.id, payload);
        await loadEvents();
      }
      setModalMode(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await api.admin.registrationEvents.remove(deleteId);
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete event.");
    }
  };

  const viewRegistrations = (eventId: string) => {
    setFilterEvent(eventId);
    setTab("registrations");
  };

  const downloadCsv = () => {
    if (filterEvent !== "All") {
      const link = document.createElement("a");
      link.href = `/api/v1/admin/registration-events/${filterEvent}/registrations/export`;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.click();
    }
  };

  const eventNameById = useMemo(() => {
    const m: Record<string, string> = {};
    events.forEach((e) => { m[e.id] = e.title; });
    return m;
  }, [events]);

  const enrollmentByEvent = useMemo(() => {
    const map: Record<string, { total: number; approved: number; pending: number; rejected: number; byDept: Record<string, number> }> = {};
    registrations.forEach((r) => {
      const ev = eventNameById[r.eventId] ?? r.eventId;
      if (!map[ev]) map[ev] = { total: 0, approved: 0, pending: 0, rejected: 0, byDept: {} };
      map[ev].total++;
      if (r.status === "confirmed") map[ev].approved++;
      if (r.status === "pending") map[ev].pending++;
      if (r.status === "cancelled") map[ev].rejected++;
      const dept = r.user?.institute ?? "Unknown";
      map[ev].byDept[dept] = (map[ev].byDept[dept] || 0) + 1;
    });
    return map;
  }, [registrations, eventNameById]);

  const totalEnrolled = useMemo(
    () => Object.values(enrollmentByEvent).reduce((s, e) => s + e.total, 0),
    [enrollmentByEvent]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-[#d97706]" /> Registration
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage events and review student registration submissions.</p>
        </div>
        {filterEvent !== "All" && (
          <button onClick={downloadCsv} className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500 text-xs font-medium px-4 py-2 rounded-xl">
            <Download size={13} /> Export CSV
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("registrations")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "registrations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          Registrations <span className="ml-2 text-xs bg-[#d97706]/15 text-[#d97706] px-1.5 py-0.5 rounded-full font-bold">{regStats.total}</span>
        </button>
        <button onClick={() => setTab("events")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "events" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          Events <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">{events.length}</span>
        </button>
      </div>

      {/* ── REGISTRATIONS TAB ── */}
      {tab === "registrations" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total",    value: regStats.total,    icon: Users,        color: "#a78bfa" },
              { label: "Pending",  value: regStats.pending,  icon: Clock,        color: "#f59e0b" },
              { label: "Approved", value: regStats.approved, icon: CheckCircle2, color: "#10b981" },
              { label: "Rejected", value: regStats.rejected, icon: XCircle,      color: "#ef4444" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-slate-900 leading-none">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {filterEvent !== "All" && (
            <div className="flex items-center gap-2 bg-[#d97706]/8 border border-[#d97706]/20 rounded-xl px-4 py-2.5">
              <span className="text-xs text-[#92400e] font-medium">Filtered by event:</span>
              <span className="text-xs font-bold text-[#d97706]">{eventNameById[filterEvent] ?? filterEvent}</span>
              <button onClick={() => setFilterEvent("All")} className="ml-auto text-[#d97706] hover:text-[#b45309] transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email…"
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-64 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["All", "pending", "confirmed", "waitlist", "cancelled", "attended"] as const).map((s) => {
                const active = filterStatus === s;
                const col = s === "All" ? "#64748b" : statusColor[s as Status].text;
                return (
                  <button key={s} onClick={() => setFilterStatus(s as Status | "All")}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all capitalize"
                    style={active
                      ? { backgroundColor: s === "All" ? "rgba(100,116,139,0.15)" : statusColor[s as Status].bg, borderColor: s === "All" ? "rgba(100,116,139,0.3)" : statusColor[s as Status].border, color: col }
                      : { backgroundColor: "transparent", borderColor: "rgba(203,213,225,0.8)", color: "#64748b" }}>
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Filter size={12} className="text-slate-400" />
              <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 outline-none focus:border-[#d97706]/50 transition-all max-w-55">
                <option value="All">All events</option>
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
              </select>
            </div>
          </div>

          {detail && (
            <div className="glass rounded-2xl p-5 border border-[#d97706]/20">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registration Detail</p>
                  <p className="text-slate-900 font-semibold text-lg">{detail.user?.name ?? "Unknown"}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{detail.user?.email ?? "—"} · {detail.user?.institute ?? "—"}</p>
                </div>
                <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Close ✕</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Event",     value: eventNameById[detail.eventId] ?? "—" },
                  { label: "Status",    value: statusColor[detail.status].label },
                  { label: "Registered",value: new Date(detail.registeredAt).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl px-3 py-2">
                    <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                    <p className="text-slate-900 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {detail.notes && (
                <div className="mt-3 bg-slate-50 rounded-xl px-3 py-2">
                  <p className="text-slate-400 text-xs mb-0.5">Notes</p>
                  <p className="text-slate-900 text-sm font-medium">{detail.notes}</p>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => updateStatus(detail.id, "confirmed")} disabled={detail.status === "confirmed"} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 hover:bg-[#10b981]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <CheckCircle2 size={13} /> Approve
                </button>
                <button onClick={() => updateStatus(detail.id, "cancelled")} disabled={detail.status === "cancelled"} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <XCircle size={13} /> Reject
                </button>
              </div>
            </div>
          )}

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="text-left py-3 px-6 font-medium">Student</th>
                    <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Event</th>
                    <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Registered</th>
                    <th className="text-center py-3 px-6 font-medium">Status</th>
                    <th className="text-right py-3 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const sc = statusColor[r.status];
                    return (
                      <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{(r.user?.name ?? "?")[0]}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{r.user?.name ?? "Unknown"}</p>
                              <p className="text-xs text-slate-400 truncate hidden sm:block">{r.user?.email ?? "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 hidden md:table-cell"><p className="text-xs text-slate-500 truncate max-w-50">{eventNameById[r.eventId] ?? r.eventId}</p></td>
                        <td className="py-3.5 px-6 hidden lg:table-cell"><div className="flex items-center gap-1.5 text-xs text-slate-400"><Calendar size={11} /> {new Date(r.registeredAt).toLocaleDateString()}</div></td>
                        <td className="py-3.5 px-6 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize" style={{ color: sc.text, backgroundColor: sc.bg, borderColor: sc.border }}>
                            <StatusIcon status={r.status} /> {sc.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => setDetail(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors" title="View"><Eye size={14} /></button>
                            <button onClick={() => updateStatus(r.id, "confirmed")} disabled={r.status === "confirmed"} className="p-1.5 rounded-lg text-slate-400 hover:text-[#10b981] hover:bg-[#10b981]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Approve"><CheckCircle2 size={14} /></button>
                            <button onClick={() => updateStatus(r.id, "cancelled")} disabled={r.status === "cancelled"} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Reject"><XCircle size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No registrations found.</p>}
            </div>
            <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">
              {filtered.length} of {registrations.length} registrations
            </div>
          </div>
        </>
      )}

      {/* ── EVENTS TAB ── */}
      {tab === "events" && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Events",   value: events.length,                                  icon: LayoutGrid,   color: "#a78bfa" },
              { label: "Open",           value: events.filter((e) => e.status === "open").length, icon: CheckCircle2, color: "#10b981" },
              { label: "Total Enrolled", value: totalEnrolled,                                  icon: Users,        color: "#d97706" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-slate-900 leading-none">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button onClick={openCreate} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#d97706]/20 hover:scale-105 transition-all">
              <Plus size={15} /> Create Event
            </button>
          </div>

          {loading ? <p className="text-center text-slate-400 text-sm py-10">Loading events…</p> : (
          <div className="space-y-4">
            {events.map((ev) => {
              const enr = enrollmentByEvent[ev.title] ?? { total: 0, approved: 0, pending: 0, rejected: 0, byDept: {} };
              const es = eventStatusStyle[ev.status];
              const color = EVENT_TYPE_COLORS[ev.category ?? "Competition"] ?? "#d97706";
              return (
                <div key={ev.id} className="glass rounded-2xl overflow-hidden">
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {ev.category && <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{ev.category}</span>}
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color: es.text, backgroundColor: es.bg, borderColor: es.border }}>{es.label}</span>
                          {ev.requiresApproval && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Approval required</span>}
                        </div>
                        <h3 className="font-heading font-bold text-slate-900 text-base leading-snug">{ev.title}</h3>
                        {ev.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ev.description}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => viewRegistrations(ev.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/25 hover:bg-[#d97706]/20 transition-all">
                          <Eye size={12} /> Registrations
                        </button>
                        <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(ev.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                      {ev.startAt && <span className="flex items-center gap-1.5"><Calendar size={11} /> {new Date(ev.startAt).toLocaleString()}</span>}
                      {ev.venue && <span className="flex items-center gap-1.5"><MapPin size={11} /> {ev.venue}</span>}
                      <span className="flex items-center gap-1.5"><Users size={11} /> Capacity: {ev.capacity}</span>
                      {ev.fee > 0 && <span className="flex items-center gap-1.5">{ev.fee} {ev.currency ?? "BDT"}</span>}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-700">{enr.total} / {ev.capacity} enrolled</span>
                        <div className="flex gap-3 text-xs">
                          <span style={{ color: "#10b981" }}>{enr.approved} approved</span>
                          <span style={{ color: "#f59e0b" }}>{enr.pending} pending</span>
                          {enr.rejected > 0 && <span style={{ color: "#ef4444" }}>{enr.rejected} rejected</span>}
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(enr.approved / Math.max(1, ev.capacity)) * 100}%`, background: "#10b981", minWidth: enr.approved > 0 ? "2px" : 0 }} />
                        <div style={{ width: `${(enr.pending / Math.max(1, ev.capacity)) * 100}%`, background: "#f59e0b", minWidth: enr.pending > 0 ? "2px" : 0 }} />
                        <div style={{ width: `${(enr.rejected / Math.max(1, ev.capacity)) * 100}%`, background: "#ef4444", minWidth: enr.rejected > 0 ? "2px" : 0 }} />
                      </div>
                    </div>

                    {Object.keys(enr.byDept).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] text-slate-400 self-center mr-1">By institute:</span>
                        {Object.entries(enr.byDept).map(([d, c]) => (
                          <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{d}: {c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <div className="glass rounded-2xl p-12 text-center">
                <LayoutGrid size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No events yet. Create your first event.</p>
              </div>
            )}
          </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-heading font-bold text-slate-900">{modalMode === "create" ? "Create Event" : "Edit Event"}</h2>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Event Title *</label>
                <input value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. UIU Internal Math Olympiad 2026" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Category</label>
                  <select value={form.category ?? "Competition"} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all">
                    {Object.keys(EVENT_TYPE_COLORS).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Status</label>
                  <select value={form.status ?? "draft"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as EventStatus }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all">
                    {(["draft", "open", "closed", "completed", "cancelled"] as EventStatus[]).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Start Date/Time *</label>
                <input type="datetime-local" value={form.startAt ?? ""} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">End Date/Time</label>
                  <input type="datetime-local" value={form.endAt ?? ""} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Capacity</label>
                  <input type="number" min={1} value={form.capacity ?? 50} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Venue</label>
                <input value={form.venue ?? ""} onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))} placeholder="e.g. UIU Campus, Dhaka" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Registration Deadline</label>
                  <input type="datetime-local" value={form.registrationDeadline ?? ""} onChange={(e) => setForm((f) => ({ ...f, registrationDeadline: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Fee</label>
                  <input type="number" min={0} value={form.fee ?? 0} onChange={(e) => setForm((f) => ({ ...f, fee: Number(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Description</label>
                <textarea value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.requiresApproval ?? false} onChange={(e) => setForm((f) => ({ ...f, requiresApproval: e.target.checked }))} className="accent-[#d97706]" />
                Require admin approval for each registration
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={saveEvent} disabled={!form.title || !form.startAt || saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all">
                {modalMode === "create" ? <Plus size={14} /> : <Pencil size={14} />}
                {saving ? "Saving…" : modalMode === "create" ? "Create Event" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Delete Event?</p>
                <p className="text-xs text-slate-400 mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
