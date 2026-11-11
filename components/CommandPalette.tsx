"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import {
  Home,
  LayoutDashboard,
  FolderGit2,
  CloudSun,
  Timer,
  FolderKanban,
  Settings,
  Search,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: typeof Home;
  action: () => void;
  category: "Navigation" | "Actions";
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        label: "Dashboard",
        description: "Overview and personal widgets",
        icon: LayoutDashboard,
        category: "Navigation",
        action: () => router.push(ROUTES.DASHBOARD),
      },
      {
        id: "nav-github",
        label: "GitHub Viewer",
        description: "Inspect repositories, activity and metrics",
        icon: FolderGit2,
        category: "Navigation",
        action: () => router.push(ROUTES.GITHUB),
      },
      {
        id: "nav-weather",
        label: "Weather",
        description: "Current conditions and forecasts",
        icon: CloudSun,
        category: "Navigation",
        action: () => router.push(ROUTES.WEATHER),
      },
      {
        id: "nav-pomodoro",
        label: "Pomodoro Timer",
        description: "Focus sessions and productivity stats",
        icon: Timer,
        category: "Navigation",
        action: () => router.push(ROUTES.POMODORO),
      },
      {
        id: "nav-projects",
        label: "Projects Tracker",
        description: "Manage planned, active and completed tasks",
        icon: FolderKanban,
        category: "Navigation",
        action: () => router.push(ROUTES.PROJECTS),
      },
      {
        id: "nav-settings",
        label: "Settings",
        description: "Preferences, units and data management",
        icon: Settings,
        category: "Navigation",
        action: () => router.push(ROUTES.SETTINGS),
      },
      {
        id: "nav-home",
        label: "Home",
        description: "Landing page",
        icon: Home,
        category: "Navigation",
        action: () => router.push(ROUTES.HOME),
      },
    ],
    [router]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    // Direct GitHub search shortcut: if query starts with "gh " or "github "
    const isDirectGithub = q.startsWith("gh ") || q.startsWith("github ");
    const rawTarget = isDirectGithub ? q.replace(/^(gh|github)\s+/, "").trim() : q;

    const matched = items.filter(
      (item) =>
        item.label.toLowerCase().includes(rawTarget) ||
        (item.description && item.description.toLowerCase().includes(rawTarget))
    );

    if (rawTarget.length > 0) {
      matched.unshift({
        id: "action-github-search",
        label: `Search GitHub: "${rawTarget}"`,
        description: "Open profile in GitHub viewer",
        icon: Search,
        category: "Actions",
        action: () => router.push(`${ROUTES.GITHUB}?user=${encodeURIComponent(rawTarget)}`),
      });
    }

    return matched;
  }, [items, query, router]);



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (item: CommandItem) => {
    onOpenChange(false);
    setQuery("");
    item.action();
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-[20%] left-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 rounded-xl border border-border bg-card p-0 shadow-2xl transition duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 focus:outline-none">
          <div className="flex items-center border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleDialogKeyDown}
              placeholder="Type a command or search (e.g. 'github', 'weather')..."
              className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>

          <div className="max-h-72 overflow-y-auto p-2" role="listbox">
            {filteredItems.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">No matching commands.</p>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <div className="truncate">
                        <span className="font-medium">{item.label}</span>
                        {item.description && (
                          <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-60" />
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            <span>Navigate: ↑↓</span>
            <span>Select: ↵</span>
            <span>Tip: type &quot;gh username&quot; to inspect</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
