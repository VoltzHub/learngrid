import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, PayoutStatus } from "@prisma/client";
import { Icon } from "@/components/Icons";
import { markPayoutPaid } from "@/lib/actions/payouts";
import { revalidatePath } from "next/cache";

const BADGE: Record<PayoutStatus, string> = {
  PENDING: "badge-pending",
  PROCESSING: "badge-listed",
  PAID: "badge-completed",
  FAILED: "badge-cancelled",
};

export default async function AdminPayoutsPage() {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>Admin only.</p>
      </div>
    );
  }

  const payouts = await prisma.payout.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      teacher: { select: { fullName: true, email: true } },
      earnings: { select: { classId: true } },
    },
  });

  const totals = await prisma.payout.groupBy({
    by: ["status"],
    _sum: { amountNgn: true },
    _count: true,
  });
  const sumOf = (s: PayoutStatus) =>
    totals.find((t) => t.status === s)?._sum.amountNgn ?? 0;

  async function handleMarkPaid(formData: FormData) {
    "use server";
    const payoutId = formData.get("payoutId") as string;
    await markPayoutPaid(payoutId);
    revalidatePath("/dashboard/admin/payouts");
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Payouts</h1>
      <p style={{ color: "var(--muted)", marginBottom: 18, fontSize: 13 }}>
        Teacher payout requests. Mark as paid once the bank transfer clears via Paystack Transfers.
      </p>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card stat-amber">
          <p className="stat-card-label">Pending</p>
          <p className="stat-card-value">₦{sumOf("PENDING").toLocaleString()}</p>
          <p className="stat-card-sub">Awaiting transfer</p>
        </div>
        <div className="stat-card stat-blue">
          <p className="stat-card-label">Processing</p>
          <p className="stat-card-value">₦{sumOf("PROCESSING").toLocaleString()}</p>
          <p className="stat-card-sub">In flight</p>
        </div>
        <div className="stat-card stat-green">
          <p className="stat-card-label">Paid (lifetime)</p>
          <p className="stat-card-value">₦{sumOf("PAID").toLocaleString()}</p>
          <p className="stat-card-sub">{totals.find((t) => t.status === "PAID")?._count ?? 0} transfers</p>
        </div>
      </div>

      {payouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="money" size={40} /></div>
          <p className="empty-state-title">No payouts yet</p>
          <p className="empty-state-desc">When teachers request a withdrawal, requests appear here.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--d-gray-200)", borderRadius: 14, overflow: "hidden" }}>
          {payouts.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 12,
                padding: "14px 16px",
                borderBottom: i < payouts.length - 1 ? "1px solid var(--d-gray-100)" : "none",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                  {p.teacher.fullName ?? p.teacher.email}
                </p>
                <p style={{ fontSize: 12, color: "var(--d-gray-500)", margin: "2px 0 0" }}>
                  {p.earnings.length} class{p.earnings.length !== 1 ? "es" : ""} ·{" "}
                  {p.createdAt.toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--d-blue)" }}>
                ₦{p.amountNgn.toLocaleString()}
              </span>
              <span className={`status-badge ${BADGE[p.status]}`}>{p.status}</span>
              {p.status === "PENDING" ? (
                <form action={handleMarkPaid}>
                  <input type="hidden" name="payoutId" value={p.id} />
                  <button className="btn btn-success" type="submit" style={{ minHeight: 32, fontSize: 12, padding: "0 12px" }}>
                    Mark Paid
                  </button>
                </form>
              ) : (
                <span style={{ width: 1 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
