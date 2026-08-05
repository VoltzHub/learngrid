import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTeacherStats } from "@/lib/actions/earnings";
import { Icon } from "@/components/Icons";
import { WithdrawForm } from "./WithdrawForm";

export default async function WithdrawPage() {
  const profile = await requireProfile();
  const stats = await getTeacherStats(profile.id);
  const tp = await prisma.teacherProfile.findUnique({
    where: { userId: profile.id },
    select: { bankAccountNumber: true, bankCode: true, bankAccountName: true },
  });

  return (
    <>
      <div className="page-back-header">
        <Link href="/dashboard/teacher/earnings" className="page-back-btn" aria-label="Back">
          <Icon name="arrowLeft" size={20} />
        </Link>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Withdraw Earnings</h2>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ background: "var(--d-green-light)", borderRadius: 12, padding: 14, marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--d-green)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 4px" }}>
            Available Balance
          </p>
          <p style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
            ₦{stats.availableBalance.toLocaleString()}
          </p>
          {stats.pendingRelease > 0 && (
            <p style={{ fontSize: 11, color: "var(--d-gray-500)", margin: "4px 0 0" }}>
              ₦{stats.pendingRelease.toLocaleString()} more pending release
            </p>
          )}
        </div>

        {stats.availableBalance <= 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Icon name="money" size={40} /></div>
            <p className="empty-state-title">Nothing to withdraw yet</p>
            <p className="empty-state-desc">
              Complete a class to release earnings. Payouts run weekly via Paystack.
            </p>
            <Link className="btn btn-primary btn-block" href="/dashboard/teacher/classes">
              View My Classes
            </Link>
          </div>
        ) : (
          <WithdrawForm
            amount={stats.availableBalance}
            defaultAccountNumber={tp?.bankAccountNumber ?? ""}
            defaultBankCode={tp?.bankCode ?? ""}
            defaultAccountName={tp?.bankAccountName ?? profile.fullName ?? ""}
          />
        )}
      </div>
    </>
  );
}
