"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, getCurrentUser } from "@/lib/auth";
import { checkAndAwardBadges } from "@/actions/badge.actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/suggestions";

const formEntrySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  category: z.string().refine(
    (val) => CATEGORIES.map((c) => c.toLowerCase()).includes(val.toLowerCase()),
    { message: "Please select a valid category" }
  ),
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  entryId?: string;
};

export async function createFormEntry(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const user = await requireAuth();

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
  };

  const parsed = formEntrySchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const entry = await prisma.formEntry.create({
    data: {
      userId: user.id!,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
    },
  });

  // Check for badges
  checkAndAwardBadges(user.id!).catch(console.error);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/feed");
  
  return {
    success: true,
    message: "Entry created successfully",
    entryId: entry.id,
  };
}

export async function updateFormEntry(
  entryId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const user = await requireAuth();

  // Verify ownership
  const existingEntry = await prisma.formEntry.findUnique({
    where: { id: entryId },
  });

  if (!existingEntry) {
    return {
      success: false,
      message: "Entry not found",
    };
  }

  if (existingEntry.userId !== user.id) {
    return {
      success: false,
      message: "You do not have permission to edit this entry",
    };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
  };

  const parsed = formEntrySchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.formEntry.update({
    where: { id: entryId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/feed");
  revalidatePath(`/dashboard/${entryId}`);

  return {
    success: true,
    message: "Entry updated successfully",
  };
}

export async function deleteFormEntry(entryId: string): Promise<FormState> {
  const user = await requireAuth();

  // Verify ownership
  const existingEntry = await prisma.formEntry.findUnique({
    where: { id: entryId },
  });

  if (!existingEntry) {
    return {
      success: false,
      message: "Entry not found",
    };
  }

  if (existingEntry.userId !== user.id) {
    return {
      success: false,
      message: "You do not have permission to delete this entry",
    };
  }

  await prisma.formEntry.delete({
    where: { id: entryId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/feed");
  redirect("/dashboard");
}

export async function getFormEntry(entryId: string) {
  await requireAuth();

  // Increment view count
  await prisma.formEntry.update({
    where: { id: entryId },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {}); // Ignore if not found

  // Any logged-in user can view any entry
  const entry = await prisma.formEntry.findUnique({
    where: { id: entryId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          reputation: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true,
        },
      },
    },
  });

  return entry;
}

export async function togglePinEntry(entryId: string) {
  const user = await requireAuth();

  const entry = await prisma.formEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry || entry.userId !== user.id) {
    return { success: false, message: "Unauthorized" };
  }

  await prisma.formEntry.update({
    where: { id: entryId },
    data: { isPinned: !entry.isPinned },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/profile/${user.id}`);

  return { success: true, isPinned: !entry.isPinned };
}

export async function getUserFormEntries() {
  const user = await requireAuth();

  const entries = await prisma.formEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return entries;
}

// Get all entries from all users (public feed)
export async function getAllFormEntries() {
  await requireAuth();

  const entries = await prisma.formEntry.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return entries;
}

// Check if current user owns an entry
export async function isEntryOwner(entryId: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  const entry = await prisma.formEntry.findUnique({
    where: { id: entryId },
    select: { userId: true },
  });

  return entry?.userId === user.id;
}
