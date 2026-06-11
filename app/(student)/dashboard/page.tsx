"use client";

import { dashboardStatsByTier } from "@/lib/mock/dashboard";
import StatsRow from "@/components/dashboard/StatsRow";
import TopicMastery from "@/components/dashboard/TopicMastery";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LearningPath from "@/components/dashboard/LearningPath";
import RecommendedNext from "@/components/dashboard/RecommendedNext";
import StreakCard from "@/components/dashboard/StreakCard";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const tier = user?.tier ?? "Beginner";
  const stats = dashboardStatsByTier[tier];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {user?.classYear && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                {user.classYear}
              </span>
            )}
            {user?.institute && (
              <span className="text-xs text-[#64748b]">{user.institute}</span>
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Welcome back, {user?.name ?? "Scholar"}.
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your intellectual journey continues. You are in the top 2% this week.
          </p>
        </div>
        <button className="gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
          Start Daily Challenge
        </button>
      </div>

      {/* Stats Row */}
      <StatsRow stats={stats} />

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopicMastery mastery={stats.topicMastery} />
          <RecentActivity activity={stats.recentActivity} />
        </div>
        <div className="space-y-6">
          <StreakCard streak={user?.streak ?? 0} />
          <RecommendedNext recommended={stats.recommendedNext} />
          <LearningPath path={stats.learningPath} />
        </div>
      </div>
    </div>
  );
}
