import * as React from "react";

export interface ScoreRingProps {
  /** Current score. */
  value: number;
  /** Scale maximum (default 100). */
  max?: number;
  /** Diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  stroke?: number;
  /** Caption under the numeral. */
  label?: string;
  /** Arc colour. */
  color?: string;
  style?: React.CSSProperties;
}

/**
 * The hero composite-index dial: an animated circular progress ring around a
 * huge italic serif numeral. Use as the focal point of an overview screen.
 *
 * @startingPoint section="Data" subtitle="Animated composite-score dial" viewport="320x320"
 */
export function ScoreRing(props: ScoreRingProps): React.ReactElement;
