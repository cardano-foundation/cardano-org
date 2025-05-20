import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

function WelcomeHero({ title, description }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/img/headers/medusa.bundle.js";  
    script.async = true;

    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
  <div className={styles.heroBackground}>
    <div id="medusa-root" />
  </div>

  <div className={styles.heroForeground}>
    <div className="container">
      <div className={styles.taglineContainer}>
        <h1 className={clsx("hero__title", styles.heroTitle)}>{title}</h1>
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>{description}</p>
      </div>
      <div className={styles.cta}>
        <Link className="button button--primary button--lg" to="/where-to-get-ada">
          Where to get ada?
        </Link>
        <Link className="button button--primary button--lg" to="/developers">
          Start Building
        </Link>
      </div>
    </div>
  </div>

  <div className="sectionCaret">
    <svg x="0px" y="0px" viewBox="0 0 2000 30">
      <polygon className="polygon-fill" points="1000,30 0,30 0,0 980,0" />
      <polygon className="polygon-fill" points="1000,30 2000,30 2000,0 1020,0" />
    </svg>
  </div>
</header>
  );
}

export default WelcomeHero;