"use client";

import Link from "next/link";
import { useState } from "react";

export default function WithdrawPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <>
        <div className="page-back-header">
          <Link href="/dashboard/teacher/earnings" className="page-back-btn">←</Link>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Withdraw</h2>
        </div>
        <div className="success-state">
          <div className="success-icon" style={{ background: "var(--d-green-light)" }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Withdrawal Initiated</h2>
          <p style={{ fontSize: 13, color: "var(--d-gray-500)", lineHeight: 1.6, marginBottom: 6 }}>
            Your funds are being transferred via Paystack.
          </p>
          <p style={{ fontSize: 12, color: "var(--d-gray-400)", marginBottom: 24 }}>
            Expect 1–3 business days processing time.
          </p>
          <Link className="btn btn-primary btn-block" href="/dashboard/teacher/earnings">
            Back to Earnings
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-back-header">
        <Link href="/dashboard/teacher/earnings" className="page-back-btn">←</Link>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Withdraw Earnings</h2>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ background: "var(--d-green-light)", borderRadius: 12, padding: 14, marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--d-green)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 4px" }}>Available Balance</p>
          <p style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>₦0</p>
        </div>

        <div className="notice notice-amber">
          <p>🚧 Paystack withdrawal integration coming soon. Your earnings are safe and tracked.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div className="form-group">
            <label className="form-label">Withdrawal Amount (₦)</label>
            <div className="form-price-wrap">
              <div className="form-price-prefix">₦</div>
              <input className="form-input" type="number" placeholder="Amount" required min={500} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input className="form-input" type="text" placeholder="e.g. GTBank, Access Bank" />
          </div>

          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input className="form-input" type="text" placeholder="10-digit NUBAN" maxLength={10} />
          </div>

          <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: 8 }}>
            Withdraw
          </button>
        </form>
      </div>
    </>
  );
}
