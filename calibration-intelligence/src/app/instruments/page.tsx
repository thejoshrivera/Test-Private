"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_INSTRUMENTS } from "@/lib/mock-data";
import { InstrumentSummary } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = keyof Pick<InstrumentSummary, "instrumentTag" | "passRate" | "avgDrift" | "totalCost" | "failCount" | "lastCalibrationDate">;
type SortDir = "asc" | "desc";

export default function InstrumentsPage() {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("avgDrift");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const departments = [...new Set(MOCK_INSTRUMENTS.map((i) => i.department))];
  const categories = [...new Set(MOCK_INSTRUMENTS.map((i) => i.category))];

  const filtered = MOCK_INSTRUMENTS.filter((inst) => {
    const matchSearch =
      !search ||
      inst.instrumentTag.toLowerCase().includes(search.toLowerCase()) ||
      inst.instrumentName.toLowerCase().includes(search.toLowerCase()) ||
      inst.location.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || inst.department === filterDept;
    const matchCat = filterCat === "all" || inst.category === filterCat;
    const matchRisk = filterRisk === "all" || inst.riskLevel === filterRisk;
    return matchSearch && matchDept && matchCat && matchRisk;
  }).sort((a, b) => {
    const av = a[sort] as number | string;
    const bv = b[sort] as number | string;
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av;
    }
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sort !== col) return <ChevronDown className="h-3 w-3 text-zinc-600" />;
    return sortDir === "desc"
      ? <ChevronDown className="h-3 w-3 text-[#3b82f6]" />
      : <ChevronUp className="h-3 w-3 text-[#3b82f6]" />;
  };

  return (
    <div>
      <Topbar title="Instruments" subtitle={`${filtered.length} of ${MOCK_INSTRUMENTS.length} instruments`} />
      <div className="p-6 space-y-5">
        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 flex-1 min-w-48">
                <Search className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                  className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none flex-1"
                  placeholder="Search by tag, name, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters:</span>
              </div>
              {[
                { label: "Department", value: filterDept, setter: setFilterDept, options: ["all", ...departments] },
                { label: "Category", value: filterCat, setter: setFilterCat, options: ["all", ...categories] },
                { label: "Risk", value: filterRisk, setter: setFilterRisk, options: ["all", "low", "medium", "high", "critical"] },
              ].map(({ label, value, setter, options }) => (
                <select
                  key={label}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="rounded-lg border border-white/[0.06] bg-[#0f1117] px-3 py-2 text-xs text-zinc-300 outline-none cursor-pointer"
                >
                  {options.map((o) => (
                    <option key={o} value={o}>{o === "all" ? `All ${label}s` : o}</option>
                  ))}
                </select>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      { key: "instrumentTag", label: "Tag / Name" },
                      { key: null, label: "Location" },
                      { key: null, label: "Category" },
                      { key: "passRate", label: "Pass Rate" },
                      { key: "avgDrift", label: "Avg Drift" },
                      { key: "failCount", label: "Failures" },
                      { key: "totalCost", label: "Total Cost" },
                      { key: "lastCalibrationDate", label: "Last Cal." },
                      { key: null, label: "Risk" },
                      { key: null, label: "Status" },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        onClick={() => key && toggleSort(key as SortKey)}
                        className={cn(
                          "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500",
                          key && "cursor-pointer hover:text-zinc-300 select-none"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          {key && <SortIcon col={key as SortKey} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inst) => {
                    const driftTrend = inst.driftTrend;
                    const isRising = driftTrend.length >= 2 && driftTrend[driftTrend.length - 1] > driftTrend[driftTrend.length - 2];
                    const isFalling = driftTrend.length >= 2 && driftTrend[driftTrend.length - 1] < driftTrend[driftTrend.length - 2];

                    return (
                      <tr key={inst.instrumentId} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-mono font-semibold text-zinc-200">{inst.instrumentTag}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{inst.instrumentName}</div>
                          <div className="text-[10px] text-zinc-600">{inst.manufacturer} {inst.model}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{inst.location}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">{inst.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={cn(
                            "text-sm font-bold tabular-nums",
                            inst.passRate === 100 ? "text-emerald-400" :
                            inst.passRate >= 75 ? "text-amber-400" : "text-red-400"
                          )}>
                            {inst.passRate.toFixed(0)}%
                          </div>
                          <div className="mt-1 h-1 w-16 rounded-full bg-zinc-800">
                            <div
                              className={cn("h-1 rounded-full", inst.passRate === 100 ? "bg-emerald-500" : inst.passRate >= 75 ? "bg-amber-500" : "bg-red-500")}
                              style={{ width: `${inst.passRate}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "font-mono text-sm font-semibold",
                              inst.avgDrift > 0.5 ? "text-red-400" : inst.avgDrift > 0.3 ? "text-amber-400" : "text-emerald-400"
                            )}>
                              {inst.avgDrift.toFixed(3)}%
                            </span>
                            {isRising ? <TrendingUp className="h-3 w-3 text-red-400" /> :
                             isFalling ? <TrendingDown className="h-3 w-3 text-emerald-400" /> :
                             <Minus className="h-3 w-3 text-zinc-600" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "text-sm font-bold",
                            inst.failCount > 2 ? "text-red-400" : inst.failCount > 0 ? "text-amber-400" : "text-zinc-500"
                          )}>
                            {inst.failCount}
                          </span>
                          {inst.consecutiveFailures > 1 && (
                            <div className="text-[10px] text-red-400">{inst.consecutiveFailures} consec.</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-400 tabular-nums">{formatCurrency(inst.totalCost)}</td>
                        <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{inst.lastCalibrationDate}</td>
                        <td className="px-4 py-3">
                          <Badge variant={inst.riskLevel}>{inst.riskLevel}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {inst.isOverdue ? (
                            <Badge variant="overdue">Overdue</Badge>
                          ) : inst.consecutiveFailures >= 2 ? (
                            <Badge variant="fail">Action Needed</Badge>
                          ) : inst.passRate === 100 ? (
                            <Badge variant="pass">Compliant</Badge>
                          ) : (
                            <Badge variant="medium">Monitor</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-zinc-600">No instruments match your filters.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
