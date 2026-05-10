import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTeacherStats, getUpcomingClasses, getDraftClasses } from "@/lib/actions/earnings";

export default async function TeacherDashboardPage() {
  const profile = await requireProfile();
  const tp = await prisma.teacherProfile.findUnique({ where: { userId: profile.id } });
  const verified = tp?.verificationStatus === "VERIFIED";

  const stats = await getTeacherStats(profile.id);
  const upcoming = await getUpcomingClasses(profile.id);
  const drafts = await getDraftClasses(profile.id);

  const firstName = profile.fullName?.split(" ")[0] ?? "there";
  const initials = profile.fullName?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";
  const hasData = stats.totalClasses > 0;

  return (
    <>
      {/* Header */}
      <div className="dash-header">
        <div className="dash-avatar">{initials}</div>
        <div>
          <p className="dash-user-name">{profile.fullName ?? "Teacher"}</p>
          {verified && <div className="dash-verified-badge">✓ Verified Teacher</div>}
        </div>
        <Link href="/dashboard/teacher/notifications" className="dash-bell">
          🔔
        </Link>
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>
          Hello, {firstName}! 👋
        </h2>
        <p style={{ fontSize: 13, color: "var(--d-gray-500)", margin: "0 0 16px" }}>
          {hasData ? "Here's how your classes are doing." : "You're verified. Time to start teaching!"}
        </p>

        {/* Stats Grid */}
        <div className="stat-grid">
          <div className="stat-card stat-blue">
            <p className="stat-card-label">Total Earned</p>
            <p className="stat-card-value">₦{stats.totalEarned.toLocaleString()}</p>
            <p className="stat-card-sub">All time</p>
          </div>
          <div className="stat-card stat-amber">
            <p className="stat-card-label">Pending</p>
            <p className="stat-card-value">₦{stats.pendingRelease.toLocaleString()}</p>
            <p className="stat-card-sub">Awaiting release</p>
          </div>
          <div className="stat-card stat-green">
            <p className="stat-card-label">Classes</p>
            <p className="stat-card-value">{stats.totalClasses}</p>
            <p className="stat-card-sub">Created</p>
          </div>
          <div className="stat-card stat-gray">
            <p className="stat-card-label">Rating</p>
            <p className="stat-card-value">{stats.avgRating ? `${stats.avgRating} ★` : "—"}</p>
            <p className="stat-card-sub">{stats.totalRatings > 0 ? `${stats.totalRatings} ratings` : "No ratings yet"}</p>
          </div>
        </div>

        {/* Empty state CTA */}
        {!hasData && verified && (
          <div style={{ background: "var(--d-blue-light)", border: "1px solid rgba(26,86,219,0.15)", borderRadius: 14, padding: 22, textAlign: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>📚</div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>Create your first live class</p>
            <p style={{ fontSize: 13, color: "var(--d-gray-500)", margin: "0 0 16px", lineHeight: 1.5 }}>
              You&apos;re verified and ready. Start earning in Naira today.
            </p>
            <Link className="btn btn-primary btn-block" href="/dashboard/teacher/classes/new">
              + Create a Live Class
            </Link>
          </div>
        )}

        {/* Upcoming classes */}
        {upcoming.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Upcoming Classes</p>
              <Link href="/dashboard/teacher/classes" style={{ fontSize: 13, color: "var(--d-blue)", fontWeight: 600 }}>See all</Link>
            </div>
            {upcoming.map((cls) => (
              <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`} className={`class-card class-card-listed`}>
                <div className="class-card-top">
                  <p className="class-card-title">{cls.title}</p>
                  <span className="status-badge badge-listed">LISTED</span>
                </div>
                <p className="class-card-date">📅 {cls.scheduledAt.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                <div className="class-card-bottom">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="class-card-price">₦{cls.priceNgn.toLocaleString()}</span>
                    <span className="class-card-seats">· {cls._count.enrolments}/{cls.seatLimit}</span>
                  </div>
                  <span className="class-card-link">View →</span>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* Draft classes */}
        {drafts.length > 0 && drafts.map((cls) => (
          <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--d-gray-50)", border: "1px dashed var(--d-gray-300)", borderRadius: 12, padding: 14, marginBottom: 12, textDecoration: "none", color: "inherit" }}>
            <span style={{ fontSize: 20 }}>📝</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--d-gray-700)" }}>{cls.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--d-gray-500)" }}>Draft · Not visible to students</p>
            </div>
            <span style={{ fontSize: 12, color: "var(--d-blue)", fontWeight: 600 }}>Edit →</span>
          </Link>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ marginTop: "auto" }} />
      <nav className="bottom-nav">
        <Link href="/dashboard/teacher" className="bottom-nav-item active">
          <span className="bottom-nav-icon">⊞</span>
          <span className="bottom-nav-label">Home</span>
        </Link>
        <Link href="/dashboard/teacher/classes" className="bottom-nav-item">
          <span className="bottom-nav-icon">☰</span>
          <span className="bottom-nav-label">Classes</span>
        </Link>
        <div className="bottom-nav-fab">
          <Link href="/dashboard/teacher/classes/new" className="bottom-nav-fab-btn">+</Link>
        </div>
        <Link href="/dashboard/teacher/earnings" className="bottom-nav-item">
          <span className="bottom-nav-icon">₦</span>
          <span className="bottom-nav-label">Earn</span>
        </Link>
        <Link href="/dashboard/teacher/profile" className="bottom-nav-item">
          <span className="bottom-nav-icon">◉</span>
          <span className="bottom-nav-label">Profile</span>
        </Link>
      </nav>
    </>
  );
}
