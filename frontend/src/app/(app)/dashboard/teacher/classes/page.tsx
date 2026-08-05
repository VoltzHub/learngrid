import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getTeacherClasses } from "@/lib/actions/classes";
import { ClassStatus } from "@prisma/client";
import { Icon } from "@/components/Icons";
import { TeacherBottomNav } from "@/components/TeacherBottomNav";

const STATUS_MAP: Record<string, ClassStatus | undefined> = {
  all: undefined,
  listed: ClassStatus.LISTED,
  draft: ClassStatus.DRAFT,
  completed: ClassStatus.COMPLETED,
  cancelled: ClassStatus.CANCELLED,
};

const BADGE_CLASS: Record<string, string> = {
  DRAFT: "badge-draft",
  LISTED: "badge-listed",
  COMPLETED: "badge-completed",
  CANCELLED: "badge-cancelled",
};

export default async function MyClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const profile = await requireProfile();
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const statusFilter = STATUS_MAP[filter];
  const classes = await getTeacherClasses(profile.id, statusFilter);

  const filters = ["all", "listed", "draft", "completed", "cancelled"];

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", padding: "14px 18px 0", borderBottom: "1px solid var(--d-gray-200)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>My Classes</h2>
          <Link href="/dashboard/teacher/classes/new" style={{ background: "var(--d-blue)", color: "#fff", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            + New
          </Link>
        </div>
        <div className="filter-tabs">
          {filters.map((f) => (
            <Link key={f} href={`/dashboard/teacher/classes?filter=${f}`} className={`filter-tab${f === filter ? " active" : ""}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="clipboardList" size={40} /></div>
          <p className="empty-state-title">No classes yet</p>
          <p className="empty-state-desc">Create your first live class and start earning in Naira.</p>
          <Link className="btn btn-primary btn-block" href="/dashboard/teacher/classes/new">
            + Create a Live Class
          </Link>
        </div>
      ) : (
        <div style={{ padding: "14px 18px" }}>
          {classes.map((cls) => (
            <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`} className={`class-card${cls.status === "LISTED" ? " class-card-listed" : ""}`}>
              <div className="class-card-top">
                <p className="class-card-title">{cls.title}</p>
                <span className={`status-badge ${BADGE_CLASS[cls.status]}`}>{cls.status}</span>
              </div>
              <p className="class-card-date" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="calendar" size={14} />
                {cls.status === "DRAFT" ? "Not scheduled" : cls.scheduledAt.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </p>
              <div className="class-card-bottom">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="class-card-price">₦{cls.priceNgn.toLocaleString()}</span>
                  <span className="class-card-seats">· {cls._count.enrolments}/{cls.seatLimit}</span>
                </div>
                <span className="class-card-link" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  View <Icon name="arrowRight" size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: "auto" }} />
      <TeacherBottomNav active="classes" />
    </>
  );
}
