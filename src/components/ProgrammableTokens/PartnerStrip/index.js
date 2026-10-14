import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import styles from "./styles.module.css";

// Partner and user logo strip under the /programmable-tokens hero. The logos
// sit directly on the section band, one per slot, centered and scaled to fit
// it. Each logo links to the project's site in a new tab; the image's alt
// text (the project name) is the link's accessible name.
//
// Props:
//   partners - PARTNERS from src/data/programmable-tokens.js
//              ({ ariaLabel, items: [{ name, logo, logoDark, href }] })
//              `logoDark` is an optional variant shown in the dark theme.

function PartnerLogo({ name, logo, logoDark, href }) {
  const light = useBaseUrl(logo);
  const dark = useBaseUrl(logoDark || logo);
  return (
    <li className={styles.slot}>
      <Link to={href} className={styles.link} target="_blank" rel="noopener noreferrer">
        <ThemedImage alt={name} className={styles.logo} sources={{ light, dark }} />
      </Link>
    </li>
  );
}

export default function PartnerStrip({ partners }) {
  return (
    <ul className={styles.strip} aria-label={partners.ariaLabel}>
      {partners.items.map((partner) => (
        <PartnerLogo key={partner.name} {...partner} />
      ))}
    </ul>
  );
}
