import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// Small colour-coded label for a lifecycle or availability state, for example
// "In development", "Open now" or "Live on mainnet". The tone drives the
// colour only; the label is whatever the caller passes, already translated.
//
// Props:
//   label     - visible text (required)
//   tone      - "info" | "success" | "warning" | "neutral" (default "neutral")
//   className - extra class for layout tweaks

const TONES = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  neutral: styles.neutral,
};

export default function StatusPill({ label, tone = "neutral", className }) {
  return (
    <span className={clsx(styles.pill, TONES[tone] || TONES.neutral, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  );
}
