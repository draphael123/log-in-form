"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
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

  revalidatePath("/dashboard");
  
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
  redirect("/dashboard");
}

export async function getFormEntry(entryId: string) {
  const user = await requireAuth();

  const entry = await prisma.formEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry || entry.userId !== user.id) {
    return null;
  }

  return entry;
}

export async function getUserFormEntries() {
  const user = await requireAuth();

  const entries = await prisma.formEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return entries;
}

