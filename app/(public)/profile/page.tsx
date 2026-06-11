"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, MapPin, Calendar, BookOpen, Edit3, Check, X,
  GraduationCap, FileText, Building2, Star, Flame, Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUsersStore } from "@/store/usersStore";
import type { InstitutionType } from "@/types";

const genderOptions = ["Prefer not to say", "Male", "Female", "Non-binary", "Other"];
const deptOptions = ["CSE", "EEE", "BBA", "Math", "Civil", "Other"];
const institutionTypeOptions: InstitutionType[] = ["School", "College", "University", "Graduate"];

const CLASS_YEAR_OPTIONS: Record<InstitutionType, string[]> = {
  School:     ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"],
  College:    ["Class 11","Class 12"],
  University: ["1st Year","2nd Year","3rd Year","4th Year"],
  Graduate:   ["Masters","PhD","Post-Doc"],
};

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 12px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.03)",
};
const fieldCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/60 focus:ring-2 focus:ring-[#d97706]/10 transition-all";
const labelCls = "text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { updateUser } = useUsersStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [institute, setInstitute] = useState("");
  const [university, setUniversity] = useState("");
  const [dept, setDept] = useState("");
  const [institutionType, setInstitutionType] = useState<InstitutionType | "">("");
  const [classYear, setClassYear] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted && !user) router.replace("/login"); }, [mounted, user, router]);
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setGender(user.gender ?? "");
      setDob(user.dob ?? "");
      setPhone(user.phone ?? "");
      setAddress(user.address ?? "");
      setInstitute(user.institute ?? "");
      setUniversity(user.university ?? "");
      setDept(user.department ?? "");
      setInstitutionType(user.institutionType ?? "");
      setClassYear(user.classYear ?? "");
      setAbout(user.about ?? "");
    }
  }, [user]);

  if (!mounted || !user) return null;

  const handleSave = () => {
    updateProfile({ name, gender, dob, phone, address, institute, university, department: dept, institutionType: institutionType || undefined, classYear, about });
    updateUser(user.id, { name, dept, institute });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setName(user.name ?? "");  setGender(user.gender ?? "");
    setDob(user.dob ?? "");     setPhone(user.phone ?? "");
    setAddress(user.address ?? ""); setInstitute(user.institute ?? "");
    setUniversity(user.university ?? ""); setDept(user.department ?? "");
    setInstitutionType(user.institutionType ?? ""); setClassYear(user.classYear ?? "");
    setAbout(user.about ?? "");
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4 sm:space-y-6">

      {saved && (
        <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl px-4 py-3">
          <Check size={15} /> Profile updated successfully.
        </div>
      )}

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Top accent strip */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #d97706, #f59e0b, #d97706)" }} />

        <div className="p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-heading font-bold text-4xl shadow-xl"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 8px 24px rgba(217,119,6,0.35)" }}
            >
              {user.name[0]}
            </div>
          </div>

          {/* Name + details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-heading text-2xl font-extrabold text-slate-900">{user.name}</h1>
                <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
                  <Mail size={12} /> {user.email}
                </p>
                {user.institute && (
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                    <Building2 size={11} /> {user.institute}
                  </p>
                )}
              </div>

              {/* Edit / Save buttons */}
              <div className="flex gap-2 shrink-0">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors">
                      <X size={13} /> Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1.5 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all">
                      <Check size={13} /> Save
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {user.classYear && (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ backgroundColor: "#d97706" + "10", border: "1px solid " + "#d97706" + "20" }}>
                  <GraduationCap size={13} style={{ color: "#d97706" }} />
                  <span className="text-xs font-bold" style={{ color: "#d97706" }}>{user.classYear}</span>
                </div>
              )}
              {[
                { icon: Star, label: "Level", value: user.level, color: "#d97706" },
                { icon: Zap, label: "XP", value: user.xp.toLocaleString(), color: "#7c3aed" },
                { icon: Flame, label: "Streak", value: `${user.streak}d`, color: "#10b981" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
                  style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}
                >
                  <Icon size={13} style={{ color }} />
                  <span className="text-xs text-slate-500 font-medium">{label}</span>
                  <span className="text-xs font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column info grid */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">

        {/* Personal Information */}
        <div className="rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5" style={cardStyle}>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(217,119,6,0.1)" }}>
              <User size={14} className="text-[#d97706]" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Personal Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelCls}><User size={10} /> Full Name</p>
              {editing ? <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={fieldCls} />
                : <p className="text-sm text-slate-800 font-medium">{user.name || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
            </div>
            <div>
              <p className={labelCls}>Gender</p>
              {editing ? (
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={fieldCls}>
                  {genderOptions.map((g) => <option key={g}>{g}</option>)}
                </select>
              ) : <p className="text-sm text-slate-800 font-medium">{user.gender || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
            </div>
            <div>
              <p className={labelCls}><Calendar size={10} /> Date of Birth</p>
              {editing ? <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={fieldCls} />
                : <p className="text-sm text-slate-800 font-medium">{user.dob || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
            </div>
            <div>
              <p className={labelCls}><Phone size={10} /> Phone</p>
              {editing ? <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880..." className={fieldCls} />
                : <p className="text-sm text-slate-800 font-medium">{user.phone || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
            </div>
          </div>

          <div>
            <p className={labelCls}><Mail size={10} /> Email Address</p>
            <p className="text-sm text-slate-800 font-medium">{user.email}</p>
          </div>

          <div>
            <p className={labelCls}><MapPin size={10} /> Address</p>
            {editing ? <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, Country" className={fieldCls} />
              : <p className="text-sm text-slate-800 font-medium">{user.address || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
          </div>
        </div>

        {/* Academic Information */}
        <div className="rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5" style={cardStyle}>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
              <GraduationCap size={14} className="text-[#10b981]" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Academic Information</h3>
          </div>

          <div>
            <p className={labelCls}><Building2 size={10} /> Institute Name</p>
            {editing ? <input value={institute} onChange={(e) => setInstitute(e.target.value)} placeholder="School / College / University" className={fieldCls} />
              : <p className="text-sm text-slate-800 font-medium">{user.institute || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelCls}><GraduationCap size={10} /> Institution Type</p>
              {editing ? (
                <select
                  value={institutionType}
                  onChange={(e) => {
                    const val = e.target.value as InstitutionType | "";
                    setInstitutionType(val);
                    setClassYear("");
                  }}
                  className={fieldCls}
                >
                  <option value="">Select type</option>
                  {institutionTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <p className="text-sm text-slate-800 font-medium">{user.institutionType || <span className="text-slate-400 italic text-xs">Not set</span>}</p>
              )}
            </div>
            <div>
              <p className={labelCls}><BookOpen size={10} /> Class / Year</p>
              {editing ? (
                institutionType ? (
                  <select value={classYear} onChange={(e) => setClassYear(e.target.value)} className={fieldCls}>
                    <option value="">Select</option>
                    {CLASS_YEAR_OPTIONS[institutionType].map((c) => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input value={classYear} onChange={(e) => setClassYear(e.target.value)} placeholder="e.g. 3rd Year" className={fieldCls} />
                )
              ) : (
                <p className="text-sm text-slate-800 font-medium">{user.classYear || <span className="text-slate-400 italic text-xs">Not set</span>}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelCls}><GraduationCap size={10} /> University</p>
              {editing ? <input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="University name" className={fieldCls} />
                : <p className="text-sm text-slate-800 font-medium">{user.university || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
            </div>
            <div>
              <p className={labelCls}><BookOpen size={10} /> Department</p>
              {editing ? (
                <select value={dept} onChange={(e) => setDept(e.target.value)} className={fieldCls}>
                  {deptOptions.map((d) => <option key={d}>{d}</option>)}
                </select>
              ) : <p className="text-sm text-slate-800 font-medium">{user.department || <span className="text-slate-400 italic text-xs">Not set</span>}</p>}
            </div>
          </div>

          <div>
            <p className={labelCls}><FileText size={10} /> About Me</p>
            {editing ? (
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3}
                placeholder="Tell us a bit about yourself..." className={fieldCls + " resize-none"} />
            ) : (
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {user.about || <span className="text-slate-400 italic text-xs">Not set</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
