import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

/**
 * Decorative dotted connector line, optionally with a dot at each end.
 *
 * @param {object} props
 * @param {string} [props.direction="horizontal"] Line direction: "horizontal" or "vertical".
 * @param {boolean} [props.withDots=true] Shows the end dots.
 * @param {string} [props.className] Extra class on the line.
 * @param {object} [props.style] Inline style on the line, e.g. to set `--connection-color`.
 */
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
