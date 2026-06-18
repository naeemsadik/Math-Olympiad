"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Flame, ChevronRight, X } from "lucide-react";
import { useState } from "react";

// ─── Floating Puzzle Teaser ──────────────────────────────────────────────────
function FloatingPuzzleTeaser() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ delay: 1.6, duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-6 right-4 sm:right-8 z-20 w-72 sm:w-80"
        >
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1.5px solid rgba(217,119,6,0.2)",
              boxShadow: "0 12px 40px rgba(217,119,6,0.12), 0 4px 12px rgba(0,0,0,0.07)",
            }}
          >
            <div className="h-1 bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#fcd34d]" />
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [-3, 3, -3] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-xl gradient-orange flex items-center justify-center shrink-0"
                    style={{ boxShadow: "0 4px 10px rgba(217,119,6,0.3)" }}
                  >
                    <Flame size={15} className="text-white" />
                  </motion.div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Puzzle of the Day
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      Number Theory · <span style={{ color: "#d97706" }}>Medium</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 mt-0.5"
                  aria-label="Dismiss"
                >
                  <X size={11} />
                </button>
              </div>

              {/* Difficulty dots */}
              <div className="flex items-center gap-1 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: i < 3 ? "#d97706" : "#e2e8f0" }}
                  />
                ))}
                <span className="text-[10px] text-slate-400 ml-1">3/5 difficulty</span>
              </div>

              {/* Question preview */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                Find all positive integers n such that n² + 14n + 1 is a perfect square…
              </p>

              {/* CTA */}
              <Link
                href="/student/daily-puzzle"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold gradient-orange text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ boxShadow: "0 4px 12px rgba(217,119,6,0.25)" }}
              >
                Solve Today&apos;s Puzzle <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-225 h-150 rounded-full bg-[#d97706]/8 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-125 h-125 rounded-full bg-[#f59e0b]/6 blur-[100px]" />
        <div className="absolute top-10 right-10 w-75 h-75 rounded-full bg-[#fcd34d]/[0.07] blur-[80px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(217,119,6,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,6,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {["∫", "∑", "π", "√", "∞", "θ", "Δ", "∂"].map((sym, i) => (
          <span
            key={i}
            className="absolute font-heading font-bold select-none"
            style={{
              fontSize: `${[72, 56, 80, 60, 90, 50, 65, 70][i]}px`,
              left: `${(i * 13 + 5) % 95}%`,
              top: `${(i * 17 + 10) % 90}%`,
              color: `rgba(217,119,6,${[0.06, 0.05, 0.07, 0.05, 0.06, 0.05, 0.06, 0.05][i]})`,
            }}
          >
            {sym}
          </span>
        ))}
      </div>

      {/* Content — centered */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-[#d97706]/10 border border-[#d97706]/30 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm text-[#92400e] mb-6 sm:mb-8 font-heading font-bold tracking-wide shadow-sm shadow-amber-200/60"
          >
            ✦ Think Deep. Solve Smart ✦
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold leading-tight max-w-5xl"
          >
            <span className="gradient-text-orange text-4xl sm:text-5xl md:text-7xl">UIU</span>
            <span className="text-slate-700 text-4xl sm:text-5xl md:text-7xl"> CENTRE FOR</span>
            <br />
            <span className="gradient-text-orange text-xl sm:text-2xl md:text-4xl tracking-wide">
              MATH OLYMPIAD AND RESEARCH
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed px-2"
          >
            Elevating the standard of Mathematical Excellence at United International University
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto"
          >
            <Link
              href="/resources"
              className="flex items-center justify-center gap-2 gradient-orange glow-orange text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all hover:scale-105 active:scale-95 text-sm"
            >
              <BookOpen size={17} />
              Resources &amp; Preparation
            </Link>
            <Link
              href="/activities"
              className="flex items-center justify-center gap-2 bg-white text-slate-700 hover:text-[#d97706] font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all text-sm"
              style={{ boxShadow: "0 2px 12px rgba(15,23,42,0.1), 0 0 0 1px rgba(15,23,42,0.07)" }}
            >
              Our Activities
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 sm:mt-20 grid grid-cols-3 sm:flex sm:flex-wrap gap-0 justify-center w-full sm:w-auto"
          >
            {[
              { value: "4,281", label: "Active Students" },
              { value: "87%",   label: "Avg. Completion Rate" },
              { value: "500+",  label: "Practice Problems" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center px-4 sm:px-10 py-4 ${i < 2 ? "border-r border-slate-200/80" : ""}`}
              >
                <p className="text-2xl sm:text-3xl font-heading font-extrabold gradient-text-orange">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 font-medium leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating puzzle teaser */}
      <FloatingPuzzleTeaser />
    </section>
  );
}
