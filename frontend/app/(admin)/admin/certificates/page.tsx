"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award, Search, ShieldCheck, ShieldX, Plus, Eye,
  Calendar, Hash, X, Download,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface Certificate {
  id: string;
  studentName?: string;
  recipientName?: string;
  studentId?: string;
  studentIdUser?: string;
  dept?: string;
  institute?: string;
  achievement?: string;
  title?: string;
  event?: string;
  eventType?: string;
  description?: string;
  issuedAt: string;
  tier: string;
  signatoryName?: string;
  signatoryTitle?: string;
  status: string;
}

const TIERS = ["Beginner", "Intermediate", "Advanced", "Elite"];
const STATUSES = ["all", "valid", "revoked"];

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "valid" | "revoked">("all");
  const [detail, setDetail] = useState<Certificate | null>(null);
  const [issueOpen, setIssueOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    userId: string;
    studentName: string;
    studentId: string;
    dept: string;
    institute: string;
    achievement: string;
    event: string;
    eventType: string;
    description: string;
    tier: string;
    issuedAt: string;
    signatoryName: string;
    signatoryTitle: string;
  }>({
    userId: "",
    studentName: "",
    studentId: "",
    dept: "",
    institute: "",
    achievement: "",
    event: "",
    eventType: "Competition",
    description: "",
    tier: "gold",
    issuedAt: new Date().toISOString().slice(0, 10),
    signatoryName: "Prof. Dr. Mohammed Hossain",
    signatoryTitle: "Director, UIU Centre for Math Olympiad and Research",
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.certificates.list();
      const list = Array.isArray(res) ? res : (res as { data?: Certificate[] }).data ?? [];
      setCerts(list);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load certificates.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return certs.filter((c) => {
      const name = (c.recipientName ?? c.studentName ?? "").toLowerCase();
      const id = (c.studentId ?? c.id).toLowerCase();
      const matchSearch = !q || name.includes(q) || id.includes(q);
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [certs, search, filterStatus]);

  const stats = useMemo(() => ({
    total: certs.length,
    valid: certs.filter((c) => c.status === "valid").length,
    revoked: certs.filter((c) => c.status === "revoked").length,
  }), [certs]);

  const toggleRevoke = async (id: string) => {
    const cert = certs.find((c) => c.id === id);
    if (!cert) return;
    try {
      if (cert.status === "valid") {
        await api.admin.certificates.revoke(id, "Revoked by admin");
      } else {
        await api.admin.certificates.restore(id);
      }
      await load();
      if (detail?.id === id) setDetail(null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to update certificate.";
      setError(msg);
    }
  };

  const issueCert = async () => {
    if (!form.studentName || !form.achievement || !form.issuedAt) return;
    setSaving(true);
    try {
      await api.admin.certificates.create({
        user_id: form.userId ? Number(form.userId) : null,
        student_name: form.studentName,
        student_id_str: form.studentId || null,
        dept: form.dept || null,
        institute: form.institute || null,
        achievement: form.achievement,
        event: form.event || null,
        event_type: form.eventType || null,
        description: form.description || null,
        tier: form.tier,
        issued_at: form.issuedAt,
        signatory_name: form.signatoryName || null,
        signatory_title: form.signatoryTitle || null,
      } as unknown as Record<string, unknown>);
      await load();
      setIssueOpen(false);
      setForm((f) => ({
        ...f,
        userId: "",
        studentName: "",
        studentId: "",
        achievement: "",
        event: "",
        description: "",
      }));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to issue certificate.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const downloadCsv = () => {
    const link = document.createElement("a");
    link.href = "/api/v1/admin/certificates/export";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Award size={24} className="text-[#d97706]" /> Certificates
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Issue and manage student achievement certificates.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCsv} className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500 text-xs font-medium px-4 py-2 rounded-xl">
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={() => setIssueOpen(true)}
            className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#d97706]/20 hover:scale-105 transition-all"
          >
            <Plus size={15} /> Issue Certificate
          </button>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Issued", value: stats.total, icon: Award, color: "#d97706" },
          { label: "Valid", value: stats.valid, icon: ShieldCheck, color: "#10b981" },
          { label: "Revoked", value: stats.revoked, icon: ShieldX, color: "#ef4444" },
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, ID or cert number…" className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-72 transition-all" />
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => {
            const active = filterStatus === s;
            const col = s === "valid" ? "#10b981" : s === "revoked" ? "#ef4444" : "#64748b";
            return (
              <button key={s} onClick={() => setFilterStatus(s as typeof filterStatus)} className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all capitalize" style={active ? { backgroundColor: `${col}15`, borderColor: `${col}40`, color: col } : { backgroundColor: "transparent", borderColor: "rgba(203,213,225,0.8)", color: "#64748b" }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {detail && (
        <div className="glass rounded-2xl p-5 border border-[#d97706]/20">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Certificate Detail</p>
              <p className="font-semibold text-slate-900 text-lg">{detail.recipientName ?? detail.studentName}</p>
              <p className="text-slate-500 text-xs mt-0.5">{detail.studentId ?? detail.id} · {detail.dept}, {detail.institute}</p>
            </div>
            <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Close ✕</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {[
              { label: "Cert ID", value: detail.id },
              { label: "Title", value: detail.title ?? detail.event ?? "—" },
              { label: "Issued", value: detail.issuedAt },
              { label: "Tier", value: detail.tier },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                <p className="text-slate-900 text-xs font-semibold break-all">{value}</p>
              </div>
            ))}
          </div>
          {detail.description && (
            <div className="bg-slate-50 rounded-xl px-3 py-2 mb-4">
              <p className="text-slate-400 text-xs mb-0.5">Description</p>
              <p className="text-slate-900 text-sm font-medium">{detail.description}</p>
            </div>
          )}
          <button
            onClick={() => toggleRevoke(detail.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              detail.status === "valid"
                ? "bg-red-500/10 text-red-500 border-red-500/25 hover:bg-red-500/20"
                : "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/25 hover:bg-[#10b981]/20"
            }`}
          >
            {detail.status === "valid" ? <><ShieldX size={13} /> Revoke Certificate</> : <><ShieldCheck size={13} /> Restore Certificate</>}
          </button>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? <p className="text-center text-slate-400 text-sm py-10">Loading certificates…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left py-3 px-5 font-medium">Student</th>
                  <th className="text-left py-3 px-5 font-medium hidden sm:table-cell">Title</th>
                  <th className="text-left py-3 px-5 font-medium hidden md:table-cell">Tier</th>
                  <th className="text-left py-3 px-5 font-medium hidden lg:table-cell">Issued</th>
                  <th className="text-center py-3 px-5 font-medium">Status</th>
                  <th className="text-right py-3 px-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const name = c.recipientName ?? c.studentName ?? "Unknown";
                  return (
                    <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{name[0] ?? "?"}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
                            <p className="text-xs text-slate-400 hidden sm:block">{c.studentId ?? c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 hidden sm:table-cell"><p className="text-xs text-slate-600 max-w-50 truncate">{c.achievement ?? c.title ?? c.event}</p></td>
                      <td className="py-3.5 px-5 hidden md:table-cell"><span className="text-xs text-slate-500 capitalize">{c.tier}</span></td>
                      <td className="py-3.5 px-5 hidden lg:table-cell"><div className="flex items-center gap-1.5 text-xs text-slate-400"><Calendar size={11} /> {c.issuedAt}</div></td>
                      <td className="py-3.5 px-5 text-center">
                        {c.status === "valid" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#10b981]/12 text-[#10b981] border border-[#10b981]/25"><ShieldCheck size={11} /> Valid</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/12 text-red-500 border border-red-500/25"><ShieldX size={11} /> Revoked</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => setDetail(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors" title="View"><Eye size={14} /></button>
                          <button onClick={() => toggleRevoke(c.id)} className={`p-1.5 rounded-lg transition-colors ${c.status === "valid" ? "text-slate-400 hover:text-red-400 hover:bg-red-50" : "text-slate-400 hover:text-[#10b981] hover:bg-[#10b981]/10"}`} title={c.status === "valid" ? "Revoke" : "Restore"}>
                            {c.status === "valid" ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No certificates found.</p>}
          </div>
        )}
        <div className="px-5 py-3 border-t border-slate-50 text-xs text-slate-400">{filtered.length} of {certs.length} certificates</div>
      </div>

      {issueOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-heading font-bold text-slate-900 flex items-center gap-2"><Award size={18} className="text-[#d97706]" /> Issue New Certificate</h2>
              <button onClick={() => setIssueOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">User ID (optional)</label>
                  <input type="number" min={1} value={form.userId} onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))} placeholder="e.g. 12" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Student Name *</label>
                  <input value={form.studentName} onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))} placeholder="e.g. Jane Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Student ID</label>
                  <input value={form.studentId} onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))} placeholder="011241001" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Department</label>
                  <input value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} placeholder="CSE" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Institute</label>
                <input value={form.institute} onChange={(e) => setForm((f) => ({ ...f, institute: e.target.value }))} placeholder="United International University" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Achievement *</label>
                <input value={form.achievement} onChange={(e) => setForm((f) => ({ ...f, achievement: e.target.value }))} placeholder="e.g. BdMO Champion" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Event</label>
                  <input value={form.event} onChange={(e) => setForm((f) => ({ ...f, event: e.target.value }))} placeholder="BdMO 2026" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Event Type</label>
                  <select value={form.eventType} onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all">
                    {["Competition", "Training", "Workshop", "Seminar", "Mock Exam"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Tier</label>
                  <select value={form.tier} onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all">
                    {["gold", "silver", "bronze"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Issue Date *</label>
                  <input type="date" value={form.issuedAt} onChange={(e) => setForm((f) => ({ ...f, issuedAt: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Signatory</label>
                  <input value={form.signatoryName} onChange={(e) => setForm((f) => ({ ...f, signatoryName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Signatory Title</label>
                  <input value={form.signatoryTitle} onChange={(e) => setForm((f) => ({ ...f, signatoryTitle: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/60 transition-all" />
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <Hash size={12} className="text-[#d97706] shrink-0" />
                Certificate ID will be auto-generated as <span className="font-mono font-semibold text-slate-700">UIU-CMOR-YYYY-NNN</span>.
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setIssueOpen(false)} className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={issueCert} disabled={!form.studentName || !form.achievement || !form.issuedAt || saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all">
                <Award size={14} /> {saving ? "Issuing…" : "Issue Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}