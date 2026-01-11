"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormEntryForm } from "@/components/form-entry-form";
import { SuggestionsPanel } from "@/components/suggestions-panel";

export default function NewEntryPage() {
  const router = useRouter();
  const [createdEntry, setCreatedEntry] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
  } | null>(null);

  const handleSuccess = (entryId: string) => {
    // Get form values for suggestions preview
    const form = document.querySelector("form");
    if (form) {
      const formData = new FormData(form);
      setCreatedEntry({
        id: entryId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
      });
    }
  };

  if (createdEntry) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Entry Created Successfully!
                </CardTitle>
                <CardDescription>
                  Your entry &quot;{createdEntry.title}&quot; has been saved
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <SuggestionsPanel entry={createdEntry} />

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/${createdEntry.id}`)}
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Entry
              </button>
              <button
                onClick={() => setCreatedEntry(null)}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Create Another
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center rounded-lg text-muted-foreground px-4 py-2 text-sm font-medium hover:text-foreground transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Entry</CardTitle>
          <CardDescription>
            Fill in the details below. You&apos;ll receive helpful suggestions based on your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormEntryForm mode="create" onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}

