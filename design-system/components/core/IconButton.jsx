import React from "react";

/**
 * IconButton — a square/round neumorphic control holding a single icon.
 * Used for settings, sync, and the floating-nav utility buttons.
 */
export function IconButton({
  icon,
  shape = "rounded",
  size = "md",
  variant = "muted",
  active = false,
  disabled = false,
  ariaLabel,
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: { box: 36, icon: 16, radius: "var(--radius-md)" },
    md: { box: 48, icon: 20, radius: "var(--radius-lg)" },
    lg: { box: 56, icon: 22, radius: "var(--radius-xl)" },
  };
  const s = sizes[size] || sizes.md;
  const colors = {
    muted: "var(--text-muted)",
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    sage: "var(--color-accent)",
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: s.box,
    height: s.box,
    padding: 0,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: shape === "circle" ? "var(--radius-pill)" : s.radius,
    background: "var(--surface-base)",
    color: colors[variant] || colors.muted,
    boxShadow: active ? "var(--shadow-neu-inset)" : "var(--shadow-neu-sm)",
    opacity: disabled ? 0.45 : 1,
    transition: "box-shadow var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
    WebkitTapHighlightColor: "transparent",
    ...style,
  };

  const press = (e) => {
    if (disabled || active) return;
    e.currentTarget.style.boxShadow = "var(--shadow-neu-inset-sm)";
  };
  const release = (e) => {
    if (disabled || active) return;
    e.currentTarget.style.boxShadow = "var(--shadow-neu-sm)";
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      style={base}
      {...rest}
    >
      <span style={{ display: "inline-flex", width: s.icon, height: s.icon }}>{icon}</span>
    </button>
  );
}
