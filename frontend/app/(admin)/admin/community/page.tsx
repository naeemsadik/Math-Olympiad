"use client";

import { useEffect, useState } from "react";
import { Trash2, X, MessageSquare, Search, Pin, PinOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  authorName: string;
  authorDept?: string;
  createdAt: string;
  likes: number;
  replyCount: number;
  viewCount: number;
  pinned: boolean;
  tags: string[];
  status: string;
}

const categories = ["Algebra", "Combinatorics", "Number Theory", "Geometry", "General"];
const categoryColors: Record<string, string> = {
  Algebra: "#d97706", Combinatorics: "#f59e0b", "Number Theory": "#10b981",
  Geometry: "#3b82f6", General: "#94a3b8",
};

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.community.listPosts();
      const list: Post[] = Array.isArray(res) ? (res as Post[]) : ((res as unknown as { data?: Post[] })?.data ?? []);
      setPosts(list);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to load posts.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = posts.filter((p) => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = (p.title ?? "").toLowerCase().includes(search.toLowerCase()) || (p.authorName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await api.admin.community.removePost(deleteId);
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to delete post.";
      setError(msg);
    }
  };

  const togglePin = async (id: string) => {
    try {
      const updated = await api.admin.community.togglePinPost(id);
      const updatedId = (updated as { id?: string }).id;
      const pinned = (updated as { pinned?: boolean }).pinned;
      setPosts((prev) => prev.map((p) => updatedId && p.id === updatedId ? { ...p, pinned: pinned ?? !p.pinned } : p));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Failed to toggle pin.";
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-[#d97706]" /> Community
          </h1>
          <p className="text-slate-500 text-sm mt-1">Moderate discussions, pin announcements, and manage posts.</p>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl p-3 border border-red-500/30 text-sm text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-52 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${filterCat === c ? "gradient-orange text-white" : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Delete <span className="text-red-400 font-semibold">&ldquo;{posts.find(p => p.id === deleteId)?.title}&rdquo;</span>?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-center text-slate-400 text-sm py-10">Loading posts…</p> : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className={`glass rounded-2xl p-5 flex items-start justify-between gap-4 ${p.pinned ? "border border-[#f59e0b]/20" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {p.pinned && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1"><Pin size={11} /> Pinned</span>}
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${categoryColors[p.category] ?? "#94a3b8"}18`, color: categoryColors[p.category] ?? "#94a3b8" }}>{p.category}</span>
                  <span className="text-xs text-slate-400">{p.authorName}{p.authorDept ? ` · ${p.authorDept}` : ""}{p.createdAt ? ` · ${new Date(p.createdAt).toLocaleDateString()}` : ""}</span>
                  {p.status && p.status !== "published" && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{p.status}</span>}
                </div>
                <p className="font-heading font-semibold text-slate-900 text-sm mb-1">{p.title}</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.body}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                  <span>👍 {p.likes}</span>
                  <span>💬 {p.replyCount} replies</span>
                  <span>👁 {p.viewCount} views</span>
                  {(p.tags ?? []).map((t) => <span key={t} className="text-[#d97706]/60">#{t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => togglePin(p.id)} title={p.pinned ? "Unpin" : "Pin"}
                  className={`p-2 rounded-lg transition-colors ${p.pinned ? "text-[#f59e0b] hover:bg-[#f59e0b]/10" : "text-slate-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10"}`}>
                  {p.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                </button>
                <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No posts found.</p>}
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">{filtered.length} of {posts.length} posts</p>
    </div>
  );
}