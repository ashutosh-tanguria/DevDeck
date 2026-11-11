"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2, ArrowRight } from "lucide-react";
import { fetchGithubUser } from "@/services/github.service";
import { GithubUser } from "@/types/github";
import { ROUTES } from "@/constants/routes";

interface GithubWidgetProps {
  username?: string;
}

export default function GithubWidget({ username }: GithubWidgetProps) {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(username));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      return;
    }

    let ignore = false;

    fetchGithubUser(username)
      .then((res) => {
        if (!ignore) {
          setUser(res.user);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load user");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [username]);

  return (
    <Link
      href={username ? `${ROUTES.GITHUB}?user=${encodeURIComponent(username)}` : ROUTES.GITHUB}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              GitHub Snapshot
            </span>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-3 animate-pulse">
            <div className="size-11 rounded-full bg-muted/50" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-24 rounded bg-muted/50" />
              <div className="h-2.5 w-16 rounded bg-muted/40" />
            </div>
          </div>
        ) : error || !username ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">
              {username ? "Profile unavailable" : "No username configured"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {username
                ? "Click to open GitHub viewer and retry."
                : "Set your GitHub username in Settings to view metrics here."}
            </p>
          </div>
        ) : user ? (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={40}
                height={40}
                className="rounded-full border border-border"
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {user.name || user.login}
                </p>
                <p className="font-mono text-xs text-muted-foreground">@{user.login}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-3 text-center">
              <div>
                <p className="font-mono text-base font-bold text-foreground">{user.public_repos}</p>
                <p className="text-[10px] text-muted-foreground">Repos</p>
              </div>
              <div>
                <p className="font-mono text-base font-bold text-foreground">{user.followers}</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-mono text-base font-bold text-foreground">{user.following}</p>
                <p className="text-[10px] text-muted-foreground">Following</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 pt-2 text-right">
        <span className="text-[11px] font-medium text-primary group-hover:underline">
          View GitHub Viewer →
        </span>
      </div>
    </Link>
  );
}
