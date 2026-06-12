"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, Eye, Pin, Tag, ChevronRight, Plus, Flame, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { communityPosts } from "@/lib/mock/community";
import type { Tier } from "@/types";

const categories = ["All", "Algebra", "Combinatorics", "Number Theory", "Geometry", "General"];

const categoryColors: Record<string, string> = {
  Algebra: "#d97706",
  Combinatorics: "#f59e0b",
  "Number Theory": "#10b981",
  Geometry: "#3b82f6",
  Inequalities: "#ef4444",
  General: "#94a3b8",
};

const tierColors: Record<Tier, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
};

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
};

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 focus:ring-2 focus:ring-[#d97706]/10 transition-all";

export default function CommunityPage() {
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [myTierOnly, setMyTierOnly] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const userTier = user?.tier ?? "Beginner";

  const filtered = communityPosts.filter((p) => {
    const categoryMatch = activeCategory === "All" || p.category === activeCategory;
    const tierMatch = !myTierOnly || p.tier === userTier;
    return categoryMatch && tierMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", boxShadow: "0 8px 32px rgba(217, 119, 6,0.25), 0 2px 8px rgba(217, 119, 6,0.15)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={15} className="text-yellow-300" />
              <p className="text-xs text-white/60 uppercase tracking-widest font-medium">Discussion Forum</p>
            </div>
            <h1 className="font-heading text-4xl font-extrabold text-white leading-tight">
              Math <span className="text-yellow-300">Community</span>
            </h1>
            <p className="text-white/60 mt-2 text-sm">Ask questions, share solutions, discuss strategies with fellow olympiad students.</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 bg-white text-[#d97706] text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow-md"
          >
            <Plus size={16} /> New Post
          </button>
        </div>
      </div>

      {/* New post form */}
      {showNewPost && (
        <div className="bg-white rounded-2xl p-6 space-y-4" style={{ ...cardStyle, borderColor: "rgba(217, 119, 6,0.2)" }}>
          <h3 className="font-heading font-semibold text-slate-900">Create a New Post</h3>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What's your question or topic?" className={inputCls} />
          <textarea rows={3} placeholder="Describe your question in detail..." className={inputCls + " resize-none"} />
          <div className="flex items-center gap-3">
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#d97706]/50">
              {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setShowNewPost(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">Cancel</button>
              <button disabled={!newTitle.trim()} onClick={() => { setShowNewPost(false); setNewTitle(""); }} className="gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? "gradient-orange text-white border-transparent"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMyTierOnly((v) => !v)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
          style={myTierOnly ? {
            backgroundColor: `${tierColors[userTier]}12`,
            borderColor: `${tierColors[userTier]}35`,
            color: tierColors[userTier],
          } : {
            backgroundColor: "#fff",
            borderColor: "rgba(15,23,42,0.12)",
            color: "#64748b",
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tierColors[userTier] }} />
          {myTierOnly ? `${userTier} Only` : "All Tiers"}
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl p-5 cursor-pointer group transition-all hover:-translate-y-0.5"
            style={cardStyle}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(15,23,42,0.09), 0 0 0 1px rgba(217, 119, 6,0.15)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(217, 119, 6,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(15,23,42,0.07)";
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-amber-500/20">
                {post.author[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.pinned && <Pin size={13} className="text-[#f59e0b] shrink-0" />}
                    <h3 className="text-slate-900 font-semibold text-sm group-hover:text-[#d97706] transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#d97706] shrink-0 transition-colors mt-0.5" />
                </div>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${categoryColors[post.category] ?? "#94a3b8"}15`, color: categoryColors[post.category] ?? "#94a3b8" }}
                  >
                    {post.category}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${tierColors[post.tier]}12`, color: tierColors[post.tier] }}
                  >
                    {post.tier}
                  </span>
                  <span className="text-xs text-slate-500">{post.author} · {post.authorInstitute}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {post.time}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><ThumbsUp size={12} /> {post.likes}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare size={12} /> {post.replies} replies</span>
                  <span className="flex items-center gap-1.5"><Eye size={12} /> {post.views}</span>
                  <div className="ml-auto flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <Tag size={10} />{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={cardStyle}>
            <p className="text-slate-400 text-sm">No posts found. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}
