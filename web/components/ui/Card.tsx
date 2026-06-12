/* Card — the neumorphic "pebble" surface. Ported from the design system:
   same paper as the page, defined by dual shadow alone; no borders. */
import type { CSSProperties, ReactNode } from "react";

type Elevation = "flat" | "inset" | "sm" | "float" | "none";
type Radius = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type Padding = "none" | "sm" | "md" | "lg" | "xl";

const SHADOWS: Record<Elevation, string> = {
  flat: "var(--shadow-neu)",
  inset: "var(--shadow-neu-inset)",
  sm: "var(--shadow-neu-sm)",
  float: "var(--shadow-float)",
  none: "none",
};
const RADII: Record<Radius, string> = {
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  "4xl": "var(--radius-4xl)",
};
const PADS: Record<Padding, string> = {
  none: "0",
  sm: "20px",
  md: "28px",
  lg: "40px",
  xl: "56px",
};

export function Card({
  children,
  elevation = "flat",
  radius = "xl",
  padding = "lg",
  style,
}: {
  children: ReactNode;
  elevation?: Elevation;
  radius?: Radius;
  padding?: Padding;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--surface-base)",
        boxShadow: SHADOWS[elevation],
        borderRadius: RADII[radius],
        padding: PADS[padding],
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
