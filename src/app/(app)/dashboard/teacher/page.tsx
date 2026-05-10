import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTeacherStats, getUpcomingClasses, getDraftClasses } from "@/lib/actions/earnings";
import { Icon } from "@/components/Icons";
import { TeacherBottomNav } from "@/components/TeacherBottomNav";

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
      <div className="dash-header">
        <div className="dash-avatar">{initials}</div>
        <div>
          <p className="dash-user-name">{profile.fullName ?? "Teacher"}</p>
          {verified && (
            <div className="dash-verified-badge">
              <Icon name="check" size={12} /> Verified Teacher
            </div>
          )}
        </div>
        <Link href="/dashboard/teacher/notifications" className="dash-bell" aria-label="Notifications">
          <Icon name="bell" size={18} />
        </Link>
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>
          Hello, {firstName}
        </h2>
        <p style={{ fontSize: 13, color: "var(--d-gray-500)", margin: "0 0 16px" }}>
          {hasData ? "Here's how your classes are doing." : "You're verified. Time to start teaching!"}
        </p>

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
            <p className="stat-card-value" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {stats.avgRating ? (
                <>
                  {stats.avgRating} <Icon name="star" size={16} style={{ color: "var(--d-amber)" }} />
                </>
              ) : (
                "-"
              )}
            </p>
            <p className="stat-card-sub">{stats.totalRatings > 0 ? `${stats.totalRatings} ratings` : "No ratings yet"}</p>
          </div>
        </div>

        {!hasData && verified && (
          <div style={{ background: "var(--d-blue-light)", border: "1px solid rgba(26,86,219,0.15)", borderRadius: 14, padding: 22, textAlign: "center", marginBottom: 18 }}>
            <div className="empty-state-icon" style={{ color: "var(--d-blue)" }}>
              <Icon name="bookOpen" size={38} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>Create your first live class</p>
            <p style={{ fontSize: 13, color: "var(--d-gray-500)", margin: "0 0 16px", lineHeight: 1.5 }}>
              You&apos;re verified and ready. Start earning in Naira today.
            </p>
            <Link className="btn btn-primary btn-block" href="/dashboard/teacher/classes/new">
              + Create a Live Class
            </Link>
          </div>
        )}

        {upcoming.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Upcoming Classes</p>
              <Link href="/dashboard/teacher/classes" style={{ fontSize: 13, color: "var(--d-blue)", fontWeight: 600 }}>See all</Link>
            </div>
            {upcoming.map((cls) => (
              <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`} className="class-card class-card-listed">
                <div className="class-card-top">
                  <p className="class-card-title">{cls.title}</p>
                  <span className="status-badge badge-listed">LISTED</span>
                </div>
                <p className="class-card-date" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="calendar" size={14} /> {cls.scheduledAt.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </p>
                <div className="class-card-bottom">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="class-card-price">₦{cls.priceNgn.toLocaleString()}</span>
                    <span className="class-card-seats">· {cls._count.enrolments}/{cls.seatLimit}</span>
                  </div>
                  <span className="class-card-link">View <Icon name="arrowRight" size={12} style={{ display: "inline" }} /></span>
                </div>
              </Link>
            ))}
          </>
        )}

        {drafts.length > 0 && drafts.map((cls) => (
          <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--d-gray-50)", border: "1px dashed var(--d-gray-300)", borderRadius: 12, padding: 14, marginBottom: 12, textDecoration: "none", color: "inherit" }}>
            <Icon name="fileText" size={20} style={{ color: "var(--d-gray-500)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--d-gray-700)" }}>{cls.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--d-gray-500)" }}>Draft · Not visible to students</p>
            </div>
            <span style={{ fontSize: 12, color: "var(--d-blue)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
              Edit <Icon name="arrowRight" size={12} />
            </span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "auto" }} />
      <TeacherBottomNav active="home" />
    </>
  );
}
