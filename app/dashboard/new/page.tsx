"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormEntryForm } from "@/components/form-entry-form";
import { SuggestionsPanel } from "@/components/suggestions-panel";
import { useConfetti, SuccessAnimation } from "@/components/confetti";

export default function NewEntryPage() {
  const router = useRouter();
  const { fireEmoji } = useConfetti();
  const [createdEntry, setCreatedEntry] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
  } | null>(null);

  const handleSuccess = (entryId: string) => {
    const form = document.querySelector("form");
    if (form) {
      const formData = new FormData(form);
      setCreatedEntry({
        id: entryId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
      });
      // Fire confetti!
      fireEmoji();
    }
  };

  if (createdEntry) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 bounce-in">
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rainbow-border">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <SuccessAnimation />
            </div>
            <CardTitle className="text-2xl gradient-text-animated">
              🎉 Entry Created!
            </CardTitle>
            <CardDescription className="text-base">
              &quot;{createdEntry.title}&quot; has been saved successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SuggestionsPanel entry={createdEntry} />

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => router.push(`/dashboard/${createdEntry.id}`)}
                className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">👀</span> View Entry
              </button>
              <button
                onClick={() => setCreatedEntry(null)}
                className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-white/5 text-foreground px-6 py-3 text-sm font-bold hover:border-purple-400 hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">➕</span> Create Another
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center rounded-xl text-muted-foreground px-6 py-3 text-sm font-medium hover:text-foreground hover:bg-muted/50 transition-all duration-300"
              >
                <span className="mr-2">🏠</span> Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto slide-up">
      <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="h-1 animated-gradient" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-2xl">✏️</span>
            </div>
            <div>
              <CardTitle className="text-xl">Create New Entry</CardTitle>
              <CardDescription>
                Fill in the details and get smart suggestions! 💡
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormEntryForm mode="create" onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
