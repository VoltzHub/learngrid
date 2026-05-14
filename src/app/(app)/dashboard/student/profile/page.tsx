import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/actions/auth";
import { Icon, type IconName } from "@/components/Icons";

const menuItems: Array<{ icon: IconName; label: string }> = [
  { icon: "key", label: "Change Password" },
  { icon: "bell", label: "Notification Settings" },
  { icon: "creditCard", label: "Payment Methods" },
  { icon: "messageCircle", label: "Help & Support" },
];

export default async function StudentProfilePage() {
  const profile = await requireProfile();

  const [enrolmentCount, completedCount, ratingCount] = await Promise.all([
    prisma.enrolment.count({ where: { studentId: profile.id } }),
    prisma.enrolment.count({
      where: { studentId: profile.id, class: { status: "COMPLETED" } },
    }),
    prisma.rating.count({ where: { studentId: profile.id } }),
  ]);

  const initials =
    profile.fullName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  return (
    <>
      <div className="page-header">
        <h2>Profile</h2>
      </div>

      <div style={{ padding: "20px 18px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div className="dash-avatar student-avatar" style={{ width: 60, height: 60, fontSize: 21 }}>
            {initials}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{profile.fullName ?? "-"}</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--d-gray-500)" }}>Student</p>
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="profile-stat">
            <p className="profile-stat-val">{enrolmentCount}</p>
            <p className="profile-stat-label">Enrolled</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-val">{completedCount}</p>
            <p className="profile-stat-label">Completed</p>
          </div>
          <div className="profile-stat">
            <p className="profile-stat-val">{ratingCount}</p>
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

        <div style={{ borderTop: "1px solid var(--d-gray-200)", paddingTop: 16, marginTop: 8 }}>
          <Link href="/classes" className="profile-menu-item">
            <span className="profile-menu-icon"><Icon name="bookOpen" size={18} /></span>
            <span className="menu-label">Browse Classes</span>
            <span className="menu-arrow"><Icon name="chevronRight" size={16} /></span>
          </Link>
          {menuItems.map((item) => (
            <div key={item.label} className="profile-menu-item">
              <span className="profile-menu-icon"><Icon name={item.icon} size={18} /></span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow"><Icon name="chevronRight" size={16} /></span>
            </div>
          ))}
          <form action={signOut}>
            <button type="submit" className="profile-menu-item profile-menu-danger" style={{ marginTop: 4 }}>
              <span className="profile-menu-icon"><Icon name="logOut" size={18} /></span>
              <span className="menu-label">Log Out</span>
            </button>
          </form>
        </div>
      </div>

      <StudentBottomNav active="profile" />
    </>
  );
}

function StudentBottomNav({ active }: { active: "home" | "classes" | "browse" | "profile" }) {
  const items: Array<{ href: string; label: string; key: string; icon: IconName }> = [
    { href: "/dashboard/student", label: "Home", key: "home", icon: "home" },
    { href: "/dashboard/student/classes", label: "Classes", key: "classes", icon: "bookOpen" },
    { href: "/classes", label: "Browse", key: "browse", icon: "clipboardList" },
    { href: "/dashboard/student/profile", label: "Profile", key: "profile", icon: "user" },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`bottom-nav-item${active === item.key ? " active" : ""}`}
        >
          <span className="bottom-nav-icon"><Icon name={item.icon} size={20} /></span>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
