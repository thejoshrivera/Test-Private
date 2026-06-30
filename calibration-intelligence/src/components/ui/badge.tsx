import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Variant = "default" | "pass" | "fail" | "overdue" | "pending" | "low" | "medium" | "high" | "critical";

const variantClasses: Record<Variant, string> = {
  default: "bg-zinc-800 text-zinc-300",
  pass: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  fail: "bg-red-500/15 text-red-400 border border-red-500/20",
  overdue: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  pending: "bg-zinc-700/50 text-zinc-400",
  low: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  medium: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  high: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  critical: "bg-red-500/15 text-red-400 border border-red-500/20",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
