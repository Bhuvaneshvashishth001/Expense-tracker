import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Crown, Sparkles } from "lucide-react";
import { useTransactions } from "@/lib/transactions-store";
import { CATEGORY_COLORS, formatCurrency } from "@/lib/mock-data";
import { ChartCard } from "@/components/chart-card";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SpendWise" }] }),
  component: Analytics,
});

function Analytics() {
  const { items } = useTransactions();

  const stats = useMemo(() => {
    const exp = items.filter((t) => t.type === "expense");
    const inc = items.filter((t) => t.type === "income");
    const totalExp = exp.reduce((s, t) => s + t.amount, 0);
    const totalInc = inc.reduce((s, t) => s + t.amount, 0);

    const byCat = new Map<string, number>();
    exp.forEach((t) => byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.amount));
    const sorted = Array.from(byCat.entries()).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];

    const avg = totalExp / Math.max(1, exp.length);
    const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0;

    // daily trend
    const map = new Map<string, number>();
    exp.forEach((t) => {
      const d = new Date(t.date).toISOString().slice(0, 10);
      map.set(d, (map.get(d) ?? 0) + t.amount);
    });
    const trend = Array.from(map.entries())
      .sort()
      .slice(-30)
      .map(([d, v]) => ({ date: d.slice(5), value: Math.round(v) }));

    return { totalExp, totalInc, top, avg, savingsRate, sorted, trend };
  }, [items]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Deep insights into your spending behavior.</p>
      </div>

      {/* Insight cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <InsightCard
          icon={Crown}
          tone="from-amber-400 to-orange-500"
          label="Biggest category"
          value={stats.top?.[0] ?? "—"}
          sub={stats.top ? `${formatCurrency(stats.top[1])} spent` : ""}
        />
        <InsightCard
          icon={TrendingUp}
          tone="from-emerald-400 to-teal-500"
          label="Savings rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          sub={stats.savingsRate >= 20 ? "Excellent — keep it up!" : "Try to push past 20%"}
        />
        <InsightCard
          icon={TrendingDown}
          tone="from-rose-400 to-pink-500"
          label="Avg expense"
          value={formatCurrency(stats.avg)}
          sub="Per transaction"
        />
      </div>

      {/* Trend */}
      <ChartCard title="Daily spending trend" subtitle="Last 30 days">
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={stats.trend}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Category breakdown */}
      <ChartCard
        title="Spending by category"
        subtitle="Ranked by total spend"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3 w-3" /> AI insight
          </span>
        }
      >
        <div className="space-y-4">
          {stats.sorted.map(([name, value]) => {
            const pct = (value / stats.totalExp) * 100;
            return (
              <div key={name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] }} />
                    {name}
                  </span>
                  <span className="font-semibold tabular-nums">{formatCurrency(value)} <span className="ml-1 text-xs text-muted-foreground">({pct.toFixed(1)}%)</span></span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tone} opacity-20 blur-xl`} />
      <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="relative mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="relative mt-1 font-display text-2xl font-bold tracking-tight">{value}</p>
      <p className="relative mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
