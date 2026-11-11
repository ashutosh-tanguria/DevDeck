"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ProjectItem, ProjectColumn, COLUMNS } from "@/types/projects";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToEdit?: ProjectItem | null;
  onSave: (data: Omit<ProjectItem, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
}

interface ProjectFormProps {
  projectToEdit?: ProjectItem | null;
  onSave: (data: Omit<ProjectItem, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  onCancel: () => void;
}

function ProjectForm({ projectToEdit, onSave, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(projectToEdit?.title ?? "");
  const [description, setDescription] = useState(projectToEdit?.description ?? "");
  const [techTags, setTechTags] = useState(projectToEdit?.techTags.join(", ") ?? "");
  const [repoUrl, setRepoUrl] = useState(projectToEdit?.repoUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(projectToEdit?.liveUrl ?? "");
  const [column, setColumn] = useState<ProjectColumn>(projectToEdit?.column ?? "planned");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a project title");
      return;
    }

    const tags = techTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      id: projectToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      techTags: tags,
      repoUrl: repoUrl.trim(),
      liveUrl: liveUrl.trim() || undefined,
      column,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <p className="rounded bg-destructive/10 p-2 text-xs text-destructive">{error}</p>
      )}

      <div>
        <label htmlFor="project-title" className="block text-xs font-medium text-foreground">
          Project Title <span className="text-destructive">*</span>
        </label>
        <input
          id="project-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Analytics Platform"
          required
          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-foreground/40"
        />
      </div>

      <div>
        <label htmlFor="project-desc" className="block text-xs font-medium text-foreground">
          Description
        </label>
        <textarea
          id="project-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short summary of goals and tech stack..."
          rows={2}
          className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-xs outline-none focus:border-foreground/40"
        />
      </div>

      <div>
        <label htmlFor="project-tags" className="block text-xs font-medium text-foreground">
          Tech Tags (comma separated)
        </label>
        <input
          id="project-tags"
          value={techTags}
          onChange={(e) => setTechTags(e.target.value)}
          placeholder="Next.js, Tailwind, SQLite"
          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-foreground/40"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="project-repo" className="block text-xs font-medium text-foreground">
            Repository URL
          </label>
          <input
            id="project-repo"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-foreground/40"
          />
        </div>

        <div>
          <label htmlFor="project-live" className="block text-xs font-medium text-foreground">
            Live Demo URL (optional)
          </label>
          <input
            id="project-live"
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-foreground/40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="project-column" className="block text-xs font-medium text-foreground">
          Status
        </label>
        <select
          id="project-column"
          value={column}
          onChange={(e) => setColumn(e.target.value as ProjectColumn)}
          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none"
        >
          {COLUMNS.map((col) => (
            <option key={col.id} value={col.id}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {projectToEdit ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}

export default function ProjectModal({
  open,
  onOpenChange,
  projectToEdit,
  onSave,
}: ProjectModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-2xl transition duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 focus:outline-none">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-base font-semibold text-foreground">
              {projectToEdit ? "Edit Project" : "New Project"}
            </h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          <ProjectForm
            key={projectToEdit?.id ?? "new-project"}
            projectToEdit={projectToEdit}
            onSave={(data) => {
              onSave(data);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
