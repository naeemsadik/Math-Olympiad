"use client";

import { useState, useMemo } from "react";
import {
  ClipboardList, Search, CheckCircle2, XCircle, Clock, Eye,
  Users, Calendar, Filter, Download, Plus, Pencil, Trash2,
  MapPin, X, LayoutGrid,
} from "lucide-react";

type Status = "pending" | "approved" | "rejected";
type EventStatus = "open" | "closed" | "upcoming";
type Tab = "registrations" | "events";

interface Registration {
  id: string;
  name: string;
  studentId: string;
  dept: string;
  year: string;
  email: string;
  phone: string;
  event: string;
  eventType: string;
  submittedAt: string;
  status: Status;
}

interface RegEvent {
  id: string;
  title: string;
  type: string;
  typeColor: string;
  date: string;
  location: string;
  capacity: number;
  status: EventStatus;
  description: string;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  Competition: "#d97706",
  Training: "#b45309",
  Workshop: "#8b5cf6",
  Seminar: "#0891b2",
  "Mock Exam": "#059669",
};

const mockRegistrations: Registration[] = [
  { id: "r1",  name: "Arif Hossain",   studentId: "011241001", dept: "CSE",     year: "3rd Year", email: "arif@uiu.ac.bd",     phone: "+8801711000001", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-01", status: "approved" },
  { id: "r2",  name: "Nusrat Jahan",   studentId: "011241022", dept: "Math",    year: "2nd Year", email: "nusrat@uiu.ac.bd",   phone: "+8801711000002", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-02", status: "approved" },
  { id: "r3",  name: "Tanvir Ahmed",   studentId: "011241043", dept: "EEE",     year: "4th Year", email: "tanvir@uiu.ac.bd",   phone: "+8801711000003", event: "BdMO Pre-Training Camp",          eventType: "Training",    submittedAt: "2025-04-03", status: "pending"  },
  { id: "r4",  name: "Sadia Islam",    studentId: "011241064", dept: "Physics", year: "1st Year", email: "sadia@uiu.ac.bd",    phone: "+8801711000004", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-03", status: "pending"  },
  { id: "r5",  name: "Mahbub Alam",    studentId: "011241085", dept: "CSE",     year: "2nd Year", email: "mahbub@uiu.ac.bd",   phone: "+8801711000005", event: "Olympiad Geometry Workshop",      eventType: "Workshop",    submittedAt: "2025-04-04", status: "rejected" },
  { id: "r6",  name: "Fatema Khatun",  studentId: "011241106", dept: "BBA",     year: "3rd Year", email: "fatema@uiu.ac.bd",   phone: "+8801711000006", event: "BdMO Pre-Training Camp",          eventType: "Training",    submittedAt: "2025-04-05", status: "approved" },
  { id: "r7",  name: "Rafiqul Islam",  studentId: "011241127", dept: "CSE",     year: "1st Year", email: "rafiq@uiu.ac.bd",    phone: "+8801711000007", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-05", status: "pending"  },
  { id: "r8",  name: "Sumaiya Akter",  studentId: "011241148", dept: "Math",    year: "4th Year", email: "sumaiya@uiu.ac.bd",  phone: "+8801711000008", event: "Olympiad Geometry Workshop",      eventType: "Workshop",    submittedAt: "2025-04-06", status: "approved" },
  { id: "r9",  name: "Kamrul Hasan",   studentId: "011241169", dept: "EEE",     year: "2nd Year", email: "kamrul@uiu.ac.bd",   phone: "+8801711000009", event: "BdMO Pre-Training Camp",          eventType: "Training",    submittedAt: "2025-04-07", status: "pending"  },
  { id: "r10", name: "Nasrin Sultana", studentId: "011241190", dept: "Physics", year: "3rd Year", email: "nasrin@uiu.ac.bd",   phone: "+8801711000010", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-07", status: "rejected" },
  { id: "r11", name: "Imran Hossain",  studentId: "011241211", dept: "CSE",     year: "1st Year", email: "imran@uiu.ac.bd",    phone: "+8801711000011", event: "BdMO Pre-Training Camp",          eventType: "Training",    submittedAt: "2025-04-08", status: "approved" },
  { id: "r12", name: "Razia Begum",    studentId: "011241232", dept: "Math",    year: "2nd Year", email: "razia@uiu.ac.bd",    phone: "+8801711000012", event: "Olympiad Geometry Workshop",      eventType: "Workshop",    submittedAt: "2025-04-09", status: "pending"  },
  { id: "r13", name: "Shahriar Noman", studentId: "011241253", dept: "CSE",     year: "3rd Year", email: "shahriar@uiu.ac.bd", phone: "+8801711000013", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-10", status: "approved" },
  { id: "r14", name: "Taslima Parvin", studentId: "011241274", dept: "EEE",     year: "4th Year", email: "taslima@uiu.ac.bd",  phone: "+8801711000014", event: "BdMO Pre-Training Camp",          eventType: "Training",    submittedAt: "2025-04-10", status: "pending"  },
  { id: "r15", name: "Asif Rahman",    studentId: "011241295", dept: "BBA",     year: "1st Year", email: "asif@uiu.ac.bd",     phone: "+8801711000015", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-11", status: "rejected" },
];

const initialEvents: RegEvent[] = [
  { id: "ev1", title: "UIU Internal Math Olympiad 2025", type: "Competition", typeColor: "#d97706", date: "2025-05-15", location: "UIU Campus, Dhaka", capacity: 200, status: "open",     description: "Annual UIU internal math olympiad for all levels. Top 3 nominated for BdMO national round." },
  { id: "ev2", title: "BdMO Pre-Training Camp",          type: "Training",    typeColor: "#b45309", date: "2025-04-20", location: "UIU Campus",       capacity: 40,  status: "open",     description: "Intensive training camp for BdMO regional preparation. Covers NT, Algebra, and Geometry." },
  { id: "ev3", title: "Olympiad Geometry Workshop",      type: "Workshop",    typeColor: "#8b5cf6", date: "2025-06-10", location: "Room 412, UIU",    capacity: 60,  status: "upcoming", description: "Hands-on session on synthetic geometry, angle chasing, and circle theorems." },
];

const statusColor: Record<Status, { text: string; bg: string; border: string }> = {
  pending:  { text: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  approved: { text: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)"  },
  rejected: { text: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)"   },
};

const eventStatusStyle: Record<EventStatus, { text: string; bg: string; border: string; label: string }> = {
  open:     { text: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  label: "Open"     },
  upcoming: { text: "#0891b2", bg: "rgba(8,145,178,0.1)",   border: "rgba(8,145,178,0.25)",   label: "Upcoming" },
  closed:   { text: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.25)", label: "Closed"   },
};

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === "approved") return <CheckCircle2 size={13} />;
  if (status === "rejected") return <XCircle size={13} />;
  return <Clock size={13} />;
};

const EMPTY_FORM: Partial<RegEvent> = {
  title: "", type: "Competition", typeColor: "#d97706", date: "", location: "", capacity: 50, status: "upcoming", description: "",
};

export default function AdminRegistrationPage() {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [tab, setTab] = useState<Tab>("registrations");

  // Registrations tab state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterEvent, setFilterEvent] = useState("All");
  const [detail, setDetail] = useState<Registration | null>(null);

  // Events tab state
  const [events, setEvents] = useState<RegEvent[]>(initialEvents);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingEvent, setEditingEvent] = useState<RegEvent | null>(null);
  const [form, setForm] = useState<Partial<RegEvent>>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allEventNames = useMemo(
    () => ["All", ...Array.from(new Set(mockRegistrations.map((r) => r.event)))],
    []
  );

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.studentId.includes(q) || r.email.toLowerCase().includes(q);
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      const matchEvent = filterEvent === "All" || r.event === filterEvent;
      return matchSearch && matchStatus && matchEvent;
    });
  }, [registrations, search, filterStatus, filterEvent]);

  const regStats = useMemo(() => ({
    total:    registrations.length,
    pending:  registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  }), [registrations]);

  const enrollmentByEvent = useMemo(() => {
    const map: Record<string, { total: number; approved: number; pending: number; rejected: number; byDept: Record<string, number> }> = {};
    registrations.forEach((r) => {
      if (!map[r.event]) map[r.event] = { total: 0, approved: 0, pending: 0, rejected: 0, byDept: {} };
      map[r.event].total++;
      map[r.event][r.status]++;
      map[r.event].byDept[r.dept] = (map[r.event].byDept[r.dept] || 0) + 1;
    });
    return map;
  }, [registrations]);

  const totalEnrolled = useMemo(
    () => Object.values(enrollmentByEvent).reduce((s, e) => s + e.total, 0),
    [enrollmentByEvent]
  );

  const updateStatus = (id: string, status: Status) => {
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    if (detail?.id === id) setDetail((d) => d ? { ...d, status } : null);
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditingEvent(null); setModalMode("create"); };
  const openEdit = (ev: RegEvent) => { setForm({ ...ev }); setEditingEvent(ev); setModalMode("edit"); };

  const saveEvent = () => {
    if (!form.title || !form.date || !form.location) return;
    const color = EVENT_TYPE_COLORS[form.type ?? "Competition"] ?? "#d97706";
    if (modalMode === "create") {
      setEvents((prev) => [...prev, {
        id: `ev${Date.now()}`, title: form.title!, type: form.type ?? "Competition",
        typeColor: color, date: form.date!, location: form.location!,
        capacity: form.capacity ?? 50, status: form.status ?? "upcoming", description: form.description ?? "",
      }]);
    } else if (editingEvent) {
      setEvents((prev) => prev.map((e) => e.id === editingEvent.id ? { ...e, ...form, typeColor: color } as RegEvent : e));
    }
    setModalMode(null);
  };

  const viewRegistrations = (eventTitle: string) => {
    setFilterEvent(eventTitle);
    setTab("registrations");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-[#d97706]" /> Registration
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage events and review student registration submissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500 text-xs font-medium px-4 py-2 rounded-xl">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("registrations")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "registrations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Registrations
          <span className="ml-2 text-xs bg-[#d97706]/15 text-[#d97706] px-1.5 py-0.5 rounded-full font-bold">{regStats.total}</span>
        </button>
        <button
          onClick={() => setTab("events")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "events" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Events
          <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">{events.length}</span>
        </button>
      </div>

      {/* ── REGISTRATIONS TAB ── */}
      {tab === "registrations" && (
        <>
          {/* Stats */}
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

          {/* Active event filter banner */}
          {filterEvent !== "All" && (
            <div className="flex items-center gap-2 bg-[#d97706]/8 border border-[#d97706]/20 rounded-xl px-4 py-2.5">
              <span className="text-xs text-[#92400e] font-medium">Filtered by event:</span>
              <span className="text-xs font-bold text-[#d97706]">{filterEvent}</span>
              <button onClick={() => setFilterEvent("All")} className="ml-auto text-[#d97706] hover:text-[#b45309] transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, ID or email…"
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-64 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["All", "pending", "approved", "rejected"] as const).map((s) => {
                const active = filterStatus === s;
                const col = s === "All" ? "#64748b" : statusColor[s].text;
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all capitalize"
                    style={active
                      ? { backgroundColor: s === "All" ? "rgba(100,116,139,0.15)" : statusColor[s as Status].bg, borderColor: s === "All" ? "rgba(100,116,139,0.3)" : statusColor[s as Status].border, color: col }
                      : { backgroundColor: "transparent", borderColor: "rgba(203,213,225,0.8)", color: "#64748b" }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Filter size={12} className="text-slate-400" />
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 outline-none focus:border-[#d97706]/50 transition-all max-w-55"
              >
                {allEventNames.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
              </select>
            </div>
          </div>

          {/* Detail panel */}
          {detail && (
            <div className="glass rounded-2xl p-5 border border-[#d97706]/20">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registration Detail</p>
                  <p className="text-slate-900 font-semibold text-lg">{detail.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{detail.email} · {detail.phone}</p>
                </div>
                <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Close ✕</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: "Student ID", value: detail.studentId },
                  { label: "Department", value: detail.dept },
                  { label: "Year",       value: detail.year },
                  { label: "Submitted",  value: detail.submittedAt },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl px-3 py-2">
                    <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                    <p className="text-slate-900 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-slate-400 text-xs mb-0.5">Event</p>
                <p className="text-slate-900 text-sm font-medium">{detail.event}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateStatus(detail.id, "approved")}
                  disabled={detail.status === "approved"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 hover:bg-[#10b981]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <CheckCircle2 size={13} /> Approve
                </button>
                <button
                  onClick={() => updateStatus(detail.id, "rejected")}
                  disabled={detail.status === "rejected"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <XCircle size={13} /> Reject
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="text-left py-3 px-6 font-medium">Student</th>
                    <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Event</th>
                    <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Dept / Year</th>
                    <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Submitted</th>
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
                            <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{r.name[0]}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{r.name}</p>
                              <p className="text-xs text-slate-400 truncate hidden sm:block">{r.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 hidden md:table-cell">
                          <p className="text-xs text-slate-500 truncate max-w-50">{r.event}</p>
                          <p className="text-xs text-slate-400">{r.eventType}</p>
                        </td>
                        <td className="py-3.5 px-6 hidden sm:table-cell">
                          <p className="text-xs text-slate-500">{r.dept}</p>
                          <p className="text-xs text-slate-400">{r.year}</p>
                        </td>
                        <td className="py-3.5 px-6 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar size={11} /> {r.submittedAt}
                          </div>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize"
                            style={{ color: sc.text, backgroundColor: sc.bg, borderColor: sc.border }}
                          >
                            <StatusIcon status={r.status} /> {r.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => setDetail(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors" title="View">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => updateStatus(r.id, "approved")} disabled={r.status === "approved"} className="p-1.5 rounded-lg text-slate-400 hover:text-[#10b981] hover:bg-[#10b981]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Approve">
                              <CheckCircle2 size={14} />
                            </button>
                            <button onClick={() => updateStatus(r.id, "rejected")} disabled={r.status === "rejected"} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Reject">
                              <XCircle size={14} />
                            </button>
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
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Events",   value: events.length,                                    icon: LayoutGrid,   color: "#a78bfa" },
              { label: "Open",           value: events.filter((e) => e.status === "open").length, icon: CheckCircle2, color: "#10b981" },
              { label: "Total Enrolled", value: totalEnrolled,                                    icon: Users,        color: "#d97706" },
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

          {/* Create button */}
          <div className="flex justify-end">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#d97706]/20 hover:scale-105 transition-all"
            >
              <Plus size={15} /> Create Event
            </button>
          </div>

          {/* Event cards */}
          <div className="space-y-4">
            {events.map((ev) => {
              const enr = enrollmentByEvent[ev.title] ?? { total: 0, approved: 0, pending: 0, rejected: 0, byDept: {} };
              const es = eventStatusStyle[ev.status];
              return (
                <div key={ev.id} className="glass rounded-2xl overflow-hidden">
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ev.typeColor}, ${ev.typeColor}55)` }} />
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${ev.typeColor}15`, color: ev.typeColor }}>{ev.type}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color: es.text, backgroundColor: es.bg, borderColor: es.border }}>{es.label}</span>
                        </div>
                        <h3 className="font-heading font-bold text-slate-900 text-base leading-snug">{ev.title}</h3>
                        {ev.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ev.description}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => viewRegistrations(ev.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/25 hover:bg-[#d97706]/20 transition-all"
                        >
                          <Eye size={12} /> Registrations
                        </button>
                        <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(ev.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar size={11} /> {ev.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={11} /> {ev.location}</span>
                      <span className="flex items-center gap-1.5"><Users size={11} /> Capacity: {ev.capacity}</span>
                    </div>

                    {/* Enrollment breakdown */}
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
                        <div style={{ width: `${(enr.approved / ev.capacity) * 100}%`, background: "#10b981", minWidth: enr.approved > 0 ? "2px" : 0 }} />
                        <div style={{ width: `${(enr.pending / ev.capacity) * 100}%`, background: "#f59e0b", minWidth: enr.pending > 0 ? "2px" : 0 }} />
                        <div style={{ width: `${(enr.rejected / ev.capacity) * 100}%`, background: "#ef4444", minWidth: enr.rejected > 0 ? "2px" : 0 }} />
                      </div>
                    </div>

                    {/* Dept breakdown */}
                    {Object.keys(enr.byDept).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] text-slate-400 self-center mr-1">By dept:</span>
                        {Object.entries(enr.byDept).map(([dept, count]) => (
                          <span key={dept} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {dept}: {count}
                          </span>
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
                <input
                  value={form.title ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. UIU Internal Math Olympiad 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Event Type</label>
                  <select
                    value={form.type ?? "Competition"}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, typeColor: EVENT_TYPE_COLORS[e.target.value] ?? "#d97706" }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all"
                  >
                    {Object.keys(EVENT_TYPE_COLORS).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Status</label>
                  <select
                    value={form.status ?? "upcoming"}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as EventStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all"
                  >
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Date *</label>
                  <input
                    type="date"
                    value={form.date ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacity ?? 50}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Location *</label>
                <input
                  value={form.location ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. UIU Campus, Dhaka"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the event…"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">Cancel</button>
              <button
                onClick={saveEvent}
                disabled={!form.title || !form.date || !form.location}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                {modalMode === "create" ? <Plus size={14} /> : <Pencil size={14} />}
                {modalMode === "create" ? "Create Event" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
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
              <button onClick={() => { setEvents((prev) => prev.filter((e) => e.id !== deleteId)); setDeleteId(null); }} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
