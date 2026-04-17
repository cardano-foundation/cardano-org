import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function ConnectionLine({
  direction = "horizontal",
  withDots = true,
  className,
  style,
}) {
  return (
    <span
      className={clsx(
        styles.line,
        direction === "vertical" ? styles.vertical : styles.horizontal,
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      {withDots && (
        <>
          <span className={clsx(styles.dot, styles.dotStart)} />
          <span className={clsx(styles.dot, styles.dotEnd)} />
        </>
      )}
    </span>
  );
}
