"use server";

import { revalidatePath } from "next/cache";
import { ClassStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";

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

  await prisma.class.update({
    where: { id: classId },
    data: {
      status: ClassStatus.COMPLETED,
      endedAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/teacher/classes/${classId}`);
  revalidatePath(`/dashboard/teacher/classes`);
  revalidatePath(`/dashboard/teacher`);
  return { success: true };
}
