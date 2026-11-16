import React from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { getHeading } from "@site/src/utils/heading";

// Alternating rows of icon, title, tagline and text. Used on /what-is-cardano
// (all points) and on the homepage (a subset plus a CTA into the full page).
// Callers render the section title through TitleWithText, which owns the h1.
/**
 * List of proof points as alternating rows with icon, title, tagline, and text, plus an optional call to action.
 *
 * @param {object} props
 * @param {Array<{key: string, icon: React.ReactNode, title: string, tagline: string, text: string}>} props.points Rows to render.
 * @param {{to: string, label: string}} [props.cta] Optional button below the list.
 * @param {number} [props.headingLevel=2] Heading level of each row title. The look stays the same.
 * @param {string} [props.className] Extra class on the section.
 */
export default function ProofPointsList({ points, cta, headingLevel, className }) {
  const { Tag } = getHeading(headingLevel, 2);
  return (
    <section className={className}>
      <ul className={styles.list}>
        {points.map((point) => (
          <li key={point.key} className={styles.row}>
            <span className={styles.icon} aria-hidden="true">
              {point.icon}
            </span>
            <div className={styles.body}>
              <Heading as={Tag} className={styles.rowTitle}>
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
