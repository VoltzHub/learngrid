/**
 * Demo data for investor walkthroughs.
 * - Creates a verified teacher with listed classes
 * - Creates a few students with enrolments + payments + ratings on one completed class
 * - Creates a pending-verification teacher for the admin queue
 *
 * NOTE: Auth users are NOT created here — Supabase Auth handles that. We seed
 * Profile rows directly. For demo logins, create accounts via Supabase Auth then
 * link them by setting Profile.id to their auth.users.id.
 *
 * Idempotent: re-running clears the demo rows first.
 */
import {
  PrismaClient,
  Role,
  VerificationStatus,
  ClassStatus,
  EnrolmentStatus,
  PaymentStatus,
  EarningStatus,
} from "@prisma/client";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();
const FEE_PERCENT = parseInt(process.env.PLATFORM_FEE_PERCENT ?? "15");

// Stable IDs so re-runs are deterministic.
const DEMO_TAG = "demo@learngrid.ng";

const teacherVerified = {
  id: "11111111-1111-4111-8111-111111111111",
  email: `adaeze.${DEMO_TAG}`,
  fullName: "Mrs Adaeze Okonkwo",
  phone: "+2348012345001",
};
const teacherPending = {
  id: "22222222-2222-4222-8222-222222222222",
  email: `chuks.${DEMO_TAG}`,
  fullName: "Mr Chuks Eze",
  phone: "+2348012345002",
};
const students = [
  { id: "33333333-3333-4333-8333-333333333333", email: `bola.${DEMO_TAG}`, fullName: "Bola Adekunle" },
  { id: "44444444-4444-4444-8444-444444444444", email: `ngozi.${DEMO_TAG}`, fullName: "Ngozi Umeh" },
  { id: "55555555-5555-4555-8555-555555555555", email: `tunde.${DEMO_TAG}`, fullName: "Tunde Bakare" },
  { id: "66666666-6666-4666-8666-666666666666", email: `ifeoma.${DEMO_TAG}`, fullName: "Ifeoma Nwosu" },
];

async function main() {
  console.log("Seeding demo data…");

  // Clear demo rows (cascades via FK where defined).
  await prisma.rating.deleteMany({ where: { student: { email: { endsWith: DEMO_TAG } } } });
  await prisma.earning.deleteMany({ where: { teacher: { email: { endsWith: DEMO_TAG } } } });
  await prisma.enrolment.deleteMany({ where: { student: { email: { endsWith: DEMO_TAG } } } });
  await prisma.payment.deleteMany({ where: { student: { email: { endsWith: DEMO_TAG } } } });
  await prisma.notification.deleteMany({ where: { user: { email: { endsWith: DEMO_TAG } } } });
  await prisma.class.deleteMany({ where: { teacher: { email: { endsWith: DEMO_TAG } } } });
  await prisma.teacherProfile.deleteMany({ where: { user: { email: { endsWith: DEMO_TAG } } } });
  await prisma.profile.deleteMany({ where: { email: { endsWith: DEMO_TAG } } });

  // Teachers
  await prisma.profile.create({
    data: {
      id: teacherVerified.id,
      email: teacherVerified.email,
      fullName: teacherVerified.fullName,
      phone: teacherVerified.phone,
      role: Role.TEACHER,
      teacherProfile: {
        create: {
          bio: "WAEC examiner with 12 years teaching Mathematics. Loves making algebra feel obvious.",
          subjectTags: ["Mathematics", "Further Maths"],
          verificationStatus: VerificationStatus.VERIFIED,
          reviewedAt: new Date(),
        },
      },
    },
  });

  await prisma.profile.create({
    data: {
      id: teacherPending.id,
      email: teacherPending.email,
      fullName: teacherPending.fullName,
      phone: teacherPending.phone,
      role: Role.TEACHER,
      teacherProfile: {
        create: {
          bio: "Chemistry tutor preparing students for JAMB and post-UTME exams. 8 years coaching.",
          subjectTags: ["Chemistry", "Biology"],
          verificationStatus: VerificationStatus.PENDING,
        },
      },
    },
  });

  // Students
  for (const s of students) {
    await prisma.profile.create({
      data: { id: s.id, email: s.email, fullName: s.fullName, role: Role.STUDENT },
    });
  }

  // Listed classes (future-dated)
  const now = new Date();
  const inDays = (d: number, h = 17, m = 0) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    dt.setHours(h, m, 0, 0);
    return dt;
  };

  const cover = (key: string) =>
    `https://images.unsplash.com/${key}?w=1200&q=70&auto=format&fit=crop`;

  const upcomingClasses = [
    {
      id: randomUUID(),
      title: "WAEC Mathematics Masterclass: Algebra & Inequalities",
      subject: "Mathematics",
      description: "A 90-minute deep dive on the algebra section of the WAEC syllabus. Past-paper drills, common traps, and how examiners mark.",
      scheduledAt: inDays(2),
      durationMinutes: 90,
      seatLimit: 20,
      priceNgn: 1500,
      coverImageUrl: cover("photo-1635070041078-e363dbe005cb"),
    },
    {
      id: randomUUID(),
      title: "JAMB Use of English: Comprehension Sprint",
      subject: "English",
      description: "Live walk-through of the trickiest passage types. Bring a notebook.",
      scheduledAt: inDays(3, 18),
      durationMinutes: 60,
      seatLimit: 25,
      priceNgn: 500,
      coverImageUrl: cover("photo-1456513080510-7bf3a84b82f8"),
    },
    {
      id: randomUUID(),
      title: "SS3 Physics: Electromagnetism Crash Course",
      subject: "Physics",
      description: "From Faraday's law to transformer problems, with practical worked examples.",
      scheduledAt: inDays(4, 16, 30),
      durationMinutes: 90,
      seatLimit: 15,
      priceNgn: 3000,
      coverImageUrl: cover("photo-1636466497217-26a8cbeaf0aa"),
    },
    {
      id: randomUUID(),
      title: "Igbo Language: Conversational Fluency for Students Abroad",
      subject: "Languages",
      description: "Live conversation practice and culture tips. Beginner-friendly.",
      scheduledAt: inDays(5, 19),
      durationMinutes: 60,
      seatLimit: 12,
      priceNgn: 1500,
      coverImageUrl: cover("photo-1503676260728-1c00da094a0b"),
    },
    {
      id: randomUUID(),
      title: "Coding for Teens: Build Your First Web Page",
      subject: "ICT",
      description: "Hands-on HTML + CSS class. Each student leaves with a deployed page.",
      scheduledAt: inDays(7, 17),
      durationMinutes: 90,
      seatLimit: 18,
      priceNgn: 3000,
      coverImageUrl: cover("photo-1517694712202-14dd9538aa97"),
    },
    {
      id: randomUUID(),
      title: "Pro Coaching: Cambridge A-Level Chemistry Paper 5",
      subject: "Chemistry",
      description: "Planning & design questions, with model answers from a Cambridge marker.",
      scheduledAt: inDays(6, 15),
      durationMinutes: 90,
      seatLimit: 10,
      priceNgn: 5000,
      coverImageUrl: cover("photo-1532187863486-abf9dbad1b69"),
    },
  ];

  for (const c of upcomingClasses) {
    await prisma.class.create({
      data: {
        ...c,
        teacherId: teacherVerified.id,
        status: ClassStatus.LISTED,
        sessionLink: "https://meet.google.com/demo-learngrid",
      },
    });
  }

  // A completed class with paying students + earnings + ratings
  const completedId = randomUUID();
  const completedPrice = 1500;
  const completedScheduledAt = inDays(-3, 16);
  const completedEndedAt = inDays(-3, 17, 30);

  await prisma.class.create({
    data: {
      id: completedId,
      teacherId: teacherVerified.id,
      title: "WAEC Mathematics Masterclass: Geometry Recap",
      subject: "Mathematics",
      description: "Past paper geometry walkthrough.",
      scheduledAt: completedScheduledAt,
      endedAt: completedEndedAt,
      durationMinutes: 90,
      seatLimit: 20,
      seatsEnrolled: students.length,
      priceNgn: completedPrice,
      coverImageUrl: cover("photo-1509228468518-180dd4864904"),
      status: ClassStatus.COMPLETED,
      sessionLink: "https://meet.google.com/demo-learngrid",
    },
  });

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const reference = `demo_${completedId.slice(0, 8)}_${i}`;
    const grossNgn = completedPrice;
    const feeNgn = Math.round((grossNgn * FEE_PERCENT) / 100);
    const netNgn = grossNgn - feeNgn;

    const payment = await prisma.payment.create({
      data: {
        studentId: student.id,
        classId: completedId,
        amountNgn: grossNgn,
        paystackRef: reference,
        status: PaymentStatus.SUCCEEDED,
      },
    });
    await prisma.enrolment.create({
      data: {
        classId: completedId,
        studentId: student.id,
        paymentId: payment.id,
        status: EnrolmentStatus.ATTENDED,
      },
    });
    await prisma.earning.create({
      data: {
        teacherId: teacherVerified.id,
        classId: completedId,
        grossNgn,
        feeNgn,
        netNgn,
        status: EarningStatus.RELEASED,
        releasedAt: completedEndedAt,
      },
    });
    if (i < 3) {
      await prisma.rating.create({
        data: {
          classId: completedId,
          studentId: student.id,
          stars: i === 0 ? 5 : i === 1 ? 5 : 4,
          comment:
            i === 0
              ? "Mrs Adaeze explains every step. I finally understand the geometry section."
              : i === 1
              ? "Worth every Naira. The past-paper walkthrough was gold."
              : "Great class, would join again.",
        },
      });
    }
  }

  // Also enrol a couple of students into upcoming classes so the marketplace shows seat fill
  const firstUpcoming = upcomingClasses[0];
  const secondUpcoming = upcomingClasses[1];
  for (const cls of [firstUpcoming, secondUpcoming]) {
    const seatCount = cls === firstUpcoming ? 8 : 14;
    await prisma.class.update({
      where: { id: cls.id },
      data: { seatsEnrolled: Math.min(seatCount, cls.seatLimit) },
    });
    // Real enrolments for 2 students so they have upcoming classes in their dashboard
    for (let i = 0; i < 2; i++) {
      const student = students[i];
      const ref = `demo_${cls.id.slice(0, 8)}_up${i}`;
      const payment = await prisma.payment.create({
        data: {
          studentId: student.id,
          classId: cls.id,
          amountNgn: cls.priceNgn,
          paystackRef: ref,
          status: PaymentStatus.SUCCEEDED,
        },
      });
      await prisma.enrolment.create({
        data: {
          classId: cls.id,
          studentId: student.id,
          paymentId: payment.id,
          status: EnrolmentStatus.CONFIRMED,
        },
      });
      const feeNgn = Math.round((cls.priceNgn * FEE_PERCENT) / 100);
      await prisma.earning.create({
        data: {
          teacherId: teacherVerified.id,
          classId: cls.id,
          grossNgn: cls.priceNgn,
          feeNgn,
          netNgn: cls.priceNgn - feeNgn,
          status: EarningStatus.PENDING_RELEASE,
        },
      });
    }
  }

  // A few notifications for the teacher so the page isn't empty during demo
  await prisma.notification.createMany({
    data: [
      {
        userId: teacherVerified.id,
        type: "enrollment",
        payloadJson: { title: "New student enrolled", message: 'Bola Adekunle joined "WAEC Mathematics Masterclass: Algebra & Inequalities".' },
      },
      {
        userId: teacherVerified.id,
        type: "payout",
        payloadJson: { title: "Earnings released", message: "₦5,100 from the Geometry Recap class is ready to withdraw." },
      },
      {
        userId: teacherVerified.id,
        type: "rating",
        payloadJson: { title: "New 5★ review", message: '"Worth every Naira. The past-paper walkthrough was gold."' },
      },
    ],
  });

  console.log("✓ Seed complete.");
  console.log(`  Verified teacher: ${teacherVerified.email}`);
  console.log(`  Pending teacher:  ${teacherPending.email}`);
  console.log(`  Students:         ${students.map((s) => s.email).join(", ")}`);
  console.log("  Note: create matching Supabase Auth users separately if you want to log in as them.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
