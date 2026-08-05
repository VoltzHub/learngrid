"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { EarningStatus, PayoutStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const withdrawSchema = z.object({
  bankAccountNumber: z.string().regex(/^\d{10}$/, "Enter a 10-digit NUBAN account number."),
  bankCode: z.string().min(2, "Select a bank."),
  bankAccountName: z.string().min(2, "Enter the account holder name."),
});

export type WithdrawState = { error?: string; success?: boolean } | undefined;

export async function requestWithdrawal(
  _prev: WithdrawState,
  formData: FormData,
): Promise<WithdrawState> {
  const profile = await requireProfile();
  if (profile.role !== Role.TEACHER) {
    return { error: "Only teachers can request withdrawals." };
  }

  const parsed = withdrawSchema.safeParse({
    bankAccountNumber: formData.get("bankAccountNumber"),
    bankCode: formData.get("bankCode"),
    bankAccountName: formData.get("bankAccountName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid bank details." };
  }

  const released = await prisma.earning.findMany({
    where: { teacherId: profile.id, status: EarningStatus.RELEASED, payoutId: null },
    select: { id: true, netNgn: true },
  });
  const amount = released.reduce((sum, e) => sum + e.netNgn, 0);
  if (amount <= 0) {
    return { error: "No earnings available for withdrawal yet." };
  }

  await prisma.teacherProfile.update({
    where: { userId: profile.id },
    data: {
      bankAccountNumber: parsed.data.bankAccountNumber,
      bankCode: parsed.data.bankCode,
      bankAccountName: parsed.data.bankAccountName,
    },
  });

  const payout = await prisma.payout.create({
    data: {
      teacherId: profile.id,
      amountNgn: amount,
      status: PayoutStatus.PENDING,
    },
  });

  await prisma.earning.updateMany({
    where: { id: { in: released.map((e) => e.id) } },
    data: { payoutId: payout.id },
  });

  await createNotification(profile.id, "payout", {
    title: "Withdrawal requested",
    message: `₦${amount.toLocaleString()} payout is being processed.`,
  });

  revalidatePath("/dashboard/teacher/earnings");
  revalidatePath("/dashboard/teacher/withdraw");
  revalidatePath("/dashboard/admin/payouts");
  return { success: true };
}

export async function markPayoutPaid(payoutId: string) {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) throw new Error("Unauthorized");

  const payout = await prisma.payout.update({
    where: { id: payoutId },
    data: {
      status: PayoutStatus.PAID,
      processedAt: new Date(),
      paystackRef: `mock_payout_${Date.now()}`,
    },
  });

  await createNotification(payout.teacherId, "payout", {
    title: "Payout sent",
    message: `₦${payout.amountNgn.toLocaleString()} has been transferred to your bank.`,
  });

  revalidatePath("/dashboard/admin/payouts");
  revalidatePath("/dashboard/teacher/earnings");
  return { success: true };
}
