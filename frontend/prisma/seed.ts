/**
 * Demo data for investor walkthroughs.
 *
 * What this seed does:
 * - Creates real Supabase Auth users (so you can actually log in)
 * - Links each one to a Profile row in our Postgres DB
 * - Spreads classes across multiple subject-matched teachers
 * - Seeds a completed class with payments + earnings + ratings so the
 *   teacher dashboard + earnings page tell the full money story
 *
 * Idempotent: re-running deletes the existing demo auth users + rows first.
 *
 * Login credentials for every seeded user (so you can demo all roles):
 *   password: Learngrid2026!
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
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();
const FEE_PERCENT = parseInt(process.env.PLATFORM_FEE_PERCENT ?? "15");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env to run the seed.");
}
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_TAG = "demo@learngrid.ng";
const DEMO_PASSWORD = "Learngrid2026!";

const cover = (key: string) =>
  `https://images.unsplash.com/${key}?w=1200&q=70&auto=format&fit=crop`;

type SeedTeacher = {
  email: string;
  fullName: string;
  phone: string;
  bio: string;
  subjectTags: string[];
  verificationStatus: VerificationStatus;
};

type SeedStudent = {
  email: string;
  fullName: string;
};

const teachers: SeedTeacher[] = [
  {
    email: `adaeze.${DEMO_TAG}`,
    fullName: "Mrs Adaeze Okonkwo",
    phone: "+2348012345001",
    bio: "WAEC examiner with 12 years teaching Mathematics. Loves making algebra feel obvious.",
    subjectTags: ["Mathematics", "Further Maths"],
    verificationStatus: VerificationStatus.VERIFIED,
  },
  {
    email: `tunde.teacher.${DEMO_TAG}`,
    fullName: "Mr Tunde Adesanya",
    phone: "+2348012345003",
    bio: "English Language tutor and published author. Specialises in JAMB and post-UTME prep.",
    subjectTags: ["English", "Literature"],
    verificationStatus: VerificationStatus.VERIFIED,
  },
  {
    email: `okeke.${DEMO_TAG}`,
    fullName: "Dr Emmanuel Okeke",
    phone: "+2348012345004",
    bio: "PhD in Theoretical Physics. Teaches SS3 Physics and A-Level prep with worked-example energy.",
    subjectTags: ["Physics"],
    verificationStatus: VerificationStatus.VERIFIED,
  },
  {
    email: `adebayo.${DEMO_TAG}`,
    fullName: "Mrs Funmi Adebayo",
    phone: "+2348012345005",
    bio: "Cambridge-trained Chemistry teacher. 15 years coaching A-Level and IGCSE students worldwide.",
    subjectTags: ["Chemistry"],
    verificationStatus: VerificationStatus.VERIFIED,
  },
  {
    email: `daniel.${DEMO_TAG}`,
    fullName: "Mr Daniel Igwe",
    phone: "+2348012345006",
    bio: "Software engineer turned teacher. Runs hands-on coding bootcamps for teenagers.",
    subjectTags: ["ICT", "Computing"],
    verificationStatus: VerificationStatus.VERIFIED,
  },
  {
    email: `nkechi.${DEMO_TAG}`,
    fullName: "Mrs Nkechi Eze",
    phone: "+2348012345007",
    bio: "Native Igbo speaker. Teaches conversational Igbo and Yoruba to students abroad.",
    subjectTags: ["Languages", "Igbo"],
    verificationStatus: VerificationStatus.VERIFIED,
  },
  {
    email: `chuks.${DEMO_TAG}`,
    fullName: "Mr Chuks Eze",
    phone: "+2348012345002",
    bio: "Chemistry tutor preparing students for JAMB and post-UTME exams. 8 years coaching.",
    subjectTags: ["Chemistry", "Biology"],
    verificationStatus: VerificationStatus.PENDING,
  },
];

const students: SeedStudent[] = [
  { email: `bola.${DEMO_TAG}`, fullName: "Bola Adekunle" },
  { email: `ngozi.${DEMO_TAG}`, fullName: "Ngozi Umeh" },
  { email: `tunde.${DEMO_TAG}`, fullName: "Tunde Bakare" },
  { email: `ifeoma.${DEMO_TAG}`, fullName: "Ifeoma Nwosu" },
];

const adminUser = {
  email: `admin.${DEMO_TAG}`,
  fullName: "LearnGrid Ops",
};

async function retry<T>(label: string, fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = 500 * Math.pow(2, i);
      console.log(`    retry ${label} (${i + 1}/${attempts}) in ${wait}ms…`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

/** Load every existing auth user once so we don't paginate per email. */
async function loadExistingAuthUsers(): Promise<Map<string, string>> {
  const byEmail = new Map<string, string>();
  let page = 1;
  while (true) {
    const { data, error } = await retry("listUsers", () =>
      admin.auth.admin.listUsers({ page, perPage: 200 }),
    );
    if (error) throw error;
    for (const u of data.users) {
      if (u.email) byEmail.set(u.email.toLowerCase(), u.id);
    }
    if (data.users.length < 200) break;
    page += 1;
  }
  return byEmail;
}

/** Idempotent helper: ensures an auth user exists with the given email + password, returns its UUID. */
async function ensureAuthUser(email: string, existing: Map<string, string>): Promise<string> {
  const found = existing.get(email.toLowerCase());
  if (found) {
    await retry(`updateUser ${email}`, () =>
      admin.auth.admin.updateUserById(found, {
        password: DEMO_PASSWORD,
        email_confirm: true,
      }),
    );
    return found;
  }
  const { data: created, error: createErr } = await retry(`createUser ${email}`, () =>
    admin.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
    }),
  );
  if (createErr || !created.user) throw createErr ?? new Error("Failed to create auth user");
  existing.set(email.toLowerCase(), created.user.id);
  return created.user.id;
}

async function main() {
  console.log("Seeding demo data…");

  // 1. Clear demo Profile rows + dependents (auth users are reused, just re-linked).
  console.log("  Clearing existing demo rows…");
  await prisma.rating.deleteMany({ where: { student: { email: { endsWith: DEMO_TAG } } } });
  await prisma.earning.deleteMany({ where: { teacher: { email: { endsWith: DEMO_TAG } } } });
  await prisma.enrolment.deleteMany({ where: { student: { email: { endsWith: DEMO_TAG } } } });
  await prisma.payment.deleteMany({ where: { student: { email: { endsWith: DEMO_TAG } } } });
  await prisma.notification.deleteMany({ where: { user: { email: { endsWith: DEMO_TAG } } } });
  await prisma.class.deleteMany({ where: { teacher: { email: { endsWith: DEMO_TAG } } } });
  await prisma.teacherProfile.deleteMany({ where: { user: { email: { endsWith: DEMO_TAG } } } });
  await prisma.profile.deleteMany({ where: { email: { endsWith: DEMO_TAG } } });

  // 2. Ensure auth users exist, capture their UUIDs.
  console.log("  Ensuring Supabase Auth users (password: Learngrid2026!)…");
  const existing = await loadExistingAuthUsers();
  const teacherIds: Record<string, string> = {};
  for (const t of teachers) {
    teacherIds[t.email] = await ensureAuthUser(t.email, existing);
  }
  const studentIds: Record<string, string> = {};
  for (const s of students) {
    studentIds[s.email] = await ensureAuthUser(s.email, existing);
  }
  const adminId = await ensureAuthUser(adminUser.email, existing);

  // 3. Profile rows linked to the auth users.
  for (const t of teachers) {
    await prisma.profile.create({
      data: {
        id: teacherIds[t.email],
        email: t.email,
        fullName: t.fullName,
        phone: t.phone,
        role: Role.TEACHER,
        teacherProfile: {
          create: {
            bio: t.bio,
            subjectTags: t.subjectTags,
            verificationStatus: t.verificationStatus,
            reviewedAt: t.verificationStatus === VerificationStatus.VERIFIED ? new Date() : null,
          },
        },
      },
    });
  }
  for (const s of students) {
    await prisma.profile.create({
      data: { id: studentIds[s.email], email: s.email, fullName: s.fullName, role: Role.STUDENT },
    });
  }
  await prisma.profile.create({
    data: {
      id: adminId,
      email: adminUser.email,
      fullName: adminUser.fullName,
      role: Role.ADMIN,
    },
  });

  // 4. Listed classes, each owned by a subject-matched verified teacher.
  const now = new Date();
  const inDays = (d: number, h = 17, m = 0) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    dt.setHours(h, m, 0, 0);
    return dt;
  };

  const upcomingClasses = [
    {
      teacherEmail: `adaeze.${DEMO_TAG}`,
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
      teacherEmail: `tunde.teacher.${DEMO_TAG}`,
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
      teacherEmail: `okeke.${DEMO_TAG}`,
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
      teacherEmail: `nkechi.${DEMO_TAG}`,
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
      teacherEmail: `daniel.${DEMO_TAG}`,
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
      teacherEmail: `adebayo.${DEMO_TAG}`,
      title: "Pro Coaching: Cambridge A-Level Chemistry Paper 5",
      subject: "Chemistry",
      description: "Planning & design questions, with model answers from a Cambridge marker.",
      scheduledAt: inDays(6, 15),
      durationMinutes: 90,
      seatLimit: 10,
      priceNgn: 5000,
      coverImageUrl: cover("photo-1532187863486-abf9dbad1b69"),
    },
    {
      teacherEmail: `adaeze.${DEMO_TAG}`,
      title: "WAEC Further Maths: Calculus Walk-through",
      subject: "Further Maths",
      description: "Differentiation and integration techniques aimed at the November exams.",
      scheduledAt: inDays(8, 17),
      durationMinutes: 90,
      seatLimit: 20,
      priceNgn: 1500,
      coverImageUrl: cover("photo-1509228468518-180dd4864904"),
    },
    {
      teacherEmail: `tunde.teacher.${DEMO_TAG}`,
      title: "Literature in English: Things Fall Apart Deep Read",
      subject: "Literature",
      description: "Themes, character study, and likely essay prompts for the WAEC paper.",
      scheduledAt: inDays(9, 18),
      durationMinutes: 75,
      seatLimit: 22,
      priceNgn: 1500,
      coverImageUrl: cover("photo-1461360370896-922624d12aa1"),
    },
  ];

  const createdClasses: { id: string; teacherId: string; priceNgn: number; seatLimit: number; title: string }[] = [];
  for (const c of upcomingClasses) {
    const teacherId = teacherIds[c.teacherEmail];
    const created = await prisma.class.create({
      data: {
        id: randomUUID(),
        teacherId,
        title: c.title,
        subject: c.subject,
        description: c.description,
        scheduledAt: c.scheduledAt,
        durationMinutes: c.durationMinutes,
        seatLimit: c.seatLimit,
        priceNgn: c.priceNgn,
        coverImageUrl: c.coverImageUrl,
        status: ClassStatus.LISTED,
        sessionLink: "https://meet.google.com/demo-learngrid",
      },
    });
    createdClasses.push({
      id: created.id,
      teacherId,
      priceNgn: created.priceNgn,
      seatLimit: created.seatLimit,
      title: created.title,
    });
  }

  // 5. A completed class for Mrs Adaeze with paying students + earnings + ratings.
  const completedId = randomUUID();
  const completedPrice = 1500;
  const completedScheduledAt = inDays(-3, 16);
  const completedEndedAt = inDays(-3, 17, 30);

  await prisma.class.create({
    data: {
      id: completedId,
      teacherId: teacherIds[`adaeze.${DEMO_TAG}`],
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
        studentId: studentIds[student.email],
        classId: completedId,
        amountNgn: grossNgn,
        paystackRef: reference,
        status: PaymentStatus.SUCCEEDED,
      },
    });
    await prisma.enrolment.create({
      data: {
        classId: completedId,
        studentId: studentIds[student.email],
        paymentId: payment.id,
        status: EnrolmentStatus.ATTENDED,
      },
    });
    await prisma.earning.create({
      data: {
        teacherId: teacherIds[`adaeze.${DEMO_TAG}`],
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
          studentId: studentIds[student.email],
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

  // 6. Bump seat counts on a couple of upcoming classes so the marketplace looks alive.
  if (createdClasses[0]) {
    await prisma.class.update({
      where: { id: createdClasses[0].id },
      data: { seatsEnrolled: 8 },
    });
    for (let i = 0; i < 2; i++) {
      const student = students[i];
      const ref = `demo_${createdClasses[0].id.slice(0, 8)}_up${i}`;
      const payment = await prisma.payment.create({
        data: {
          studentId: studentIds[student.email],
          classId: createdClasses[0].id,
          amountNgn: createdClasses[0].priceNgn,
          paystackRef: ref,
          status: PaymentStatus.SUCCEEDED,
        },
      });
      await prisma.enrolment.create({
        data: {
          classId: createdClasses[0].id,
          studentId: studentIds[student.email],
          paymentId: payment.id,
          status: EnrolmentStatus.CONFIRMED,
        },
      });
      const feeNgn = Math.round((createdClasses[0].priceNgn * FEE_PERCENT) / 100);
      await prisma.earning.create({
        data: {
          teacherId: createdClasses[0].teacherId,
          classId: createdClasses[0].id,
          grossNgn: createdClasses[0].priceNgn,
          feeNgn,
          netNgn: createdClasses[0].priceNgn - feeNgn,
          status: EarningStatus.PENDING_RELEASE,
        },
      });
    }
  }

  // 7. A few notifications for Mrs Adaeze so the bell isn't empty during demo.
  await prisma.notification.createMany({
    data: [
      {
        userId: teacherIds[`adaeze.${DEMO_TAG}`],
        type: "enrollment",
        payloadJson: { title: "New student enrolled", message: 'Bola Adekunle joined "WAEC Mathematics Masterclass: Algebra & Inequalities".' },
      },
      {
        userId: teacherIds[`adaeze.${DEMO_TAG}`],
        type: "payout",
        payloadJson: { title: "Earnings released", message: "₦5,100 from the Geometry Recap class is ready to withdraw." },
      },
      {
        userId: teacherIds[`adaeze.${DEMO_TAG}`],
        type: "rating",
        payloadJson: { title: "New 5★ review", message: '"Worth every Naira. The past-paper walkthrough was gold."' },
      },
    ],
  });

  console.log("✓ Seed complete.");
  console.log("");
  console.log("  All seeded accounts use password: Learngrid2026!");
  console.log("");
  console.log("  Admin:");
  console.log(`    ${adminUser.email}`);
  console.log("  Verified teachers:");
  for (const t of teachers.filter((x) => x.verificationStatus === VerificationStatus.VERIFIED)) {
    console.log(`    ${t.email}  (${t.fullName} · ${t.subjectTags.join(", ")})`);
  }
  console.log("  Pending teacher (will appear in admin verification queue):");
  for (const t of teachers.filter((x) => x.verificationStatus === VerificationStatus.PENDING)) {
    console.log(`    ${t.email}  (${t.fullName})`);
  }
  console.log("  Students:");
  for (const s of students) {
    console.log(`    ${s.email}  (${s.fullName})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
