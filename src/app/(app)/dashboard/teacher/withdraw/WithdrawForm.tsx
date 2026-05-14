"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Icon } from "@/components/Icons";
import { requestWithdrawal, type WithdrawState } from "@/lib/actions/payouts";

const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "050", name: "Ecobank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "032", name: "Union Bank" },
  { code: "033", name: "United Bank for Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-block" type="submit" disabled={pending} style={{ marginTop: 8, opacity: pending ? 0.5 : 1 }}>
      {pending ? "Requesting withdrawal..." : "Request Withdrawal"}
    </button>
  );
}

export function WithdrawForm({
  amount,
  defaultAccountNumber,
  defaultBankCode,
  defaultAccountName,
}: {
  amount: number;
  defaultAccountNumber: string;
  defaultBankCode: string;
  defaultAccountName: string;
}) {
  const [state, formAction] = useFormState<WithdrawState, FormData>(requestWithdrawal, undefined);

  if (state?.success) {
    return (
      <div className="success-state">
        <div className="success-icon" style={{ background: "var(--d-green-light)", color: "var(--d-green)" }}>
          <Icon name="check" size={30} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Withdrawal Requested</h2>
        <p style={{ fontSize: 13, color: "var(--d-gray-500)", lineHeight: 1.6, marginBottom: 6 }}>
          ₦{amount.toLocaleString()} is queued for transfer to your bank.
        </p>
        <p style={{ fontSize: 12, color: "var(--d-gray-400)", marginBottom: 24 }}>
          Most payouts settle within 1-3 business days.
        </p>
        <Link className="btn btn-primary btn-block" href="/dashboard/teacher/earnings">
          Back to Earnings
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <div className="form-group">
        <label className="form-label">Bank</label>
        <select className="form-input" name="bankCode" aria-label="Bank" defaultValue={defaultBankCode} required>
          <option value="">Select your bank…</option>
          {NIGERIAN_BANKS.map((b) => (
            <option key={b.code} value={b.code}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Account Number</label>
        <input
          className="form-input"
          type="text"
          name="bankAccountNumber"
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          placeholder="10-digit NUBAN"
          defaultValue={defaultAccountNumber}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Account Holder Name</label>
        <input
          className="form-input"
          type="text"
          name="bankAccountName"
          placeholder="As it appears on your bank statement"
          defaultValue={defaultAccountName}
          required
        />
      </div>

      <div className="notice notice-amber" style={{ marginTop: 8 }}>
        <p style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <Icon name="alertTriangle" size={14} />
          Double-check the account — incorrect details can delay your transfer.
        </p>
      </div>

      {state?.error && (
        <div className="notice notice-red" style={{ marginBottom: 12 }}>
          <p>{state.error}</p>
        </div>
      )}

      <SubmitBtn />
    </form>
  );
}
