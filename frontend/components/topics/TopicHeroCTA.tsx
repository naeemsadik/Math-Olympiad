"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export function TopicHeroCTA({ firstModuleId }: { firstModuleId?: string }) {
  const { user } = useAuthStore();

  if (user) {
    return (
      <button
        onClick={() => {
          document.getElementById("topic-syllabus")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:scale-105 transition-all"
      >
        Start Learning
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:scale-105 transition-all"
    >
      Sign In to Start Learning
    </Link>
  );
}
