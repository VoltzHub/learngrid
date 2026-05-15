"use server";

import { prisma } from "@/lib/prisma";

export type LandingStats = {
  students: number;
  verifiedTeachers: number;
  classesCompleted: number;
};

// Baseline launch numbers used both as the floor for live counts and as
// fallbacks when the database is unreachable (e.g. Supabase free-tier auto-pause).
// Critical: the public landing page MUST render even if the DB is down.
const BASELINE: LandingStats = {
  students: 120,
  verifiedTeachers: 25,
  classesCompleted: 40,
};

export async function getLandingStats(): Promise<LandingStats> {
  try {
    const [studentCount, verifiedTeacherCount, completedCount] = await Promise.all([
      prisma.profile.count({ where: { role: "STUDENT" } }),
      prisma.teacherProfile.count({ where: { verificationStatus: "VERIFIED" } }),
      prisma.class.count({ where: { status: "COMPLETED" } }),
    ]);
    return {
      students: Math.max(studentCount, BASELINE.students),
      verifiedTeachers: Math.max(verifiedTeacherCount, BASELINE.verifiedTeachers),
      classesCompleted: Math.max(completedCount, BASELINE.classesCompleted),
    };
  } catch (err) {
    console.error("[getLandingStats] DB unreachable, using baseline:", err);
    return BASELINE;
  }
}
