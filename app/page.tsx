import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-black">
        Welcome to <span className="text-blue-500">DevDeck</span>
      </h1>

      <p className="mt-5 max-w-xl text-lg text-zinc-400">
        Your personal developer dashboard built with Next.js, TypeScript and
        Tailwind CSS.
      </p>

      <div className="mt-10 flex gap-4">
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>

        <Link href="/github">
          <Button variant="outline">GitHub Viewer</Button>
        </Link>
      </div>
    </div>
  );
}
