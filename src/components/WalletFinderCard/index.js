import React from "react";
import {translate} from '@docusaurus/Translate';
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  WalletPlatforms,
  WalletFeatures,
  WalletCustodyTypes,
  WalletNodeTypes,
} from "@site/src/data/walletFeatures";
import styles from "./styles.module.css";

export default function WalletFinderCard({ wallet }) {
  const wf = wallet.walletFeatures;
  const isOpenSource = wallet.tags.includes("opensource");
  const iconUrl = useBaseUrl(wallet.icon || "");

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {wallet.icon ? (
          <img
            src={iconUrl}
            alt={wallet.title}
            className={styles.logo}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        {!wallet.icon && (
          <div className={styles.logoFallback}>
            {wallet.title.charAt(0).toUpperCase()}
          </div>
        )}
        {wallet.icon && (
          <div className={styles.logoFallback} style={{ display: "none" }}>
            {wallet.title.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className={styles.title}>{wallet.title}</h3>
      </div>

      <p className={styles.description}>{wallet.description}</p>

      <div className={styles.platforms}>
        {wf.platforms.map((p) => (
          <span key={p} className={styles.platformBadge}>
            {WalletPlatforms[p]?.label || p}
          </span>
        ))}
      </div>

      <div className={styles.features}>
        {wf.features.map((f) => (
          <span key={f} className={styles.featureBadge}>
            {WalletFeatures[f]?.label || f}
          </span>
        ))}
      </div>

      <div className={styles.metaBadges}>
        <span
          className={`${styles.custodyBadge} ${
            wf.custody === "custodial" ? styles.custodialBadge : ""
          }`}
        >
          {WalletCustodyTypes[wf.custody]?.label || wf.custody}
        </span>
        <span className={styles.typeBadge}>
          {WalletNodeTypes[wf.type]?.label || wf.type}
        </span>
        {isOpenSource && (
          <span className={styles.openSourceBadge}>
            {translate({id: 'walletFinder.card.openSource', message: 'Open Source'})}
          </span>
        )}
      </div>

      <a
        href={wallet.website}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {translate({id: 'walletFinder.card.visitWebsite', message: 'Visit Website'})}
      </a>
    </div>
  );
}
