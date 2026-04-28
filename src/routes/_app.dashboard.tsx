import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import { TransactionModal } from "@/components/transaction-modal";
import { CategoryDot } from "@/components/category-badge";
import { useTransactions } from "@/lib/transactions-store";
import { useAuthSession } from "@/lib/auth-store";
import { CATEGORY_COLORS, formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SpendWise" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { items, add } = useTransactions();
  const [modal, setModal] = useState(false);
  const { user } = useAuthSession();

  const stats = useMemo(() => {
    const now = new Date();
    const monthItems = items.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const income = monthItems.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = monthItems.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const totalIncome = items.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = items.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return {
      balance: totalIncome - totalExpense,
      income,
      expense,
      savings: income - expense,
    };
  }, [items]);

  // Monthly bar (last 6 months expenses)
  const monthly = useMemo(() => {
    const arr: { month: string; expense: number; income: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en", { month: "short" });
      const m = items.filter(
        (t) => new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear(),
      );
      arr.push({
        month: label,
        expense: Math.round(m.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)),
        income: Math.round(m.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)),
      });
    }
    return arr;
  }, [items]);

  // Pie by category (expenses)
  const pie = useMemo(() => {
    const map = new Map<string, number>();
    items
      .filter((t) => t.type === "expense")
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS],
    }));
  }, [items]);

  const recent = items.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0] ?? "there"}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's your financial snapshot for this month.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> Add transaction
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Balance" value={formatCurrency(stats.balance)} delta={12.4} icon={Wallet} tone="primary" />
        <KpiCard label="Income (mo)" value={formatCurrency(stats.income)} delta={8.2} icon={TrendingUp} tone="success" />
        <KpiCard label="Expense (mo)" value={formatCurrency(stats.expense)} delta={-3.5} icon={TrendingDown} tone="danger" />
        <KpiCard label="Savings (mo)" value={formatCurrency(stats.savings)} delta={18.1} icon={PiggyBank} tone="warning" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Income vs Expenses" subtitle="Last 6 months overview">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={monthly} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="income" fill="var(--color-success)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        <ChartCard title="Spending by category" subtitle="All time">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {pie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {pie.slice(0, 4).map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium">{formatCurrency(p.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Trend + recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Cash flow trend" subtitle="Income vs expense over time">
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="income" stroke="var(--color-success)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expense" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Recent activity</h3>
            <Link to="/transactions" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <CategoryDot category={t.category} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                  {t.type === "income" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TransactionModal open={modal} onClose={() => setModal(false)} onSubmit={(t) => add(t)} />
    </div>
  );
}
