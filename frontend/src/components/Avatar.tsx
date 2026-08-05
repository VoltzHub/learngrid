import type { CSSProperties } from "react";

const GRADIENTS = [
  ["#1e57d8", "#6366f1"],
  ["#0891b2", "#22d3ee"],
  ["#16a34a", "#84cc16"],
  ["#d97706", "#f59e0b"],
  ["#db2777", "#f472b6"],
  ["#7c3aed", "#a78bfa"],
  ["#dc2626", "#f97316"],
  ["#0f766e", "#2dd4bf"],
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

export function Avatar({
  name,
  size = 40,
  imageUrl,
  style,
}: {
  name: string | null | undefined;
  size?: number;
  imageUrl?: string | null;
  style?: CSSProperties;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name ?? ""}
        width={size}
        height={size}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  const [a, b] = GRADIENTS[hashName(name ?? "?") % GRADIENTS.length];
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${a}, ${b})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: Math.round(size * 0.4),
        fontWeight: 800,
        flexShrink: 0,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {initials(name)}
    </div>
  );
}
