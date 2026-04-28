import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, ArrowUpRight, ArrowDownRight, Inbox } from "lucide-react";
import { useTransactions } from "@/lib/transactions-store";
import { CATEGORIES, Transaction, formatCurrency } from "@/lib/mock-data";
import { CategoryBadge } from "@/components/category-badge";
import { TransactionModal } from "@/components/transaction-modal";

export const Route = createFileRoute("/_app/transactions")({
  head: () => ({ meta: [{ title: "Transactions — SpendWise" }] }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { items, add, update, remove } = useTransactions();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>();

  const filtered = useMemo(() => {
    return items
      .filter((t) => (cat === "all" ? true : t.category === cat))
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [items, q, cat, type]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {items.length} entries</p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setOpen(true); }}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> New transaction
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value.slice(0, 80))}
              placeholder="Search by title…"
              className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as never)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20">
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold">No transactions found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting filters or add a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 transition hover:bg-muted/30 last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {t.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </span>
                        <div>
                          <p className="font-medium">{t.title}</p>
                          {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><CategoryBadge category={t.category} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className={`px-5 py-3.5 text-right font-semibold tabular-nums ${t.type === "income" ? "text-success" : "text-foreground"}`}>
                      {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => { setEditing(t); setOpen(true); }}
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(t.id)}
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSubmit={(t) => {
          if ("id" in t) update(t.id, t);
          else add(t);
        }}
      />
    </div>
  );
}
