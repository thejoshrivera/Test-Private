import { cn } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down"; positive?: boolean };
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
}

const variantConfig = {
  default: { icon: "text-zinc-400 bg-zinc-800", border: "", glow: "" },
  success: { icon: "text-emerald-400 bg-emerald-500/10", border: "border-emerald-500/10", glow: "" },
  danger: { icon: "text-red-400 bg-red-500/10", border: "border-red-500/10", glow: "" },
  warning: { icon: "text-amber-400 bg-amber-500/10", border: "border-amber-500/10", glow: "" },
  info: { icon: "text-[#3b82f6] bg-[#3b82f6]/10", border: "border-[#3b82f6]/10", glow: "" },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, variant = "default", className }: KPICardProps) {
  const config = variantConfig[variant];
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/[0.06] bg-[#0f1117] p-5 overflow-hidden",
        config.border && config.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 truncate">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
          {trend && (
            <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium",
              trend.positive ? "text-emerald-400" : "text-red-400"
            )}>
              {trend.direction === "up" ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", config.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
