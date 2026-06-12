/* Badge — small pill label. "soft" = tinted paper chip; "neu" = raised pill. */
import type { CSSProperties, ReactNode } from "react";

type Tone = "neutral" | "primary" | "sage" | "success" | "warning" | "danger" | "info";

const TONES: Record<Tone, { fg: string; bg: string; dot: string }> = {
  neutral: { fg: "var(--text-secondary)", bg: "var(--paper-100)", dot: "var(--taupe-500)" },
  primary: { fg: "var(--clay-700)", bg: "var(--clay-100)", dot: "var(--clay-500)" },
  sage: { fg: "var(--sage-600)", bg: "var(--sage-200)", dot: "var(--sage-500)" },
  success: { fg: "var(--status-success)", bg: "var(--status-success-soft)", dot: "var(--status-success)" },
  warning: { fg: "var(--status-warning)", bg: "var(--status-warning-soft)", dot: "var(--status-warning)" },
  danger: { fg: "var(--status-danger)", bg: "var(--status-danger-soft)", dot: "var(--status-danger)" },
  info: { fg: "var(--status-info)", bg: "var(--status-info-soft)", dot: "var(--status-info)" },
};

export function Badge({
  children,
  tone = "neutral",
  look = "soft",
  dot = false,
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  look?: "soft" | "neu";
  dot?: boolean;
  style?: CSSProperties;
}) {
  const t = TONES[tone];
  const neu = look === "neu";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: neu ? "7px 16px" : "5px 12px",
        borderRadius: "var(--radius-pill)",
        background: neu ? "var(--surface-base)" : t.bg,
        boxShadow: neu ? "var(--shadow-neu-sm)" : "none",
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
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot }} />}
      {children}
    </span>
  );
}
