import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900 p-6">

      <h2 className="mb-8 text-xl font-bold text-blue-400">
        Navigation
      </h2>

      <nav className="flex flex-col gap-3">

        <Link
          href="/"
          className="rounded-lg px-3 py-2 transition hover:bg-zinc-800"
        >
          🏠 Home
        </Link>

        <Link
          href="/dashboard"
          className="rounded-lg px-3 py-2 transition hover:bg-zinc-800"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/github"
          className="rounded-lg px-3 py-2 transition hover:bg-zinc-800"
        >
          💻 GitHub
        </Link>

        <Link
          href="/settings"
          className="rounded-lg px-3 py-2 transition hover:bg-zinc-800"
        >
          ⚙️ Settings
        </Link>

      </nav>

    </aside>
  );
}