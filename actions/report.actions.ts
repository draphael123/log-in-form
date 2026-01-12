"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reportSchema = z.object({
  reason: z.enum(["spam", "inappropriate", "harassment", "other"]),
  details: z.string().max(500).optional(),
});

export async function createReport(
  formData: FormData,
  entryId?: string,
  commentId?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Must be logged in" };
  }

  const rawData = {
    reason: formData.get("reason") as string,
    details: formData.get("details") as string,
  };

  const parsed = reportSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, message: "Invalid report data" };
  }

  // Check if already reported
  const existing = await prisma.report.findFirst({
    where: {
      userId: session.user.id,
      ...(entryId ? { entryId } : {}),
      ...(commentId ? { commentId } : {}),
    },
  });

  if (existing) {
    return { success: false, message: "You've already reported this content" };
  }

  await prisma.report.create({
    data: {
      userId: session.user.id,
      entryId,
      commentId,
      reason: parsed.data.reason,
      details: parsed.data.details,
    },
  });

  return { success: true, message: "Report submitted. Thank you!" };
}

export async function getReports(status?: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Check if admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin" && user?.role !== "moderator") {
    return [];
  }

  return prisma.report.findMany({
    where: status ? { status } : {},
    include: {
      user: { select: { id: true, name: true, email: true } },
      entry: { select: { id: true, title: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateReportStatus(reportId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin" && user?.role !== "moderator") {
    return { success: false, message: "Unauthorized" };
  }

  await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  return { success: true };
}

