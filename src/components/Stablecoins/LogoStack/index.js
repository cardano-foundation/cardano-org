import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { NATIVE_STABLECOINS } from "@site/src/data/stablecoins";
import styles from "./styles.module.css";

export default function LogoStack() {
  return (
    <div className={styles.panel} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.stack}>
        {NATIVE_STABLECOINS.map((coin) => (
          <LogoItem key={coin.id} id={coin.id} logo={coin.logo} />
        ))}
      </div>
    </div>
  );
}

function LogoItem({ id, logo }) {
  const url = useBaseUrl(logo);
  return (
    <div className={styles.logoItem} data-coin-id={id}>
      <img src={url} alt="" className={styles.logo} />
    </div>
  );
}
