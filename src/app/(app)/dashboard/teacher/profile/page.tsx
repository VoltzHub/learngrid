import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTeacherStats } from "@/lib/actions/earnings";
import { signOut } from "@/lib/actions/auth";
import { Icon, type IconName } from "@/components/Icons";
import { TeacherBottomNav } from "@/components/TeacherBottomNav";

const menuItems: Array<{ icon: IconName; label: string; href: string }> = [
  { icon: "creditCard", label: "Bank & Payout Details", href: "/dashboard/teacher/withdraw" },
  { icon: "naira", label: "Earnings History", href: "/dashboard/teacher/earnings" },
  { icon: "bell", label: "Notifications", href: "/dashboard/teacher/notifications" },
  { icon: "messageCircle", label: "Help & Support", href: "/help" },
  { icon: "key", label: "Reset Password", href: "/forgot-password" },
];

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
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div className="dash-avatar" style={{ width: 60, height: 60, fontSize: 21 }}>{initials}</div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{profile.fullName ?? "-"}</p>
            {verified && (
              <div className="dash-verified-badge" style={{ marginTop: 4 }}>
                <Icon name="check" size={12} /> Verified Teacher
              </div>
            )}
          </div>
        </div>

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
            <p className="profile-stat-val" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              {stats.avgRating ? (
                <>
                  {stats.avgRating}<Icon name="star" size={13} style={{ color: "var(--d-amber)" }} />
                </>
              ) : (
                "-"
              )}
            </p>
            <p className="profile-stat-label">Rating</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-val">{stats.totalRatings}</p>
            <p className="profile-stat-label">Reviews</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{profile.fullName ?? "-"}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{profile.email}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{profile.phone ?? "-"}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Subject / Expertise</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)" }}>{tp?.subjectTags?.join(", ") || "-"}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <div className="form-input" style={{ background: "var(--d-gray-50)", minHeight: 64, lineHeight: 1.5 }}>{tp?.bio ?? "-"}</div>
        </div>

        <div style={{ borderTop: "1px solid var(--d-gray-200)", paddingTop: 16, marginTop: 8 }}>
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="profile-menu-item">
              <span className="profile-menu-icon"><Icon name={item.icon} size={18} /></span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow"><Icon name="chevronRight" size={16} /></span>
            </Link>
          ))}
          <form action={signOut}>
            <button type="submit" className="profile-menu-item profile-menu-danger" style={{ marginTop: 4 }}>
              <span className="profile-menu-icon"><Icon name="logOut" size={18} /></span>
              <span className="menu-label">Log Out</span>
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: "auto" }} />
      <TeacherBottomNav active="profile" />
    </>
  );
}
