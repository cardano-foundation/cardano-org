import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import OuroborosLogo from "@site/src/components/Layout/OuroborosLogo";

export default function SiteHero({ title, description, bannerType }) {

  // Use bannerType to dynamically change the class for the hero banner
  let heroClassName;

  switch (bannerType) {
    case "ada":
      heroClassName = styles.heroBannerAda;
      break;
    case "dots":
      heroClassName = styles.heroBannerDots;
      break;
    case "fluid":
      heroClassName = styles.heroBannerFluid;
      break;
    case "overlap":
      heroClassName = styles.heroBannerOverlap;
      break;
    case "zoomRedWhite":
      heroClassName = styles.heroBannerZoomRedWhite;
      break;
    case "zoomRedWhiteDark":
      heroClassName = styles.heroBannerZoomRedWhiteDark;
      break;
    case "zoomBlueRed":
      heroClassName = styles.heroBannerZoomBlueRed;
      break;
    case "waves":
      heroClassName = styles.heroBannerWaves;
      break;
    case "starburst":
      heroClassName = styles.heroBannerStarburst;
      break;
    case "braidBlue":
      heroClassName = styles.heroBannerBraidBlue;
      break;
    case "braidRedBlue":
      heroClassName = styles.heroBannerBraidRedBlue;
      break;
    case "braidBlack":
      heroClassName = styles.heroBannerBraidBlack;
      break;
    case "ouroboros":
    heroClassName = styles.heroBannerOuroboros;
      break;
    default:
      heroClassName = styles.heroBannerStarburst;
  }

  return (
    <header className={clsx("hero hero--primary", heroClassName)}>
      <div className="container">
        <div className={styles.backgroundBox}>
          <div className={styles.taglineContainer}>
          {
              bannerType === "ouroboros"
                ? <h1 className="hero__title"><OuroborosLogo className={styles.ouroborosLogo} /></h1>
                : <h1 className="hero__title">{title}</h1>
            }
            <p className={clsx("hero__subtitle", styles.subtitle)}>
              {description}
            </p>
          </div>

          <div className="sectionCaret">
            <svg x="0px" y="0px" viewBox="0 0 2000 30">
              <polygon
                className="polygon-fill"
                points="1000,30 0,30 0,0 980,0 "
              ></polygon>
              <polygon
                className="polygon-fill"
                points="1000,30 2000,30 2000,0 1020,0 "
              ></polygon>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
