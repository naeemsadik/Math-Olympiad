"use client";

import Link from "next/link";
import { FlaskConical, BookOpen, Trophy, ArrowRight } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Mock Test Arena",
    description:
      "Compete in timed environments that simulate the actual BdMO conditions. Get real-time feedback and ranking.",
    href: "/tests",
    cta: "Explore Tests",
    color: "#d97706",
    gradient: "from-[#d97706]/10 to-[#d97706]/[0.03]",
    border: "rgba(217,119,6,0.22)",
  },
  {
    icon: Trophy,
    title: "BdMO Info",
    description:
      "Stay updated with registration dates, rules, and regional event schedules for all major olympiads.",
    href: "/events",
    cta: "Learn More",
    color: "#f59e0b",
    gradient: "from-[#f59e0b]/10 to-[#f59e0b]/[0.03]",
    border: "rgba(245,158,11,0.22)",
  },
  {
    icon: BookOpen,
    title: "Syllabus",
    description:
      "From Number Theory to Combinatorics. Comprehensive curriculum guides for all levels.",
    href: "/topics",
    cta: "Curriculum",
    color: "#b45309",
    gradient: "from-[#b45309]/10 to-[#b45309]/[0.03]",
    border: "rgba(180,83,9,0.22)",
  },
];

export default function FeatureCards() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description, href, cta, color, gradient, border }) => (
          <Link
            key={title}
            href={href}
            className="group relative bg-white rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
            style={{
              border: `1px solid rgba(15,23,42,0.07)`,
              boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0px 0px 1px rgba(15,23,42,0.03)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = border;
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 28px rgba(15,23,42,0.09), 0 0 0 1px ${border}, 0 2px 4px rgba(15,23,42,0.04)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(15,23,42,0.07)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.05), 0 0px 0px 1px rgba(15,23,42,0.03)";
            }}
          >
            {/* Gradient top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            />
            {/* Subtle gradient wash */}
            <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${gradient} pointer-events-none rounded-t-2xl`} />

            <div className="relative">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}14`, border: `1px solid ${color}25` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
            </div>
            <div className="relative">
              <h3 className="font-heading font-bold text-slate-900 text-lg">{title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
            </div>
            <span className="relative flex items-center gap-1.5 text-sm font-semibold mt-auto" style={{ color }}>
              {cta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
