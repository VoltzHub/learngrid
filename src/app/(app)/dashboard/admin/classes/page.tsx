import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, ClassStatus } from "@prisma/client";
import { Icon } from "@/components/Icons";

const BADGE: Record<string, string> = {
  DRAFT: "badge-draft",
  LISTED: "badge-listed",
  COMPLETED: "badge-completed",
  CANCELLED: "badge-cancelled",
};

const FILTERS = ["all", "listed", "draft", "completed", "cancelled"] as const;
type Filter = (typeof FILTERS)[number];

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>Admin only.</p>
      </div>
    );
  }

  const filter = (FILTERS.includes(searchParams.filter as Filter)
    ? searchParams.filter
    : "all") as Filter;

  const where =
    filter === "all"
      ? {}
      : { status: filter.toUpperCase() as ClassStatus };

  const classes = await prisma.class.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      teacher: { select: { fullName: true, email: true } },
      _count: { select: { enrolments: true, ratings: true } },
    },
  });

  const stats = await prisma.class.groupBy({
    by: ["status"],
    _count: true,
  });
  const counts = Object.fromEntries(stats.map((s) => [s.status, s._count]));
  const totalGmv = await prisma.payment.aggregate({
    where: { status: "SUCCEEDED" },
    _sum: { amountNgn: true },
  });

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>All Classes</h1>
      <p style={{ color: "var(--muted)", marginBottom: 18, fontSize: 13 }}>
        Platform-wide view. Use this to spot abuse, monitor activity, and check seat fill rates.
      </p>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card stat-blue">
          <p className="stat-card-label">Listed</p>
          <p className="stat-card-value">{counts.LISTED ?? 0}</p>
          <p className="stat-card-sub">Active in marketplace</p>
        </div>
        <div className="stat-card stat-green">
          <p className="stat-card-label">Completed</p>
          <p className="stat-card-value">{counts.COMPLETED ?? 0}</p>
          <p className="stat-card-sub">All-time</p>
        </div>
        <div className="stat-card stat-amber">
          <p className="stat-card-label">Drafts</p>
          <p className="stat-card-value">{counts.DRAFT ?? 0}</p>
          <p className="stat-card-sub">Awaiting publish</p>
        </div>
        <div className="stat-card stat-gray">
          <p className="stat-card-label">GMV</p>
          <p className="stat-card-value">₦{(totalGmv._sum.amountNgn ?? 0).toLocaleString()}</p>
          <p className="stat-card-sub">All paid enrolments</p>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/dashboard/admin/classes?filter=${f}`}
            className={`filter-tab${f === filter ? " active" : ""}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Link>
        ))}
      </div>

      {classes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="clipboardList" size={40} /></div>
          <p className="empty-state-title">No classes found</p>
          <p className="empty-state-desc">No classes match this filter.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--d-gray-200)", borderRadius: 14, overflow: "hidden" }}>
          {classes.map((cls, i) => (
            <div
              key={cls.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 12,
                padding: "12px 16px",
                borderBottom: i < classes.length - 1 ? "1px solid var(--d-gray-100)" : "none",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {cls.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--d-gray-500)", margin: "2px 0 0" }}>
                  {cls.teacher.fullName ?? cls.teacher.email} · {cls.subject}
                </p>
              </div>
              <span style={{ fontSize: 12, color: "var(--d-gray-500)" }}>
                {cls._count.enrolments}/{cls.seatLimit}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>
                ₦{cls.priceNgn.toLocaleString()}
              </span>
              <span className={`status-badge ${BADGE[cls.status]}`}>{cls.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
