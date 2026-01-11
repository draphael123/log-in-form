"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Please enter a valid email"),
  type: z.enum(["bug", "feature", "general", "praise"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  rating: z.number().min(1).max(5).optional(),
});

export type FeedbackState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitFeedback(
  prevState: FeedbackState | null,
  formData: FormData
): Promise<FeedbackState> {
  const session = await auth();

  const rawData = {
    name: formData.get("name") as string || undefined,
    email: formData.get("email") as string,
    type: formData.get("type") as string,
    message: formData.get("message") as string,
    rating: formData.get("rating") ? parseInt(formData.get("rating") as string) : undefined,
  };

  const parsed = feedbackSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.feedback.create({
    data: {
      userId: session?.user?.id || null,
      name: parsed.data.name || null,
      email: parsed.data.email,
      type: parsed.data.type,
      message: parsed.data.message,
      rating: parsed.data.rating || null,
    },
  });

  return {
    success: true,
    message: "Thank you for your feedback! 🎉",
  };
}

