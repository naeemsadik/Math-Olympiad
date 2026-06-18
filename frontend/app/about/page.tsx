import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Users, Mail, MapPin, Sigma } from "lucide-react";

const milestones = [
  {
    year: "2001",
    title: "The Beginning",
    desc: "Educators and mathematicians united to popularize creative mathematics, laying the foundation for an organized olympiad movement in Bangladesh.",
  },
  {
    year: "2003",
    title: "First National Olympiad",
    desc: "The first large-scale national math olympiad was organized by Bangladesh Mathematical Olympiad Committee, supported by Dutch-Bangla Bank PLC, drawing students from schools and colleges nationwide.",
  },
  {
    year: "2004",
    title: "Bangladesh Joins IMO",
    desc: "Bangladesh officially participated in the International Mathematical Olympiad for the first time — a landmark moment for the country's mathematical community.",
  },
  {
    year: "2005–2009",
    title: "Rapid Growth",
    desc: "Regional olympiads spread across cities. Math camps, training sessions, and problem-solving books gained widespread popularity among students.",
  },
  {
    year: "2010",
    title: "Olympiad Culture Expands",
    desc: "Math Olympiad became a household name among school and college students. Newspaper coverage and online forums amplified interest nationwide.",
  },
  {
    year: "2014",
    title: "International Recognition",
    desc: "Bangladeshi students began achieving stronger international performances through improved training systems and dedicated mentorship programs.",
  },
  {
    year: "2020",
    title: "Online Olympiads",
    desc: "The pandemic shifted all olympiad activities online. Virtual camps, digital exams, and e-learning platforms ensured continuity through COVID-19.",
  },
  {
    year: "2026",
    title: "Present Era",
    desc: "BdMO now organizes nationwide programs with thousands of participants annually. Students prepare using online platforms, global resources, and advanced problem-solving communities.",
  },
];

const team = [
  { name: "Dr. Md. Rafiqul Islam", role: "Faculty Advisor", dept: "Department of Mathematics", initial: "R" },
  { name: "Prof. Tahmina Akhtar", role: "Competition Coordinator", dept: "Department of CSE", initial: "T" },
  { name: "Adnan Chowdhury", role: "Student Club President", dept: "BSc CSE, Batch 50", initial: "A" },
  { name: "Sarah Jubaida", role: "Problem Setter Lead", dept: "BSc EEE, Batch 49", initial: "S" },
];

const stats = [
  { value: "4,281", label: "Active Students" },
  { value: "500+", label: "Practice Problems" },
  { value: "12", label: "Departments" },
  { value: "6", label: "National Medalists" },
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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-10 pb-10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#d97706]/6 blur-[130px]" />
          </div>
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-sm text-[#d97706] mb-5">
              <Sigma size={13} />
              United International University
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-[4rem] text-slate-900 leading-[1.1] tracking-tight">
              About <span className="gradient-text">UIU Math Olympiad</span>
            </h1>
            <p className="mt-4 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Founded in 2019, UIU Math Olympiad has been at the forefront of mathematical
              excellence and competitive problem solving within United International University.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Mission + Vision ── */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-8 bg-white border border-[#d97706]/20 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#d97706]/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <p className="font-heading font-bold text-[#d97706] text-xl mb-3">Our Mission</p>
                <p className="text-slate-500 leading-relaxed text-sm">
                  To democratise access to olympiad-level mathematics preparation inside UIU and help
                  every motivated student reach their peak potential in national and international
                  competitions, while nurturing future problem-solvers and mathematical thinkers.
                </p>
              </div>
            </div>
            <div className="rounded-2xl p-8 bg-white border border-[#f59e0b]/20 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <p className="font-heading font-bold text-[#f59e0b] text-xl mb-3">Our Vision</p>
                <p className="text-slate-500 leading-relaxed text-sm">
                  To be the leading student-run mathematics hub in Bangladesh, recognised for
                  fostering excellence in competitive mathematics, innovation in problem solving,
                  and sustained national and international olympiad achievement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl py-5 sm:py-7 px-3 sm:px-5 text-center bg-white border border-slate-200 hover:border-[#d97706]/30 transition-colors shadow-sm"
              >
                <p className="font-heading text-3xl sm:text-4xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Our Journey ── */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <SectionLabel>Timeline</SectionLabel>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8 sm:mb-12">
            History of Math Olympiad in Bangladesh
          </h2>

          <div className="relative max-w-3xl mx-auto">
            {/* Mobile: left-side vertical timeline */}
            <div className="sm:hidden relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-[#d97706]/30 to-transparent" />
              <div className="flex flex-col gap-5">
                {milestones.map((m) => (
                  <div key={m.year + "-m"} className="relative">
                    <div className="absolute -left-4.5 top-4 w-3 h-3 rounded-full bg-[#d97706] ring-2 ring-[#d97706]/30 ring-offset-2 ring-offset-[#f5f4f1] z-10" />
                    <div className="rounded-xl p-4 bg-white border border-slate-200 shadow-sm">
                      <p className="text-xs font-bold text-[#d97706] mb-1">{m.year}</p>
                      <p className="font-heading font-semibold text-slate-900 text-sm mb-1">{m.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: alternating left/right */}
            <div className="hidden sm:block">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-linear-to-b from-transparent via-[#d97706]/30 to-transparent" />
              <div className="flex flex-col gap-8">
                {milestones.map((m, i) => {
                  const isRight = i % 2 === 0;
                  return (
                    <div key={m.year} className="grid grid-cols-[1fr_28px_1fr] items-center">
                      {isRight ? (
                        <div />
                      ) : (
                        <div className="pr-7">
                          <div className="rounded-xl p-5 bg-white border border-slate-200 hover:border-[#d97706]/30 transition-colors shadow-sm">
                            <p className="text-xs font-bold text-[#d97706] mb-1.5">{m.year}</p>
                            <p className="font-heading font-semibold text-slate-900 text-sm mb-1.5">{m.title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-center z-10">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#d97706] ring-2 ring-[#d97706]/30 ring-offset-2 ring-offset-[#f5f4f1]" />
                      </div>
                      {isRight ? (
                        <div className="pl-7">
                          <div className="rounded-xl p-5 bg-white border border-slate-200 hover:border-[#d97706]/30 transition-colors shadow-sm">
                            <p className="text-xs font-bold text-[#d97706] mb-1.5">{m.year}</p>
                            <p className="font-heading font-semibold text-slate-900 text-sm mb-1.5">{m.title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Team ── */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <SectionLabel>People</SectionLabel>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">The Team</h2>
          <p className="text-slate-400 text-sm text-center mb-8">
            Faculty and students driving the UIU Math Olympiad ecosystem.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl p-6 text-center bg-white border border-slate-200 hover:border-[#d97706]/30 transition-colors shadow-sm"
              >
                <div className="w-12 h-12 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {member.initial}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                <p className="text-xs text-[#d97706] mt-1">{member.role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{member.dept}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── CTA ── */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 pb-12">
          <div className="rounded-2xl px-5 sm:px-8 py-6 sm:py-7 bg-white border border-slate-200 flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:text-left relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 top-0 w-48 h-full bg-[#d97706]/3 blur-3xl" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center shrink-0">
                <Users size={18} className="text-[#d97706]" />
              </div>
              <div>
                <p className="font-heading font-bold text-slate-900 text-base leading-tight">Join the Community</p>
                <p className="text-xs text-slate-400 mt-0.5">Open to all UIU students — no prior experience needed.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative md:ml-auto flex-wrap justify-center">
              <Link
                href="/dashboard"
                className="gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all whitespace-nowrap"
              >
                Start Practicing Free
              </Link>
              <a
                href="mailto:mathclub@uiu.ac.bd"
                className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all whitespace-nowrap"
              >
                <Mail size={13} />
                Contact Us
              </a>
            </div>

            <div className="flex flex-col gap-1 relative shrink-0 md:border-l md:border-slate-200 md:pl-6 items-center md:items-start">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                <MapPin size={11} className="text-[#d97706]" /> Madani Ave, Dhaka
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                <Mail size={11} className="text-[#d97706]" /> mathclub@uiu.ac.bd
              </span>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
