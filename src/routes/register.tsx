import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { AuthShell, Divider, Input, SocialButtons } from "./login";
import { register } from "@/lib/api";
import { redirectIfAuthenticated } from "@/lib/auth-guards";
import { setSession } from "@/lib/auth-store";

export const Route = createFileRoute("/register")({
  beforeLoad: redirectIfAuthenticated,
  head: () => ({
    meta: [
      { title: "Create account — SpendWise" },
      { name: "description", content: "Create your free SpendWise account." },
    ],
  }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setErr("Enter your name");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email");
    if (pw.length < 8) return setErr("Password must be at least 8 characters");
    setErr("");
    setLoading(true);
    try {
      const response = await register({ name, email, password: pw });
      setSession(response.token, response.user);
      nav({ to: "/dashboard" });
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free for 14 days. No credit card required."
      footer={
        <p className="text-sm text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SocialButtons />
      <Divider />
      <form onSubmit={submit} className="space-y-4">
        <Input icon={User} type="text" placeholder="Full name" value={name} onChange={setName} />
        <Input icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
        <Input icon={Lock} type="password" placeholder="Create a password" value={pw} onChange={setPw} />
        <p className="text-xs text-muted-foreground">
          By signing up you agree to our <a className="underline" href="#">Terms</a> and{" "}
          <a className="underline" href="#">Privacy Policy</a>.
        </p>
        {err && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
        >
          {loading ? "Creating..." : "Create account"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}
