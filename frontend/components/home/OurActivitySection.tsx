"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Wrench, FileText, Dumbbell, Mic2, BrainCircuit } from "lucide-react";
import { useState } from "react";

const activities = [
  {
    icon: Trophy,
    title: "Competitions",
    desc: "Internal olympiads and inter-university challenges that test problem-solving skills under pressure.",
    color: "#d97706",
  },
  {
    icon: Wrench,
    title: "Workshops",
    desc: "Hands-on sessions on specific mathematical techniques, from proof writing to advanced algebra strategies.",
    color: "#f59e0b",
  },
  {
    icon: FileText,
    title: "Mock Olympiads",
    desc: "Full-length timed simulations of BdMO regional and national rounds with real exam conditions.",
    color: "#b45309",
  },
  {
    icon: Dumbbell,
    title: "Training Sessions",
    desc: "Structured weekly practice covering Number Theory, Combinatorics, Geometry, and Algebra.",
    color: "#d97706",
  },
  {
    icon: Mic2,
    title: "Seminars",
    desc: "Guest lectures from BdMO alumni, IMO participants, and faculty mathematicians sharing insights.",
    color: "#f59e0b",
  },
  {
    icon: BrainCircuit,
    title: "Problem-Solving Camps",
    desc: "Intensive multi-day camps before major olympiad cycles with focused problem exposure.",
    color: "#b45309",
  },
];

export default function OurActivitySection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-20">
      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-xs text-[#92400e] font-semibold uppercase tracking-widest mb-5">
          What We Do
        </div>
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-slate-900 leading-tight">
          Our <span className="gradient-text-orange">Activities</span>
        </h2>
        <p className="mt-4 text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
          A full calendar of programmes designed to build mathematical excellence on campus and beyond.
        </p>
      </div>

      {/* Activity cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activities.map(({ icon: Icon, title, desc, color }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 flex flex-col gap-4 transition-all duration-250 cursor-default"
            style={{
              border: hovered === title ? `1px solid ${color}40` : "1px solid rgba(15,23,42,0.07)",
              boxShadow: hovered === title
                ? `0 8px 28px rgba(15,23,42,0.08), 0 0 0 1px ${color}30`
                : "0 2px 8px rgba(15,23,42,0.05)",
              transform: hovered === title ? "translateY(-3px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(title)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">{title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 gradient-orange glow-orange text-white font-semibold px-7 py-3 rounded-full hover:scale-105 transition-all text-sm"
        >
          View Full Activity Calendar <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
