import React from "react";
import styles from "./styles.module.css";
import Divider from "@site/src/components/Layout/Divider";
import { translate } from "@docusaurus/Translate";

const weights = [
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Bold", value: 700 },
];

export default function TypographyShowcase() {
  return (
    <div>
      <Divider
        text={translate({ id: "brandAssets.typography.title", message: "Typography" })}
        id="typography"
      />

      <div className={styles.specimenBlock}>
        <div className={styles.specimenLarge}>Aa</div>
        <div className={styles.specimenAlphabet}>
          ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
        </div>
      </div>

      <div className={styles.weightGrid}>
        {weights.map((w) => (
          <div key={w.label} className={styles.weightCard}>
            <span className={styles.weightLabel}>{w.label}</span>
            <span className={styles.weightValue}>{w.value}</span>
            <p className={styles.weightSample} style={{ fontWeight: w.value }}>
              {translate({
                id: "brandAssets.typography.sample",
                message:
                  "The quick brown fox jumps over the lazy dog",
              })}
            </p>
          </div>
        ))}
      </div>

      <p className={styles.typographyNote}>
        <strong>Chivo</strong>{" "}
        {translate({
          id: "brandAssets.typography.credit",
          message: "by Omnibus-Type —",
        })}{" "}
        <a
          href="https://fonts.google.com/specimen/Chivo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Fonts
        </a>
        <br />
        <span className={styles.typographyFallback}>
          {translate({
            id: "brandAssets.typography.fallback",
            message: "Fallback: Arial, sans-serif",
          })}
        </span>
      </p>
    </div>
  );
}
