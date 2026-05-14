import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EnrolButton } from "./EnrolButton";
import { getEnrolmentStatus } from "@/lib/actions/enrolment";
import { getClassCover } from "@/lib/classCovers";
import { Avatar } from "@/components/Avatar";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const cls = await prisma.class.findUnique({
    where: { id: params.id },
    select: { title: true, subject: true, priceNgn: true, teacher: { select: { fullName: true } } },
  });
  if (!cls) return { title: "Class not found" };

  const title = cls.title;
  const description = `${cls.subject} · Live class with ${cls.teacher.fullName ?? "a verified LearnGrid teacher"} · ₦${cls.priceNgn.toLocaleString()} per student.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ClassDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ref?: string };
}) {
  const cls = await prisma.class.findUnique({
    where: { id: params.id },
    include: {
      teacher: {
        select: { fullName: true, avatarUrl: true },
      },
      ratings: {
        select: { stars: true, comment: true, student: { select: { fullName: true } }, submittedAt: true },
        orderBy: { submittedAt: "desc" as const },
        take: 6,
      },
      _count: { select: { enrolments: true, ratings: true } },
    },
  });

  if (!cls || cls.status === "DRAFT" || cls.status === "CANCELLED") notFound();

  // Get teacher profile separately for bio
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: cls.teacherId },
    select: { bio: true, subjectTags: true, verificationStatus: true },
  });

  const { enrolled, role, profileId } = await getEnrolmentStatus(cls.id);
  const isTeacher = profileId === cls.teacherId;

  const seatsLeft = cls.seatLimit - cls.seatsEnrolled;
  const avgRating =
    cls.ratings.length > 0
      ? (cls.ratings.reduce((a, r) => a + r.stars, 0) / cls.ratings.length).toFixed(1)
      : null;

  const dateStr = cls.scheduledAt.toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = cls.scheduledAt.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });

  const cover = getClassCover({ coverImageUrl: cls.coverImageUrl, subject: cls.subject });

  return (
    <section className="section class-detail-section">
      <div className="container class-detail-layout">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/classes">← All Classes</Link>
        </nav>

        <div className="class-detail-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" />
          <div className="class-detail-hero-overlay" />
        </div>

        <div className="class-detail-grid">
          {/* Main content */}
          <div className="class-detail-main">
            <div className="class-detail-badges">
              <span className="mkt-card-subject">{cls.subject}</span>
              {cls.status === "COMPLETED" && (
                <span className="mkt-card-full" style={{ background: "rgba(107,114,128,0.1)", color: "#6b7280" }}>Completed</span>
              )}
              {seatsLeft <= 5 && seatsLeft > 0 && cls.status === "LISTED" && (
                <span className="mkt-card-hot">{seatsLeft} seat{seatsLeft !== 1 ? "s" : ""} left</span>
              )}
              {seatsLeft <= 0 && cls.status === "LISTED" && (
                <span className="mkt-card-full">Class Full</span>
              )}
            </div>

            <h1 className="class-detail-title">{cls.title}</h1>

            {/* Teacher card */}
            <div className="class-detail-teacher">
              <Avatar name={cls.teacher.fullName} imageUrl={cls.teacher.avatarUrl} size={48} />
              <div>
                <p className="teacher-name">
                  {cls.teacher.fullName ?? "Teacher"}
                  {teacherProfile?.verificationStatus === "VERIFIED" && (
                    <span className="verified-tick" title="Verified Teacher">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
                    </span>
                  )}
                </p>
                {teacherProfile?.bio && (
                  <p className="teacher-bio">{teacherProfile.bio}</p>
                )}
              </div>
            </div>

            {/* Description */}
            {cls.description && (
              <div className="class-detail-desc">
                <h3>About this class</h3>
                <p>{cls.description}</p>
              </div>
            )}

            {/* Details grid */}
            <div className="class-detail-info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
                </div>
                <div>
                  <p className="info-label">Date</p>
                  <p className="info-value">{dateStr}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" /></svg>
                </div>
                <div>
                  <p className="info-label">Time & Duration</p>
                  <p className="info-value">{timeStr} · {cls.durationMinutes} minutes</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div>
                  <p className="info-label">Class Size</p>
                  <p className="info-value">{cls._count.enrolments} / {cls.seatLimit} students</p>
                </div>
              </div>
              {avgRating && (
                <div className="info-item">
                  <div className="info-icon" style={{ color: "#f59e0b" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2l3 6 6.5.9-4.8 4.7 1.1 6.4L12 17l-5.8 3 1.1-6.4-4.8-4.7L9 8l3-6Z" /></svg>
                  </div>
                  <div>
                    <p className="info-label">Rating</p>
                    <p className="info-value">{avgRating} / 5 ({cls._count.ratings} review{cls._count.ratings !== 1 ? "s" : ""})</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ratings */}
            {cls.ratings.length > 0 && (
              <div className="class-detail-reviews">
                <h3>Student Reviews</h3>
                <div className="reviews-grid">
                  {cls.ratings.map((r, i) => (
                    <div key={i} className="review-card">
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <svg key={j} viewBox="0 0 24 24" fill={j < r.stars ? "#f59e0b" : "#e2e8f0"} width="14" height="14">
                            <path d="M12 2l3 6 6.5.9-4.8 4.7 1.1 6.4L12 17l-5.8 3 1.1-6.4-4.8-4.7L9 8l3-6Z" />
                          </svg>
                        ))}
                      </div>
                      {r.comment && <p className="review-text">{r.comment}</p>}
                      <p className="review-author">{r.student.fullName ?? "Student"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Enrol card */}
          <aside className="class-detail-sidebar">
            <div className="enrol-card">
              <div className="enrol-price">
                <span className="enrol-price-amount">₦{cls.priceNgn.toLocaleString()}</span>
                <span className="enrol-price-label">per student</span>
              </div>

              <div className="enrol-meta">
                <div className="enrol-meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
                  <span>{dateStr}</span>
                </div>
                <div className="enrol-meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" /></svg>
                  <span>{timeStr} · {cls.durationMinutes}min</span>
                </div>
                <div className="enrol-meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  <span>{seatsLeft > 0 ? `${seatsLeft} seat${seatsLeft !== 1 ? "s" : ""} remaining` : "Class full"}</span>
                </div>
              </div>

              {enrolled && cls.sessionLink && (
                <a href={cls.sessionLink} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block">
                  Join Class →
                </a>
              )}

              {enrolled && !cls.sessionLink && (
                <div className="enrol-enrolled">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="m20 6-11 11-5-5" /></svg>
                  <span>You&apos;re enrolled! Session link coming soon.</span>
                </div>
              )}

              {!enrolled && !isTeacher && cls.status === "LISTED" && seatsLeft > 0 && (
                <EnrolButton
                  classId={cls.id}
                  amount={cls.priceNgn}
                  verifyRef={searchParams.ref}
                />
              )}

              {!enrolled && !isTeacher && (seatsLeft <= 0 || cls.status !== "LISTED") && (
                <button className="btn btn-primary btn-block" disabled style={{ opacity: 0.4 }}>
                  {cls.status === "COMPLETED" ? "Class Ended" : "Class Full"}
                </button>
              )}

              {isTeacher && (
                <Link href={`/dashboard/teacher/classes/${cls.id}`} className="btn btn-primary btn-block" style={{ textAlign: "center" }}>
                  Manage Class
                </Link>
              )}

              {!enrolled && !isTeacher && role === null && (
                <Link href={`/signin?next=/classes/${cls.id}`} className="btn btn-primary btn-block" style={{ textAlign: "center" }}>
                  Sign in to Enrol
                </Link>
              )}

              <div className="enrol-trust">
                <div className="enrol-trust-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
                  <span>Secure Paystack payment</span>
                </div>
                <div className="enrol-trust-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  <span>Verified teacher</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
