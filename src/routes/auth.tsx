import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  role: z.enum(["candidate", "recruiter"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — HireLens" },
      { name: "description", content: "Sign in or create your HireLens candidate or recruiter account." },
      { property: "og:title", content: "Sign in — HireLens" },
      { property: "og:description", content: "Access your HireLens workspace." },
    ],
  }),
  component: AuthPage,
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});
const signInSchema = signUpSchema.pick({ email: true, password: true });

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [role, setRole] = useState<"candidate" | "recruiter">(search.role ?? "candidate");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = (mode === "signup" ? signUpSchema : signInSchema).safeParse(fd);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      if (mode === "signup") {
        const d = parsed.data as z.infer<typeof signUpSchema>;
        const { data, error } = await supabase.auth.signUp({
          email: d.email,
          password: d.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: d.fullName, role },
          },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-10 text-ink-foreground lg:flex">
        <Logo inverted />
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-signal">Resume → Match → Hire</p>
          <h2 className="text-display mt-4 text-6xl font-bold">Your career, read with a lens.</h2>
        </div>
        <p className="text-sm opacity-60">Secure role-based workspaces for candidates and recruiters.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden"><Logo /></div>
          <h1 className="mt-8 text-3xl font-bold lg:mt-0">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup" ? "Pick how you'll use HireLens." : "Sign in to your workspace."}
          </p>

          {mode === "signup" && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {([
                ["candidate", "Job seeker", GraduationCap],
                ["recruiter", "Recruiter", Briefcase],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition",
                    role === value ? "border-ink bg-accent shadow-lift" : "hover:border-ink/40",
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              ))}
            </div>
          )}

          <Button variant="outline" className="mt-6 w-full" type="button" onClick={google}>
            Continue with Google
          </Button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {mode === "signup" && (
              <Field name="fullName" label="Full name" error={errors["fullName"]} autoComplete="name" />
            )}
            <Field name="email" label="Email" type="email" error={errors["email"]} autoComplete="email" />
            <Field
              name="password"
              label="Password"
              type="password"
              error={errors["password"]}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            <Button type="submit" variant="ink" className="w-full" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to HireLens?"}{" "}
            <button
              className="font-semibold text-foreground underline underline-offset-4"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ name, label, error, ...rest }: { name: string; label: string; error?: string | undefined } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} aria-invalid={!!error} {...rest} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
