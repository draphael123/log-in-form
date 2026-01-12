"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkAndAwardBadges } from "@/actions/badge.actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters"),
  entryId: z.string().min(1, "Entry ID is required"),
  parentId: z.string().optional(),
});

export type CommentState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createComment(
  prevState: CommentState | null,
  formData: FormData
): Promise<CommentState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to comment",
    };
  }

  const rawData = {
    content: formData.get("content") as string,
    entryId: formData.get("entryId") as string,
    parentId: formData.get("parentId") as string || undefined,
  };

  const parsed = commentSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check if entry exists
  const entry = await prisma.formEntry.findUnique({
    where: { id: parsed.data.entryId },
    include: { user: true },
  });

  if (!entry) {
    return {
      success: false,
      message: "Post not found",
    };
  }

  // If replying, check parent comment exists
  let parentComment = null;
  if (parsed.data.parentId) {
    parentComment = await prisma.comment.findUnique({
      where: { id: parsed.data.parentId },
      include: { user: true },
    });
  }

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      userId: session.user.id,
      entryId: parsed.data.entryId,
      parentId: parsed.data.parentId,
    },
  });

  // Create notification for post owner (if not self)
  if (entry.userId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: entry.userId,
        type: "comment",
        message: `${session.user.name || "Someone"} commented on your post "${entry.title}"`,
        link: `/dashboard/${entry.id}`,
      },
    });
  }

  // Create notification for parent comment owner (if reply and not self)
  if (parentComment && parentComment.userId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: parentComment.userId,
        type: "reply",
        message: `${session.user.name || "Someone"} replied to your comment`,
        link: `/dashboard/${entry.id}`,
      },
    });
  }

  // Check for badges
  checkAndAwardBadges(session.user.id).catch(console.error);

  revalidatePath(`/dashboard/${parsed.data.entryId}`);

  return {
    success: true,
    message: "Comment added!",
  };
}

export async function deleteComment(commentId: string): Promise<CommentState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to delete comments",
    };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { entry: true },
  });

  if (!comment) {
    return {
      success: false,
      message: "Comment not found",
    };
  }

  // Check user role for moderation
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isModOrAdmin = user?.role === "admin" || user?.role === "moderator";

  // Only allow comment owner, post owner, or moderators to delete
  if (comment.userId !== session.user.id && comment.entry.userId !== session.user.id && !isModOrAdmin) {
    return {
      success: false,
      message: "You don't have permission to delete this comment",
    };
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/dashboard/${comment.entryId}`);

  return {
    success: true,
    message: "Comment deleted",
  };
}

export async function getComments(entryId: string) {
  // Get top-level comments only (parentId is null)
  const comments = await prisma.comment.findMany({
    where: { 
      entryId,
      parentId: null, // Only top-level comments
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { likes: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { likes: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return comments;
}
