"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { FolderKanban, ArrowRight } from "lucide-react";
import { ProjectItem, INITIAL_PROJECTS } from "@/types/projects";
import { storage } from "@/lib/storage";
import { ROUTES } from "@/constants/routes";

function subscribe(callback: () => void) {
  return storage.subscribe("devdeck_projects", callback);
}

function getProjectsSnapshot(): ProjectItem[] {
  return storage.get<ProjectItem[]>("devdeck_projects", INITIAL_PROJECTS);
}

export default function ProjectsWidget() {
  const projects = useSyncExternalStore(subscribe, getProjectsSnapshot, () => INITIAL_PROJECTS);

  const planned = projects.filter((p) => p.column === "planned").length;
  const inProgress = projects.filter((p) => p.column === "in_progress").length;
  const done = projects.filter((p) => p.column === "done").length;

  const latestProject = projects.length > 0
    ? [...projects].sort((a, b) => b.updatedAt - a.updatedAt)[0]
    : null;

  return (
    <Link
      href={ROUTES.PROJECTS}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/25"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Projects Summary
            </span>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-2">
            <p className="font-mono text-xl font-bold text-foreground">{planned}</p>
            <p className="text-[10px] text-muted-foreground">Planned</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-2">
            <p className="font-mono text-xl font-bold text-foreground">{inProgress}</p>
            <p className="text-[10px] text-muted-foreground">In Progress</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-2">
            <p className="font-mono text-xl font-bold text-foreground">{done}</p>
            <p className="text-[10px] text-muted-foreground">Done</p>
          </div>
        </div>

        <div className="mt-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
          {latestProject ? (
            <p className="truncate">
              Recent: <strong className="text-foreground font-medium">{latestProject.title}</strong>
            </p>
          ) : (
            <p>No active projects yet.</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-2 text-right">
        <span className="text-[11px] font-medium text-primary group-hover:underline">
          Open Tracker →
        </span>
      </div>
    </Link>
  );
}
