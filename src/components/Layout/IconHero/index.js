import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

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
