import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// Small color-coded label for a state such as "Open" or "Live". The tone
// drives the color only; the label is whatever the caller passes, translated.

const TONES = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  neutral: styles.neutral,
};

/**
 * Small color-coded label for a state such as "Open" or "Live".
 *
 * @param {object} props
 * @param {React.ReactNode} props.label Pill text, already translated.
 * @param {string} [props.tone="neutral"] Color: "info", "success", "warning", or "neutral".
 * @param {string} [props.className] Extra class on the pill.
 */
export default function StatusPill({ label, tone = "neutral", className }) {
  return (
    <span className={clsx(styles.pill, TONES[tone] || TONES.neutral, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  );
}
