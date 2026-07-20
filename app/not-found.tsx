import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center text-center">
      <h1 className="text-8xl font-black text-blue-500">404</h1>

      <h2 className="mt-4 text-4xl font-bold">Lost in Space</h2>

      <p className="mt-3 text-zinc-400">This page doesn't exist.</p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 transition hover:bg-blue-500"
      >
        Go Home
      </Link>
    </main>
  );
}
