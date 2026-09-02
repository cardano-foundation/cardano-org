import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// Numbered card. Displays an ordinal index tile ("01"), a title, and a short
// body. Used to list steps or principles side by side in a grid, for example
// the "What Makes Cardano Different" and CCRI methodology sections on the
// /sustainability page.
//
// Generic and static: no link behavior, no state. The parent owns the grid
// layout; the card fills the full height of its grid cell.
//
// Props:
//   index     - ordinal label shown in the tile (a preformatted string like "01")
//   title     - card heading (rendered as an <h3>)
//   children  - body content; a plain string is wrapped in a <p>, nodes render as-is
//   className - optional extra class for the card container

export default function NumberedCard({ index, title, children, className }) {
  const body = typeof children === "string" ? <p>{children}</p> : children;

  return (
    <article className={clsx(styles.card, className)}>
      <span className={styles.index}>{index}</span>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{body}</div>
    </article>
  );
}
