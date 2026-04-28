import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Bell,
  ArrowRight,
  Check,
  Star,
  BarChart3,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpendWise — Track expenses, grow savings beautifully" },
      {
        name: "description",
        content:
          "The modern expense tracker for people who care about their money. Real-time insights, smart budgets, and elegant design.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <LogoStrip />
      <Features />
      <Showcase />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">SpendWise</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#showcase" className="hover:text-foreground">Showcase</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-block">
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
      <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            New: AI-powered spending insights
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Money that <span className="text-gradient">moves with you.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            SpendWise turns your transactions into clarity. Track every dollar, automate your budget, and watch your savings compound — all in one beautifully designed dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-primary px-6 font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-6 font-semibold transition hover:bg-muted"
            >
              View live demo
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free for 14 days</p>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl animate-slide-up [animation-delay:120ms]">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-primary opacity-30 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span className="h-3 w-3 rounded-full bg-success" />
          <span className="ml-3 text-xs text-muted-foreground">spendwise.app/dashboard</span>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {[
            { label: "Balance", value: "$12,847", tone: "from-violet-500 to-indigo-500" },
            { label: "Income", value: "$7,250", tone: "from-emerald-400 to-teal-500" },
            { label: "Expenses", value: "$3,180", tone: "from-rose-400 to-pink-500" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-background/60 p-4">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{c.value}</p>
              <div className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${c.tone}`} />
            </div>
          ))}
          <div className="md:col-span-2 rounded-xl border border-border bg-background/60 p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Spending — Last 30 days</p>
            <div className="flex h-32 items-end gap-1.5">
              {[40, 65, 35, 80, 55, 90, 48, 72, 95, 60, 82, 50, 70, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-primary/60 to-primary"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Top category</p>
            <div className="flex items-center justify-center">
              <div className="relative h-28 w-28 rounded-full bg-gradient-conic from-primary via-success to-warning" style={{ background: "conic-gradient(var(--color-primary) 0 40%, var(--color-success) 40% 70%, var(--color-warning) 70% 100%)" }}>
                <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">Food</p>
                    <p className="font-display text-sm font-bold">42%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoStrip() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by 50,000+ smart spenders worldwide
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {["Stripe", "Notion", "Linear", "Vercel", "Ramp", "Figma"].map((n) => (
            <span key={n} className="font-display text-lg font-semibold tracking-tight text-muted-foreground">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: TrendingUp, title: "Real-time insights", desc: "See where every dollar goes the moment it moves." },
    { icon: PieChart, title: "Smart categorization", desc: "Auto-tag transactions with intelligent rules." },
    { icon: Bell, title: "Budget alerts", desc: "Get notified before you overspend, not after." },
    { icon: ShieldCheck, title: "Bank-grade security", desc: "Your data is encrypted end-to-end. Always." },
    { icon: BarChart3, title: "Beautiful reports", desc: "Monthly summaries that look like art." },
    { icon: Zap, title: "Lightning fast", desc: "Add a transaction in two taps. Sync everywhere instantly." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to <span className="text-gradient">master your money</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful tools wrapped in an interface so good, you'll actually want to check your finances.
          </p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="group rounded-2xl border border-border bg-card p-6 hover-lift">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="showcase" className="border-y border-border/60 bg-muted/30 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3 w-3" /> AI Insights
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight">
            Your personal CFO, in your pocket.
          </h2>
          <p className="mt-4 text-muted-foreground">
            SpendWise studies your patterns and surfaces opportunities you'd miss. Subscriptions you forgot, categories trending up, and savings goals within reach.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Forecast next month's spending",
              "Detect duplicate subscriptions",
              "Personalized saving tips",
              "Goal-based budgeting",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="glass rounded-2xl p-6 shadow-glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Monthly savings goal</p>
                <p className="font-display text-3xl font-bold">$1,200</p>
              </div>
              <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                +18%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[72%] rounded-full bg-gradient-success" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">$864 saved · $336 to go</p>
            <div className="mt-6 space-y-3">
              {[
                { label: "Coffee shops", trend: "+24%", color: "text-destructive" },
                { label: "Groceries", trend: "−8%", color: "text-success" },
                { label: "Subscriptions", trend: "+3%", color: "text-warning" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-lg bg-background/60 px-3 py-2 text-sm">
                  <span>{r.label}</span>
                  <span className={`font-semibold ${r.color}`}>{r.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      desc: "Everything to get started.",
      features: ["Unlimited transactions", "3 budgets", "Basic reports", "Mobile app"],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      desc: "For serious spenders & savers.",
      features: ["Unlimited budgets", "AI insights", "CSV & PDF export", "Priority support", "Custom categories"],
      cta: "Start 14-day trial",
      highlight: true,
    },
    {
      name: "Team",
      price: "$24",
      desc: "Shared finances, made simple.",
      features: ["Up to 5 members", "Shared budgets", "Role permissions", "Audit log", "API access"],
      cta: "Contact sales",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, honest <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-7 ${
                t.highlight
                  ? "border-primary/40 bg-gradient-card shadow-glow"
                  : "border-border bg-card shadow-soft"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-glow">
                  <Star className="h-3 w-3" /> MOST POPULAR
                </span>
              )}
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`mt-7 flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
                    : "border border-border bg-card hover:bg-muted"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-primary p-12 text-center shadow-glow sm:p-16">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl">
            Ready to spend wisely?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
            Join 50,000+ people who took control of their money with SpendWise.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-background px-6 font-semibold text-foreground shadow-elegant transition hover:scale-105"
          >
            Get started — it's free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">SpendWise</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SpendWise. Crafted with care.</p>
      </div>
    </footer>
  );
}
