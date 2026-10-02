import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

// Programmable Tokens page hero. A fixed dark-navy band (same in light and
// dark mode) with the concentric rings artwork on the right and a grain
// overlay behind the title, a lead sentence, a supporting paragraph, and a
// white pill button.
//
// SiteHero is not used because the design needs a second, smaller paragraph
// and a button under the lead. The layout follows the <header className="hero">
// pattern of the /sustainability hero, and the content column uses the same
// gutters as BoundaryBox so it lines up with the sections below.
//
// Props:
//   hero - HERO from src/data/programmable-tokens.js

export default function ProgrammableTokensHero({ hero }) {
  const ringsUrl = useBaseUrl("/img/programmable-tokens/hero-rings.svg");
  const isExternal = /^https?:\/\//.test(hero.button.href);

  return (
    <header className={clsx("hero", styles.hero)}>
      <img src={ringsUrl} alt="" aria-hidden="true" className={styles.rings} />

      <div className={styles.inner}>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.subtitle}>{hero.subtitle}</p>
        <p className={styles.body}>{hero.body}</p>
        <Link
          className={styles.button}
          to={hero.button.href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {hero.button.label}
        </Link>
      </div>
    </header>
  );
}
