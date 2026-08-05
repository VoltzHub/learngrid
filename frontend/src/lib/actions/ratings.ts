"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const ratingSchema = z.object({
  classId: z.string().uuid(),
  stars: z.coerce.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export type RatingFormState = { error?: string; success?: boolean } | undefined;

export async function submitRating(
  _prev: RatingFormState,
  formData: FormData
): Promise<RatingFormState> {
  const profile = await requireProfile();

  const parsed = ratingSchema.safeParse({
    classId: formData.get("classId"),
    stars: formData.get("stars"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { classId, stars, comment } = parsed.data;

  // Verify student was enrolled
  const enrolment = await prisma.enrolment.findUnique({
    where: { classId_studentId: { classId, studentId: profile.id } },
    include: { class: true },
  });

  if (!enrolment) {
    return { error: "You must be enrolled to rate this class." };
  }

  if (enrolment.class.status !== "COMPLETED") {
    return { error: "You can only rate completed classes." };
  }

  // Check not already rated
  const existing = await prisma.rating.findUnique({
    where: { classId_studentId: { classId, studentId: profile.id } },
  });

  if (existing) {
    return { error: "You have already rated this class." };
  }

  await prisma.rating.create({
    data: {
      classId,
      studentId: profile.id,
      stars,
      comment: comment ?? null,
    },
  });

  await createNotification(enrolment.class.teacherId, "rating", {
    title: `New ${stars}★ review`,
    message: comment
      ? `"${comment.slice(0, 80)}${comment.length > 80 ? "…" : ""}"`
      : `A student rated "${enrolment.class.title}" ${stars} stars.`,
    classId,
  });

  revalidatePath(`/dashboard/student/classes`);
  revalidatePath(`/classes/${classId}`);
  revalidatePath(`/dashboard/teacher/notifications`);
  return { success: true };
}
