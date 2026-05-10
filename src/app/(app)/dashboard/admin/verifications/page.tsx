import { requireProfile } from "@/lib/auth";
import { getPendingVerifications, approveTeacher, rejectTeacher } from "@/lib/actions/admin";
import { revalidatePath } from "next/cache";

export default async function AdminVerificationsPage() {
  const profile = await requireProfile();
  if (profile.role !== "ADMIN") {
    return <div style={{ padding: 40, textAlign: "center" }}><h2>Access Denied</h2><p>Admin only.</p></div>;
  }

  const pending = await getPendingVerifications();

  async function handleApprove(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    await approveTeacher(userId);
    revalidatePath("/dashboard/admin/verifications");
  }

  async function handleReject(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const reason = formData.get("reason") as string;
    await rejectTeacher(userId, reason || "Documents did not meet requirements.");
    revalidatePath("/dashboard/admin/verifications");
  }

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Teacher Verification Queue
      </h1>

      {pending.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <p className="empty-state-title">Queue is empty</p>
          <p className="empty-state-desc">No teachers waiting for verification.</p>
        </div>
      ) : (
        pending.map((tp) => (
          <div key={tp.userId} style={{ background: "#fff", border: "1px solid var(--d-gray-200)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{tp.user.fullName ?? "—"}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--d-gray-500)" }}>{tp.user.email}</p>
                {tp.user.phone && <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--d-gray-400)" }}>📱 {tp.user.phone}</p>}
              </div>
              <span className="status-badge badge-pending">PENDING</span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--d-gray-500)", margin: "0 0 6px" }}>Subjects:</p>
              <p style={{ fontSize: 14, margin: 0 }}>{tp.subjectTags?.join(", ") || "—"}</p>
            </div>

            {tp.bio && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--d-gray-500)", margin: "0 0 6px" }}>Bio:</p>
                <p style={{ fontSize: 13, color: "var(--d-gray-600)", margin: 0, lineHeight: 1.5 }}>{tp.bio}</p>
              </div>
            )}

            <p style={{ fontSize: 11, color: "var(--d-gray-400)", margin: "0 0 12px" }}>
              Applied {tp.createdAt.toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
            </p>

            <div className="btn-row">
              <form action={handleApprove}>
                <input type="hidden" name="userId" value={tp.userId} />
                <button type="submit" className="btn btn-success" style={{ flex: 1, width: "100%" }}>
                  ✓ Approve
                </button>
              </form>
              <form action={handleReject} style={{ flex: 1 }}>
                <input type="hidden" name="userId" value={tp.userId} />
                <input type="text" name="reason" placeholder="Rejection reason…" className="form-input" style={{ fontSize: 12, marginBottom: 6 }} />
                <button type="submit" className="btn-outline-danger" style={{ width: "100%" }}>
                  ✗ Reject
                </button>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
