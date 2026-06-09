"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Layered background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary amber bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[900px] h-[600px] rounded-full bg-[#d97706]/8 blur-[140px]" />
        {/* Amber bloom bottom-right */}
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-[#f59e0b]/6 blur-[100px]" />
        {/* Warm accent top-right */}
        <div className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-[#fcd34d]/[0.07] blur-[80px]" />
        {/* Math grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(217,119,6,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,6,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Floating math symbols */}
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

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full flex flex-col items-center text-center">
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
          <span className="gradient-text-orange text-xl sm:text-2xl md:text-4xl tracking-wide">MATH OLYMPIAD AND RESEARCH</span>
        </motion.h1>

        {/* Motto */}
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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 sm:mt-20 grid grid-cols-3 sm:flex sm:flex-wrap gap-0 justify-center w-full sm:w-auto"
        >
          {[
            { value: "4,281", label: "Active Students" },
            { value: "87%", label: "Avg. Completion Rate" },
            { value: "500+", label: "Practice Problems" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center px-4 sm:px-10 py-4 ${i < 2 ? "border-r border-slate-200/80" : ""}`}
            >
              <p className="text-2xl sm:text-3xl font-heading font-extrabold gradient-text-orange">{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 font-medium leading-tight">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
