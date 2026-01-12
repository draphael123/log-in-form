"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/actions/follow.actions";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

export function FollowButton({ targetUserId, isFollowing: initialFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFollow(targetUserId);
      if (result.success) {
        setIsFollowing(result.following);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50 ${
        isFollowing
          ? "border-2 border-purple-300 dark:border-purple-700 text-foreground hover:border-red-400 hover:text-red-500"
          : "gradient-bg text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
      }`}
    >
      {isPending ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : isFollowing ? (
        <>✓ Following</>
      ) : (
        <>➕ Follow</>
      )}
    </button>
  );
}

