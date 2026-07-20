"use client";

import { useState } from "react";

import SearchBar from "@/components/ui/SearchBar";
import Spinner from "@/components/ui/Spinner";
import ProfileCard from "@/components/ui/ProfileCard";

import { GithubUser } from "@/types/github";
import { fetchGithubUser } from "@/services/github.service";

export default function GithubPage() {
  const [username, setUsername] = useState("");

  const [user, setUser] = useState<GithubUser | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSearch() {
    if (!username.trim()) return;

    try {
      setLoading(true);

      setError("");

      const data = await fetchGithubUser(username);

      setUser(data);
    } catch {
      setUser(null);

      setError("GitHub user not found.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">GitHub Profile Viewer</h1>

        <p className="mt-2 text-zinc-400">Search any public GitHub profile.</p>
      </div>

      <SearchBar
        username={username}
        setUsername={setUsername}
        onSearch={handleSearch}
        loading={loading}
      />

      {loading && <Spinner />}

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {user && <ProfileCard user={user} />}
    </div>
  );
}
