import React from "react";
import styles from "./styles.module.css";

// Layered architecture diagram for the /programmable-tokens page, built from
// HTML rather than an image so its labels stay translatable: integrations on
// top, the CIP-0113 core validator, the pluggable modules, and the
// on-chain foundations at the bottom, joined by short vertical connectors.
//
// The figure carries a text description as its accessible name; the layers
// are plain lists and the connectors are decorative.
//
// Props:
//   diagram - ARCHITECTURE.diagram from src/data/programmable-tokens.js

function ChipList({ items, className, chipClassName }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className={chipClassName}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Connector() {
  return <div className={styles.connector} aria-hidden="true" />;
}

export default function ArchitectureDiagram({ diagram }) {
  return (
    <figure className={styles.diagram} aria-label={diagram.ariaLabel}>
      <ChipList items={diagram.integrations} className={styles.row} chipClassName={styles.chip} />

      <Connector />

      <div className={styles.core}>
        <p className={styles.coreTitle}>{diagram.core.title}</p>
        <ChipList items={diagram.core.chips} className={styles.wrap} chipClassName={styles.coreChip} />
      </div>

      <Connector />

      <div className={styles.modules}>
        <p className={styles.modulesTitle}>{diagram.modules.title}</p>
        <ChipList
          items={diagram.modules.chips}
          className={styles.wrap}
          chipClassName={styles.tintChip}
        />
      </div>

      <Connector />

      <ChipList items={diagram.foundation} className={styles.row} chipClassName={styles.baseChip} />
    </figure>
  );
}
