import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — HireLens" },
      { name: "description", content: "Your HireLens workspace." },
      { property: "og:title", content: "Dashboard — HireLens" },
      { property: "og:description", content: "Your HireLens workspace." },
    ],
  }),
  component: Dashboard,
});

const steps = {
  candidate: ["Create account", "Upload your resume", "Get your AI resume score", "Apply to matched jobs"],
  recruiter: ["Create account", "Set up your company", "Post a job with AI analysis", "Review ranked applicants"],
  admin: ["Create account", "Review users", "Moderate job posts", "Monitor platform analytics"],
} as const;

function Dashboard() {
  const { user, primaryRole } = useAuth();
  const role = primaryRole ?? "candidate";
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{role} workspace</p>
      <h1 className="text-display mt-2 text-5xl font-bold">Hey {name}.</h1>
      <p className="mt-2 text-muted-foreground">Here's what's next for your account.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps[role].map((s, i) => (
          <div key={s} className="rounded-2xl border bg-card p-5 shadow-card">
            {i === 0 ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
            <p className="mt-4 font-mono text-xs text-muted-foreground">Step {i + 1}</p>
            <p className="mt-1 font-semibold">{s}</p>
            {i > 0 && <p className="mt-3 text-xs text-muted-foreground">Coming in the next phase</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
