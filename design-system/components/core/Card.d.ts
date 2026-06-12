import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Soft-UI elevation. */
  elevation?: "flat" | "inset" | "sm" | "float" | "none";
  /** Corner radius on the pebble scale. */
  radius?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Internal padding preset. */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Element tag to render. */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * The foundational neumorphic pebble surface. Compose all panels, tiles, and
 * sections from this. Larger radii (`3xl`/`4xl`) read as hero/section cards.
 *
 * @startingPoint section="Core" subtitle="Neumorphic pebble surface — the base of every panel" viewport="700x260"
 */
export function Card(props: CardProps): React.ReactElement;
