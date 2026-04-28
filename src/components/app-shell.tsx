import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { AppNavbar } from "./app-navbar";

export function AppShell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
