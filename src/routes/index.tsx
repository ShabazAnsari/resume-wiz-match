import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileSearch, Gauge, Sparkles, Users, BellRing, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/lib/auth";
import hero from "@/assets/hero-lens.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireLens — See exactly why you fit the job" },
      {
        name: "description",
        content: "AI resume scoring, resume-to-job matching and recruiter dashboards in one hiring platform.",
      },
      { property: "og:title", content: "HireLens — See exactly why you fit the job" },
      {
        property: "og:description",
        content: "AI resume scoring, 0–100 job matching and recruiter dashboards.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: FileSearch, title: "Resume parsing", body: "Upload PDF or DOCX. Skills, roles and experience extracted in seconds." },
  { icon: Sparkles, title: "AI feedback", body: "A score out of 100 with strengths, gaps and ATS-ready rewrites." },
  { icon: Gauge, title: "Match score", body: "Every job shows matched skills, missing skills and how to close the gap." },
  { icon: Users, title: "Recruiter pipeline", body: "Ranked applicants, one-click shortlisting and hiring analytics." },
  { icon: BellRing, title: "Live updates", body: "Instant in-app and email notifications when status changes." },
  { icon: ShieldCheck, title: "Role-based access", body: "Separate, secure workspaces for candidates, recruiters and admins." },
];

function Landing() {
  const { session } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          {session ? (
            <Button asChild variant="ink">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild variant="ink">
                <Link to="/auth" search={{ mode: "signup" }}>Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <section className="bg-grid border-y">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink bg-card px-3 py-1 font-mono text-xs uppercase tracking-wider">
              <span className="size-2 rounded-full bg-signal" /> AI hiring, explained
            </span>
            <h1 className="text-display mt-6 text-6xl font-bold sm:text-7xl lg:text-8xl">
              See exactly <span className="highlight-signal">why</span> you fit the job.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              HireLens reads your resume like a recruiter would, scores it against every role, and tells
              you what's missing. Recruiters get a ranked shortlist instead of a pile of PDFs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="signal" size="lg">
                <Link to="/auth" search={{ mode: "signup", role: "candidate" }}>
                  I'm looking for a job <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth" search={{ mode: "signup", role: "recruiter" }}>I'm hiring</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="A lens highlighting skills on a resume, connected to matching job cards"
              width={1280}
              height={1024}
              className="rounded-2xl border border-ink shadow-card"
            />
            <div className="absolute -bottom-6 -left-4 rounded-xl border border-ink bg-card p-4 shadow-lift sm:-left-8">
              <p className="font-mono text-xs uppercase text-muted-foreground">Match score</p>
              <p className="text-display text-5xl font-bold">87<span className="text-xl text-muted-foreground">/100</span></p>
              <div className="mt-2 flex gap-1">
                {["Django", "REST", "PostgreSQL"].map((s) => (
                  <span key={s} className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-display max-w-2xl text-4xl font-bold sm:text-5xl">
          One platform. Three workspaces. Zero guesswork.
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-card p-8">
              <Icon className="size-6" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <h2 className="text-display text-4xl font-bold">Stop guessing. Start matching.</h2>
          <Button asChild variant="signal" size="lg">
            <Link to="/auth" search={{ mode: "signup" }}>Create free account <ArrowRight /></Link>
          </Button>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
        <Logo className="text-base" />
        <span>© 2026 HireLens</span>
      </footer>
    </div>
  );
}
