import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

function WelcomeHero({ title, description }) {
  const containerRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent || "";
  
    // Fallback list: 
    // old Android devices (Android 1.x bis 7.x and old Chrome  versions) they deliver a webgl context but performance is bad
    // const isOldAndroid = /Android [1-7]\./.test(ua) || /Android.*Chrome\/\d{1,2}\./.test(ua);;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
    // webgl test
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  
    if (isMobile || !gl) {
      setWebglSupported(false);
      return;
    }
  
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
      {webglSupported ? (
        <div className={styles.heroBackground}>
          <div id="medusa-root" />
          <div className={styles.overlay} />
        </div>
      ) : (
        <div className={styles.fallbackBackground} />
      )}

      <div className={styles.heroForeground}>
        <div className="container">
          <div className={styles.taglineContainer}>
            <h1 className={clsx("hero__title", styles.heroTitle)}>{title}</h1>
            <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
              {description}
            </p>
          </div>
          <div className={styles.cta}>
            <Link
              className={clsx("button button--primary button--lg", styles.heroCtaButton)}
              to="/what-is-ada"
            >
              What is ada?
            </Link>
            <Link
              className={clsx("button button--primary button--lg", styles.heroCtaButton)}
              to="/get-started"
            >
              Get Started
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
