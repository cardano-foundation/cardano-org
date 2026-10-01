import React from "react";
import { translate } from "@docusaurus/Translate";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import { summarizeDonations } from "@site/src/utils/insights/treasuryMath.mjs";
import snapshot from "@site/src/data/treasury-donations.json";
import styles from "./styles.module.css";

// Static figures from the committed snapshot, no network request.
const s = summarizeDonations(snapshot);

function Figure({ value, label, children }) {
  return (
    <div className={styles.figure}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}

export default function TreasuryDonations() {
  return (
    <section id="donations" className={styles.board}>
      <h2>{translate({ id: "governance.treasury.donations.title", message: "Returned funds and donations" })}</h2>
      <p>
        {translate({
          id: "governance.treasury.donations.intro",
          message: "Projects can return unused ada from treasury-funded work through a transaction called a treasury donation. The figures below include all treasury donations, whatever their purpose.",
        })}
      </p>
      <div className={styles.grid}>
        <Figure
          value={formatAdaValue(s.totalAda)}
          label={translate({ id: "governance.treasury.donations.total", message: "Received in total" })}
        />
        <Figure
          value={s.epochCount.toLocaleString()}
          label={translate({ id: "governance.treasury.donations.epochs", message: "Epochs with donations" })}
        />
        {s.largest && (
          <Figure
            value={formatAdaValue(s.largest.ada)}
            label={translate({ id: "governance.treasury.donations.largest", message: "Highest total in a single epoch" })}
          >
            <span className={styles.sub}>
              {translate(
                { id: "governance.treasury.donations.largestDetail", message: "Epoch {epoch}, {share}% of the total" },
                { epoch: s.largest.epoch, share: Math.round(s.largest.sharePercent) }
              )}
            </span>
          </Figure>
        )}
      </div>
      {s.updatedEpoch != null && (
        <p className={styles.note}>
          {translate(
            { id: "governance.treasury.donations.updated", message: "Donations up to epoch {epoch}." },
            { epoch: s.updatedEpoch }
          )}
        </p>
      )}
      <a className="button button--primary" href="#donate">
        {translate({ id: "governance.treasury.donations.cta", message: "Donate ada" })}
      </a>
    </section>
  );
}
