"use client";

import { useState, useRef } from "react";
import { ProjectItem, ProjectColumn, COLUMNS, INITIAL_PROJECTS } from "@/types/projects";
import { storage } from "@/lib/storage";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import DeleteConfirmModal from "@/components/projects/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    storage.get<ProjectItem[]>("devdeck_projects", INITIAL_PROJECTS)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const saveProjects = (nextList: ProjectItem[]) => {
    setProjects(nextList);
    storage.set("devdeck_projects", nextList);
  };

  const handleCreateOrEdit = (
    data: Omit<ProjectItem, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    const now = Date.now();
    if (data.id) {
      // Edit
      const updated = projects.map((p) =>
        p.id === data.id
          ? {
              ...p,
              title: data.title,
              description: data.description,
              techTags: data.techTags,
              repoUrl: data.repoUrl,
              liveUrl: data.liveUrl,
              column: data.column,
              updatedAt: now,
            }
          : p
      );
      saveProjects(updated);
    } else {
      // Create
      const newProject: ProjectItem = {
        id: `proj-${now}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        description: data.description,
        techTags: data.techTags,
        repoUrl: data.repoUrl,
        liveUrl: data.liveUrl,
        column: data.column,
        createdAt: now,
        updatedAt: now,
      };
      saveProjects([newProject, ...projects]);
    }
  };

  const handleMove = (id: string, targetColumn: ProjectColumn) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, column: targetColumn, updatedAt: Date.now() } : p
    );
    saveProjects(updated);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    const filtered = projects.filter((p) => p.id !== projectToDelete.id);
    saveProjects(filtered);
    setProjectToDelete(null);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devdeck-projects-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Basic validation
          const valid: ProjectItem[] = parsed.filter(
            (item) => item && typeof item.id === "string" && typeof item.title === "string"
          );
          if (valid.length > 0) {
            saveProjects(valid);
          }
        }
      } catch {
        // Invalid json format
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects Tracker</h1>
          <p className="text-xs text-muted-foreground">
            Kanban board with drag-and-drop, export and local persistence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json,application/json"
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Import projects from JSON"
            className="gap-1.5 text-xs"
          >
            <Upload className="size-3.5" />
            <span className="hidden sm:inline">Import</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            aria-label="Export projects as JSON"
            className="gap-1.5 text-xs"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
            className="gap-1.5 text-xs"
          >
            <Plus className="size-3.5" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnProjects = projects.filter((p) => p.column === column.id);

          return (
            <div
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) handleMove(id, column.id);
              }}
              className="flex flex-col rounded-xl border border-border bg-muted/20 p-3 min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-3 border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {column.label}
                  </h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                    {columnProjects.length}
                  </span>
                </div>
              </div>

              {/* Project Cards */}
              <div className="flex-1 space-y-2.5">
                {columnProjects.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/80 p-6 text-center">
                    <p className="text-xs text-muted-foreground">No projects in this stage</p>
                  </div>
                ) : (
                  columnProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={(p) => {
                        setEditingProject(p);
                        setModalOpen(true);
                      }}
                      onDelete={(p) => {
                        setProjectToDelete(p);
                        setDeleteModalOpen(true);
                      }}
                      onMove={handleMove}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projectToEdit={editingProject}
        onSave={handleCreateOrEdit}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        project={projectToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
