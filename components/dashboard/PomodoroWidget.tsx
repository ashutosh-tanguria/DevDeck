"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Timer, ArrowRight, Play, Pause } from "lucide-react";
import { PomodoroState } from "@/types/pomodoro";
import { storage } from "@/lib/storage";
import { ROUTES } from "@/constants/routes";

function subscribe(callback: () => void) {
  return storage.subscribe("devdeck_pomodoro_state", callback);
}

function getPomodoroSnapshot(): PomodoroState | null {
  return storage.get<PomodoroState | null>("devdeck_pomodoro_state", null);
}

function subscribeSecond(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function useNow() {
  return useSyncExternalStore(subscribeSecond, () => Date.now(), () => 0);
}

export default function PomodoroWidget() {
  const state = useSyncExternalStore(subscribe, getPomodoroSnapshot, () => null);
  const now = useNow();

  const isRunning = Boolean(
    state?.isRunning && state.endTimestamp && now > 0 && state.endTimestamp > now
  );

  let remainingSeconds = state?.remainingSeconds ?? 25 * 60;
  if (isRunning && state?.endTimestamp && now > 0) {
    remainingSeconds = Math.max(0, Math.round((state.endTimestamp - now) / 1000));
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = state?.dailyHistory?.[todayStr] ?? 0;

  return (
    <Link
      href={ROUTES.POMODORO}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pomodoro
            </span>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-3xl font-black tracking-tight text-foreground">
              {timeFormatted}
            </p>
            <p className="mt-1 text-xs text-muted-foreground capitalize">
              {state?.mode ? `${state.mode.replace("Break", " break")} mode` : "Focus mode"}
            </p>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
              isRunning
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {isRunning ? <Play className="size-3 fill-current" /> : <Pause className="size-3" />}
            <span>{isRunning ? "Active" : "Idle"}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <span>
            <strong className="font-mono text-foreground font-semibold">{todayCount}</strong>{" "}
            {todayCount === 1 ? "session" : "sessions"} completed today
          </span>
        </div>
      </div>

      <div className="mt-4 pt-2 text-right">
        <span className="text-[11px] font-medium text-primary group-hover:underline">
          Open Timer →
        </span>
      </div>
    </Link>
  );
}
