"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitRating, type RatingFormState } from "@/lib/actions/ratings";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-block" type="submit" disabled={pending} style={{ opacity: pending ? 0.5 : 1 }}>
      {pending ? "Submitting..." : "Submit Rating"}
    </button>
  );
}

export default function RateClassPage({ params }: { params: { id: string } }) {
  const [state, formAction] = useFormState<RatingFormState, FormData>(submitRating, undefined);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);

  if (state?.success) {
    return (
      <div style={{ padding: "18px" }}>
        <div className="success-state">
          <div className="success-icon" style={{ background: "var(--d-green-light)", color: "var(--d-green)" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Thanks for your review!</h2>
          <p style={{ fontSize: 13, color: "var(--d-gray-500)", marginBottom: 24 }}>
            Your feedback helps other students find great classes.
          </p>
          <Link className="btn btn-primary btn-block" href="/dashboard/student/classes">
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-back-header">
        <Link href="/dashboard/student/classes" className="page-back-btn" aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="m12 19-7-7 7-7M19 12H5" /></svg>
        </Link>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, flex: 1 }}>Rate Class</h2>
      </div>

      <div style={{ padding: "16px 18px 28px" }}>
        <form action={formAction}>
          <input type="hidden" name="classId" value={params.id} />
          <input type="hidden" name="stars" value={selectedStars} />

          <div style={{ textAlign: "center", margin: "12px 0 24px" }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>How was this class?</p>
            <div className="star-rating-input" onMouseLeave={() => setHoveredStars(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelectedStars(n)}
                  onMouseEnter={() => setHoveredStars(n)}
                  className={`star-btn${n <= (hoveredStars || selectedStars) ? " active" : ""}`}
                  aria-label={`${n} star${n !== 1 ? "s" : ""}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M12 2l3 6 6.5.9-4.8 4.7 1.1 6.4L12 17l-5.8 3 1.1-6.4-4.8-4.7L9 8l3-6Z" />
                  </svg>
                </button>
              ))}
            </div>
            {selectedStars > 0 && (
              <p style={{ fontSize: 12, color: "var(--d-gray-500)", margin: "8px 0 0" }}>
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][selectedStars]}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Comment (optional)</label>
            <textarea
              className="form-input form-textarea"
              name="comment"
              placeholder="What did you like about this class?"
              maxLength={500}
            />
          </div>

          {state?.error && (
            <div className="notice notice-red" style={{ marginBottom: 12 }}>
              <p>{state.error}</p>
            </div>
          )}

          <SubmitBtn />
        </form>
      </div>
    </>
  );
}
