"use client";

import { ClipboardList, Calendar, Users, Trophy, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";

const events = [
  {
    title: "UIU Internal Math Olympiad 2025",
    type: "Competition",
    date: "April 18, 2025",
    deadline: "April 10, 2025",
    seats: 120,
    registered: 87,
    color: "#d97706",
    icon: Trophy,
    open: true,
    desc: "Annual flagship competition open to all UIU students. Preliminary, semi-final, and grand final rounds.",
  },
  {
    title: "BdMO Pre-Training Camp",
    type: "Training",
    date: "January 20–24, 2025",
    deadline: "January 15, 2025",
    seats: 40,
    registered: 38,
    color: "#f59e0b",
    icon: GraduationCap,
    open: true,
    desc: "Intensive 5-day prep camp before the BdMO regional round. Covers all four olympiad topics.",
  },
  {
    title: "Olympiad Geometry Workshop",
    type: "Workshop",
    date: "March 8, 2025",
    deadline: "March 5, 2025",
    seats: 30,
    registered: 30,
    color: "#b45309",
    icon: Users,
    open: false,
    desc: "Focused workshop on synthetic and coordinate geometry techniques for olympiad problems.",
  },
  {
    title: "Weekly Problem Sessions",
    type: "Ongoing",
    date: "Every Thursday, 5 PM",
    deadline: "Open all semester",
    seats: null,
    registered: null,
    color: "#059669",
    icon: Calendar,
    open: true,
    desc: "Drop-in weekly sessions. No registration needed — just show up at the UIU Math Lab.",
  },
];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 focus:ring-2 focus:ring-[#d97706]/10 transition-all";

export default function RegistrationPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", id: "", dept: "", year: "", email: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-0">

        {/* Hero */}
        <section className="relative overflow-hidden pt-10 pb-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#d97706]/6 blur-[120px]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-sm text-[#92400e] mb-5">
              <ClipboardList size={13} />
              Open Registrations
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-[3.5rem] text-slate-900 leading-[1.1] tracking-tight">
              <span className="gradient-text-orange">Register</span> for Events
            </h1>
            <p className="mt-3 sm:mt-5 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
              Sign up for upcoming olympiads, training camps, workshops, and seminars hosted by UIU CMOR.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* Events list */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {events.map(({ title, type, date, deadline, seats, registered, color, icon: Icon, open, desc }) => {
              const pct = seats && registered ? Math.round((registered / seats) * 100) : null;
              const isSelected = selected === title;
              return (
                <div
                  key={title}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  style={isSelected ? { borderColor: `${color}40`, boxShadow: `0 4px 20px ${color}15` } : {}}
                  onClick={() => setSelected(isSelected ? null : title)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-heading font-bold text-slate-900 text-sm leading-snug">{title}</p>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full border font-medium shrink-0"
                          style={{ backgroundColor: `${color}10`, color, borderColor: `${color}35` }}
                        >
                          {type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{desc}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {date}</span>
                        <span className="flex items-center gap-1"><ClipboardList size={11} /> Deadline: {deadline}</span>
                      </div>
                      {pct !== null && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{registered}/{seats} registered</span>
                            <span style={{ color }} className="font-semibold">{pct}% full</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                          </div>
                        </div>
                      )}
                      <div className="mt-4">
                        {open ? (
                          <button
                            className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, #f59e0b, ${color})`, color: "#fff", boxShadow: `0 2px 8px ${color}40` }}
                            onClick={(e) => { e.stopPropagation(); setSelected(title); }}
                          >
                            Register Now <ArrowRight size={11} className="inline ml-1" />
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full">
                            Registration Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* Registration form */}
        <section className="max-w-7xl mx-auto px-6 py-14" id="form">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">Registration Form</h2>
            <p className="text-slate-400 text-sm mb-8">
              {selected ? `Registering for: ` : "Select an event above, then fill in your details below."}
              {selected && <span className="text-[#d97706] font-semibold">{selected}</span>}
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                <p className="font-heading font-bold text-slate-900 text-lg">Registration Submitted!</p>
                <p className="text-slate-500 text-sm mt-2">
                  You&apos;ll receive a confirmation email at <span className="font-semibold text-slate-700">{form.email}</span> shortly.
                </p>
                <button
                  className="mt-5 text-sm text-[#d97706] font-semibold hover:underline"
                  onClick={() => { setSubmitted(false); setForm({ name: "", id: "", dept: "", year: "", email: "", phone: "" }); setSelected(null); }}
                >
                  Register for another event
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <input className={inputCls} placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Student ID</label>
                    <input className={inputCls} placeholder="e.g. 011241234" value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value}))} required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Department</label>
                    <select className={inputCls} value={form.dept} onChange={e => setForm(f => ({...f, dept: e.target.value}))} required>
                      <option value="">Select department</option>
                      <option>CSE</option><option>EEE</option><option>BBA</option><option>Math</option><option>Physics</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Year of Study</label>
                    <select className={inputCls} value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} required>
                      <option value="">Select year</option>
                      <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">UIU Email</label>
                  <input type="email" className={inputCls} placeholder="your.name@uiu.ac.bd" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <input className={inputCls} placeholder="+880 XXXXXXXXXX" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required />
                </div>
                <button
                  type="submit"
                  className="mt-2 gradient-orange glow-orange text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition-all text-sm"
                >
                  Submit Registration
                </button>
              </form>
            )}
          </div>
        </section>

    </div>
  );
}
