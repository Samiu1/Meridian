/* Button — neumorphic clay action button. Rest = raised pebble; press sinks
   to an inset well (the soft-UI signature). Labels are terse uppercase. */
"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "sage" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { padding: string; fontSize: string; radius: string; gap: string; tracking: string }> = {
  sm: { padding: "10px 18px", fontSize: "9px", radius: "var(--radius-md)", gap: "6px", tracking: "0.18em" },
  md: { padding: "14px 26px", fontSize: "10px", radius: "var(--radius-lg)", gap: "8px", tracking: "0.2em" },
  lg: { padding: "18px 34px", fontSize: "11px", radius: "var(--radius-xl)", gap: "10px", tracking: "0.2em" },
};

const COLORS: Record<Variant, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  sage: "var(--color-accent)",
  ghost: "var(--text-muted)",
  danger: "var(--status-danger)",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);
  const s = SIZES[size];
  const ghost = variant === "ghost";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        width: fullWidth ? "100%" : "auto",
        padding: s.padding,
        borderRadius: s.radius,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: s.tracking,
        lineHeight: 1,
        opacity: disabled ? 0.45 : 1,
        background: "var(--surface-base)",
        color: COLORS[variant],
        boxShadow: ghost ? "none" : pressed && !disabled ? "var(--shadow-neu-inset-sm)" : "var(--shadow-neu-sm)",
        transform: pressed && !disabled ? "translateY(1px)" : "none",
        transition:
          "box-shadow var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
        ...style,
      }}
    >
      {iconLeft && <span style={{ display: "inline-flex", width: 14, height: 14 }}>{iconLeft}</span>}
      {children}
    </button>
  );
}
