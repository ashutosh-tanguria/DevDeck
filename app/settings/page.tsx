"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useSettings } from "@/lib/settings";
import { storage } from "@/lib/storage";
import ClearDataModal from "@/components/settings/ClearDataModal";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop, Check, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const triggerFeedback = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
    triggerFeedback();
  };

  const handleClearAll = () => {
    storage.clearAll();
    resetSettings();
    setTheme("system");
    triggerFeedback();
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">
            Manage your preferences, telemetry endpoints and local storage.
          </p>
        </div>

        {savedFeedback && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500 font-medium animate-fade-in">
            <Check className="size-3.5" />
            <span>Preferences saved</span>
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select how DevDeck looks on your device.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-foreground font-semibold"
                  : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <Sun className="size-4" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-foreground font-semibold"
                  : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <Moon className="size-4" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-foreground font-semibold"
                  : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <Laptop className="size-4" />
              <span>System</span>
            </button>
          </div>
        </section>

        {/* GitHub Section */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">GitHub Integration</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Default handle used for your dashboard snapshot and quick search.
          </p>

          <div className="mt-4">
            <label htmlFor="settings-gh-username" className="block text-xs font-medium text-foreground">
              Default GitHub Username
            </label>
            <input
              id="settings-gh-username"
              value={settings.defaultGithubUsername}
              onChange={(e) => {
                updateSettings({ defaultGithubUsername: e.target.value });
                triggerFeedback();
              }}
              placeholder="e.g. ashutosh-tanguria"
              className="mt-1 h-9 w-full max-w-sm rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-foreground/40 font-mono"
            />
          </div>
        </section>

        {/* Weather Preferences */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Weather Preferences</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set your preferred units and default forecast location.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-weather-city" className="block text-xs font-medium text-foreground">
                Default City
              </label>
              <input
                id="settings-weather-city"
                value={settings.defaultWeatherCity}
                onChange={(e) => {
                  updateSettings({ defaultWeatherCity: e.target.value });
                  triggerFeedback();
                }}
                placeholder="e.g. London"
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-foreground/40"
              />
            </div>

            <div>
              <label htmlFor="settings-weather-units" className="block text-xs font-medium text-foreground">
                Temperature Units
              </label>
              <select
                id="settings-weather-units"
                value={settings.weatherUnits}
                onChange={(e) => {
                  updateSettings({ weatherUnits: e.target.value as "celsius" | "fahrenheit" });
                  triggerFeedback();
                }}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Pomodoro Durations */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Pomodoro Durations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure interval lengths in minutes.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="settings-pom-focus" className="block text-xs font-medium text-foreground">
                Focus (min)
              </label>
              <input
                id="settings-pom-focus"
                type="number"
                min={1}
                max={90}
                value={settings.pomodoroFocusMinutes}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 25);
                  updateSettings({ pomodoroFocusMinutes: val });
                  triggerFeedback();
                }}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-mono outline-none focus:border-foreground/40"
              />
            </div>

            <div>
              <label htmlFor="settings-pom-short" className="block text-xs font-medium text-foreground">
                Short Break (min)
              </label>
              <input
                id="settings-pom-short"
                type="number"
                min={1}
                max={30}
                value={settings.pomodoroShortBreakMinutes}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 5);
                  updateSettings({ pomodoroShortBreakMinutes: val });
                  triggerFeedback();
                }}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-mono outline-none focus:border-foreground/40"
              />
            </div>

            <div>
              <label htmlFor="settings-pom-long" className="block text-xs font-medium text-foreground">
                Long Break (min)
              </label>
              <input
                id="settings-pom-long"
                type="number"
                min={1}
                max={60}
                value={settings.pomodoroLongBreakMinutes}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 15);
                  updateSettings({ pomodoroLongBreakMinutes: val });
                  triggerFeedback();
                }}
                className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs font-mono outline-none focus:border-foreground/40"
              />
            </div>
          </div>
        </section>

        {/* Data Reset */}
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-destructive">Data Management</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                All data resides strictly in your browser storage. You can purge everything anytime.
              </p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setClearModalOpen(true)}
              className="gap-1.5 text-xs shrink-0"
            >
              <Trash2 className="size-3.5" />
              <span>Clear All Data</span>
            </Button>
          </div>
        </section>
      </div>

      <ClearDataModal
        open={clearModalOpen}
        onOpenChange={setClearModalOpen}
        onConfirm={handleClearAll}
      />
    </div>
  );
}
