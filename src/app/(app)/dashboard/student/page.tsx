import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboardPage() {
  const profile = await requireProfile();

  const enrolments = await prisma.enrolment.findMany({
    where: { studentId: profile.id, status: "CONFIRMED" },
    include: {
      class: {
        include: {
          teacher: { select: { fullName: true } },
          _count: { select: { enrolments: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const now = new Date();
  const upcoming = enrolments.filter(
    (e) => e.class.scheduledAt > now && e.class.status !== "COMPLETED" && e.class.status !== "CANCELLED"
  );
  const past = enrolments.filter(
    (e) => e.class.scheduledAt <= now || e.class.status === "COMPLETED"
  );

  const firstName = profile.fullName?.split(" ")[0] ?? "there";
  const initials = profile.fullName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <>
      {/* Header */}
      <div className="dash-header">
        <div className="dash-avatar student-avatar">{initials}</div>
        <div>
          <p className="dash-user-name">{profile.fullName ?? "Student"}</p>
          <p className="dash-user-role">Student</p>
        </div>
      </div>

      <div style={{ padding: "18px 18px 100px" }}>
        <h2 className="dash-greeting">Hello, {firstName} 👋</h2>
        <p className="dash-greeting-sub">
          {enrolments.length > 0
            ? `You have ${upcoming.length} upcoming class${upcoming.length !== 1 ? "es" : ""}.`
            : "Discover and enrol in live classes from verified Nigerian teachers."}
        </p>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card stat-blue">
            <p className="stat-card-label">Enrolled</p>
            <p className="stat-card-value">{enrolments.length}</p>
            <p className="stat-card-sub">Total classes</p>
          </div>
          <div className="stat-card stat-green">
            <p className="stat-card-label">Upcoming</p>
            <p className="stat-card-value">{upcoming.length}</p>
            <p className="stat-card-sub">Scheduled</p>
          </div>
          <div className="stat-card stat-amber">
            <p className="stat-card-label">Completed</p>
            <p className="stat-card-value">{past.length}</p>
            <p className="stat-card-sub">Classes attended</p>
          </div>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <div className="section-title-row">
              <p className="section-title">Upcoming Classes</p>
              <Link href="/dashboard/student/classes" className="section-link">See all</Link>
            </div>
            {upcoming.slice(0, 3).map((e) => (
              <Link key={e.id} href={`/classes/${e.class.id}`} className="class-card class-card-listed">
                <div className="class-card-top">
                  <p className="class-card-title">{e.class.title}</p>
                  <span className="status-badge badge-listed">UPCOMING</span>
                </div>
                <p className="class-card-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }}><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
                  {e.class.scheduledAt.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </p>
                <div className="class-card-bottom">
                  <span className="class-card-teacher-name">by {e.class.teacher.fullName ?? "Teacher"}</span>
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

        {/* Past */}
        {past.length > 0 && (
          <>
            <div className="section-title-row" style={{ marginTop: 8 }}>
              <p className="section-title">Past Classes</p>
            </div>
            {past.slice(0, 3).map((e) => {
              const isCompleted = e.class.status === "COMPLETED";
              return (
                <Link key={e.id} href={`/classes/${e.class.id}`} className="class-card">
                  <div className="class-card-top">
                    <p className="class-card-title">{e.class.title}</p>
                    <span className={`status-badge ${isCompleted ? "badge-completed" : "badge-cancelled"}`}>
                      {isCompleted ? "COMPLETED" : e.class.status}
                    </span>
                  </div>
                  <div className="class-card-bottom">
                    <span className="class-card-teacher-name">by {e.class.teacher.fullName ?? "Teacher"}</span>
                    <span className="class-card-date-small">{e.class.scheduledAt.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</span>
                  </div>
                </Link>
              );
            })}
          </>
        )}

        {/* Empty state */}
        {enrolments.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: "var(--d-blue)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="44" height="44">
                <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />
                <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H4v17h12.5A3.5 3.5 0 0 1 20 22V5.5Z" />
              </svg>
            </div>
            <p className="empty-state-title">No classes yet</p>
            <p className="empty-state-desc">
              Browse live classes from verified teachers across Nigeria and start learning today.
            </p>
            <Link className="btn btn-primary btn-block" href="/classes">
              Browse Classes
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <StudentBottomNav active="home" />
    </>
  );
}

function StudentBottomNav({ active }: { active: "home" | "classes" | "browse" | "profile" }) {
  const items = [
    { href: "/dashboard/student", label: "Home", key: "home", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z" /></svg> },
    { href: "/dashboard/student/classes", label: "Classes", key: "classes", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H4v17h12.5A3.5 3.5 0 0 1 20 22V5.5Z" /></svg> },
    { href: "/classes", label: "Browse", key: "browse", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> },
    { href: "/dashboard/student/profile", label: "Profile", key: "profile", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg> },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link key={item.key} href={item.href} className={`bottom-nav-item${active === item.key ? " active" : ""}`}>
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
