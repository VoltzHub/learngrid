import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getClassDetail } from "@/lib/actions/classes";
import { Icon } from "@/components/Icons";
import { PublishButton, CancelButton, DeleteButton, SessionLinkForm, CompleteClassButton } from "./actions-client";

const BADGE: Record<string, string> = { DRAFT: "badge-draft", LISTED: "badge-listed", COMPLETED: "badge-completed", CANCELLED: "badge-cancelled" };

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  const cls = await getClassDetail(params.id);
  if (!cls || cls.teacherId !== profile.id) notFound();

  const feePercent = parseInt(process.env.PLATFORM_FEE_PERCENT ?? "15");
  const gross = cls.priceNgn * cls._count.enrolments;
  const fee = Math.round(gross * feePercent / 100);
  const net = gross - fee;
  const avgRating = cls.ratings.length > 0 ? (cls.ratings.reduce((a, r) => a + r.stars, 0) / cls.ratings.length).toFixed(1) : null;

  return (
    <>
      <div className="page-back-header">
        <Link href="/dashboard/teacher/classes" className="page-back-btn" aria-label="Back"><Icon name="arrowLeft" size={20} /></Link>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Class Detail</h2>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ background: "var(--d-gray-50)", border: "1px solid var(--d-gray-200)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div className="class-card-top">
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{cls.title}</h3>
            <span className={`status-badge ${BADGE[cls.status]}`}>{cls.status}</span>
          </div>
          {cls.description && <p style={{ fontSize: 13, color: "var(--d-gray-500)", margin: "6px 0 8px", lineHeight: 1.4 }}>{cls.description}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--d-gray-500)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="calendar" size={14} /> {cls.scheduledAt.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--d-blue)" }}>₦{cls.priceNgn.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: "var(--d-gray-500)" }}>{cls._count.enrolments}/{cls.seatLimit} enrolled</span>
          </div>
        </div>

        {cls.status === "COMPLETED" && cls._count.enrolments > 0 && (
          <div className="notice notice-green" style={{ textAlign: "left" }}>
            <p style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Earnings Breakdown</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13 }}>Gross ({cls._count.enrolments} x ₦{cls.priceNgn.toLocaleString()})</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>₦{gross.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>Platform fee ({feePercent}%)</span>
              <span style={{ fontSize: 13 }}>-₦{fee.toLocaleString()}</span>
            </div>
            <div style={{ borderTop: "1px solid #A7F3D0", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Your earnings</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--d-green)" }}>₦{net.toLocaleString()}</span>
            </div>
          </div>
        )}

        {cls.status === "COMPLETED" && avgRating && (
          <div style={{ background: "var(--d-blue-light)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--d-blue)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 8px" }}>Class Rating</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{avgRating}</p>
              <div>
                <p style={{ margin: 0, color: "var(--d-amber)", display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} />)}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--d-gray-500)" }}>{cls.ratings.length} of {cls._count.enrolments} students rated</p>
              </div>
            </div>
          </div>
        )}

        {(cls.status === "LISTED" || cls.status === "COMPLETED") && cls.enrolments.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Enrolled Students</p>
              <span style={{ fontSize: 12, color: "var(--d-gray-500)" }}>{cls._count.enrolments}/{cls.seatLimit}</span>
            </div>
            {cls.enrolments.slice(0, 5).map((e) => (
              <div key={e.id} className="enrolled-item">
                <div className="enrolled-avatar">
                  {e.student.fullName?.split(" ").map((w) => w[0]).join("").slice(0, 2) ?? "?"}
                </div>
                <div>
                  <p className="enrolled-name">{e.student.fullName ?? e.student.email}</p>
                  <p className="enrolled-date">Enrolled {e.enrolledAt.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {cls.status === "DRAFT" && (
          <div style={{ paddingBottom: 24 }}>
            <PublishButton classId={cls.id} />
            <div className="btn-row" style={{ marginTop: 10 }}>
              <Link className="btn btn-secondary" href="/dashboard/teacher/classes/new" style={{ flex: 1, textAlign: "center" }}>Edit Class</Link>
              <DeleteButton classId={cls.id} />
            </div>
          </div>
        )}
        {cls.status === "LISTED" && (
          <div style={{ paddingBottom: 24 }}>
            <SessionLinkForm classId={cls.id} currentLink={cls.sessionLink} />
            <div style={{ marginTop: 14 }}>
              <CompleteClassButton classId={cls.id} />
              <div className="btn-row">
                <Link className="btn btn-secondary" href="/dashboard/teacher/classes/new" style={{ flex: 1, textAlign: "center" }}>Edit Class</Link>
                <CancelButton classId={cls.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
