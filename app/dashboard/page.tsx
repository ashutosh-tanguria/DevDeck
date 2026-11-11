"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/settings";
import GithubWidget from "@/components/dashboard/GithubWidget";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import PomodoroWidget from "@/components/dashboard/PomodoroWidget";
import ProjectsWidget from "@/components/dashboard/ProjectsWidget";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const emptySubscribe = () => () => {};

export default function DashboardPage() {
  const { settings } = useSettings();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const greeting = mounted ? getTimeGreeting() : "Welcome";
  const userGreeting = settings.defaultGithubUsername
    ? `${greeting}, ${settings.defaultGithubUsername}`
    : greeting;

  const isConfigured = Boolean(
    settings.defaultGithubUsername ||
    settings.defaultWeatherCity !== "London"
  );

  return (
    <div className="space-y-6">
      {/* Time-of-day Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{userGreeting}</h1>
          <p className="text-xs text-muted-foreground">
            Workspace overview with live telemetry and productivity widgets.
          </p>
        </div>

        <Link href={ROUTES.SETTINGS}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <SettingsIcon className="size-3.5" />
            <span>Customize</span>
          </Button>
        </Link>
      </div>

      {/* Unconfigured Helper Banner */}
      {!isConfigured && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">Personalize your dashboard</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Set your default GitHub username and local weather city in Settings to unlock automated snapshots.
              </p>
            </div>
            <Link href={ROUTES.SETTINGS}>
              <Button size="sm" className="text-xs shrink-0">
                Configure in Settings
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 4 Live Widgets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <GithubWidget username={settings.defaultGithubUsername} />
        <WeatherWidget
          defaultCity={settings.defaultWeatherCity}
          defaultLat={settings.defaultWeatherLat}
          defaultLon={settings.defaultWeatherLon}
          units={settings.weatherUnits}
        />
        <PomodoroWidget />
        <ProjectsWidget />
      </div>
    </div>
  );
}
