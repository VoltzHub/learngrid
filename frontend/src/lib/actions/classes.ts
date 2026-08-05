"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ClassStatus, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";
import { ALLOWED_PRICES } from "@/lib/pricing";

const createClassSchema = z.object({
  title: z.string().min(3, "Class title is required."),
  subject: z.string().min(1, "Subject is required."),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Date is required."),
  startTime: z.string().min(1, "Start time is required."),
  durationMinutes: z.coerce.number().min(15, "Duration must be at least 15 minutes."),
  seatLimit: z.coerce.number().min(1, "At least 1 seat required."),
  // R-PY: prices are platform-set, not teacher-set. Reject anything outside the tier list.
  priceNgn: z.coerce.number().refine((p) => ALLOWED_PRICES.includes(p), {
    message: "Select a valid LearnGrid price tier.",
  }),
  coverImageUrl: z
    .string()
    .url("Cover image must be a valid URL.")
    .optional()
    .or(z.literal("")),
});

export type ClassFormState = { error?: string; success?: boolean } | undefined;

export async function createClass(
  _prev: ClassFormState,
  formData: FormData
): Promise<ClassFormState> {
  const profile = await requireProfile();

  // Check teacher is verified
  const tp = await prisma.teacherProfile.findUnique({
    where: { userId: profile.id },
  });

  if (!tp) return { error: "Teacher profile not found." };

  const parsed = createClassSchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    scheduledAt: formData.get("scheduledAt"),
    startTime: formData.get("startTime"),
    durationMinutes: formData.get("durationMinutes"),
    seatLimit: formData.get("seatLimit"),
    priceNgn: formData.get("priceNgn"),
    coverImageUrl: formData.get("coverImageUrl") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { scheduledAt, startTime, ...rest } = parsed.data;
  const dateTime = new Date(`${scheduledAt}T${startTime}`);

  if (isNaN(dateTime.getTime())) {
    return { error: "Invalid date or time." };
  }

  await prisma.class.create({
    data: {
      teacherId: profile.id,
      title: rest.title,
      subject: rest.subject,
      description: rest.description ?? null,
      coverImageUrl: rest.coverImageUrl ? rest.coverImageUrl : null,
      scheduledAt: dateTime,
      durationMinutes: rest.durationMinutes,
      seatLimit: rest.seatLimit,
      priceNgn: rest.priceNgn,
      status: ClassStatus.DRAFT,
    },
  });

  revalidatePath("/dashboard/teacher/classes");
  return { success: true };
}

export async function publishClass(classId: string) {
  const profile = await requireProfile();

  const tp = await prisma.teacherProfile.findUnique({
    where: { userId: profile.id },
  });

  if (tp?.verificationStatus !== VerificationStatus.VERIFIED) {
    return { error: "You must be verified to publish classes." };
  }

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls || cls.teacherId !== profile.id) {
    return { error: "Class not found." };
  }
  if (cls.status !== ClassStatus.DRAFT) {
    return { error: "Only draft classes can be published." };
  }

  await prisma.class.update({
    where: { id: classId },
    data: { status: ClassStatus.LISTED },
  });

  revalidatePath("/dashboard/teacher/classes");
  revalidatePath(`/dashboard/teacher/classes/${classId}`);
  return { success: true };
}

export async function deleteClass(classId: string) {
  const profile = await requireProfile();

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls || cls.teacherId !== profile.id) {
    return { error: "Class not found." };
  }
  if (cls.status !== ClassStatus.DRAFT) {
    return { error: "Only draft classes can be deleted." };
  }

  await prisma.class.delete({ where: { id: classId } });
  revalidatePath("/dashboard/teacher/classes");
  redirect("/dashboard/teacher/classes");
}

export async function cancelClass(classId: string) {
  const profile = await requireProfile();

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls || cls.teacherId !== profile.id) {
    return { error: "Class not found." };
  }
  if (cls.status !== ClassStatus.LISTED) {
    return { error: "Only listed classes can be cancelled." };
  }

  await prisma.class.update({
    where: { id: classId },
    data: {
      status: ClassStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: "Cancelled by teacher",
    },
  });

  // TODO: Auto-refund enrolled students (Slice 4)

  revalidatePath("/dashboard/teacher/classes");
  revalidatePath(`/dashboard/teacher/classes/${classId}`);
  return { success: true };
}

export async function getTeacherClasses(
  teacherId: string,
  statusFilter?: ClassStatus
) {
  const where: Record<string, unknown> = { teacherId };
  if (statusFilter) where.status = statusFilter;

  return prisma.class.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    include: { _count: { select: { enrolments: true } } },
  });
}

export async function getClassDetail(classId: string) {
  return prisma.class.findUnique({
    where: { id: classId },
    include: {
      enrolments: {
        include: { student: { select: { id: true, fullName: true, email: true } } },
        orderBy: { enrolledAt: "desc" },
      },
      ratings: true,
      earnings: true,
      _count: { select: { enrolments: true } },
    },
  });
}

export async function getListedClasses() {
  return prisma.class.findMany({
    where: { status: ClassStatus.LISTED },
    orderBy: { scheduledAt: "asc" },
    include: {
      teacher: { select: { fullName: true } },
      _count: { select: { enrolments: true } },
    },
  });
}
