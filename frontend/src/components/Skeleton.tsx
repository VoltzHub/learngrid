import type { CSSProperties } from "react";

export function Skeleton({
  width,
  height,
  radius = 8,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className="skeleton"
      style={{
        width: width ?? "100%",
        height: height ?? 16,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}
