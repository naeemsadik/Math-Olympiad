"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Users,
  Globe,
  Flag,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Scope = "Bangladesh" | "Worldwide";
type EventType =
  | "Internal Olympiad"
  | "BdMO"
  | "Workshop"
  | "Training Camp"
  | "Mock"
  | "Seminar"
  | "Competition"
  | "International"
  | "League";

interface OlympiadEvent {
  id: string;
  scope: Scope;
  type: EventType;
  typeColor: string;
  title: string;
  date: string;
  dateSort: string;
  daysLeft: number;
  location: string;
  desc: string;
  href: string;
  featured?: boolean;
  seats: string;
  level: string;
  isWorkshopOrCamp?: boolean;
}

const allEvents: OlympiadEvent[] = [
  // ── Bangladesh ──────────────────────────────────────────────
  {
    id: "uiu-prelim-2025",
    scope: "Bangladesh",
    type: "Internal Olympiad",
    typeColor: "#d97706",
    title: "UIU Math Olympiad 2025 — Preliminary Round",
    date: "June 20, 2025",
    dateSort: "2025-06-20",
    daysLeft: 12,
    location: "UIU Campus, Dhaka",
    desc: "Open preliminary round for all UIU students. Top 60 qualify for the Semi-Final. No prior registration required.",
    href: "/registration",
    seats: "Open to all",
    level: "All Tiers",
  },
  {
    id: "guest-lecture-imo",
    scope: "Bangladesh",
    type: "Seminar",
    typeColor: "#0891b2",
    title: "Guest Lecture: IMO Strategies & Mindset",
    date: "June 22, 2025",
    dateSort: "2025-06-22",
    daysLeft: 14,
    location: "Auditorium, UIU",
    desc: "BdMO Gold Medalist and APMO participant shares problem-solving strategies, mindset, and preparation tips for national and international olympiads.",
    href: "/events",
    seats: "Open to all",
    level: "All",
    isWorkshopOrCamp: true,
  },
  {
    id: "nt-workshop-2025",
    scope: "Bangladesh",
    type: "Workshop",
    typeColor: "#8b5cf6",
    title: "Number Theory Intensive Workshop",
    date: "June 28, 2025",
    dateSort: "2025-06-28",
    daysLeft: 20,
    location: "Room 412, UIU",
    desc: "Two-day deep-dive on modular arithmetic, Diophantine equations, and competition-style number theory. Hands-on problem sets included.",
    href: "/registration",
    seats: "40 seats",
    level: "Intermediate–Advanced",
    isWorkshopOrCamp: true,
  },
  {
    id: "bdmo-simulation-2025",
    scope: "Bangladesh",
    type: "Mock",
    typeColor: "#059669",
    title: "BdMO National Simulation 2025",
    date: "July 5, 2025",
    dateSort: "2025-07-05",
    daysLeft: 27,
    location: "Online + UIU Campus",
    desc: "Full 4-hour mock under real BdMO national conditions. Detailed feedback report and model solutions for every participant.",
    href: "/registration",
    seats: "Unlimited",
    level: "Advanced",
    isWorkshopOrCamp: true,
  },
  {
    id: "uiu-finals-2025",
    scope: "Bangladesh",
    type: "Internal Olympiad",
    typeColor: "#d97706",
    title: "UIU Math Olympiad 2025 — Grand Finals",
    date: "July 18, 2025",
    dateSort: "2025-07-18",
    daysLeft: 40,
    location: "UIU Campus, Dhaka",
    desc: "Annual flagship olympiad grand finale. Top 3 students receive prizes and direct BdMO national nomination. Live audience welcome.",
    href: "/registration",
    featured: true,
    seats: "60 finalists",
    level: "All Tiers",
  },
  {
    id: "pre-bdmo-camp-2025",
    scope: "Bangladesh",
    type: "Training Camp",
    typeColor: "#b45309",
    title: "Pre-BdMO Intensive Training Camp",
    date: "July 25–27, 2025",
    dateSort: "2025-07-25",
    daysLeft: 47,
    location: "UIU Campus, Dhaka",
    desc: "Three-day residential-style camp: Geometry, Combinatorics, Number Theory, Algebra. Daily mock sessions with expert mentoring.",
    href: "/registration",
    seats: "30 seats",
    level: "Advanced",
    isWorkshopOrCamp: true,
  },
  {
    id: "bdmo-regional-dhaka-2025",
    scope: "Bangladesh",
    type: "BdMO",
    typeColor: "#16a34a",
    title: "BdMO Regional — Dhaka Division 2025",
    date: "August 10, 2025",
    dateSort: "2025-08-10",
    daysLeft: 63,
    location: "BUET Campus, Dhaka",
    desc: "Official BdMO regional round for Dhaka division. UIU CMOR coordinates group registration and prep sessions for all participants.",
    href: "/registration",
    seats: "Limited",
    level: "All Tiers",
  },
  {
    id: "bangladesh-math-league-s3",
    scope: "Bangladesh",
    type: "League",
    typeColor: "#d97706",
    title: "Bangladesh Math League — Season 3",
    date: "August 25, 2025",
    dateSort: "2025-08-25",
    daysLeft: 78,
    location: "Online",
    desc: "Monthly online league with 5 rounds across the season. Individual rankings and team standings. Open to all institutions.",
    href: "/registration",
    seats: "Unlimited",
    level: "Beginner–Intermediate",
  },
  {
    id: "bdmo-divisional-chittagong",
    scope: "Bangladesh",
    type: "BdMO",
    typeColor: "#16a34a",
    title: "BdMO Divisional — Chittagong",
    date: "September 5, 2025",
    dateSort: "2025-09-05",
    daysLeft: 89,
    location: "Chittagong, Bangladesh",
    desc: "Official BdMO divisional competition for Chittagong division students. Qualifiers advance to the national round.",
    href: "/events",
    seats: "Open",
    level: "All Tiers",
  },
  {
    id: "bdmo-divisional-rajshahi",
    scope: "Bangladesh",
    type: "BdMO",
    typeColor: "#16a34a",
    title: "BdMO Divisional — Rajshahi",
    date: "September 12, 2025",
    dateSort: "2025-09-12",
    daysLeft: 96,
    location: "Rajshahi, Bangladesh",
    desc: "BdMO divisional competition for Rajshahi division. UIU CMOR provides preparation resources for all registered participants.",
    href: "/events",
    seats: "Open",
    level: "All Tiers",
  },
  {
    id: "inter-university-2025",
    scope: "Bangladesh",
    type: "Competition",
    typeColor: "#7c3aed",
    title: "Inter-University Math Challenge 2025",
    date: "October 15, 2025",
    dateSort: "2025-10-15",
    daysLeft: 129,
    location: "UIU Campus, Dhaka",
    desc: "Team challenge between UIU, BUET, SUST, IUT, and CUET. Individual + team rounds. UIU CMOR defending 2nd place title from 2023.",
    href: "/registration",
    seats: "5-member teams",
    level: "Advanced",
  },
  {
    id: "combinatorics-workshop-2025",
    scope: "Bangladesh",
    type: "Workshop",
    typeColor: "#8b5cf6",
    title: "Olympiad Combinatorics Workshop",
    date: "November 1, 2025",
    dateSort: "2025-11-01",
    daysLeft: 146,
    location: "Room 412, UIU",
    desc: "Pigeonhole principle, graph coloring, extremal combinatorics, generating functions with olympiad problem sets and guided expert sessions.",
    href: "/registration",
    seats: "35 seats",
    level: "Intermediate–Advanced",
    isWorkshopOrCamp: true,
  },
  {
    id: "bdmo-national-2026",
    scope: "Bangladesh",
    type: "BdMO",
    typeColor: "#16a34a",
    title: "BdMO National Olympiad 2026",
    date: "January 2026",
    dateSort: "2026-01-15",
    daysLeft: 221,
    location: "Dhaka, Bangladesh",
    desc: "Flagship national olympiad of Bangladesh. Top performers earn IMO team consideration and international competition nominations.",
    href: "/events",
    featured: true,
    seats: "By qualification",
    level: "Elite",
  },

  // ── Worldwide ────────────────────────────────────────────────
  {
    id: "romanian-open-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#7c3aed",
    title: "Romanian Math Olympiad — Open Online",
    date: "June 10, 2025",
    dateSort: "2025-06-10",
    daysLeft: 2,
    location: "Online",
    desc: "Online open round of Romania's national olympiad. Open worldwide. 4 problems, 4 hours. Excellent benchmark for competition math.",
    href: "/events",
    seats: "Open",
    level: "Intermediate–Advanced",
  },
  {
    id: "imo-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#dc2626",
    title: "International Mathematical Olympiad — IMO 2025",
    date: "July 10–20, 2025",
    dateSort: "2025-07-10",
    daysLeft: 32,
    location: "Melbourne, Australia",
    desc: "The world's most prestigious high-school math olympiad. 6 problems across 2 days. Participation via BdMO national team nomination only.",
    href: "/events",
    featured: true,
    seats: "BdMO nomination",
    level: "Elite",
  },
  {
    id: "pamo-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#dc2626",
    title: "Pan African Mathematics Olympiad — PAMO 2025",
    date: "August 20–30, 2025",
    dateSort: "2025-08-20",
    daysLeft: 73,
    location: "Kigali, Rwanda",
    desc: "Annual olympiad by the African Mathematical Union. Bangladesh observes annually. Excellent exposure to international competition standards.",
    href: "/events",
    seats: "By nomination",
    level: "Advanced",
  },
  {
    id: "memo-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#0284c7",
    title: "Middle European Math Olympiad — MEMO 2025",
    date: "September 2–8, 2025",
    dateSort: "2025-09-02",
    daysLeft: 86,
    location: "Vienna, Austria",
    desc: "Team and individual competition for Central European countries. Strong combinatorics and geometry focus. UIU students use it as a prep benchmark.",
    href: "/events",
    seats: "National team",
    level: "Advanced",
  },
  {
    id: "balkan-mo-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#0284c7",
    title: "Balkan Mathematical Olympiad 2025",
    date: "September 20–25, 2025",
    dateSort: "2025-09-20",
    daysLeft: 104,
    location: "Sofia, Bulgaria",
    desc: "Annual Southeast European competition — 4 problems, 4.5 hours. Considered a key stepping stone to IMO. Bangladesh follows results closely.",
    href: "/events",
    seats: "National team",
    level: "Advanced",
  },
  {
    id: "tournament-of-towns-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#7c3aed",
    title: "Tournament of Towns — Autumn 2025",
    date: "October 2025",
    dateSort: "2025-10-15",
    daysLeft: 129,
    location: "Online (International)",
    desc: "O-level and A-level papers. Open participation worldwide — anyone can register independently. UIU CMOR recommends this for all advanced students.",
    href: "/events",
    seats: "Open",
    level: "Intermediate–Advanced",
  },
  {
    id: "baltic-way-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#0284c7",
    title: "Baltic Way 2025",
    date: "November 8–10, 2025",
    dateSort: "2025-11-08",
    daysLeft: 153,
    location: "Tallinn, Estonia",
    desc: "Team competition for Baltic states (+ observers). 20 problems solved collaboratively by 5-member teams. Observer participation available.",
    href: "/events",
    seats: "5-member team",
    level: "Advanced",
  },
  {
    id: "putnam-2025",
    scope: "Worldwide",
    type: "International",
    typeColor: "#dc2626",
    title: "Putnam Competition 2025",
    date: "December 6, 2025",
    dateSort: "2025-12-06",
    daysLeft: 181,
    location: "North America (registered centers)",
    desc: "Most prestigious undergraduate math competition in North America. 12 problems, 6 hours. UIU students may register through approved centers.",
    href: "/registration",
    seats: "Registered centers",
    level: "Advanced",
  },
  {
    id: "apmo-2026",
    scope: "Worldwide",
    type: "International",
    typeColor: "#dc2626",
    title: "Asian Pacific Mathematics Olympiad — APMO 2026",
    date: "March 2026",
    dateSort: "2026-03-10",
    daysLeft: 275,
    location: "Hosted in Bangladesh (BD round)",
    desc: "Bangladesh officially participates in APMO annually. Top BdMO performers earn selection. UIU CMOR runs dedicated APMO prep track.",
    href: "/events",
    seats: "BdMO nomination",
    level: "Elite",
  },
  {
    id: "egmo-2026",
    scope: "Worldwide",
    type: "International",
    typeColor: "#db2777",
    title: "European Girls' Math Olympiad — EGMO 2026",
    date: "April 2026",
    dateSort: "2026-04-10",
    daysLeft: 306,
    location: "TBC, Europe",
    desc: "Annual international olympiad for female students. Bangladesh sends a 4-member team. Outstanding opportunity for women in mathematics.",
    href: "/events",
    seats: "By nomination",
    level: "Advanced",
  },
  {
    id: "usamo-observer-2026",
    scope: "Worldwide",
    type: "International",
    typeColor: "#0284c7",
    title: "USAMO 2026 — UIU Observer Round",
    date: "April 2026",
    dateSort: "2026-04-22",
    daysLeft: 318,
    location: "UIU Campus (Observer)",
    desc: "UIU CMOR runs a parallel observer round during USAMO weekend for elite students. 5 problems, 6 hours. Certificates for top performers.",
    href: "/registration",
    seats: "20 seats",
    level: "Elite",
  },
];

type FilterTab = "All" | "Bangladesh" | "Worldwide" | "Workshops & Camps";

const filterTabs: FilterTab[] = ["All", "Bangladesh", "Worldwide", "Workshops & Camps"];

const scopeFlag: Record<Scope, string> = {
  Bangladesh: "🇧🇩",
  Worldwide: "🌍",
};

export default function OlympiadsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = allEvents;

    if (activeTab === "Bangladesh") list = list.filter((e) => e.scope === "Bangladesh");
    else if (activeTab === "Worldwide") list = list.filter((e) => e.scope === "Worldwide");
    else if (activeTab === "Workshops & Camps") list = list.filter((e) => e.isWorkshopOrCamp);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.desc.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [activeTab, query]);

  const bdCount = allEvents.filter((e) => e.scope === "Bangladesh").length;
  const worldCount = allEvents.filter((e) => e.scope === "Worldwide").length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/8 rounded-full blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-xs text-white font-semibold uppercase tracking-widest mb-6"
          >
            <Zap size={11} className="text-yellow-200" />
            Live &amp; Upcoming Worldwide
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading font-extrabold text-5xl md:text-6xl text-white leading-tight"
          >
            Olympiads &amp; <span className="text-yellow-200">Events</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-5 text-white/70 text-base max-w-xl mx-auto leading-relaxed"
          >
            From UIU internal rounds to IMO — every competition, workshop, and training camp in one place.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-8 justify-center text-sm text-white/80"
          >
            {[
              { icon: CalendarDays, text: `${allEvents.length} Events Listed` },
              { icon: Flag, text: `${bdCount} Bangladesh Events` },
              { icon: Globe, text: `${worldCount} International Events` },
              { icon: Users, text: "500+ Registered Students" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2">
                <Icon size={14} className="text-yellow-200" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter + Search bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-100 shadow-sm shadow-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Category tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
                style={
                  activeTab === tab
                    ? { background: "#d97706", color: "#fff", boxShadow: "0 2px 8px rgba(217,119,6,0.3)" }
                    : { background: "transparent", color: "#64748b", border: "1px solid rgba(15,23,42,0.1)" }
                }
              >
                {tab === "Bangladesh" && "🇧🇩 "}
                {tab === "Worldwide" && "🌍 "}
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="sm:ml-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-64">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* Count pill */}
          <span className="shrink-0 text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-3 py-1">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Events grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-slate-400"
            >
              <SlidersHorizontal size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No events match your filter.</p>
              <p className="text-sm mt-1">Try a different category or clear the search.</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab + query}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                  className="group relative bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1"
                  style={{
                    borderColor: ev.featured ? `${ev.typeColor}40` : "rgba(241,245,249,1)",
                    boxShadow: ev.featured
                      ? `0 4px 24px ${ev.typeColor}18, 0 0 0 1px ${ev.typeColor}25`
                      : "0 2px 8px rgba(15,23,42,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    if (!ev.featured) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${ev.typeColor}35`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(15,23,42,0.08), 0 0 0 1px ${ev.typeColor}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!ev.featured) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(241,245,249,1)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.05)";
                    }
                  }}
                >
                  {/* Color bar */}
                  <div
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, ${ev.typeColor}, ${ev.typeColor}60)` }}
                  />

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {/* Badges row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                          style={{ backgroundColor: `${ev.typeColor}12`, color: ev.typeColor }}
                        >
                          {ev.type}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {scopeFlag[ev.scope]}
                        </span>
                        {ev.featured && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">
                            <Star size={8} /> Featured
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 shrink-0">
                        <Clock size={11} />
                        {ev.daysLeft}d left
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 text-base leading-snug group-hover:text-[#d97706] transition-colors">
                      {ev.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed flex-1">{ev.desc}</p>

                    {/* Meta */}
                    <div className="flex flex-col gap-1 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={11} /> {ev.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} /> {ev.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={11} /> {ev.seats}
                      </span>
                    </div>

                    {/* Level tag */}
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Level: {ev.level}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div
                    className="px-5 py-3 border-t flex items-center justify-between"
                    style={{
                      borderColor: `${ev.typeColor}15`,
                      backgroundColor: `${ev.typeColor}06`,
                    }}
                  >
                    <Link
                      href={ev.href}
                      className="text-xs font-semibold flex items-center gap-1 group/btn"
                      style={{ color: ev.typeColor }}
                    >
                      {ev.scope === "Worldwide" ? "Learn More" : "Register Now"}
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                    <span className="text-[10px] text-slate-300 font-medium">{ev.scope}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
