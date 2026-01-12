"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleLike(entryId?: string, commentId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Must be logged in" };
  }

  const userId = session.user.id;

  try {
    // Check if like exists
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        ...(entryId ? { entryId } : {}),
        ...(commentId ? { commentId } : {}),
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({ where: { id: existingLike.id } });
      
      // Decrease reputation of content owner
      if (entryId) {
        const entry = await prisma.formEntry.findUnique({ where: { id: entryId } });
        if (entry && entry.userId !== userId) {
          await prisma.user.update({
            where: { id: entry.userId },
            data: { reputation: { decrement: 1 } },
          });
        }
      }
      
      return { success: true, liked: false };
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          ...(entryId ? { entryId } : {}),
          ...(commentId ? { commentId } : {}),
        },
      });

      // Increase reputation and create notification
      if (entryId) {
        const entry = await prisma.formEntry.findUnique({ 
          where: { id: entryId },
          include: { user: true }
        });
        if (entry && entry.userId !== userId) {
          await prisma.user.update({
            where: { id: entry.userId },
            data: { reputation: { increment: 1 } },
          });
          await prisma.notification.create({
            data: {
              userId: entry.userId,
              type: "like",
              message: `${session.user.name || "Someone"} liked your post "${entry.title}"`,
              link: `/dashboard/${entryId}`,
            },
          });
        }
      }

      if (commentId) {
        const comment = await prisma.comment.findUnique({ 
          where: { id: commentId },
          include: { user: true, entry: true }
        });
        if (comment && comment.userId !== userId) {
          await prisma.user.update({
            where: { id: comment.userId },
            data: { reputation: { increment: 1 } },
          });
          await prisma.notification.create({
            data: {
              userId: comment.userId,
              type: "like",
              message: `${session.user.name || "Someone"} liked your comment`,
              link: `/dashboard/${comment.entryId}`,
            },
          });
        }
      }

      return { success: true, liked: true };
    }
  } catch {
    return { success: false, message: "Failed to toggle like" };
  }
}

export async function getLikeStatus(entryId?: string, commentId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { liked: false, count: 0 };

  const count = await prisma.like.count({
    where: {
      ...(entryId ? { entryId } : {}),
      ...(commentId ? { commentId } : {}),
    },
  });

  const liked = await prisma.like.findFirst({
    where: {
      userId: session.user.id,
      ...(entryId ? { entryId } : {}),
      ...(commentId ? { commentId } : {}),
    },
  });

  return { liked: !!liked, count };
}

export async function getLikesForEntry(entryId: string) {
  const session = await auth();
  
  const count = await prisma.like.count({ where: { entryId } });
  const liked = session?.user?.id 
    ? await prisma.like.findFirst({
        where: { userId: session.user.id, entryId },
      })
    : null;

  return { liked: !!liked, count };
}

