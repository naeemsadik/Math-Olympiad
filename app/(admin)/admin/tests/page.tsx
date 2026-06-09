"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Check, ClipboardList, Search, Globe, Lock } from "lucide-react";
import type { Test, Difficulty, Tier } from "@/types";

const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Elite"];
const tiers: Tier[] = ["Beginner", "Intermediate", "Advanced"];
const topicList = ["algebra", "combinatorics", "number-theory", "geometry", "inequalities", "mathematical-logic"];
const diffColors: Record<string, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706", Elite: "#ef4444" };
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };

const initialTests: Test[] = [
  { id: "t1", title: "Number Theory Fundamentals", description: "Basic divisibility, primes, and modular arithmetic.", duration: 30, difficulty: "Beginner", tier: "Beginner", topicId: "number-theory", questionCount: 10, isPublic: true, tags: ["primes", "divisibility"] },
  { id: "t2", title: "Algebra Sprint", description: "Polynomials, factorization, and algebraic identities.", duration: 45, difficulty: "Intermediate", tier: "Intermediate", topicId: "algebra", questionCount: 15, isPublic: true, tags: ["polynomials", "factorization"] },
  { id: "t3", title: "Combinatorics Challenge", description: "Counting principles, permutations, and combinations.", duration: 60, difficulty: "Advanced", tier: "Intermediate", topicId: "combinatorics", questionCount: 20, isPublic: false, tags: ["counting", "pigeonhole"] },
  { id: "t4", title: "Geometry Elite", description: "Advanced Euclidean geometry and circle theorems.", duration: 90, difficulty: "Elite", tier: "Advanced", topicId: "geometry", questionCount: 25, isPublic: false, source: "BdMO 2023", tags: ["circles", "triangles"] },
];

type TestForm = Omit<Test, "id">;
const blank = (): TestForm => ({
  title: "", description: "", duration: 30, difficulty: "Intermediate", tier: "Beginner",
  topicId: "number-theory", questionCount: 10, isPublic: true, source: "", tags: [],
});

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TestForm>(blank());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagInput, setTagInput] = useState("");

  const filtered = tests.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.topicId.includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(blank()); setTagInput(""); setEditId(null); setShowForm(true); };
  const openEdit = (t: Test) => {
    setForm({ title: t.title, description: t.description, duration: t.duration, difficulty: t.difficulty, tier: t.tier, topicId: t.topicId, questionCount: t.questionCount, isPublic: t.isPublic, source: t.source ?? "", tags: [...t.tags] });
    setTagInput(""); setEditId(t.id); setShowForm(true);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !form.tags.includes(tag)) setForm({ ...form, tags: [...form.tags, tag] });
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const save = () => {
    if (!form.title.trim()) return;
    if (editId) {
      setTests((prev) => prev.map((t) => t.id === editId ? { ...t, ...form } : t));
    } else {
      setTests((prev) => [...prev, { id: `t${Date.now()}`, ...form }]);
    }
    setShowForm(false);
  };

  const doDelete = () => { if (deleteId) setTests((prev) => prev.filter((t) => t.id !== deleteId)); setDeleteId(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-[#d97706]" /> Tests
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage timed practice tests for students.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests..."
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-44 transition-all"
            />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
            <Plus size={16} /> New Test
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Test" : "New Test"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Test Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Number Theory Sprint"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Source (optional)</label>
              <input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g. BdMO 2023"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Brief description of what this test covers..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value as Tier })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
              >
                {tiers.map((t) => <option key={t} value={t} >{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
              >
                {difficulties.map((d) => <option key={d} value={d} >{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Topic</label>
              <select
                value={form.topicId}
                onChange={(e) => setForm({ ...form, topicId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
              >
                {topicList.map((t) => <option key={t} value={t} >{t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Duration (min)</label>
              <input
                type="number" min={5} max={180} value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Questions</label>
              <input
                type="number" min={1} max={100} value={form.questionCount}
                onChange={(e) => setForm({ ...form, questionCount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Type tag and press Enter"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all"
              />
              <button onClick={addTag} className="px-4 py-2 rounded-xl bg-[#d97706]/20 text-[#d97706] hover:bg-[#d97706]/30 text-sm transition-colors">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-[#d97706]/15 text-[#d97706] px-2.5 py-1 rounded-full">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-slate-900 transition-colors"><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
              className={`relative w-10 h-5 rounded-full transition-all ${form.isPublic ? "bg-[#d97706]" : "bg-slate-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isPublic ? "left-5" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-slate-500">
              {form.isPublic ? <span className="flex items-center gap-1"><Globe size={13} /> Visible to all students</span> : <span className="flex items-center gap-1"><Lock size={13} /> Hidden (draft)</span>}
            </span>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button
              onClick={save}
              disabled={!form.title.trim()}
              className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Check size={15} /> {editId ? "Save Changes" : "Create Test"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Delete <span className="text-red-400 font-semibold">&ldquo;{tests.find((t) => t.id === deleteId)?.title}&rdquo;</span>? This cannot be undone.</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Tests table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
              <th className="text-left py-3 px-6 font-medium">Test</th>
              <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Topic</th>
              <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Tier</th>
              <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Difficulty</th>
              <th className="text-right py-3 px-6 font-medium hidden lg:table-cell">Duration</th>
              <th className="text-right py-3 px-6 font-medium hidden lg:table-cell">Questions</th>
              <th className="text-center py-3 px-6 font-medium hidden sm:table-cell">Visibility</th>
              <th className="text-right py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                <td className="py-3.5 px-6">
                  <p className="text-sm font-medium text-slate-900">{t.title}</p>
                  {t.source && <p className="text-xs text-slate-400 mt-0.5">{t.source}</p>}
                  {t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-6 hidden md:table-cell">
                  <span className="text-xs text-slate-500">{t.topicId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                </td>
                <td className="py-3.5 px-6 hidden sm:table-cell">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[t.tier]}15`, color: tierColors[t.tier] }}>{t.tier}</span>
                </td>
                <td className="py-3.5 px-6 hidden sm:table-cell">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${diffColors[t.difficulty]}18`, color: diffColors[t.difficulty] }}>{t.difficulty}</span>
                </td>
                <td className="py-3.5 px-6 text-right hidden lg:table-cell">
                  <span className="text-sm text-slate-500">{t.duration}m</span>
                </td>
                <td className="py-3.5 px-6 text-right hidden lg:table-cell">
                  <span className="text-sm text-slate-500">{t.questionCount}</span>
                </td>
                <td className="py-3.5 px-6 text-center hidden sm:table-cell">
                  {t.isPublic ? (
                    <span className="text-xs flex items-center justify-center gap-1 text-[#10b981]"><Globe size={11} /> Public</span>
                  ) : (
                    <span className="text-xs flex items-center justify-center gap-1 text-slate-400"><Lock size={11} /> Draft</span>
                  )}
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No tests found.</p>}
        <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">{filtered.length} of {tests.length} tests</div>
      </div>
    </div>
  );
}
