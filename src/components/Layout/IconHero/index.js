import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

/**
 * Decorative icon tile for page heroes, optionally with a halo.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Icon shown in the tile.
 * @param {string} [props.className] Extra class on the wrapper.
 * @param {boolean} [props.withHalo=true] Shows the halo around the tile.
 */
export default function IconHero({ children, className, withHalo = true }) {
  return (
    <div
      className={clsx(withHalo ? styles.hero : styles.heroPlain, className)}
      aria-hidden="true"
    >
      <div className={styles.tile}>{children}</div>
    </div>
  );
}
