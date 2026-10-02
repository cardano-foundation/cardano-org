import React from "react";
import clsx from "clsx";
import PillTabs from "@site/src/components/Layout/PillTabs";
import RichText from "@site/src/components/ProgrammableTokens/RichText";
import styles from "./styles.module.css";

// Regulatory context per jurisdiction for the /programmable-tokens page: one
// PillTabs tab per market. Each panel starts with the market's overview and,
// where the copy has them, follows with framework cards (name, description,
// and optional statutory requirements). Two or three frameworks sit side by
// side in equal columns; a single framework keeps the narrower card width of
// the design. Text goes through RichText, so links and **bold** work.
//
// Props:
//   regulatory - REGULATORY from src/data/programmable-tokens.js

function FrameworkCard({ framework }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{framework.name}</h3>
      <p className={styles.body}>
        <RichText text={framework.body} />
      </p>
      {framework.requirements && (
        <ul className={styles.requirements}>
          {framework.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function RegulatoryFrameworks({ regulatory }) {
  const tabs = regulatory.jurisdictions.map((jurisdiction) => ({
    id: jurisdiction.id,
    label: jurisdiction.label,
    content: (
      <div className={styles.tabContent}>
        <p className={styles.overview}>
          <RichText text={jurisdiction.overview} />
        </p>
        {jurisdiction.frameworks && (
          <div
            className={clsx(
              styles.panel,
              jurisdiction.frameworks.length === 1 && styles.panelSingle,
              jurisdiction.frameworks.length === 2 && styles.panelDouble
            )}
          >
            {jurisdiction.frameworks.map((framework) => (
              <FrameworkCard key={framework.name} framework={framework} />
            ))}
          </div>
        )}
      </div>
    ),
  }));

  return <PillTabs tabs={tabs} ariaLabel={regulatory.tabsAriaLabel} />;
}
