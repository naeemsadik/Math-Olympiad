"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, BookOpen, Users, Trophy, GraduationCap, Images } from "lucide-react";
import { useState } from "react";

const initiatives = [
  {
    icon: FlaskConical,
    title: "Practice Platform",
    desc: "500+ curated problems with timed mock tests, difficulty tiers, and topic filters. Track your growth with detailed analytics.",
    href: "/tests",
    cta: "Try Practice Tests",
    color: "#d97706",
  },
  {
    icon: GraduationCap,
    title: "Training Program",
    desc: "Structured multi-level training curriculum from beginner foundations to advanced olympiad techniques.",
    href: "/training",
    cta: "View Program",
    color: "#f59e0b",
  },
  {
    icon: BookOpen,
    title: "Resources & Prep",
    desc: "Syllabus guides, previous question papers, recommended books, video lectures, and preparation guidelines.",
    href: "/resources",
    cta: "Browse Resources",
    color: "#b45309",
  },
  {
    icon: Trophy,
    title: "Hall of Fame",
    desc: "Celebrating UIU students who have excelled at national and international mathematical olympiads.",
    href: "/hall-of-fame",
    cta: "See Achievers",
    color: "#d97706",
  },
  {
    icon: Users,
    title: "Registration",
    desc: "Register for upcoming olympiads, training camps, workshops, and inter-university challenges.",
    href: "/registration",
    cta: "Register Now",
    color: "#f59e0b",
  },
  {
    icon: Images,
    title: "Gallery",
    desc: "Photos and highlights from our competitions, award ceremonies, camps, and community events.",
    href: "/gallery",
    cta: "View Gallery",
    color: "#b45309",
  },
];

export default function KeyInitiativesSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="bg-[#fef9f0] border-y border-[#d97706]/10 py-12 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-xs text-[#92400e] font-semibold uppercase tracking-widest mb-4 sm:mb-5">
            Explore UIU CMOR
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">
            Our Key <span className="gradient-text-orange">Initiatives</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            Everything UIU CMOR offers — from practice and training to celebration and community.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {initiatives.map(({ icon: Icon, title, desc, href, cta, color }) => {
            const isHovered = hovered === title;
            return (
              <Link
                key={title}
                href={href}
                className="group relative bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-250"
                style={{
                  border: isHovered ? `1px solid ${color}35` : "1px solid rgba(241,245,249,1)",
                  boxShadow: isHovered ? `0 8px 28px rgba(15,23,42,0.08), 0 0 0 1px ${color}25` : "0 1px 3px rgba(15,23,42,0.05)",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                }}
                onMouseEnter={() => setHovered(title)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    opacity: isHovered ? 1 : 0,
                  }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-slate-900 text-base">{title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
                </div>
                <span
                  className="flex items-center gap-1.5 text-sm font-semibold mt-auto"
                  style={{ color }}
                >
                  {cta}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
