import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useCountUp from "@site/src/utils/useCountUp";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import styles from "./styles.module.css";

// "..." while loading, "n/a" only when the data is there but the figure
// cannot be computed.
function display(loading, value, format) {
  if (loading) return "...";
  return value == null
    ? translate({ id: "governance.treasury.figure.notAvailable", message: "n/a", description: "Shown when a figure cannot be computed" })
    : format(value);
}

// The count-up animates the magnitude, a signed figure adds "+" or "-" in front.
// Labels stay short (one to three words, uppercase like the other stat strips
// on the site), qualifiers go into the sentence-case `sub` line below.
export function AdaFigure({ loading, value, label, sub, signed = false }) {
  const animated = useCountUp(value == null ? null : Math.abs(value));
  return (
    <div className={styles.figure}>
      <span className={styles.value}>
        {display(loading, value, (v) => `${signed && v > 0 ? "+" : ""}${signed && v < 0 ? "-" : ""}${formatAdaValue(animated)}`)}
      </span>
      <span className={styles.label}>{label}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}

export function TextFigure({ loading, value, label, sub }) {
  return (
    <div className={styles.figure}>
      <span className={styles.value}>{display(loading, value, (v) => v)}</span>
      <span className={styles.label}>{label}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}

export function Skeleton({ height = 380 }) {
  return <div className={styles.skeleton} style={{ height }} aria-busy="true" />;
}

export function LiveDataError({ message }) {
  return (
    <div className={styles.errorBox} role="alert">
      {message}{" "}
      <Link to="/insights/supply/summary#treasury">
        {translate({ id: "governance.treasury.overview.errorLink", message: "View treasury history" })}
      </Link>
    </div>
  );
}
