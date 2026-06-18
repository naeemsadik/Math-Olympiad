import { Trophy, Star, Medal, Crown, GraduationCap } from "lucide-react";

const hallOfFame = [
  {
    name: "Tasnim Alam",
    year: 2024,
    achievement: "BdMO National Gold Medalist",
    department: "CSE",
    details: "Ranked 2nd nationally in BdMO 2024. Represented Bangladesh in the Asian Pacific Mathematics Olympiad.",
    tier: "gold",
  },
  {
    name: "Rafid Hossain",
    year: 2024,
    achievement: "BdMO National Silver Medalist",
    department: "EEE",
    details: "Qualified for national round two consecutive years. Specializes in Number Theory and Combinatorics.",
    tier: "silver",
  },
  {
    name: "Nusrat Jahan",
    year: 2023,
    achievement: "BdMO National Bronze Medalist",
    department: "CSE",
    details: "First female student from UIU to reach the BdMO national finals. Pioneer of UIU CMOR's mentorship programme.",
    tier: "bronze",
  },
  {
    name: "Ariful Islam",
    year: 2023,
    achievement: "BdMO Regional Champion — Dhaka",
    department: "Math",
    details: "Perfect score in the regional round. Led UIU's problem-solving camp and trained 30+ juniors.",
    tier: "gold",
  },
  {
    name: "Mehreen Karim",
    year: 2022,
    achievement: "BdMO National Silver Medalist",
    department: "CSE",
    details: "Three-time national qualifier. Authored UIU CMOR's first community-written problem set.",
    tier: "silver",
  },
  {
    name: "Shahriar Kabir",
    year: 2022,
    achievement: "BdMO Regional Gold — Dhaka",
    department: "EEE",
    details: "Qualified for the national round in both junior and secondary categories consecutively.",
    tier: "gold",
  },
];

const stats = [
  { value: "6", label: "National Medalists", icon: Medal },
  { value: "14", label: "Regional Champions", icon: Trophy },
  { value: "38", label: "National Qualifiers", icon: GraduationCap },
  { value: "3", label: "APMO Participants", icon: Crown },
];

const tierConfig = {
  gold: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-300",
    icon: "text-amber-500",
    label: "Gold",
    ring: "ring-amber-200",
    avatar: "from-amber-400 to-amber-600",
  },
  silver: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-600 border-slate-300",
    icon: "text-slate-400",
    label: "Silver",
    ring: "ring-slate-200",
    avatar: "from-slate-400 to-slate-500",
  },
  bronze: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    icon: "text-orange-400",
    label: "Bronze",
    ring: "ring-orange-200",
    avatar: "from-orange-400 to-orange-500",
  },
};

export default function HallOfFamePage() {
  return (
    <div className="space-y-0">

        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#d97706]/8 blur-[120px]" />
          </div>
          <div className="relative max-w-screen-xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/25 rounded-full px-4 py-1.5 text-sm text-[#92400e] mb-7">
              <Crown size={13} />
              Celebrating Excellence
            </div>
            <h1 className="font-heading font-extrabold text-5xl md:text-[3.5rem] text-slate-900 leading-[1.1] tracking-tight">
              Hall of <span className="gradient-text-orange">Fame</span>
            </h1>
            <p className="mt-5 text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Honoring UIU students who have represented the university with distinction at the Bangladesh Mathematical Olympiad and beyond.
            </p>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* Stats */}
        <section className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="rounded-2xl py-7 px-5 text-center bg-white border border-slate-200 shadow-sm hover:border-[#d97706]/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={17} className="text-[#d97706]" />
                </div>
                <p className="font-heading text-3xl font-extrabold gradient-text-orange">{value}</p>
                <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#d97706]/20 to-transparent" />
        </div>

        {/* Achievers */}
        <section className="max-w-screen-xl mx-auto px-6 py-14">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-slate-900">Our Achievers</h2>
            <p className="text-slate-400 text-sm mt-2">Students who made UIU proud at national and international olympiads.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {hallOfFame.map((person) => {
              const cfg = tierConfig[person.tier as keyof typeof tierConfig];
              return (
                <div
                  key={person.name}
                  className={`rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all ${cfg.bg} ${cfg.border}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cfg.avatar} flex items-center justify-center text-white font-heading font-bold text-lg ring-2 ${cfg.ring} shrink-0`}>
                      {person.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-heading font-bold text-slate-900 text-base">{person.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{person.department} · {person.year}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${cfg.badge}`}>
                          <Star size={10} className={cfg.icon} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#d97706] mt-2">{person.achievement}</p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{person.details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-screen-xl mx-auto px-6 pb-16">
          <div className="rounded-2xl px-8 py-10 bg-white border border-slate-200 text-center shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[#d97706]/2 blur-3xl" />
            </div>
            <div className="relative">
              <p className="font-heading font-extrabold text-2xl text-slate-900 mb-2">Your name could be here</p>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                Join UIU CMOR's training programme and take your shot at the Bangladesh Mathematical Olympiad.
              </p>
              <a
                href="/registration"
                className="inline-flex items-center gap-2 gradient-orange glow-orange text-white font-semibold text-sm px-7 py-3 rounded-full hover:scale-105 transition-all"
              >
                <Trophy size={15} />
                Register for Training
              </a>
            </div>
          </div>
        </section>

    </div>
  );
}
