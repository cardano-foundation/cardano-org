import React from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

// Reusable section-level CTA — title, description, single button.
// Used as the closing slot on /apps for both the Collections link and the Submit-an-app
// nudge. Keep semantics simple; if a third variant arrives consider an enum-typed prop.
export default function PageCTA({
  title,
  description,
  href,
  buttonText,
  variant = "secondary",
}) {
  const isPrimary = variant === "primary";
  return (
    <section className={clsx(styles.cta, isPrimary && styles.ctaPrimary)}>
      <div className="container">
        <div className={styles.inner}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <a
            className={clsx(
              "button button--lg",
              isPrimary ? "button--primary" : "button--secondary",
              styles.button
            )}
            href={href}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
