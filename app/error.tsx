"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-5">
      <h1 className="text-5xl font-black">Oops!</h1>

      <p className="text-zinc-400">{error.message}</p>

      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
