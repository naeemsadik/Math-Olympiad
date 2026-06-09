import Link from "next/link";

const navCols = [
  {
    title: "Explore",
    links: [
      { label: "Practice Dashboard", href: "/dashboard" },
      { label: "Activities", href: "/activities" },
      { label: "Resources", href: "/resources" },
      { label: "Hall of Fame", href: "/hall-of-fame" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "Registration", href: "/registration" },
      { label: "Gallery", href: "/gallery" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "UIU Math Club", href: "#" },
      { label: "BdMO Official", href: "#" },
      { label: "Discord Community", href: "#" },
      { label: "Mentor Support", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.11 18.104.127 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-900">
      {/* Top gold accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#d97706]/60 to-transparent" />

      {/* Subtle amber grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,119,6,1) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,6,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 w-64 h-64 rounded-full bg-[#d97706]/8 blur-3xl" />
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-violet-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-slate-800">
          {/* Brand column — centered on mobile */}
          <div className="lg:col-span-2 flex flex-col gap-5 items-center text-center md:items-start md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden ring-2 ring-[#d97706]/50 shadow-lg shadow-[#d97706]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="UIU CMOR" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-bold text-white text-[10px] uppercase tracking-widest">
                  UIU Centre for Math
                </span>
                <span className="font-heading font-semibold text-[#d97706] text-[9px] uppercase tracking-widest">
                  Olympiad and Research
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Elevating the standard of Mathematical Excellence at United International University.
            </p>

            <blockquote className="border-l-0 md:border-l-2 border-t-2 md:border-t-0 border-[#d97706]/60 pt-3 md:pt-0 md:pl-3 italic text-sm text-[#d97706]/90">
              &ldquo;Think Deep. Solve Smart.&rdquo;
            </blockquote>

            {/* Social icons */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 mt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-500 hover:text-[#d97706] hover:border-[#d97706]/50 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns — centered on mobile */}
          {navCols.map((col) => (
            <div key={col.title} className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
              <h4 className="text-[10px] font-bold text-[#d97706]/70 uppercase tracking-[0.15em]">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 group"
                    >
                      <span className="hidden md:inline-block w-0 group-hover:w-2 h-px bg-[#d97706] transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col items-center sm:flex-row sm:justify-between gap-2 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2025 UIU Centre for Math Olympiad and Research. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built for the mathematicians of tomorrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
