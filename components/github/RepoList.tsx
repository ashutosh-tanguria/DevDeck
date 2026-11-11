"use client";

import { useState, useMemo } from "react";
import { GithubRepo } from "@/types/github";
import { Star, GitFork, Search, ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepoListProps {
  repos: GithubRepo[];
}

type SortOption = "stars" | "updated" | "name";

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

const PAGE_SIZE = 6;

export default function RepoList({ repos }: RepoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    for (const r of repos) {
      if (r.language) langs.add(r.language);
    }
    return Array.from(langs).sort();
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    let list = repos.slice();

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    if (selectedLanguage !== "all") {
      list = list.filter((r) => r.language === selectedLanguage);
    }

    list.sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return list;
  }, [repos, searchTerm, selectedLanguage, sortBy]);

  const visibleRepos = filteredAndSortedRepos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedRepos.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Repositories</h3>
          <p className="text-xs text-muted-foreground">
            {repos.length} public {repos.length === 1 ? "repository" : "repositories"}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search text */}
          <div className="relative min-w-[140px] flex-1 sm:w-44">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Find a repo..."
              className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs outline-none focus:border-foreground/30"
            />
          </div>

          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            aria-label="Filter by language"
            className="h-8 rounded-md border border-border bg-card px-2.5 text-xs text-foreground outline-none"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Sort order */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="size-3 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort repositories"
              className="h-8 rounded-md border border-border bg-card px-2.5 text-xs text-foreground outline-none"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {visibleRepos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-xs text-muted-foreground">No repositories match your current filters.</p>
          {(searchTerm || selectedLanguage !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedLanguage("all");
              }}
              className="mt-2 text-xs font-medium text-primary hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleRepos.map((repo) => (
            <div
              key={repo.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-semibold text-foreground hover:text-primary hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                  {repo.fork && (
                    <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      Fork
                    </span>
                  )}
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/50">
                {repo.language && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <span className="size-2 rounded-full bg-primary" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="size-3" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="size-3" />
                  {repo.forks_count}
                </span>
                <span className="ml-auto font-mono text-[10px]">
                  {formatRelativeTime(repo.updated_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-2 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Load more ({filteredAndSortedRepos.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
