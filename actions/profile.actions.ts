"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
});

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      role: true,
      reputation: true,
      createdAt: true,
      _count: {
        select: {
          formEntries: true,
          comments: true,
          followers: true,
          following: true,
        },
      },
      userBadges: {
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      },
    },
  });

  return user;
}

export async function getUserPosts(userId: string) {
  const posts = await prisma.formEntry.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return posts;
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Must be logged in" };
  }

  const rawData = {
    name: formData.get("name") as string,
    bio: formData.get("bio") as string,
  };

  const parsed = profileSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name || null,
      bio: parsed.data.bio || null,
    },
  });

  revalidatePath(`/profile/${session.user.id}`);
  revalidatePath("/dashboard/settings");

  return { success: true, message: "Profile updated!" };
}

export async function getLeaderboard(limit = 10) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      reputation: true,
      _count: {
        select: {
          formEntries: true,
          comments: true,
        },
      },
      userBadges: {
        include: { badge: true },
        take: 3,
      },
    },
    orderBy: { reputation: "desc" },
    take: limit,
  });

  return users;
}

