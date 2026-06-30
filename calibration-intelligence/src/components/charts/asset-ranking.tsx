"use client";

import { InstrumentSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AssetRankingProps {
  instruments: InstrumentSummary[];
  mode: "problematic" | "reliable";
  limit?: number;
}

export function AssetRanking({ instruments, mode, limit = 5 }: AssetRankingProps) {
  const sorted = [...instruments]
    .sort((a, b) => mode === "problematic" ? b.avgDrift - a.avgDrift : a.avgDrift - b.avgDrift)
    .slice(0, limit);

  return (
    <div className="space-y-2">
      {sorted.map((inst, i) => {
        const driftTrend = inst.driftTrend;
        const isRising = driftTrend.length >= 2 && driftTrend[driftTrend.length - 1] > driftTrend[driftTrend.length - 2];
        const isFalling = driftTrend.length >= 2 && driftTrend[driftTrend.length - 1] < driftTrend[driftTrend.length - 2];

        return (
          <div
            key={inst.instrumentId}
            className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors"
          >
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              i === 0 && mode === "problematic" ? "bg-red-500/20 text-red-400" :
              i === 0 && mode === "reliable" ? "bg-emerald-500/20 text-emerald-400" :
              "bg-zinc-800 text-zinc-500"
            )}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-zinc-200">{inst.instrumentTag}</span>
                <Badge variant={inst.riskLevel}>{inst.riskLevel}</Badge>
                {inst.isOverdue && <Badge variant="overdue">Overdue</Badge>}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 truncate">{inst.instrumentName} — {inst.location}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <span className={cn(
                  "text-sm font-bold tabular-nums",
                  inst.avgDrift > 0.5 ? "text-red-400" : inst.avgDrift > 0.3 ? "text-amber-400" : "text-emerald-400"
                )}>
                  {inst.avgDrift.toFixed(3)}%
                </span>
                {isRising ? <TrendingUp className="h-3.5 w-3.5 text-red-400" /> :
                 isFalling ? <TrendingDown className="h-3.5 w-3.5 text-emerald-400" /> :
                 <Minus className="h-3.5 w-3.5 text-zinc-600" />}
              </div>
              <div className="text-[10px] text-zinc-600">avg drift</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
