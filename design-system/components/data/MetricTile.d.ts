import * as React from "react";

export interface MetricTileProps {
  /** Eyebrow label, e.g. "Heart Rate". */
  label: string;
  /** The big serif value. */
  value: string | number;
  /** Unit suffix, e.g. "BPM". */
  unit?: string;
  /** Icon node (Lucide `<i data-lucide="…">`). */
  icon?: React.ReactNode;
  /** Icon colour (a status or brand token). */
  iconColor?: string;
  /** 0–100 progress bar; omit to hide the bar. */
  progress?: number | null;
  style?: React.CSSProperties;
}

/**
 * A single biometric readout pebble — icon chip, eyebrow label, big italic
 * serif value, and an optional clay progress bar. Lifts gently on hover.
 *
 * @startingPoint section="Data" subtitle="Biometric metric tile with value + progress" viewport="360x240"
 */
export function MetricTile(props: MetricTileProps): React.ReactElement;
