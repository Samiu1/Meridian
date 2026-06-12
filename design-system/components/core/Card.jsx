import React from "react";

/**
 * Card — the foundational neumorphic "pebble" surface. Everything in the
 * product sits on one of these: raised (flat), pressed (inset), or floating.
 * Radius defaults to the soft xl; bump it up for hero/section cards.
 */
export function Card({
  children,
  elevation = "flat",
  radius = "xl",
  padding = "lg",
  as = "div",
  style,
  ...rest
}) {
  const shadows = {
    flat: "var(--shadow-neu)",
    inset: "var(--shadow-neu-inset)",
    sm: "var(--shadow-neu-sm)",
    float: "var(--shadow-float)",
    none: "none",
  };
  const radii = {
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    "3xl": "var(--radius-3xl)",
    "4xl": "var(--radius-4xl)",
  };
  const pads = {
    sm: "20px",
    md: "28px",
    lg: "40px",
    xl: "56px",
    none: "0",
  };

  const Tag = as;
  return (
    <Tag
      style={{
        background: "var(--surface-base)",
        boxShadow: shadows[elevation] ?? shadows.flat,
        borderRadius: radii[radius] ?? radii.xl,
        padding: pads[padding] ?? pads.lg,
        position: "relative",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
