"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  durationMinutes: number;
  onExpire: () => void;
}

export default function Timer({ durationMinutes, onExpire }: Props) {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds, onExpire]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const isWarning = seconds < 300;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-bold",
        isWarning
          ? "bg-red-500/20 border border-red-500/40 text-red-400"
          : "bg-[#d97706]/20 border border-[#d97706]/30 text-[#a78bfa]"
      )}
    >
      <Clock size={14} />
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}
