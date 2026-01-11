import Link from "next/link";
import { getUserFormEntries } from "@/actions/form.actions";
import { FormEntryCard } from "@/components/form-entry-card";

export default async function DashboardPage() {
  const entries = await getUserFormEntries();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between slide-up">
        <div>
          <h1 className="text-3xl font-black gradient-text-animated flex items-center gap-3">
            My Entries
            <span className="text-2xl float">📚</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {entries.length === 0 
              ? "Ready to create something awesome? 🚀" 
              : `You have ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} — keep it up! 💪`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/feed"
            className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 dark:border-purple-800 text-foreground px-4 py-2.5 text-sm font-bold hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">🌍</span> Public Feed
          </Link>
          <Link 
            href="/dashboard/new"
            className="group inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 group-hover:rotate-90 transition-transform duration-300"
            >
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            New Entry
          </Link>
        </div>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="text-center py-20 px-4 bounce-in">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 mb-6 blob">
            <span className="text-6xl">📝</span>
          </div>
          <h2 className="text-3xl font-black gradient-text mb-2">No entries yet!</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Your journey starts here. Create your first entry and watch the magic happen! ✨
          </p>
          <Link 
            href="/dashboard/new"
            className="group inline-flex items-center justify-center rounded-2xl gradient-bg text-white px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-110 transition-all duration-300"
          >
            <span className="mr-2 group-hover:rotate-12 transition-transform">🚀</span>
            Create your first entry
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          {/* Fun decoration */}
          <div className="flex justify-center gap-4 mt-12 text-4xl">
            <span className="float" style={{ animationDelay: '0s' }}>💡</span>
            <span className="float" style={{ animationDelay: '0.5s' }}>📊</span>
            <span className="float" style={{ animationDelay: '1s' }}>🎯</span>
            <span className="float" style={{ animationDelay: '1.5s' }}>⚡</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 stagger-children">
          {entries.map((entry) => (
            <FormEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
