import type { DashboardStats } from "@/types";
import { FileText, Star, MessageSquare } from "lucide-react";

type Props = { activity: DashboardStats["recentActivity"] };

const icons: Record<string, React.ElementType> = {
  test: FileText,
  badge: Star,
  community: MessageSquare,
};

const colors: Record<string, string> = {
  test: "#d97706",
  badge: "#f59e0b",
  community: "#10b981",
};

export default function RecentActivity({ activity }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-100/80">
      <h3 className="font-heading font-semibold text-slate-900 mb-5">Recent Activity</h3>
      <div className="space-y-4">
        {activity.map((item, i) => {
          const Icon = icons[item.type] ?? FileText;
          const color = colors[item.type] ?? "#d97706";
          return (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.score && (
                    <span className="text-xs text-[#10b981] font-semibold">{item.score}</span>
                  )}
                  {item.xp && (
                    <span className="text-xs text-[#f59e0b] font-semibold">+{item.xp} XP</span>
                  )}
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
