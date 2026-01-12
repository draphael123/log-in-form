"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Badge definitions
const BADGES = [
  { name: "First Post", description: "Created your first post", icon: "📝", color: "from-blue-500 to-cyan-500", requirement: "posts:1", points: 10 },
  { name: "Prolific Writer", description: "Created 10 posts", icon: "✍️", color: "from-purple-500 to-pink-500", requirement: "posts:10", points: 50 },
  { name: "Content Creator", description: "Created 50 posts", icon: "🌟", color: "from-amber-500 to-orange-500", requirement: "posts:50", points: 200 },
  { name: "First Comment", description: "Left your first comment", icon: "💬", color: "from-green-500 to-emerald-500", requirement: "comments:1", points: 5 },
  { name: "Conversationalist", description: "Left 25 comments", icon: "🗣️", color: "from-teal-500 to-cyan-500", requirement: "comments:25", points: 30 },
  { name: "Community Voice", description: "Left 100 comments", icon: "📢", color: "from-indigo-500 to-purple-500", requirement: "comments:100", points: 100 },
  { name: "First Like", description: "Received your first like", icon: "❤️", color: "from-red-500 to-pink-500", requirement: "likes:1", points: 5 },
  { name: "Popular", description: "Received 50 likes", icon: "🔥", color: "from-orange-500 to-red-500", requirement: "likes:50", points: 75 },
  { name: "Superstar", description: "Received 200 likes", icon: "⭐", color: "from-yellow-500 to-amber-500", requirement: "likes:200", points: 250 },
  { name: "Newcomer", description: "Welcome to the community!", icon: "👋", color: "from-blue-400 to-indigo-400", requirement: "joined:1", points: 5 },
  { name: "Follower", description: "Followed 5 users", icon: "👥", color: "from-violet-500 to-purple-500", requirement: "following:5", points: 15 },
  { name: "Influential", description: "Gained 10 followers", icon: "👑", color: "from-amber-400 to-yellow-500", requirement: "followers:10", points: 50 },
];

export async function seedBadges() {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      create: badge,
      update: badge,
    });
  }
}

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          formEntries: true,
          comments: true,
          followers: true,
          following: true,
        },
      },
      userBadges: true,
    },
  });

  if (!user) return;

  // Get total likes received
  const likesReceived = await prisma.like.count({
    where: {
      OR: [
        { entry: { userId } },
        { comment: { userId } },
      ],
    },
  });

  const badges = await prisma.badge.findMany();
  const earnedBadgeIds = user.userBadges.map((ub) => ub.badgeId);

  for (const badge of badges) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    const [type, count] = badge.requirement.split(":");
    const required = parseInt(count);
    let earned = false;

    switch (type) {
      case "posts":
        earned = user._count.formEntries >= required;
        break;
      case "comments":
        earned = user._count.comments >= required;
        break;
      case "likes":
        earned = likesReceived >= required;
        break;
      case "followers":
        earned = user._count.followers >= required;
        break;
      case "following":
        earned = user._count.following >= required;
        break;
      case "joined":
        earned = true; // Always award on check
        break;
    }

    if (earned) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });

      // Award points
      await prisma.user.update({
        where: { id: userId },
        data: { reputation: { increment: badge.points } },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: "badge",
          message: `🎉 You earned the "${badge.name}" badge!`,
          link: `/profile/${userId}`,
        },
      });
    }
  }
}

export async function getAllBadges() {
  return prisma.badge.findMany({
    orderBy: { points: "asc" },
  });
}

export async function getUserBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}

