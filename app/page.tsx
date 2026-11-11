import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  CloudSun,
  Timer,
  FolderKanban,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl py-6 md:py-12 space-y-12">
      {/* Hero */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground font-mono">
          <span>v0.1.0</span>
          <span>•</span>
          <span>Next.js 16 + React 19</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          DevDeck
        </h1>

        <p className="mx-auto max-w-xl text-sm md:text-base text-muted-foreground">
          A personal developer workspace for inspecting GitHub telemetry, tracking local weather, running drift-free focus sessions, and organizing projects.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={ROUTES.DASHBOARD}>
            <Button size="lg" className="gap-2">
              <LayoutDashboard className="size-4" />
              <span>Open Dashboard</span>
            </Button>
          </Link>

          <Link href={ROUTES.GITHUB}>
            <Button variant="outline" size="lg" className="gap-2">
              <FolderGit2 className="size-4" />
              <span>GitHub Viewer</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={ROUTES.GITHUB}
          className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <FolderGit2 className="size-5 text-primary" />
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-foreground">GitHub Profile & Repos</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Search developer accounts, inspect repository metrics, analyze language breakdowns, and review public event streams with rate limit indicators.
          </p>
        </Link>

        <Link
          href={ROUTES.WEATHER}
          className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <CloudSun className="size-5 text-primary" />
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-foreground">Weather Telemetry</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Current conditions, 12-hour hourly trends, and 5-day forecasts via Open-Meteo with city geocoding and browser geolocation support.
          </p>
        </Link>

        <Link
          href={ROUTES.POMODORO}
          className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <Timer className="size-5 text-primary" />
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-foreground">Drift-Free Pomodoro</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Timestamp-synchronized countdown intervals that remain accurate in background tabs, complete with a 7-day productivity history chart.
          </p>
        </Link>

        <Link
          href={ROUTES.PROJECTS}
          className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <FolderKanban className="size-5 text-primary" />
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-foreground">Projects Tracker</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Three-column Kanban board featuring HTML5 drag-and-drop, full touch and keyboard navigation menus, and JSON export/import.
          </p>
        </Link>
      </div>
    </div>
  );
}
