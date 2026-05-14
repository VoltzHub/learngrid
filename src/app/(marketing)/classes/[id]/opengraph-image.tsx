import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "LearnGrid class";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ClassOgImage({ params }: { params: { id: string } }) {
  const cls = await prisma.class.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      subject: true,
      priceNgn: true,
      durationMinutes: true,
      scheduledAt: true,
      teacher: { select: { fullName: true } },
    },
  });

  if (!cls) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1e57d8, #6366f1)",
            color: "#fff",
            fontSize: 72,
            fontWeight: 800,
          }}
        >
          LearnGrid
        </div>
      ),
      { ...size },
    );
  }

  const dateStr = cls.scheduledAt.toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #1e57d8 0%, #4f46e5 60%, #0f172a 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#fff",
                color: "#1e57d8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              LG
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>LearnGrid</div>
          </div>
          <div
            style={{
              padding: "8px 20px",
              background: "rgba(255,255,255,0.16)",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {cls.subject}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 1050,
            }}
          >
            {cls.title}
          </div>
          <div style={{ fontSize: 26, fontWeight: 500, opacity: 0.9 }}>
            with {cls.teacher.fullName ?? "a verified teacher"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 32, fontSize: 22, opacity: 0.9 }}>
            <span>📅 {dateStr}</span>
            <span>⏱ {cls.durationMinutes} min</span>
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#a7f3d0",
            }}
          >
            ₦{cls.priceNgn.toLocaleString()}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
