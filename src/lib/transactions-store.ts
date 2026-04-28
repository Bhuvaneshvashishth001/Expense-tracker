import { useEffect, useState, useCallback } from "react";
import { MOCK_TRANSACTIONS, Transaction } from "./mock-data";

const KEY = "spendwise-transactions";

function load(): Transaction[] {
  if (typeof window === "undefined") return MOCK_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return MOCK_TRANSACTIONS;
    return JSON.parse(raw) as Transaction[];
  } catch {
    return MOCK_TRANSACTIONS;
  }
}

function save(list: Transaction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  const persist = useCallback((next: Transaction[]) => {
    setItems(next);
    save(next);
  }, []);

  const add = useCallback(
    (t: Omit<Transaction, "id">) => {
      const next = [{ ...t, id: `t${Date.now()}` }, ...items];
      persist(next);
    },
    [items, persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      persist(items.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [items, persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((t) => t.id !== id));
    },
    [items, persist],
  );

  return { items, ready, add, update, remove };
}
