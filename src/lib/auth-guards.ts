import { redirect } from "@tanstack/react-router";
import { getAuthToken } from "./auth-store";

export function requireAuth() {
  if (!getAuthToken()) {
    throw redirect({ to: "/login" });
  }
}

export function redirectIfAuthenticated() {
  if (getAuthToken()) {
    throw redirect({ to: "/dashboard" });
  }
}
