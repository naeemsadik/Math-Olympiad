"use client";

import { useState, useRef } from "react";
import {
  Search, ShieldCheck, ShieldX, Award, Calendar, User,
  Building2, Hash, AlertCircle, BadgeCheck, RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockCertificates } from "@/lib/mock/certificates";
import type { Certificate } from "@/lib/mock/certificates";

const EVENT_TYPE_COLORS: Record<string, string> = {
  Competition: "#d97706",
  Training: "#b45309",
  Workshop: "#8b5cf6",
  Seminar: "#0891b2",
  "Mock Exam": "#059669",
};

function CertificateCard({ cert }: { cert: Certificate }) {
  const isValid = cert.status === "valid";
  const typeColor = EVENT_TYPE_COLORS[cert.eventType] ?? "#d97706";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative bg-white rounded-2xl overflow-hidden border"
      style={{
        borderColor: isValid ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
        boxShadow: isValid
          ? "0 8px 32px rgba(16,185,129,0.08), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 8px 32px rgba(239,68,68,0.08), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top accent stripe */}
      <div
        className="h-1.5 w-full"
        style={{
          background: isValid
            ? "linear-gradient(90deg, #10b981, #34d399)"
            : "linear-gradient(90deg, #ef4444, #f87171)",
        }}
      />

      {/* Certificate body */}
      <div className="px-8 py-7">
        {/* Issuer header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#d97706]/40 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="UIU CMOR" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                UIU Centre For
              </p>
              <p className="text-[9px] font-bold text-[#d97706] uppercase tracking-widest leading-tight">
                Math Olympiad and Research
              </p>
            </div>
          </div>

          {/* Verified / Revoked stamp */}
          <div
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-bold uppercase tracking-wider"
            style={
              isValid
                ? { color: "#10b981", borderColor: "#10b981", background: "rgba(16,185,129,0.06)" }
                : { color: "#ef4444", borderColor: "#ef4444", background: "rgba(239,68,68,0.06)" }
            }
          >
            {isValid ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
            {isValid ? "Verified" : "Revoked"}
          </div>
        </div>

        {/* Certificate title */}
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.25em] mb-1">
          Certificate of Achievement
        </p>
        <p className="text-center text-xs text-slate-400 mb-6">This is to certify that</p>

        {/* Student name — hero */}
        <div className="text-center mb-5">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {cert.studentName}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Hash size={11} className="text-slate-400" /> {cert.studentId}
            </span>
            <span className="text-slate-300">·</span>
            <span>{cert.dept}, {cert.institute}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-100" />
          <Award size={14} className="text-[#d97706] shrink-0" />
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Achievement */}
        <div className="text-center mb-5">
          <p className="text-xs text-slate-500 mb-2">has been awarded for</p>
          <p className="font-heading font-bold text-xl text-slate-900 leading-snug">
            {cert.achievement}
          </p>
          <span
            className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
            style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
          >
            {cert.eventType}
          </span>
        </div>

        {/* Description */}
        <p className="text-center text-xs text-slate-500 leading-relaxed italic mb-6 px-4">
          "{cert.description}"
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Calendar,   label: "Issue Date",  value: cert.issuedAt },
            { icon: Building2,  label: "Issued By",   value: "UIU CMOR" },
            { icon: User,       label: "Tier",        value: cert.tier },
            { icon: BadgeCheck, label: "Event",       value: cert.event.slice(0, 24) + (cert.event.length > 24 ? "…" : "") },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
              <Icon size={11} className="text-slate-400 mx-auto mb-1" />
              <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-xs font-semibold text-slate-700 leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-end justify-between pt-4 border-t border-slate-100">
          <div>
            <div className="w-20 h-px bg-slate-400 mb-1" />
            <p className="text-xs font-semibold text-slate-700">{cert.signatoryName}</p>
            <p className="text-[10px] text-slate-400">{cert.signatoryTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Certificate ID</p>
            <p
              className="font-mono text-xs font-bold"
              style={{ color: isValid ? "#10b981" : "#ef4444" }}
            >
              {cert.id}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifyPage() {
  const [searchType, setSearchType] = useState<"id" | "regNo">("id");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Certificate[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = mockCertificates.filter((c) =>
      searchType === "id"
        ? c.id.toLowerCase() === q
        : c.studentId.toLowerCase().includes(q)
    );
    setResults(found);
    setSearched(true);
  };

  const handleReset = () => {
    setQuery("");
    setSearched(false);
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base, #f5f4f1)" }}>
      {/* Hero */}
      <section className="pt-14 pb-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-xs text-[#92400e] font-semibold uppercase tracking-widest mb-5">
          <ShieldCheck size={12} /> Public Verification Portal
        </div>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight mb-4">
          Certificate{" "}
          <span className="gradient-text-orange">Verification</span>
        </h1>
        <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
          Verify the authenticity of any UIU CMOR certificate instantly. Enter the certificate ID or student registration number below.
        </p>
      </section>

      {/* Search card */}
      <section className="max-w-2xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => { setSearchType("id"); setSearched(false); setQuery(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                searchType === "id"
                  ? "text-[#d97706] border-b-2 border-[#d97706] bg-[#d97706]/4"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              By Certificate ID
            </button>
            <button
              onClick={() => { setSearchType("regNo"); setSearched(false); setQuery(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                searchType === "regNo"
                  ? "text-[#d97706] border-b-2 border-[#d97706] bg-[#d97706]/4"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              By Registration Number
            </button>
          </div>

          {/* Search input */}
          <div className="p-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={
                    searchType === "id"
                      ? "e.g.  UIU-CMOR-2025-001"
                      : "e.g.  011241001"
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/60 focus:ring-2 focus:ring-[#d97706]/10 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold gradient-orange text-white shadow-md shadow-[#d97706]/20 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                <Search size={14} /> Verify
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 text-center">
              {searchType === "id"
                ? "Certificate IDs follow the format: UIU-CMOR-YYYY-NNN"
                : "Enter the full 9-digit UIU student registration number"}
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              key={query + searchType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {results.length === 0 ? (
                /* Not found */
                <div className="bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={24} className="text-red-400" />
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">
                    No Certificate Found
                  </h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5">
                    No certificate matched your search. Please double-check the{" "}
                    {searchType === "id" ? "certificate ID" : "registration number"} and try again.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#d97706] hover:text-[#b45309] transition-colors"
                  >
                    <RotateCcw size={13} /> Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                      {results.length} certificate{results.length > 1 ? "s" : ""} found
                    </p>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <RotateCcw size={12} /> New search
                    </button>
                  </div>
                  {results.map((cert) => (
                    <CertificateCard key={cert.id} cert={cert} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works (shown before any search) */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-3 gap-4 mt-2"
          >
            {[
              {
                icon: Hash,
                title: "Enter ID or Reg. No.",
                desc: "Use the certificate ID printed on the document, or the student's UIU registration number.",
                color: "#d97706",
              },
              {
                icon: Search,
                title: "Instant Lookup",
                desc: "Our system checks the certificate database and returns the result in real-time.",
                color: "#8b5cf6",
              },
              {
                icon: ShieldCheck,
                title: "Confirmed Status",
                desc: "See whether the certificate is Verified (valid) or Revoked, with full details.",
                color: "#10b981",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
