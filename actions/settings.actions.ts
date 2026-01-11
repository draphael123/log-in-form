"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const settingsSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  theme: z.enum(["light", "dark", "system"]),
  accentColor: z.enum(["purple", "blue", "green", "orange", "pink"]),
  emailNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  showSuggestions: z.boolean(),
  compactView: z.boolean(),
  defaultCategory: z.string(),
});

export type SettingsState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function getUserSettings() {
  const user = await requireAuth();

  // Get or create settings
  let settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId: user.id! },
    });
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, createdAt: true },
  });

  return {
    ...settings,
    userName: userData?.name,
    userEmail: userData?.email,
    userCreatedAt: userData?.createdAt,
  };
}

export async function updateSettings(
  prevState: SettingsState | null,
  formData: FormData
): Promise<SettingsState> {
  const user = await requireAuth();

  const rawData = {
    name: formData.get("name") as string || undefined,
    theme: formData.get("theme") as string,
    accentColor: formData.get("accentColor") as string,
    emailNotifications: formData.get("emailNotifications") === "on",
    weeklyDigest: formData.get("weeklyDigest") === "on",
    showSuggestions: formData.get("showSuggestions") === "on",
    compactView: formData.get("compactView") === "on",
    defaultCategory: formData.get("defaultCategory") as string,
  };

  const parsed = settingsSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Update user name if provided
  if (parsed.data.name !== undefined) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name || null },
    });
  }

  // Upsert settings
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id!,
      theme: parsed.data.theme,
      accentColor: parsed.data.accentColor,
      emailNotifications: parsed.data.emailNotifications,
      weeklyDigest: parsed.data.weeklyDigest,
      showSuggestions: parsed.data.showSuggestions,
      compactView: parsed.data.compactView,
      defaultCategory: parsed.data.defaultCategory,
    },
    update: {
      theme: parsed.data.theme,
      accentColor: parsed.data.accentColor,
      emailNotifications: parsed.data.emailNotifications,
      weeklyDigest: parsed.data.weeklyDigest,
      showSuggestions: parsed.data.showSuggestions,
      compactView: parsed.data.compactView,
      defaultCategory: parsed.data.defaultCategory,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Settings saved successfully!",
  };
}

export async function updatePassword(
  prevState: SettingsState | null,
  formData: FormData
): Promise<SettingsState> {
  const user = await requireAuth();
  const bcrypt = await import("bcryptjs");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "All password fields are required",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New passwords do not match",
    };
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!userData) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const isValid = await bcrypt.compare(currentPassword, userData.passwordHash);

  if (!isValid) {
    return {
      success: false,
      message: "Current password is incorrect",
    };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash },
  });

  return {
    success: true,
    message: "Password updated successfully!",
  };
}

export async function deleteAccount(): Promise<SettingsState> {
  const user = await requireAuth();

  await prisma.user.delete({
    where: { id: user.id },
  });

  return {
    success: true,
    message: "Account deleted",
  };
}

