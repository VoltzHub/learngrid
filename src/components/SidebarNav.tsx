import Link from "next/link";
import { Role } from "@prisma/client";
import { signOut } from "@/lib/actions/auth";

const STUDENT_LINKS = [
  { href: "/dashboard/student", label: "Overview" },
  { href: "/dashboard/student/classes", label: "My classes" },
  { href: "/classes", label: "Browse classes" },
];

const TEACHER_LINKS = [
  { href: "/dashboard/teacher", label: "Dashboard" },
  { href: "/dashboard/teacher/classes", label: "My Classes" },
  { href: "/dashboard/teacher/earnings", label: "Earnings" },
  { href: "/dashboard/teacher/notifications", label: "Notifications" },
  { href: "/dashboard/teacher/profile", label: "Profile" },
];

const ADMIN_LINKS = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/verifications", label: "Verifications" },
  { href: "/dashboard/admin/classes", label: "Classes" },
  { href: "/dashboard/admin/payouts", label: "Payouts" },
];

export function SidebarNav({ role, fullName }: { role: Role; fullName: string | null }) {
  const links =
    role === Role.TEACHER
      ? TEACHER_LINKS
      : role === Role.ADMIN
      ? ADMIN_LINKS
      : STUDENT_LINKS;

  const roleLabel =
    role === Role.TEACHER ? "Teacher" : role === Role.ADMIN ? "Admin" : "Student";

  return (
    <aside className="dash-sidebar">
      <Link className="brand footer-brand" href="/" aria-label="LearnGrid home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/assets/logo-cap.svg" alt="" />
        </span>
        <span className="brand-text">LearnGrid</span>
      </Link>

      <nav className="dash-nav" aria-label="Dashboard">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
          Signed in as {roleLabel}
        </div>
        <div style={{ fontSize: 14, color: "#fff", marginBottom: 12 }}>
          {fullName ?? "—"}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="btn btn-secondary"
            style={{ width: "100%", minHeight: 36, fontSize: 13 }}
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
