import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import styles from "./styles.module.css";

// Square logo tile, or the first letter of the name when there is no logo.
// Decorative: the name sits below it as text.
export default function ProgramLogo({ program, size = "card" }) {
  const light = useBaseUrl(program.logo || "/");
  const dark = useBaseUrl(program.logoDark || program.logo || "/");
  const letter = String(program.name || "").trim().charAt(0).toUpperCase();
  return (
    <span className={size === "dialog" ? styles.logoTileLarge : styles.logoTile} aria-hidden="true">
      {program.logo ? (
        <ThemedImage sources={{ light, dark }} alt="" className={styles.logoImage} loading="lazy" />
      ) : (
        <span className={styles.monogram}>{letter}</span>
      )}
    </span>
  );
}
