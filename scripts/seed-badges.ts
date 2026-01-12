// Seed badges script
// Run with: npx tsx scripts/seed-badges.ts

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  console.log("🌱 Seeding badges...\n");

  for (const badge of BADGES) {
    const result = await prisma.badge.upsert({
      where: { name: badge.name },
      create: badge,
      update: badge,
    });
    console.log(`✅ ${result.icon} ${result.name}`);
  }

  console.log("\n🎉 Done! Created", BADGES.length, "badges");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

