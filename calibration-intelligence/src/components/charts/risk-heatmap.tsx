"use client";

import { HeatmapCell } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RiskHeatmapProps {
  data: HeatmapCell[];
}

function riskColor(score: number): string {
  if (score >= 9) return "bg-red-500/80 text-white border-red-500/30";
  if (score >= 7) return "bg-orange-500/70 text-white border-orange-500/30";
  if (score >= 5) return "bg-amber-500/60 text-white border-amber-500/30";
  if (score >= 3) return "bg-yellow-500/40 text-yellow-200 border-yellow-500/20";
  return "bg-emerald-500/20 text-emerald-300 border-emerald-500/15";
}

export function RiskHeatmap({ data }: RiskHeatmapProps) {
  const departments = [...new Set(data.map((d) => d.department))];
  const categories = [...new Set(data.map((d) => d.category))];

  const getCell = (dept: string, cat: string) =>
    data.find((d) => d.department === dept && d.category === cat);

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="py-2 pr-3 text-left font-semibold text-zinc-500 uppercase tracking-wider w-32">Dept / Category</th>
            {categories.map((cat) => (
              <th key={cat} className="py-2 px-2 text-center font-semibold text-zinc-500 uppercase tracking-wider min-w-[90px]">
                {cat}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept} className="border-t border-white/[0.04]">
              <td className="py-2 pr-3 font-medium text-zinc-400 whitespace-nowrap">{dept}</td>
              {categories.map((cat) => {
                const cell = getCell(dept, cat);
                return (
                  <td key={cat} className="py-1 px-2">
                    {cell ? (
                      <div
                        className={cn(
                          "rounded-lg border px-2 py-2 text-center transition-all",
                          riskColor(cell.riskScore)
                        )}
                        title={`${dept} / ${cat}: Risk ${cell.riskScore}/10 — ${cell.instrumentCount} instrument${cell.instrumentCount > 1 ? "s" : ""}`}
                      >
                        <div className="text-sm font-bold">{cell.riskScore.toFixed(1)}</div>
                        <div className="text-[10px] opacity-75">{cell.instrumentCount} inst.</div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-white/[0.03] bg-white/[0.01] px-2 py-2 text-center">
                        <div className="text-zinc-700">—</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
        <span className="font-medium">Risk Scale:</span>
        {[
          { label: "Low (0–3)", cls: "bg-emerald-500/20 border-emerald-500/15" },
          { label: "Medium (3–5)", cls: "bg-yellow-500/40 border-yellow-500/20" },
          { label: "High (5–7)", cls: "bg-amber-500/60 border-amber-500/30" },
          { label: "Very High (7–9)", cls: "bg-orange-500/70 border-orange-500/30" },
          { label: "Critical (9–10)", cls: "bg-red-500/80 border-red-500/30" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn("h-3 w-5 rounded border", cls)} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
