"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";

export default function OpenLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-4 gap-6">
        {mounted && user && (
          <div className="sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto shrink-0">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 min-w-0 py-6">{children}</main>
      </div>
    </div>
  );
}
