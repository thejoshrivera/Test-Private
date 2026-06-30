import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import { DriftChart } from "@/components/charts/drift-chart";
import { RiskHeatmap } from "@/components/charts/risk-heatmap";
import { ParetoChart } from "@/components/charts/pareto-chart";
import { AssetRanking } from "@/components/charts/asset-ranking";
import { MOCK_TREND_DATA, MOCK_HEATMAP, MOCK_PARETO, MOCK_INSTRUMENTS, MOCK_RECORDS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const totalCost = MOCK_RECORDS.reduce((s, r) => s + r.calibrationCost, 0);
  const avgCostPerCal = totalCost / MOCK_RECORDS.length;
  const failedRecords = MOCK_RECORDS.filter((r) => r.status === "fail");
  const failCostTotal = failedRecords.reduce((s, r) => s + r.calibrationCost, 0);

  // Category breakdown
  const categoryBreakdown = MOCK_INSTRUMENTS.reduce<Record<string, { count: number; cost: number; fails: number }>>((acc, inst) => {
    if (!acc[inst.category]) acc[inst.category] = { count: 0, cost: 0, fails: 0 };
    acc[inst.category].count += 1;
    acc[inst.category].cost += inst.totalCost;
    acc[inst.category].fails += inst.failCount;
    return acc;
  }, {});

  return (
    <div>
      <Topbar title="Analytics" subtitle="Deep-dive calibration data analysis and visualizations" />
      <div className="p-6 space-y-6">

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Records", value: MOCK_RECORDS.length.toString(), sub: "Calibration events analyzed" },
            { label: "Total Program Cost", value: formatCurrency(totalCost), sub: "All calibration records" },
            { label: "Avg Cost per Cal.", value: formatCurrency(avgCostPerCal), sub: "Fleet average" },
            { label: "Cost of Failures", value: formatCurrency(failCostTotal), sub: `${failedRecords.length} failed calibrations` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-[#0f1117] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{s.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs text-zinc-600">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Pass / Fail Trend (18 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={MOCK_TREND_DATA} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fleet Average Drift Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <DriftChart data={MOCK_TREND_DATA} />
            </CardContent>
          </Card>
        </div>

        {/* Pareto */}
        <Card>
          <CardHeader>
            <CardTitle>Pareto — Cost Concentration by Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 mb-4">The top 20% of instruments typically drive 80% of calibration costs. Use this to prioritize maintenance investment.</p>
            <ParetoChart data={MOCK_PARETO} />
          </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Heatmap — Department × Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500 mb-4">Composite risk score (0–10) based on drift, failure rate, overdue status, and asset criticality. Dark red cells require immediate action.</p>
            <RiskHeatmap data={MOCK_HEATMAP} />
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost by Instrument Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b.cost - a.cost)
                .map(([cat, data]) => {
                  const maxCost = Math.max(...Object.values(categoryBreakdown).map((d) => d.cost));
                  const pct = (data.cost / maxCost) * 100;
                  return (
                    <div key={cat} className="flex items-center gap-4">
                      <div className="w-24 text-xs text-zinc-400 font-medium shrink-0">{cat}</div>
                      <div className="flex-1 h-6 rounded bg-zinc-800/50 overflow-hidden">
                        <div
                          className="h-full rounded bg-gradient-to-r from-[#3b82f6]/80 to-[#3b82f6]/40 flex items-center px-2"
                          style={{ width: `${pct}%` }}
                        >
                          <span className="text-[10px] font-medium text-white/80">{formatCurrency(data.cost)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 w-24 text-right shrink-0">
                        {data.count} inst. · {data.fails} fail{data.fails !== 1 ? "s" : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Asset rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle>Highest Drift Assets</CardTitle></CardHeader>
            <CardContent>
              <AssetRanking instruments={MOCK_INSTRUMENTS} mode="problematic" limit={8} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Failure Timeline — Recent Events</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_RECORDS
                  .filter((r) => r.status === "fail")
                  .sort((a, b) => b.calibrationDate.localeCompare(a.calibrationDate))
                  .map((r) => (
                    <div key={r.id} className="flex items-start gap-3 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2.5">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-200">{r.instrumentTag}</span>
                          <span className="text-[10px] text-zinc-500">{r.calibrationDate}</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">{r.instrumentName} — drift {r.drift.toFixed(3)}% (tol: ±{r.tolerance}%)</div>
                      </div>
                      <div className="text-xs font-medium text-red-400 shrink-0">{formatCurrency(r.calibrationCost)}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
