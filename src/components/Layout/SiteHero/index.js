import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import OuroborosLogo from "@site/src/components/Layout/OuroborosLogo";

/**
 * Page hero with title, description, and a themed banner.
 *
 * @param {object} props
 * @param {string} props.title Hero title.
 * @param {string} [props.description] Text below the title.
 * @param {string} [props.bannerType] Banner style, see the Site Hero docs for the list.
 * @param {React.ReactNode} [props.children] Extra content below the description.
 * @param {number} [props.headingLevel=1] 1 renders the title as the page's h1. 0 renders it
 *   without heading semantics, for heroes that sit above the real page title (blog posts).
 * @param {string} [props.className] Extra class on the hero element.
 */
export default function SiteHero({ title, description, bannerType, children, className, headingLevel = 1 }) {
  const TitleTag = headingLevel === 0 ? "div" : "h1";
  const titleClassName = headingLevel === 0 ? "hero__title hero__title--text" : "hero__title";

  // Use bannerType to dynamically change the class for the hero banner
  let heroClassName;

  switch (bannerType) {
    case "ada":
      heroClassName = styles.heroBannerAda;
      break;
    case "dots":
      heroClassName = styles.heroBannerDots;
      break;
    case "fluidBlue":
      heroClassName = styles.heroBannerFluidBlue;
      break;
    case "fluidRed":
        heroClassName = styles.heroBannerFluidRed;
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
    case "docs":
      heroClassName = styles.heroBannerDocs;
      break;
    case "ouroboros":
    heroClassName = styles.heroBannerOuroboros;
      break;
    default:
      heroClassName = styles.heroBannerStarburst;
  }

  return (
    <header className={clsx("hero hero--primary", heroClassName, className)}>
      <div className="container">
        <div className={styles.backgroundBox}>
          <div className={styles.taglineContainer}>
          {
              bannerType === "ouroboros"
                ? <h1 className="hero__title" aria-label={title}><OuroborosLogo className={styles.ouroborosLogo} /></h1>
                : <TitleTag className={titleClassName}>{title}</TitleTag>
            }
            <p className={clsx("hero__subtitle", styles.subtitle)}>
              {description}
            </p>
          </div>
          {children && <div className={styles.heroChildren}>{children}</div>}

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
