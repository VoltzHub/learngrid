"use server";

import { EarningStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/auth";

export async function getTeacherStats(teacherId: string) {
  const [earnings, classes, ratings] = await Promise.all([
    prisma.earning.aggregate({
      where: { teacherId },
      _sum: { netNgn: true },
    }),
    prisma.class.count({ where: { teacherId } }),
    prisma.rating.aggregate({
      where: { class: { teacherId } },
      _avg: { stars: true },
      _count: true,
    }),
  ]);

  const pendingEarnings = await prisma.earning.aggregate({
    where: { teacherId, status: EarningStatus.PENDING_RELEASE },
    _sum: { netNgn: true },
  });

  const releasedEarnings = await prisma.earning.aggregate({
    where: { teacherId, status: EarningStatus.RELEASED },
    _sum: { netNgn: true },
  });

  return {
    totalEarned: earnings._sum.netNgn ?? 0,
    pendingRelease: pendingEarnings._sum.netNgn ?? 0,
    availableBalance: releasedEarnings._sum.netNgn ?? 0,
    totalClasses: classes,
    avgRating: ratings._avg.stars ? Number(ratings._avg.stars.toFixed(1)) : null,
    totalRatings: ratings._count,
  };
}

export async function getTeacherEarnings(teacherId: string) {
  return prisma.earning.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
    include: {
      class: { select: { title: true, _count: { select: { enrolments: true } } } },
    },
  });
}

export async function getUpcomingClasses(teacherId: string, limit = 3) {
  return prisma.class.findMany({
    where: {
      teacherId,
      status: "LISTED",
      scheduledAt: { gte: new Date() },
    },
    orderBy: { scheduledAt: "asc" },
    take: limit,
    include: { _count: { select: { enrolments: true } } },
  });
}

export async function getDraftClasses(teacherId: string, limit = 2) {
  return prisma.class.findMany({
    where: { teacherId, status: "DRAFT" },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getTeacherNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { sentAt: "desc" },
    take: 20,
  });
}

export async function markAllNotificationsRead(userId: string) {
  const profile = await requireProfile();
  if (profile.id !== userId) return;

  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
