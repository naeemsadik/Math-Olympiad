"use client";

import type { DashboardStats } from "@/types";

type Props = { mastery: DashboardStats["topicMastery"] };

export default function TopicMastery({ mastery }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-100/80">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading font-semibold text-slate-900">Topic Mastery</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d97706]" /> Accuracy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" /> Avg. Student
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {mastery.map(({ topic, accuracy, speed }) => (
          <div key={topic}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-600 font-medium">{topic}</span>
              <span
                className={`font-semibold ${
                  accuracy >= 85
                    ? "text-[#10b981]"
                    : accuracy >= 70
                    ? "text-slate-700"
                    : "text-[#f59e0b]"
                }`}
              >
                {accuracy}%
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-slate-100">
              {/* Avg student bar */}
              <div
                className="absolute h-2 rounded-full bg-slate-200"
                style={{ width: `${speed}%` }}
              />
              {/* Accuracy bar */}
              <div
                className="absolute h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${accuracy}%`,
                  background:
                    accuracy >= 85
                      ? "linear-gradient(90deg, #10b981, #059669)"
                      : accuracy >= 70
                      ? "linear-gradient(90deg, #d97706, #f59e0b)"
                      : "linear-gradient(90deg, #f59e0b, #d97706)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
