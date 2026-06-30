"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Table2,
  Upload,
  Activity,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/instruments", label: "Instruments", icon: Table2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/chat", label: "AI Assistant", icon: MessageSquare },
  { href: "/upload", label: "Import Data", icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/[0.06] bg-[#080a0f]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20">
          <Activity className="h-4 w-4 text-[#3b82f6]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white leading-none">Calibration</div>
          <div className="text-[10px] font-medium text-[#3b82f6] uppercase tracking-widest mt-0.5">Intelligence</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Platform
        </div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/15"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#3b82f6]" : "text-zinc-600 group-hover:text-zinc-400")} />
              <span>{label}</span>
              {active && <ChevronRight className="ml-auto h-3 w-3 text-[#3b82f6]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Plant Site</div>
          <div className="text-sm text-zinc-300 font-medium mt-1">Acme Manufacturing</div>
          <div className="text-xs text-zinc-600 mt-0.5">Houston, TX — Unit 1–4</div>
        </div>
      </div>
    </aside>
  );
}
