"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText, LayoutGrid, Sliders, Plus, Pencil, Trash2, X,
  Search, ChevronUp, ChevronDown, Save, GripVertical,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

type Tab = "pages" | "sections" | "settings";

interface Page {
  id: string;
  slug: string;
  title: string;
  intro: string | null;
  body: string | null;
  meta?: Record<string, unknown> | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  widgets?: Array<{
    id: string;
    widgetType: string;
    data: Record<string, unknown>;
    position: number;
  }>;
}

interface PageForm {
  id: string | null;
  slug: string;
  title: string;
  intro: string;
  body: string;
  status: "draft" | "published";
  publishedAt: string;
}

interface HomeSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  data: Record<string, unknown> | null;
  sortOrder: number;
  published: boolean;
}

interface HomeSectionForm {
  id: string | null;
  sectionKey: string;
  title: string;
  subtitle: string;
  dataJson: string;
  sortOrder: number;
  published: boolean;
}

interface Setting {
  key: string;
  value: string;
  type: "string" | "integer" | "boolean" | "json";
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const emptyPage = (): PageForm => ({
  id: null,
  slug: "",
  title: "",
  intro: "",
  body: "",
  status: "draft",
  publishedAt: "",
});

const emptySection = (): HomeSectionForm => ({
  id: null,
  sectionKey: "",
  title: "",
  subtitle: "",
  dataJson: "{}",
  sortOrder: 99,
  published: true,
});

const emptySetting = (): { key: string; value: string; type: Setting["type"] } => ({
  key: "",
  value: "",
  type: "string",
});

const sectionToForm = (s: HomeSection): HomeSectionForm => ({
  id: s.id,
  sectionKey: s.sectionKey,
  title: s.title,
  subtitle: s.subtitle ?? "",
  dataJson: JSON.stringify(s.data ?? {}, null, 2),
  sortOrder: s.sortOrder,
  published: s.published,
});

const pageToForm = (p: Page): PageForm => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  intro: p.intro ?? "",
  body: p.body ?? "",
  status: p.status,
  publishedAt: p.publishedAt ? p.publishedAt.slice(0, 16) : "",
});

// --------------------------------------------------------------------------
// Shared chrome
// --------------------------------------------------------------------------

function Tabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "pages",    label: "Pages",          icon: <FileText size={15} /> },
    { key: "sections", label: "Home sections",  icon: <LayoutGrid size={15} /> },
    { key: "settings", label: "Site settings",  icon: <Sliders size={15} /> },
  ];
  return (
    <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            value === t.key
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-700"><X size={14} /></button>
    </div>
  );
}

function Modal({
  title, onClose, children, maxWidth = "max-w-2xl",
}: { title: string; onClose: () => void; children: React.ReactNode; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-y-auto max-h-[90vh]`}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-heading font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel, busy }: { onConfirm: () => void; onCancel: () => void; busy: boolean }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-heading font-semibold text-slate-900">Confirm delete</h3>
        <p className="text-sm text-slate-500 mt-2">This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Pages tab
// --------------------------------------------------------------------------

function PagesTab() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [form, setForm] = useState<PageForm>(emptyPage());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.admin.pages.list();
      const list = Array.isArray(res) ? res : (res as { data?: Page[] }).data ?? [];
      setPages(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pages
      .filter((p) => filterStatus === "all" || p.status === filterStatus)
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }, [pages, search, filterStatus]);

  const openCreate = () => { setForm(emptyPage()); setShowForm(true); };
  const openEdit = (p: Page) => { setForm(pageToForm(p)); setShowForm(true); };

  const save = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.slug.trim()) return setError("Slug is required.");
    setSaving(true); setError(null);
    try {
      const payload: Record<string, unknown> = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        intro: form.intro || null,
        body: form.body || null,
        status: form.status,
        published_at: form.status === "published"
          ? (form.publishedAt || new Date().toISOString())
          : null,
      };
      if (form.id) {
        await api.admin.pages.update(form.id, payload);
      } else {
        await api.admin.pages.create(payload);
      }
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save page.");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.admin.pages.remove(deleteId);
      setPages((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete page.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages…" className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 outline-none focus:border-[#d97706]/50 w-56" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#d97706]/50">
            <option value="all">All status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#d97706]/20 hover:scale-105 transition-all">
          <Plus size={15} /> New page
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading pages…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 text-sm text-slate-500 py-12 text-center">
          No pages found.
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {filtered.map((p) => {
            const open = expanded === p.id;
            return (
              <div key={p.id} className="border-b border-slate-200 last:border-b-0">
                <div className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <button onClick={() => setExpanded(open ? null : p.id)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
                    {open ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${p.status === "published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>{p.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/{p.slug}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-500 hover:bg-[#d97706]/10 hover:text-[#d97706] transition-colors" title="Edit"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                {open && (
                  <div className="px-5 pb-4 text-xs text-slate-600 space-y-2 bg-slate-50/50 border-t border-slate-200">
                    {p.intro && <div><span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Intro</span><p className="mt-1 text-slate-700">{p.intro}</p></div>}
                    {p.body && (
                      <div>
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Body</span>
                        <pre className="mt-1 whitespace-pre-wrap text-slate-700 bg-white border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto font-sans">{p.body}</pre>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Updated {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—"}</span>
                      {p.publishedAt && <span>Published {new Date(p.publishedAt).toLocaleString()}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <Modal title={form.id ? "Edit page" : "New page"} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: f.id ? f.slug : slugify(title) }));
                }}
                placeholder="About the Olympiad"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder="about-the-olympiad"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 outline-none focus:border-[#d97706]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intro</label>
              <textarea
                value={form.intro}
                onChange={(e) => setForm({ ...form, intro: e.target.value })}
                rows={2}
                placeholder="One-paragraph summary shown above the body."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Body (Markdown)</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={10}
                placeholder={"## Overview\n\nWrite the full content here. Markdown is supported."}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-mono outline-none focus:border-[#d97706]/50 resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PageForm["status"] })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Publish at</label>
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  disabled={form.status !== "published"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all">
                <Save size={14} /> {saving ? "Saving…" : form.id ? "Save changes" : "Create page"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDelete busy={deleting} onConfirm={doDelete} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Home sections tab
// --------------------------------------------------------------------------

function SectionsTab() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HomeSectionForm>(emptySection());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.admin.homeSections.list();
      const list = Array.isArray(res) ? res : (res as { data?: HomeSection[] }).data ?? [];
      setSections([...list].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load home sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const move = async (id: string, direction: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(next);
    setReordering(true);
    try {
      await api.admin.homeSections.reorder(next.map((s) => s.id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to reorder.");
      await load();
    } finally {
      setReordering(false);
    }
  };

  const openCreate = () => { setForm(emptySection()); setShowForm(true); };
  const openEdit = (s: HomeSection) => { setForm(sectionToForm(s)); setShowForm(true); };

  const save = async () => {
    if (!form.sectionKey.trim()) return setError("Section key is required.");
    if (!form.title.trim()) return setError("Title is required.");
    let data: Record<string, unknown> | null = null;
    if (form.dataJson.trim()) {
      try { data = JSON.parse(form.dataJson); }
      catch { return setError("Data must be valid JSON."); }
    }
    setSaving(true); setError(null);
    try {
      const payload: Record<string, unknown> = {
        section_key: form.sectionKey.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle || null,
        data,
        sort_order: Number(form.sortOrder) || 0,
        published: !!form.published,
      };
      if (form.id) {
        await api.admin.homeSections.update(form.id, payload);
      } else {
        await api.admin.homeSections.create(payload);
      }
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save section.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Drag the arrows (or use the up/down buttons) to reorder homepage sections. The lowest sort_order appears first on the public home page.</p>
        <button onClick={openCreate} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#d97706]/20 hover:scale-105 transition-all shrink-0">
          <Plus size={15} /> New section
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading sections…</div>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 text-sm text-slate-500 py-12 text-center">No home sections defined.</div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {sections.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 last:border-b-0">
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => move(s.id, -1)} disabled={idx === 0 || reordering} className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400" title="Move up"><ChevronUp size={14} /></button>
                <button onClick={() => move(s.id, 1)} disabled={idx === sections.length - 1 || reordering} className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400" title="Move down"><ChevronDown size={14} /></button>
              </div>
              <GripVertical size={14} className="text-slate-300 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900 truncate">{s.title}</p>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{s.sectionKey}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                    {s.published ? "Published" : "Hidden"}
                  </span>
                </div>
                {s.subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{s.subtitle}</p>}
              </div>
              <span className="text-xs text-slate-400 font-mono shrink-0">order: {s.sortOrder}</span>
              <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-slate-500 hover:bg-[#d97706]/10 hover:text-[#d97706] transition-colors shrink-0" title="Edit"><Pencil size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={form.id ? "Edit home section" : "New home section"} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Section key</label>
                <input
                  value={form.sectionKey}
                  onChange={(e) => setForm({ ...form, sectionKey: slugify(e.target.value) })}
                  placeholder="hero"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 outline-none focus:border-[#d97706]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Hero banner"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtitle</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Shown under the title"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data (JSON)</label>
              <textarea
                value={form.dataJson}
                onChange={(e) => setForm({ ...form, dataJson: e.target.value })}
                rows={8}
                placeholder='{ "ctaLabel": "Start practicing", "ctaHref": "/signup" }'
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-mono outline-none focus:border-[#d97706]/50 resize-y"
              />
              <p className="text-[11px] text-slate-500">Arbitrary JSON used by the frontend to render this section. Leave empty to clear.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
              Published (visible on the public home page)
            </label>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all">
                <Save size={14} /> {saving ? "Saving…" : form.id ? "Save changes" : "Create section"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Site settings tab
// --------------------------------------------------------------------------

function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptySetting());

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.admin.settings.list();
      const data = (res as { data?: Record<string, Setting> }).data ?? (res as Record<string, Setting>);
      setSettings(data ?? {});
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return Object.entries(settings).filter(([k]) => !q || k.toLowerCase().includes(q));
  }, [settings, search]);

  const openEdit = (key: string) => {
    setEditing(key);
    const s = settings[key];
    setDraftValue(s.type === "json" ? JSON.stringify(s.value, null, 2) : String(s.value));
  };

  const save = async (key: string) => {
    const original = settings[key];
    let value: unknown = draftValue;
    if (original.type === "json") {
      try { value = JSON.parse(draftValue); }
      catch { return setError("Invalid JSON."); }
    } else if (original.type === "integer") {
      value = Number(draftValue);
      if (!Number.isFinite(value)) return setError("Invalid integer.");
    } else if (original.type === "boolean") {
      value = draftValue === "true" || draftValue === "1";
    }
    setSaving(true); setError(null);
    try {
      await api.admin.settings.update(key, { value, type: original.type });
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save setting.");
    } finally {
      setSaving(false);
    }
  };

  const create = async () => {
    if (!createForm.key.trim()) return setError("Key is required.");
    let value: unknown = createForm.value;
    if (createForm.type === "json") {
      try { value = createForm.value ? JSON.parse(createForm.value) : null; }
      catch { return setError("Invalid JSON."); }
    } else if (createForm.type === "integer") {
      value = Number(createForm.value);
    } else if (createForm.type === "boolean") {
      value = createForm.value === "true" || createForm.value === "1";
    }
    setSaving(true); setError(null);
    try {
      await api.admin.settings.update(createForm.key.trim(), { value, type: createForm.type });
      setShowCreate(false);
      setCreateForm(emptySetting());
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to create setting.");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteKey) return;
    try {
      await api.admin.settings.remove(deleteKey);
      setSettings((prev) => {
        const next = { ...prev };
        delete next[deleteKey];
        return next;
      });
      setDeleteKey(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete setting.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search keys…" className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 outline-none focus:border-[#d97706]/50 w-56" />
        </div>
        <button onClick={() => { setCreateForm(emptySetting()); setShowCreate(true); }} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-[#d97706]/20 hover:scale-105 transition-all">
          <Plus size={15} /> New setting
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="text-sm text-slate-500 py-8 text-center">Loading settings…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 text-sm text-slate-500 py-12 text-center">No settings defined.</div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {filtered.map(([key, s]) => {
            const isEditing = editing === key;
            return (
              <div key={key} className="border-b border-slate-200 last:border-b-0 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 font-mono">{key}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{s.type}</span>
                    </div>
                    {!isEditing ? (
                      <pre className="mt-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 overflow-x-auto max-h-32 whitespace-pre-wrap font-mono">{s.type === "json" ? JSON.stringify(s.value, null, 2) : String(s.value)}</pre>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {s.type === "json" ? (
                          <textarea value={draftValue} onChange={(e) => setDraftValue(e.target.value)} rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#d97706]/50" />
                        ) : s.type === "boolean" ? (
                          <select value={draftValue} onChange={(e) => setDraftValue(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-[#d97706]/50">
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : (
                          <input value={draftValue} onChange={(e) => setDraftValue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#d97706]/50" />
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => save(key)} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-orange text-white disabled:opacity-50">
                            <Save size={12} /> Save
                          </button>
                          <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(key)} className="p-2 rounded-lg text-slate-500 hover:bg-[#d97706]/10 hover:text-[#d97706]" title="Edit"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteKey(key)} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <Modal title="New site setting" onClose={() => setShowCreate(false)} maxWidth="max-w-md">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key</label>
              <input value={createForm.key} onChange={(e) => setCreateForm({ ...createForm, key: slugify(e.target.value) })} placeholder="hero_cta_label" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-[#d97706]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
              <select value={createForm.type} onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as Setting["type"] })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#d97706]/50">
                <option value="string">String</option>
                <option value="integer">Integer</option>
                <option value="boolean">Boolean</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</label>
              {createForm.type === "json" ? (
                <textarea value={createForm.value} onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })} rows={4} placeholder='{ "key": "value" }' className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-[#d97706]/50" />
              ) : createForm.type === "boolean" ? (
                <select value={createForm.value} onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#d97706]/50">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input value={createForm.value} onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#d97706]/50" />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
              <button onClick={create} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-50 transition-all">
                <Save size={14} /> {saving ? "Saving…" : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteKey && (
        <ConfirmDelete busy={false} onConfirm={doDelete} onCancel={() => setDeleteKey(null)} />
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Page root
// --------------------------------------------------------------------------

export default function AdminCmsPage() {
  const [tab, setTab] = useState<Tab>("pages");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={24} className="text-[#d97706]" /> Content
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage the public website: pages, homepage sections, and key/value site settings.</p>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} />

      {tab === "pages"    && <PagesTab />}
      {tab === "sections" && <SectionsTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}