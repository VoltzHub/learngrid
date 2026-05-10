"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { signUp, type AuthFormState } from "@/lib/actions/auth";
import { useFormState, useFormStatus } from "react-dom";

function SubmitBtn({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-block" type="submit" disabled={pending || disabled} style={{ opacity: pending || disabled ? 0.5 : 1 }}>
      {pending ? "Submitting…" : "Submit Application"}
    </button>
  );
}

export default function TeacherSignupStep2() {
  const router = useRouter();
  const [step1, setStep1] = useState<Record<string, string> | null>(null);
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [qualFile, setQualFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const qualRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("teacher_step1");
    if (!stored) {
      router.replace("/signup/teacher");
      return;
    }
    setStep1(JSON.parse(stored));
  }, [router]);

  const [state, formAction] = useFormState<AuthFormState, FormData>(signUp, undefined);

  // If signup succeeded, redirect to verification pending
  useEffect(() => {
    if (state && !state.error) {
      sessionStorage.removeItem("teacher_step1");
      router.push("/verification-pending");
    }
  }, [state, router]);

  if (!step1) return null;

  const filled = subject && qualFile;

  function handleSubmit(formData: FormData) {
    if (!step1) return;
    if (!qualFile) {
      setError("Teaching qualification is required.");
      return;
    }
    // Inject step1 data into formData
    formData.set("fullName", step1.fullName);
    formData.set("email", step1.email);
    formData.set("password", step1.password);
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
    <div style={{ padding: "24px 20px 32px", maxWidth: 400, margin: "0 auto" }}>
      <Link href="/signup/teacher" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--d-gray-500)", fontSize: 13, marginBottom: 20 }}>
        ← Back
      </Link>

      <Link href="/" className="brand" style={{ marginBottom: 0 }}>
        <span className="brand-mark" style={{ width: 28, height: 28 }}><img src="/assets/logo-cap.svg" alt="" /></span>
        <span className="brand-text" style={{ fontSize: "1rem" }}>LearnGrid</span>
      </Link>

      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "14px 0 3px", letterSpacing: "-0.3px" }}>
        Teaching Profile
      </h1>
      <p style={{ fontSize: 13, color: "var(--d-gray-500)", marginBottom: 14 }}>
        Step 2 of 2 — Professional Details
      </p>

      <div className="step-progress">
        <div className="step-bar active" />
        <div className="step-bar active" />
      </div>

      <form action={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Subject / Area of Expertise <span className="required">*</span></label>
          <input className="form-input" type="text" placeholder="e.g. Mathematics, English, Biology" required value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <input className="form-input" type="text" placeholder="e.g. 5" value={experience} onChange={(e) => setExperience(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Teaching Qualification <span className="required">*</span></label>
          <input ref={qualRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => setQualFile(e.target.files?.[0] ?? null)} />
          <div className={`upload-zone${qualFile ? " has-file" : ""}${error && !qualFile ? " error" : ""}`} onClick={() => qualRef.current?.click()}>
            {qualFile ? (
              <p className="upload-zone-file">📎 {qualFile.name} · {(qualFile.size / 1024).toFixed(0)} KB</p>
            ) : (
              <p className="upload-zone-text">Tap to upload · PDF, JPG, PNG</p>
            )}
          </div>
          {error && !qualFile && <p className="form-error">⚠ {error}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Government ID / NIN <span className="required">*</span></label>
          <input ref={idRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => setIdFile(e.target.files?.[0] ?? null)} />
          <div className={`upload-zone${idFile ? " has-file" : ""}`} onClick={() => idRef.current?.click()}>
            {idFile ? (
              <p className="upload-zone-file">📎 {idFile.name} · {(idFile.size / 1024).toFixed(0)} KB</p>
            ) : (
              <p className="upload-zone-text">Tap to upload · PDF, JPG, PNG</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Brief Bio</label>
          <textarea className="form-input form-textarea" placeholder="Describe your teaching style and background…" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        {state?.error && (
          <div className="notice notice-red">
            <p>⚠ {state.error}</p>
          </div>
        )}

        <div className="notice notice-amber">
          <p>⏱ Your account activates only after document verification. This takes <strong>24–48 hours</strong>.</p>
        </div>

        <SubmitBtn disabled={!filled} />
      </form>
    </div>
  );
}
