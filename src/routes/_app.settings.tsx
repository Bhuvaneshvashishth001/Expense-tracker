import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Lock, Moon, Sun, User, LogOut, Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getNotifications, getProfile, updateNotifications, updateProfile } from "@/lib/api";
import { clearSession, updateStoredUser } from "@/lib/auth-store";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — SpendWise" }] }),
  component: Settings,
});

function Settings() {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true });
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SW";

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [profile, notifications] = await Promise.all([getProfile(), getNotifications()]);
        if (!active) return;
        setName(profile.name);
        setEmail(profile.email);
        setNotifs(notifications);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load profile");
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await updateProfile({ name, email });
      updateStoredUser(user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save profile");
    }
  };

  async function toggleNotification(key: "email" | "push" | "weekly") {
    const previous = notifs;
    const next = { ...previous, [key]: !previous[key] };
    setNotifs(next);
    try {
      const savedNotifications = await updateNotifications(next);
      setNotifs(savedNotifications);
      const user = await getProfile();
      updateStoredUser(user);
    } catch (toggleError) {
      setNotifs(previous);
      setError(toggleError instanceof Error ? toggleError.message : "Unable to save notification preference");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account, preferences, and security.</p>
      </div>

      <Section icon={User} title="Profile" desc="Your personal information">
        <form onSubmit={save} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-xl font-bold text-primary-foreground shadow-glow">
              {initials}
            </div>
            <button type="button" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
              Change photo
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value.slice(0, 60))} className="input" />
            </Field>
            <Field label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value.slice(0, 80))} className="input" />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
              Save changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success animate-fade-in">
                <Check className="h-3 w-3" /> Saved
              </span>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </Section>

      <Section icon={theme === "dark" ? Moon : Sun} title="Appearance" desc="Customize how SpendWise looks">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-muted-foreground">Easier on the eyes at night.</p>
          </div>
          <button
            onClick={toggle}
            className={`relative h-6 w-11 rounded-full transition ${theme === "dark" ? "bg-primary" : "bg-muted-foreground/30"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${theme === "dark" ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications" desc="Choose what you want to hear about">
        {[
          { key: "email", label: "Email summaries", desc: "Weekly recap of your spending." },
          { key: "push", label: "Push notifications", desc: "Instant alerts on big transactions." },
          { key: "weekly", label: "Budget warnings", desc: "Get notified when you near a limit." },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div>
              <p className="text-sm font-medium">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <button
              onClick={() => toggleNotification(n.key as "email" | "push" | "weekly")}
              className={`relative h-6 w-11 rounded-full transition ${notifs[n.key as keyof typeof notifs] ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${notifs[n.key as keyof typeof notifs] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </Section>

      <Section icon={Lock} title="Security" desc="Manage your password and sessions">
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="rounded-xl border border-border bg-card p-4 text-left hover:bg-muted">
            <p className="text-sm font-semibold">Change password</p>
            <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
          </button>
          <button className="rounded-xl border border-border bg-card p-4 text-left hover:bg-muted">
            <p className="text-sm font-semibold">Two-factor auth</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
          </button>
        </div>
      </Section>

      <button
        onClick={() => {
          clearSession();
          nav({ to: "/login" });
        }}
        className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
      <style>{`.input { width:100%; height:42px; padding:0 14px; border-radius:12px; border:1px solid var(--color-input); background:var(--color-background); font-size:14px; outline:none; transition:all .15s; } .input:focus { border-color:var(--color-ring); box-shadow:0 0 0 3px oklch(from var(--color-ring) l c h / 0.18); }`}</style>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
