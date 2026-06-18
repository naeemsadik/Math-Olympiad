"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api, ApiError } from "@/lib/api";

function useAuthHydrated() {
  return useSyncExternalStore(
    (callback) => useAuthStore.persist.onFinishHydration(() => callback()),
    () => useAuthStore.persist.hasHydrated(),
    () => false
  );
}

// Treat any casing of "admin"/"student"/"faculty" the same. The backend has
// historically returned role in title-case ("Admin"); we normalise at the API
// boundary and again on rehydration, but a belt-and-braces comparison here
// protects against any future drift.
function roleIs(user: { role?: string } | null | undefined, want: "ADMIN" | "STUDENT" | "FACULTY"): boolean {
  const r = (user?.role ?? "").toUpperCase();
  return r === want;
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810]">
      <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
    </div>
  );
}

/**
 * Validates the persisted token against the backend exactly once per mount.
 * Returns a "validating" flag that stays true while the request is in flight.
 *
 * The race we're avoiding:
 *   1. Page reloads, persist rehydrates with `user` from localStorage.
 *   2. The AuthGuard's redirect effect sees `user` is non-null and does nothing.
 *   3. But the user in localStorage may be stale (e.g. role changed server-side).
 *      So we kick off /auth/me in the background and let the fresh server
 *      response overwrite the local user. Until that response lands we show
 *      a spinner — the redirect logic is suspended so a transient `user = null`
 *      (e.g. between two renders, or right after the 401 path clears the store)
 *      can't fire a navigation.
 */
function useTokenValidation(ready: boolean, token: string | null) {
  const [validating, setValidating] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!ready) return;
    if (ran.current) return;
    if (!token || !api.enabled) return;
    ran.current = true;
    setValidating(true);
    useAuthStore
      .getState()
      .fetchMe()
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          useAuthStore.getState().logout();
        }
        // Network error or other failure: keep the persisted user (if any)
        // and let the user retry. Don't wipe local state.
      })
      .finally(() => setValidating(false));
  }, [ready, token]);

  return validating;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const ready = useAuthHydrated();
  const validating = useTokenValidation(ready, token);
  const isPlacementRoute = pathname === "/student/placement";

  useEffect(() => {
    if (!ready) return;
    if (validating) return; // suspend redirects while /auth/me is in flight
    if (!user) { router.replace("/login"); return; }
    // Admins don't take the placement diagnostic.
    if (roleIs(user, "ADMIN")) return;
    if (!user.placementDone && !isPlacementRoute) router.replace("/student/placement");
  }, [ready, validating, user, router, isPlacementRoute]);

  if (!ready || validating) return <Spinner />;
  if (!user) return <Spinner />;
  if (!roleIs(user, "ADMIN") && !user.placementDone && !isPlacementRoute) return <Spinner />;

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const ready = useAuthHydrated();
  const validating = useTokenValidation(ready, token);

  useEffect(() => {
    if (!ready) return;
    if (validating) return;
    if (!user) router.replace("/login");
    else if (!roleIs(user, "ADMIN")) router.replace("/student/dashboard");
  }, [ready, validating, user, router]);

  if (!ready || validating) return <Spinner />;
  if (!user || !roleIs(user, "ADMIN")) return <Spinner />;

  return <>{children}</>;
}