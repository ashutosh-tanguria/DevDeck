"use client";

import Image from "next/image";
import { GithubUser } from "@/types/github";
import { Button } from "./button";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";

interface Props {
  user: GithubUser;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function ProfileCard({ user, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={80}
            height={80}
            className="rounded-full border border-border"
          />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {user.name ?? user.login}
              </h2>
            </div>

            <p className="font-mono text-xs text-muted-foreground">
              @{user.login}
            </p>

            {user.bio && (
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 max-w-md">
                {user.bio}
              </p>
            )}

            {user.location && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                📍 {user.location}
              </p>
            )}
          </div>
        </div>

        {onToggleFavorite && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Unpin profile" : "Pin profile"}
            className="self-start gap-1.5 text-xs"
          >
            {isFavorite ? (
              <>
                <BookmarkCheck className="size-3.5 text-primary" />
                <span>Pinned</span>
              </>
            ) : (
              <>
                <Bookmark className="size-3.5" />
                <span>Pin</span>
              </>
            )}
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-4 text-center">
        <div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {user.followers.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>

        <div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {user.following.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Following</p>
        </div>

        <div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {user.public_repos.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Repositories</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="w-full gap-2">
            <span>View GitHub Profile</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
