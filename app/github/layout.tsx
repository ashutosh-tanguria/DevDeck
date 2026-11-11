import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Viewer",
  description: "Inspect developer profiles, repositories, languages and live activity.",
};

export default function GithubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
