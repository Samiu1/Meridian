import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. "solid" fills clay; the rest tint the label on a raised pebble. */
  variant?: "primary" | "secondary" | "sage" | "ghost" | "solid";
  /** Control size, mapped to the soft-radius scale. */
  size?: "sm" | "md" | "lg";
  /** Icon node rendered before the label (e.g. a Lucide `<i data-lucide>`). */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/**
 * Neumorphic clay action button. Raised pebble at rest, sinks to an inset
 * well on press. Labels are uppercase Raleway-900 with wide tracking.
 *
 * @startingPoint section="Core" subtitle="Neumorphic button — primary, secondary, sage, ghost & solid" viewport="700x160"
 */
export function Button(props: ButtonProps): React.ReactElement;
