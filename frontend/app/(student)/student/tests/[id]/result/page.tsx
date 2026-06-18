import { tests, sampleQuestions } from "@/lib/mock/tests";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react";

const topicBreakdown = [
  { topic: "Algebra & Polynomials", accuracy: 96, avgAccuracy: 72 },
  { topic: "Number Theory", accuracy: 88, avgAccuracy: 65 },
  { topic: "Geometry (Euclidean)", accuracy: 62, avgAccuracy: 70 },
  { topic: "Combinatorics", accuracy: 90, avgAccuracy: 68 },
];

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
};

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = tests.find((t) => t.id === id) ?? tests[0];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/student/tests" className="hover:text-slate-700 transition-colors font-semibold uppercase">Tests</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 font-semibold uppercase">{test.title}</span>
      </div>

      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Test Results Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">Completed on October 24, 2023 • Attempt #2</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5" style={cardStyle}>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Total Score</p>
          <p className="font-heading text-4xl font-bold text-slate-900">
            420 <span className="text-lg text-slate-400">/ 500</span>
          </p>
          <p className="text-xs text-[#f59e0b] mt-2 font-semibold">★ Top 5% of all candidates</p>
        </div>
        <div className="bg-white rounded-xl p-5" style={cardStyle}>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Accuracy</p>
          <p className="font-heading text-4xl font-bold text-[#10b981]">84%</p>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-[#10b981]" style={{ width: "84%" }} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5" style={cardStyle}>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Time Taken</p>
          <p className="font-heading text-4xl font-bold text-[#f59e0b]">
            34<span className="text-lg">m</span> 12<span className="text-lg">s</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">8 minutes ahead of average</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold text-slate-900">Topic Performance</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d97706]" /> Accuracy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Avg. Student</span>
            </div>
          </div>
          <div className="space-y-4">
            {topicBreakdown.map(({ topic, accuracy, avgAccuracy }) => (
              <div key={topic}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">{topic}</span>
                  <span className={`font-semibold ${accuracy < 70 ? "text-[#f59e0b]" : "text-slate-800"}`}>{accuracy}%</span>
                </div>
                <div className="relative h-2 rounded-full bg-slate-100">
                  <div className="absolute h-2 rounded-full bg-slate-200" style={{ width: `${avgAccuracy}%` }} />
                  <div
                    className="absolute h-2 rounded-full"
                    style={{
                      width: `${accuracy}%`,
                      background: accuracy < 70 ? "linear-gradient(90deg, #f59e0b, #d97706)" : "linear-gradient(90deg, #d97706, #f59e0b)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mastery Insight */}
        <div className="bg-white rounded-2xl p-6" style={{ ...cardStyle, borderColor: "rgba(217, 119, 6,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-orange rounded-lg flex items-center justify-center text-white text-sm shadow-sm shadow-amber-500/20">◎</div>
            <h3 className="font-heading font-semibold text-slate-900">Mastery Insight</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            You excel in logical deduction and algebraic manipulation. However, your time spent on{" "}
            <span className="text-[#f59e0b] font-semibold">Geometry</span> problems was 40% higher
            than average with lower accuracy.
          </p>
          <div className="mt-4">
            <p className="text-xs text-slate-500 font-semibold mb-2">Recommendation:</p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
              <li>Practice Circle Theorems</li>
              <li>Review 3D Geometry formulas</li>
            </ul>
          </div>
          <Link
            href="/student/topics/geometry"
            className="mt-5 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            Go to Geometry Module
          </Link>
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="bg-white rounded-2xl p-6" style={cardStyle}>
        <h3 className="font-heading font-semibold text-slate-900 mb-5">Question Breakdown</h3>
        <div className="space-y-3">
          {sampleQuestions.map((q, idx) => {
            const isCorrect = idx !== 1;
            return (
              <div
                key={q.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                {isCorrect
                  ? <CheckCircle2 size={18} className="text-[#10b981] shrink-0" />
                  : <XCircle size={18} className="text-red-500 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Question {String(idx + 1).padStart(2, "0")}</p>
                  <p className="text-sm text-slate-800 font-medium truncate">{q.content.replace(/\$/g, "").slice(0, 60)}...</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {["02:45", "04:12", "01:05"][idx]}
                  </span>
                  <button className="text-xs text-[#d97706] hover:text-[#6d28d9] transition-colors font-semibold">
                    View Explanation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Link href="/student/tests" className="px-6 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all">
          Review Questions
        </Link>
        <Link href="/student/tests" className="px-6 py-2.5 rounded-xl gradient-orange text-white text-sm font-semibold hover:scale-105 transition-all">
          Take Another Test
        </Link>
      </div>
    </div>
  );
}
