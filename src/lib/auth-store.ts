import { useSyncExternalStore } from "react";

export type NotificationSettings = {
  email: boolean;
  push: boolean;
  weekly: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  plan: string;
  notifications: NotificationSettings;
};

type Session = {
  token: string | null;
  user: AuthUser | null;
};

const TOKEN_KEY = "spendwise-token";
const USER_KEY = "spendwise-user";

const listeners = new Set<() => void>();
let sessionCache: Session = { token: null, user: null };

function readSession(): Session {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);

  try {
    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
    };
  } catch {
    return { token, user: null };
  }
}

function refreshSessionCache() {
  sessionCache = readSession();
}

function emit() {
  refreshSessionCache();
  listeners.forEach((listener) => listener());
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSessionSnapshot() {
  return sessionCache;
}

export function getAuthToken() {
  return sessionCache.token;
}

export function setSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emit();
}

export function updateStoredUser(user: AuthUser) {
  const { token } = sessionCache;
  if (!token) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emit();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emit();
}

export function useAuthSession() {
  return useSyncExternalStore(subscribeAuth, getSessionSnapshot, () => ({ token: null, user: null }));
}

refreshSessionCache();
