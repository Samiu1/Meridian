import React from "react";

/**
 * ScoreRing — the hero composite-index dial. A circular SVG progress ring
 * (clay stroke on a soft track) wrapping a huge italic serif numeral.
 * Animates the arc on mount.
 */
export function ScoreRing({
  value = 0,
  max = 100,
  size = 256,
  stroke = 20,
  label = "Points",
  color = "var(--color-primary)",
  style,
  ...rest
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const [offset, setOffset] = React.useState(c);

  React.useEffect(() => {
    const t = requestAnimationFrame(() => setOffset(c - c * pct));
    return () => cancelAnimationFrame(t);
  }, [c, pct]);

  return (
    <div style={{ position: "relative", width: size, height: size, ...style }} {...rest}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--paper-200)" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{
            filter: "drop-shadow(0 0 12px rgba(184,144,118,0.35))",
            transition: "stroke-dashoffset 2s var(--ease-japandi)",
          }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 700, fontSize: size * 0.34, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
          {value || "--"}
        </span>
        <span style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--text-secondary)", marginTop: 8 }}>
          {label}
        </span>
      </div>
    </div>
  );
}
