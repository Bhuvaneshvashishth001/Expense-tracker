export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Bills & Utilities"
  | "Health"
  | "Travel"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  date: string; // ISO
  note?: string;
};

export const CATEGORIES: Category[] = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Travel",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Food & Dining": "oklch(0.7 0.17 50)",
  Transport: "oklch(0.68 0.19 200)",
  Shopping: "oklch(0.7 0.19 320)",
  Entertainment: "oklch(0.65 0.2 285)",
  "Bills & Utilities": "oklch(0.62 0.22 18)",
  Health: "oklch(0.72 0.16 162)",
  Travel: "oklch(0.75 0.17 230)",
  Salary: "oklch(0.66 0.16 158)",
  Freelance: "oklch(0.7 0.17 130)",
  Investment: "oklch(0.6 0.18 95)",
  Other: "oklch(0.55 0.04 265)",
};

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
