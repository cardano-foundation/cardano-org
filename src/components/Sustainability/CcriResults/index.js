import React from "react";
import { RESULTS } from "@site/src/data/sustainability";
import styles from "./styles.module.css";

// Key CCRI results for the /sustainability page. Renders the MiCA
// sustainability indicators as lettered groups (A. Electricity, B. Carbon).
// Each group is a row with the letter and group name on the left and a
// definition list of indicators (label, value, unit) on the right.
//
// Reads RESULTS from src/data/sustainability.js, so it takes no props. The
// section title and subtitle are rendered by the page via TitleWithText.

function ResultGroup({ group }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupLabel}>
        <span className={styles.letter}>{group.letter}</span>
        <span className={styles.groupName}>{group.label}</span>
      </div>
      <dl className={styles.indicators}>
        {group.indicators.map((indicator) => (
          <div className={styles.indicator} key={indicator.label}>
            <dt className={styles.label}>{indicator.label}</dt>
            <dd className={styles.valueRow}>
              <span className={styles.value}>{indicator.value}</span>
              <span className={styles.unit}>{indicator.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function CcriResults() {
  return (
    <div className={styles.results}>
      {RESULTS.groups.map((group) => (
        <ResultGroup key={group.letter} group={group} />
      ))}
    </div>
  );
}
