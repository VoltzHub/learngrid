"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signUp, type AuthFormState } from "@/lib/actions/auth";
import { useState } from "react";
import { Icon } from "@/components/Icons";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn btn-primary btn-block"
      type="submit"
      disabled={pending || disabled}
      style={{ opacity: pending || disabled ? 0.5 : 1 }}
    >
      {pending ? "Creating account..." : "Create Account"}
    </button>
  );
}

export default function StudentSignupPage() {
  const [state, formAction] = useFormState<AuthFormState, FormData>(signUp, undefined);
  const [agreed, setAgreed] = useState(false);

  if (state && !state.error) {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center", maxWidth: 400, margin: "0 auto" }}>
        <div className="success-icon" style={{ background: "var(--d-green-light)", color: "var(--d-green)" }}>
          <Icon name="check" size={30} />
        </div>
        <h2 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Check your email!
        </h2>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", marginBottom: 28, lineHeight: 1.6 }}>
          We sent a verification link to your email. Click it to activate your account.
        </p>
        <Link className="btn btn-success btn-block" href="/classes">
          Browse Live Classes
        </Link>
        <div style={{ marginTop: 10 }}>
          <Link className="btn btn-secondary btn-block" href="/signin">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 20px 32px", maxWidth: 400, margin: "0 auto" }}>
      <Link href="/signup" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--d-gray-500)", fontSize: 13, marginBottom: 20 }}>
        <Icon name="arrowLeft" size={14} /> Back
      </Link>

      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.3px" }}>
        Create Student Account
      </h1>
      <p style={{ fontSize: 13, color: "var(--d-gray-500)", marginBottom: 20 }}>
        Learn from verified Nigerian teachers
      </p>

      <form className="auth-form" action={formAction}>
        <input type="hidden" name="role" value="STUDENT" />

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" type="text" name="fullName" placeholder="Your full legal name" required autoComplete="name" />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" placeholder="Create a password" required minLength={8} autoComplete="new-password" />
          <p className="form-hint">Min. 8 characters</p>
        </div>

        {state?.error && (
          <div className="notice notice-red">
            <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="alertTriangle" size={16} /> {state.error}
            </p>
          </div>
        )}

        <div className="form-check">
          <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <label htmlFor="terms">
            I agree to LearnGrid&apos;s <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        <SubmitButton disabled={!agreed} />
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--d-gray-500)", marginTop: 16 }}>
        Already have an account?{" "}
        <Link href="/signin" style={{ color: "var(--d-blue)", fontWeight: 700 }}>Sign In</Link>
      </p>
    </div>
  );
}
