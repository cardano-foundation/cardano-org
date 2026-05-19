import React from "react";
import styles from "./styles.module.css";

export default function Sparkline({ data, width = 140, height = 36, ariaLabel }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      className={styles.sparkline}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : "presentation"}
    >
      <polygon points={areaPoints} className={styles.area} />
      <polyline points={points} className={styles.line} />
    </svg>
  );
}
