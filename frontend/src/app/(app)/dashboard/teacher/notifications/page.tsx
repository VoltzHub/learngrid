import { requireProfile } from "@/lib/auth";
import { getTeacherNotifications } from "@/lib/actions/earnings";
import { Icon, type IconName } from "@/components/Icons";
import { TeacherBottomNav } from "@/components/TeacherBottomNav";

const notificationIcons: Record<string, IconName> = {
  enrollment: "user",
  payout: "money",
  rating: "star",
  reminder: "clock",
};

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
          <div className="empty-state-icon"><Icon name="bell" size={40} /></div>
          <p className="empty-state-title">No notifications yet</p>
          <p className="empty-state-desc">You&apos;ll be notified when students enroll, classes end, or earnings are released.</p>
        </div>
      ) : (
        notifications.map((n) => {
          const payload = n.payloadJson as Record<string, string>;
          const unread = !n.readAt;
          return (
            <div key={n.id} className={`notif-item${unread ? " unread" : ""}`}>
              <div className="notif-icon">
                <Icon name={notificationIcons[n.type] ?? "megaphone"} size={19} style={{ color: unread ? "#fff" : "var(--d-gray-500)" }} />
              </div>
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
      <TeacherBottomNav active="notifications" />
    </>
  );
}
