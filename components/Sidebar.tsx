"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  FolderGit2,
  CloudSun,
  Timer,
  FolderKanban,
  Settings,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

const links = [
  { name: "Home", href: ROUTES.HOME, icon: Home },
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "GitHub", href: ROUTES.GITHUB, icon: FolderGit2 },
  { name: "Weather", href: ROUTES.WEATHER, icon: CloudSun },
  { name: "Pomodoro", href: ROUTES.POMODORO, icon: Timer },
  { name: "Projects", href: ROUTES.PROJECTS, icon: FolderKanban },
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card p-4 md:block">
      <div className="mb-6 px-3 py-1">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Dev<span className="text-primary">Deck</span>
          </span>
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            v0.1
          </span>
        </Link>
      </div>

      <nav className="space-y-1" aria-label="Main Navigation">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary text-primary-foreground font-medium shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
