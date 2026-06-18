import type { DashboardStats } from "@/types";
import { CheckCircle2, Circle, Lock } from "lucide-react";

type Props = { path: DashboardStats["learningPath"] };

export default function LearningPath({ path }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-100/80">
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">Learning Path Progress</p>
      <div className="space-y-3">
        {path.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            {item.status === "completed" ? (
              <CheckCircle2 size={18} className="text-[#10b981] shrink-0" />
            ) : item.status === "in_progress" ? (
              <Circle size={18} className="text-[#d97706] shrink-0" />
            ) : (
              <Lock size={18} className="text-slate-300 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  item.status === "locked" ? "text-slate-400" : "text-slate-800"
                }`}
              >
                {item.title}
              </p>
              {item.status === "in_progress" && (
                <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-[#d97706]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
