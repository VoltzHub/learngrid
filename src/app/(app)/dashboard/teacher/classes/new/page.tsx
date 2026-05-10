"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { createClass, type ClassFormState } from "@/lib/actions/classes";
import { Icon } from "@/components/Icons";

function SubmitBtn({ label, disabled }: { label: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending || disabled} style={{ flex: 1, opacity: pending || disabled ? 0.5 : 1 }}>
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function CreateClassPage() {
  const [state, formAction] = useFormState<ClassFormState, FormData>(createClass, undefined);

  if (state?.success) {
    return (
      <>
        <div className="page-back-header">
          <Link href="/dashboard/teacher/classes" className="page-back-btn" aria-label="Back"><Icon name="arrowLeft" size={20} /></Link>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>New Live Class</h2>
        </div>
        <div className="success-state">
          <div className="success-icon" style={{ background: "var(--d-gray-100)", color: "var(--d-gray-600)" }}>
            <Icon name="fileText" size={30} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Saved as Draft</h2>
          <p style={{ fontSize: 13, color: "var(--d-gray-500)", lineHeight: 1.6, marginBottom: 6 }}>
            Your class has been saved as a draft.
          </p>
          <p style={{ fontSize: 13, color: "var(--d-gray-500)", marginBottom: 24 }}>
            Publish when ready - students can&apos;t see drafts.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/dashboard/teacher/classes" style={{ flex: 1, textAlign: "center" }}>
              View Classes
            </Link>
            <Link className="btn btn-secondary" href="/dashboard/teacher/classes/new" style={{ flex: 1, textAlign: "center" }}>
              Create Another
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-back-header">
        <Link href="/dashboard/teacher/classes" className="page-back-btn" aria-label="Back"><Icon name="arrowLeft" size={20} /></Link>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>New Live Class</h2>
      </div>

      <div style={{ padding: "16px 18px 28px" }}>
        <form action={formAction}>
          <div className="form-group">
            <label className="form-label">Class Title <span className="required">*</span></label>
            <input className="form-input" type="text" name="title" placeholder="e.g. WAEC Mathematics Masterclass" required />
          </div>

          <div className="form-group">
            <label className="form-label">Subject <span className="required">*</span></label>
            <input className="form-input" type="text" name="subject" placeholder="e.g. Mathematics" required />
          </div>

          <div className="form-group">
            <label className="form-label">Date <span className="required">*</span></label>
            <input className="form-input" type="date" name="scheduledAt" required />
          </div>

          <div className="form-group">
            <label className="form-label">Start Time <span className="required">*</span></label>
            <input className="form-input" type="time" name="startTime" required />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes) <span className="required">*</span></label>
            <input className="form-input" type="number" name="durationMinutes" placeholder="e.g. 60 or 90" required min={15} />
          </div>

          <div className="form-group">
            <label className="form-label">Price (₦) <span className="required">*</span></label>
            <div className="form-price-wrap">
              <div className="form-price-prefix">₦</div>
              <input className="form-input" type="number" name="priceNgn" placeholder="Amount in Naira" required min={100} />
            </div>
            <p className="form-hint">You keep 85% · LearnGrid fee: 15%</p>
          </div>

          <div className="form-group">
            <label className="form-label">Max Students <span className="required">*</span></label>
            <input className="form-input" type="number" name="seatLimit" placeholder="e.g. 20" required min={1} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" name="description" placeholder="Describe what students will learn..." />
          </div>

          {state?.error && (
            <div className="notice notice-red">
              <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="alertTriangle" size={16} /> {state.error}
              </p>
            </div>
          )}

          <div className="notice notice-blue">
            <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="pin" size={16} /> Saved as <strong>DRAFT</strong> first. Only published classes are visible to students.
            </p>
          </div>

          <div className="btn-row">
            <Link className="btn btn-secondary" href="/dashboard/teacher/classes" style={{ flex: 1, textAlign: "center" }}>
              Cancel
            </Link>
            <SubmitBtn label="Save & Review" />
          </div>
        </form>
      </div>
    </>
  );
}
