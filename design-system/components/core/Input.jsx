import React from "react";

/**
 * Input — a neumorphic inset text field. The well is "pressed into" the
 * paper; an optional leading icon sits inside. Used in the Garmin login.
 */
export function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  align = "left",
  ariaLabel,
  style,
  ...rest
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-base)",
        boxShadow: "var(--shadow-neu-inset-sm)",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {icon && (
        <span style={{ display: "inline-flex", width: 15, height: 15, color: "var(--text-muted)", flexShrink: 0 }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel || placeholder}
        style={{
          flex: 1,
          width: "100%",
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-primary)",
          textAlign: align,
          letterSpacing: align === "center" ? "0.25em" : "normal",
        }}
        {...rest}
      />
    </label>
  );
}
