import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function IconHero({ children, className }) {
  return (
    <div className={clsx(styles.hero, className)} aria-hidden="true">
      <div className={styles.tile}>{children}</div>
    </div>
  );
}
