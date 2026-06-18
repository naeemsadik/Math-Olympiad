"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function LoginWall({ children, title = "Sign in to Access", description = "Create a free account to unlock lessons, problems, and your personal progress tracker." }: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const { user } = useAuthStore();
  if (user) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none" style={{ filter: "blur(6px)", opacity: 0.35, maxHeight: "280px", overflow: "hidden" }}>
        {children}
      </div>

      {/* Gradient fade at bottom of preview */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080810] to-transparent pointer-events-none" />

      {/* Overlay card */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-[#0d0d1a] border border-[#d97706]/35 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="w-11 h-11 rounded-xl bg-[#d97706]/20 border border-[#d97706]/30 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-[#a78bfa]" />
          </div>
          <h3 className="font-heading font-bold text-white text-lg mb-2">{title}</h3>
          <p className="text-[#64748b] text-sm leading-relaxed mb-6">{description}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="gradient-orange glow-orange text-white font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-all text-sm"
            >
              Sign In Free
            </Link>
            <Link
              href="/about"
              className="bg-white/[0.06] border border-white/[0.1] text-[#94a3b8] hover:text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/[0.1] transition-all text-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
