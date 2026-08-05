"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useActionState } from "react";
import { signUp, type AuthFormState } from "@/lib/actions/auth";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/Icons";
import { useTeacherSignup } from "@/lib/auth/teacherSignupContext";
import { focusFirstInvalid } from "@/lib/auth/validation";

function SubmitBtn({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn btn-primary btn-block"
      type="submit"
      disabled={pending || disabled}
      style={{ opacity: pending || disabled ? 0.5 : 1 }}
    >
      {pending ? "Submitting..." : "Submit Application"}
    </button>
  );
}

export default function TeacherSignupStep2() {
  const router = useRouter();
  const ctx = useTeacherSignup();
  const formRef = useRef<HTMLFormElement>(null);
  const [step1, setStep1] = useState<Record<string, string> | null>(null);
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [qualFile, setQualFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitTried, setSubmitTried] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState("");
  const qualRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("teacher_step1");
    if (!stored || !ctx.password) {
      // No basic info, or password was lost (refresh / direct nav) — restart flow.
      router.replace("/signup/teacher");
      return;
    }
    setStep1(JSON.parse(stored));
  }, [router, ctx.password]);

  const [state, formAction] = useActionState<AuthFormState, FormData>(signUp, undefined);

  useEffect(() => {
    if (state && !state.error) {
      sessionStorage.removeItem("teacher_step1");
      ctx.clear();
      router.push("/verification-pending");
    }
  }, [state, router, ctx]);

  if (!step1) return null;

  const subjectError = submitTried && !subject ? "Subject is required." : undefined;
  const qualError = submitTried && !qualFile ? "Teaching qualification is required." : undefined;
  const agreedError = submitTried && !agreed ? "You must agree to the Terms to continue." : undefined;
  const filled = subject && qualFile && agreed;

  function handleSubmit(formData: FormData) {
    setSubmitTried(true);
    if (!step1) return;
    if (!subject || !qualFile || !agreed) {
      const missing = [!subject && "subject", !qualFile && "qualification", !agreed && "terms"].filter(Boolean).length;
      setLiveAnnounce(`${missing} item${missing === 1 ? "" : "s"} need${missing === 1 ? "s" : ""} your attention.`);
      requestAnimationFrame(() => focusFirstInvalid(formRef.current));
      return;
    }
    formData.set("fullName", step1.fullName);
    formData.set("email", step1.email);
    formData.set("password", ctx.password);
    formData.set("phone", step1.phone);
    formData.set("role", "TEACHER");
    formData.set("subject", subject);
    formData.set("experience", experience);
    formData.set("bio", bio);
    if (qualFile) formData.set("qualificationFile", qualFile);
    if (idFile) formData.set("governmentIdFile", idFile);
    formAction(formData);
  }

  return (
    <div className="signup-form-col">
      <Link href="/signup/teacher" className="signup-back-link">
        <Icon name="arrowLeft" size={14} /> Back
      </Link>

      <h1 className="signup-title">Teaching profile</h1>
      <p className="signup-subtitle">Step 2 of 2 — Professional details</p>

      <div className="step-progress-named" aria-label="Signup progress: step 2 of 2">
        <div>
          <div className="step-bar active" />
          <p className="step-name">Basic info</p>
        </div>
        <div>
          <div className="step-bar active" />
          <p className="step-name active">Credentials</p>
        </div>
      </div>

      <div role="status" aria-live="polite" className="sr-only">{liveAnnounce}</div>

      <form ref={formRef} action={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="subject">
            Subject / area of expertise <span className="required">*</span>
          </label>
          <input
            id="subject"
            className={`form-input${subjectError ? " error" : ""}`}
            type="text"
            placeholder="e.g. Mathematics, English, Biology"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            {...(subjectError ? ({ "aria-invalid": "true" } as const) : {})}
            aria-describedby={subjectError ? "subject-err" : undefined}
          />
          {subjectError && <p id="subject-err" className="form-error">{subjectError}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="experience">Years of experience</label>
          <input
            id="experience"
            className="form-input"
            type="text"
            placeholder="e.g. 5"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Teaching qualification <span className="required">*</span></label>
          <input ref={qualRef} type="file" accept=".pdf,.jpg,.jpeg,.png" aria-label="Teaching qualification file" style={{ display: "none" }} onChange={(e) => setQualFile(e.target.files?.[0] ?? null)} />
          <button
            type="button"
            className={`upload-zone${qualFile ? " has-file" : ""}${qualError ? " error" : ""}`}
            onClick={() => qualRef.current?.click()}
            {...(qualError ? ({ "aria-invalid": "true" } as const) : {})}
            aria-describedby={qualError ? "qual-err" : undefined}
            style={{ width: "100%", border: "1.5px dashed var(--d-gray-300)", font: "inherit" }}
          >
            {qualFile ? (
              <p className="upload-zone-file" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="paperclip" size={15} /> {qualFile.name} · {(qualFile.size / 1024).toFixed(0)} KB
              </p>
            ) : (
              <p className="upload-zone-text">Tap to upload · PDF, JPG, PNG</p>
            )}
          </button>
          {qualError && (
            <p id="qual-err" className="form-error" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="alertTriangle" size={14} /> {qualError}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Government ID / NIN</label>
          <input ref={idRef} type="file" accept=".pdf,.jpg,.jpeg,.png" aria-label="Government ID or NIN file" style={{ display: "none" }} onChange={(e) => setIdFile(e.target.files?.[0] ?? null)} />
          <button
            type="button"
            className={`upload-zone${idFile ? " has-file" : ""}`}
            onClick={() => idRef.current?.click()}
            style={{ width: "100%", border: "1.5px dashed var(--d-gray-300)", font: "inherit" }}
          >
            {idFile ? (
              <p className="upload-zone-file" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="paperclip" size={15} /> {idFile.name} · {(idFile.size / 1024).toFixed(0)} KB
              </p>
            ) : (
              <p className="upload-zone-text">Tap to upload · PDF, JPG, PNG</p>
            )}
          </button>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="bio">Brief bio</label>
          <textarea
            id="bio"
            className="form-input form-textarea"
            placeholder="Describe your teaching style and background..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {state?.error && (
          <div className="notice notice-red" role="alert">
            <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="alertTriangle" size={16} /> {state.error}
            </p>
          </div>
        )}

        <div className="notice notice-amber">
          <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="clock" size={16} /> Your account activates only after document verification — typically <strong>24–48 hours</strong>.
          </p>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            id="teacher-terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            {...(agreedError ? ({ "aria-invalid": "true" } as const) : {})}
            aria-describedby={agreedError ? "terms-err" : undefined}
          />
          <label htmlFor="teacher-terms">
            I agree to LearnGrid&apos;s <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>, including the teacher payout terms.
          </label>
        </div>
        {agreedError && <p id="terms-err" className="form-error" style={{ marginTop: -8, marginBottom: 12 }}>{agreedError}</p>}

        <SubmitBtn disabled={!filled} />
      </form>
    </div>
  );
}
