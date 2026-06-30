import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_RECOMMENDATIONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  AlertTriangle,
  TrendingDown,
  Clock,
  DollarSign,
  Wrench,
  Search,
} from "lucide-react";

const categoryConfig = {
  replacement: { label: "Replace", icon: AlertTriangle, color: "text-red-400 bg-red-500/10" },
  investigation: { label: "Investigate", icon: Search, color: "text-orange-400 bg-orange-500/10" },
  interval: { label: "Interval", icon: Clock, color: "text-blue-400 bg-blue-500/10" },
  cost: { label: "Cost", icon: DollarSign, color: "text-emerald-400 bg-emerald-500/10" },
  audit: { label: "Audit", icon: TrendingDown, color: "text-purple-400 bg-purple-500/10" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "text-amber-400 bg-amber-500/10" },
};

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function RecommendationsPage() {
  const sorted = [...MOCK_RECOMMENDATIONS].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const totalSavings = MOCK_RECOMMENDATIONS.reduce((s, r) => s + r.estimatedSavings, 0);

  return (
    <div>
      <Topbar
        title="Recommendations"
        subtitle={`${MOCK_RECOMMENDATIONS.length} AI-generated recommendations · ${formatCurrency(totalSavings)} estimated annual savings`}
      />
      <div className="p-6 space-y-5">
        {/* Summary bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Critical", count: sorted.filter((r) => r.priority === "critical").length, cls: "text-red-400 bg-red-500/10 border-red-500/15" },
            { label: "High Priority", count: sorted.filter((r) => r.priority === "high").length, cls: "text-orange-400 bg-orange-500/10 border-orange-500/15" },
            { label: "Medium", count: sorted.filter((r) => r.priority === "medium").length, cls: "text-amber-400 bg-amber-500/10 border-amber-500/15" },
            { label: "Est. Total Savings", count: formatCurrency(totalSavings), cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15", isText: true },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-xl border px-5 py-4", s.cls)}>
              <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70">{s.label}</div>
              <div className="mt-1 text-2xl font-bold">{s.count}</div>
            </div>
          ))}
        </div>

        {/* Recommendation cards */}
        <div className="space-y-4">
          {sorted.map((rec) => {
            const cat = categoryConfig[rec.category];
            const CatIcon = cat.icon;
            return (
              <Card key={rec.id} className={cn(
                "transition-all hover:border-white/[0.1]",
                rec.priority === "critical" && "border-red-500/20",
                rec.priority === "high" && "border-orange-500/15",
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Category icon */}
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cat.color)}>
                      <CatIcon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-white leading-tight">{rec.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <Badge variant={rec.priority as "critical" | "high" | "medium" | "low"}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400">
                            {cat.label}
                          </span>
                          {rec.instrumentTag && (
                            <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                              {rec.instrumentTag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 4-column evidence grid */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1.5">Problem</div>
                          <p className="text-sm text-zinc-400 leading-relaxed">{rec.problem}</p>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1.5">Evidence</div>
                          <p className="text-sm text-zinc-400 leading-relaxed">{rec.evidence}</p>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1.5">Business Impact</div>
                          <p className="text-sm text-zinc-400 leading-relaxed">{rec.businessImpact}</p>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1.5">Recommended Action</div>
                          <p className="text-sm text-zinc-400 leading-relaxed">{rec.recommendedAction}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center gap-6 pt-4 border-t border-white/[0.04]">
                        <div>
                          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Est. Savings</div>
                          <div className="text-sm font-bold text-emerald-400">{formatCurrency(rec.estimatedSavings)}/yr</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Confidence</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="h-1.5 w-24 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", rec.confidenceScore >= 90 ? "bg-emerald-500" : rec.confidenceScore >= 75 ? "bg-amber-500" : "bg-orange-500")}
                                style={{ width: `${rec.confidenceScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-zinc-300">{rec.confidenceScore}%</span>
                          </div>
                        </div>
                        {rec.affectedInstruments && rec.affectedInstruments.length > 1 && (
                          <div>
                            <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Affects</div>
                            <div className="flex gap-1 mt-0.5">
                              {rec.affectedInstruments.map((tag) => (
                                <span key={tag} className="font-mono text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="ml-auto">
                          <button className="rounded-lg border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-4 py-2 text-xs font-semibold text-[#3b82f6] hover:bg-[#3b82f6]/20 transition-colors">
                            Mark In Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
