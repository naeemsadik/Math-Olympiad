"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Check, MessageSquare, Search, Pin, PinOff } from "lucide-react";

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  authorDept: string;
  time: string;
  likes: number;
  replies: number;
  views: number;
  pinned: boolean;
  tags: string[];
}

const categories = ["Algebra", "Combinatorics", "Number Theory", "Geometry", "General"];
const categoryColors: Record<string, string> = {
  Algebra: "#d97706", Combinatorics: "#f59e0b", "Number Theory": "#10b981",
  Geometry: "#3b82f6", General: "#94a3b8",
};

const initialPosts: Post[] = [
  { id: "c1", title: "How do I approach Vieta's formulas in competition problems?", body: "I keep getting confused when applying Vieta's formulas to higher degree polynomials. Any systematic approach?", category: "Algebra", author: "Rahat Khan", authorDept: "CSE", time: "2h ago", likes: 34, replies: 12, views: 142, pinned: true, tags: ["vieta", "polynomials"] },
  { id: "c2", title: "Stuck on BdMO 2023 Problem 4 — any hints without spoiling?", body: "I've been working on this for 3 hours. It seems related to modular arithmetic but I can't pin it down.", category: "Number Theory", author: "Nadia Islam", authorDept: "Math", time: "5h ago", likes: 21, replies: 8, views: 98, pinned: false, tags: ["bdmo", "number-theory"] },
  { id: "c3", title: "Trigonometric identities — which ones are worth memorizing?", body: "There are so many trig identities. Which ones actually come up in olympiad problems?", category: "Geometry", author: "Lamia Akter", authorDept: "EEE", time: "1d ago", likes: 57, replies: 19, views: 210, pinned: false, tags: ["trig", "identities"] },
  { id: "c4", title: "Pigeonhole principle trick I learned that might help others", body: "Here's a really elegant way to apply pigeonhole in combinatorics that I discovered from a Putnam problem.", category: "Combinatorics", author: "Adnan Chowdhury", authorDept: "CSE", time: "2d ago", likes: 88, replies: 24, views: 341, pinned: false, tags: ["pigeonhole", "tip"] },
  { id: "c5", title: "Study group forming for UIU internal olympiad — anyone interested?", body: "Planning to meet 3x per week in the library. We'll focus on past BdMO problems and mock exams.", category: "General", author: "Sarah Jubaida", authorDept: "EEE", time: "3d ago", likes: 43, replies: 31, views: 187, pinned: false, tags: ["study-group", "event"] },
];

const blankPost = (): Omit<Post, "id" | "likes" | "replies" | "views" | "time"> => ({
  title: "", body: "", category: "General", author: "Admin", authorDept: "Faculty",
  pinned: false, tags: [],
});

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(blankPost());
  const [tagInput, setTagInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const filtered = posts.filter((p) => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openCreate = () => { setForm(blankPost()); setTagInput(""); setEditId(null); setShowForm(true); };
  const openEdit = (p: Post) => {
    setForm({ title: p.title, body: p.body, category: p.category, author: p.author, authorDept: p.authorDept, pinned: p.pinned, tags: [...p.tags] });
    setTagInput(""); setEditId(p.id); setShowForm(true);
  };

  const addTag = () => { const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-"); if (t && !form.tags.includes(t)) { setForm({ ...form, tags: [...form.tags, t] }); } setTagInput(""); };
  const removeTag = (t: string) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  const save = () => {
    if (!form.title.trim()) return;
    if (editId) {
      setPosts((prev) => prev.map((p) => p.id === editId ? { ...p, ...form } : p));
    } else {
      setPosts((prev) => [{ id: `c${Date.now()}`, ...form, likes: 0, replies: 0, views: 0, time: "just now" }, ...prev]);
    }
    setShowForm(false);
  };

  const togglePin = (id: string) => setPosts((prev) => prev.map((p) => p.id === id ? { ...p, pinned: !p.pinned } : p));
  const doDelete = () => { if (deleteId) setPosts((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-[#d97706]" /> Community
          </h1>
          <p className="text-slate-500 text-sm mt-1">Moderate discussions, pin announcements, and manage posts.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all">
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Filters */}
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

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[#d97706]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900">{editId ? "Edit Post" : "New Post"}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Body</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3} placeholder="Post content..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all resize-none" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97706]/50">
                {categories.map((c) => <option key={c} value={c} >{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Author Name</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Department</label>
              <input value={form.authorDept} onChange={(e) => setForm({ ...form, authorDept: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 transition-all" />
              <button type="button" onClick={addTag} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#d97706]/15 text-[#d97706] border border-[#d97706]/20">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-900"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="w-4 h-4 accent-[#d97706]" />
              <span className="text-sm text-slate-500">Pin this post to top</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
              <button onClick={save} disabled={!form.title.trim()}
                className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
                <Check size={15} /> {editId ? "Save Changes" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-900">Delete <span className="text-red-400 font-semibold">&ldquo;{posts.find(p => p.id === deleteId)?.title}&rdquo;</span>?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className={`glass rounded-2xl p-5 flex items-start justify-between gap-4 ${p.pinned ? "border border-[#f59e0b]/20" : ""}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {p.pinned && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1"><Pin size={11} /> Pinned</span>}
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${categoryColors[p.category] ?? "#94a3b8"}18`, color: categoryColors[p.category] ?? "#94a3b8" }}>{p.category}</span>
                <span className="text-xs text-slate-400">{p.author} · {p.authorDept} · {p.time}</span>
              </div>
              <p className="font-heading font-semibold text-slate-900 text-sm mb-1">{p.title}</p>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.body}</p>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span>👍 {p.likes}</span>
                <span>💬 {p.replies} replies</span>
                <span>👁 {p.views} views</span>
                {p.tags.map((t) => <span key={t} className="text-[#d97706]/60">#{t}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => togglePin(p.id)} title={p.pinned ? "Unpin" : "Pin"}
                className={`p-2 rounded-lg transition-colors ${p.pinned ? "text-[#f59e0b] hover:bg-[#f59e0b]/10" : "text-slate-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10"}`}>
                {p.pinned ? <PinOff size={15} /> : <Pin size={15} />}
              </button>
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Pencil size={15} /></button>
              <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No posts found.</p>}
      </div>

      <p className="text-xs text-slate-400 text-center">{filtered.length} of {posts.length} posts</p>
    </div>
  );
}
