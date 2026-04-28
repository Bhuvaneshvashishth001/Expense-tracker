import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, Wallet, X } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { location } = useRouterState();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">SpendWise</span>
            </Link>
            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {items.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className={`h-[18px] w-[18px] transition ${active ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="m-3 rounded-2xl border border-sidebar-border bg-gradient-primary p-4 text-primary-foreground shadow-glow">
            <p className="font-display text-sm font-semibold">Upgrade to Pro</p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Unlock AI insights, unlimited budgets, and CSV exports.
            </p>
            <button className="mt-3 w-full rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-white/25">
              Upgrade now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
