"use client";

import { useEffect, useState } from "react";
import { Trash2, X, Puzzle, Inbox, Eye, Check, XCircle } from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface Puzzle {
  id: string;
  puzzleDate: string;
  title: string;
  content: string;
  difficulty: string;
  tier: string;
  topic: string;
  answer: string;
}

interface Submission {
  id: string;
  puzzleId: string;
  puzzleTitle?: string;
  studentName: string;
  studentInstitute?: string;
  studentTier: string;
  answer: string;
  submittedAt: string;
  isCorrect?: boolean | null;
  status: string;
  adminNote?: string;
}

export default function AdminPuzzlesPage() {
  const [tab, setTab] = useState<"puzzles" | "submissions">("submissions");
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Submission | null>(null);
  const [judgeNote, setJudgeNote] = useState("");
  const [judging, setJudging] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, s] = await Promise.all([
        api.admin.puzzles.list(),
        api.admin.puzzles.listSubmissions(),
      ]);
      const pList = Array.isArray(p) ? p : (p as { data?: Puzzle[] }).data ?? [];
      const sList = Array.isArray(s) ? s : (s as { data?: Submission[] }).data ?? [];
      setPuzzles(pList as Puzzle[]);
      setSubmissions(sList as Submission[]);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load puzzles.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const judge = async (id: string, isCorrect: boolean) => {
    setJudging(true);
    try {
      await api.admin.puzzles.judgeSubmission(id, { isCorrect, note: judgeNote || undefined });
      await load();
      setDetail(null);
      setJudgeNote("");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to judge submission.";
      setError(msg);
    } finally {
      setJudging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Puzzle size={24} className="text-[#d97706]" /> Daily Puzzles
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review student submissions and judge the day&apos;s puzzle.</p>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      <div className="flex gap-2">
        {(["submissions", "puzzles"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all capitalize ${tab === t ? "gradient-orange text-white" : "bg-slate-50 text-slate-500 hover:text-slate-900"}`}>
            {t === "submissions" ? <><Inbox size={12} className="inline mr-1" />Submissions ({submissions.length})</> : <><Puzzle size={12} className="inline mr-1" />Puzzles ({puzzles.length})</>}
          </button>
        ))}
      </div>

      {detail && (
        <div className="glass rounded-2xl p-5 border border-[#d97706]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">Judge Submission</h3>
            <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-900"><X size={16} /></button>
          </div>
          <p className="text-sm text-slate-500"><span className="font-semibold text-slate-900">{detail.studentName}</span> ({detail.studentTier}) for puzzle <span className="font-semibold">{detail.puzzleTitle ?? detail.puzzleId}</span></p>
          <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700">{detail.answer}</div>
          <textarea value={judgeNote} onChange={(e) => setJudgeNote(e.target.value)} rows={2} placeholder="Optional admin note..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 resize-none" />
          <div className="flex justify-end gap-2">
            <button onClick={() => judge(detail.id, false)} disabled={judging} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/25 hover:bg-red-500/20 disabled:opacity-50">
              <XCircle size={13} /> Mark Incorrect
            </button>
            <button onClick={() => judge(detail.id, true)} disabled={judging} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25 hover:bg-[#10b981]/20 disabled:opacity-50">
              <Check size={13} /> Mark Correct
            </button>
          </div>
        </div>
      )}

      {tab === "submissions" && (
        loading ? <p className="text-center text-slate-400 text-sm py-10">Loading…</p> :
        <div className="space-y-3">
          {submissions.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No submissions yet.</p>}
          {submissions.map((s) => {
            const correct = s.isCorrect === true;
            const incorrect = s.isCorrect === false;
            return (
              <div key={s.id} className={`glass rounded-2xl p-5 flex items-start justify-between gap-4 ${correct ? "border border-[#10b981]/20" : incorrect ? "border border-red-500/20" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{s.studentTier}</span>
                    <span className="text-xs text-slate-400">{new Date(s.submittedAt).toLocaleString()}</span>
                    {s.status && s.status !== "pending" && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{s.status}</span>}
                    {correct && <span className="text-xs font-semibold text-[#10b981] flex items-center gap-1"><Check size={11} /> Correct</span>}
                    {incorrect && <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><XCircle size={11} /> Incorrect</span>}
                  </div>
                  <p className="font-heading font-semibold text-slate-900 text-sm mb-1">{s.puzzleTitle ?? s.puzzleId}</p>
                  <p className="text-xs text-slate-500 mb-1"><span className="font-semibold">{s.studentName}</span>{s.studentInstitute ? ` · ${s.studentInstitute}` : ""}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{s.answer}</p>
                  {s.adminNote && <p className="text-xs text-slate-400 mt-2 italic">Note: {s.adminNote}</p>}
                </div>
                <button onClick={() => { setDetail(s); setJudgeNote(s.adminNote ?? ""); }} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors" title="Judge"><Eye size={15} /></button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "puzzles" && (
        loading ? <p className="text-center text-slate-400 text-sm py-10">Loading…</p> :
        <div className="space-y-3">
          {puzzles.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No puzzles published yet.</p>}
          {puzzles.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{p.tier}</span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#d9770618", color: "#d97706" }}>{p.difficulty}</span>
                <span className="text-xs text-slate-400">{p.topic}</span>
                <span className="text-xs text-slate-400">{p.puzzleDate}</span>
              </div>
              <p className="font-heading font-semibold text-slate-900 text-sm mb-1">{p.title}</p>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{p.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}