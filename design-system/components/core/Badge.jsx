import React from "react";

/**
 * Badge — a small pill label. Two looks:
 *  - "soft": tinted paper backing (status chips)
 *  - "neu":  raised pebble pill (the "Deep Synthesis Active" header chip)
 * Optionally shows a leading dot, which can pulse.
 */
export function Badge({
  children,
  tone = "neutral",
  look = "soft",
  dot = false,
  pulse = false,
  style,
  ...rest
}) {
  const tones = {
    neutral:  { fg: "var(--text-secondary)", bg: "var(--paper-100)", dot: "var(--taupe-500)" },
    primary:  { fg: "var(--clay-700)",       bg: "var(--clay-100)",  dot: "var(--clay-500)" },
    sage:     { fg: "var(--sage-600)",       bg: "var(--sage-200)",  dot: "var(--sage-500)" },
    success:  { fg: "var(--status-success)", bg: "var(--status-success-soft)", dot: "var(--status-success)" },
    warning:  { fg: "var(--status-warning)", bg: "var(--status-warning-soft)", dot: "var(--status-warning)" },
    danger:   { fg: "var(--status-danger)",  bg: "var(--status-danger-soft)",  dot: "var(--status-danger)" },
    info:     { fg: "var(--status-info)",    bg: "var(--status-info-soft)",    dot: "var(--status-info)" },
  };
  const t = tones[tone] || tones.neutral;
  const isNeu = look === "neu";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: isNeu ? "7px 16px" : "5px 12px",
        borderRadius: "var(--radius-pill)",
        background: isNeu ? "var(--surface-base)" : t.bg,
        boxShadow: isNeu ? "var(--shadow-neu-sm)" : "none",
        color: t.fg,
        fontFamily: "var(--font-sans)",
        fontSize: "10px",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
          <span
            style={{
              width: 7, height: 7, borderRadius: "50%", background: t.dot,
              animation: pulse ? "hs-badge-pulse 1.8s var(--ease-out) infinite" : "none",
            }}
          />
        </span>
      )}
      {children}
      <style>{`@keyframes hs-badge-pulse {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.82)}}`}</style>
    </span>
  );
}
