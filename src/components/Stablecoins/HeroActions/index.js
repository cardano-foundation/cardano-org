import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export default function StablecoinsHeroActions() {
  return (
    <div className={styles.actions}>
      <Link
        to="#explainer"
        className={clsx("button button--lg", styles.outlined)}
      >
        {translate({
          id: "stablecoins.hero.cta.understand",
          message: "Understand stablecoins",
        })}
      </Link>
      <Link
        to="/get-started/"
        className={clsx("button button--lg", styles.filled)}
      >
        {translate({
          id: "stablecoins.hero.cta.wallet",
          message: "Get started with a wallet",
        })}
      </Link>
      <Link
        to="#ecosystem"
        className={clsx("button button--lg", styles.filled)}
      >
        {translate({
          id: "stablecoins.hero.cta.ecosystem",
          message: "Explore the ecosystem",
        })}
      </Link>
    </div>
  );
}
