"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Check, BookOpen } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Topic, Tier } from "@/types";

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";
const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Elite"];
const tiers: Tier[] = ["Beginner", "Intermediate", "Advanced"];
const colorOptions = ["#d97706", "#f59e0b", "#0891b2", "#059669", "#be185d", "#ef4444", "#3b82f6"];
const diffColors: Record<string, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706", Elite: "#ef4444" };
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };

interface TopicForm {
  name: string;
  slug: string;
  description: string;
  tier: Tier;
  level: Difficulty;
  lessonCount: number;
  problemCount: number;
  color: string;
}

const blank = (): TopicForm => ({
  slug: "", name: "", description: "", tier: "Beginner", level: "Intermediate", lessonCount: 0, problemCount: 0, color: "#d97706",
});

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TopicForm>(blank());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.topics.list();
      setTopics(Array.isArray(data) ? (data as Topic[]) : []);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load topics.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const openCreate = () => { setForm(blank()); setEditId(null); setShowForm(true); };
  const openEdit = (t: Topic) => {
    setForm({
      slug: t.slug,
      name: t.name,
      description: t.description ?? "",
      tier: t.tier,
      level: t.level,
      lessonCount: t.lessonCount,
      problemCount: t.problemCount,
      color: t.color ?? "#d97706",
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const slug = form.slug || autoSlug(form.name);
      const payload = {
        name: form.name,
        slug,
        description: form.description,
        tier: form.tier,
        level: form.level,
        color: form.color,
        lesson_count: form.lessonCount,
        problem_count: form.problemCount,
      };
      if (editId) {
        await api.admin.topics.update(editId, payload as unknown as Record<string, unknown>);
      } else {
        await api.admin.topics.create(payload as unknown as Record<string, unknown>);
      }
      await load();
      setShowForm(false);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to save topic.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await api.admin.topics.remove(deleteId);
      setTopics((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to delete topic.";
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={24} className="text-[#d97706]" /> Topics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage the mathematics syllabus topics available to students.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
          <Plus size={16} /> New Topic
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Topic" : "New Topic"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Topic Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
                placeholder="e.g. Number Theory" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Slug (URL)</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="number-theory" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all font-mono text-xs" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} placeholder="Brief description of the topic..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Tier</label>
              <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as Tier })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {tiers.map((t) => <option key={t} value={t} >{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Difficulty</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Difficulty })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {difficulties.map((d) => <option key={d} value={d} >{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Lessons</label>
              <input type="number" min={0} value={form.lessonCount} onChange={(e) => setForm({ ...form, lessonCount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Problems</label>
              <input type="number" min={0} value={form.problemCount} onChange={(e) => setForm({ ...form, problemCount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Color</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {colorOptions.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })}
                    className={`w-6 h-6 rounded-full transition-all ${form.color === c ? "ring-2 ring-white ring-offset-1 ring-offset-[#0d0d1a] scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={save} disabled={!form.name.trim() || saving}
              className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
              <Check size={15} /> {saving ? "Saving…" : editId ? "Save Changes" : "Create Topic"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Delete <span className="text-red-400 font-semibold">&ldquo;{topics.find(t => t.id === deleteId)?.name}&rdquo;</span>?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Topics grid */}
      {loading ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-400 text-sm">Loading topics…</div>
      ) : topics.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-400 text-sm">No topics yet. Click &ldquo;New Topic&rdquo; to create one.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {topics.map((t) => (
            <div key={t.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0" style={{ backgroundColor: `${t.color ?? "#d97706"}20`, color: t.color ?? "#d97706" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-heading font-semibold text-slate-900">{t.name}</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[t.tier]}15`, color: tierColors[t.tier] }}>{t.tier}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${diffColors[t.level]}18`, color: diffColors[t.level] }}>{t.level}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{t.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-400">
                    <span>{t.lessonCount} lessons</span>
                    <span>{t.problemCount} problems</span>
                    <span className="font-mono text-[#d97706]/70">/topics/{t.slug}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                <button onClick={() => setDeleteId(t.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
