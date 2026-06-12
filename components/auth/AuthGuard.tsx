"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function useAuthHydrated() {
  return useSyncExternalStore(
    (callback) => useAuthStore.persist.onFinishHydration(() => callback()),
    () => useAuthStore.persist.hasHydrated(),
    () => true
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const ready = useAuthHydrated();
  const isPlacementRoute = pathname === "/student/placement";

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/login"); return; }
    if (!user.placementDone && !isPlacementRoute) router.replace("/student/placement");
  }, [ready, user, router, isPlacementRoute]);

  if (!ready || !user || (!user.placementDone && !isPlacementRoute)) {
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
  const ready = useAuthHydrated();

  useEffect(() => {
    if (ready) {
      if (!user) router.replace("/login");
      else if (user.role !== "ADMIN") router.replace("/student/dashboard");
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
