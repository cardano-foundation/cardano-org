import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import InteractiveSVGGrid from "./InteractiveSVGGrid_";

function WelcomeHero({ title, description }) {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.heroContent}>
        <div className={styles.taglineContainer}>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{description}</p>
        </div>
        <div className={styles.cta}>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to="/where-to-get-ada"
          >
            Where to get ada?
          </Link>
          <Link
            className={clsx("button button--primary button--lg", styles.button)}
            to="/developers"
          >
            Start Building
          </Link>
        </div>
        <div className="sectionCaret">
          <svg x="0px" y="0px" viewBox="0 0 2000 30">
            <polygon className="polygon-fill" points="1000,30 0,30 0,0 980,0" />
            <polygon className="polygon-fill" points="1000,30 2000,30 2000,0 1020,0" />
          </svg>
        </div>
      </div>
      <div className={styles.gridContainer}>
        <InteractiveSVGGrid />
      </div>
    </header>
  );
}

export default WelcomeHero;