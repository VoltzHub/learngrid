import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTeacherStats } from "@/lib/actions/earnings";
import { signOut } from "@/lib/actions/auth";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const tp = await prisma.teacherProfile.findUnique({ where: { userId: profile.id } });
  const stats = await getTeacherStats(profile.id);
  const initials = profile.fullName?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";
  const verified = tp?.verificationStatus === "VERIFIED";

  return (
    <>
      <div className="page-header">
        <h2>Profile</h2>
      </div>

      <div style={{ padding: "20px 18px" }}>
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div className="dash-avatar" style={{ width: 60, height: 60, fontSize: 21 }}>{initials}</div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{profile.fullName ?? "—"}</p>
            {verified && <div className="dash-verified-badge" style={{ marginTop: 4 }}>✓ Verified Teacher</div>}
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats-row">
          <div className="profile-stat">
            <p className="profile-stat-val">{stats.totalClasses}</p>
            <p className="profile-stat-label">Classes</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-val">{stats.totalRatings}</p>
            <p className="profile-stat-label">Students</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-val">{stats.avgRating ? `${stats.avgRating}★` : "—"}</p>
            <p className="profile-stat-label">Rating</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-val">{stats.totalRatings}</p>
            <p className="profile-stat-label">Reviews</p>
          </div>
        </div>

        {/* Profile fields (read-only) */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{profile.fullName ?? "—"}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{profile.email}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{profile.phone ?? "—"}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Subject / Expertise</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{tp?.subjectTags?.join(", ") || "—"}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)", minHeight: 64, lineHeight: 1.5 }}>{tp?.bio ?? "—"}</div>
        </div>

        {/* Menu items */}
        <div style={{ borderTop: "1px solid var(--d-gray-200)", paddingTop: 16, marginTop: 8 }}>
          {[
            { icon: "🔑", label: "Change Password" },
            { icon: "🔔", label: "Notification Settings" },
            { icon: "💳", label: "Payout Settings" },
            { icon: "💬", label: "Help & Support" },
          ].map((item) => (
            <div key={item.label} className="profile-menu-item">
              <span>{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </div>
          ))}
          <form action={signOut}>
            <button type="submit" className="profile-menu-item profile-menu-danger" style={{ marginTop: 4 }}>
              <span>🚪</span>
              <span className="menu-label">Log Out</span>
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: "auto" }} />
      <nav className="bottom-nav">
        <Link href="/dashboard/teacher" className="bottom-nav-item"><span className="bottom-nav-icon">⊞</span><span className="bottom-nav-label">Home</span></Link>
        <Link href="/dashboard/teacher/classes" className="bottom-nav-item"><span className="bottom-nav-icon">☰</span><span className="bottom-nav-label">Classes</span></Link>
        <div className="bottom-nav-fab"><Link href="/dashboard/teacher/classes/new" className="bottom-nav-fab-btn">+</Link></div>
        <Link href="/dashboard/teacher/earnings" className="bottom-nav-item"><span className="bottom-nav-icon">₦</span><span className="bottom-nav-label">Earn</span></Link>
        <Link href="/dashboard/teacher/profile" className="bottom-nav-item active"><span className="bottom-nav-icon">◉</span><span className="bottom-nav-label">Profile</span></Link>
      </nav>
    </>
  );
}
