"use client";

import Image from "next/image";
import { GithubUser } from "@/types/github";
import { Button } from "./button";

interface Props {
  user: GithubUser;
}

export default function ProfileCard({ user }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center gap-5">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={100}
          height={100}
          className="rounded-full"
        />

        <div>
          <h2 className="text-2xl font-bold">
            {user.name ?? user.login}
          </h2>

          <p className="text-zinc-400">
            @{user.login}
          </p>

          {user.bio && (
            <p className="mt-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-3xl font-bold">
            {user.followers}
          </p>

          <p className="text-zinc-400">
            Followers
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold">
            {user.following}
          </p>

          <p className="text-zinc-400">
            Following
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold">
            {user.public_repos}
          </p>

          <p className="text-zinc-400">
            Repositories
          </p>
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        onClick={() => window.open(
  user.html_url,
  "_blank",
  "noopener,noreferrer"
)}
      >
        Open GitHub
      </Button>
    </div>
  );
}