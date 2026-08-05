"use server";

import { revalidatePath } from "next/cache";
import { ClassStatus, EarningStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function updateSessionLink(classId: string, sessionLink: string) {
  const profile = await requireProfile();

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls || cls.teacherId !== profile.id) {
    return { error: "Class not found." };
  }

  if (cls.status !== ClassStatus.LISTED) {
    return { error: "Only listed classes can have a session link." };
  }

  await prisma.class.update({
    where: { id: classId },
    data: { sessionLink },
  });

  revalidatePath(`/dashboard/teacher/classes/${classId}`);
  return { success: true };
}

export async function markClassCompleted(classId: string) {
  const profile = await requireProfile();

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls || cls.teacherId !== profile.id) {
    return { error: "Class not found." };
  }

  if (cls.status !== ClassStatus.LISTED) {
    return { error: "Only listed classes can be marked as completed." };
  }

  const releasedAt = new Date();

  await prisma.$transaction([
    prisma.class.update({
      where: { id: classId },
      data: {
        status: ClassStatus.COMPLETED,
        endedAt: releasedAt,
      },
    }),
    // R-EP: release pending earnings on completion.
    // The 24-hour rating window is a follow-up sprint — for the MVP demo we
    // release immediately so investors see the full money loop in one sitting.
    prisma.earning.updateMany({
      where: {
        classId,
        teacherId: profile.id,
        status: EarningStatus.PENDING_RELEASE,
      },
      data: { status: EarningStatus.RELEASED, releasedAt },
    }),
  ]);

  // Notify enrolled students that the class is over and they can rate it.
  const enrolments = await prisma.enrolment.findMany({
    where: { classId, status: "CONFIRMED" },
    select: { studentId: true, class: { select: { title: true } } },
  });
  await Promise.all(
    enrolments.map((e) =>
      createNotification(e.studentId, "rating", {
        title: "Rate your class",
        message: `How was "${e.class.title}"? Share your feedback.`,
        classId,
      }),
    ),
  );

  // Notify the teacher their earnings have been released.
  const released = await prisma.earning.aggregate({
    where: { classId, teacherId: profile.id, status: EarningStatus.RELEASED },
    _sum: { netNgn: true },
  });
  if ((released._sum.netNgn ?? 0) > 0) {
    await createNotification(profile.id, "payout", {
      title: "Earnings released",
      message: `₦${(released._sum.netNgn ?? 0).toLocaleString()} from "${cls.title}" is ready to withdraw.`,
      classId,
    });
  }

  revalidatePath(`/dashboard/teacher/classes/${classId}`);
  revalidatePath(`/dashboard/teacher/classes`);
  revalidatePath(`/dashboard/teacher`);
  revalidatePath(`/dashboard/teacher/earnings`);
  revalidatePath(`/dashboard/student`);
  revalidatePath(`/dashboard/student/classes`);
  return { success: true };
}
