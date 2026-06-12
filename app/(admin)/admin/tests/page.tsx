"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, X, Check, ClipboardList, Search, Globe, Lock, ListPlus, MinusCircle } from "lucide-react";
import type { AbilityLevel, Difficulty, Test, TestType } from "@/types";
import { useQuestionStore } from "@/store/questionStore";
import { useTestStore } from "@/store/testStore";
import {
  ALL_CLASS_YEARS,
  abilityColors,
  abilityToDifficulty,
  classYearOptions,
  normalizeTest,
  stripMathSyntax,
} from "@/lib/diagnostic";

const abilityLevels: AbilityLevel[] = ["Beginner", "Advanced", "Expert"];
const topicList = ["algebra", "combinatorics", "number-theory", "geometry", "inequalities", "mathematical-logic", "mixed"];

function blankTest(): Test {
  return normalizeTest({
    id: "",
    title: "",
    description: "",
    duration: 15,
    difficulty: "Beginner",
    tier: "Beginner",
    topicId: "mixed",
    questionCount: 10,
    isPublic: false,
    source: "",
    tags: [],
    testType: "diagnostic",
    targetClassYear: ALL_CLASS_YEARS,
    abilityLevel: "Beginner",
    questionIds: [],
    randomQuestionCount: 10,
    advancedThreshold: 50,
    expertThreshold: 80,
  });
}

export default function AdminTestsPage() {
  const { tests, addTest, updateTest, removeTest } = useTestStore();
  const { questions } = useQuestionStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Test>(blankTest());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const needle = search.toLowerCase();
    return tests.filter((test) => test.title.toLowerCase().includes(needle) || test.topicId.toLowerCase().includes(needle));
  }, [tests, search]);

  const selectedQuestions = useMemo(
    () => (form.questionIds ?? []).map((id) => questions.find((question) => question.id === id)).filter(Boolean),
    [form.questionIds, questions]
  );

  const availableQuestions = useMemo(() => {
    const needle = questionSearch.toLowerCase();
    const selected = new Set(form.questionIds ?? []);
    return questions
      .filter((question) => !selected.has(question.id))
      .filter((question) => (form.testType !== "diagnostic" || question.isDiagnosticEligible) && question.status !== "draft")
      .filter((question) => {
        const prompt = question.prompt?.value ?? question.content;
        return (
          prompt.toLowerCase().includes(needle) ||
          question.topicId.toLowerCase().includes(needle) ||
          (question.targetClassYear ?? "").toLowerCase().includes(needle) ||
          (question.abilityLevel ?? "").toLowerCase().includes(needle)
        );
      });
  }, [form.questionIds, form.testType, questionSearch, questions]);

  const openCreate = () => {
    setForm(blankTest());
    setTagInput("");
    setQuestionSearch("");
    setError("");
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (test: Test) => {
    setForm(normalizeTest(test));
    setTagInput("");
    setQuestionSearch("");
    setError("");
    setEditId(test.id);
    setShowForm(true);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !form.tags.includes(tag)) setForm({ ...form, tags: [...form.tags, tag] });
    setTagInput("");
  };

  const addQuestion = (id: string) => {
    setForm((prev) => {
      const questionIds = [...(prev.questionIds ?? []), id];
      return normalizeTest({ ...prev, questionIds, questionCount: questionIds.length });
    });
  };

  const removeQuestion = (id: string) => {
    setForm((prev) => {
      const questionIds = (prev.questionIds ?? []).filter((questionId) => questionId !== id);
      return normalizeTest({ ...prev, questionIds, questionCount: questionIds.length });
    });
  };

  const validate = () => {
    const questionCount = form.questionIds?.length ?? 0;
    const drawCount = form.randomQuestionCount ?? 10;
    if (!form.title.trim()) return "Test title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.targetClassYear) return "Class or year is required.";
    if (!form.duration || form.duration < 1) return "Duration must be at least 1 minute.";
    if (form.testType === "diagnostic") {
      if (!form.advancedThreshold || !form.expertThreshold) return "Diagnostic thresholds are required.";
      if (form.advancedThreshold >= form.expertThreshold) return "Expert threshold must be greater than Advanced threshold.";
      if (drawCount < 1) return "Random question count must be at least 1.";
      if (form.isPublic && questionCount < drawCount) return "Published diagnostic tests need enough selected questions for the random draw.";
    }
    return "";
  };

  const save = () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    const ability = form.abilityLevel ?? "Beginner";
    const payload = normalizeTest({
      ...form,
      id: editId ?? `t-${Date.now()}`,
      difficulty: abilityToDifficulty(ability) as Difficulty,
      tier: ability === "Beginner" ? "Beginner" : "Advanced",
      questionCount: form.testType === "diagnostic" ? form.randomQuestionCount ?? 10 : form.questionIds?.length ?? form.questionCount,
    });
    if (editId) updateTest(editId, payload);
    else addTest(payload);
    setShowForm(false);
  };

  const doDelete = () => {
    if (deleteId) removeTest(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-[#d97706]" /> Tests
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create practice tests and diagnostic placement pools.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests..." className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-44 transition-all" />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
            <Plus size={16} /> New Test
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Test" : "New Test"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-sm">
            {(["diagnostic", "practice"] as TestType[]).map((type) => (
              <button
                key={type}
                onClick={() => setForm((prev) => normalizeTest({ ...prev, testType: type, randomQuestionCount: type === "diagnostic" ? prev.randomQuestionCount ?? 10 : prev.randomQuestionCount }))}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize transition-all ${form.testType === type ? "border-[#d97706] bg-[#d97706]/10 text-[#92400e]" : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Test Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Class 10 Diagnostic" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Source</label>
              <input value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. Admin Pool" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description of the test." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Class / Year</label>
              <select value={form.targetClassYear} onChange={(e) => setForm({ ...form, targetClassYear: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {classYearOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Ability</label>
              <select value={form.abilityLevel} onChange={(e) => setForm({ ...form, abilityLevel: e.target.value as AbilityLevel })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {abilityLevels.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Topic</label>
              <select value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {topicList.map((topic) => <option key={topic} value={topic}>{topic.replace(/-/g, " ")}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Duration</label>
              <input type="number" min={1} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Draw Count</label>
              <input type="number" min={1} value={form.randomQuestionCount} onChange={(e) => setForm({ ...form, randomQuestionCount: Number(e.target.value), questionCount: Number(e.target.value) })} disabled={form.testType !== "diagnostic"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all disabled:opacity-50" />
            </div>
          </div>

          {form.testType === "diagnostic" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Advanced Threshold (%)</label>
                <input type="number" min={0} max={100} value={form.advancedThreshold} onChange={(e) => setForm({ ...form, advancedThreshold: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Expert Threshold (%)</label>
                <input type="number" min={0} max={100} value={form.expertThreshold} onChange={(e) => setForm({ ...form, expertThreshold: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Question Bank</p>
                <span className="text-xs text-slate-400">{availableQuestions.length} available</span>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={questionSearch} onChange={(e) => setQuestionSearch(e.target.value)} placeholder="Search question pool..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50" />
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {availableQuestions.map((question) => (
                  <button key={question.id} onClick={() => addQuestion(question.id)} className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-[#d97706]/30 hover:bg-[#d97706]/5 transition-colors">
                    <div className="flex items-start gap-2">
                      <ListPlus size={15} className="text-[#d97706] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-800 line-clamp-2">{question.prompt?.kind === "image" ? "Image prompt" : stripMathSyntax(question.prompt?.value ?? question.content)}</p>
                        <p className="text-xs text-slate-400 mt-1">{question.topicId} · {question.targetClassYear} · {question.abilityLevel}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {availableQuestions.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No available questions.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Selected Questions</p>
                <span className="text-xs text-slate-400">{selectedQuestions.length} selected</span>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {selectedQuestions.map((question) => question && (
                  <div key={question.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-start gap-2">
                    <button onClick={() => removeQuestion(question.id)} className="mt-0.5 text-slate-400 hover:text-red-500">
                      <MinusCircle size={15} />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-800 line-clamp-2">{question.prompt?.kind === "image" ? "Image prompt" : stripMathSyntax(question.prompt?.value ?? question.content)}</p>
                      <p className="text-xs text-slate-400 mt-1">{question.topicId} · {question.targetClassYear} · {question.abilityLevel}</p>
                    </div>
                  </div>
                ))}
                {selectedQuestions.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No questions selected.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Type tag and press Enter" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
              <button onClick={addTag} className="px-4 py-2 rounded-xl bg-[#d97706]/20 text-[#d97706] hover:bg-[#d97706]/30 text-sm transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-[#d97706]/15 text-[#d97706] px-2.5 py-1 rounded-full">
                  {tag}
                  <button onClick={() => setForm({ ...form, tags: form.tags.filter((item) => item !== tag) })} className="hover:text-slate-900 transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setForm({ ...form, isPublic: !form.isPublic })} className={`relative w-10 h-5 rounded-full transition-all ${form.isPublic ? "bg-[#d97706]" : "bg-slate-200"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isPublic ? "left-5" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-slate-500">{form.isPublic ? <span className="flex items-center gap-1"><Globe size={13} /> Published</span> : <span className="flex items-center gap-1"><Lock size={13} /> Draft</span>}</span>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={save} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all">
              <Check size={15} /> {editId ? "Save Changes" : "Create Test"}
            </button>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Delete <span className="text-red-500 font-semibold">{tests.find((test) => test.id === deleteId)?.title}</span>?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                <th className="text-left py-3 px-6 font-medium">Test</th>
                <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Type</th>
                <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Class</th>
                <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Ability</th>
                <th className="text-right py-3 px-6 font-medium hidden lg:table-cell">Draw</th>
                <th className="text-center py-3 px-6 font-medium hidden sm:table-cell">Status</th>
                <th className="text-right py-3 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((test) => (
                <tr key={test.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="text-sm font-medium text-slate-900">{test.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{test.description}</p>
                  </td>
                  <td className="py-3.5 px-6 hidden md:table-cell"><span className="text-xs text-slate-500 capitalize">{test.testType}</span></td>
                  <td className="py-3.5 px-6 hidden lg:table-cell"><span className="text-xs text-slate-500">{test.targetClassYear}</span></td>
                  <td className="py-3.5 px-6 hidden sm:table-cell">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${abilityColors[test.abilityLevel ?? "Beginner"]}18`, color: abilityColors[test.abilityLevel ?? "Beginner"] }}>
                      {test.abilityLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right hidden lg:table-cell"><span className="text-sm text-slate-500">{test.randomQuestionCount ?? test.questionCount}</span></td>
                  <td className="py-3.5 px-6 text-center hidden sm:table-cell">
                    {test.isPublic ? <span className="text-xs flex items-center justify-center gap-1 text-[#10b981]"><Globe size={11} /> Published</span> : <span className="text-xs flex items-center justify-center gap-1 text-slate-400"><Lock size={11} /> Draft</span>}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(test)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(test.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No tests found.</p>}
        <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">{filtered.length} of {tests.length} tests</div>
      </div>
    </div>
  );
}
