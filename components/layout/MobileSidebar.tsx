"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  LayoutDashboard,
  FolderGit2,
  CloudSun,
  Timer,
  FolderKanban,
  Settings,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-4">
        <SheetHeader className="p-2 pb-4">
          <SheetTitle className="text-left text-lg font-bold">
            Dev<span className="text-primary">Deck</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
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
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={17} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
