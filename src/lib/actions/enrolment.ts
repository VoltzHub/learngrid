"use server";

import { revalidatePath } from "next/cache";
import { ClassStatus, EnrolmentStatus, PaymentStatus, EarningStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const FEE_PERCENT = parseInt(process.env.PLATFORM_FEE_PERCENT ?? "15");

export type EnrolResult = {
  error?: string;
  success?: boolean;
  reference?: string;
  authorizationUrl?: string;
  accessCode?: string;
  amountKobo?: number;
  email?: string;
};

/** Step 1: Initialize a Paystack transaction for a class */
export async function initializePayment(classId: string): Promise<EnrolResult> {
  const profile = await requireProfile();

  // Check class exists and is enrollable
  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls || cls.status !== ClassStatus.LISTED) {
    return { error: "This class is not available for enrolment." };
  }

  if (cls.seatsEnrolled >= cls.seatLimit) {
    return { error: "This class is full." };
  }

  // Check not already enrolled
  const existing = await prisma.enrolment.findUnique({
    where: { classId_studentId: { classId, studentId: profile.id } },
  });
  if (existing) {
    return { error: "You are already enrolled in this class." };
  }

  // Check not the teacher
  if (cls.teacherId === profile.id) {
    return { error: "You cannot enrol in your own class." };
  }

  const reference = `lg_${classId.slice(0, 8)}_${Date.now()}`;
  const amountKobo = cls.priceNgn * 100; // Paystack uses kobo

  // Create payment record
  await prisma.payment.create({
    data: {
      studentId: profile.id,
      classId,
      amountNgn: cls.priceNgn,
      paystackRef: reference,
      status: PaymentStatus.INITIATED,
    },
  });

  // Initialize with Paystack
  try {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        amount: amountKobo,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/classes/${classId}?ref=${reference}`,
        metadata: {
          classId,
          studentId: profile.id,
          className: cls.title,
        },
      }),
    });

    const json = await res.json();

    if (!json.status) {
      return { error: json.message || "Payment initialization failed." };
    }

    return {
      success: true,
      reference,
      authorizationUrl: json.data.authorization_url,
      accessCode: json.data.access_code,
      amountKobo,
      email: profile.email,
    };
  } catch {
    return { error: "Could not connect to payment provider." };
  }
}

/** Step 2: Verify payment and complete enrolment */
export async function verifyAndEnrol(reference: string): Promise<EnrolResult> {
  const profile = await requireProfile();

  // Find the payment record
  const payment = await prisma.payment.findUnique({
    where: { paystackRef: reference },
    include: { class: true },
  });

  if (!payment) return { error: "Payment not found." };
  if (payment.studentId !== profile.id) return { error: "Unauthorized." };
  if (payment.status === PaymentStatus.SUCCEEDED) {
    return { success: true }; // Already processed
  }

  // Verify with Paystack
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const json = await res.json();

    if (!json.status || json.data.status !== "success") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED, failedAt: new Date(), failedReason: "Verification failed" },
      });
      return { error: "Payment verification failed. Please try again." };
    }
  } catch {
    return { error: "Could not verify payment. Please try again." };
  }

  // Process enrolment in a transaction
  const grossNgn = payment.amountNgn;
  const feeNgn = Math.round(grossNgn * FEE_PERCENT / 100);
  const netNgn = grossNgn - feeNgn;

  await prisma.$transaction([
    // Update payment status
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCEEDED },
    }),
    // Create enrolment
    prisma.enrolment.create({
      data: {
        classId: payment.classId,
        studentId: profile.id,
        paymentId: payment.id,
        status: EnrolmentStatus.CONFIRMED,
      },
    }),
    // Increment seat count
    prisma.class.update({
      where: { id: payment.classId },
      data: { seatsEnrolled: { increment: 1 } },
    }),
    // Create earning for teacher
    prisma.earning.create({
      data: {
        teacherId: payment.class.teacherId,
        classId: payment.classId,
        grossNgn,
        feeNgn,
        netNgn,
        status: EarningStatus.PENDING_RELEASE,
      },
    }),
  ]);

  await createNotification(payment.class.teacherId, "enrollment", {
    title: "New student enrolled",
    message: `Someone just enrolled in "${payment.class.title}".`,
    classId: payment.classId,
  });
  await createNotification(profile.id, "enrollment", {
    title: "You're enrolled!",
    message: `You're in for "${payment.class.title}". We'll send the join link before class.`,
    classId: payment.classId,
  });

  revalidatePath(`/classes/${payment.classId}`);
  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/classes");
  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/teacher/earnings");

  return { success: true };
}

/** Check if current user is enrolled in a class */
export async function getEnrolmentStatus(classId: string) {
  const profile = await requireProfile().catch(() => null);
  if (!profile) return { enrolled: false, role: null as string | null };

  const enrolment = await prisma.enrolment.findUnique({
    where: { classId_studentId: { classId, studentId: profile.id } },
  });

  return {
    enrolled: !!enrolment,
    role: profile.role,
    profileId: profile.id,
  };
}
