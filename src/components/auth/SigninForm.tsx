"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { GoogleIcon, Icon } from "@/components/Icons";
import { signIn, type AuthFormState } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-block" type="submit" disabled={pending} style={{ opacity: pending ? 0.5 : 1 }}>
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export function SigninForm() {
  const [state, formAction] = useFormState<AuthFormState, FormData>(signIn, undefined);

  return (
    <div style={{ padding: "32px 20px", maxWidth: 400, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.3px" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", margin: 0 }}>
          Sign in to your LearnGrid account
        </p>
      </div>

      {state?.error && (
        <div className="notice notice-red">
          <p style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="x" size={16} /> {state.error}
          </p>
        </div>
      )}

      <form className="auth-form" action={formAction}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" placeholder="Your password" required autoComplete="current-password" />
        </div>

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--d-blue)", fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <SubmitButton />
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--d-gray-200)" }} />
        <span style={{ fontSize: 12, color: "var(--d-gray-400)", fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: "var(--d-gray-200)" }} />
      </div>

      <button
        type="button"
        style={{
          width: "100%", padding: 12, borderRadius: 10, textAlign: "center",
          border: "1.5px solid var(--d-gray-200)", background: "#fff", cursor: "pointer",
          fontSize: 14, fontWeight: 600, color: "var(--d-gray-700)", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <GoogleIcon size={18} /> Continue with Google
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--d-gray-500)", marginTop: 20 }}>
        New here?{" "}
        <Link href="/signup" style={{ color: "var(--d-blue)", fontWeight: 700 }}>Create account</Link>
      </p>
    </div>
  );
}
