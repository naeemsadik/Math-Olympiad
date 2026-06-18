import type { Question, QuestionState } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  questions: Question[];
  states: Record<string, QuestionState>;
  currentIdx: number;
  onJump: (idx: number) => void;
}

const stateStyles: Record<QuestionState, string> = {
  answered: "bg-[#10b981]/15 border-[#10b981]/35 text-[#10b981] font-bold",
  marked: "bg-[#f59e0b]/15 border-[#f59e0b]/35 text-[#f59e0b] font-bold",
  unanswered: "bg-slate-100 border-slate-200 text-slate-500",
  skipped: "bg-red-50 border-red-200 text-red-500",
};

export default function QuestionPalette({ questions, states, currentIdx, onJump }: Props) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Question Palette</p>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const state = states[q.id] ?? "unanswered";
          const isCurrent = idx === currentIdx;
          return (
            <button
              key={q.id}
              onClick={() => onJump(idx)}
              className={cn(
                "w-9 h-9 rounded-lg border text-xs font-semibold transition-all",
                isCurrent
                  ? "gradient-orange text-white border-[#d97706] scale-110 shadow-lg shadow-amber-500/25"
                  : stateStyles[state]
              )}
            >
              {String(idx + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
