import * as React from "react";

export interface TabItem {
  value: string;
  label: string;
  /** Optional icon node (Lucide `<i data-lucide="…">`). */
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** Currently selected tab value. */
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/**
 * Floating pill navigation. A raised rail of segments where the active
 * segment sinks to an inset well with a clay label. Place fixed at the
 * bottom of a view, or inline anywhere a segmented control is needed.
 *
 * @startingPoint section="Navigation" subtitle="Floating neumorphic pill tab bar" viewport="700x140"
 */
export function Tabs(props: TabsProps): React.ReactElement;
