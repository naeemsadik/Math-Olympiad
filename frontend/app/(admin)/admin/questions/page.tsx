"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Pencil, X, Check, FileText, Search, Image as ImageIcon, Type, Clock, Tag } from "lucide-react";
import type { AbilityLevel, Question, QuestionFormat, QuestionOption } from "@/types";
import { api, ApiError } from "@/lib/api";
import {
  ALL_CLASS_YEARS,
  abilityColors,
  abilityToDifficulty,
  classYearOptions,
  formatLabels,
  makeImageMedia,
  makeOption,
  makeTextMedia,
  mediaKindForOptions,
  mediaKindForPrompt,
  normalizeQuestion,
  questionFormats,
  stripMathSyntax,
} from "@/lib/diagnostic";

const topicList = ["algebra", "combinatorics", "number-theory", "geometry", "inequalities", "mathematical-logic", "mixed"];
const abilityLevels: AbilityLevel[] = ["Beginner", "Advanced", "Expert"];

function blankQuestion(): Question {
  const format: QuestionFormat = "text-to-text";
  return normalizeQuestion({
    id: "",
    content: "",
    options: ["", ""],
    correctOption: 0,
    explanation: "",
    topicId: "number-theory",
    difficulty: "Beginner",
    tier: "Beginner",
    format,
    prompt: makeTextMedia(""),
    answerOptions: [makeOption(0), makeOption(1)],
    timeLimitSeconds: 90,
    targetClassYear: ALL_CLASS_YEARS,
    abilityLevel: "Beginner",
    marks: 1,
    subtopicTags: [],
    source: "",
    status: "published",
    isDiagnosticEligible: true,
  });
}

function optionLabel(index: number) {
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}

function readImage(file: File | undefined, onLoad: (value: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result ?? ""));
  reader.readAsDataURL(file);
}

function mediaPreview(media = makeTextMedia("")) {
  if (media.kind === "image") {
    return media.value ? (
      <img src={media.value} alt={media.alt ?? "Uploaded media"} className="h-20 w-full rounded-lg object-contain bg-slate-50 border border-slate-200" />
    ) : (
      <div className="h-20 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
        <ImageIcon size={18} />
      </div>
    );
  }
  return <span>{stripMathSyntax(media.value || "")}</span>;
}

function buildPayload(form: Question) {
  const ability = form.abilityLevel ?? "Beginner";
  return {
    content: form.prompt?.value ?? form.content ?? "",
    topic_id: form.topicId && form.topicId !== "mixed" ? Number(form.topicId) || null : null,
    difficulty: abilityToDifficulty(ability),
    tier: ability === "Beginner" ? "Beginner" : "Advanced",
    format: form.format ?? "text-to-text",
    prompt_kind: form.prompt?.kind ?? "text",
    prompt_value: form.prompt?.value ?? null,
    prompt_alt: form.prompt?.alt ?? null,
    ability_level: ability,
    target_class_year: form.targetClassYear ?? null,
    marks: form.marks ?? 1,
    time_limit_seconds: form.timeLimitSeconds ?? 90,
    subtopic_tags: form.subtopicTags ?? [],
    source: form.source ?? null,
    explanation: form.explanation ?? "",
    status: form.status ?? "published",
    is_diagnostic_eligible: form.isDiagnosticEligible ?? true,
    options: (form.answerOptions ?? []).map((opt, i) => ({
      id: opt.id && /^\d+$/.test(opt.id) ? Number(opt.id) : undefined,
      label: optionLabel(i),
      media_kind: opt.media?.kind ?? "text",
      media_value: opt.media?.value ?? null,
      media_alt: opt.media?.alt ?? null,
      is_correct: !!opt.isCorrect,
      order: i,
    })),
  };
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Question>(blankQuestion());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [validation, setValidation] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.questions.list();
      const list = Array.isArray(res) ? res : (res as { data?: Question[] }).data ?? [];
      setQuestions(list.map((q) => normalizeQuestion(q)));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load questions.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const needle = search.toLowerCase();
    return questions.filter((q) => {
      const prompt = q.prompt?.value ?? q.content;
      return (
        prompt.toLowerCase().includes(needle) ||
        (q.topicId ?? "").toLowerCase().includes(needle) ||
        (q.targetClassYear ?? "").toLowerCase().includes(needle) ||
        (q.subtopicTags ?? []).some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [questions, search]);

  const openCreate = () => {
    setForm(blankQuestion());
    setTagInput("");
    setValidation("");
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (question: Question) => {
    setForm(normalizeQuestion(question));
    setTagInput("");
    setValidation("");
    setEditId(question.id);
    setShowForm(true);
  };

  const setFormat = (format: QuestionFormat) => {
    const promptKind = mediaKindForPrompt(format);
    const optionKind = mediaKindForOptions(format);
    setForm((prev) =>
      normalizeQuestion({
        ...prev,
        format,
        prompt: promptKind === "image" ? makeImageMedia("", "Question prompt") : makeTextMedia(prev.prompt?.kind === "text" ? prev.prompt.value : ""),
        answerOptions: (prev.answerOptions ?? []).map((option, index) => ({
          ...option,
          media: optionKind === "image" ? makeImageMedia("", `Option ${index + 1}`) : makeTextMedia(option.media.kind === "text" ? option.media.value : ""),
        })),
      })
    );
  };

  const setPromptValue = (value: string) => {
    const kind = mediaKindForPrompt(form.format ?? "text-to-text");
    setForm((prev) =>
      normalizeQuestion({
        ...prev,
        content: value,
        prompt: kind === "image" ? makeImageMedia(value, "Question prompt") : makeTextMedia(value),
      })
    );
  };

  const setOptionValue = (index: number, value: string) => {
    const answerOptions = [...(form.answerOptions ?? [])];
    const option = answerOptions[index];
    answerOptions[index] = {
      ...option,
      media: option.media.kind === "image" ? makeImageMedia(value, `Option ${index + 1}`) : makeTextMedia(value),
    };
    setForm((prev) => normalizeQuestion({ ...prev, answerOptions }));
  };

  const setCorrect = (index: number) => {
    const answerOptions = (form.answerOptions ?? []).map((option, optionIndex) => ({
      ...option,
      isCorrect: optionIndex === index,
    }));
    setForm((prev) => normalizeQuestion({ ...prev, answerOptions, correctOption: index }));
  };

  const addOption = () => {
    const kind = mediaKindForOptions(form.format ?? "text-to-text");
    const answerOptions = [...(form.answerOptions ?? []), makeOption(form.answerOptions?.length ?? 0, kind)];
    setForm((prev) => normalizeQuestion({ ...prev, answerOptions }));
  };

  const removeOption = (index: number) => {
    const answerOptions = (form.answerOptions ?? []).filter((_, optionIndex) => optionIndex !== index);
    if (!answerOptions.some((option) => option.isCorrect) && answerOptions[0]) answerOptions[0].isCorrect = true;
    setForm((prev) => normalizeQuestion({ ...prev, answerOptions }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || form.subtopicTags?.includes(tag)) return;
    setForm((prev) => ({ ...prev, subtopicTags: [...(prev.subtopicTags ?? []), tag] }));
    setTagInput("");
  };

  const validate = () => {
    const prompt = form.prompt;
    const options = form.answerOptions ?? [];
    if (!prompt?.value.trim()) return "Question prompt is required.";
    if (!form.targetClassYear) return "Class or year is required.";
    if (!form.abilityLevel) return "Ability level is required.";
    if (!form.timeLimitSeconds || form.timeLimitSeconds < 15) return "Time limit must be at least 15 seconds.";
    if (options.length < 2) return "Add at least two answer options.";
    if (options.some((option) => !option.media.value.trim())) return "Every option needs text or an image.";
    if (options.filter((option) => option.isCorrect).length !== 1) return "Select exactly one correct answer.";
    return "";
  };

  const save = async () => {
    const v = validate();
    if (v) {
      setValidation(v);
      return;
    }
    setValidation("");
    setSaving(true);
    try {
      const payload = buildPayload(form);
      if (editId) {
        await api.admin.questions.update(editId, payload as unknown as Record<string, unknown>);
      } else {
        await api.admin.questions.create(payload as unknown as Record<string, unknown>);
      }
      await load();
      setShowForm(false);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to save question.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await api.admin.questions.remove(deleteId);
      setQuestions((prev) => prev.filter((q) => q.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to delete question.";
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={24} className="text-[#d97706]" /> Practice Questions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage media-aware MCQ problems for practice and diagnostics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-52 transition-all"
            />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Question" : "New Question"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Question Format</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {questionFormats.map((format) => {
                const active = form.format === format;
                return (
                  <button
                    key={format}
                    onClick={() => setFormat(format)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                      active ? "border-[#d97706] bg-[#d97706]/10 text-[#92400e]" : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {format.startsWith("image") ? <ImageIcon size={13} /> : <Type size={13} />}
                    {formatLabels[format]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Problem Statement</label>
              {form.prompt?.kind === "image" ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => readImage(event.target.files?.[0], setPromptValue)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600"
                  />
                  {mediaPreview(form.prompt)}
                </div>
              ) : (
                <textarea
                  value={form.prompt?.value ?? ""}
                  onChange={(e) => setPromptValue(e.target.value)}
                  rows={4}
                  placeholder="Question content. LaTeX-style text is allowed."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none"
                />
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Class / Year</label>
                <select value={form.targetClassYear} onChange={(e) => setForm({ ...form, targetClassYear: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                  {classYearOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Ability Level</label>
                <select value={form.abilityLevel} onChange={(e) => setForm({ ...form, abilityLevel: e.target.value as AbilityLevel })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                  {abilityLevels.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Topic (slug)</label>
                <select value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                  {topicList.map((topic) => <option key={topic} value={topic}>{topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Time Limit</label>
                <div className="relative">
                  <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={15}
                    value={form.timeLimitSeconds}
                    onChange={(e) => setForm({ ...form, timeLimitSeconds: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Marks</label>
                <input type="number" min={1} value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Source</label>
                <input value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. BdMO 2025" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Answer Options</label>
              <button onClick={addOption} className="flex items-center gap-1 text-xs font-semibold text-[#d97706] hover:text-[#92400e]">
                <Plus size={13} /> Add Option
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-3">
              {(form.answerOptions ?? []).map((option: QuestionOption, index) => (
                <div key={option.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCorrect(index)} className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 ${option.isCorrect ? "bg-[#10b981] border-[#10b981] text-white" : "border-slate-200 text-slate-400 hover:border-[#d97706]"}`}>
                      {optionLabel(index)}
                    </button>
                    {option.media.kind === "image" ? (
                      <input type="file" accept="image/*" onChange={(event) => readImage(event.target.files?.[0], (value) => setOptionValue(index, value))} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600" />
                    ) : (
                      <input value={option.media.value} onChange={(e) => setOptionValue(index, e.target.value)} placeholder={`Option ${optionLabel(index)}`} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50" />
                    )}
                    <button disabled={(form.answerOptions ?? []).length <= 2} onClick={() => removeOption(index)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {option.media.kind === "image" && mediaPreview(option.media)}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Explanation</label>
            <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} placeholder="Explain the correct answer." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Subtopic Tags</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Type tag and press Enter" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50" />
                </div>
                <button onClick={addTag} className="px-4 py-2 rounded-xl bg-[#d97706]/15 text-[#d97706] hover:bg-[#d97706]/25 text-sm font-semibold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(form.subtopicTags ?? []).map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                    {tag}
                    <button onClick={() => setForm({ ...form, subtopicTags: (form.subtopicTags ?? []).filter((item) => item !== tag) })}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={!!form.isDiagnosticEligible} onChange={(e) => setForm({ ...form, isDiagnosticEligible: e.target.checked })} className="accent-[#d97706]" />
                Diagnostic eligible
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.status === "published"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })} className="accent-[#d97706]" />
                Published
              </label>
            </div>
          </div>

          {validation && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{validation}</div>}

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50">
              <Check size={15} /> {saving ? "Saving…" : editId ? "Save Changes" : "Add Question"}
            </button>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Permanently delete this question?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 text-sm py-10">Loading questions…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left py-3 px-6 font-medium">Question</th>
                  <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Class</th>
                  <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Format</th>
                  <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Ability</th>
                  <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Time</th>
                  <th className="text-right py-3 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((question) => (
                  <tr key={question.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="text-sm text-slate-900 line-clamp-2 max-w-sm">
                        {question.prompt?.kind === "image" ? "Image prompt" : stripMathSyntax(question.prompt?.value ?? question.content)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{(question.topicId ?? "").replace(/-/g, " ")}</p>
                    </td>
                    <td className="py-3.5 px-6 hidden md:table-cell"><span className="text-xs text-slate-500">{question.targetClassYear}</span></td>
                    <td className="py-3.5 px-6 hidden lg:table-cell"><span className="text-xs text-slate-500">{formatLabels[question.format ?? "text-to-text"]}</span></td>
                    <td className="py-3.5 px-6 hidden sm:table-cell">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${abilityColors[question.abilityLevel ?? "Beginner"]}18`, color: abilityColors[question.abilityLevel ?? "Beginner"] }}>
                        {question.abilityLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 hidden lg:table-cell"><span className="text-xs text-slate-500">{question.timeLimitSeconds}s</span></td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(question)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(question.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No questions found.</p>}
          </div>
        )}
        <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">{filtered.length} of {questions.length} questions</div>
      </div>
    </div>
  );
}
