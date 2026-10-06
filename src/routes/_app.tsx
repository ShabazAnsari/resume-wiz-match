import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { session, loading, user, primaryRole, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col bg-sidebar p-5 text-sidebar-foreground md:flex">
        <Logo inverted />
        <nav className="mt-10 space-y-1 text-sm">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
          >
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
        </nav>
        <div className="mt-auto rounded-xl border border-sidebar-border p-3">
          <p className="truncate text-sm font-medium">{user?.email}</p>
          <p className="font-mono text-xs uppercase text-sidebar-primary">{primaryRole ?? "…"}</p>
          <button
            onClick={handleSignOut}
            className="mt-3 flex items-center gap-2 text-xs opacity-70 hover:opacity-100"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b px-6 py-4 md:hidden">
          <Logo />
          <button onClick={handleSignOut} aria-label="Sign out"><LogOut className="size-4" /></button>
        </header>
        <main className="mx-auto max-w-6xl p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
