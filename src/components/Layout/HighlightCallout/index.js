import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

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
