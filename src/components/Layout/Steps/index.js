import React from "react";
import styles from "./styles.module.css";

// Numbered steps in a row of cards: "how to apply" on the grants page, "how
// an upgrade happens" on the roadmap. The number comes from a CSS counter.
//
// Props:
//   items - [{ key, title, text }]; text may be a string or a node
export default function Steps({ items }) {
  return (
    <ol className={styles.steps}>
      {items.map((step) => (
        <li key={step.key} className={styles.step}>
          <span className={styles.stepTitle}>{step.title}</span>
          <p className={styles.stepText}>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
