"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard, LogOut, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useRef, useState, useEffect } from "react";

const navLinks = [
  { label: "Practice", href: "/tests", protected: true },
  { label: "Live Exam", href: "/live-exam", protected: true },
  { label: "Olympiads", href: "/events", protected: false },
  { label: "Hall of Fame", href: "/hall-of-fame", protected: false },
  { label: "Gallery", href: "/gallery", protected: false },
  { label: "About", href: "/about", protected: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const signOut = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const authUser = mounted ? user : null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-[#d97706]/40 shadow-md shadow-[#d97706]/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="UIU CMOR" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading font-bold text-slate-800 tracking-wide text-xs uppercase">
              UIU Centre For
            </span>
            <span className="font-heading font-semibold text-[#d97706] tracking-wide text-[10px] uppercase">
              Math Olympiad and Research
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const isLocked = link.protected && !authUser;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group flex items-center gap-1.5",
                  isActive
                    ? "text-[#d97706] bg-[#d97706]/8"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {link.label}
                {isLocked && (
                  <Lock size={11} className="text-slate-400 group-hover:text-[#d97706] transition-colors" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#d97706] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
{authUser && (
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700">
              <Bell size={16} />
            </button>
          )}

          {!authUser && (
            <Link
              href="/login"
              className="gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2 rounded-full hover:scale-105 transition-all"
            >
              Sign In
            </Link>
          )}

          {authUser && (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg px-3 py-1.5"
              >
                <div className="w-7 h-7 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {authUser.name[0]}
                </div>
                <span className="text-sm text-slate-700 hidden sm:block">{authUser.name.split(" ")[0]}</span>
                <ChevronDown
                  size={14}
                  className={cn("text-slate-400 transition-transform", open && "rotate-180")}
                />
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{authUser.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{authUser.email}</p>
                    <span className="inline-flex mt-1.5 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#d97706]/10 text-[#d97706]">
                      {authUser.role === "ADMIN" ? "Faculty Admin" : `${authUser.level} · ${authUser.tier ?? authUser.department}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    {authUser.role === "STUDENT" ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          My Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <User size={15} />
                          My Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          Admin Dashboard
                        </Link>
                        <Link
                          href="/admin/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <User size={15} />
                          Profile
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
