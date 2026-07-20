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
    <div className="flex gap-3">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
        placeholder="Enter GitHub username..."
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 outline-none focus:border-blue-500"
      />

      <Button onClick={onSearch} disabled={loading}>
        <Search className="mr-2 h-4 w-4" />

        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
}