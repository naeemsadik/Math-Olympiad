"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Check, Puzzle, Inbox, Eye } from "lucide-react";
import type { Tier, PuzzleSubmission } from "@/types";

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";

interface PuzzleItem {
  id: string;
  date: string;
  title: string;
  content: string;
  difficulty: Difficulty;
  tier: Tier;
  topic: string;
}

const initialPuzzles: PuzzleItem[] = [
  { id: "p1", date: "May 14, 2026", title: "The Remainder Search",        content: "A number leaves remainder 4 when divided by 6, and remainder 7 when divided by 9. Find the smallest such positive integer.",              difficulty: "Beginner",     tier: "Beginner",     topic: "Number Theory" },
  { id: "p2", date: "May 14, 2026", title: "Pi Day Divisibility",         content: "Find the number of positive integers a such that a+50 divides a^2+100. Prove your result using modular arithmetic.",                      difficulty: "Intermediate", tier: "Intermediate", topic: "Combinatorics" },
  { id: "p3", date: "May 14, 2026", title: "Fermat's Application",        content: "Let p be an odd prime and a an integer not divisible by p. Prove a^(p-1) ≡ 1 (mod p), then find the last two digits of 7^1000.",         difficulty: "Advanced",     tier: "Advanced",     topic: "Number Theory" },
  { id: "p4", date: "May 13, 2026", title: "The Division Remainder",      content: "When positive integer N is divided by 7, the remainder is 3. When N is divided by 4, the remainder is 1. Find the smallest N > 10.",    difficulty: "Beginner",     tier: "Beginner",     topic: "Number Theory" },
  { id: "p5", date: "May 13, 2026", title: "The Divisibility Paradox",    content: "Prove that n^3 - n is always divisible by 6 for any integer n.",                                                                           difficulty: "Intermediate", tier: "Intermediate", topic: "Number Theory" },
  { id: "p6", date: "May 13, 2026", title: "IMO 2023 NT Shortlist",       content: "Find all functions f: Z → Z such that f(f(n)) = f(n) + n for all integers n.",                                                            difficulty: "Elite",        tier: "Advanced",     topic: "Number Theory" },
  { id: "p7", date: "May 12, 2026", title: "Sum of Digits Puzzle",        content: "The sum of the digits of a two-digit number is 9. If the digits are reversed, the new number is 27 more. Find the original number.",      difficulty: "Beginner",     tier: "Beginner",     topic: "Algebra"       },
  { id: "p8", date: "May 12, 2026", title: "The Pigeonhole Labyrinth",    content: "In a group of 13 people, prove at least two were born in the same month. Among 367 people, prove two share the same birthday.",          difficulty: "Intermediate", tier: "Intermediate", topic: "Combinatorics" },
  { id: "p9", date: "May 12, 2026", title: "Diophantine System",          content: "Find all pairs of positive integers (x, y) such that x^2 - y^2 = 2026. Prove your list is complete.",                                     difficulty: "Advanced",     tier: "Advanced",     topic: "Number Theory" },
];

const initialSubmissions: PuzzleSubmission[] = [
  { id: "s1",  puzzleId: "p1", puzzleTitle: "The Remainder Search",     studentName: "Maliha Sultana",  studentInstitute: "Viqarunnisa Noon School",  studentTier: "Beginner",     answer: "The number is 22. I found it by listing numbers: 10, 16, 22 — and 22 gives remainder 4 mod 6 and 7 mod 9.",   submittedAt: "2026-05-14 09:21", isCorrect: true  },
  { id: "s2",  puzzleId: "p1", puzzleTitle: "The Remainder Search",     studentName: "Arif Hasan",      studentInstitute: "Motijheel Ideal School",   studentTier: "Beginner",     answer: "I think the answer is 22 because 22/6 = 3 remainder 4... wait that's not right for mod 9.",                  submittedAt: "2026-05-14 09:47", isCorrect: false },
  { id: "s3",  puzzleId: "p2", puzzleTitle: "Pi Day Divisibility",      studentName: "Fahim Hossain",   studentInstitute: "Dhaka College",            studentTier: "Intermediate", answer: "Note that a+50 | a^2+100 iff a+50 | a^2-2500 = (a-50)(a+50), so a+50 | 5100. Count divisors of 5100 > 50...", submittedAt: "2026-05-14 08:32", isCorrect: true  },
  { id: "s4",  puzzleId: "p2", puzzleTitle: "Pi Day Divisibility",      studentName: "Lamia Akter",     studentInstitute: "Notre Dame College",       studentTier: "Intermediate", answer: "Since a ≡ -50 (mod a+50), we get a^2 ≡ 2500 (mod a+50). So a+50 | 2600. Count divisors of 2600 exceeding 50...", submittedAt: "2026-05-14 11:18", isCorrect: true  },
  { id: "s5",  puzzleId: "p3", puzzleTitle: "Fermat's Application",     studentName: "Adnan Chowdhury", studentInstitute: "UIU",                      studentTier: "Advanced",     answer: "Consider {a, 2a, ..., (p-1)a} mod p. These are all distinct and non-zero, so they form a permutation of {1,...,p-1}...", submittedAt: "2026-05-14 07:47", isCorrect: true  },
  { id: "s6",  puzzleId: "p3", puzzleTitle: "Fermat's Application",     studentName: "Sarah Jubaida",   studentInstitute: "BUET",                     studentTier: "Advanced",     answer: "By FLT: 7^(p-1)≡1 mod p. For mod 100: phi(100)=40. 1000=40*25, so 7^1000≡1 (mod 100). Last two digits: 01.",  submittedAt: "2026-05-14 08:58", isCorrect: true  },
  { id: "s7",  puzzleId: "p4", puzzleTitle: "The Division Remainder",   studentName: "Tasnim Rahman",   studentInstitute: "St. Gregory's High School",studentTier: "Beginner",     answer: "N = 7k+3. Try k=2: 17. Check 17/4=4 rem 1. Yes! N=17 which is > 10. Answer: 17.",                              submittedAt: "2026-05-13 14:12", isCorrect: true  },
  { id: "s8",  puzzleId: "p5", puzzleTitle: "The Divisibility Paradox", studentName: "Tahmid Reza",     studentInstitute: "Rajshahi College",         studentTier: "Intermediate", answer: "n^3-n = n(n-1)(n+1) = product of 3 consecutive integers. Among any 3 consecutive integers one is div by 2 and one by 3.", submittedAt: "2026-05-13 10:22", isCorrect: true  },
  { id: "s9",  puzzleId: "p6", puzzleTitle: "IMO 2023 NT Shortlist",    studentName: "Rahat Khan",      studentInstitute: "DU",                       studentTier: "Advanced",     answer: "Let f(0)=c. From f(f(0))=f(0)+0=c, so f(c)=c. Assume f linear: f(n)=an+b. Then a(an+b)+b = a(n+1)+b... solving gives a=1 or a=-1.", submittedAt: "2026-05-13 16:45", isCorrect: false },
  { id: "s10", puzzleId: "p7", puzzleTitle: "Sum of Digits Puzzle",     studentName: "Afsana Khan",     studentInstitute: "Motijheel Model School",   studentTier: "Beginner",     answer: "Let tens digit=a, units=b. a+b=9, and 9(b-a)=27, so b-a=3. Solving: a=3, b=6. Number is 36.",             submittedAt: "2026-05-12 11:30", isCorrect: true  },
];

const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Elite"];
const tiers: Tier[] = ["Beginner", "Intermediate", "Advanced"];
const topics = ["Algebra", "Combinatorics", "Number Theory", "Geometry", "Inequalities", "Mathematical Logic"];

const diffColors: Record<string, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706", Elite: "#ef4444" };
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };

const blank = (): Omit<PuzzleItem, "id"> => ({
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  title: "", content: "", difficulty: "Intermediate", tier: "Intermediate", topic: "Number Theory",
});

type Tab = "puzzles" | "submissions";

export default function AdminPuzzlesPage() {
  const [tab, setTab] = useState<Tab>("puzzles");
  const [puzzles, setPuzzles] = useState<PuzzleItem[]>(initialPuzzles);
  const [submissions] = useState<PuzzleSubmission[]>(initialSubmissions);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewSub, setViewSub] = useState<PuzzleSubmission | null>(null);
  const [filterTier, setFilterTier] = useState<Tier | "All">("All");

  const openCreate = () => { setForm(blank()); setEditId(null); setShowForm(true); };
  const openEdit = (p: PuzzleItem) => { setForm({ date: p.date, title: p.title, content: p.content, difficulty: p.difficulty, tier: p.tier, topic: p.topic }); setEditId(p.id); setShowForm(true); };

  const save = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editId) {
      setPuzzles((prev) => prev.map((p) => p.id === editId ? { ...p, ...form } : p));
    } else {
      setPuzzles((prev) => [{ id: `p${Date.now()}`, ...form }, ...prev]);
    }
    setShowForm(false);
  };

  const confirmDelete = (id: string) => setDeleteId(id);
  const doDelete = () => { if (deleteId) setPuzzles((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); };

  const filteredSubs = submissions.filter((s) => filterTier === "All" || s.studentTier === filterTier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Puzzle size={24} className="text-[#d97706]" /> Daily Puzzles
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage daily challenge puzzles and view student submissions.</p>
        </div>
        {tab === "puzzles" && (
          <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
            <Plus size={16} /> New Puzzle
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1 w-fit">
        {(["puzzles", "submissions"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? "gradient-orange text-white" : "text-slate-500 hover:text-slate-900"}`}
          >
            {t === "puzzles" ? `Puzzles (${puzzles.length})` : `Submissions (${submissions.length})`}
          </button>
        ))}
      </div>

      {/* ── Puzzles Tab ── */}
      {tab === "puzzles" && (
        <>
          {showForm && (
            <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Puzzle" : "New Puzzle"}</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={18} /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Puzzle title..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Date</label>
                  <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Problem Statement</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Enter the full problem statement..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all">
                    {difficulties.map((d) => <option key={d} value={d} >{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Tier</label>
                  <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as Tier })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all">
                    {tiers.map((t) => <option key={t} value={t} >{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Topic</label>
                  <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50 transition-all">
                    {topics.map((t) => <option key={t} value={t} >{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button onClick={save} disabled={!form.title.trim() || !form.content.trim()} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
                  <Check size={15} /> {editId ? "Save Changes" : "Create Puzzle"}
                </button>
              </div>
            </div>
          )}

          {deleteId && (
            <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-900">Delete <span className="text-red-400 font-semibold">&ldquo;{puzzles.find(p => p.id === deleteId)?.title}&rdquo;</span>? This cannot be undone.</p>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {puzzles.map((p) => (
              <div key={p.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[p.tier]}18`, color: tierColors[p.tier] }}>{p.tier}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${diffColors[p.difficulty]}18`, color: diffColors[p.difficulty] }}>{p.difficulty}</span>
                    <span className="text-xs text-slate-400">{p.topic}</span>
                    <span className="text-xs text-slate-400">{p.date}</span>
                    <span className="text-xs text-slate-400">{submissions.filter(s => s.puzzleId === p.id).length} submissions</span>
                  </div>
                  <p className="font-heading font-semibold text-slate-900 mb-1">{p.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{p.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => confirmDelete(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Submissions Tab ── */}
      {tab === "submissions" && (
        <>
          {viewSub && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="glass rounded-2xl p-6 max-w-lg w-full border border-white/[0.1] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-slate-900">Submission Detail</h3>
                  <button onClick={() => setViewSub(null)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={18} /></button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Student</p><p className="text-slate-900 font-medium">{viewSub.studentName}</p></div>
                    <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Institute</p><p className="text-slate-900">{viewSub.studentInstitute}</p></div>
                    <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Tier</p><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[viewSub.studentTier]}18`, color: tierColors[viewSub.studentTier] }}>{viewSub.studentTier}</span></div>
                    <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Submitted</p><p className="text-slate-900">{viewSub.submittedAt}</p></div>
                  </div>
                  <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Puzzle</p><p className="text-slate-900 font-medium">{viewSub.puzzleTitle}</p></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Full Answer</p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-500 leading-relaxed">{viewSub.answer}</div>
                  </div>
                  {viewSub.isCorrect !== undefined && (
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${viewSub.isCorrect ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                      {viewSub.isCorrect ? "✓ Marked Correct" : "✗ Marked Incorrect"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(["All", ...tiers] as (Tier | "All")[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${filterTier === t ? (t === "All" ? "gradient-orange text-white" : "text-white") : "bg-slate-50 text-slate-500 hover:text-slate-900"}`}
                style={filterTier === t && t !== "All" ? { backgroundColor: tierColors[t as Tier] } : {}}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredSubs.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <Inbox size={32} className="text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No submissions for this tier.</p>
              </div>
            ) : (
              filteredSubs.map((s) => (
                <div key={s.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[s.studentTier]}18`, color: tierColors[s.studentTier] }}>{s.studentTier}</span>
                      {s.isCorrect !== undefined && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.isCorrect ? "bg-[#10b981]/15 text-[#10b981]" : "bg-red-500/15 text-red-400"}`}>
                          {s.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{s.submittedAt}</span>
                    </div>
                    <p className="text-slate-900 font-semibold text-sm">{s.studentName}</p>
                    <p className="text-xs text-slate-400">{s.studentInstitute}</p>
                    <p className="text-xs text-slate-500 mt-1">Puzzle: <span className="text-slate-900">{s.puzzleTitle}</span></p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{s.answer}</p>
                  </div>
                  <button onClick={() => setViewSub(s)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors shrink-0">
                    <Eye size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
