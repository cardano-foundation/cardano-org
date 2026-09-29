import React from "react";
import { translate } from "@docusaurus/Translate";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import { summarizeDonations } from "@site/src/utils/insights/treasuryMath.mjs";
import snapshot from "@site/src/data/treasury-donations.json";
import styles from "./styles.module.css";

// Static figures from the committed snapshot, no network request.
export default function TreasuryDonations() {
  const s = summarizeDonations(snapshot);
  return (
    <section id="donations" className={styles.board}>
      <h2>{translate({ id: "governance.treasury.donations.title", message: "Returned funds and donations" })}</h2>
      <p>
        {translate({
          id: "governance.treasury.donations.intro",
          message: "Since the Conway era, a treasury donation sends ada straight back into the treasury. Most of it so far has been money returned from treasury-funded work: budget a project did not need, milestones that were not delivered, or ada left over because its price rose after the budget was approved.",
        })}
      </p>
      <div className={styles.grid}>
        <div className={styles.figure}>
          <span className={styles.value}>{formatAdaValue(s.totalAda)}</span>
          <span className={styles.label}>{translate({ id: "governance.treasury.donations.total", message: "Received in total" })}</span>
        </div>
        <div className={styles.figure}>
          <span className={styles.value}>{s.epochCount.toLocaleString()}</span>
          <span className={styles.label}>{translate({ id: "governance.treasury.donations.epochs", message: "Epochs with donations" })}</span>
        </div>
        {s.largest && (
          <div className={styles.figure}>
            <span className={styles.value}>{formatAdaValue(s.largest.ada)}</span>
            <span className={styles.label}>
              {translate({ id: "governance.treasury.donations.largest", message: "Largest in one epoch" })}
            </span>
            <span className={styles.sub}>
              {translate(
                { id: "governance.treasury.donations.largestDetail", message: "Epoch {epoch}, {share}% of the total" },
                { epoch: s.largest.epoch, share: Math.round(s.largest.sharePercent) }
              )}
            </span>
          </div>
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
