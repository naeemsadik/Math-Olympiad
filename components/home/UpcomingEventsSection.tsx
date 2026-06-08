"use client";

import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";

const recentEvents = [
  {
    type: "Internal Olympiad",
    typeColor: "#d97706",
    title: "UIU Internal Math Olympiad 2024 — Finals",
    date: "June 15, 2024",
    location: "UIU Campus, Dhaka",
    desc: "Grand finale of the annual UIU Math Olympiad. Top 3 students nominated for BdMO national round.",
    href: "/events",
    participants: "186 students",
  },
  {
    type: "Training Camp",
    typeColor: "#b45309",
    title: "BdMO Pre-Regional Intensive Camp",
    date: "January 12–16, 2024",
    location: "UIU Campus",
    desc: "Five-day residential camp covering Number Theory, Geometry, and Algebra for BdMO regional preparation.",
    href: "/events",
    participants: "32 students",
  },
  {
    type: "Workshop",
    typeColor: "#8b5cf6",
    title: "Olympiad Geometry Workshop",
    date: "October 20, 2023",
    location: "Room 412, UIU",
    desc: "Hands-on session on synthetic geometry, angle chasing, and circle theorems with practice problems.",
    href: "/events",
    participants: "55 students",
  },
  {
    type: "Seminar",
    typeColor: "#0891b2",
    title: "Guest Lecture: Advanced NT by Dr. Rahman",
    date: "September 8, 2023",
    location: "Auditorium, UIU",
    desc: "Expert seminar on advanced Number Theory techniques and olympiad strategy by BdMO alumnus Dr. Aminur Rahman.",
    href: "/events",
    participants: "120+ attendees",
  },
  {
    type: "Mock BdMO",
    typeColor: "#059669",
    title: "BdMO National Simulation 2023",
    date: "November 3, 2023",
    location: "Online + Campus",
    desc: "Full 4-hour mock exam simulating BdMO national conditions. Detailed feedback provided to all participants.",
    href: "/events",
    participants: "74 students",
  },
  {
    type: "Competition",
    typeColor: "#d97706",
    title: "Inter-University Math Challenge 2023",
    date: "March 18, 2023",
    location: "BUET Campus, Dhaka",
    desc: "UIU vs BUET vs IUT team challenge. UIU CMOR team secured 2nd place in the combined team round.",
    href: "/events",
    participants: "UIU, BUET, IUT",
  },
];

export default function RecentEventsSection() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-xs text-[#92400e] font-semibold uppercase tracking-widest mb-4">
              Highlights
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-slate-900 leading-tight">
              Recent <span className="gradient-text-orange">Events</span>
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-md leading-relaxed">
              A look at our competitions, camps, workshops, and seminars from the past year.
            </p>
          </div>
          <Link
            href="/events"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-[#d97706] hover:text-[#b45309] transition-colors group"
          >
            View All Events
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards — 3 col grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentEvents.map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group bg-white rounded-2xl border overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200"
              style={{
                borderColor: "rgba(241,245,249,1)",
                boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${ev.typeColor}30`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(15,23,42,0.08), 0 0 0 1px ${ev.typeColor}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(241,245,249,1)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.05)";
              }}
            >
              {/* Color bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ev.typeColor}, ${ev.typeColor}55)` }} />

              <div className="p-5 flex flex-col gap-3 flex-1">
                <span
                  className="self-start text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: `${ev.typeColor}12`, color: ev.typeColor }}
                >
                  {ev.type}
                </span>

                <h3 className="font-heading font-bold text-slate-900 text-base leading-snug group-hover:text-[#d97706] transition-colors">
                  {ev.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed flex-1">{ev.desc}</p>

                <div className="flex flex-col gap-1 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={11} /> {ev.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} /> {ev.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={11} /> {ev.participants}
                  </span>
                </div>
              </div>

              <div
                className="px-5 py-3 border-t flex items-center justify-between"
                style={{ borderColor: `${ev.typeColor}15`, backgroundColor: `${ev.typeColor}05` }}
              >
                <Link
                  href={ev.href}
                  className="text-xs font-semibold flex items-center gap-1 group/btn"
                  style={{ color: ev.typeColor }}
                >
                  View Details
                  <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
