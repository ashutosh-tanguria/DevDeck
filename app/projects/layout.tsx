import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Kanban task tracker with HTML5 drag and drop, keyboard navigation, and JSON export.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
