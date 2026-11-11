"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PomodoroMode, PomodoroState } from "@/types/pomodoro";
import { storage } from "@/lib/storage";
import { useSettings } from "@/lib/settings";
import { playNotificationChime, sendBrowserNotification } from "@/lib/audio";
import PomodoroHistoryChart from "@/components/pomodoro/PomodoroHistoryChart";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Bell, BellOff } from "lucide-react";

const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export default function PomodoroPage() {
  const { settings, updateSettings } = useSettings();

  const getDurationForMode = useCallback(
    (mode: PomodoroMode) => {
      switch (mode) {
        case "focus":
          return settings.pomodoroFocusMinutes * 60;
        case "shortBreak":
          return settings.pomodoroShortBreakMinutes * 60;
        case "longBreak":
          return settings.pomodoroLongBreakMinutes * 60;
      }
    },
    [settings.pomodoroFocusMinutes, settings.pomodoroShortBreakMinutes, settings.pomodoroLongBreakMinutes]
  );

  // Initialize from storage or default
  const [mode, setMode] = useState<PomodoroMode>(() => {
    const saved = storage.get<PomodoroState | null>("devdeck_pomodoro_state", null);
    return saved?.mode ?? "focus";
  });

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const saved = storage.get<PomodoroState | null>("devdeck_pomodoro_state", null);
    if (!saved || !saved.isRunning || !saved.endTimestamp) return false;
    return saved.endTimestamp > Date.now();
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    const saved = storage.get<PomodoroState | null>("devdeck_pomodoro_state", null);
    if (!saved) return settings.pomodoroFocusMinutes * 60;
    if (saved.isRunning && saved.endTimestamp) {
      const diff = Math.round((saved.endTimestamp - Date.now()) / 1000);
      return Math.max(0, diff);
    }
    return saved.remainingSeconds ?? settings.pomodoroFocusMinutes * 60;
  });

  const [endTimestamp, setEndTimestamp] = useState<number | null>(() => {
    const saved = storage.get<PomodoroState | null>("devdeck_pomodoro_state", null);
    return saved?.endTimestamp ?? null;
  });

  const [dailyHistory, setDailyHistory] = useState<Record<string, number>>(() => {
    const saved = storage.get<PomodoroState | null>("devdeck_pomodoro_state", null);
    return saved?.dailyHistory ?? {};
  });

  const modeRef = useRef(mode);
  const soundRef = useRef(settings.pomodoroSound);
  const notifRef = useRef(settings.pomodoroNotifications);

  useEffect(() => {
    modeRef.current = mode;
    soundRef.current = settings.pomodoroSound;
    notifRef.current = settings.pomodoroNotifications;
  }, [mode, settings.pomodoroSound, settings.pomodoroNotifications]);

  // Persist state
  const saveState = useCallback(
    (
      newMode: PomodoroMode,
      running: boolean,
      newRemaining: number,
      newEndTs: number | null,
      historyMap: Record<string, number>
    ) => {
      storage.set("devdeck_pomodoro_state", {
        mode: newMode,
        isRunning: running,
        remainingSeconds: newRemaining,
        endTimestamp: newEndTs,
        dailyHistory: historyMap,
      });
    },
    []
  );

  const handleSessionComplete = useCallback(
    (completedMode: PomodoroMode) => {
      let updatedHistory = dailyHistory;

      if (completedMode === "focus") {
        const todayStr = new Date().toISOString().slice(0, 10);
        updatedHistory = {
          ...dailyHistory,
          [todayStr]: (dailyHistory[todayStr] ?? 0) + 1,
        };
        setDailyHistory(updatedHistory);
      }

      if (soundRef.current) {
        playNotificationChime();
      }

      if (notifRef.current) {
        const message =
          completedMode === "focus"
            ? "Focus session finished. Take a well-earned break!"
            : "Break finished. Ready for the next focus sprint?";
        sendBrowserNotification("DevDeck Pomodoro", message);
      }

      // Transition to next mode
      const nextMode: PomodoroMode = completedMode === "focus" ? "shortBreak" : "focus";
      const nextDuration = getDurationForMode(nextMode);

      setMode(nextMode);
      setIsRunning(false);
      setEndTimestamp(null);
      setRemainingSeconds(nextDuration);

      saveState(nextMode, false, nextDuration, null, updatedHistory);
    },
    [dailyHistory, getDurationForMode, saveState]
  );

  // Background-accurate ticker based on Date.now()
  useEffect(() => {
    if (!isRunning || !endTimestamp) return;

    const interval = setInterval(() => {
      const diffSeconds = Math.round((endTimestamp - Date.now()) / 1000);

      if (diffSeconds <= 0) {
        clearInterval(interval);
        handleSessionComplete(modeRef.current);
      } else {
        setRemainingSeconds(diffSeconds);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, endTimestamp, handleSessionComplete]);

  // Document title updater
  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (isRunning) {
      document.title = `(${formatted}) ${MODE_LABELS[mode]} | DevDeck`;
    } else {
      document.title = "Pomodoro | DevDeck";
    }

    return () => {
      document.title = "DevDeck - Developer Dashboard";
    };
  }, [isRunning, remainingSeconds, mode]);

  // Actions
  const handleStart = () => {
    const targetEnd = Date.now() + remainingSeconds * 1000;
    setIsRunning(true);
    setEndTimestamp(targetEnd);
    saveState(mode, true, remainingSeconds, targetEnd, dailyHistory);
  };

  const handlePause = () => {
    setIsRunning(false);
    setEndTimestamp(null);
    saveState(mode, false, remainingSeconds, null, dailyHistory);
  };

  const handleReset = useCallback(() => {
    const duration = getDurationForMode(mode);
    setIsRunning(false);
    setEndTimestamp(null);
    setRemainingSeconds(duration);
    saveState(mode, false, duration, null, dailyHistory);
  }, [getDurationForMode, mode, saveState, dailyHistory]);

  const handleSkip = () => {
    handleSessionComplete(mode);
  };

  const handleSwitchMode = (targetMode: PomodoroMode) => {
    const duration = getDurationForMode(targetMode);
    setMode(targetMode);
    setIsRunning(false);
    setEndTimestamp(null);
    setRemainingSeconds(duration);
    saveState(targetMode, false, duration, null, dailyHistory);
  };

  // Keyboard shortcuts (Space = start/pause, R = reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const toggleSound = () => {
    const next = !settings.pomodoroSound;
    updateSettings({ pomodoroSound: next });
    if (next) playNotificationChime();
  };

  const toggleNotifications = async () => {
    if (!settings.pomodoroNotifications) {
      if ("Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          updateSettings({ pomodoroNotifications: true });
        }
      }
    } else {
      updateSettings({ pomodoroNotifications: false });
    }
  };

  const totalModeDuration = useMemo(
    () => getDurationForMode(mode),
    [getDurationForMode, mode]
  );
  const progressRatio = Math.max(0, Math.min(1, remainingSeconds / totalModeDuration));
  const strokeDashoffset = 565.48 * (1 - progressRatio);

  const minutesDisplay = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const secondsDisplay = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pomodoro Timer</h1>
          <p className="text-xs text-muted-foreground">
            Timestamp-synchronized intervals with focus session tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            aria-label={settings.pomodoroSound ? "Disable sound chime" : "Enable sound chime"}
            className="gap-1.5 text-xs"
          >
            {settings.pomodoroSound ? (
              <>
                <Volume2 className="size-3.5 text-primary" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="size-3.5 text-muted-foreground" />
                <span>Sound Off</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleNotifications}
            aria-label={
              settings.pomodoroNotifications
                ? "Disable browser notifications"
                : "Enable browser notifications"
            }
            className="gap-1.5 text-xs"
          >
            {settings.pomodoroNotifications ? (
              <>
                <Bell className="size-3.5 text-primary" />
                <span>Alerts On</span>
              </>
            ) : (
              <>
                <BellOff className="size-3.5 text-muted-foreground" />
                <span>Alerts Off</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Timer Display */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center">
          {/* Mode Selector Tabs */}
          <div
            className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1"
            role="tablist"
          >
            {(["focus", "shortBreak", "longBreak"] as PomodoroMode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => handleSwitchMode(m)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Circular Timer Ring */}
          <div className="relative my-8 flex items-center justify-center">
            <svg className="size-64 -rotate-90 transform" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-muted"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-primary transition-all duration-300"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span
                aria-live="polite"
                className="font-mono text-5xl font-black tracking-tight text-foreground"
              >
                {minutesDisplay}:{secondsDisplay}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {MODE_LABELS[mode]}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {isRunning ? (
              <Button onClick={handlePause} size="lg" className="w-28 gap-2">
                <Pause className="size-4" />
                <span>Pause</span>
              </Button>
            ) : (
              <Button onClick={handleStart} size="lg" className="w-28 gap-2">
                <Play className="size-4 fill-current" />
                <span>Start</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              aria-label="Reset timer (R)"
              title="Reset timer (R)"
            >
              <RotateCcw className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              aria-label="Skip session"
              title="Skip to next session"
            >
              <SkipForward className="size-4" />
            </Button>
          </div>

          <p className="mt-6 text-[11px] text-muted-foreground font-mono">
            Shortcuts: <kbd className="rounded border border-border px-1">Space</kbd> Start/Pause •{" "}
            <kbd className="rounded border border-border px-1">R</kbd> Reset
          </p>
        </div>

        {/* 7-day History Chart */}
        <div>
          <PomodoroHistoryChart dailyHistory={dailyHistory} />
        </div>
      </div>
    </div>
  );
}
