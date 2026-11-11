"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import ProfileCard from "@/components/ui/ProfileCard";
import LanguageBreakdown from "@/components/github/LanguageBreakdown";
import RecentActivity from "@/components/github/RecentActivity";
import RepoList from "@/components/github/RepoList";
import RateLimitIndicator from "@/components/github/RateLimitIndicator";
import { GithubProfileSummary } from "@/types/github";
import { fetchGithubFullProfile } from "@/services/github.service";
import { storage } from "@/lib/storage";
import { useSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { History, Bookmark, RefreshCw } from "lucide-react";

function GithubViewerContent() {
  const searchParams = useSearchParams();
  const urlUser = searchParams.get("user") || searchParams.get("q") || "";

  const { settings } = useSettings();
  const [username, setUsername] = useState(urlUser || settings.defaultGithubUsername || "");
  const [profile, setProfile] = useState<GithubProfileSummary | null>(null);
  const [loading, setLoading] = useState(() => Boolean(urlUser || settings.defaultGithubUsername));
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<string[]>(() =>
    storage.get<string[]>("devdeck_github_history", [])
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    storage.get<string[]>("devdeck_github_favorites", [])
  );

  const hasSearchedInitialRef = useRef(false);

  const executeSearch = useCallback(async (targetUser: string) => {
    const trimmed = targetUser.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchGithubFullProfile(trimmed);
      setProfile(data);

      setHistory((prev) => {
        const next = [
          data.user.login,
          ...prev.filter((u) => u.toLowerCase() !== data.user.login.toLowerCase()),
        ].slice(0, 8);
        storage.set("devdeck_github_history", next);
        return next;
      });
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : "Failed to load GitHub profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasSearchedInitialRef.current) return;
    const initialTarget = urlUser || settings.defaultGithubUsername;
    if (initialTarget) {
      hasSearchedInitialRef.current = true;
      let cancelled = false;

      fetchGithubFullProfile(initialTarget)
        .then((data) => {
          if (!cancelled) {
            setProfile(data);
            setLoading(false);
            setHistory((prev) => {
              const next = [
                data.user.login,
                ...prev.filter((u) => u.toLowerCase() !== data.user.login.toLowerCase()),
              ].slice(0, 8);
              storage.set("devdeck_github_history", next);
              return next;
            });
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : "Failed to load GitHub profile");
            setLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    }
  }, [urlUser, settings.defaultGithubUsername]);

  const toggleFavorite = (login: string) => {
    setFavorites((prev) => {
      const exists = prev.some((u) => u.toLowerCase() === login.toLowerCase());
      const next = exists
        ? prev.filter((u) => u.toLowerCase() !== login.toLowerCase())
        : [...prev, login];
      storage.set("devdeck_github_favorites", next);
      return next;
    });
  };

  const isFavorite = profile
    ? favorites.some((u) => u.toLowerCase() === profile.user.login.toLowerCase())
    : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">GitHub Viewer</h1>
          <p className="text-xs text-muted-foreground">
            Explore developer profiles, repositories, language usage and live activity.
          </p>
        </div>
        <RateLimitIndicator rateLimit={profile?.rateLimit ?? null} />
      </div>

      <div className="space-y-2">
        <SearchBar
          username={username}
          setUsername={setUsername}
          onSearch={() => executeSearch(username)}
          loading={loading}
        />

        {(favorites.length > 0 || history.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            {favorites.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mr-2">
                <Bookmark className="size-3 text-primary" />
                <span className="text-[11px] font-medium text-muted-foreground">Pinned:</span>
                {favorites.map((user) => (
                  <button
                    key={`fav-${user}`}
                    type="button"
                    onClick={() => {
                      setUsername(user);
                      executeSearch(user);
                    }}
                    className="rounded border border-border bg-card px-2 py-0.5 text-[11px] text-foreground hover:bg-muted transition-colors font-mono"
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <History className="size-3 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">Recent:</span>
                {history.map((user) => (
                  <button
                    key={`hist-${user}`}
                    type="button"
                    onClick={() => {
                      setUsername(user);
                      executeSearch(user);
                    }}
                    className="rounded border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-mono"
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading profile">
          <div className="h-44 rounded-xl border border-border bg-muted/30" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-48 rounded-xl border border-border bg-muted/30" />
            <div className="h-48 rounded-xl border border-border bg-muted/30" />
          </div>
          <div className="h-64 rounded-xl border border-border bg-muted/30" />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Unable to fetch profile</p>
              <p className="mt-1 text-xs opacity-90">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeSearch(username)}
              className="gap-1.5 text-xs border-destructive/30"
            >
              <RefreshCw className="size-3" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && !profile && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium text-foreground">No GitHub profile selected</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Search for a username above or configure a default profile in Settings.
          </p>
        </div>
      )}

      {!loading && profile && (
        <div className="space-y-6">
          <ProfileCard
            user={profile.user}
            isFavorite={isFavorite}
            onToggleFavorite={() => toggleFavorite(profile.user.login)}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <LanguageBreakdown repos={profile.repos} />
            <RecentActivity events={profile.events} />
          </div>

          <RepoList repos={profile.repos} />
        </div>
      )}
    </div>
  );
}

export default function GithubPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-muted/30" />
          <div className="h-10 rounded-lg bg-muted/30" />
        </div>
      }
    >
      <GithubViewerContent />
    </Suspense>
  );
}
