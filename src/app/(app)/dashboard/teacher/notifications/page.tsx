import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getTeacherNotifications } from "@/lib/actions/earnings";

export default async function NotificationsPage() {
  const profile = await requireProfile();
  const notifications = await getTeacherNotifications(profile.id);
  const hasNotifs = notifications.length > 0;

  return (
    <>
      <div className="page-header">
        <h2>Notifications</h2>
        {hasNotifs && (
          <span style={{ fontSize: 13, color: "var(--d-blue)", fontWeight: 600, cursor: "pointer" }}>
            Mark all read
          </span>
        )}
      </div>

      {!hasNotifs ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <p className="empty-state-title">No notifications yet</p>
          <p className="empty-state-desc">You&apos;ll be notified when students enroll, classes end, or earnings are released.</p>
        </div>
      ) : (
        notifications.map((n) => {
          const payload = n.payloadJson as Record<string, string>;
          const unread = !n.readAt;
          const icons: Record<string, string> = { enrollment: "👤", payout: "💰", rating: "⭐", reminder: "⏰" };
          return (
            <div key={n.id} className={`notif-item${unread ? " unread" : ""}`}>
              <div className="notif-icon">{icons[n.type] ?? "📢"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <p className="notif-title">{payload.title ?? n.type}</p>
                  <span className="notif-time">
                    {n.sentAt.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="notif-msg">{payload.message ?? ""}</p>
              </div>
              {unread && <div className="notif-dot" />}
            </div>
          );
        })
      )}

      <div style={{ marginTop: "auto" }} />
      <nav className="bottom-nav">
        <Link href="/dashboard/teacher" className="bottom-nav-item"><span className="bottom-nav-icon">⊞</span><span className="bottom-nav-label">Home</span></Link>
        <Link href="/dashboard/teacher/classes" className="bottom-nav-item"><span className="bottom-nav-icon">☰</span><span className="bottom-nav-label">Classes</span></Link>
        <div className="bottom-nav-fab"><Link href="/dashboard/teacher/classes/new" className="bottom-nav-fab-btn">+</Link></div>
        <Link href="/dashboard/teacher/earnings" className="bottom-nav-item"><span className="bottom-nav-icon">₦</span><span className="bottom-nav-label">Earn</span></Link>
        <Link href="/dashboard/teacher/profile" className="bottom-nav-item"><span className="bottom-nav-icon">◉</span><span className="bottom-nav-label">Profile</span></Link>
      </nav>
    </>
  );
}
