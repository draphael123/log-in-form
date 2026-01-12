"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function toggleFollow(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Must be logged in" };
  }

  if (session.user.id === targetUserId) {
    return { success: false, message: "Cannot follow yourself" };
  }

  try {
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return { success: true, following: false };
    } else {
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: "follow",
          message: `${session.user.name || "Someone"} started following you`,
          link: `/profile/${session.user.id}`,
        },
      });

      return { success: true, following: true };
    }
  } catch {
    return { success: false, message: "Failed to toggle follow" };
  }
}

export async function getFollowStatus(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) return { following: false };

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  return { following: !!follow };
}

export async function getFollowCounts(userId: string) {
  const [followers, following] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return { followers, following };
}

