import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 font-display text-xl font-bold", className)}>
      <span
        className={cn(
          "grid size-7 place-items-center rounded-full border-2",
          inverted ? "border-ink-foreground" : "border-ink",
        )}
      >
        <span className="size-3 rounded-full bg-signal" />
      </span>
      HireLens
    </Link>
  );
}
