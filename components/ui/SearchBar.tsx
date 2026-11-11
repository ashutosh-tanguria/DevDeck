"use client";

import { Search } from "lucide-react";
import { Button } from "./button";

interface SearchBarProps {
  username: string;
  setUsername: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({
  username,
  setUsername,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="flex gap-2"
    >
      <label htmlFor="github-search-input" className="sr-only">
        GitHub username
      </label>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="github-search-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username (e.g. torvalds, vercel)..."
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:ring-1 focus:ring-ring"
        />
      </div>

      <Button type="submit" disabled={loading} className="h-9 px-4">
        {loading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
