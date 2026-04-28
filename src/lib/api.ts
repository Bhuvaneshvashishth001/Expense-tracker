import { AuthUser, NotificationSettings, clearSession, getAuthToken } from "./auth-store";
import { Category } from "./mock-data";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  note?: string;
};

export type TransactionPayload = Omit<Transaction, "id">;

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8080/api" : "/api");

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? getAuthToken() : null;
  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = (await response.json()) as { message?: string };
      message = data.message ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function register(payload: { name: string; email: string; password: string }) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request<AuthUser>("/auth/me");
}

export function getProfile() {
  return request<AuthUser>("/profile");
}

export function updateProfile(payload: { name: string; email: string }) {
  return request<AuthUser>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getNotifications() {
  return request<NotificationSettings>("/profile/notifications");
}

export function updateNotifications(payload: NotificationSettings) {
  return request<NotificationSettings>("/profile/notifications", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getTransactions() {
  return request<Transaction[]>("/transactions");
}

export function createTransaction(payload: TransactionPayload) {
  return request<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTransaction(id: string, payload: TransactionPayload) {
  return request<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTransaction(id: string) {
  return request<{ message: string }>(`/transactions/${id}`, {
    method: "DELETE",
  });
}
