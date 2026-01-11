import Link from "next/link";
import { getUserFormEntries } from "@/actions/form.actions";
import { FormEntryCard } from "@/components/form-entry-card";

export default async function DashboardPage() {
  const entries = await getUserFormEntries();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Your Entries</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your form entries
          </p>
        </div>
        <Link 
          href="/dashboard/new"
          className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          New Entry
        </Link>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold gradient-text">No entries yet</h2>
          <p className="text-muted-foreground mt-2 mb-8 max-w-sm mx-auto">
            Create your first entry to get started. You&apos;ll receive helpful suggestions based on your content.
          </p>
          <Link 
            href="/dashboard/new"
            className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Create your first entry
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
