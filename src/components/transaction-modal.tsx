import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Transaction, TransactionPayload } from "@/lib/api";
import { CATEGORIES, Category } from "@/lib/mock-data";

export function TransactionModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (t: TransactionPayload | Transaction) => void | Promise<void>;
  initial?: Transaction;
}) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setType(initial.type);
      setTitle(initial.title);
      setAmount(String(initial.amount));
      setCategory(initial.category);
      setDate(initial.date.slice(0, 10));
      setNote(initial.note ?? "");
    } else {
      setType("expense");
      setTitle("");
      setAmount("");
      setCategory("Food & Dining");
      setDate(new Date().toISOString().slice(0, 10));
      setNote("");
    }
    setError("");
  }, [initial, open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim()) return setError("Title is required");
    if (!amt || amt <= 0) return setError("Amount must be greater than 0");
    const payload = {
      title: title.trim().slice(0, 80),
      amount: amt,
      type,
      category,
      date: new Date(date).toISOString(),
      note: note.trim().slice(0, 200) || undefined,
    };
    try {
      await onSubmit(initial ? { ...payload, id: initial.id } : payload);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save transaction");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-t-3xl border border-border bg-card shadow-elegant sm:rounded-2xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-lg font-semibold">{initial ? "Edit transaction" : "New transaction"}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1">
            {(["expense", "income"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-lg py-2 text-sm font-medium capitalize transition ${
                  type === t
                    ? t === "income"
                      ? "bg-success text-success-foreground shadow-sm"
                      : "bg-destructive text-destructive-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === "income" ? "e.g. Salary" : "e.g. Grocery shopping"}
              maxLength={80}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input"
              />
            </Field>
            <Field label="Date">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
            </Field>
          </div>

          {type === "expense" && (
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Note (optional)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={2}
              className="input resize-none"
              placeholder="Add a note…"
            />
          </Field>

          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              {initial ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
        <style>{`
          .input { width:100%; height:42px; padding:0 14px; border-radius:12px; border:1px solid var(--color-input); background:var(--color-background); font-size:14px; outline:none; transition:all .15s; }
          .input:focus { border-color:var(--color-ring); box-shadow:0 0 0 3px oklch(from var(--color-ring) l c h / 0.18); }
          textarea.input { padding-top:10px; height:auto; }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
