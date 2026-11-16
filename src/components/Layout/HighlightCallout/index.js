import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

/**
 * Highlighted callout box with an optional leading icon.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.icon] Decorative icon shown before the content.
 * @param {React.ReactNode} props.children Callout content.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function HighlightCallout({ icon, children, className }) {
  return (
    <div className={clsx(styles.callout, className)}>
      {icon && (
        <span className={styles.iconWrap} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
