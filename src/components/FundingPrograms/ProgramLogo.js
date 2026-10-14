import React from "react";
import LogoTile from "@site/src/components/Layout/LogoTile";
import styles from "./styles.module.css";

// Square logo tile, or the first letter of the name when there is no logo or
// it fails to load. Decorative: the name sits below it as text.
export default function ProgramLogo({ program, size = "card" }) {
  return (
    <LogoTile
      src={program.logo}
      srcDark={program.logoDark}
      name={program.name}
      className={size === "dialog" ? styles.logoTileLarge : styles.logoTile}
    />
  );
}
