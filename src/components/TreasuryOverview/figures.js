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
  return value == null ? "n/a" : format(value);
}

// formatAdaValue has no sign, so a change gets it added here.
function signedAda(value) {
  const text = formatAdaValue(Math.abs(value));
  if (value > 0) return `+${text}`;
  if (value < 0) return `-${text}`;
  return text;
}

export function AdaFigure({ loading, value, label, signed = false }) {
  const animated = useCountUp(value == null ? null : Math.abs(value));
  return (
    <div className={styles.figure}>
      <span className={styles.value}>
        {display(loading, value, (v) => (signed ? signedAda(Math.sign(v) * animated) : formatAdaValue(animated)))}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function TextFigure({ loading, value, label }) {
  return (
    <div className={styles.figure}>
      <span className={styles.value}>{display(loading, value, (v) => v)}</span>
      <span className={styles.label}>{label}</span>
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
