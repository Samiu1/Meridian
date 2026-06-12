import React from "react";

/**
 * SectionHeader — the eyebrow-label-plus-hairline divider that opens every
 * dashboard section ("Recovery Symphony", "Signal Trends"). The label sits
 * left; a thin clay rule extends to fill the row.
 */
export function SectionHeader({ children, align = "left", style, ...rest }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexDirection: align === "right" ? "row-reverse" : "row",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.3em",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <span style={{ flex: 1, height: 1, background: "var(--border-hairline)" }} />
    </div>
  );
}
