"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Notice, Tier } from "@/types";
import { Bell, Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, Pin } from "lucide-react";

const priorityConfig = {
  high: { label: "Important", bg: "bg-red-500/15 text-red-400" },
  normal: { label: "Notice", bg: "bg-blue-500/15 text-blue-400" },
  low: { label: "Info", bg: "bg-slate-50 text-slate-400" },
};

const tierColors: Record<Tier | "All", string> = {
  All: "#a78bfa",
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
};

const tiers: (Tier | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];
const audiences: Notice["audience"][] = ["all", "students", "faculty"];
const statuses: Notice["status"][] = ["draft", "published", "archived"];

interface FormState {
  title: string;
  body: string;
  tier: Tier | "All";
  priority: Notice["priority"];
  audience: Notice["audience"];
  status: Notice["status"];
  pinned: boolean;
}

const emptyForm = (): FormState => ({
  title: "",
  body: "",
  tier: "All",
  priority: "normal",
  audience: "all",
  status: "published",
  pinned: false,
});

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [filterTier, setFilterTier] = useState<Tier | "All">("All");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.notices.list();
      setNotices(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load notices.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = notices.filter((n) => filterTier === "All" || n.tier === filterTier || n.tier === "All");
  const sorted = [...filtered].sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return new Date(b.createdAt ?? b.publishedAt ?? 0).getTime() - new Date(a.createdAt ?? a.publishedAt ?? 0).getTime();
  });

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (n: Notice) => {
    setEditId(n.id);
    setForm({
      title: n.title,
      body: n.body,
      tier: n.tier,
      priority: n.priority,
      audience: n.audience ?? "all",
      status: n.status ?? "published",
      pinned: n.pinned ?? false,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm());
  };

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        await api.admin.notices.update(editId, form as unknown as Record<string, unknown>);
      } else {
        await api.admin.notices.create(form as unknown as Record<string, unknown>);
      }
      await load();
      closeForm();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to save notice.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.notices.remove(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
      setDeleteId(null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to delete.";
      setError(msg);
    }
  };

  const togglePin = async (id: string) => {
    try {
      const updated = await api.admin.notices.togglePin(id);
      const pinnedId = (updated as { id?: string }).id;
      setNotices((prev) =>
        prev.map((n) =>
          pinnedId && n.id === pinnedId
            ? { ...n, pinned: (updated as { pinned?: boolean }).pinned ?? !n.pinned }
            : n
        )
      );
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to toggle pin.";
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Bell size={24} className="text-[#d97706]" /> Notices
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage announcements for students.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all"
        >
          <Plus size={15} /> New Notice
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      {/* Tier filter */}
      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setFilterTier(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterTier === t ? "text-slate-900" : "bg-slate-50 text-slate-500 hover:text-slate-900"
            }`}
            style={filterTier === t ? { backgroundColor: tierColors[t] } : {}}
          >
            {t === "All" ? "All Tiers" : t}
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="glass rounded-2xl p-5 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-slate-900 text-sm">
              {editId ? "Edit Notice" : "New Notice"}
            </h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-900 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notice title"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all"
            />
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Notice body / details..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tier</label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value as Tier | "All" })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all"
                >
                  {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Notice["priority"] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all"
                >
                  <option value="high">Important</option>
                  <option value="normal">Normal</option>
                  <option value="low">Info</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value as Notice["audience"] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all"
                >
                  {audiences.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Notice["status"] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                className="accent-[#d97706]"
              />
              Pin to top
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={closeForm} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!form.title.trim() || !form.body.trim() || saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white disabled:opacity-40 transition-all hover:scale-105 disabled:hover:scale-100"
            >
              {saving ? "Saving…" : editId ? "Save Changes" : "Post Notice"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-4 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">
            Delete notice <span className="text-red-400 font-semibold">&ldquo;{notices.find(n => n.id === deleteId)?.title}&rdquo;</span>?
          </p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Notices list */}
      {loading ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-400 text-sm">Loading notices…</div>
      ) : (
        <div className="space-y-3">
          {sorted.map((notice) => {
            const pCfg = priorityConfig[notice.priority];
            const tierColor = tierColors[notice.tier];
            const isOpen = expanded === notice.id;

            return (
              <div
                key={notice.id}
                className={`glass rounded-2xl overflow-hidden ${notice.priority === "high" ? "border border-red-500/20" : "border border-slate-100"}`}
              >
                <div className="flex items-start gap-3 px-5 py-4">
                  <button
                    onClick={() => setExpanded(isOpen ? null : notice.id)}
                    className="flex-1 flex items-start gap-3 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {notice.pinned && <Pin size={12} className="text-[#d97706]" />}
                        <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pCfg.bg}`}>
                          {pCfg.label}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${tierColor}18`, color: tierColor }}
                        >
                          {notice.tier}
                        </span>
                        {notice.status && notice.status !== "published" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                            {notice.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{notice.createdAt}</p>
                    </div>
                    {isOpen ? <ChevronUp size={14} className="text-slate-400 mt-0.5 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 mt-0.5 shrink-0" />}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePin(notice.id)}
                      title={notice.pinned ? "Unpin" : "Pin"}
                      className={`p-1.5 rounded-lg transition-colors ${notice.pinned ? "text-[#d97706]" : "text-slate-400 hover:text-[#d97706]"} hover:bg-[#d97706]/10`}
                    >
                      <Pin size={13} />
                    </button>
                    <button onClick={() => openEdit(notice)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteId(notice.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-slate-50">
                    <p className="text-sm text-slate-500 leading-relaxed pt-4">{notice.body}</p>
                    <p className="text-xs text-slate-400 mt-3">Posted by {notice.author || "Admin"}</p>
                  </div>
                )}
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-slate-400 text-sm">
              No notices yet. Click &ldquo;New Notice&rdquo; to post one.
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-slate-400">{sorted.length} notice{sorted.length !== 1 ? "s" : ""}</div>
    </div>
  );
}
