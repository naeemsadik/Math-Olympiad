"use client";

import Link from "next/link";
import { UserPlus, BookOpenCheck, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Register & Join",
    desc: "Create your free account, complete your profile, and get instantly matched to the right difficulty tier — Beginner, Intermediate, or Advanced.",
    color: "#d97706",
    cta: "Create Account",
    href: "/registration",
  },
  {
    step: "02",
    icon: BookOpenCheck,
    title: "Train & Practice",
    desc: "Work through 500+ curated problems, join live workshops, attempt mock exams, and follow a structured curriculum built by BdMO champions.",
    color: "#f59e0b",
    cta: "Browse Topics",
    href: "/topics",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Compete & Excel",
    desc: "Enter UIU internal olympiads, get nominated for BdMO regionals, climb the leaderboard, and earn your place in the Hall of Fame.",
    color: "#b45309",
    cta: "See Events",
    href: "/events",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-12 sm:py-20 bg-[#fef9f0] border-t border-[#d97706]/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-xs text-[#92400e] font-semibold uppercase tracking-widest mb-4 sm:mb-5">
            Your Path to Excellence
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">
            How It <span className="gradient-text-orange">Works</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            From day one to the olympiad podium — a clear roadmap built for every level of student.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-linear-to-r from-[#d97706]/30 via-[#f59e0b]/50 to-[#b45309]/30" />

          {steps.map(({ step, icon: Icon, title, desc, color, cta, href }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative bg-white rounded-2xl p-7 flex flex-col gap-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              style={{ "--accent": color } as React.CSSProperties}
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <span
                  className="font-heading font-black text-3xl tabular-nums"
                  style={{ color: `${color}20` }}
                >
                  {step}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-slate-900 text-xl mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>

              <Link
                href={href}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold group/link"
                style={{ color }}
              >
                {cta}
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
