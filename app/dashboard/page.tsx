import Link from "next/link";
import { getUserFormEntries } from "@/actions/form.actions";
import { FormEntryCard } from "@/components/form-entry-card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const entries = await getUserFormEntries();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Entries</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your form entries
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            New Entry
          </Button>
        </Link>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">No entries yet</h2>
          <p className="text-muted-foreground mt-1 mb-6 max-w-sm mx-auto">
            Create your first entry to get started. You&apos;ll receive helpful suggestions based on your content.
          </p>
          <Link href="/dashboard/new">
            <Button>Create your first entry</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <FormEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

