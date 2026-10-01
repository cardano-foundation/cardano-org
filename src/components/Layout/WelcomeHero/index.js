import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { translate } from '@docusaurus/Translate';
import { useColorMode } from "@docusaurus/theme-common";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Medusa from "@site/src/components/Medusa";
import DevPanel from "@site/src/components/Medusa/DevPanel";
import { canRunWebGL } from "@site/src/components/Medusa/webgl";

// `children` renders below the CTA row (the homepage puts the entry intents
// there). `showWhatIsCardano` drops the explainer CTA when the page links to
// it further down.
// The visualization blends additively, so it needs a dark ground to glow. The
// light theme gets a brighter Cardano blue instead of the near black navy.
const MEDUSA_BACKGROUND = { light: "#0a2a8a", dark: "#0b1030" };

function WelcomeHero({ title, description, children, showWhatIsCardano = true }) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [year, setYear] = useState("");
  const medusaRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    // Client-only capability detection, the server assumes WebGL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebglSupported(canRunWebGL());
  }, []);

  const handleFrame = useCallback((info) => {
    setYear(info.phase === "fade" || info.phase === "fadein" ? "" : info.date.slice(0, 4));
  }, []);

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      {webglSupported ? (
        <div className={styles.heroBackground}>
          <Medusa
            ref={medusaRef}
            mode="ambient"
            startDate="2019-02-01"
            background={MEDUSA_BACKGROUND[colorMode] ?? MEDUSA_BACKGROUND.dark}
            className={styles.medusaCanvas}
            onFrame={handleFrame}
            ariaLabel={translate({
              id: 'home.hero.vizBadge.ariaLabel',
              message: 'File tree of the cardano-ledger repository growing month by month',
            })}
          />
          <div className={styles.overlay} />
        </div>
      ) : (
        <div className={styles.fallbackBackground} />
      )}

      <div className={styles.heroForeground}>
        <div className="container">
          <div className={styles.taglineContainer}>
            <h1 className={clsx("hero__title", styles.heroTitle)}>
              {Array.isArray(title)
                ? title.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < title.length - 1 && <br />}
                    </React.Fragment>
                  ))
                : title}
            </h1>
            <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
              {description}
            </p>
          </div>
          <div className={styles.cta}>
            {showWhatIsCardano && (
              <Link
                className={clsx("button button--primary button--lg", styles.heroCtaButton)}
                to="/what-is-cardano"
              >
                {translate({id: 'home.hero.ctaWhatIsCardano', message: 'What is Cardano?'})}
              </Link>
            )}
            <Link
              className={clsx("button button--primary button--lg", styles.heroCtaButton)}
              to="/get-started"
            >
              {translate({id: 'home.hero.ctaGetStarted', message: 'Get Started'})}
            </Link>
          </div>
          {children}
        </div>
      </div>

      {webglSupported && (
        <div className={styles.vizCorner}>
          <span className={clsx(styles.vizYear, !year && styles.vizYearHidden)} aria-hidden="true">
            {year}
          </span>
          <Tippy
            content={
              <div className={styles.vizPopover}>
                <p>
                  {translate({
                    id: 'home.hero.vizBadge.description',
                    message: 'Every dot is a file or folder of the cardano-ledger repository, and the animation replays how it grew month by month since 2018. Colors mark the code of each ledger era, from Byron to Dijkstra.',
                  })}
                </p>
                <Link to="/medusa" className={styles.vizPopoverLink}>
                  {translate({
                    id: 'home.hero.vizBadge.link',
                    message: 'Explore the history',
                  })}
                </Link>
              </div>
            }
            interactive={true}
            trigger="click"
            placement="top-end"
            maxWidth={320}
            appendTo={() => document.body}
          >
            <button className={styles.vizBadge} aria-label={translate({
              id: 'home.hero.vizBadge.buttonLabel',
              message: 'Information about this visualization',
            })}>
              {translate({
                id: 'home.hero.vizBadge.label',
                message: 'Visualizing cardano-ledger since 2018',
              })}
              <span className={styles.vizBadgeIcon}>ⓘ</span>
            </button>
          </Tippy>
        </div>
      )}

      {webglSupported && <DevPanel target={medusaRef} />}

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
