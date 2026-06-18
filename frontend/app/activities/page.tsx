import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Trophy, Users, BookOpen, Calendar, Mic2, Globe, ArrowRight, Flame, Star, GraduationCap,
} from "lucide-react";

const activities = [
  {
    icon: Trophy,
    title: "Competitions",
    badge: "Annual",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    color: "#d97706",
    desc: "Our flagship annual UIU Internal Math Olympiad is open to all students across all departments. Held each spring with preliminary, semi-final, and final rounds. Top performers represent UIU at national-level events.",
    highlights: ["3 competitive rounds", "Cash prizes & certificates", "Department-wise ranking"],
  },
  {
    icon: Calendar,
    title: "Workshops",
    badge: "Monthly",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "#059669",
    desc: "Hands-on workshops on focused mathematical techniques — from proof writing and olympiad geometry to advanced combinatorics and algebraic strategies. Open to all levels.",
    highlights: ["Technique-focused sessions", "Mixed difficulty levels", "Open to all UIU students"],
  },
  {
    icon: GraduationCap,
    title: "Mock Olympiads",
    badge: "Pre-Olympiad",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    color: "#f59e0b",
    desc: "Full-length timed simulations of BdMO regional and national rounds. Exam conditions are replicated precisely — same time limits, problem formats, and scoring rubrics — so students arrive prepared.",
    highlights: ["Held Jan–Feb each year", "Led by faculty advisors", "Past paper walkthroughs"],
  },
  {
    icon: Mic2,
    title: "Training Sessions",
    badge: "Weekly",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    color: "#d97706",
    desc: "Every Thursday evening, our student community gathers — physically and online — to tackle a curated problem set. Solutions are discussed, proofs are critiqued, and members learn collaboratively.",
    highlights: ["Every Thursday, 5 PM", "Algebra, NT, Geo, Combo", "Solution presentations"],
  },
  {
    icon: Users,
    title: "Seminars",
    badge: "Periodic",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    color: "#db2777",
    desc: "We regularly invite mathematicians, BdMO alumni, and IMO participants to share their journey, teach advanced topics, and inspire the next generation. Past seminars have covered combinatorial games and research math.",
    highlights: ["Eminent speakers", "Recorded & archived", "Q&A sessions included"],
  },
  {
    icon: Globe,
    title: "Problem-Solving Camps",
    badge: "Intensive",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    color: "#0891b2",
    desc: "Multi-day intensive camps before major olympiad cycles. Students are exposed to a high volume of problems across all topics with dedicated mentors, peer review sessions, and strategy coaching.",
    highlights: ["3+ partner universities", "Team & individual tracks", "Mentored camp format"],
  },
];

const timeline = [
  { month: "January", events: ["Mock Olympiad begins", "Training Session kick-off"] },
  { month: "February", events: ["BdMO Regional Round support", "Problem-Solving Camp"] },
  { month: "March", events: ["Workshop: Olympiad Geometry", "Weekly sessions resume"] },
  { month: "April–May", events: ["UIU Internal Olympiad — Preliminary", "BdMO National Round"] },
  { month: "June", events: ["UIU Olympiad Finals & Award Ceremony", "Annual report published"] },
  { month: "July–August", events: ["Summer training sessions", "New cohort recruitment"] },
  { month: "September", events: ["Mentorship programme — new batch", "Seminar: Mathematical Research"] },
  { month: "October–December", events: ["Weekly sessions in full swing", "Preparation for next BdMO cycle"] },
];

const stats = [
  { value: "500+", label: "Students Trained", icon: GraduationCap, color: "#d97706" },
  { value: "6", label: "National Medalists", icon: Trophy, color: "#f59e0b" },
  { value: "48", label: "Sessions / Year", icon: Calendar, color: "#b45309" },
  { value: "3+", label: "Partner Institutions", icon: Globe, color: "#d97706" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[#d97706]/30" />
      <span className="text-xs font-semibold text-[#d97706] uppercase tracking-widest">{children}</span>
      <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[#d97706]/30" />
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-16 pb-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#d97706]/6 blur-[120px]" />
          </div>
          <div className="relative max-w-screen-xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-sm text-[#92400e] mb-7">
              <Flame size={13} />
              UIU Centre for Math Olympiad &amp; Research
            </div>
            <h1 className="font-heading font-extrabold text-5xl md:text-[3.5rem] text-slate-900 leading-[1.1] tracking-tight">
              Our <span className="gradient-text-orange">Activities</span>
            </h1>
            <p className="mt-5 text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              From weekly problem sessions to national-level training camps, UIU CMOR runs a
              full calendar of programmes to build mathematical excellence on campus and beyond.
            </p>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Stats ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-2xl py-7 px-5 text-center bg-white border border-slate-200 hover:border-[#d97706]/30 transition-colors shadow-sm"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}
                >
                  <Icon size={17} style={{ color }} />
                </div>
                <p className="font-heading text-3xl font-extrabold gradient-text-orange">{value}</p>
                <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Activities ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Programmes &amp; Initiatives</h2>
          <p className="text-slate-400 text-sm text-center mb-12">
            A year-round ecosystem of learning, competition, and community.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {activities.map(({ icon: Icon, title, badge, badgeColor, color, desc, highlights }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-[#d97706]/25 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}
                    >
                      <Icon size={19} style={{ color }} />
                    </div>
                    <p className="font-heading font-bold text-slate-900 text-base leading-snug">{title}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${badgeColor}`}>
                    {badge}
                  </span>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>

                <ul className="flex flex-col gap-1.5 mt-auto">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-slate-600">
                      <Star size={10} style={{ color }} className="shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Annual Calendar ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>Calendar</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Annual Activity Calendar</h2>
          <p className="text-slate-400 text-sm text-center mb-12">
            A month-by-month overview of UIU CMOR&apos;s yearly programme.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeline.map(({ month, events }) => (
              <div
                key={month}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-[#d97706]/25 transition-colors"
              >
                <p className="font-heading font-bold text-[#d97706] text-sm mb-3">{month}</p>
                <ul className="flex flex-col gap-2">
                  {events.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]/40 mt-1.5 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-screen-xl mx-auto px-6 pb-16">
          <div className="rounded-2xl px-8 py-10 bg-white border border-slate-200 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 top-0 w-64 h-full bg-[#d97706]/3 blur-3xl" />
            </div>
            <div className="relative flex items-center gap-4 shrink-0">
              <div className="w-11 h-11 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center">
                <BookOpen size={20} className="text-[#d97706]" />
              </div>
              <div>
                <p className="font-heading font-bold text-slate-900 text-base">Want to get involved?</p>
                <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
                  Join any of our activities — all UIU students are welcome, no experience required.
                </p>
              </div>
            </div>
            <div className="flex gap-3 relative md:ml-auto flex-wrap justify-center">
              <Link
                href="/registration"
                className="gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all whitespace-nowrap"
              >
                Register Now
              </Link>
              <Link
                href="/resources"
                className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all whitespace-nowrap"
              >
                View Resources <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
