"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters"),
  entryId: z.string().min(1, "Entry ID is required"),
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
  });

  if (!entry) {
    return {
      success: false,
      message: "Post not found",
    };
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      userId: session.user.id,
      entryId: parsed.data.entryId,
    },
  });

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

  // Only allow comment owner or post owner to delete
  if (comment.userId !== session.user.id && comment.entry.userId !== session.user.id) {
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
  const comments = await prisma.comment.findMany({
    where: { entryId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return comments;
}

