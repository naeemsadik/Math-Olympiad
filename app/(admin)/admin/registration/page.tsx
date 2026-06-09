"use client";

import { useState, useMemo } from "react";
import {
  ClipboardList, Search, CheckCircle2, XCircle, Clock, Eye,
  Users, Calendar, Filter, Download,
} from "lucide-react";

type Status = "pending" | "approved" | "rejected";

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

const mockRegistrations: Registration[] = [
  { id: "r1",  name: "Arif Hossain",     studentId: "011241001", dept: "CSE",     year: "3rd Year", email: "arif@uiu.ac.bd",     phone: "+8801711000001", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-01", status: "approved" },
  { id: "r2",  name: "Nusrat Jahan",     studentId: "011241022", dept: "Math",    year: "2nd Year", email: "nusrat@uiu.ac.bd",   phone: "+8801711000002", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-02", status: "approved" },
  { id: "r3",  name: "Tanvir Ahmed",     studentId: "011241043", dept: "EEE",     year: "4th Year", email: "tanvir@uiu.ac.bd",   phone: "+8801711000003", event: "BdMO Pre-Training Camp",          eventType: "Training",     submittedAt: "2025-04-03", status: "pending"  },
  { id: "r4",  name: "Sadia Islam",      studentId: "011241064", dept: "Physics", year: "1st Year", email: "sadia@uiu.ac.bd",    phone: "+8801711000004", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-03", status: "pending"  },
  { id: "r5",  name: "Mahbub Alam",      studentId: "011241085", dept: "CSE",     year: "2nd Year", email: "mahbub@uiu.ac.bd",   phone: "+8801711000005", event: "Olympiad Geometry Workshop",      eventType: "Workshop",     submittedAt: "2025-04-04", status: "rejected" },
  { id: "r6",  name: "Fatema Khatun",    studentId: "011241106", dept: "BBA",     year: "3rd Year", email: "fatema@uiu.ac.bd",   phone: "+8801711000006", event: "BdMO Pre-Training Camp",          eventType: "Training",     submittedAt: "2025-04-05", status: "approved" },
  { id: "r7",  name: "Rafiqul Islam",    studentId: "011241127", dept: "CSE",     year: "1st Year", email: "rafiq@uiu.ac.bd",    phone: "+8801711000007", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-05", status: "pending"  },
  { id: "r8",  name: "Sumaiya Akter",    studentId: "011241148", dept: "Math",    year: "4th Year", email: "sumaiya@uiu.ac.bd",  phone: "+8801711000008", event: "Olympiad Geometry Workshop",      eventType: "Workshop",     submittedAt: "2025-04-06", status: "approved" },
  { id: "r9",  name: "Kamrul Hasan",     studentId: "011241169", dept: "EEE",     year: "2nd Year", email: "kamrul@uiu.ac.bd",   phone: "+8801711000009", event: "BdMO Pre-Training Camp",          eventType: "Training",     submittedAt: "2025-04-07", status: "pending"  },
  { id: "r10", name: "Nasrin Sultana",   studentId: "011241190", dept: "Physics", year: "3rd Year", email: "nasrin@uiu.ac.bd",   phone: "+8801711000010", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-07", status: "rejected" },
  { id: "r11", name: "Imran Hossain",    studentId: "011241211", dept: "CSE",     year: "1st Year", email: "imran@uiu.ac.bd",    phone: "+8801711000011", event: "BdMO Pre-Training Camp",          eventType: "Training",     submittedAt: "2025-04-08", status: "approved" },
  { id: "r12", name: "Razia Begum",      studentId: "011241232", dept: "Math",    year: "2nd Year", email: "razia@uiu.ac.bd",    phone: "+8801711000012", event: "Olympiad Geometry Workshop",      eventType: "Workshop",     submittedAt: "2025-04-09", status: "pending"  },
  { id: "r13", name: "Shahriar Noman",   studentId: "011241253", dept: "CSE",     year: "3rd Year", email: "shahriar@uiu.ac.bd", phone: "+8801711000013", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-10", status: "approved" },
  { id: "r14", name: "Taslima Parvin",   studentId: "011241274", dept: "EEE",     year: "4th Year", email: "taslima@uiu.ac.bd",  phone: "+8801711000014", event: "BdMO Pre-Training Camp",          eventType: "Training",     submittedAt: "2025-04-10", status: "pending"  },
  { id: "r15", name: "Asif Rahman",      studentId: "011241295", dept: "BBA",     year: "1st Year", email: "asif@uiu.ac.bd",     phone: "+8801711000015", event: "UIU Internal Math Olympiad 2025", eventType: "Competition", submittedAt: "2025-04-11", status: "rejected" },
];

const statusColor: Record<Status, { text: string; bg: string; border: string }> = {
  pending:  { text: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  approved: { text: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)"  },
  rejected: { text: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)"   },
};

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === "approved") return <CheckCircle2 size={13} />;
  if (status === "rejected") return <XCircle size={13} />;
  return <Clock size={13} />;
};

export default function AdminRegistrationPage() {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterEvent, setFilterEvent] = useState("All");
  const [detail, setDetail] = useState<Registration | null>(null);

  const events = useMemo(() => ["All", ...Array.from(new Set(mockRegistrations.map((r) => r.event)))], []);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.studentId.includes(q) || r.email.toLowerCase().includes(q);
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      const matchEvent = filterEvent === "All" || r.event === filterEvent;
      return matchSearch && matchStatus && matchEvent;
    });
  }, [registrations, search, filterStatus, filterEvent]);

  const stats = useMemo(() => ({
    total:    registrations.length,
    pending:  registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  }), [registrations]);

  const updateStatus = (id: string, status: Status) => {
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    if (detail?.id === id) setDetail((d) => d ? { ...d, status } : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-[#d97706]" /> Registration
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage all event registration submissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500 text-xs font-medium px-4 py-2 rounded-xl">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total",    value: stats.total,    icon: Users,        color: "#a78bfa" },
          { label: "Pending",  value: stats.pending,  icon: Clock,        color: "#f59e0b" },
          { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "#10b981" },
          { label: "Rejected", value: stats.rejected, icon: XCircle,      color: "#ef4444" },
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
                  : { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.06)", color: "#64748b" }}
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
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 outline-none focus:border-[#d97706]/50 transition-all max-w-[220px]"
          >
            {events.map((ev) => <option key={ev} value={ev} className="bg-slate-800">{ev}</option>)}
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
                      <div>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{r.event}</p>
                        <p className="text-xs text-slate-400">{r.eventType}</p>
                      </div>
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
                        <button
                          onClick={() => updateStatus(r.id, "approved")}
                          disabled={r.status === "approved"}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#10b981] hover:bg-[#10b981]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "rejected")}
                          disabled={r.status === "rejected"}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Reject"
                        >
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
    </div>
  );
}
