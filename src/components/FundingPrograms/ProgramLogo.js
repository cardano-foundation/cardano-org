import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

// Square logo tile for a program. Falls back to the first letter of the
// name when no logo is set. Decorative: the name sits next to it as text.
export default function ProgramLogo({ venue, size = "card" }) {
  const { colorMode } = useColorMode();
  const path = colorMode === "dark" && venue.logoDark ? venue.logoDark : venue.logo;
  const url = useBaseUrl(path || "/");
  const letter = String(venue.name || "").trim().charAt(0).toUpperCase();
  return (
    <span className={size === "dialog" ? styles.logoTileLarge : styles.logoTile} aria-hidden="true">
      {path ? <img src={url} alt="" className={styles.logoImage} loading="lazy" /> : <span className={styles.monogram}>{letter}</span>}
    </span>
  );
}
