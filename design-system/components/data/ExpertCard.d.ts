import * as React from "react";

export interface ExpertCardProps {
  /** Agent name, e.g. "Cardio Guardian". */
  name: string;
  /** Small role caption (default "Synthetic Logic"). */
  role?: string;
  /** Icon node (Lucide `<i data-lucide="…">`). */
  icon?: React.ReactNode;
  /** Accent colour for the icon, halo, and rec dots. */
  accent?: string;
  /** Italic analysis paragraph. */
  analysis?: string;
  /** Recommendation strings, rendered as inset chips. */
  recommendations?: string[];
  style?: React.CSSProperties;
}

/**
 * A "Council of Experts" agent card: titled icon header, italic analysis, and
 * a stack of recommendation chips. Use in a 3-up grid on the analysis screen.
 *
 * @startingPoint section="Data" subtitle="AI expert insight card with recommendations" viewport="420x460"
 */
export function ExpertCard(props: ExpertCardProps): React.ReactElement;
