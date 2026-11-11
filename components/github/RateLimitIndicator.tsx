"use client";

import { useSyncExternalStore } from "react";
import { GithubRateLimit } from "@/types/github";

interface RateLimitIndicatorProps {
  rateLimit: GithubRateLimit | null;
}

function subscribeMinute(callback: () => void) {
  const id = setInterval(callback, 30000);
  return () => clearInterval(id);
}

function useNow() {
  return useSyncExternalStore(subscribeMinute, () => Date.now(), () => 0);
}

export default function RateLimitIndicator({ rateLimit }: RateLimitIndicatorProps) {
  const now = useNow();

  if (!rateLimit) return null;

  const isLow = rateLimit.remaining < 10;
  const isExhausted = rateLimit.remaining === 0;

  const resetMinutes =
    rateLimit.reset && now > 0
      ? Math.max(0, Math.ceil((rateLimit.reset * 1000 - now) / (1000 * 60)))
      : null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs ${
        isExhausted
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : isLow
          ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
          : "border-border bg-muted/50 text-muted-foreground"
      }`}
      title="GitHub API rate limits apply to public unauthenticated requests (60/hr) or authenticated requests (5000/hr)"
    >
      <span
        className={`size-1.5 rounded-full ${
          isExhausted ? "bg-destructive" : isLow ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      <span>
        Rate limit: <strong className="font-mono">{rateLimit.remaining}</strong>/
        {rateLimit.limit} remaining
      </span>
      {resetMinutes !== null && resetMinutes > 0 && isLow && (
        <span className="text-[10px] opacity-80">(resets in {resetMinutes}m)</span>
      )}
    </div>
  );
}
