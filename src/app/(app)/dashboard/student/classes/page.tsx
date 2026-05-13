import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentClassesPage() {
  const profile = await requireProfile();

  const enrolments = await prisma.enrolment.findMany({
    where: { studentId: profile.id },
    include: {
      class: {
        include: {
          teacher: { select: { fullName: true } },
          ratings: {
            where: { studentId: profile.id },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const now = new Date();
  const upcoming = enrolments.filter(
    (e) => e.class.scheduledAt > now && e.class.status !== "COMPLETED" && e.class.status !== "CANCELLED"
  );
  const completed = enrolments.filter((e) => e.class.status === "COMPLETED");

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", padding: "14px 18px 0", borderBottom: "1px solid var(--d-gray-200)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>My Classes</h2>
      </div>

      <div style={{ padding: "14px 18px 100px" }}>
        {enrolments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: "var(--d-blue)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="44" height="44">
                <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />
              </svg>
            </div>
            <p className="empty-state-title">No classes yet</p>
            <p className="empty-state-desc">Enrol in your first class to start learning.</p>
            <Link className="btn btn-primary btn-block" href="/classes">Browse Classes</Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--d-gray-500)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Upcoming</p>
                {upcoming.map((e) => (
                  <Link key={e.id} href={`/classes/${e.class.id}`} className="class-card class-card-listed">
                    <div className="class-card-top">
                      <p className="class-card-title">{e.class.title}</p>
                      <span className="status-badge badge-listed">UPCOMING</span>
                    </div>
                    <p className="class-card-date">
                      {e.class.scheduledAt.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                    <div className="class-card-bottom">
                      <span className="class-card-teacher-name">by {e.class.teacher.fullName}</span>
                      {e.class.sessionLink ? (
                        <span className="class-card-link" style={{ color: "var(--success)" }}>Join →</span>
                      ) : (
                        <span className="class-card-link">View →</span>
                      )}
                    </div>
                  </Link>
                ))}
              </>
            )}

            {completed.length > 0 && (
              <>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--d-gray-500)", margin: "16px 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Completed</p>
                {completed.map((e) => {
                  const hasRated = e.class.ratings.length > 0;
                  return (
                    <div key={e.id} className="class-card">
                      <div className="class-card-top">
                        <p className="class-card-title">{e.class.title}</p>
                        <span className="status-badge badge-completed">DONE</span>
                      </div>
                      <div className="class-card-bottom">
                        <span className="class-card-teacher-name">by {e.class.teacher.fullName}</span>
                        {!hasRated ? (
                          <Link href={`/dashboard/student/classes/${e.class.id}/rate`} className="class-card-link" style={{ color: "var(--d-amber)", fontWeight: 700 }}>
                            ★ Rate
                          </Link>
                        ) : (
                          <span className="class-card-date-small" style={{ color: "var(--d-green)" }}>✓ Rated</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
