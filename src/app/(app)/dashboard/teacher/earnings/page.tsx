import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getTeacherStats, getTeacherEarnings } from "@/lib/actions/earnings";
import { Icon } from "@/components/Icons";
import { TeacherBottomNav } from "@/components/TeacherBottomNav";

export default async function EarningsPage() {
  const profile = await requireProfile();
  const stats = await getTeacherStats(profile.id);
  const earnings = await getTeacherEarnings(profile.id);
  const hasEarnings = earnings.length > 0;
  const avgPerClass = stats.totalClasses > 0 ? Math.round(stats.totalEarned / stats.totalClasses) : 0;

  return (
    <>
      <div className="page-header">
        <h2>Earnings</h2>
        {stats.availableBalance > 0 && (
          <Link href="/dashboard/teacher/withdraw" style={{ background: "var(--d-blue)", color: "#fff", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            Withdraw ₦
          </Link>
        )}
      </div>

      {!hasEarnings ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="money" size={40} /></div>
          <p className="empty-state-title">No earnings yet</p>
          <p className="empty-state-desc">Complete your first class to earn. Payments release 24 hours after class ends.</p>
          <Link className="btn btn-primary btn-block" href="/dashboard/teacher/classes/new">Create a Class</Link>
        </div>
      ) : (
        <div style={{ padding: "16px 18px" }}>
          <div className="stat-grid">
            <div className="stat-card stat-green">
              <p className="stat-card-label">Available</p>
              <p className="stat-card-value">₦{stats.availableBalance.toLocaleString()}</p>
              <p className="stat-card-sub">Ready to withdraw</p>
            </div>
            <div className="stat-card stat-amber">
              <p className="stat-card-label">Pending Release</p>
              <p className="stat-card-value">₦{stats.pendingRelease.toLocaleString()}</p>
              <p className="stat-card-sub">Awaiting release</p>
            </div>
          </div>

          <div style={{ background: "var(--d-gray-50)", borderRadius: 12, padding: "12px 14px", marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--d-gray-500)", margin: "0 0 3px" }}>Total Earned (All time)</p>
              <p style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>₦{stats.totalEarned.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "var(--d-gray-500)", margin: "0 0 3px" }}>Avg per class</p>
              <p style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>₦{avgPerClass.toLocaleString()}</p>
            </div>
          </div>

          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Earnings History</p>
          {earnings.map((e) => (
            <div key={e.id} className="earning-item">
              <div className={`earning-icon ${e.status === "PENDING_RELEASE" ? "earning-pending" : "earning-released"}`}>
                <Icon name={e.status === "PENDING_RELEASE" ? "clock" : "check"} size={18} style={{ color: e.status === "PENDING_RELEASE" ? "var(--d-amber)" : "var(--d-green)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="earning-class">{e.class.title}</p>
                <p className="earning-date">{e.status === "PENDING_RELEASE" ? "Pending release" : "Released"} · {e.createdAt.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p className="earning-amount" style={{ color: e.status === "PENDING_RELEASE" ? "var(--d-amber)" : "var(--d-green)" }}>
                  ₦{e.netNgn.toLocaleString()}
                </p>
                <p className="earning-students">{e.class._count.enrolments} students</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "auto" }} />
      <TeacherBottomNav active="earnings" />
    </>
  );
}
