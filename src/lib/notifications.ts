import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type NotificationType = "enrollment" | "payout" | "rating" | "reminder" | "verification";

export async function createNotification(
  userId: string,
  type: NotificationType,
  payload: { title: string; message: string; [key: string]: unknown },
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        payloadJson: payload as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("Failed to create notification", err);
  }
}
