"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ProjectItem } from "@/types/projects";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectItem | null;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  project,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!project) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-2xl transition duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 focus:outline-none">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-destructive/10 p-2 text-destructive shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Delete Project</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Are you sure you want to delete <strong className="text-foreground">{project.title}</strong>? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
