import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LearnGrid — Teach Live. Learn Live. Earn in Naira.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #1e57d8 0%, #4f46e5 50%, #6366f1 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#fff",
              color: "#1e57d8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            LG
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}>
            LearnGrid
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Teach Live. Learn Live.
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#a7f3d0",
            }}
          >
            Earn in Naira.
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              opacity: 0.9,
              maxWidth: 900,
              marginTop: 16,
            }}
          >
            Nigeria&rsquo;s live learning marketplace. Verified teachers, secure
            Paystack payments, real-time classes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 22,
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          <span>✓ Verified teachers</span>
          <span>·</span>
          <span>✓ Pay per class in Naira</span>
          <span>·</span>
          <span>✓ Live & interactive</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
