"use client";

import { useEffect, useState, useTransition } from "react";
import { initializePayment, verifyAndEnrol } from "@/lib/actions/enrolment";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

export function EnrolButton({
  classId,
  amount,
  verifyRef,
}: {
  classId: string;
  amount: number;
  verifyRef?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "loading" | "verifying" | "success" | "error">(
    verifyRef ? "verifying" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  // If we have a ref from redirect, verify it on mount
  useEffect(() => {
    if (verifyRef) {
      startTransition(async () => {
        const result = await verifyAndEnrol(verifyRef);
        if (result.success) {
          setStatus("success");
        } else {
          setError(result.error ?? "Verification failed");
          setStatus("error");
        }
      });
    }
  }, [verifyRef]);

  // Load Paystack script
  useEffect(() => {
    if (document.getElementById("paystack-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleEnrol = () => {
    setStatus("loading");
    setError(null);

    startTransition(async () => {
      const result = await initializePayment(classId);

      if (result.error) {
        setError(result.error);
        setStatus("error");
        return;
      }

      if (!result.accessCode || !window.PaystackPop) {
        // Fallback: redirect to Paystack
        if (result.authorizationUrl) {
          window.location.href = result.authorizationUrl;
        }
        return;
      }

      // Use Paystack inline popup
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: result.email,
        amount: result.amountKobo,
        ref: result.reference,
        onClose: () => {
          setStatus("idle");
        },
        callback: async () => {
          setStatus("verifying");
          const verifyResult = await verifyAndEnrol(result.reference!);
          if (verifyResult.success) {
            setStatus("success");
            window.location.reload();
          } else {
            setError(verifyResult.error ?? "Verification failed");
            setStatus("error");
          }
        },
      });

      handler.openIframe();
    });
  };

  if (status === "success") {
    return (
      <div className="enrol-enrolled">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
          <path d="m20 6-11 11-5-5" />
        </svg>
        <span>Enrolled successfully!</span>
      </div>
    );
  }

  return (
    <>
      <button
        className="btn btn-primary btn-block enrol-btn"
        onClick={handleEnrol}
        disabled={isPending || status === "loading" || status === "verifying"}
      >
        {status === "loading" && "Initializing..."}
        {status === "verifying" && "Verifying payment..."}
        {(status === "idle" || status === "error") &&
          `Enrol Now — ₦${amount.toLocaleString()}`}
      </button>
      {error && (
        <p className="enrol-error">{error}</p>
      )}
    </>
  );
}
