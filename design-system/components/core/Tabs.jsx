import React from "react";

/**
 * Tabs — the floating pill navigation from the bottom of the dashboard.
 * A raised neumorphic rail of segments; the active segment is an inset well
 * with a clay label. Renders as a horizontal control you can place anywhere.
 */
export function Tabs({ items = [], value, onChange, style, ...rest }) {
  return (
    <nav
      role="tablist"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px",
        borderRadius: "var(--radius-pill)",
        background: "var(--surface-base)",
        boxShadow: "var(--shadow-float)",
        ...style,
      }}
      {...rest}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            aria-label={item.label}
            onClick={() => onChange && onChange(item.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              border: "none",
              cursor: "pointer",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-base)",
              boxShadow: active ? "var(--shadow-neu-inset)" : "none",
              color: active ? "var(--color-primary)" : "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              lineHeight: 1,
              transition: "box-shadow var(--duration-normal) var(--ease-japandi), color var(--duration-normal) var(--ease-japandi)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {item.icon && (
              <span
                style={{
                  display: "inline-flex",
                  width: 18,
                  height: 18,
                  transform: active ? "scale(1.1)" : "scale(1)",
                  transition: "transform var(--duration-normal) var(--ease-japandi)",
                }}
              >
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
