"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/lib/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
      {pending ? "Creating account…" : label}
    </button>
  );
}

export function SignupForm({ role }: { role: "STUDENT" | "TEACHER" }) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(signUp, undefined);

  const heading = role === "TEACHER" ? "Create your teacher account" : "Create your student account";
  const lead =
    role === "TEACHER"
      ? "Once your account is verified, you'll be able to publish live classes."
      : "Find verified teachers and pay per class in Naira.";

  return (
    <div className="auth-card">
      <h1>{heading}</h1>
      <p className="lead">{lead}</p>
      <form className="auth-form" action={formAction}>
        <input type="hidden" name="role" value={role} />
        <label>
          Full name
          <input type="text" name="fullName" required autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {state?.error && <div className="auth-error">{state.error}</div>}
        <SubmitButton label="Create account" />
      </form>
      <p className="auth-foot">
        Already have an account? <Link href="/signin">Sign in</Link>
      </p>
    </div>
  );
}
