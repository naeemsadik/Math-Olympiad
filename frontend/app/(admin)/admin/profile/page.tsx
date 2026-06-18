"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  User, Shield, Mail, Building2, Save, UserCircle, Phone,
  MapPin, Info, Calendar, CheckCircle2, Lock,
} from "lucide-react";

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 12px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.03)",
};
const fieldCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/60 focus:ring-2 focus:ring-[#d97706]/10 transition-all";
const labelCls = "text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5";

export default function AdminProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "", email: "", department: "", phone: "",
    address: "", about: "", dob: "", gender: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "", email: user.email || "",
        department: user.department || "", phone: user.phone || "",
        address: user.address || "", about: user.about || "",
        dob: user.dob || "", gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      updateProfile(formData);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch {
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #d97706, #f59e0b, #d97706)" }} />
        <div className="p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-heading font-bold text-4xl"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 8px 24px rgba(217,119,6,0.35)" }}
            >
              {user.name[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md bg-[#d97706]">
              <Shield size={12} className="text-white" />
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-heading text-2xl font-extrabold text-slate-900">{user.name}</h1>
                <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
                  <Mail size={12} /> {user.email}
                </p>
                {user.department && (
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                    <Building2 size={11} /> {user.department} Department
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "rgba(217,119,6,0.1)", color: "#d97706", border: "1px solid rgba(217,119,6,0.2)" }}>
                  <Shield size={11} /> {user.role}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <CheckCircle2 size={11} /> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-5 gap-4 sm:gap-6">

        {/* Left: System Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl p-4 sm:p-6" style={cardStyle}>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#d97706]/10">
                <Info size={14} className="text-[#d97706]" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-sm">System Info</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Role",       value: user.role,   color: "#d97706" },
                { label: "Level",      value: user.level,  color: "#d97706" },
                { label: "Status",     value: "Active",    color: "#10b981" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ color, backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-6" style={cardStyle}>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100">
                <Lock size={14} className="text-slate-500" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-sm">Account</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className={labelCls}><Mail size={10} /> Email</p>
                <p className="text-sm text-slate-800 font-medium break-all">{user.email}</p>
              </div>
              {user.phone && (
                <div className="pt-2">
                  <p className={labelCls}><Phone size={10} /> Phone</p>
                  <p className="text-sm text-slate-800 font-medium">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5" style={cardStyle}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#10b981]/10">
                <User size={14} className="text-[#10b981]" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-sm">Edit Profile</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><UserCircle size={10} /> Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}><Mail size={10} /> Email Address</label>
                <input name="email" value={formData.email} onChange={handleChange} disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" />
              </div>
              <div>
                <label className={labelCls}><Building2 size={10} /> Department</label>
                <input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. CSE" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}><Phone size={10} /> Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+880..." className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}><Calendar size={10} /> Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className={fieldCls + " scheme-light"} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={fieldCls}>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}><MapPin size={10} /> Address</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Full address..." className={fieldCls} />
            </div>

            <div>
              <label className={labelCls}>Bio / About</label>
              <textarea name="about" value={formData.about} onChange={handleChange} rows={3}
                className={fieldCls + " resize-none"} placeholder="Tell us about yourself..." />
            </div>

            <div className="flex items-center justify-between pt-2">
              {message && (
                <p className={`text-sm ${message.type === "success" ? "text-[#10b981]" : "text-red-500"}`}>
                  {message.text}
                </p>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="ml-auto flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Save size={15} />
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
