"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(entryId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Must be logged in" };
  }

  try {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_entryId: {
          userId: session.user.id,
          entryId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return { success: true, bookmarked: false };
    } else {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          entryId,
        },
      });
      return { success: true, bookmarked: true };
    }
  } catch {
    return { success: false, message: "Failed to toggle bookmark" };
  }
}

export async function getBookmarkStatus(entryId: string) {
  const session = await auth();
  if (!session?.user?.id) return { bookmarked: false };

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_entryId: {
        userId: session.user.id,
        entryId,
      },
    },
  });

  return { bookmarked: !!bookmark };
}

export async function getUserBookmarks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      entry: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookmarks;
}

