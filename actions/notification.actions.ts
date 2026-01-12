"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications;
}

export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const count = await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return count;
}

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return { success: true };
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { success: true };
}

