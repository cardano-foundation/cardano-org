import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

// Alternating rows of icon, title, tagline and text. Used on /what-is-cardano
// (all points) and on the homepage (a subset plus a CTA into the full page).
export default function ProofPointsList({ points, title, cta }) {
  return (
    <section className={styles.wrap}>
      {title && (
        <Heading as="h2" className={styles.title}>
          {title}
        </Heading>
      )}
      <ul className={styles.list}>
        {points.map((point) => (
          <li key={point.key} className={styles.row}>
            <span className={styles.icon} aria-hidden="true">
              {point.icon}
            </span>
            <div className={styles.body}>
              <Heading as="h3" className={styles.rowTitle}>
                {point.title}
              </Heading>
              <p className={styles.tagline}>{point.tagline}</p>
              <p className={styles.text}>{point.text}</p>
            </div>
          </li>
        ))}
      </ul>
      {cta && (
        <div className={styles.ctaRow}>
          <Link className={clsx("button button--primary button--lg")} to={cta.to}>
            {cta.label}
          </Link>
        </div>
      )}
    </section>
  );
}
