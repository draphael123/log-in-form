"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/actions/like.actions";

interface LikeButtonProps {
  entryId?: string;
  commentId?: string;
  initialLiked: boolean;
  initialCount: number;
  size?: "sm" | "md";
}

export function LikeButton({
  entryId,
  commentId,
  initialLiked,
  initialCount,
  size = "md",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleLike(entryId, commentId);
      if (result.success && result.liked !== undefined) {
        setLiked(result.liked);
        setCount((prev) => (result.liked ? prev + 1 : prev - 1));
      }
    });
  };

  const sizeClasses = size === "sm" 
    ? "px-2 py-1 text-xs gap-1"
    : "px-3 py-1.5 text-sm gap-1.5";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center rounded-full font-bold transition-all disabled:opacity-50 ${sizeClasses} ${
        liked
          ? "bg-red-100 dark:bg-red-900/30 text-red-500"
          : "bg-muted/50 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
      }`}
    >
      <span className={`transition-transform ${liked ? "scale-110" : ""} ${isPending ? "animate-pulse" : ""}`}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span>{count}</span>
    </button>
  );
}

