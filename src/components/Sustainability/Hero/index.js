import React from "react";
import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { HERO } from "@site/src/data/sustainability";
import styles from "./styles.module.css";

// Sustainability page hero. A fixed dark-navy band (same in light and dark
// mode) with the concentric rings artwork and a grain overlay behind a
// "verified" tag pill, the page title, a short description, a row of four
// headline CCRI indicators, and a source footnote.
//
// SiteHero is not used here because the design needs the tag above the title
// and the stat row below the copy. The layout follows the
// <header className="hero"> pattern from src/pages/ai.js and the content
// column uses the same gutters as BoundaryBox so it lines up with the
// sections below.
//
// Props: none. All copy and figures come from HERO in
// src/data/sustainability.js.

export default function SustainabilityHero() {
  const ringsUrl = useBaseUrl("/img/sustainability/hero-rings.svg");
  const checkUrl = useBaseUrl("/img/sustainability/check.svg");

  return (
    <header className={clsx("hero", styles.hero)}>
      <img src={ringsUrl} alt="" aria-hidden="true" className={styles.rings} />

      <div className={styles.inner}>
        <span className={styles.tag}>
          <span className={styles.tagIcon} aria-hidden="true">
            <img src={checkUrl} alt="" aria-hidden="true" className={styles.tagCheck} />
          </span>
          {HERO.tag}
        </span>

        <h1 className={styles.title}>{HERO.title}</h1>

        <p className={styles.description}>{HERO.description}</p>

        {/* DOM order is label (dt) then value (dd); the value is shown above
            the label with flex column-reverse so screen readers get
            "label: value" while the design reads value first. */}
        <dl className={styles.stats} aria-label={HERO.statsAriaLabel}>
          {HERO.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.label}>{stat.label}</dt>
              <dd className={styles.value}>{stat.value}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.footnote}>{HERO.footnote}</p>
      </div>
    </header>
  );
}
