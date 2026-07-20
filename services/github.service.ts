import { GithubUser } from "@/types/github";

export async function fetchGithubUser(username: string): Promise<GithubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    throw new Error("GitHub user not found");
  }

  return response.json();
}
