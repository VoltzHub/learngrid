import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function VerificationApprovedPage() {
  return (
    <div style={{ padding: "32px 20px", maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <div className="success-icon" style={{ background: "var(--d-green-light)", width: 72, height: 72, color: "var(--d-green)" }}>
        <Icon name="award" size={34} />
      </div>
      <span className="status-badge badge-verified">Verified Teacher</span>
      <h2 style={{ fontSize: 21, fontWeight: 700, margin: "14px 0 8px", letterSpacing: "-0.3px" }}>
        You&apos;re Verified!
      </h2>
      <p style={{ fontSize: 14, color: "var(--d-gray-500)", lineHeight: 1.6, marginBottom: 24 }}>
        Congratulations! You can now create and publish live classes.
      </p>

      <div className="notice notice-green" style={{ textAlign: "left" }}>
        <p style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Access Unlocked</p>
        {[
          "Create and list unlimited live classes",
          "Set your own price in Naira",
          "Automatic earnings release after each class",
          "Full access to Teacher Dashboard",
        ].map((t) => (
          <div key={t} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <Icon name="check" size={16} style={{ color: "var(--d-green)", flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "var(--d-green-dark)", fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>

      <Link className="btn btn-primary btn-block" href="/dashboard/teacher">
        Go to Teacher Dashboard
      </Link>
    </div>
  );
}
