import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/_app")({
  beforeLoad: requireAuth,
  component: AppShell,
});
