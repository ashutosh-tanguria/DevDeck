"use client";

import { useState } from "react";
import { ProjectItem, ProjectColumn, COLUMNS } from "@/types/projects";
import { ExternalLink, GitBranch, MoreVertical, Edit2, Trash2, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
  onMove: (id: string, targetColumn: ProjectColumn) => void;
}

export default function ProjectCard({ project, onEdit, onDelete, onMove }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", project.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const otherColumns = COLUMNS.filter((c) => c.id !== project.column);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-2xs transition-all hover:border-foreground/20 cursor-grab active:cursor-grabbing"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground line-clamp-1">{project.title}</h4>

          {/* Context Action Menu for touch & keyboard users */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Project actions"
              className="inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MoreVertical className="size-3.5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-7 z-40 w-44 rounded-lg border border-border bg-card p-1 shadow-lg text-xs">
                  <div className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase">
                    Move to
                  </div>
                  {otherColumns.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onMove(project.id, col.id);
                      }}
                      className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-foreground hover:bg-muted"
                    >
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>{col.label}</span>
                    </button>
                  ))}

                  <div className="my-1 border-t border-border" />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(project);
                    }}
                    className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-foreground hover:bg-muted"
                  >
                    <Edit2 className="size-3 text-muted-foreground" />
                    <span>Edit details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(project);
                    }}
                    className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {project.description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        {project.techTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.techTags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
        <div className="flex items-center gap-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              title="View repository"
            >
              <GitBranch className="size-3" />
              <span>Repo</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
              title="View live demo"
            >
              <ExternalLink className="size-3" />
              <span>Live</span>
            </a>
          )}
        </div>

        <span className="text-[10px] text-muted-foreground font-mono">
          {new Date(project.updatedAt).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
