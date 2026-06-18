"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/api";

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/60 focus:ring-2 focus:ring-[#d97706]/10 transition-all";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !pass.trim()) return setError("Please fill in all fields.");

    setLoading(true);
    try {
      const user = await login(email.trim(), pass, "admin");
      if (user.role !== "ADMIN") {
        // Logged in, but not as admin — sign out and surface error.
        await useAuthStore.getState().logout();
        setError("This account does not have admin access.");
        return;
      }
      router.push("/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422 || err.status === 401) {
          setError(err.errors?.email?.[0] ?? err.message ?? "Invalid admin credentials.");
        } else if (err.status === 403) {
          setError("This account is not authorised for the admin area.");
        } else if (err.status === 0) {
          setError("Cannot reach the server. Check that the backend is running.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Admin sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fef9f0] px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-[#d97706]/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex mb-6">
            <img src="/logo1.png" alt="UIU CMOR" className="h-20 w-auto object-contain" />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={18} className="text-[#d97706]" />
            <h1 className="font-heading text-xl font-bold text-slate-900">Admin Access</h1>
          </div>
          <p className="text-xs text-slate-400">Restricted — authorized faculty only</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-7 space-y-4">
          <div className="flex items-start gap-2.5 bg-[#d97706]/8 border border-[#d97706]/20 rounded-xl px-4 py-3">
            <Shield size={13} className="text-[#d97706] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#b45309]">Demo Credentials</p>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">admin@uiu.ac.bd / UIUAdmin2024</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@uiu.ac.bd"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/60 focus:ring-2 focus:ring-[#d97706]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-orange glow-orange text-white font-semibold py-3 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:scale-100 text-sm"
            >
              {loading ? "Verifying…" : "Access Admin Portal"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
