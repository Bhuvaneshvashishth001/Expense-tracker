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

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", title: "Monthly Salary", amount: 5800, type: "income", category: "Salary", date: daysAgo(2) },
  { id: "t2", title: "Whole Foods", amount: 124.5, type: "expense", category: "Food & Dining", date: daysAgo(1) },
  { id: "t3", title: "Uber rides", amount: 38.2, type: "expense", category: "Transport", date: daysAgo(1) },
  { id: "t4", title: "Netflix", amount: 15.99, type: "expense", category: "Entertainment", date: daysAgo(3) },
  { id: "t5", title: "Freelance project", amount: 1200, type: "income", category: "Freelance", date: daysAgo(5) },
  { id: "t6", title: "Electricity bill", amount: 89.4, type: "expense", category: "Bills & Utilities", date: daysAgo(6) },
  { id: "t7", title: "Nike sneakers", amount: 145, type: "expense", category: "Shopping", date: daysAgo(8) },
  { id: "t8", title: "Pharmacy", amount: 32.1, type: "expense", category: "Health", date: daysAgo(9) },
  { id: "t9", title: "Flight to NYC", amount: 320, type: "expense", category: "Travel", date: daysAgo(12) },
  { id: "t10", title: "Dividends", amount: 220, type: "income", category: "Investment", date: daysAgo(14) },
  { id: "t11", title: "Coffee shop", amount: 18.5, type: "expense", category: "Food & Dining", date: daysAgo(2) },
  { id: "t12", title: "Spotify", amount: 9.99, type: "expense", category: "Entertainment", date: daysAgo(15) },
  { id: "t13", title: "Gym membership", amount: 45, type: "expense", category: "Health", date: daysAgo(18) },
  { id: "t14", title: "Amazon order", amount: 78.3, type: "expense", category: "Shopping", date: daysAgo(20) },
  { id: "t15", title: "Restaurant dinner", amount: 92, type: "expense", category: "Food & Dining", date: daysAgo(22) },
  { id: "t16", title: "Gas", amount: 56, type: "expense", category: "Transport", date: daysAgo(25) },
  { id: "t17", title: "Side gig", amount: 450, type: "income", category: "Freelance", date: daysAgo(28) },
  { id: "t18", title: "Internet bill", amount: 60, type: "expense", category: "Bills & Utilities", date: daysAgo(30) },
];

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
