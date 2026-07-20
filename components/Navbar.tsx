import { Bell, Search, UserCircle2 } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import MobileSidebar from "@/components/layout/MobileSidebar";

export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-8">
      <div className="flex items-center gap-4">
        <MobileSidebar />

        <h1 className="text-3xl font-black">
          <span className="text-blue-500">Dev</span>
          <span>Deck</span>
        </h1>
      </div>

      <h1 className="text-3xl font-black tracking-tight">
        <span className="text-blue-500">Dev</span>

        <span className="text-white">Deck</span>
      </h1>

      <div className="flex items-center gap-4">
        <Search
          size={20}
          className="cursor-pointer text-zinc-400 transition hover:text-white"
        />

        <Bell
          size={20}
          className="cursor-pointer text-zinc-400 transition hover:text-white"
        />

        <ThemeToggle />

        <Button variant="outline">Login</Button>

        <UserCircle2 size={30} className="cursor-pointer text-blue-400" />
      </div>
    </nav>
  );
}
