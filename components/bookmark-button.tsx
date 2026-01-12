"use client";

import { useState, useTransition } from "react";
import { toggleBookmark } from "@/actions/bookmark.actions";

interface BookmarkButtonProps {
  entryId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({ entryId, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleBookmark(entryId);
      if (result.success) {
        setBookmarked(result.bookmarked);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all disabled:opacity-50 ${
        bookmarked
          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
          : "bg-muted/50 text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600"
      }`}
      title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
    >
      <span className={`transition-transform ${bookmarked ? "scale-110" : ""}`}>
        {bookmarked ? "🔖" : "📑"}
      </span>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}

