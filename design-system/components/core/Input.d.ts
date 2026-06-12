import * as React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  /** Leading icon inside the well (e.g. Lucide `<i data-lucide="mail">`). */
  icon?: React.ReactNode;
  /** Text alignment; "center" adds wide tracking (good for codes). */
  align?: "left" | "center";
  /** Accessible label; falls back to placeholder. */
  ariaLabel?: string;
  style?: React.CSSProperties;
}

/**
 * Neumorphic inset text field. The input well is pressed into the paper,
 * with an optional leading icon. Pairs with Button in forms.
 */
export function Input(props: InputProps): React.ReactElement;
