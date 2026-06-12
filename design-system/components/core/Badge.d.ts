import * as React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
  /** Colour role. */
  tone?: "neutral" | "primary" | "sage" | "success" | "warning" | "danger" | "info";
  /** "soft" = tinted paper chip; "neu" = raised pebble pill. */
  look?: "soft" | "neu";
  /** Show a leading status dot. */
  dot?: boolean;
  /** Animate the dot with a calm pulse. */
  pulse?: boolean;
  style?: React.CSSProperties;
}

/**
 * Small uppercase pill label / status chip. Use `look="neu"` with a pulsing
 * dot for live-state header chips; `look="soft"` for inline status tags.
 */
export function Badge(props: BadgeProps): React.ReactElement;
