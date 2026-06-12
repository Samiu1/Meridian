import * as React from "react";

export interface IconButtonProps {
  /** Icon node — typically a Lucide `<i data-lucide="…">`. */
  icon: React.ReactNode;
  /** Corner treatment. */
  shape?: "rounded" | "circle";
  size?: "sm" | "md" | "lg";
  /** Icon colour role. */
  variant?: "muted" | "primary" | "secondary" | "sage";
  /** Render the pressed (inset) state — e.g. a toggled control. */
  active?: boolean;
  disabled?: boolean;
  /** Accessible label (icon-only control). */
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Single-icon neumorphic control. Raised at rest; pass `active` for the
 * pressed inset look (toggles). Always supply `ariaLabel`.
 */
export function IconButton(props: IconButtonProps): React.ReactElement;
