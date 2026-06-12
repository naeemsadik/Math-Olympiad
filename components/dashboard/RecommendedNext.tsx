import Link from "next/link";
import type { DashboardStats } from "@/types";
import { ArrowRight } from "lucide-react";

type Props = { recommended: DashboardStats["recommendedNext"] };

export default function RecommendedNext({ recommended }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#d97706]/20 shadow-sm shadow-violet-100/60">
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Recommended Next</p>
      <h4 className="font-heading font-semibold text-slate-900 text-lg leading-snug">
        {recommended.title}
      </h4>
      <p className="text-sm text-slate-500 mt-1">
        {recommended.topic} • {recommended.level}
      </p>
      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        Based on your recent performance in Combinatorics, we recommend strengthening your grasp
        on structural counting.
      </p>
      <Link
        href="/student/tests"
        className="mt-4 flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-105 transition-all"
      >
        Begin Assessment <ArrowRight size={14} />
      </Link>
    </div>
  );
}
