import React from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

// Alternating rows of icon, title, tagline and text. Used on /what-is-cardano
// (all points) and on the homepage (a subset plus a CTA into the full page).
// Callers render the section title through TitleWithText, which owns the h1.
export default function ProofPointsList({ points, cta }) {
  return (
    <section>
      <ul className={styles.list}>
        {points.map((point) => (
          <li key={point.key} className={styles.row}>
            <span className={styles.icon} aria-hidden="true">
              {point.icon}
            </span>
            <div className={styles.body}>
              <Heading as="h2" className={styles.rowTitle}>
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
          <Link className="button button--primary button--lg" to={cta.to}>
            {cta.label}
          </Link>
        </div>
      )}
    </section>
  );
}
