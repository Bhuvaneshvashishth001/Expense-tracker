import { useEffect, useState } from "react";
import {
  Transaction,
  TransactionPayload,
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./api";
import { getAuthToken } from "./auth-store";

function sortByDate(items: Transaction[]) {
  return [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!getAuthToken()) {
        if (active) {
          setItems([]);
          setReady(true);
        }
        return;
      }

      try {
        const data = await getTransactions();
        if (active) {
          setItems(sortByDate(data));
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setItems([]);
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function add(payload: TransactionPayload) {
    const created = await createTransaction(payload);
    setItems((current) => sortByDate([created, ...current]));
  }

  async function update(id: string, payload: TransactionPayload) {
    const updated = await updateTransaction(id, payload);
    setItems((current) => sortByDate(current.map((item) => (item.id === id ? updated : item))));
  }

  async function remove(id: string) {
    await deleteTransaction(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return { items, ready, add, update, remove };
}
