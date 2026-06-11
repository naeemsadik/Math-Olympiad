"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/login"); return; }
    if (!user.placementDone) router.replace("/placement");
  }, [ready, user, router]);

  if (!ready || !user || !user.placementDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810]">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      if (!user) router.replace("/login");
      else if (user.role !== "ADMIN") router.replace("/dashboard");
    }
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810]">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
