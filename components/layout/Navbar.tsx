"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard, LogOut, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/", protected: false, exact: true },
  { label: "About", href: "/about", protected: false },
  { label: "Leaderboard", href: "/leaderboard", protected: false },
  { label: "Olympiads", href: "/events", protected: false },
  { label: "Hall of Fame", href: "/hall-of-fame", protected: false },
  { label: "Gallery", href: "/gallery", protected: false },
  { label: "My Dashboard", href: "/dashboard", protected: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 bg-white",
        scrolled
          ? "shadow-sm shadow-slate-200/80 border-b border-slate-200"
          : "border-b border-slate-200/70"
      )}
    >
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#d97706]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-[#d97706]/40 shadow-md shadow-[#d97706]/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="UIU CMOR" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading font-bold text-slate-800 tracking-widest text-[10px] uppercase">
              UIU Centre For
            </span>
            <span className="font-heading font-semibold text-[#d97706] tracking-widest text-[9px] uppercase">
              Math Olympiad and Research
            </span>
          </div>
        </Link>

        {/* Nav links — centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.exact ? pathname === link.href : (pathname === link.href || pathname.startsWith(link.href + "/"));
            const isLocked = link.protected && !authUser;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-150",
                  isActive
                    ? "bg-[#d97706] text-white shadow-md shadow-[#d97706]/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {link.label}
                {isLocked && (
                  <Lock
                    size={10}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-white/70" : "text-slate-400"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2.5">
          {authUser && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-[#d97706]/10 border border-slate-200 hover:border-[#d97706]/30 text-slate-500 hover:text-[#d97706] transition-all relative"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#d97706] rounded-full" />
            </motion.button>
          )}

          {!authUser && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center text-sm font-semibold px-5 py-2 rounded-full bg-linear-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md shadow-[#d97706]/25 hover:shadow-[#d97706]/40 transition-shadow"
              >
                Sign In
              </Link>
            </motion.div>
          )}

          {authUser && (
            <div className="relative" ref={ref}>
              <motion.button
                onClick={() => setOpen((v) => !v)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-1.5 border transition-all duration-200",
                  open
                    ? "bg-[#d97706]/8 border-[#d97706]/30"
                    : "bg-slate-100 border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {authUser.name[0]}
                </div>
                <span className="text-sm text-slate-700 hidden sm:block font-medium">{authUser.name.split(" ")[0]}</span>
                <ChevronDown
                  size={13}
                  className={cn("text-slate-400 transition-transform duration-200", open && "rotate-180")}
                />
              </motion.button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden z-50"
                    style={{ width: "14.5rem" }}
                  >
                    <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
                      <p className="text-sm font-semibold text-slate-900">{authUser.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{authUser.email}</p>
                      <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#d97706]/10 text-[#92400e] border border-[#d97706]/20 uppercase tracking-wider">
                        {authUser.role === "ADMIN" ? "Faculty Admin" : `${authUser.level} · ${authUser.tier ?? authUser.department}`}
                      </span>
                    </div>

                    <div className="py-1.5">
                      {authUser.role === "STUDENT" ? (
                        <>
                          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                            <LayoutDashboard size={14} className="text-slate-400" />
                            My Dashboard
                          </Link>
                          <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                            <User size={14} className="text-slate-400" />
                            My Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                            <LayoutDashboard size={14} className="text-slate-400" />
                            Admin Dashboard
                          </Link>
                          <Link href="/admin/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                            <User size={14} className="text-slate-400" />
                            Profile
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 py-1.5">
                      <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
