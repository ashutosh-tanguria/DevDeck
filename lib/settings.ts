"use client";

import { useSyncExternalStore, useCallback } from "react";
import { storage } from "./storage";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  defaultGithubUsername: string;
  weatherUnits: "celsius" | "fahrenheit";
  defaultWeatherCity: string;
  defaultWeatherLat: number | null;
  defaultWeatherLon: number | null;
  pomodoroFocusMinutes: number;
  pomodoroShortBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
  pomodoroSound: boolean;
  pomodoroNotifications: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  defaultGithubUsername: "",
  weatherUnits: "celsius",
  defaultWeatherCity: "London",
  defaultWeatherLat: 51.5074,
  defaultWeatherLon: -0.1278,
  pomodoroFocusMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
  pomodoroSound: false,
  pomodoroNotifications: false,
};

let cachedSettings: AppSettings = DEFAULT_SETTINGS;
let cachedRaw: string | null = null;

function getSnapshot(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const raw = window.localStorage.getItem("devdeck_settings");
  if (raw === cachedRaw && cachedSettings) {
    return cachedSettings;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedSettings = DEFAULT_SETTINGS;
    return cachedSettings;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    cachedSettings = { ...DEFAULT_SETTINGS, ...parsed };
    return cachedSettings;
  } catch {
    cachedSettings = DEFAULT_SETTINGS;
    return cachedSettings;
  }
}

function getServerSnapshot(): AppSettings {
  return DEFAULT_SETTINGS;
}

function subscribe(callback: () => void): () => void {
  return storage.subscribe("devdeck_settings", callback);
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    const current = getSnapshot();
    const updated = { ...current, ...partial };
    storage.set("devdeck_settings", updated);
  }, []);

  const resetSettings = useCallback(() => {
    storage.set("devdeck_settings", DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSettings, resetSettings };
}

export function getStoredSettings(): AppSettings {
  return storage.get<AppSettings>("devdeck_settings", DEFAULT_SETTINGS);
}
