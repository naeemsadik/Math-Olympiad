"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Check, FileText, Search } from "lucide-react";
import { sampleQuestions } from "@/lib/mock/tests";
import type { Question, Tier } from "@/types";

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";
const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Elite"];
const tiers: Tier[] = ["Beginner", "Intermediate", "Advanced"];
const topicList = ["algebra", "combinatorics", "number-theory", "geometry", "inequalities", "mathematical-logic"];
const diffColors: Record<string, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706", Elite: "#ef4444" };
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };

const blankQ = (): Omit<Question, "id"> => ({
  content: "", options: ["", "", "", ""], correctOption: 0, explanation: "", topicId: "number-theory", difficulty: "Intermediate", tier: "Beginner",
});

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(blankQ());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = questions.filter(
    (q) => q.content.toLowerCase().includes(search.toLowerCase()) || q.topicId.includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(blankQ()); setEditId(null); setShowForm(true); };
  const openEdit = (q: Question) => {
    setForm({ content: q.content, options: [...q.options], correctOption: q.correctOption, explanation: q.explanation, topicId: q.topicId, difficulty: q.difficulty, tier: q.tier });
    setEditId(q.id); setShowForm(true);
  };

  const setOption = (i: number, val: string) => {
    const opts = [...form.options]; opts[i] = val; setForm({ ...form, options: opts });
  };

  const save = () => {
    if (!form.content.trim()) return;
    if (editId) {
      setQuestions((prev) => prev.map((q) => q.id === editId ? { ...q, ...form } : q));
    } else {
      setQuestions((prev) => [...prev, { id: `q${Date.now()}`, ...form }]);
    }
    setShowForm(false);
  };

  const doDelete = () => { if (deleteId) setQuestions((prev) => prev.filter((q) => q.id !== deleteId)); setDeleteId(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={24} className="text-[#d97706]" /> Practice Questions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage all MCQ practice problems across topics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..."
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-48 transition-all" />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Question" : "New Question"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Problem Statement</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={3} placeholder="Question content (LaTeX supported with $...$ syntax)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Answer Options (select correct one)</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button onClick={() => setForm({ ...form, correctOption: i })}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${form.correctOption === i ? "bg-[#10b981] border-[#10b981]" : "border-white/[0.2] hover:border-[#d97706]"}`}>
                    {form.correctOption === i && <Check size={12} className="text-slate-900" />}
                  </button>
                  <input value={opt} onChange={(e) => setOption(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Explanation</label>
            <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={2} placeholder="Explain the correct answer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Topic</label>
              <select value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {topicList.map((t) => <option key={t} value={t} >{t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {difficulties.map((d) => <option key={d} value={d} >{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Tier</label>
              <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as Tier })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {tiers.map((t) => <option key={t} value={t} >{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={save} disabled={!form.content.trim()}
              className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
              <Check size={15} /> {editId ? "Save Changes" : "Add Question"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Permanently delete this question?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Questions table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
              <th className="text-left py-3 px-6 font-medium">Question</th>
              <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Topic</th>
              <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Difficulty</th>
              <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Correct Answer</th>
              <th className="text-right py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                <td className="py-3.5 px-6">
                  <p className="text-sm text-slate-900 line-clamp-2 max-w-xs">{q.content.replace(/\$/g, "").replace(/\\/g, "")}</p>
                </td>
                <td className="py-3.5 px-6 hidden md:table-cell">
                  <span className="text-xs text-slate-500">{q.topicId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                </td>
                <td className="py-3.5 px-6 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[q.tier]}15`, color: tierColors[q.tier] }}>{q.tier}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${diffColors[q.difficulty]}18`, color: diffColors[q.difficulty] }}>{q.difficulty}</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 hidden lg:table-cell">
                  <span className="text-xs text-[#10b981] font-medium">{q.options[q.correctOption]?.replace(/\$/g, "") || "—"}</span>
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(q.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No questions found.</p>}
        <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">{filtered.length} of {questions.length} questions</div>
      </div>
    </div>
  );
}
