"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteFormEntry } from "@/actions/form.actions";

interface DeleteEntryButtonProps {
  entryId: string;
}

export function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteFormEntry(entryId);
    });
  };

  if (!showConfirm) {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Are you sure?</span>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Yes, delete"}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowConfirm(false)}
        disabled={isPending}
      >
        Cancel
      </Button>
    </div>
  );
}

