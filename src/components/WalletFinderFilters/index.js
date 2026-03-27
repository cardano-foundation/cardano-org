import React from "react";
import {translate} from '@docusaurus/Translate';
import {
  WalletPlatforms,
  WalletPlatformList,
  WalletFeatures,
  WalletFeatureList,
  WalletNodeTypes,
  WalletNodeTypeList,
} from "@site/src/data/walletFeatures";
import styles from "./styles.module.css";

function FilterPill({ label, active, onClick }) {
  return (
    <button
      className={`${styles.pill} ${active ? styles.pillActive : ""}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default function WalletFinderFilters({
  selectedPlatforms,
  selectedFeatures,
  selectedType,
  openSource,
  resultCount,
  onTogglePlatform,
  onToggleFeature,
  onSetType,
  onToggleOpenSource,
  onClearAll,
}) {
  const hasFilters =
    selectedPlatforms.length > 0 ||
    selectedFeatures.length > 0 ||
    selectedType !== null ||
    openSource === true;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterTitle}>
          {translate({id: 'walletFinder.filters.title', message: 'Filters'})}
          {hasFilters && (
            <span className={styles.filterCount}>
              {" "}
              ({resultCount}{" "}
              {resultCount === 1
                ? translate({id: 'walletFinder.results.wallet', message: 'wallet'})
                : translate({id: 'walletFinder.results.wallets', message: 'wallets'})})
            </span>
          )}
        </h2>
        {hasFilters && (
          <button className={styles.clearButton} onClick={onClearAll} type="button">
            {translate({id: 'walletFinder.filters.clearAll', message: 'Clear filters'})}
          </button>
        )}
      </div>

      {/* Platform filters */}
      <div className={styles.filterSection}>
        <span className={styles.filterLabel}>
          {translate({id: 'walletFinder.filters.platforms', message: 'Platform'})}
        </span>
        <div className={styles.pillGroup}>
          {WalletPlatformList.map((key) => (
            <FilterPill
              key={key}
              label={WalletPlatforms[key].label}
              active={selectedPlatforms.includes(key)}
              onClick={() => onTogglePlatform(key)}
            />
          ))}
        </div>
      </div>

      {/* Feature filters */}
      <div className={styles.filterSection}>
        <span className={styles.filterLabel}>
          {translate({id: 'walletFinder.filters.features', message: 'Features'})}
        </span>
        <div className={styles.pillGroup}>
          {WalletFeatureList.map((key) => (
            <FilterPill
              key={key}
              label={WalletFeatures[key].label}
              active={selectedFeatures.includes(key)}
              onClick={() => onToggleFeature(key)}
            />
          ))}
        </div>
      </div>

      {/* Type + Open Source filters */}
      <div className={styles.filterSection}>
        <span className={styles.filterLabel}>
          {translate({id: 'walletFinder.filters.type', message: 'Wallet Type'})}
        </span>
        <div className={styles.pillGroup}>
          {WalletNodeTypeList.map((key) => (
            <FilterPill
              key={key}
              label={WalletNodeTypes[key].label}
              active={selectedType === key}
              onClick={() => onSetType(selectedType === key ? null : key)}
            />
          ))}
          <FilterPill
            label={translate({id: 'walletFinder.filters.openSource', message: 'Open Source'})}
            active={openSource === true}
            onClick={onToggleOpenSource}
          />
        </div>
      </div>
    </div>
  );
}
