"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { signIn, type AuthFormState } from "@/lib/actions/auth";
import { PasswordField } from "@/components/auth/PasswordField";
import { focusFirstInvalid, isValidEmail } from "@/lib/auth/validation";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn btn-primary btn-block"
      type="submit"
      disabled={pending || disabled}
      style={{ opacity: pending || disabled ? 0.5 : 1 }}
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

type FieldKey = "email" | "password";

export function SigninForm() {
  const [state, formAction] = useActionState<AuthFormState, FormData>(signIn, undefined);
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function shouldShow(field: FieldKey): boolean {
    return Boolean(errors[field]) && (submitTried || Boolean(touched[field]));
  }

  function invalidProps(field: FieldKey) {
    return shouldShow(field) ? ({ "aria-invalid": "true" } as const) : {};
  }

  function handleSubmit(formData: FormData) {
    setSubmitTried(true);
    if (!isValid) {
      const count = Object.keys(errors).length;
      setLiveAnnounce(`${count} field${count === 1 ? "" : "s"} need${count === 1 ? "s" : ""} your attention.`);
      requestAnimationFrame(() => focusFirstInvalid(formRef.current));
      return;
    }
    formData.set("email", form.email.trim());
    formData.set("password", form.password);
    formAction(formData);
  }

  return (
    <div className="signup-form-col" style={{ paddingTop: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <h1 className="signup-title">Welcome back</h1>
        <p className="signup-subtitle">Sign in to your LearnGrid account.</p>
      </div>

      {state?.error && (
        <div className="notice notice-red" role="alert">
          <p style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="x" size={16} /> {state.error}
          </p>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">{liveAnnounce}</div>

      <form ref={formRef} action={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="si-email">Email address</label>
          <input
            id="si-email"
            className={`form-input${shouldShow("email") ? " error" : ""}`}
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={() => setTouched({ ...touched, email: true })}
            autoComplete="email"
            {...invalidProps("email")}
            aria-describedby={shouldShow("email") ? "si-email-err" : undefined}
          />
          {shouldShow("email") && (
            <p id="si-email-err" className="form-error">{errors.email}</p>
          )}
        </div>

        <PasswordField
          id="si-password"
          label="Password"
          required
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => setTouched({ ...touched, password: true })}
          error={shouldShow("password") ? errors.password : undefined}
        />

        <div style={{ textAlign: "right", marginBottom: 16, marginTop: -8 }}>
          <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--d-blue)", fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <SubmitButton disabled={!isValid} />
      </form>

      <p className="signup-signin-line">
        New here?{" "}
        <Link href="/signup">Create account</Link>
      </p>
    </div>
  );
}
