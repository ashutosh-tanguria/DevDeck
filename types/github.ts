export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;

  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string;

  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
}
