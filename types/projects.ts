export type ProjectColumn = "planned" | "in_progress" | "done";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techTags: string[];
  repoUrl: string;
  liveUrl?: string;
  column: ProjectColumn;
  createdAt: number;
  updatedAt: number;
}

export const COLUMNS: Array<{ id: ProjectColumn; label: string }> = [
  { id: "planned", label: "Planned" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "devdeck-core",
    title: "DevDeck Developer Dashboard",
    description: "Modular personal developer dashboard featuring GitHub inspection, weather, and focus tools.",
    techTags: ["Next.js", "TypeScript", "Tailwind CSS"],
    repoUrl: "https://github.com/ashutosh-tanguria/DevDeck---FE-only",
    column: "in_progress",
    createdAt: 1721400000000,
    updatedAt: 1721400000000,
  },
];
