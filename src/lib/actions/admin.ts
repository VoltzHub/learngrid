"use server";

import { revalidatePath } from "next/cache";
import { VerificationStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";

export async function getPendingVerifications() {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) throw new Error("Unauthorized");

  return prisma.teacherProfile.findMany({
    where: { verificationStatus: VerificationStatus.PENDING },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true, createdAt: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function approveTeacher(userId: string) {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) throw new Error("Unauthorized");

  await prisma.teacherProfile.update({
    where: { userId },
    data: {
      verificationStatus: VerificationStatus.VERIFIED,
      reviewedAt: new Date(),
      reviewedBy: profile.id,
    },
  });

  revalidatePath("/dashboard/admin/verifications");
  return { success: true };
}

export async function rejectTeacher(userId: string, reason: string) {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) throw new Error("Unauthorized");

  await prisma.teacherProfile.update({
    where: { userId },
    data: {
      verificationStatus: VerificationStatus.REJECTED,
      rejectionReason: reason,
      reviewedAt: new Date(),
      reviewedBy: profile.id,
    },
  });

  revalidatePath("/dashboard/admin/verifications");
  return { success: true };
}

export async function getTeacherVerificationStatus(userId: string) {
  const tp = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: {
      verificationStatus: true,
      rejectionReason: true,
      reviewedAt: true,
      subjectTags: true,
      bio: true,
      docsUrl: true,
    },
  });
  return tp;
}
