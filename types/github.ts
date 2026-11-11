export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username?: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  homepage: string | null;
  topics?: string[];
  open_issues_count?: number;
}

export interface GithubEventPayload {
  action?: string;
  ref?: string;
  ref_type?: string;
  description?: string;
  commits?: Array<{
    sha: string;
    message: string;
  }>;
  issue?: {
    number: number;
    title: string;
    html_url: string;
  };
  pull_request?: {
    number: number;
    title: string;
    html_url: string;
  };
}

export interface GithubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: GithubEventPayload;
  created_at: string;
}

export interface GithubRateLimit {
  limit: number;
  remaining: number;
  reset: number; // unix timestamp in seconds
}

export interface GithubProfileSummary {
  user: GithubUser;
  repos: GithubRepo[];
  events: GithubEvent[];
  rateLimit: GithubRateLimit | null;
}
