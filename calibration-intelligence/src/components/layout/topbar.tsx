"use client";

import { Bell, Search, Settings, User } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#080a0f]/80 px-6 backdrop-blur-sm sticky top-0 z-40">
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <Search className="h-3.5 w-3.5 text-zinc-500" />
          <input
            className="bg-transparent text-sm text-zinc-400 placeholder:text-zinc-600 outline-none w-44"
            placeholder="Search instruments..."
          />
        </div>
        <button className="relative rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <button className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Settings className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6]/20 text-[#3b82f6]">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
