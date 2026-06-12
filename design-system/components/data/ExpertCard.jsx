import React from "react";

/**
 * ExpertCard — a "Council of Experts" agent card: titled icon header, an
 * italic analysis paragraph, and a stack of recommendation chips in inset
 * wells. Lifts on hover, with a soft clay halo bleed in the corner.
 */
export function ExpertCard({
  name,
  role = "Synthetic Logic",
  icon,
  accent = "var(--color-primary)",
  analysis,
  recommendations = [],
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--surface-base)",
        boxShadow: "var(--shadow-neu)",
        borderRadius: "var(--radius-3xl)",
        padding: "40px",
        transform: hover ? "translateY(-8px)" : "none",
        transition: "transform var(--duration-slow) var(--ease-japandi)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: "absolute", top: -40, right: -40, width: 160, height: 160,
          borderRadius: "50%", background: accent,
          filter: "blur(80px)", opacity: hover ? 0.18 : 0.1,
          transition: "opacity var(--duration-slow) var(--ease-japandi)", pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: "var(--radius-lg)",
            background: "var(--surface-base)", boxShadow: "var(--shadow-neu-sm)", color: accent,
          }}
        >
          <span style={{ display: "inline-flex", width: 26, height: 26 }}>{icon}</span>
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", lineHeight: 1.15 }}>{name}</h3>
          <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4em", color: "var(--text-secondary)", marginTop: 6 }}>{role}</p>
        </div>
      </div>

      {analysis && (
        <p style={{ position: "relative", fontFamily: "var(--font-sans)", fontStyle: "italic", fontWeight: 700, fontSize: 17, lineHeight: 1.6, color: "var(--text-primary)", marginBottom: recommendations.length ? 28 : 0 }}>
          {analysis}
        </p>
      )}

      {recommendations.length > 0 && (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
          {recommendations.map((rec, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "16px 18px", borderRadius: "var(--radius-lg)",
                background: "var(--surface-base)", boxShadow: "var(--shadow-neu-inset-sm)",
              }}
            >
              <span style={{ marginTop: 7, width: 6, height: 6, flexShrink: 0, borderRadius: "50%", background: accent, boxShadow: "var(--glow-clay)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)" }}>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
