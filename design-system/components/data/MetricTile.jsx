import React from "react";

/**
 * MetricTile — a single biometric readout pebble: icon chip, eyebrow label,
 * big italic serif value + unit, and a thin clay progress bar. Lifts on hover.
 */
export function MetricTile({
  label,
  value,
  unit,
  icon,
  iconColor = "var(--color-primary)",
  progress = null,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-base)",
        boxShadow: "var(--shadow-neu)",
        borderRadius: "var(--radius-2xl)",
        padding: "32px",
        transform: hover ? "translateY(-6px)" : "none",
        transition: "transform var(--duration-slow) var(--ease-japandi)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-base)",
            boxShadow: "var(--shadow-neu-sm)",
            color: iconColor,
          }}
        >
          <span style={{ display: "inline-flex", width: 22, height: 22 }}>{icon}</span>
        </div>
        <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--text-secondary)", textAlign: "right", maxWidth: 110 }}>
          {label}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 700, fontSize: 48, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-secondary)" }}>
            {unit}
          </span>
        )}
      </div>

      {progress != null && (
        <div style={{ marginTop: 28, height: 6, width: "100%", borderRadius: "var(--radius-pill)", background: "var(--surface-base)", boxShadow: "var(--shadow-neu-inset-sm)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              borderRadius: "var(--radius-pill)",
              background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
              boxShadow: "var(--glow-clay)",
              transition: "width var(--duration-slow) var(--ease-japandi)",
            }}
          />
        </div>
      )}
    </div>
  );
}
