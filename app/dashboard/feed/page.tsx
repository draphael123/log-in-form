import Link from "next/link";
import { getAllFormEntries } from "@/actions/form.actions";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { FeedFilters } from "@/components/feed-filters";

const categoryConfig: Record<string, { gradient: string; emoji: string }> = {
  productivity: { gradient: "from-blue-500 to-cyan-500", emoji: "⚡" },
  health: { gradient: "from-emerald-500 to-teal-500", emoji: "💚" },
  admin: { gradient: "from-purple-500 to-violet-500", emoji: "📋" },
  "customer support": { gradient: "from-amber-500 to-orange-500", emoji: "💬" },
  engineering: { gradient: "from-red-500 to-rose-500", emoji: "⚙️" },
  general: { gradient: "from-gray-500 to-slate-500", emoji: "📌" },
};

interface FeedPageProps {
  searchParams: Promise<{ category?: string; search?: string; date?: string }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  const allEntries = await getAllFormEntries();

  // Apply filters
  let entries = allEntries;
  
  // Filter by category
  if (resolvedSearchParams.category && resolvedSearchParams.category !== "all") {
    entries = entries.filter(
      (e) => e.category.toLowerCase() === resolvedSearchParams.category?.toLowerCase()
    );
  }

  // Filter by date
  if (resolvedSearchParams.date && resolvedSearchParams.date !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    entries = entries.filter((e) => {
      const entryDate = new Date(e.createdAt);
      
      switch (resolvedSearchParams.date) {
        case "today":
          return entryDate >= today;
        case "week": {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return entryDate >= monthAgo;
        }
        case "year": {
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return entryDate >= yearAgo;
        }
        default:
          return true;
      }
    });
  }

  // Filter by search term
  if (resolvedSearchParams.search) {
    const searchLower = resolvedSearchParams.search.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.user.name?.toLowerCase().includes(searchLower) ||
        e.user.email.toLowerCase().includes(searchLower)
    );
  }

  // Get unique categories from all entries
  const categories = Array.from(new Set(allEntries.map((e) => e.category)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <h1 className="text-3xl font-black gradient-text-animated">
              Public Feed
            </h1>
            <p className="text-muted-foreground">
              See what everyone is working on! 👀
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FeedFilters 
        categories={categories} 
        selectedCategory={resolvedSearchParams.category || "all"}
        selectedDate={resolvedSearchParams.date || "all"}
        searchQuery={resolvedSearchParams.search || ""}
        totalEntries={allEntries.length}
        filteredCount={entries.length}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/30 hover-lift">
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{allEntries.length}</div>
          <div className="text-sm text-muted-foreground">Total Posts</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/30 hover-lift">
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
            {new Set(allEntries.map(e => e.userId)).size}
          </div>
          <div className="text-sm text-muted-foreground">Contributors</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/30 hover-lift">
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {allEntries.filter(e => e.userId === session?.user?.id).length}
          </div>
          <div className="text-sm text-muted-foreground">Your Posts</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/30 hover-lift">
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {categories.length}
          </div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
      </div>

      {/* Results info */}
      {(resolvedSearchParams.category && resolvedSearchParams.category !== "all") || 
       (resolvedSearchParams.date && resolvedSearchParams.date !== "all") || 
       resolvedSearchParams.search ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{entries.length}</span> of {allEntries.length} posts
            {resolvedSearchParams.category && resolvedSearchParams.category !== "all" && (
              <span> in <span className="font-bold text-foreground">{resolvedSearchParams.category}</span></span>
            )}
            {resolvedSearchParams.date && resolvedSearchParams.date !== "all" && (
              <span> from <span className="font-bold text-foreground">
                {resolvedSearchParams.date === "today" ? "today" : 
                 resolvedSearchParams.date === "week" ? "this week" :
                 resolvedSearchParams.date === "month" ? "this month" : 
                 resolvedSearchParams.date === "year" ? "this year" : resolvedSearchParams.date}
              </span></span>
            )}
            {resolvedSearchParams.search && (
              <span> matching &quot;<span className="font-bold text-foreground">{resolvedSearchParams.search}</span>&quot;</span>
            )}
          </p>
          <Link 
            href="/dashboard/feed"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            Clear filters
          </Link>
        </div>
      ) : null}

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="text-center py-16 px-4 bounce-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-xl font-black gradient-text mb-2">No posts found</h2>
          <p className="text-muted-foreground mb-4">
            {resolvedSearchParams.search || resolvedSearchParams.category !== "all" || resolvedSearchParams.date !== "all"
              ? "Try adjusting your filters or search query"
              : "Be the first to create a post!"}
          </p>
          {resolvedSearchParams.search || resolvedSearchParams.category !== "all" || resolvedSearchParams.date !== "all" ? (
            <Link 
              href="/dashboard/feed"
              className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 dark:border-purple-800 text-foreground px-4 py-2 text-sm font-bold hover:border-purple-400 hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">✨</span> Clear Filters
            </Link>
          ) : (
            <Link 
              href="/dashboard/new"
              className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">✨</span> Create First Post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 stagger-children">
          {entries.map((entry) => {
            const config = categoryConfig[entry.category.toLowerCase()] || categoryConfig.general;
            const isOwner = entry.userId === session?.user?.id;
            
            return (
              <Link key={entry.id} href={`/dashboard/${entry.id}`}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className={`h-1 bg-gradient-to-r ${config.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Author Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${isOwner ? 'gradient-bg' : 'bg-gray-400 dark:bg-gray-600'}`}>
                        {getInitials(entry.user.name, entry.user.email)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">
                            {entry.user.name || entry.user.email.split("@")[0]}
                          </span>
                          {isOwner && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                              You
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            • {formatDate(entry.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground truncate group-hover:gradient-text transition-all duration-300">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {entry.description}
                        </p>
                      </div>

                      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span>{config.emoji}</span>
                        {entry.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
