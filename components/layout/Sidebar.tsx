"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sigma,
  Users,
  Puzzle,
  Shield,
  BookOpen,
  MessageSquare,
  Radio,
  Bell,
  Dumbbell,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const studentLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Puzzle, label: "Daily Puzzle", href: "/daily-puzzle" },
  { icon: Radio, label: "Live Exam", href: "/live-exam" },
  { icon: FileText, label: "Tests", href: "/tests" },
  { icon: Sigma, label: "Topics", href: "/topics" },
  { icon: Dumbbell, label: "Training", href: "/training" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: ClipboardList, label: "Registration", href: "/registration" },
  { icon: Bell, label: "Announcements", href: "/notices" },
];

const adminLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: Puzzle, label: "Puzzles", href: "/admin/puzzles" },
  { icon: FileText, label: "Tests", href: "/admin/tests" },
  { icon: Sigma, label: "Questions", href: "/admin/questions" },
  { icon: BookOpen, label: "Topics", href: "/admin/topics" },
  { icon: MessageSquare, label: "Community", href: "/admin/community" },
  { icon: Shield, label: "Events", href: "/admin/events" },
  { icon: ClipboardList, label: "Registration", href: "/admin/registration" },
  { icon: Bell, label: "Announcements", href: "/admin/notices" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const links = user?.role === "ADMIN" ? adminLinks : studentLinks;

  return (
    <aside className="w-16 lg:w-56 shrink-0 flex flex-col gap-1 py-4 px-2">
      {/* User info (desktop only) */}
      {user && (
        <div className="hidden lg:flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-9 h-9 gradient-orange rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">LEVEL: {user.level.toUpperCase()}</p>
          </div>
        </div>
      )}

      {links.map(({ icon: Icon, label, href }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon
              size={18}
              className={cn("shrink-0", isActive ? "text-[#d97706]" : "text-slate-400")}
            />
            <span className="hidden lg:block">{label}</span>
          </Link>
        );
      })}

      {/* XP / Streak (student only, desktop) */}
      {user?.role === "STUDENT" && (
        <div className="hidden lg:block mt-auto mx-1 p-3 rounded-xl bg-[#d97706]/5 border border-[#d97706]/10">
          <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Current Goal</p>
          <p className="text-xs text-slate-700 font-medium">Qualify for National Math Olympiad</p>
          <div className="mt-2 h-1.5 rounded-full bg-slate-200">
            <div className="h-1.5 rounded-full gradient-orange w-2/3" />
          </div>
        </div>
      )}
    </aside>
  );
}
