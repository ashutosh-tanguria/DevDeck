"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CommandPalette from "@/components/CommandPalette";
import { ROUTES } from "@/constants/routes";

export default function Navbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-xs md:px-6">
        <div className="flex items-center gap-3">
          <MobileSidebar />
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2 font-bold tracking-tight text-foreground"
          >
            <span className="text-lg">DevDeck</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search or open command palette"
            className="flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 text-xs text-muted-foreground transition hover:border-foreground/20 hover:bg-muted hover:text-foreground"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search or jump to...</span>
            <kbd className="hidden rounded border border-border bg-background px-1 py-0.2 text-[10px] font-mono sm:inline-block">
              Ctrl K
            </kbd>
          </button>

          <ThemeToggle />
        </div>
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
