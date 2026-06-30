"use client";

import { TrendDataPoint } from "@/lib/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface DriftChartProps {
  data: TrendDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f1117] px-4 py-3 shadow-2xl text-xs">
      <p className="font-semibold text-zinc-300 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
        <span className="text-zinc-500">Avg Drift:</span>
        <span className="text-white font-medium">{payload[0]?.value?.toFixed(3)}%</span>
      </div>
    </div>
  );
};

export function DriftChart({ data }: DriftChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.5} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0.5} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: "Tolerance", position: "insideTopRight", fill: "#f59e0b", fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="avgDrift"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#3b82f6", stroke: "#080a0f", strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
