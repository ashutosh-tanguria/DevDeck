import {
  GithubUser,
  GithubRepo,
  GithubEvent,
  GithubRateLimit,
  GithubProfileSummary,
} from "@/types/github";

interface ProxyResponse<T> {
  data: T;
  rateLimit?: GithubRateLimit;
  error?: string;
}

async function fetchFromProxy<T>(path: string): Promise<{ data: T; rateLimit: GithubRateLimit | null }> {
  const res = await fetch(`/api/github/${path}`);
  const json = (await res.json()) as ProxyResponse<T>;

  const rateLimit: GithubRateLimit | null = json.rateLimit ?? {
    limit: Number(res.headers.get("x-ratelimit-limit") ?? "60"),
    remaining: Number(res.headers.get("x-ratelimit-remaining") ?? "60"),
    reset: Number(res.headers.get("x-ratelimit-reset") ?? "0"),
  };

  if (!res.ok) {
    throw new Error(json.error || `GitHub request failed (${res.status})`);
  }

  return {
    data: json.data,
    rateLimit,
  };
}

export async function fetchGithubUser(
  username: string
): Promise<{ user: GithubUser; rateLimit: GithubRateLimit | null }> {
  const result = await fetchFromProxy<GithubUser>(`users/${encodeURIComponent(username)}`);
  return { user: result.data, rateLimit: result.rateLimit };
}

export async function fetchGithubRepos(
  username: string
): Promise<{ repos: GithubRepo[]; rateLimit: GithubRateLimit | null }> {
  const result = await fetchFromProxy<GithubRepo[]>(
    `users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  );
  return { repos: result.data ?? [], rateLimit: result.rateLimit };
}

export async function fetchGithubEvents(
  username: string
): Promise<{ events: GithubEvent[]; rateLimit: GithubRateLimit | null }> {
  const result = await fetchFromProxy<GithubEvent[]>(
    `users/${encodeURIComponent(username)}/events/public?per_page=30`
  );
  return { events: result.data ?? [], rateLimit: result.rateLimit };
}

export async function fetchGithubFullProfile(
  username: string
): Promise<GithubProfileSummary> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error("Please enter a GitHub username");
  }

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetchGithubUser(cleanUsername),
    fetchGithubRepos(cleanUsername).catch(() => ({ repos: [] as GithubRepo[], rateLimit: null })),
    fetchGithubEvents(cleanUsername).catch(() => ({ events: [] as GithubEvent[], rateLimit: null })),
  ]);

  return {
    user: userRes.user,
    repos: reposRes.repos,
    events: eventsRes.events.slice(0, 10),
    rateLimit: userRes.rateLimit || reposRes.rateLimit || eventsRes.rateLimit,
  };
}
