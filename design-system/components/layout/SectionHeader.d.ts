import * as React from "react";

export interface SectionHeaderProps {
  children?: React.ReactNode;
  /** Which side the label sits on; the hairline fills the rest. */
  align?: "left" | "right";
  style?: React.CSSProperties;
}

/**
 * Eyebrow label + hairline rule that opens each dashboard section. Wide
 * uppercase Raleway-900 label beside a thin clay divider.
 */
export function SectionHeader(props: SectionHeaderProps): React.ReactElement;
