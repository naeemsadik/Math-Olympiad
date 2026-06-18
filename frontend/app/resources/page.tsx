import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { BookOpen, ExternalLink, FileText, Video, Globe, ArrowRight, Lightbulb, Download } from "lucide-react";

const topics = [
  { name: "Number Theory", level: "Foundation", color: "#d97706", problems: 120 },
  { name: "Combinatorics", level: "Intermediate", color: "#f59e0b", problems: 95 },
  { name: "Geometry", level: "Foundation", color: "#b45309", problems: 110 },
  { name: "Algebra", level: "Foundation", color: "#059669", problems: 130 },
  { name: "Inequalities", level: "Advanced", color: "#d97706", problems: 70 },
  { name: "Graph Theory", level: "Advanced", color: "#dc2626", problems: 55 },
];

const books = [
  {
    title: "Art and Craft of Problem Solving",
    author: "Paul Zeitz",
    level: "Intermediate",
    desc: "A comprehensive introduction to mathematical problem solving for olympiad aspirants.",
  },
  {
    title: "Problem Solving Strategies",
    author: "Arthur Engel",
    level: "Advanced",
    desc: "Widely regarded as one of the best olympiad preparation books ever written.",
  },
  {
    title: "How to Solve It",
    author: "George Pólya",
    level: "Beginner",
    desc: "Classic text teaching the fundamentals of mathematical reasoning and problem solving.",
  },
  {
    title: "Mathematical Olympiad Challenges",
    author: "Titu Andreescu",
    level: "Intermediate",
    desc: "Carefully selected problems with detailed solutions and insights into olympiad math.",
  },
];

const onlineResources = [
  {
    icon: Globe,
    name: "Art of Problem Solving",
    url: "https://artofproblemsolving.com",
    desc: "The gold standard community for competitive math. Extensive wikis, forums, and problem sets.",
    color: "#d97706",
  },
  {
    icon: Video,
    name: "3Blue1Brown",
    url: "https://youtube.com/@3blue1brown",
    desc: "Visually stunning math explanations that build deep intuition for complex concepts.",
    color: "#f59e0b",
  },
  {
    icon: Globe,
    name: "BdMO Official",
    url: "https://matholympiad.org.bd",
    desc: "Official Bangladesh Mathematical Olympiad site — past problems, registration, and news.",
    color: "#b45309",
  },
  {
    icon: FileText,
    name: "IMO Problems Archive",
    url: "https://imo-official.org",
    desc: "All International Mathematical Olympiad problems and solutions since 1959.",
    color: "#059669",
  },
];

const prepItems = [
  {
    icon: Download,
    title: "Syllabus & Guidelines",
    desc: "Download the official UIU CMOR preparation syllabus covering all four olympiad topics with level progressions.",
  },
  {
    icon: FileText,
    title: "Previous Questions",
    desc: "UIU Internal Olympiad and BdMO past papers from 2015 to present, fully organised by year and round.",
  },
  {
    icon: BookOpen,
    title: "Study Materials",
    desc: "Faculty-curated notes, lecture slides, and topic summaries compiled by UIU CMOR advisors.",
  },
  {
    icon: Video,
    title: "Video Lectures",
    desc: "Recorded sessions from our workshops, seminars, and training camps — free for all UIU students.",
  },
];

const tips = [
  {
    icon: Lightbulb,
    title: "Master the Basics First",
    desc: "Before jumping to advanced topics, ensure you have a rock-solid foundation in high-school algebra, geometry, and number theory.",
  },
  {
    icon: FileText,
    title: "Solve Past Problems",
    desc: "Go through BdMO regional and national papers from previous years. Pattern recognition is a superpower in olympiad math.",
  },
  {
    icon: BookOpen,
    title: "Write Clean Solutions",
    desc: "Practice writing proofs clearly. Partial credit in olympiads often depends on how well your reasoning is communicated.",
  },
  {
    icon: Globe,
    title: "Join a Study Group",
    desc: "Discussing problems with peers accelerates learning dramatically. Join our Discord or attend UIU weekly sessions.",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Foundation: "bg-amber-50 text-amber-700 border-amber-200",
  Intermediate: "bg-orange-50 text-orange-700 border-orange-200",
  Advanced: "bg-red-50 text-red-700 border-red-200",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[#d97706]/30" />
      <span className="text-xs font-semibold text-[#d97706] uppercase tracking-widest">{children}</span>
      <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[#d97706]/30" />
    </div>
  );
}

export default function ResourcesPage() {
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
              <BookOpen size={13} />
              Curated by UIU CMOR Faculty &amp; Students
            </div>
            <h1 className="font-heading font-extrabold text-5xl md:text-[3.5rem] text-slate-900 leading-[1.1] tracking-tight">
              Resources &amp; <span className="gradient-text-orange">Preparation</span>
            </h1>
            <p className="mt-5 text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Everything you need to prepare for BdMO and beyond — syllabus, past papers, books, study materials, video lectures, and proven preparation guidelines.
            </p>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Prep Materials ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>Downloads</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Preparation Materials</h2>
          <p className="text-slate-400 text-sm text-center mb-10">
            UIU CMOR-curated study resources available to all students.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {prepItems.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4 shadow-sm hover:border-[#d97706]/25 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#d97706]" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Topics / Syllabus ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>Syllabus</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Core Topics</h2>
          <p className="text-slate-400 text-sm text-center mb-10">
            Structured curriculum from foundation to advanced olympiad level.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link
                key={topic.name}
                href="/topics"
                className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between group hover:border-[#d97706]/30 hover:shadow-md transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-heading font-bold text-sm shrink-0"
                    style={{ backgroundColor: topic.color }}
                  >
                    {topic.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{topic.name}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-medium ${levelColors[topic.level]}`}>
                      {topic.level}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-900">{topic.problems}</p>
                  <p className="text-xs text-slate-400">problems</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-all"
            >
              Browse Full Syllabus <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Recommended Books ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>Reading List</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Recommended Books</h2>
          <p className="text-slate-400 text-sm text-center mb-10">
            Hand-picked by our faculty advisors for structured olympiad preparation.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {books.map((book) => (
              <div
                key={book.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4 shadow-sm hover:border-[#d97706]/25 hover:shadow-md transition-all"
              >
                <div className="w-11 h-14 rounded-lg bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-[#d97706]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-heading font-semibold text-slate-900 text-sm leading-snug">{book.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${levelColors[book.level]}`}>
                      {book.level}
                    </span>
                  </div>
                  <p className="text-xs text-[#d97706] mt-1 font-medium">by {book.author}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{book.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Online Resources ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>Online</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Online Resources</h2>
          <p className="text-slate-400 text-sm text-center mb-10">
            Trusted platforms and communities used by top olympiad performers.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {onlineResources.map(({ icon: Icon, name, url, desc, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:border-[#d97706]/25 hover:shadow-md transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-semibold text-slate-900 text-sm">{name}</p>
                    <ExternalLink size={12} className="text-slate-300 group-hover:text-[#d97706] transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* ── Study Tips ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <SectionLabel>Strategy</SectionLabel>
          <h2 className="font-heading text-3xl font-bold text-slate-900 text-center mb-2">Preparation Tips</h2>
          <p className="text-slate-400 text-sm text-center mb-10">
            Advice from UIU students who have qualified for national rounds.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {tips.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4 shadow-sm hover:border-[#d97706]/25 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#d97706]" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-screen-xl mx-auto px-6 pb-16">
          <div
            className="rounded-2xl px-8 py-10 text-white text-center relative overflow-hidden shadow-lg"
            style={{ background: "linear-gradient(135deg, #d97706, #b45309)", boxShadow: "0 8px 32px rgba(217,119,6,0.3)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <p className="font-heading font-extrabold text-2xl mb-2">Ready to start practising?</p>
              <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                Access 500+ curated problems, timed mock tests, and track your progress on the leaderboard.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href="/login"
                  className="bg-white text-[#d97706] font-semibold text-sm px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-md"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/topics"
                  className="bg-white/15 border border-white/30 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white/25 transition-all"
                >
                  Browse Topics
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
