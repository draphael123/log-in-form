import Link from "next/link";
import { getUserBookmarks } from "@/actions/bookmark.actions";
import { Card, CardContent } from "@/components/ui/card";

export default async function BookmarksPage() {
  const bookmarks = await getUserBookmarks();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-2xl">🔖</span>
          </div>
          <div>
            <h1 className="text-3xl font-black gradient-text-animated">
              Bookmarks
            </h1>
            <p className="text-muted-foreground">
              Your saved posts for later 📚
            </p>
          </div>
        </div>
      </div>

      {/* Bookmarks list */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-16 bounce-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mb-4">
            <span className="text-4xl">🔖</span>
          </div>
          <h2 className="text-xl font-black gradient-text mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground mb-4">
            Save posts you want to read later!
          </p>
          <Link 
            href="/dashboard/feed"
            className="inline-flex items-center justify-center rounded-xl gradient-bg text-white px-6 py-3 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">🌍</span> Explore Posts
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 stagger-children">
          {bookmarks.map((bookmark) => (
            <Link key={bookmark.id} href={`/dashboard/${bookmark.entry.id}`}>
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm transition-all hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">
                          by {bookmark.entry.user.name || bookmark.entry.user.email.split("@")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • Saved {formatDate(bookmark.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-bold group-hover:gradient-text transition-all">
                        {bookmark.entry.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {bookmark.entry.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>❤️ {bookmark.entry._count.likes}</span>
                        <span>💬 {bookmark.entry._count.comments}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {bookmark.entry.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

