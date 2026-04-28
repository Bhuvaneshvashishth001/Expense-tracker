import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

type Tone = "primary" | "success" | "danger" | "warning";

const toneStyles: Record<Tone, { bg: string; icon: string }> = {
  primary: { bg: "bg-gradient-primary", icon: "text-primary-foreground" },
  success: { bg: "bg-gradient-success", icon: "text-success-foreground" },
  danger: { bg: "bg-gradient-danger", icon: "text-destructive-foreground" },
  warning: { bg: "bg-warning", icon: "text-warning-foreground" },
};

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft hover-lift">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-mesh opacity-40 blur-2xl transition group-hover:opacity-60" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneStyles[tone].bg} shadow-glow`}>
          <Icon className={`h-5 w-5 ${toneStyles[tone].icon}`} />
        </div>
      </div>
      {delta !== undefined && (
        <div className="relative mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold ${
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
