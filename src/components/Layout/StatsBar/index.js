import React from "react";
import styles from "./styles.module.css";

// One elevated bar of figures, each a big value over a short label. Used for
// the headline numbers on the grants page and the "live today" strip on the
// roadmap. Values are rendered as given, so the figure is in the server HTML.
//
// Props:
//   items     - [{ key, value, label, extra? }]; extra renders after the
//               value, for example an info button
//   ariaLabel - name of the group for assistive technology
export default function StatsBar({ items, ariaLabel }) {
  return (
    <div className={styles.stats}>
      <div className={styles.bar} role="group" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <React.Fragment key={item.key}>
            {index > 0 && <span className={styles.barDivider} aria-hidden="true" />}
            <div className={styles.figure}>
              <span className={styles.figureValue}>
                {item.value}
                {item.extra}
              </span>
              <span className={styles.figureLabel}>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
