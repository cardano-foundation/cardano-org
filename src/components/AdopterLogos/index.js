import React from "react";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import { ADOPTERS } from "@site/src/data/adopterLogos";
import styles from "./styles.module.css";

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
