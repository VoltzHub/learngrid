import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { Icon } from "@/components/Icons";

const ROLE_BADGE: Record<Role, string> = {
  STUDENT: "badge-listed",
  TEACHER: "badge-completed",
  ADMIN: "badge-pending",
};

export default async function AdminUsersPage() {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>Admin only.</p>
      </div>
    );
  }

  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      teacherProfile: { select: { verificationStatus: true } },
      _count: { select: { enrolments: true, classesTaught: true } },
    },
  });

  const counts = await prisma.profile.groupBy({
    by: ["role"],
    _count: true,
  });
  const countOf = (r: Role) => counts.find((c) => c.role === r)?._count ?? 0;

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Users</h1>
      <p style={{ color: "var(--muted)", marginBottom: 18, fontSize: 13 }}>
        Everyone signed up on LearnGrid. Filter by role from the URL — coming soon.
      </p>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card stat-blue">
          <p className="stat-card-label">Students</p>
          <p className="stat-card-value">{countOf("STUDENT")}</p>
          <p className="stat-card-sub">All-time signups</p>
        </div>
        <div className="stat-card stat-green">
          <p className="stat-card-label">Teachers</p>
          <p className="stat-card-value">{countOf("TEACHER")}</p>
          <p className="stat-card-sub">All-time signups</p>
        </div>
        <div className="stat-card stat-gray">
          <p className="stat-card-label">Admins</p>
          <p className="stat-card-value">{countOf("ADMIN")}</p>
          <p className="stat-card-sub">Platform team</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="user" size={40} /></div>
          <p className="empty-state-title">No users yet</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--d-gray-200)", borderRadius: 14, overflow: "hidden" }}>
          {users.map((u, i) => (
            <div
              key={u.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 12,
                padding: "12px 16px",
                borderBottom: i < users.length - 1 ? "1px solid var(--d-gray-100)" : "none",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                  {u.fullName ?? "—"}
                </p>
                <p style={{ fontSize: 12, color: "var(--d-gray-500)", margin: "2px 0 0" }}>{u.email}</p>
              </div>
              {u.role === "TEACHER" && u.teacherProfile && (
                <span className={`status-badge ${u.teacherProfile.verificationStatus === "VERIFIED" ? "badge-completed" : u.teacherProfile.verificationStatus === "PENDING" ? "badge-pending" : "badge-cancelled"}`}>
                  {u.teacherProfile.verificationStatus}
                </span>
              )}
              <span style={{ fontSize: 12, color: "var(--d-gray-500)" }}>
                {u.role === "TEACHER" ? `${u._count.classesTaught} classes` : `${u._count.enrolments} enrolments`}
              </span>
              <span className={`status-badge ${ROLE_BADGE[u.role]}`}>{u.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
