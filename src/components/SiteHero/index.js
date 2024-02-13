import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function SiteHero({ title, description, bannerType }) {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  // Use bannerType to dynamically change the class for the hero banner
  // styles need to be defined in sitehero.module.css
  let heroClassName;

  switch (bannerType) {
    case 'ada':
      heroClassName = styles.heroBannerAda;
      break;
    case 'dots':
      heroClassName = styles.heroBannerDots;
      break;
    case 'fluid':
      heroClassName = styles.heroBannerFluid;
      break;
    case 'overlap':
      heroClassName = styles.heroBannerOverlap;
      break;
    case 'zoomRedWhite':
      heroClassName = styles.heroBannerZoomRedWhite;
      break;    
    default:
      heroClassName = styles.heroBannerZoom;
  }

  return (
    <header className={clsx("hero hero--primary", heroClassName)}>
      <div className="container">
        <div className={styles.taglineContainer}>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{description}</p>
        </div>
      </div>
    </header>
  );
}

export default SiteHero;