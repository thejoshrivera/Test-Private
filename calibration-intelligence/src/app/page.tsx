import { Topbar } from "@/components/layout/topbar";
import { KPICard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import { DriftChart } from "@/components/charts/drift-chart";
import { AssetRanking } from "@/components/charts/asset-ranking";
import { Badge } from "@/components/ui/badge";
import { MOCK_KPIS, MOCK_TREND_DATA, MOCK_INSTRUMENTS, MOCK_RECOMMENDATIONS } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Gauge,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  DollarSign,
  Users,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const kpis = MOCK_KPIS;
  const topRecs = MOCK_RECOMMENDATIONS.filter((r) => r.priority === "critical" || r.priority === "high").slice(0, 3);

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle="Calibration Intelligence Overview — Acme Manufacturing, Houston TX"
      />

      <div className="p-6 space-y-6">
        {/* Alert banner */}
        {kpis.criticalInstruments > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3.5">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">
              <span className="font-semibold">{kpis.criticalInstruments} critical instruments</span> require immediate attention — including a compressor vibration sensor and a product flow meter with 4 consecutive failures.
            </p>
            <Link href="/recommendations" className="ml-auto shrink-0 flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
              View Recommendations <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Instruments"
            value={kpis.totalInstruments.toString()}
            subtitle={`${kpis.calibrationsThisMonth} calibrations this month`}
            icon={Gauge}
            variant="info"
          />
          <KPICard
            title="Pass Rate"
            value={formatPercent(kpis.passRate)}
            subtitle="Fleet-wide calibration pass"
            icon={CheckCircle2}
            variant="success"
            trend={{ value: "−4.2% vs last quarter", direction: "down", positive: false }}
          />
          <KPICard
            title="Fail Rate"
            value={formatPercent(kpis.failRate)}
            subtitle="Calibrations out of tolerance"
            icon={XCircle}
            variant="danger"
            trend={{ value: "+2.8% vs last quarter", direction: "up", positive: false }}
          />
          <KPICard
            title="Overdue"
            value={formatPercent(kpis.overdueRate)}
            subtitle="Past calibration due date"
            icon={Clock}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Average Drift"
            value={`${kpis.avgDrift.toFixed(3)}%`}
            subtitle="Fleet-wide mean drift"
            icon={Activity}
            variant={kpis.avgDrift > 0.5 ? "danger" : kpis.avgDrift > 0.3 ? "warning" : "success"}
          />
          <KPICard
            title="Est. Annual Cost"
            value={formatCurrency(kpis.estimatedAnnualCost)}
            subtitle="Total calibration program cost"
            icon={DollarSign}
            variant="info"
          />
          <KPICard
            title="Labor Hours (YTD)"
            value={kpis.totalLaborHours.toLocaleString()}
            subtitle="Total technician hours"
            icon={Users}
          />
          <KPICard
            title="Critical Assets"
            value={kpis.criticalInstruments.toString()}
            subtitle="Require immediate action"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Calibration Trend — Pass vs Fail (18 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={MOCK_TREND_DATA} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Drift Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <DriftChart data={MOCK_TREND_DATA} />
            </CardContent>
          </Card>
        </div>

        {/* Asset Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Most Problematic Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetRanking instruments={MOCK_INSTRUMENTS} mode="problematic" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Most Reliable Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetRanking instruments={MOCK_INSTRUMENTS} mode="reliable" />
            </CardContent>
          </Card>
        </div>

        {/* Top Recommendations Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Priority Recommendations</CardTitle>
            <Link href="/recommendations" className="flex items-center gap-1 text-xs font-medium text-[#3b82f6] hover:text-blue-300 transition-colors">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {topRecs.map((rec) => (
                <div key={rec.id} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10">
                      <Lightbulb className="h-4 w-4 text-[#3b82f6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-white">{rec.title}</span>
                        <Badge variant={rec.priority as "critical" | "high"}>{rec.priority.toUpperCase()}</Badge>
                        <span className="text-xs text-zinc-500">Confidence: {rec.confidenceScore}%</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{rec.problem}</p>
                      <p className="mt-1.5 text-xs font-medium text-emerald-400">
                        Est. savings: {formatCurrency(rec.estimatedSavings)}/yr
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
