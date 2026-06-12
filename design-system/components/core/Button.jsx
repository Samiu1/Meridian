import React from "react";

/**
 * Button — the neumorphic clay action button.
 * Rest state is a raised "pebble"; pressing sinks it into an inset well.
 * Variants map to the Japandi palette; sizes follow the soft-radius scale.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "10px 18px", fontSize: "9px", radius: "var(--radius-md)", gap: "6px", tracking: "0.18em" },
    md: { padding: "14px 26px", fontSize: "10px", radius: "var(--radius-lg)", gap: "8px", tracking: "0.2em" },
    lg: { padding: "18px 34px", fontSize: "11px", radius: "var(--radius-xl)", gap: "10px", tracking: "0.2em" },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary:   { color: "var(--color-primary)" },
    secondary: { color: "var(--color-secondary)" },
    sage:      { color: "var(--color-accent)" },
    ghost:     { color: "var(--text-muted)" },
  };
  const v = variants[variant] || variants.primary;

  const isSolid = variant === "solid";
  const base = {
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
    background: isSolid ? "var(--color-primary)" : "var(--surface-base)",
    color: isSolid ? "var(--text-on-clay)" : v.color,
    boxShadow: variant === "ghost" ? "none" : "var(--shadow-neu-sm)",
    transition: "box-shadow var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
    WebkitTapHighlightColor: "transparent",
    ...style,
  };

  const press = (e) => {
    if (disabled) return;
    e.currentTarget.style.boxShadow = "var(--shadow-neu-inset-sm)";
    e.currentTarget.style.transform = "translateY(1px)";
  };
  const release = (e) => {
    if (disabled) return;
    e.currentTarget.style.boxShadow = variant === "ghost" ? "none" : "var(--shadow-neu-sm)";
    e.currentTarget.style.transform = "none";
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      style={base}
      {...rest}
    >
      {iconLeft && <span style={{ display: "inline-flex", width: 14, height: 14 }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex", width: 14, height: 14 }}>{iconRight}</span>}
    </button>
  );
}
