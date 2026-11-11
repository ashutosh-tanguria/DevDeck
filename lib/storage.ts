export type StorageKey =
  | "devdeck_settings"
  | "devdeck_github_history"
  | "devdeck_github_favorites"
  | "devdeck_pomodoro_state"
  | "devdeck_projects"
  | "devdeck_weather_last";

const STORAGE_EVENT = "devdeck_storage_change";

export const storage = {
  get<T>(key: StorageKey, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: StorageKey, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
    } catch {
      // Storage quota or private browsing restriction
    }
  },

  remove(key: StorageKey): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
    } catch {
      // Ignore
    }
  },

  clearAll(): void {
    if (typeof window === "undefined") return;
    try {
      const keysToRemove: StorageKey[] = [
        "devdeck_settings",
        "devdeck_github_history",
        "devdeck_github_favorites",
        "devdeck_pomodoro_state",
        "devdeck_projects",
        "devdeck_weather_last",
      ];
      for (const k of keysToRemove) {
        window.localStorage.removeItem(k);
      }
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key: "all" } }));
    } catch {
      // Ignore
    }
  },

  subscribe(key: StorageKey | "all", callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      if (key === "all" || customEvent.detail?.key === key || customEvent.detail?.key === "all") {
        callback();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (key === "all" || e.key === key) {
        callback();
      }
    };

    window.addEventListener(STORAGE_EVENT, handleCustom);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  },
};
