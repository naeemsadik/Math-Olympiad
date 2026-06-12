"use client";

/* eslint-disable @next/next/no-img-element */
import type { Question } from "@/types";
import { cn } from "@/lib/utils";
import { stripMathSyntax } from "@/lib/diagnostic";

interface Props {
  question: Question;
  selectedOption: number | null;
  onSelect: (idx: number) => void;
}

function optionLabel(index: number) {
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}

export default function QuestionCard({ question, selectedOption, onSelect }: Props) {
  const prompt = question.prompt ?? { kind: "text" as const, value: question.content };
  const options =
    question.answerOptions?.length
      ? question.answerOptions
      : question.options.map((option, index) => ({
          id: `${question.id}-${index}`,
          media: { kind: "text" as const, value: option },
          isCorrect: index === question.correctOption,
        }));

  return (
    <div className="bg-white rounded-2xl p-6 flex-1 space-y-6" style={{ border: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
          Level: {question.abilityLevel ?? question.difficulty}
        </p>
        {prompt.kind === "image" ? (
          <img src={prompt.value} alt={prompt.alt ?? "Question prompt"} className="max-h-72 w-full rounded-xl object-contain bg-slate-50 border border-slate-200" />
        ) : (
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            {stripMathSyntax(prompt.value)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => onSelect(idx)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
              selectedOption === idx
                ? "bg-[#d97706]/10 border-[#d97706]/40"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
            )}
          >
            <span
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                selectedOption === idx
                  ? "gradient-orange text-white shadow-sm shadow-amber-500/25"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {optionLabel(idx)}
            </span>
            {option.media.kind === "image" ? (
              <img src={option.media.value} alt={option.media.alt ?? `Option ${optionLabel(idx)}`} className="h-24 flex-1 rounded-lg object-contain bg-white border border-slate-100" />
            ) : (
              <span className={cn("text-sm", selectedOption === idx ? "text-slate-900 font-semibold" : "text-slate-600")}>
                {stripMathSyntax(option.media.value)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
