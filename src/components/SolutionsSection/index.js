import React from "react";
import Link from "@docusaurus/Link";
import SolutionCard from "@site/src/components/SolutionCard";
import { EnterpriseSolutions, CaseStudiesLink } from "@site/src/data/enterprise-solutions";
import {translate} from '@docusaurus/Translate';
import styles from "./styles.module.css";

export default function SolutionsSection() {
  return (
    <section className={styles.solutionsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{translate({id: 'solutions.section.title', message: 'Enterprise Solutions'})}</h2>
      </div>

      <div className={styles.cardsGrid}>
        {EnterpriseSolutions.map((solution, index) => (
          <SolutionCard key={index} {...solution} />
        ))}
      </div>

      <div className={styles.ctaWrapper}>
        <Link
          href={CaseStudiesLink.url}
          className={styles.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CaseStudiesLink.title}: {CaseStudiesLink.description}
          <svg
            className={styles.arrowIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            aria-hidden="true"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
