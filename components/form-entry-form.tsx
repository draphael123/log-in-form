"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { CATEGORIES } from "@/lib/suggestions";
import { createFormEntry, updateFormEntry, FormState } from "@/actions/form.actions";

interface FormEntryFormProps {
  mode: "create" | "edit";
  entryId?: string;
  defaultValues?: {
    title: string;
    description: string;
    category: string;
  };
  onSuccess?: (entryId: string) => void;
}

export function FormEntryForm({
  mode,
  entryId,
  defaultValues,
  onSuccess,
}: FormEntryFormProps) {
  const router = useRouter();
  
  const action = mode === "edit" && entryId
    ? updateFormEntry.bind(null, entryId)
    : createFormEntry;

  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    action,
    null
  );

  useEffect(() => {
    if (state?.success && state.entryId) {
      if (onSuccess) {
        onSuccess(state.entryId);
      } else {
        router.push(`/dashboard/${state.entryId}`);
      }
    }
  }, [state, router, onSuccess]);

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat.toLowerCase(),
    label: cat,
  }));

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <Alert variant="error">{state.message}</Alert>
      )}

      {state?.success && mode === "edit" && (
        <Alert variant="success">{state.message}</Alert>
      )}

      <Input
        name="title"
        label="Title"
        placeholder="Enter a title for your entry"
        defaultValue={defaultValues?.title}
        error={state?.errors?.title?.[0]}
        required
      />

      <Textarea
        name="description"
        label="Description"
        placeholder="Describe your entry in detail..."
        defaultValue={defaultValues?.description}
        error={state?.errors?.description?.[0]}
        rows={5}
        required
      />

      <Select
        name="category"
        label="Category"
        options={categoryOptions}
        defaultValue={defaultValues?.category?.toLowerCase()}
        error={state?.errors?.category?.[0]}
        required
      />

      <div className="flex items-center gap-4">
        <Button type="submit" isLoading={isPending}>
          {mode === "create" ? "Create Entry" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

