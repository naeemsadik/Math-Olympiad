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
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const studentLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
  { icon: Puzzle, label: "Daily Puzzle", href: "/student/daily-puzzle" },
  { icon: Radio, label: "Live Exam", href: "/student/live-exam" },
  { icon: FileText, label: "Tests", href: "/student/tests" },
  { icon: Sigma, label: "Topics", href: "/student/topics" },
  { icon: Dumbbell, label: "Training", href: "/student/training" },
  { icon: Users, label: "Community", href: "/student/community" },
  { icon: ClipboardList, label: "Registration", href: "/student/registration" },
  { icon: Bell, label: "Announcements", href: "/student/notices" },
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
  { icon: ClipboardList, label: "Registration",  href: "/admin/registration" },
  { icon: Award,         label: "Certificates",  href: "/admin/certificates" },
  { icon: Bell,          label: "Announcements", href: "/admin/notices"      },
];

interface Props {
  className?: string;
  onNavigate?: () => void;
}

export default function Sidebar({ className, onNavigate }: Props) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const links = user?.role === "ADMIN" ? adminLinks : studentLinks;
  const panelLabel = user?.role === "ADMIN" ? "Admin Panel" : "Student Panel";

  return (
    <aside className={cn("w-64 shrink-0 flex flex-col gap-1 py-4 px-3", className)}>
      <Link href="/" onClick={onNavigate} className="mb-3 flex items-center gap-3 rounded-2xl px-2 py-2">
        <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden ring-2 ring-[#d97706]/30 shadow-sm shadow-[#d97706]/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="UIU CMOR" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold text-slate-900">UIU CMOR</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#d97706]">{panelLabel}</p>
        </div>
      </Link>

      {user && (
        <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="w-9 h-9 gradient-orange rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.role === "ADMIN" ? "Faculty Admin" : `Level: ${user.diagnosticAbilityLevel ?? user.level}`}</p>
          </div>
        </div>
      )}

      <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</p>
      {links.map(({ icon: Icon, label, href }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            title={label}
            onClick={onNavigate}
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
            <span>{label}</span>
          </Link>
        );
      })}

      {/* XP / Streak (student only, desktop) */}
      {user?.role === "STUDENT" && (
        <div className="mt-auto mx-1 p-3 rounded-xl bg-[#d97706]/5 border border-[#d97706]/10">
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
