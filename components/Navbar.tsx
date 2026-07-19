export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-8">

      <h1 className="text-2xl font-bold tracking-wide text-blue-400">
          DevDeck
      </h1>

      <div className="flex gap-4">

        <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 transition hover:bg-zinc-700">
          Search
        </button>

        <button className="rounded-lg bg-blue-600 px-4 py-2 transition hover:bg-blue-500">
          Login
        </button>

      </div>
    </nav>
  );
}