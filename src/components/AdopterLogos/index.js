import React from "react";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import { ADOPTERS } from "@site/src/data/adopterLogos";
import styles from "./styles.module.css";

// Optical sizing: every logo gets roughly the same visual area, so a long
// wordmark is wider and flatter than a square emblem. Capped in height for
// tall emblems and in width for very long wordmarks. `scale` in the data can
// nudge a single logo that still looks too heavy or too light.
const LOGO_AREA = 18; // rem²
const MAX_HEIGHT = 2.75; // rem
const MAX_WIDTH = 9; // rem

function logoWidth({ ratio = 3, scale = 1 }) {
  return Math.min(Math.sqrt(LOGO_AREA * ratio), MAX_HEIGHT * ratio, MAX_WIDTH) * scale;
}

// Static logo bar, no marquee: a moving row is hard to read and ignores
// reduced motion. Logos keep their original colours in the files and are
// shown monochrome until hovered (see styles). Logos with a public source
// link to it.
export default function AdopterLogos() {
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <section className={styles.bar} aria-labelledby="adopter-logos-title">
      <h2 id="adopter-logos-title" className={styles.title}>
        {translate({ id: "home.activity.adopters.title", message: "Working with Cardano" })}
      </h2>
      <ul className={styles.list}>
        {ADOPTERS.map((org) => {
          const logo = (
            <img
              className={styles.logo}
              src={withBaseUrl(`/img/adopters/${org.id}.svg`)}
              alt={org.name}
              style={{ "--logo-width": `${logoWidth(org).toFixed(2)}rem` }}
              loading="lazy"
            />
          );
          return (
            <li key={org.id} className={styles.item}>
              {org.source ? (
                <Link to={org.source} className={styles.link}>
                  {logo}
                </Link>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
