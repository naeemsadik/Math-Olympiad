"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, LogOut, Menu, PanelLeftClose, User, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";

function titleFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean).filter((part) => part !== "student");
  const last = parts[parts.length - 1] ?? "dashboard";
  return last.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelLabel = user?.role === "ADMIN" ? "Admin Panel" : "Student Panel";
  const profileHref = user?.role === "ADMIN" ? "/admin/profile" : "/student/profile";

  const signOut = () => {
    logout();
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block">
        <Sidebar className="h-screen border-r border-slate-200 bg-white" />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-900/35"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72 bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#d97706]">UIU CMOR</p>
                <p className="text-sm font-semibold text-slate-900">{panelLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar className="h-[calc(100vh-3.5rem)] bg-white" onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 md:hidden"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <div className="hidden rounded-xl bg-[#d97706]/10 p-2 text-[#d97706] md:flex">
              <PanelLeftClose size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{panelLabel}</p>
              <h1 className="truncate font-heading text-lg font-bold text-slate-900 md:text-xl">{titleFromPath(pathname)}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-[#d97706]/30 hover:bg-[#d97706]/10 hover:text-[#d97706]"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d97706]" />
            </button>
            <Link
              href={profileHref}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#d97706]/30 hover:bg-[#d97706]/10 md:flex"
            >
              <User size={15} />
              {user?.name?.split(" ")[0] ?? "Profile"}
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] w-full px-4 py-5 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
