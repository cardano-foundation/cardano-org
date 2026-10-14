import React from "react";
import Tabs from "@site/src/components/Layout/Tabs";
import RichText from "@site/src/components/ProgrammableTokens/RichText";
import styles from "./styles.module.css";

// Regulatory context per jurisdiction for the /programmable-tokens page: one
// pill tab per market, each panel holding that market's overview. Text
// goes through RichText, so the inline source links work.
//
// Props:
//   regulatory - REGULATORY from src/data/programmable-tokens.js

export default function RegulatoryFrameworks({ regulatory }) {
  const tabs = regulatory.jurisdictions.map((jurisdiction) => ({
    id: jurisdiction.id,
    label: jurisdiction.label,
    content: (
      <p className={styles.overview}>
        <RichText text={jurisdiction.overview} />
      </p>
    ),
  }));

  return <Tabs items={tabs} ariaLabel={regulatory.tabsAriaLabel} />;
}
